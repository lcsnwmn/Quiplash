import random

class _quiplash_api:
    def __init__(self):
        self.players = {}
        self.gamestate = "Null"
        self.questions = {}

    def load_questions(db, q_file):
        ind = 1
        f = open(q_file, "r")
        for i, l in enumerate(f):
            pass

        questions = random.sample(range(1, i+1), 4)

        for i, question in enumerate(f):
            if i in questions:
                self.questions[str(ind)] = {"prompt" : question,
                                            str(ind % 4) : "",
                                            str((ind - 1) % 4) : "" 
                                            }
                ind = ind + 1

    def get_question(db, qid):
        return db.questions[str(qid)]["prompt"]

    def get_num_users(db):
        return len(db.players)

    def set_user(db, name):
        num_users = get_num_users() + 1
        if num_users <= 4:
            players[str(num_users)] = {
                "name"  : name,
                "score" : 0,
                "qid"   : [num_users % 4, (num_users+1) % 4]
            }

    def get_answer(db, qid, uid):
        return db.questions[str(qid)][str(uid)]

    def set_answer(db, qid, uid, answer):
        db.questions[str(qid)][str(uid)] = answer

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



