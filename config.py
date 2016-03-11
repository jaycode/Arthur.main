# Define the application directory
import os, sys, inspect
BASE_DIR = os.path.realpath(
    os.path.abspath(
        os.path.join(
            os.path.split(
                inspect.getfile(
                    inspect.currentframe()
                )
            )[0]
        )
    )
)

# Define the database
MONGO_HOST = '192.168.56.1'
MONGO_PORT = 27017
MONGO_DBNAME = 'arthur'
MONGO_USERNAME = 'arthur_main'
MONGO_PASSWORD = 'iojF213;!'

# Application threads. A common general assumption is
# using 2 per available processor cores - to handle
# incoming requests using one and performing background
# operations using the other.
# THREADS_PER_PAGE = 2

# Enable protection agains *Cross-site Request Forgery (CSRF)*
CSRF_ENABLED     = True

# Use a secure, unique and absolutely secret key for
# signing the data. 
CSRF_SESSION_KEY = "dojq029j1lk"

# Secret key for signing cookies
SECRET_KEY = "ln129ej1-kl"

# Redis server setup - used for sessions
REDIS_HOST = '192.168.99.100'
REDIS_PORT = 6379