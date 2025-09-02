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
from sqlmodel import SQLModel

from app.core.db import engine
from app.backend_pre_start import init as wait_for_db


@pytest.fixture(scope="session", autouse=True)
def _create_database_schema() -> None:
    # Wait for database to be ready (retries up to ~5 minutes)
    wait_for_db(engine)
    # Create all tables for tests; drop them after session ends
    SQLModel.metadata.create_all(engine)
    try:
        yield
    finally:
        SQLModel.metadata.drop_all(engine)

