from flask import Flask, render_template, request, jsonify, make_response
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, set_access_cookies, unset_jwt_cookies
import phonenumbers
from phonenumbers import geocoder, PhoneNumberFormat
from datetime import datetime, timedelta, timezone
from sqlalchemy import or_, and_
app = Flask(__name__)
CORS(app, allowed_origins='*', supports_credentials=True)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

app.config['JWT_SECRET_KEY'] = 'your-secret-key'
app.config["JWT_COOKIE_SECURE"] = False
app.config["JWT_COOKIE_SAMESITE"] = "Lax"
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)

jwt = JWTManager(app)

app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

class User(db.Model):
	__tablename__ = 'users'

	id = db.Column(db.Integer, primary_key=True)
	phone = db.Column(db.String(80), unique=True, nullable=False)
	name = db.Column(db.String(64), nullable=False)
	password = db.Column(db.String(128), nullable=False)
	last_seen = db.Column(db.DateTime, nullable=True)
	bio = db.Column(db.String(128), nullable=True, default="Hey there! I'm using Signal!")
	
	def __repr__(self):
		return f'<User {self.phone}>'

class Chat(db.Model):
	__tablename__ = "chats"
	
	id = db.Column(db.Integer, primary_key=True)
	message = db.Column(db.Text)
	timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
	
	delivered = db.Column(db.DateTime, nullable=True)
	read = db.Column(db.DateTime, nullable=True)

	sender_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	receiver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    	
	sender = db.relationship('User', foreign_keys=[sender_id], backref='sent_messages')
	receiver = db.relationship('User', foreign_keys=[receiver_id], backref='received_messages')
    
	def __repr__(self):
		return f"<Chat(message='{self.message[:20]}...', timestamp='{self.timestamp}', sender_id='{self.sender_id}', receiver_id='{self.receiver_id}'>"

online_users = {}

def format_phone(phone, code="LK"):	
	try:
		parsed = phonenumbers.parse(phone, code)
		formatted = phonenumbers.format_number(parsed, PhoneNumberFormat.INTERNATIONAL)
		return formatted
	except phonenumbers.phonenumberutil.NumberParseException:
		return None

@app.route('/')
def index():
	return render_template('index.html')
	
@socketio.on('connect')
def connec():
	print("user connected")

@socketio.on('online')
def connect(data):
	phone = data["phone"]
	online_users[phone] = request.sid
	emit('online_users', online_users, broadcast=True)
	
@socketio.on('disconnect')
def disconnect():
	for phone, sid in list(online_users.items()):
		if request.sid == sid:
			del online_users[phone]			
			break
	emit('online_users', list(online_users.keys()), broadcast=True)

@socketio.on('load_messages')
def send_message(data):
	sender = data["sender"]
	
	sender = User.query.filter_by(phone=sender).first()
	
	if sender:
		chats = Chat.query.filter(
			or_(Chat.sender == sender, Chat.receiver == sender)
		).order_by(Chat.timestamp).all()
		
		messages = [
			{"sender": chat.sender.phone,
			"receiver": chat.receiver.phone,
			"message": chat.message,
			"timestamp": chat.timestamp.replace(tzinfo=timezone.utc).isoformat()} 
		for chat in chats]
		emit("load_messages", messages, room=online_users.get(sender))



@socketio.on('private_message')
def send_message(data):
	sender = data["sender"]
	receiver = data["receiver"]
	message = data["message"]
	
	sender = User.query.filter_by(phone=sender).first()
	receiver = User.query.filter_by(phone=receiver).first()
		
	if sender and receiver:
		chat_message = Chat(message=message, sender=sender, receiver=receiver)
		db.session.add(chat_message)
		db.session.commit()
		
		receiver_sid = online_users.get(receiver.phone)
		if receiver_sid:
			emit('private_message', {'sender': sender.phone, 'message': message, "timestamp": chat_message.timestamp.isoformat(), "message_id": chat_message.id }, room=receiver_sid)

@socketio.on('private_messages')
def get_private_messages(sender, receiver):
	sender = format_phone(sender)
	receiver = format_phone(receiver)
	
	sender = User.query.filter_by(phone=sender).first()
	receiver = User.query.filter_by(phone=receiver).first()
	
	if not receiver:
		emit("error", {"error": "User not found"}, room=online_users.get(sender.phone))
	
	if sender and receiver:
		chats = Chat.query.filter(
			or_(and_(Chat.sender == sender, Chat.receiver == receiver),
				and_(Chat.sender == receiver, Chat.receiver == sender))).order_by(Chat.timestamp).all()
  
		messages = [
			{"id": chat.id,
			"sender": chat.sender.phone,
			"receiver": chat.receiver.phone,
			"message": chat.message,
			"timestamp": chat.timestamp.replace(tzinfo=timezone.utc).isoformat(),
			"delivered": None if chat.delivered is None else chat.delivered.replace(tzinfo=timezone.utc).isoformat(),
			"read": None if chat.read is None else chat.read.replace(tzinfo=timezone.utc).isoformat()} 
		for chat in chats]
		emit("private_messages", messages)

@socketio.on('all_messages')
def received(phone):
	user = format_phone(phone)
	user = User.query.filter_by(phone=user).first()
	
	if user:
		chats = Chat.query.filter(
			or_( Chat.receiver_id == user.id, Chat.sender_id == user.id )).all()
		
		messages = [
			{"id": chat.id,
			"sender": chat.sender.phone,
			"receiver": chat.receiver.phone,
			"message": chat.message,
			"timestamp": chat.timestamp.replace(tzinfo=timezone.utc).isoformat(),
			"delivered": None if chat.delivered is None else chat.delivered.replace(tzinfo=timezone.utc).isoformat(),
			"read": None if chat.read is None else chat.read.replace(tzinfo=timezone.utc).isoformat()} 
		for chat in chats]
		
		emit("all_messages", messages, room=online_users.get(user.phone))
			


@socketio.on('delivering')
def delivered_in(data):
	sender = data["sender"]
	receiver = data["receiver"]
	chat_id = data["id"]
	
	sender = User.query.filter_by(phone=sender).first()
	receiver = User.query.filter_by(phone=receiver).first()

	if sender and receiver:
		chat = Chat.query.filter(
			Chat.sender_id == sender.id,
			Chat.receiver_id == receiver.id,
			Chat.id == chat_id
		).first()
		if chat:
			chat.delivered = datetime.utcnow()
			db.session.commit()
			
	emit("sync_delivered", {
		"sender": sender.phone,
		"receiver": receiver.phone,
		"message_id": chat_id
	}, room=online_users.get(receiver.phone))

@socketio.on("reading")
def reading_in(data):
	sender = User.query.filter_by(phone=sender).first()
	receiver = User.query.filter_by(phone=receiver).first()

	if sender and receiver:
		chat = Chat.query.filter(
			Chat.sender_id == sender.id,
			Chat.receiver_id == receiver.id,
			Chat.id == message_id
		).first()
		if chat:
			chat.read = datetime.utcnow()
			db.session.commit()
			
	emit("sync_read", {
		"sender": sender.phone,
		"receiver": receiver.phone,
		"message_id": chat_id
	}, room=online_users.get(receiver.phone))

	

@socketio.on("delete_message")
def delete_message(data):
	sender = data["sender"]
	receiver = data["receiver"]
	message_id = data["id"]
	
	sender = User.query.filter_by(phone=sender).first()
	receiver = User.query.filter_by(phone=receiver).first()
	
	if sender and receiver:
		chat_deletion = Chat.query.filter(
			Chat.sender_id == sender.id,
			Chat.receiver_id == receiver.id,
			Chat.id == message_id
		).first()
		
		if chat_deletion:
			db.session.delete(chat_deletion)
			db.session.commit()
			
	emit("sync_delete", {
		"sender": sender.phone,
		"receiver": receiver.phone,
		"message_id": message_id
	}, room=online_users.get(receiver.phone))

def typing(event, data):
	sender = data["sender"]
	receiver = data["receiver"]
	
	sender = User.query.filter_by(phone=sender).first()
	receiver = User.query.filter_by(phone=receiver).first()
	
	if event == "start":
		emit('typing', {"sender": sender.phone, "receiver": receiver.phone}, room=online_users.get(receiver.phone))
	elif event == "stop":
		emit('stop_typing', {"sender": sender.phone, "receiver": receiver.phone}, room=online_users.get(receiver.phone))
						
@socketio.on('typing')
def start_typing(data):
	typing("start", data)
	
@socketio.on('stop_typing')
def stop_typing(data):
	typing("stop", data)		
					

def check_if_user_exists(phone):
	with app.app_context():
		try:
			return User.query.filter_by(phone=phone).first()
		except Exception as e:
			return None
			
@app.route("/check_user/<phone>", methods=["POST"])
def check_phone(phone):
	user = check_if_user_exists(format_phone(phone))
	if user:
		return jsonify({"response": "User is already exists"}), 404
	else:
		return jsonify({"response": False}), 200

def create_user(phone, name, password):
	session = db.session
	phone = format_phone(phone)
	try:
		with app.app_context():
			new_user = User(phone=phone, name=name, password=password)
			session.add(new_user)
			session.commit()
			return True
		
	except Exception as e:
		session.rollback()
		print(e)
		return False	
		
	finally:
		session.close()
		
		
def fetch_user(phone):	
	try:
		phone = format_phone(phone)
		user = User.query.filter_by(phone=phone).first()
		return user
	except Exception as e:
		print(e)
		return None
	
@app.route("/create/user", methods=["POST"])
def register():
	data = request.get_json()
	
	name = data["credentials"]["name"]
	phone =  data["credentials"]["phone"]
	password = data["credentials"]["password"]
		
	user_creation = create_user(phone, name, password)
	if user_creation:
		return jsonify({"message": "User created"}), 201
	return jsonify({"error": f"Error: {e}"}), 500

@app.route("/login/user", methods=["POST"])
def login():
	data = request.get_json()
	
	phone = format_phone(data["credentials"]["phone"])
	password = data["credentials"]["password"]
	
	if not phone or not password:
		return jsonify({"error": "missing credentials"}), 403
	
	user = fetch_user(phone)
	if not user:
		return jsonify({"error": "User doesn't exist"}), 404
	
	if password != user.password:
		return jsonify({"error": "Incorrect password"}), 400
	
	token = create_access_token(identity=phone)
	response = make_response({"message": "Login successful"})
	set_access_cookies(response, token)
	return response, 200

@app.route("/user/info", methods=["GET"])
@jwt_required()
def user_info():
	current_user = get_jwt_identity()
	user = fetch_user(current_user)	
	if user:
		return jsonify({"loggedIn": True, "username": user.name, "phone": current_user}), 200
	else:
		return jsonify({"loggedIn": False}), 401
		
@app.route('/logout', methods=['GET'])
@jwt_required()
def logout():
	response = jsonify({"msg": "logout successful"})
	unset_jwt_cookies(response)
	return response, 200	

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
	return render_template('index.html')
	
@app.route("/admin")
def admin():
	return admin

		
@app.route("/api/users")
def all_users():
	with app.app_context():
		Users = User.query.all()
		users = [
			{"name": user.name,
			"phone": user.phone} 
		for user in Users]
		
		return jsonify(users), 200
	
def users():
	with app.app_context():
		users = User.query.all()
		user_list = [str(user) for user in users]
		print(user_list)

def msgs():
	with app.app_context():
		chats = Chat.query.all()	
		messages = [
				{"id": chat.id,
				"sender": chat.sender.phone,
				"receiver": chat.receiver.phone,
				"message": chat.message,
				"timestamp": chat.timestamp.replace(tzinfo=timezone.utc).isoformat()} 
			for chat in chats]
		print(messages)

def kk():
	import random
	i = 0
	while i < 100:
		i = i + 1
		phone = f'07{random.randint(10000000, 99999999)}'
		name = f'user_{phone}'
		password = "1111"
		user_creation = create_user(phone, name, password)
		
		
		
if __name__ == '__main__':
	with app.app_context():
		db.create_all() 
	socketio.run(app, host='0.0.0.0', debug=True, allow_unsafe_werkzeug=True)
