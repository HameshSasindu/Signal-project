from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone
from func import format_phone 

db = SQLAlchemy()

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
	
	@staticmethod
	def fetch_user(phone):	
		try:
			phone = format_phone(phone)
			user = User.query.filter_by(phone=phone).first()
			return user
		except Exception as e:
			print(e)
			return None
	
	def to_json(self):
		return {
			"id": self.id,
			"name": self.name,
			"phone": self.phone,
			"bio": self.bio
		}
		
		
		
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
	receiver = db.relationship('User', foreign_keys=[receiver_id], backref='received_messages', lazy=True)
    
	def __repr__(self):
		return f"<Chat(message='{self.message[:20]}...', timestamp='{self.timestamp}', sender_id='{self.sender_id}', receiver_id='{self.receiver_id}'>"
		
	def to_json(self):	
		return {
			"id": self.id,
			"sender": self.sender.phone,
			"receiver": self.receiver.phone,
			"message": self.message,
			"timestamp": self.timestamp.replace(tzinfo=timezone.utc).isoformat(),
			"delivered": None if self.delivered is None else self.delivered.replace(tzinfo=timezone.utc).isoformat(),
			"read": None if self.read is None else self.read.replace(tzinfo=timezone.utc).isoformat()
		}

class UserSettings:
	__tablename__ = "settings"
	
	user = db.Column(db.Integer, db.ForeignKey('users.id'))
	last_seen_visibility = db.Column(db.Boolean, default=True)
	read_receipts = db.Column(db.Boolean, default=True)
	online_visibility = db.Column(db.Boolean, default=True)
	disappearing_messages = db.Column(db.Boolean, default=False)