import os
import uuid

import pytest
from httpx import AsyncClient

from app.core.config import settings
from app.main import app


@pytest.mark.anyio
async def test_signup_login_me(monkeypatch: pytest.MonkeyPatch) -> None:
    # Ensure env resembles local for tests
    monkeypatch.setenv("ENVIRONMENT", "local")
    # Provide default secrets if not present in env to satisfy validators
    monkeypatch.setenv("SECRET_KEY", os.getenv("SECRET_KEY", uuid.uuid4().hex))
    monkeypatch.setenv(
        "FIRST_SUPERUSER",
        os.getenv("FIRST_SUPERUSER", "admin@example.com"),
    )
    monkeypatch.setenv(
        "FIRST_SUPERUSER_PASSWORD",
        os.getenv("FIRST_SUPERUSER_PASSWORD", "admin"),
    )

    async with AsyncClient(app=app, base_url="http://test") as client:
        # Signup
        email = f"user-{uuid.uuid4().hex[:8]}@example.com"
        password = "changeme123!"
        resp = await client.post(
            f"{settings.API_V1_STR}/users/signup",
            json={"email": email, "password": password, "full_name": "Test"},
        )
        assert resp.status_code == 200, resp.text
        user = resp.json()
        assert user["email"] == email

        # Login
        resp = await client.post(
            f"{settings.API_V1_STR}/login/access-token",
            data={"username": email, "password": password},
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        assert resp.status_code == 200, resp.text
        token = resp.json()["access_token"]
        assert token

        # Me
        resp = await client.get(
            f"{settings.API_V1_STR}/users/me",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert resp.status_code == 200, resp.text
        me = resp.json()
        assert me["email"] == email

