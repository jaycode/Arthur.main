"""Installation Script

Creates db collections and other routines needed to setup the app.
"""
import os, sys, inspect
# This needs to be included here to ensure path loaded from file dir.
base_path = os.path.realpath(
    os.path.abspath(
        os.path.join(
            os.path.split(
                inspect.getfile(
                    inspect.currentframe()
                )
            )[0],
            '..'
        )
    )
)
sys.path.append(base_path)

from flask import Flask, current_app
from flask.ext.pymongo import PyMongo
from bson.objectid import ObjectId
from datetime import datetime
import pymongo
import pdb

app = Flask(__name__)

def run_installer():
    setup_database()

def setup_database():
    """
    Collections and their indexes:

    users: [{
        _id: ObjectId,
        username: string,
        projects: [
            {
                _id: ObjectId,
                name: string,
                context_id: ObjectId,
                last_modified: datetime,
                last_modified_by: ObjectId (user id),
                docs: [
                    {
                        _id: ObjectId,
                        name: string,
                        last_modified: datetime,
                        num_data_fields: int # Number of data fields. Keep it here for doc listing page.
                    },
                    ...
                ],
            },
            ...
        ]
    }, ...]

    data_fields: [
        {
            _id: ObjectId,
            project_id: ObjectId,
            doc_id: ObjectId,
            page: int,
            x: float,
            x1: float,
            y: float,
            y1: float,
            text: string,
            is_value: bool,
            ...
            ## Features ##
            ## Labels ##
        }, ...
    ],

    contexts: [{
        _id: ObjectId,
        user_id: ObjectId,
        name: string,
        concepts: [
            {
                _id: ObjectId,
                name: string,
                hints: [string],
                values: [string],
                value_regex: [string],
                from_docs: [string]
            },
            ...
        ]
    }, ...],

    mwes: [{
        _id: ObjectId,
        user_id: ObjectId,
        project_id: ObjectId,
        value: string
    }, ...]

    ------------------
    FAQ:
    ------------------
    *Why do embedded documents have _id field?*

    Later we may want to extend the database and need to reference a kind of id to 
    embedded documents such as a project or doc. We don't want to reference their name and keep changing them whenever
    name gets updated.

    *Why keep contexts, blocks, words, doc as different collection instead of under a user?*
    """

    # -------------------------
    # Setting up indexes:
    # -------------------------
    mongo.db.users.create_index('username', unique=1)
    mongo.db.users.create_index('projects._id', unique=1)
    mongo.db.users.create_index([('username', pymongo.ASCENDING), ('projects.name', pymongo.ASCENDING)])
    mongo.db.users.create_index([('username', pymongo.ASCENDING), ('projects.name', pymongo.ASCENDING), ('projects.docs.name', pymongo.ASCENDING)])
    mongo.db.users.create_index('projects.docs.name')
    mongo.db.docblocks.create_index('project_id')
    mongo.db.docblocks.create_index([('project_id', pymongo.ASCENDING), ('doc_id', pymongo.ASCENDING), ('block_id', pymongo.ASCENDING)], unique=1)

    mongo.db.contexts.create_index([('user_id', pymongo.ASCENDING), ('name', pymongo.ASCENDING)], unique=1)
    mongo.db.contexts.create_index('concepts.name')

    mongo.db.mwes.create_index([('user_id', pymongo.ASCENDING), ('project_id', pymongo.ASCENDING)], unique=1)

    # -------------------------
    # Inserting records:
    # -------------------------
    try:
        user_id = mongo.db.users.insert_one({'username': 'default'}).inserted_id
        print("Created 'default' user.")
    except pymongo.errors.DuplicateKeyError:
        user_id = mongo.db.users.find_one({'username': 'default'}, projection=['_id'])['_id']
        print("'default' user had been created, moving on...")

    try:
        context_id = mongo.db.contexts.insert_one({
            'name': 'real estate',
            'user_id': user_id,
            'concepts': []
        }).inserted_id
        print("Created 'real estate' context.")
    except pymongo.errors.DuplicateKeyError:
        context_id = mongo.db.contexts.find_one({'user_id': user_id, 'name': 'real estate'}, projection=['_id'])['_id']
        print("'real estate' context had been created, moving on...")

    try:
        project_id = ObjectId()
        mongo.db.users.update_one(
            {
                '_id': user_id
            },
            {
            '$push' : {
                'projects': {
                    '_id': project_id,
                    'name': 'risky',
                    'description': "A test project for Dynamic Risk.",
                    'context_id': context_id,
                    'last_modified': datetime.utcnow(),
                    'last_modified_by': user_id
                },                
            }
        })
        print("Created 'risky' project")
    except pymongo.errors.DuplicateKeyError:
        project_id = mongo.db.users.find_one({
            'username': 'default',
            'projects.name': 'risky'
        }, projection=['projects._id'])['projects'][0]['projects._id']
        print("'risky' project had been created, moving on...")

def destroy_database():
    mongo.db.users.remove()
    print("Removed users collection.")
    mongo.db.contexts.remove()
    print("Removed contexts collection.")
    mongo.db.docblocks.remove()
    print("Removed docblocks collection.")
    mongo.db.blocks.remove()
    print("Removed blocks collection.")
    mongo.db.words.remove()
    print("Removed words collection.")

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description="Install Arthur system by preparing database.\n" \
                                                 "Make sure Mongo db server is running prior to running this script.")
    parser.add_argument('--nuke', action='store_true', dest='nuke',
                        help='Destroys the entire Arthur db before inserting values.')

    args = parser.parse_args()

    # If no argument provided...
    if not any(vars(args).values()):
        print("Installing Arthur by inserting default records to database.")
        print("Run with -h option for more info.")

    with app.app_context():
        # within this block, current_app points to app.
        current_app.config.from_object('config')
        mongo = PyMongo(current_app)
        if args.nuke:
            destroy_database()
        run_installer()
        