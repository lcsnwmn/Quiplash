import cherrypy
import re, json

@cherrypy.expose
class QuiplashWebService(object):
    exposed = True

    @cherrypy.tools.accept(media='text/plain')
    
    def __init__(self,DB):
        self.db = DB
        self.dict = {"gamestate" : "lobby"}

    def GS_GET(self):
        return self.dict['gamestate']

    def POST(self):
        some_string = 'Initial'
        self.dict['gamestate'] = some_string
        return some_string

    def GS_PUT(self):
        data = cherrypy.request.body.read()
        self.dict['gamestate'] = str(data)

    def DELETE(self):
        self.dict.pop('gamestate', None)

class Options:
    def OPTIONS(self, *args, **kwargs):
        return ""

def CORS():
    cherrypy.response.headers["Access-Control-Allow-Origin"] = "*"
    cherrypy.response.headers["Access-Control-Allow-Methods"] = "GET, PUT, POST, DELETE, OPTIONS"
    cherrypy.response.headers["Access-Control-Allow-Credentials"] = "true"

def start_service():
    DB = ""
    quiplash = QuiplashWebService(DB)
    optionsController = Options()
    dispatcher = cherrypy.dispatch.RoutesDispatcher()

    dispatcher.connect('gamestate_get', '/gamestate',controller=quiplash,action = 'GS_GET',conditions=dict(method=['GET']))
    dispatcher.connect('gamestate_put','/gamestate',controller=quiplash,action = 'GS_PUT',conditions=dict(method=['PUT']))

    dispatcher.connect('options_gamestate', '/gamestate', controller=optionsController, action = 'OPTIONS', conditions=dict(method=['OPTIONS']))
    #dispatcher.connect('options_users', '/users', controller=optionsController, action = 'OPTIONS', conditions=dict(method=['OPTIONS']))
    #dispatcher.connect('options_questions', '/questions', controller=optionsController, action = 'OPTIONS', conditions=dict(method=['OPTIONS']))

    conf = {'global': {'server.socket_host': '127.0.0.1', 'server.socket_port': 8080},'/' : {'request.dispatch':dispatcher,'tools.CORS.on':True,}}

    #Update configuration and start the server
    cherrypy.config.update(conf)
    app = cherrypy.tree.mount(None, config=conf)
    cherrypy.quickstart(app)

if __name__ == '__main__':
    cherrypy.tools.CORS = cherrypy.Tool('before_finalize', CORS)
    start_service()