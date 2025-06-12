from flask import Blueprint, request, jsonify
from transbank.webpay.webpay_plus.transaction import Transaction
from transbank.common.options import WebpayOptions, IntegrationType
from utils.jwt_utils import token_required

pedidos_bp = Blueprint('pedidos_bp', __name__)

webpay = Transaction(WebpayOptions(
    commerce_code="597055555532",
    api_key="579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C",
    integration_type=IntegrationType.TEST
))

@pedidos_bp.route('/webpay', methods=['POST'])
@token_required
def iniciar_pago_transbank():
    data = request.json

    if not data or not isinstance(data, list):
        return jsonify({'error': 'Carrito inválido'}), 400

    monto_total = sum(p['precio'] * p['cantidad'] for p in data)

    buy_order = f"orden_{request.usuario_id}_{int(monto_total)}"
    session_id = f"sesion_{request.usuario_id}"
    return_url = "http://localhost:5500/pago-exitoso.html"

    response = webpay.create(
        buy_order=buy_order,
        session_id=session_id,
        amount=monto_total,
        return_url=return_url
    )

    return jsonify({'url': response['url'], 'token': response['token']})
