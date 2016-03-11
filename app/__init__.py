"""
Loads useful modules for Arthur app. Add new modules' blueprints into this
script to make them visible for web access.

Use the following to import database connection:
```
from app import mongo
```
Then `mongo.db` can be used to do database operations.

Note that import can only be done from web application. For standalone scripts, 
`current_app` needs to be used. See `dev/install.py` script for example on how
this is done.
"""

# Import flask and template operators.
from flask import Flask, render_template
from flask.ext.pymongo import PyMongo
from jinja2 import TemplateNotFound
from redis import Redis
from libs.redis_session.for_flask import RedisSessionInterface

# Define the WSGI application object.
app = Flask(__name__)

# Configurations
app.config.from_object('config')

# Session
redis = Redis(host=self.config['REDIS_HOST'], port=self.config['REDIS_PORT'], password=self.config['REDIS_PASSWORD'])
app.session_interface = RedisSessionInterface(redis)

# Define the connection object which is imported
# by modules and controllers. Database object can be
# accessed by using `mongo.db`.
mongo = PyMongo(app)

@app.errorhandler(404)
def not_found(error):
    """Not found route.
    """
    return render_template('404.html'), 404

# Import modules' blueprints.
from app.mod_main.controllers import mod_main
# from app.mod_cmd.controllers import mod_cmd

# Register blueprint(s).
app.register_blueprint(mod_main)