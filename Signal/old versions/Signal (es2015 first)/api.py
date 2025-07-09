from flask import Blueprint, jsonify
from models import User, Chat
from flask_jwt_extended import jwt_required, get_jwt_identity
from func import format_phone
from sqlalchemy import or_, and_
from datetime import timezone

api = Blueprint("api", __name__)

@api.route('/api/all-messages', methods=["GET"])
@jwt_required()
def all_messages():
	phone = get_jwt_identity()
	user = format_phone(phone)
	user = User.query.filter_by(phone=user).first()
	
	if user:
		chats = Chat.query.filter(
			or_( Chat.receiver_id == user.id, Chat.sender_id == user.id )).all()
		
		messages = [chat.to_json() for chat in chats]
		
		return jsonify(messages), 200
	else:
		return jsonify({"error": "Access denied!"}), 403 
		
@api.route("/api/check/<phone>", methods=["POST"])
def check_phone(phone):
	user = User.fetch_user(format_phone(phone))
	if user:
		return jsonify({"message": "User already exists"}), 401
	else:
		return jsonify({"message": False}), 200


		
@api.route("/api/online/<phone>", methods=["GET"])
@jwt_required()
def last_seen(phone):
	iden = get_jwt_identity()
	user = User.query.filter_by(phone=phone).first()
	return jsonify({"time": None if user.last_seen is None else  user.last_seen.replace(tzinfo=timezone.utc).isoformat()}), 200



@api.route("/api/users")
def all_users():
	with app.app_context():
		Users = User.query.all()
		users = [
			{"name": user.name,
			"phone": user.phone} 
		for user in Users]
		
		return jsonify(users), 200

@api.route("/api/settings", methods=["GET"])
@jwt_required()
def setting():
	phone = get_jwt_identity()
	user = User.query.filter_by(phone=phone).first()
	if user:
		return user.to_json()

ALLOWED_KEYS = {"name", "bio"}

@api.route("/api/settings", methods=["PATCH"])
@jwt_required()
def update():
	phone = get_jwt_identity()
	user = User.query.filter_by(phone=phone).first()
	
	data = request.get_json()
	if not data:
		return jsonify({"error": "Request body must be JSON"}), 400

	key = data.get('key')
	value = data.get('value')
	
	if key is None:
		return jsonify({"error": "Missing 'key' in request body"}), 400
		
	
	if key not in ALLOWED_KEYS:
		return jsonify({"error": "Invalid key"}), 422
	
	try:
		if hasattr(user, key):
			setattr(user, key, value)		
			db.session.commit()
			return jsonify({"message": "Updated!"}), 200
	except Exception as e:
		print(e)
		db.session.rollback()
		return jsonify({"error": "An internal error occurred"}), 500
	
	
	
