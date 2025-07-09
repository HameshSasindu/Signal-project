from flask import Blueprint, jsonify, request, make_response
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, set_access_cookies, unset_jwt_cookies
from models import User
from func import format_phone

auth = Blueprint("auth", __name__)

@auth.route("/create/user", methods=["POST"])
def register():
	data = request.get_json()
	name = data["credentials"]["name"]
	phone =  data["credentials"]["phone"]
	password = data["credentials"]["password"]	
	session = db.session
	phone = format_phone(phone)
	
	try:
		with app.app_context():
			new_user = User(phone=phone, name=name, password=password)
			session.add(new_user)
			session.commit()
			return jsonify({"message": "User created"}), 201
		
	except Exception as e:
		session.rollback()
		print(e)
		return jsonify({"error": f"Error: {e}"}), 500

		
	

@auth.route("/login/user", methods=["POST"])
def login():
	data = request.get_json()
	
	phone = format_phone(data["credentials"]["phone"])
	password = data["credentials"]["password"]
	
	if not phone or not password:
		return jsonify({"error": "missing credentials"}), 403
	
	user = User.fetch_user(phone)
	if not user:
		return jsonify({"error": "User doesn't exist"}), 404
	
	if password != user.password:
		return jsonify({"error": "Incorrect password"}), 400
	
	token = create_access_token(identity=phone)
	response = make_response({"message": "Login successful"})
	set_access_cookies(response, token)
	return response, 200

@auth.route("/user/info", methods=["GET"])
@jwt_required()
def user_info():
	current_user = get_jwt_identity()
	user = User.fetch_user(current_user)	
	if user:
		return jsonify({"loggedIn": True, "username": user.name, "phone": current_user, "bio": user.bio}), 200
	else:
		return jsonify({"loggedIn": False}), 401
		
@auth.route('/logout', methods=['GET', 'DELETE'])
@jwt_required()
def logout():
	response = jsonify({"msg": "logout successful"})
	unset_jwt_cookies(response)
	return response, 200	