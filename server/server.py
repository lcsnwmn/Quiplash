from _quiplash_api import _quiplash_api
import cherrypy
import re, json

class Gamestate(object)

    def __init__(self,DB):
        self.db = DB

    #GET for /gamestate
    def GET(self):
        output = {'result':'success'}
        state = self.db.get_gamestate()
        if state is None:
            output['result'] = 'error'
            output['message'] = 'key not found'
        else:
            output['gamestate'] = state

        return json.dumps(output)

    #PUT for /gamestate
    def PUT(self, state):

        output = {'result':'success'}
        data = json.loads(cherrypy.request.body.read())
        try:
            info = []
            info.append(data['gamestate'])
            self.db.set_gamestate(info)
        except Exception as ex:
            output['result'] = str(ex)
        return json.dumps(output)

class Players(object):

    def __init__(self,DB):
        self.db = DB

class Questions(objects):

    def __init__(self,DB):
        self.db = DB

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

    dispatcher.connect('gamestate_get', '/gamestate',controller=gamestate,action = 'GET',conditions=dict(method=['GET']))
    dispatcher.connect('gamestate_put','/gamestate',controller=gamestate,action = 'PUT',conditions=dict(method=['PUT']))

    dispatcher.connect('options_gamestate', '/gamestate', controller=optionsController, action = 'OPTIONS', conditions=dict(method=['OPTIONS']))
    dispatcher.connect('options_users', '/users', controller=optionsController, action = 'OPTIONS', conditions=dict(method=['OPTIONS']))
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
