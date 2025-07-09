from flask import Flask, render_template
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta
from authentication import auth
from api import api
from models import db

def create_app():
	app = Flask("Signal", instance_relative_config=True)
	app.config['SECRET_KEY'] = 'secret!'
	
	CORS(app, allowed_origins='*', supports_credentials=True)
	
	app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
	app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
	db.init_app(app)
	
	app.config['JWT_SECRET_KEY'] = 'your-secret-key'
	app.config["JWT_COOKIE_SECURE"] = False
	app.config["JWT_COOKIE_SAMESITE"] = "Lax"
	app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
	app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)
	jwt = JWTManager(app)
	
	app.register_blueprint(auth)
	app.register_blueprint(api)
		
	@app.route('/', defaults={'path': ''})
	@app.route('/<path:path>')
	def catch_all(path):
		return render_template('index.html')
		
	return app
	
	