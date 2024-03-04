from celery import Celery

celery_app = Celery(__name__, broker='pyamqp://guest:guest@localhost//', include=['app', 'gather_liked_movies'])