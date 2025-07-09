	
#debugging	
def users():
	with app.app_context():
		users = User.query.all()
		user_list = [str(user) for user in users]
		print(user_list)

def msgs():
	with app.app_context():
		chats = Chat.query.all()	
		messages =[chat.to_json() for chat in chats]
		print(messages)

def delete_message(id):
	with app.app_context():
		chat = Chat.query.filter_by(id=id).first()
		db.session.delete(chat)
		db.session.commit()
		print("deleted ", id)
