import pytest
from httpx import AsyncClient

from app.main import app


@pytest.mark.anyio
async def test_health_check() -> None:
    async with AsyncClient(app=app, base_url="http://test") as client:
        resp = await client.get("/api/v1/utils/health-check/")
    assert resp.status_code == 200
    assert resp.json() is True

