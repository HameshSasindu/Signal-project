from flask import session, request, jsonify, send_from_directory
from flask_socketio import SocketIO, emit
import os
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from datetime import datetime, timezone
from sqlalchemy import or_, and_
from models import User, Chat, db
from main import create_app
from func import format_phone

crossorigin = [
	"https://cdnjs.cloudflare.com",
	"https://cdn.jsdelivr.net",
	"http://localhost:5000",
	"http://127.0.0.1:5000"
]

app = create_app()
io = SocketIO(app, cors_allowed_origins="*", manage_sessions=True)

online_users = {}
sid_to_phone = {}

@app.route("/api/all-online", methods=["GET"])
def last_seena():
	return jsonify(sid_to_phone), 200	

#socket events
def verify_socket_jwt():
	cookie = request.cookies.get("access_token_cookie")
	if not cookie:
		return None
	
	cookie_header = {'Cookie': f'access_token_cookie={cookie}'}
	try:
		with app.test_request_context(headers=cookie_header):
			verify_jwt_in_request()
			current_user = get_jwt_identity()
			return current_user
	except Exception as e:
		print(f"Authentication error: {e}")
		return None

#connect and disconnects			
@io.on("connect")
def connect():
	phone = verify_socket_jwt()
	sid = request.sid	
	
	if not phone:
		disconnect()
			
	if phone in online_users and online_users[phone] != sid:
		old_sid = online_users[phone]
		if old_sid in sid_to_phone:
			del sid_to_phone[old_sid]
			
	try:
		with app.app_context():
			user = User.query.filter_by(phone=phone).first()
			user.last_seen = None
			db.session.commit()
	except Exception as e:
		db.session.rollback()
		
	online_users[phone] = request.sid
	sid_to_phone[request.sid] = phone
	
	emit('user_online', {sid: phone}, broadcast=True)
	
@io.on("disconnect")
def disconnect():
	sid = request.sid
	
	if request.sid in sid_to_phone:
		phone = sid_to_phone[sid]
		phone = format_phone(phone)		
		del sid_to_phone[request.sid]
		
		if phone in online_users and online_users[phone] == request.sid:
			del online_users[phone]

		try:
			with app.app_context():
				user = User.query.filter_by(phone=phone).first()
				user.last_seen = datetime.now(timezone.utc)
				db.session.commit()
			
				emit('user_offline', {
					"user": phone,
					"last_seen": datetime.now(timezone.utc).isoformat()
				}, broadcast=True)
		except Exception as e:
			db.session.rollback()


#custom events
@io.on('private_message')
def send_message(data):
	sender = data.get("sender")	
	receiver = data.get("receiver")
	message = data.get("message")
	
	sender = User.query.filter_by(phone=sender).first()
	receiver = User.query.filter_by(phone=receiver).first()
		
	if sender and receiver:
		new_message = Chat(message=message, sender=sender, receiver=receiver)
		db.session.add(new_message)
		db.session.commit()
		
		receiver_sid = online_users.get(receiver.phone)
		sender_sid = online_users.get(sender.phone)
		
		if receiver_sid:
			emit('private_message', new_message.to_json(), room=receiver_sid)
		
		if sender_sid:
			emit('sync_private', new_message.to_json(), room=sender_sid)


@io.on('deliver')
def delivered_in(data):
	sender = data.get("sender")	
	receiver = data.get("receiver")
	chat_id = data.get("id")
	
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
	
			sender_sid = online_users.get(sender.phone)
			if sender_sid:
				emit("sync_delivered", {
					"sender": sender.phone,
					"receiver": receiver.phone,
					"id": chat_id,
					"delivered": chat.delivered.replace(tzinfo=timezone.utc).isoformat()
				}, room=sender_sid)
	
@io.on("read")
def reading_in(data):
	sender = data.get("sender")	
	receiver = data.get("receiver")
	chat_id = data.get("id")
		
	sender = User.query.filter_by(phone=sender).first()
	receiver = User.query.filter_by(phone=receiver).first()

	if sender and receiver:
		chat = Chat.query.filter(
			Chat.sender_id == sender.id,
			Chat.receiver_id == receiver.id,
			Chat.id == chat_id
		).first()
		if chat:
			chat.read = datetime.utcnow()
			db.session.commit()
			
			sender_sid = online_users.get(sender.phone)
			if sender_sid:
				emit("sync_read", {
					"sender": sender.phone,
					"receiver": receiver.phone,
					"id": chat_id,
					"read": chat.read.replace(tzinfo=timezone.utc).isoformat()
				}, room=sender_sid)
			
	

@io.on("delete_message")
def delete_message(data):
	user = sid_to_phone.get(request.sid)
	sender = data.get("sender")
	
	if user != sender:
		return False
	
	receiver = data.get("receiver")
	message_id = data.get("id")
	
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
			
			sender_sid = online_users.get(receiver.phone)
			if sender_sid:
				emit("sync_delete", {
					"sender": sender.phone,
					"receiver": receiver.phone,
					"id": message_id
				}, room=sender_sid)

def typing(event, data):
	sender = data.get("sender")	
	receiver = data.get("receiver")
	
	sender = User.query.filter_by(phone=sender).first()
	receiver = User.query.filter_by(phone=receiver).first()
	
	if event == "start":
		emit('typing', {"sender": sender.phone, "receiver": receiver.phone}, room=online_users.get(receiver.phone))
	elif event == "stop":
		emit('stop_typing', {"sender": sender.phone, "receiver": receiver.phone}, room=online_users.get(receiver.phone))
						
@io.on('typing')
def start_typing(data):
	typing("start", data)
	
@io.on('stop_typing')
def stop_typing(data):
	typing("stop", data)		



@app.route("/svg-icons")
def icons():
	return send_from_directory(os.getcwd(), "icons.svg")
		

if __name__ == '__main__':
	with app.app_context():
		db.create_all() 
	
	io.run(app, host='0.0.0.0', debug=True, allow_unsafe_werkzeug=True)
	#app.run(debug=True)