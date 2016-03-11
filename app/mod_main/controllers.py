from flask import Blueprint, request, render_template, \
                  flash, g, session, redirect, url_for

mod_main = Blueprint('main', __name__)

@mod_main.route('/')
@mod_main.route('/index')
def run_index():
    # session.sid
    session['test_session'] = "Test session value"
    return render_template('index.html')