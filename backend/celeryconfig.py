# from celery import Celery

# def make_celery(app_name=__name__):
#     # Use RabbitMQ as the broker
#     return Celery(app_name, broker='pyamqp://guest:guest@localhost//')

# celery = make_celery()

from celery import Celery

celery_app = Celery(__name__, broker='pyamqp://guest:guest@localhost//', include=['app', 'gather_liked_movies'])