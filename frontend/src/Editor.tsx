import { useEffect, useRef } from 'react'
import { basicSetup, EditorView } from 'codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'

const initialDoc = `# Hello dokuWriter

Some **bold** and *italic* text.

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
      extensions: [
        basicSetup,
        markdown({ codeLanguages: languages }),
        EditorView.lineWrapping,
      ],
    })
    // StrictMode mounts -> unmounts -> remounts in dev. Without destroy()
    // the second mount would append a second editor into the same <div>.
    return () => view.destroy()
  }, [])

  return <div ref={parentRef} className="editor" />
}

export default Editor
