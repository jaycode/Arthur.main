import tornado.ioloop
import tornado.web
import sockjs.tornado
from app_workspace import app

if __name__ == '__main__':
    app.listen(49152)
    tornado.ioloop.IOLoop.instance().start()
