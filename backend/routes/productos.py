from flask import Blueprint, request, jsonify
from models.producto import Producto
from db import db
from utils.jwt_utils import token_required

productos_bp = Blueprint('productos_bp', __name__)

@productos_bp.route('/', methods=['GET'])
def get_productos():
    productos = Producto.query.all()
    return jsonify([{
        'id': p.id,
        'nombre': p.nombre,
        'descripcion': p.descripcion,
        'precio': p.precio,
        'stock': p.stock,
        'categoria': p.categoria
    } for p in productos])

@productos_bp.route('/', methods=['POST'])
@token_required
def crear_producto():
    data = request.json
    nuevo_producto = Producto(
        nombre=data['nombre'],
        descripcion=data['descripcion'],
        precio=data['precio'],
        stock=data['stock'],
        categoria=data['categoria']
    )
    db.session.add(nuevo_producto)
    db.session.commit()

    return jsonify({'mensaje': 'Producto creado correctamente'})
