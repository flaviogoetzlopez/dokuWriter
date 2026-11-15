# 0002: Text cursors via Yjs Awareness, not mouse pointers

- **Status:** Accepted
- **Date:** 2026-11-15

## Context

Collaborators should see where others are working, including the AI collaborator. There are two common patterns:

- **Text cursors** (Google Docs): a remote caret, selection and name label inside the text.
- **Mouse pointers** (Figma, Miro): floating arrows positioned by screen coordinates.

Pixel coordinates do not transfer between clients. Viewport width, fonts, line wrapping and scroll position differ, so the same `(x, y)` points at different text on different devices.

## Decision

Show **text carets and selections** using the Yjs **Awareness** protocol, rendered by `y-codemirror.next`.

- Positions are Yjs **relative positions**, anchored to document content rather than numeric offsets.
- The server relays awareness messages alongside sync messages on the same socket.
- Awareness is never persisted, and the server clears a client's state on disconnect.
- The AI collaborator publishes its own awareness state, so its cursor uses the same path.

## Consequences

- Cursors stay correct across devices and under concurrent edits.
- The backend must understand and relay two message kinds and handle disconnect cleanup. A sync-only relay would silently break presence.
- Figma-style pointer presence is out of scope.
