# frontend

Vite + React + TypeScript app hosting the CodeMirror 6 Markdown editor. For how it fits into the system, see [`docs/architecture.md`](../docs/architecture.md).

```sh
npm install
npm run dev       # dev server with HMR on http://localhost:5173
npm run build     # type-check (tsc -b), then production build into dist/
npm run lint      # oxlint
npm run preview   # serve the production build locally
```

## Layout

| File | Purpose |
|---|---|
| `src/Editor.tsx` | Mounts the CodeMirror `EditorView`. React owns only the container element. |
| `src/writingSetup.ts` | Editor extensions: keymaps, history, Markdown (GFM), highlight style, theme |
