from _quiplash_api import _quiplash_api
import cherrypy
import re, json

class Gamestate(object):

    def __init__(self,DB):
        self.db = DB

    #GET for /gamestate
    def GET(self):
        output = {'result':'success'}
        options = ["lobby", "prompts", "answers", "tally"]
        state = self.db.get_gamestate()
        if state not in options:
            print state
            output['result'] = 'lobby'
        else:
            output['result'] = state

        return json.dumps(output)

    #PUT for /gamestate
    def PUT(self):

        output = {'result':'success'}
        data = json.loads(cherrypy.request.body.read())
        try:
            output = self.db.set_gamestate(data)
        except Exception as ex:
            output['result'] = str(ex)
        return json.dumps(output)

class Players(object):

    def __init__(self,DB):
        self.db = DB

    # Get Player Names at /players
    def GET(self):
        output = {'result':'success'}
        users = self.db.get_users()
        if len(users) == 0:
            output['result'] = "Error: No users"
            return json.dumps(output)
        else:
            for i, user in enumerate(users):
                output[str(i)] = user
        return json.dumps(output)

    #PUT for /players/:id
    def PUT(self, id=0):
        output = {'result':'success'}
        name = json.loads(cherrypy.request.body.read())
        try:
            output = self.db.set_user(name)
        except Exception as ex:
            output['result'] = str(ex)
        return json.dumps(output)

    #GET for /players/:uid/score
    def GET_SCORE(self, uid=0):
        output = {'result':'success'}
        score = self.db.get_score(uid)
        output["score"] = score
        return json.dumps(output)

    #PUT for /players/:uid/score
    def PUT_SCORE(self, uid=0):
        output = {'result':'success'}
        score = json.loads(cherrypy.request.body.read())
        try:
            output = self.db.set_score(uid, score)
        except Exception as ex:
            output['result'] = str(ex)
        return json.dumps(output)
        

class Questions(object):

    def __init__(self,DB):
        self.db = DB
        DB.load_questions("questions.txt")

    # Get Question /question/{questionID}
    def GET(self, qid=0):
        output = {'result':'success'}
        try:
            question = self.db.get_question(qid)
            output['id'] = qid
            output['question'] = question
        except Exception as ex:
            output['result'] = "Error: question not found"
            return json.dumps(output)

    def GET_ANSWER(self, qid=0, uid=0):
        output = {'result':'success'}
        try:
            answer = self.db.get_answer(qid,uid)
            output["answer"] = answer
            return json.dumps(output)
        except Exception as ex:
            output['result'] = ex
            return json.dumps(output)

    # Put Answer /question/{questionID}/answers/{uID}
    def PUT_ANSWER(self, qid=0, uid=0):
        output = {'result':'success'}
        answer = json.loads(cherrypy.request.body.read())
        try:
            output = self.db.set_answer(qid, uid, answer)
        except Exception as ex:
            output['result'] = str(ex)
        return json.dumps(output)


class Options:
    def OPTIONS(self, *args, **kwargs):
        return ""

def CORS():
    cherrypy.response.headers["Access-Control-Allow-Origin"] = "*"
    cherrypy.response.headers["Access-Control-Allow-Methods"] = "GET, PUT, POST, DELETE, OPTIONS"
    cherrypy.response.headers["Access-Control-Allow-Credentials"] = "true"

def start_service():

    DB = _quiplash_api()
    players = Players(DB)
    questions = Questions(DB)
    gamestate = Gamestate(DB)
    optionsController = Options()
    dispatcher = cherrypy.dispatch.RoutesDispatcher()

    # Gamestate
    dispatcher.connect('gamestate_get', '/gamestate',controller=gamestate,action = 'GET',conditions=dict(method=['GET']))
    dispatcher.connect('gamestate_put','/gamestate',controller=gamestate,action = 'PUT',conditions=dict(method=['PUT']))

    # Players
    dispatcher.connect('players_get', '/players',controller=players,action = 'GET',conditions=dict(method=['GET']))
    dispatcher.connect('players_put','/players/:id',controller=players,action = 'PUT',conditions=dict(method=['PUT']))
    dispatcher.connect('score_get', '/players/:uid/score',controller=players,action = 'GET_SCORE',conditions=dict(method=['GET']))
    dispatcher.connect('score_put','/players/:uid/score',controller=players,action = 'PUT_SCORE',conditions=dict(method=['PUT']))

    # Questions
    dispatcher.connect('questions_get', '/questions/:qid',controller=questions,action = 'GET',conditions=dict(method=['GET']))
    dispatcher.connect('answer_get', '/questions/:qid/answers/:uid',controller=questions,action = 'GET_ANSWER',conditions=dict(method=['GET']))
    dispatcher.connect('answer_put','/questions/:qid/answers/:uid',controller=questions,action = 'PUT_ANSWER',conditions=dict(method=['PUT']))


    dispatcher.connect('options_gamestate', '/gamestate', controller=optionsController, action = 'OPTIONS', conditions=dict(method=['OPTIONS']))
    dispatcher.connect('options_players', '/players', controller=optionsController, action = 'OPTIONS', conditions=dict(method=['OPTIONS']))
    dispatcher.connect('options_questions', '/questions', controller=optionsController, action = 'OPTIONS', conditions=dict(method=['OPTIONS']))

    conf = {'global': {'server.socket_host':      'student01.cse.nd.edu', 
                       'server.socket_port':      9898},
                       '/' : {'request.dispatch': dispatcher,
                              'tools.CORS.on':    True,}}

    #Update configuration and start the server
    cherrypy.config.update(conf)
    app = cherrypy.tree.mount(None, config=conf)
    cherrypy.quickstart(app)

if __name__ == '__main__':
    cherrypy.tools.CORS = cherrypy.Tool('before_finalize', CORS)
    start_service()
