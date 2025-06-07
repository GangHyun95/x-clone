// components/SingleLineEditor.tsx
import { Editor, EditorState } from 'draft-js';
import { useState, useRef } from 'react';

type Props = {
    onTextChange: (text: string) => void;
    isModal?: boolean;
};

export default function SingleLineEditor({ onTextChange, isModal=false }: Props) {
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
        <div className={`py-3 ${isModal ? 'min-h-24' : 'min-h-6'}`} onClick={() => editorRef.current?.focus()}>
            <Editor
                ref={editorRef}
                editorState={editorState}
                onChange={handleChange}
                placeholder="What's happening?"
            />
        </div>
    );
}
