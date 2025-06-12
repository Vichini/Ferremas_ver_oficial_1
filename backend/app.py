from flask import Flask
from flask_cors import CORS
from config import Config
from db import db  
from routes.auth import auth_bp
from routes.productos import productos_bp
from routes.pedidos import pedidos_bp

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

db.init_app(app) 


app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(productos_bp, url_prefix='/api/productos')
app.register_blueprint(pedidos_bp, url_prefix='/api/pedidos')


with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
