import type { Extension } from '@codemirror/state'
import { drawSelection, dropCursor, EditorView, keymap } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { tags as t } from '@lezer/highlight'

// The Markdown parser tags every syntax character (#, **, `, >, [ ]) as
// processingInstruction. Dimming that one tag makes the text read like a
// document while the source stays plain Markdown.
const markdownStyle = HighlightStyle.define([
  { tag: t.heading1, fontSize: '1.8em', fontWeight: '700' },
  { tag: t.heading2, fontSize: '1.45em', fontWeight: '700' },
  { tag: t.heading3, fontSize: '1.2em', fontWeight: '700' },
  { tag: t.heading, fontWeight: '700' },
  { tag: t.strong, fontWeight: '700' },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.strikethrough, textDecoration: 'line-through' },
  { tag: t.quote, fontStyle: 'italic' },
  { tag: t.link, color: '#3b82f6', textDecoration: 'underline' },
  { tag: [t.url, t.processingInstruction], opacity: '0.4' },
  { tag: t.monospace, fontFamily: 'ui-monospace, monospace' },
  // Minimal palette for fenced code blocks (languages loaded lazily)
  { tag: [t.keyword, t.operator], color: '#a855f7' },
  { tag: [t.string, t.number], color: '#16a34a' },
  { tag: t.comment, opacity: '0.5', fontStyle: 'italic' },
])

const writingTheme = EditorView.theme({
  '&': { minHeight: '100svh', fontSize: '18px' },
  '&.cm-focused': { outline: 'none' },
  '.cm-content': {
    fontFamily: 'system-ui, sans-serif',
    lineHeight: '1.6',
    padding: '3rem 1.5rem',
  },
})

// Deliberately not basicSetup: no line numbers, gutters, folding,
// autocomplete or active-line highlight. This is a writing tool.
export const writingSetup: Extension = [
  history(),
  drawSelection(),
  dropCursor(),
  keymap.of([...defaultKeymap, ...historyKeymap]),
  EditorView.lineWrapping,
  markdown({ base: markdownLanguage, codeLanguages: languages }),
  syntaxHighlighting(markdownStyle),
  writingTheme,
]
