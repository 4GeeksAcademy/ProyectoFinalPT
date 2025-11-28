from flask import request, jsonify, Blueprint
import secrets
from werkzeug.security import generate_password_hash
from api.models import db, User
import os
from flask_mail import Message
from api.extensions import mail
from itsdangerous import URLSafeTimedSerializer
import re

api = Blueprint('api', __name__)

reset_tokens = {}
url_front = os.getenv("VITE_FRONTEND")


@api.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"msg": "Falta correo"}), 400
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"msg": "Usuario no encontrado o no registrado"}), 404
    serializer = URLSafeTimedSerializer(os.getenv("MAIL_PASSWORD"))
    token = serializer.dumps(email, salt="password-reset")

    caracter = "_"
    token_fixed = re.sub(r"\.", caracter, token)
    reset_email = f"{url_front}resetPassword/${token_fixed}"

    msg = Message(
        'Recupera contraseña',
        html=f"<p> Da click <a href={reset_email}>Aqui</a> para recuperar tu contraseña. </p>",
        recipients=[email],
        sender='taskflowproyect@gmail.com'
    )

    mail.send(msg)

    return jsonify({"msg": "Correo enviado exitosamente"}), 200


@api.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('token')
    print(token)
    new_password = data.get('new_password')
    token_correct = re.sub(r"_", r"\.", token)

    serializer = URLSafeTimedSerializer(os.getenv("MAIL_PASSWORD"))

    email = serializer.loads(token_correct, salt="password-reset", max_age=60)

    user = User.query.filter_by(email = email).first()
    hashed_password = generate_password_hash(new_password)
    user.password = hashed_password
    db.session.commit()

    return jsonify({"msg": "Contraseña cambiada correctamente"}), 200