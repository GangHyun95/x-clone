// components/SingleLineEditor.tsx
import { Editor, EditorState } from 'draft-js';
import { useState, useRef } from 'react';

export default function SingleLineEditor({ onTextChange }: {onTextChange: (text: string) => void}) {
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    );
    const editorRef = useRef<Editor>(null);

    const handleChange = (state: EditorState) => {
        setEditorState(state);
        const text = state.getCurrentContent().getPlainText().trim();
        onTextChange(text);
    };

    return (
        <div
            className='py-3'
            onClick={() => editorRef.current?.focus()}
        >
            <Editor
                ref={editorRef}
                editorState={editorState}
                onChange={handleChange}
                placeholder="What's happening?"
            />
        </div>
    );
}
