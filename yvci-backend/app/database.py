from sqlmodel import SQLModel, create_engine, Session
from app.config import DATABASE_URL

# SQLite 在多线程（uvicorn 线程池）下需要关闭单线程检查
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, echo=False, pool_pre_ping=True, connect_args=connect_args)


def init_db():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
