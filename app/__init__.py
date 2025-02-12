# app/__init.py__ file

import os

from flask import Flask, jsonify, redirect, render_template, request, session
from flask_cors import CORS
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, generate_csrf

from .api.auth_routes import auth_routes
from .api.collection_image_routes import collection_images_routes
from .api.collection_routes import collection_routes
from .api.recipe_image_routes import recipe_images_routes
from .api.recipe_routes import recipe_routes
from .api.search_routes import search_routes
from .api.user_routes import user_routes
from .config import Config
from .models import User, db
from .seeds import seed_commands

# Flask app setup
app = Flask(__name__, static_folder='../react-vite/dist', static_url_path='/')

# Setup login manager
login = LoginManager(app)
login.login_view = 'auth.unauthorized'


@login.user_loader
def load_user(id):
    return User.query.get(int(id))


# Tell flask about our seed commands
app.cli.add_command(seed_commands)

app.config.from_object(Config)
app.register_blueprint(user_routes, url_prefix='/api/users')
app.register_blueprint(auth_routes, url_prefix='/api/auth')
app.register_blueprint(recipe_routes, url_prefix='/api/recipes')
app.register_blueprint(collection_routes, url_prefix='/api/collections')
app.register_blueprint(recipe_images_routes, url_prefix='/api/recipe_images')
app.register_blueprint(collection_images_routes, url_prefix='/api/collection_images')
app.register_blueprint(search_routes, url_prefix='/api/search')

db.init_app(app) # Connect Flask app with SQLAlchemy db
Migrate(app, db) # Integrate Alembic with Flask
CORS(app) # Application Security

# Make sure that in production any
# request made over http is redirected to https.
@app.before_request
def https_redirect():
    if os.environ.get('FLASK_ENV') == 'production':
        if request.headers.get('X-Forwarded-Proto') == 'http':
            url = request.url.replace('http://', 'https://', 1)
            code = 301
            return redirect(url, code=code)


@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        'csrf_token',
        generate_csrf(),
        secure=True if os.environ.get('FLASK_ENV') == 'production' else False,
        samesite='Strict' if os.environ.get(
            'FLASK_ENV') == 'production' else None,
        httponly=True)
    return response


@app.route("/api/docs")
def api_help():
    """
    Returns all API routes and their doc strings
    """
    acceptable_methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    route_list = { rule.rule: [[ method for method in rule.methods if method in acceptable_methods ],
                    app.view_functions[rule.endpoint].__doc__ ]
                    for rule in app.url_map.iter_rules() if rule.endpoint != 'static' }
    return route_list


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    """
    This route will direct to the public directory in our
    react builds in the production environment for favicon
    or index.html requests
    """
    if path == 'favicon.ico':
        return app.send_from_directory('public', 'favicon.ico')
    return app.send_static_file('index.html')

@app.errorhandler(Exception)
def handle_global_exception(e):
    print(f"Global Exception: {e}")
    return jsonify({
        "message": "An unexpected error occurred.",
        "error": str(e)
    }), 500


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')
