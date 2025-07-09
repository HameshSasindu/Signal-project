from flask import Blueprint, jsonify, request, make_response
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, set_access_cookies, unset_jwt_cookies
from models import db, User
from func import format_phone

auth = Blueprint("auth", __name__)

@auth.route("/register", methods=["POST"])
def register():
	data = request.get_json()
	form = RegistrationForm.from_json(data)
	
	name = data.get("name")
	phone =  data.get("phone")
	password = data.get("password")	

	phone = format_phone(phone)
	if not phone:
		return jsonify({"error": "Missing or wrong phone"}), 400
		
	if User.fetch_user(phone):
		return jsonify({"error": "User already exists"}), 401
	
	if form.validate():
		try:
			new_user = User(
				phone=phone,
				name=name,
				password=password
			)
			db.session.add(new_user)
			db.session.commit()
			return jsonify({"message": "User created"}), 201
			
		except Exception as e:
			db.session.rollback()
			print(e)
			return jsonify({"error":"Internal server error"}), 500
	else:
		return jsonify({'errors': form.errors}), 400
		

@auth.route("/login", methods=["POST"])
def login():
	data = request.get_json()
	
	phone = format_phone(data.get("phone"))
	password = data.get("password")
	
	if not phone or not password:
		return jsonify({"error": "missing credentials"}), 400
	
	user = User.fetch_user(phone)
	if not user:
		return jsonify({"error": "User doesn't exist"}), 404
	
	if password != user.password:
		return jsonify({"error": "Incorrect password"}), 400
	
	token = create_access_token(identity=phone)
	response = make_response(jsonify({
			"isAuthenticated": True,
			"name": user.name,
			"phone": phone,
			"bio": user.bio}))
	set_access_cookies(response, token)
	return response, 200

@auth.route("/authenticate", methods=["GET"])
@jwt_required()
def user_info():
	current_user = get_jwt_identity()
	user = User.fetch_user(current_user)	
	if user:
		return jsonify({
			"isAuthenticated": True,
			"name": user.name,
			"phone": current_user,
			"bio": user.bio}), 200
	return jsonify({"isAuthenticated": False}), 401
		
@auth.route('/logout', methods=['GET', 'DELETE'])
@jwt_required()
def logout():
	response = jsonify({"msg": "logout successful"})
	unset_jwt_cookies(response)
	return response, 200	