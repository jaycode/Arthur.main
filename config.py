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
MONGO_HOST = 'ds053894.mlab.com'
MONGO_PORT = 53894
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
REDIS_HOST = 'pub-redis-10372.us-east-1-2.4.ec2.garantiadata.com'
REDIS_PORT = 10372
REDIS_PASSWORD = 'iojF213;!'