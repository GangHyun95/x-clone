import { Editor, EditorState, Modifier } from 'draft-js';
import { useRef } from 'react';

type Props = {
    editorState: EditorState,
    setEditorState: (state: EditorState) => void;
    isModal?: boolean;
    placeholder?: string;
};

export function insertEmoji(editorState: EditorState, emoji: string): EditorState {
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();

    const newContentState = Modifier.insertText(contentState, selection, emoji);
    const pushed = EditorState.push(editorState, newContentState, 'insert-characters');

    return EditorState.forceSelection(pushed, newContentState.getSelectionAfter());
}

export default function SingleLineEditor({ editorState, setEditorState, isModal = false, placeholder }: Props) {
    const editorRef = useRef<Editor>(null);

    const handleChange = (state: EditorState) => {
        setEditorState(state);
    };

    return (
        <div
            className={`py-3 ${isModal ? 'min-h-24' : 'min-h-6'}`}
            onClick={() => editorRef.current?.focus()}
        >
            <Editor
                ref={editorRef}
                editorState={editorState}
                onChange={handleChange}
                placeholder={placeholder ?? 'What\'s happening?'}
            />
        </div>
    );
}
