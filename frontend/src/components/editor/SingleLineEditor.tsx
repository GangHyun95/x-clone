import { Editor, EditorState, Modifier } from 'draft-js';
import { useRef, useEffect } from 'react';

type Props = {
    editorState: EditorState,
    setEditorState: (state: EditorState) => void;
    onTextChange: (text: string) => void;
    isModal?: boolean;
    bindInsertEmoji: (handler: (emoji: string) => void) => void;
};

function insertEmoji(editorState: EditorState, emoji: string): EditorState {
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();

    const newContentState = Modifier.insertText(contentState, selection, emoji);
    const pushed = EditorState.push(editorState, newContentState, 'insert-characters');

    return EditorState.forceSelection(pushed, newContentState.getSelectionAfter());
}


export default function SingleLineEditor({ editorState, setEditorState, onTextChange, isModal = false, bindInsertEmoji }: Props) {
    const editorRef = useRef<Editor>(null);

    const handleChange = (state: EditorState) => {
        setEditorState(state);
        const text = state.getCurrentContent().getPlainText().trim();
        onTextChange(text);
    };

    const handleInsertEmoji = (emoji: string) => {
        if (!editorRef.current) return;

        const updatedState = insertEmoji(editorState, emoji);
        setEditorState(updatedState);

        const text = updatedState.getCurrentContent().getPlainText().trim();
        onTextChange(text);
    };

    useEffect(() => {
        bindInsertEmoji(handleInsertEmoji);
    }, [editorState]);

    return (
        <div
            className={`py-3 ${isModal ? 'min-h-24' : 'min-h-6'}`}
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
