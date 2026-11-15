# 0001: CodeMirror 6 with a string document model

- **Status:** Accepted
- **Date:** 2026-11-15

## Context

The editor has to support three things:
- real-time collaboration via Yjs
- an Obsidian-like writing experience
- an AI collaborator that streams LLM output into the document token by token

Editors fall into two document models:

- **Tree model** (ProseMirror/TipTap, Lexical/MDXEditor). The document is a schema-validated node tree (paragraph, heading, marks). It syncs as `Y.XmlFragment`. Markdown is only an import/export format.
- **String model** (CodeMirror, Monaco). The document is plain text. It syncs as `Y.Text`, and formatting is a display concern.

A streaming LLM emits Markdown fragments such as `**bol`. In a tree model, those fragments have no valid node until they are complete, so the server would need an incremental Markdown-to-tree parser. In a string model, each token is a plain `Y.Text` insertion.

Within the string model:
- **Monaco** is heavy (several MB plus web workers), unsupported on mobile, and built for code. It has no practical way to hide Markdown syntax.
- **Ace** offers nothing over CodeMirror 6.
- **A plain `<textarea>`** cannot highlight text or render remote cursors.

## Decision

Use **CodeMirror 6** with the **string document model**: the document is Markdown text in a single `Y.Text`, bound with `y-codemirror.next`.

- Configure it as a writing editor (custom extension set and theme), not the code-oriented `basicSetup`.
- Mount `EditorView` directly from React instead of using a React wrapper. Wrappers make React state own the document (`value`/`onChange`), which would conflict with Yjs owning it.

## Consequences

- AI streaming and Markdown paste are trivial: both are text insertions.
- Obsidian-style rendering is achievable with decorations, but needs custom work: hiding syntax, atomic cursor ranges, widgets.
- Rich non-text blocks (complex tables, embeds) are harder than in a tree editor.
- The document is portable Markdown at every moment, with no conversion step.
