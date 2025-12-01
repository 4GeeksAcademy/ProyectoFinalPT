from flask import request, jsonify, Blueprint
from datetime import datetime
from api.models import db, Task, TareasAsignadas, Evento, User

api_tasks = Blueprint('apiTasks', __name__)


@api_tasks.route('/tareas', methods=['GET'])
def get_tareas():
    tareas_serialized = [t.serialize() for t in Task.query.all()]
    return jsonify({"Lista de Tareas": tareas_serialized}), 200


@api_tasks.route('/<int:user_id>/tareas', methods=['GET'])
def get_tareas_user(user_id):
    varUser = User.query.get(user_id)
    if varUser is None:
        return jsonify({'msg': f'El usuario con ID {user_id} no existe'}), 404
    lista_tareas_serialized = [
        ta.db_tareas_tareas_asignadas.serialize()
        for ta in varUser.db_tareas_asignadas_user
    ]
    return jsonify({"Lista de todas las Tareas del usario": lista_tareas_serialized}), 200


@api_tasks.route('/<int:user_id>/tareas/<int:tareas_id>', methods=['POST'])
def asignar_tarea_user(user_id, tareas_id):
    varUser = User.query.get(user_id)
    varTarea = Task.query.get(tareas_id)
    if varUser is None or varTarea is None:
        return jsonify({'msg': 'Usuario o Tarea no existe'}), 404
    new_task = TareasAsignadas(user_id=user_id, tareas_id=tareas_id)
    db.session.add(new_task)
    db.session.commit()
    return jsonify({'msg': f'Se ha agregado la tarea {varTarea.title} al usuario {varUser.email}',
                    'Nueva Asignacion': new_task.serialize()}), 200


@api_tasks.route('/<int:user_id>/tareas', methods=['POST'])
def agregar_tarea_user(user_id):
    data = request.get_json()
    varUser = User.query.get(user_id)
    if varUser is None:
        return jsonify({"msg": f"Usuario con ID {user_id} no existe"}), 404

    nueva_tarea = Task(
        title=data.get("title"),
        description=data.get("description"),
        lat=data.get("lat"),
        lng=data.get("lng"),
        address=data.get("address"),
        estado_id=data.get("estado_id"),
        evento_id=data.get("evento_id"),
        prioridad_id=data.get("prioridad_id")
    )

    db.session.add(nueva_tarea)
    db.session.commit()

    asignacion = TareasAsignadas(user_id=user_id, tareas_id=nueva_tarea.id)
    db.session.add(asignacion)
    db.session.commit()

    return jsonify({
        "msg": f"Tarea '{nueva_tarea.title}' creada y asignada al usuario {varUser.email}",
        "tarea": nueva_tarea.serialize(),
        "asignacion": asignacion.serialize()
    }), 201


@api_tasks.route('/<int:user_id>/tareas/<int:tareas_id>/editar', methods=['PUT'])
def editar_tarea_user(user_id, tareas_id):
    varTarea = Task.query.get(tareas_id)
    varUser = User.query.get(user_id)
    if varTarea is None or varUser is None:
        return jsonify({'msg': 'Usuario o Tarea no existe'}), 404

    body = request.get_json(silent=True)
    if body is None:
        return jsonify({'msg': 'No hay datos que actualizar'}), 400

    if "title" in body: varTarea.title = body["title"]
    if "description" in body: varTarea.description = body["description"]
    if "date" in body:
        try:
            varTarea.date = datetime.fromisoformat(body["date"])
        except:
            return jsonify({'msg': 'Fecha incorrecta. Usa formato ISO'}), 400
    if "lat" in body: varTarea.lat = body["lat"]
    if "lng" in body: varTarea.lng = body["lng"]
    if "address" in body: varTarea.address = body["address"]
    if "estado_id" in body: varTarea.estado_id = body["estado_id"]
    if "evento_id" in body: varTarea.evento_id = body["evento_id"]
    if "prioridad_id" in body: varTarea.prioridad_id = body["prioridad_id"]

    db.session.commit()
    return jsonify({'msg': 'Tarea editada correctamente', 'Tarea': varTarea.serialize()}), 202


@api_tasks.route('/<int:user_id>/tareas/<int:tareas_id>/desasignar', methods=['DELETE'])
def desasignar_tarea(user_id, tareas_id):
    varUser = User.query.get(user_id)
    if varUser is None:
        return jsonify({'msg': f'El usuario con ID {user_id} no existe'}), 404

    varTareasAsignadas = TareasAsignadas.query.filter_by(user_id=user_id, tareas_id=tareas_id).first()
    if varTareasAsignadas is None:
        return jsonify({'msg': 'La tarea no está asignada a este usuario'}), 404

    db.session.delete(varTareasAsignadas)
    db.session.commit()
    return jsonify({'msg': f'Tarea {tareas_id} des-asignada del Usuario {user_id}'}), 200


@api_tasks.route('/<int:user_id>/tareas/<int:tareas_id>/eliminar', methods=['DELETE'])
def eliminar_tarea(user_id, tareas_id):
    varUser = User.query.get(user_id)
    varTarea = Task.query.get(tareas_id)
    if varUser is None or varTarea is None:
        return jsonify({'msg': 'Usuario o Tarea no existe'}), 404

    TareasAsignadas.query.filter_by(tareas_id=tareas_id).delete()
    db.session.delete(varTarea)
    db.session.commit()
    return jsonify({'msg': f'Tarea {tareas_id} eliminada correctamente'}), 200
