import jwt
from datetime import datetime, timedelta
from flask import current_app
from functools import wraps
from flask import request, jsonify

def generar_token(usuario_id, rol):
    payload = {
        'id': usuario_id,
        'rol': rol,
        'exp': datetime.utcnow() + timedelta(hours=6)
    }
    return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')

def verificar_token(token):
    try:
        return jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return None

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]  # Bearer <token>

        if not token:
            return jsonify({'error': 'Token faltante'}), 401

        data = verificar_token(token)
        if not data:
            return jsonify({'error': 'Token inválido o expirado'}), 401

        request.usuario_id = data['id']
        request.usuario_rol = data['rol']
        return f(*args, **kwargs)

    return decorated