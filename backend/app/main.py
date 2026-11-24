from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()

rooms: dict[str, set[WebSocket]] = {}


@app.websocket("/ws/documents/{document_id}")
async def document_room(ws: WebSocket, document_id: str) -> None:
    await ws.accept()
    room = rooms.setdefault(document_id, set())
    room.add(ws)
    try:
        while True:
            msg = await ws.receive_text()
            await broadcast(room, msg, sender=ws)
    except WebSocketDisconnect:
        pass
    finally:
        room.discard(ws)
        if not room:
            del rooms[document_id]


async def broadcast(room: set[WebSocket], msg: str, sender: WebSocket) -> None:
    # Iterate over a copy: a peer can leave the room while a send is awaited.
    for peer in list(room):
        if peer is sender:
            continue
        try:
            await peer.send_text(msg)
        except (WebSocketDisconnect, RuntimeError):
            # The peer is gone. Its own handler removes it from the room.
            pass
