import os
import inspect
from flask_admin import Admin
from . import models
from .models import db
from flask_admin.contrib.sqla import ModelView
from flask_admin.theme import Bootstrap4Theme


def setup_admin(app):

    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(
        app,
        name='TaskFlow Admin',
        theme=Bootstrap4Theme(swatch='cerulean')
    )

    class UserView(ModelView):
        column_list = ['id', 'name', 'email', 'photo',
                       'city', 'twitter', 'facebook', 'instagram']
        form_columns = column_list

    class TaskView(ModelView):
        column_list = ['id', 'title', 'date',
                       'description', 'address', 'lat', 'lng']
        form_columns = column_list

    class GrupoView(ModelView):
        column_list = ['id', 'nombre', 'categoria_id', 'fecha', 'codigo']
        form_columns = column_list

    class TareasAsignadasView(ModelView):
        column_list = ['id', 'user_id', 'tareas_id']
        form_columns = column_list

    admin.add_view(UserView(models.User, db.session))
    admin.add_view(TaskView(models.Task, db.session))
    admin.add_view(GrupoView(models.Grupo, db.session))
    admin.add_view(TareasAsignadasView(models.TareasAsignadas, db.session))

    # Crear template base personalizado para admin
    custom_base = '''
        {% extends 'admin/master.html' %}
        {% block branding %}
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <a class="navbar-brand" href="/admin/">
                <img src="https://i.imgur.com/4GeeksLogo.png" width="32" height="32" class="d-inline-block align-top" alt="Logo">
                TaskFlow Admin
            </a>
            <ul class="navbar-nav ml-auto">
                <li class="nav-item"><a class="nav-link" href="/">Ir al sitio</a></li>
            </ul>
        </nav>
        {% endblock %}
        {% block body %}
        <div class="container-fluid mt-4">
            {{ super() }}
        </div>
        {% endblock %}
        '''
    from flask import render_template_string
    from flask_admin import helpers as admin_helpers
    from flask import Blueprint
    admin_bp = Blueprint('admin_custom', __name__, template_folder='templates')

    @app.route('/admin/custom_base.html')
    def custom_base_template():
        return render_template_string(custom_base)
