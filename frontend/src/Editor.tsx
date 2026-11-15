import { useEffect, useRef } from 'react'
import { EditorView } from '@codemirror/view'
import { writingSetup } from './writingSetup.ts'

const initialDoc = `# Hello dokuWriter

Some **bold**, *italic* and ~~struck~~ text with a [link](https://example.com).

> A quote

- a list item

\`\`\`ts
const answer: number = 42
\`\`\`
`

// React owns only this <div>. CodeMirror owns everything inside it,
// including the document state (later: Yjs owns the document state).
function Editor() {
  const parentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const view = new EditorView({
      parent: parentRef.current!,
      doc: initialDoc,
      extensions: [writingSetup],
    })
    // StrictMode mounts -> unmounts -> remounts in dev. Without destroy()
    // the second mount would append a second editor into the same <div>.
    return () => view.destroy()
  }, [])

  return <div ref={parentRef} className="editor" />
}

export default Editor
