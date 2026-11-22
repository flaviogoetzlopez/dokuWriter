# 0003: Server holds a Y.Doc per room, using pycrdt

- **Status:** Accepted
- **Date:** 2026-11-22

## Context

The backend relays Yjs messages between the clients in a room. The question is how much the server understands about those messages. Three options were considered:

- **A. Pure relay.** The server forwards bytes and stores nothing. A client joining an empty room gets no document, because the only copies live in other clients.
- **B. Update log.** The server stores every update's bytes and replays all of them to newcomers. This works because Yjs updates are commutative and idempotent, but the log grows with every keystroke, and the server cannot compute what a specific client is missing.
- **C. Server-side Y.Doc.** The server merges every update into its own Yjs document and takes part in the sync protocol as a peer.

Later roadmap steps also need a server that understands Yjs:

- The AI collaborator (step 5) runs on the backend and must produce Yjs insertions. Producing an insertion requires the current document state, so the server needs a real Y.Doc.
- Saving (step 9) writes the room's state to PostgreSQL as one binary blob.
- Disconnect cleanup ([ADR 0002](0002-text-cursors-via-awareness.md)) requires parsing awareness messages to learn which client IDs belong to a socket.

## Decision

Each room holds a **Y.Doc on the server**, implemented with [`pycrdt`](https://github.com/y-crdt/pycrdt), the Python bindings to `yrs` (the Rust port of Yjs).

- The server answers SyncStep1 with only the diff the client is missing, and requests what the server is missing in return.
- Incoming updates are applied to the room's doc and then broadcast to the other clients.
- The room keeps an awareness table (client ID, clock, state). New clients receive it on join, and the server broadcasts a removal for a socket's client IDs when that socket closes.
- The WebSocket server itself (connection handling, rooms, message routing) is written in this project. `pycrdt-websocket`, which provides a ready-made server, was not used because owning this layer is the point of the project.

## Consequences

- Late joiners get the full document from the server, even when no other client is online.
- After a server restart, the first client to reconnect restores the room's state from its own replica, since sync runs in both directions.
- Rooms live in memory, so the backend runs as a **single process**. Several workers would each hold a separate copy of the same room.
- The server must parse the y-websocket message framing (message type, sync sub-type) instead of forwarding opaque bytes.
- New dependency: `pycrdt`. Its encoding must stay compatible with the `yjs` version used by the frontend.
