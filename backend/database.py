from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from models import Base
import os
from dotenv import load_dotenv

load_dotenv(".env")

# DATABASE_URI = f"mysql+pymysql://{os.environ.get('db_user')}:{os.environ.get('db_password')}@localhost/MovieProject"
DATABASE_URI = f"mysql+pymysql://{os.environ.get('db_user')}:{os.environ.get('db_password')}@localhost/cineberg"


engine = create_engine(DATABASE_URI)
db_session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))

def init_db():
    Base.metadata.create_all(bind=engine)
