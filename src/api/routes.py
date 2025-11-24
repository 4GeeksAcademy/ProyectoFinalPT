from flask import request, jsonify, Blueprint
import secrets
from werkzeug.security import generate_password_hash
from api.models import db, User

api = Blueprint('api', __name__)

reset_tokens = {}

@api.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"msg": "Falta correo"}), 400
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"msg": "Usuario no encontrado o no registrado"}), 404
    token = secrets.token_urlsafe(16)
    reset_tokens[email] = token
    return jsonify({"msg": "Token de recuperación generado", "token": token}), 200

@api.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')
    token = data.get('token')
    new_password = data.get('new_password')
    if not email or not token or not new_password:
        return jsonify({"msg": "Faltan datos"}), 400
    if reset_tokens.get(email) != token:
        return jsonify({"msg": "Token inválido"}), 401
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    user.password = generate_password_hash(new_password)
    db.session.commit()
    reset_tokens.pop(email)
    return jsonify({"msg": "Contraseña cambiada correctamente"}), 200