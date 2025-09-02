import os

# Ensure test env vars are set BEFORE importing application modules that read them
os.environ.setdefault("ENVIRONMENT", "local")
os.environ.setdefault("SECRET_KEY", "testsecret")
os.environ.setdefault("FIRST_SUPERUSER", "admin@example.com")
os.environ.setdefault("FIRST_SUPERUSER_PASSWORD", "admin")
os.environ.setdefault("POSTGRES_SERVER", os.getenv("POSTGRES_SERVER", "127.0.0.1"))
os.environ.setdefault("POSTGRES_PORT", os.getenv("POSTGRES_PORT", "5432"))
os.environ.setdefault("POSTGRES_DB", os.getenv("POSTGRES_DB", "app"))
os.environ.setdefault("POSTGRES_USER", os.getenv("POSTGRES_USER", "postgres"))
os.environ.setdefault("POSTGRES_PASSWORD", os.getenv("POSTGRES_PASSWORD", "postgres"))

import pytest
from sqlmodel import SQLModel, create_engine

import app.core.db as core_db
import app.api.deps as deps


@pytest.fixture(scope="session", autouse=True)
def _create_database_schema() -> None:
    # Prefer SQLite for tests unless TEST_DB=postgres is set
    engine_to_use = None
    if os.getenv("TEST_DB", "sqlite").lower() == "sqlite":
        sqlite_url = "sqlite:///./test.db"
        sqlite_engine = create_engine(
            sqlite_url, connect_args={"check_same_thread": False}
        )
        # Override engines used by the app
        core_db.engine = sqlite_engine
        deps.engine = sqlite_engine
        engine_to_use = sqlite_engine
    else:
        from app.core.db import engine as pg_engine
        from app.backend_pre_start import init as wait_for_db

        wait_for_db(pg_engine)
        engine_to_use = pg_engine

    # Create all tables for tests; drop them after session ends
    SQLModel.metadata.create_all(engine_to_use)
    try:
        yield
    finally:
        SQLModel.metadata.drop_all(engine_to_use)

