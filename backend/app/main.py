from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()


@app.websocket("/ws")
async def echo(ws: WebSocket) -> None:
    await ws.accept()
    try:
        while True:
            msg = await ws.receive_text()
            await ws.send_text(msg)
    except WebSocketDisconnect:
        pass
