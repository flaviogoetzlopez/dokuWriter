# Roadmap

## Phase 1: Essentials

*Goal: a deployable, ephemeral, multiplayer web app with basic AI integration. No database, no login.*

1. [x] **Local frontend sandbox.** Vite + React + TypeScript app with a CodeMirror 6 Markdown editor that offers a clean, Obsidian-style writing experience.
2. [ ] **WebSocket engine.** Barebones FastAPI project with WebSocket endpoints that accept and broadcast binary Yjs messages.
   - Relay **both** sync messages (document updates) and awareness messages (cursor, name, color) on the same socket.
   - Awareness is never persisted, and a client's presence is cleared on disconnect.
3. [ ] **CRDT binding.** Connect the editor to Yjs and `y-websocket`, and sync state across two local browser windows.
   - Remote cursors: each collaborator's caret, selection and name label via `y-codemirror.next` + Awareness. These are document-anchored relative positions, not pixel coordinates.
4. [ ] **Zero-friction routing.** Visiting `/` generates a UUID and redirects to `/document/:uuid`. The page connects to the backend at `/ws/documents/:uuid`, and WebSocket broadcasts are isolated per UUID room.
5. [ ] **Basic AI collaborator (ghost cursor).**
   - A prompt input in the UI sends the current document text and the prompt to the backend.
   - The backend queries an LLM and streams the response into the room as Yjs insertions (insert only, never overwrite), as if a second user were typing.
   - The AI joins as its own awareness client, so its cursor is rendered by the same mechanism as a human's.
6. [ ] **Containerized local test.** `docker-compose.yml` runs the backend, and the frontend connects to it.
7. [ ] **Cloud deployment.** Frontend on Vercel, backend container on Render/Railway, custom domain. **Milestone: live.**

## Phase 2: Persistence and advanced AI

*Goal: turn the ephemeral rooms into a persistent product and expand the AI capabilities.*

8. [ ] **Authentication.** Supabase Auth (Google OAuth + email/password).
9. [ ] **Persistence.** Supabase PostgreSQL `documents` table. A "Save" action flushes the room's binary Yjs state into the database.
10. [ ] **Dashboard.** `/dashboard` lists the documents a user owns or that are shared with them.
11. [ ] **Multiplayer saving.** Anyone collaborating via the URL can save the document to their own dashboard.
12. [ ] **AI swarm.** Specialized background agents (spelling, grammar, style) that independently and concurrently stream non-destructive Yjs updates or suggestions.

## Later refinements

- Live preview: hide Markdown syntax except on the cursor's line. Per-element reveal for inline marks is a possible follow-up.
