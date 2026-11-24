from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient

from app.main import app, rooms


@pytest.fixture
def client() -> Iterator[TestClient]:
    with TestClient(app) as test_client:
        yield test_client


def test_message_reaches_peers_but_not_sender(client: TestClient) -> None:
    with (
        client.websocket_connect("/ws/documents/a") as first,
        client.websocket_connect("/ws/documents/a") as second,
    ):
        first.send_text("from first")
        assert second.receive_text() == "from first"

        # If the sender had received its own message, it would be read here first.
        second.send_text("from second")
        assert first.receive_text() == "from second"


def test_rooms_are_isolated(client: TestClient) -> None:
    with (
        client.websocket_connect("/ws/documents/a") as a1,
        client.websocket_connect("/ws/documents/a") as a2,
        client.websocket_connect("/ws/documents/b") as b1,
        client.websocket_connect("/ws/documents/b") as b2,
    ):
        a1.send_text("for room a")
        assert a2.receive_text() == "for room a"

        # If room b had received room a's message, it would be read here first.
        b1.send_text("for room b")
        assert b2.receive_text() == "for room b"


def test_empty_room_is_removed(client: TestClient) -> None:
    with client.websocket_connect("/ws/documents/a"):
        assert "a" in rooms
    assert "a" not in rooms
