class _quiplash_api:
	def __init__(self):
		self.players = {}
		self.gamestate = "Null"
		self.questions = {}

	def load_questions(db, questions):
		pass

	def get_question(db, qid):
		pass

	def set_user(db, name):
		pass

	def get_answer(db, qid, uid):
		pass

	def get_gamestate(db):
		if db.gamestate != "Null":
			return self.db.gamestate
		else:
			return "Error - game has not started."

	def set_gamestate(db, state):
		db.gamestate = state

	def get_score(db, uid):
		pass

	def set_score(db, uid):
		pass

	def get_num_users(db):
		pass

	def set_questions(db):
		pass

if __name__ == "__main__":
	db = _quiplash_api()
	db.load_questions("questions")



