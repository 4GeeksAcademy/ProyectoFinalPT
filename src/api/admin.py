
import os
from flask_admin import Admin
from .models import db, User, Task, TareasAsignadas, Mision, Evento, Prioridad, Estado, Grupo, Categoria, Clan
from flask_admin.contrib.sqla import ModelView


def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin')

    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Task, db.session))
    admin.add_view(ModelView(TareasAsignadas, db.session))
    admin.add_view(ModelView(Mision, db.session))
    admin.add_view(ModelView(Evento, db.session))
    admin.add_view(ModelView(Prioridad, db.session))
    admin.add_view(ModelView(Estado, db.session))
    admin.add_view(ModelView(Grupo, db.session))
    admin.add_view(ModelView(Clan, db.session))
    admin.add_view(ModelView(Categoria, db.session))
