import random

class _quiplash_api:
    def __init__(self):
        self.players = {}
        self.gamestate = "Null"
        self.question = 0
        self.questions = {}

    def set_quest(db, number):
        db.question = number

    def get_quest(db):
        return db.question

    def load_questions(db, q_file):
        ind = 1
        f = open(q_file, "r")
        counter = 0
        for i, l in enumerate(f):
            counter = counter + 1

	#print "counter" + str(counter)
        questions = random.sample(range(1, counter+1), 4)

	f2 = open(q_file, "r")
        for i, question in enumerate(f2):
	    print i
            print questions
            if (i+1) in questions:
                db.questions[str(ind)] = {"prompt" : question,
                                          "answers": { str((ind % 4)+1) : "",
                                                       str(((ind - 1) % 4)+1) : "" 
                                                     }
                                         }
                ind = ind + 1

    def get_question(db, qid):
        return db.questions[str(qid)]["prompt"]

    def get_num_users(db):
        return len(db.players)

    def set_user(db, name):
        num_users = db.get_num_users() + 1
        if num_users <= 4:
            db.players[str(num_users)] = {
                "name"  : name,
                "score" : 0,
                "qid"   : [num_users % 4, (num_users+1) % 4]
            }

    def get_users(db):
        num_users = db.get_num_users()
        users = []
        for user in range(num_users):
            users.append(db.players[str(user+1)]["name"])
        return users

    def get_user(db, uid):
        return db.players[str(uid)]["name"]

    def get_answer(db, qid, uid):
        print db.questions[str(qid)]["answers"]
        print str(uid)
        return db.questions[str(qid)]["answers"][str(uid)]

    def set_answer(db, qid, uid, answer):
        db.questions[str(qid)]["answers"][str(uid)] = answer

    def get_gamestate(db):
        if db.gamestate != "Null":
            return db.gamestate
        else:
            return db.gamestate
            #return "Error - game has not started."

    def set_gamestate(db, state="null"):
        db.gamestate = state

    def get_score(db, uid):
        return db.players[str(uid)]["score"]

    def set_score(db, uid, score):
        db.players[str(uid)]["score"] = score

if __name__ == "__main__":
    db = _quiplash_api()
    db.load_questions("questions.txt")



