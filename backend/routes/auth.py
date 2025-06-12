from flask import Blueprint, request, jsonify
from models.usuario import Usuario
from utils.jwt_utils import generar_token, token_required
from db import db

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/registro', methods=['POST'])
def registro():
    data = request.json

    if Usuario.query.filter_by(correo=data['correo']).first():
        return jsonify({'error': 'Correo ya registrado'}), 400

    nuevo_usuario = Usuario(
        correo=data['correo'],
        nombre=data['nombre'],
        rol='cliente'
    )
    nuevo_usuario.set_password(data['password'])

    db.session.add(nuevo_usuario)
    db.session.commit()

    return jsonify({'mensaje': 'Usuario registrado con éxito'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    usuario = Usuario.query.filter_by(correo=data['correo']).first()

    if usuario and usuario.check_password(data['password']):
        token = generar_token(usuario.id, usuario.rol)
        return jsonify({'token': token})

    return jsonify({'error': 'Credenciales inválidas'}), 401

@auth_bp.route('/me', methods=['GET'])
@token_required
def obtener_usuario_actual():
    usuario = Usuario.query.get(request.usuario_id)

    if not usuario:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    return jsonify({
        'id': usuario.id,
        'nombre': usuario.nombre,
        'correo': usuario.correo,
        'rol': usuario.rol
    })
