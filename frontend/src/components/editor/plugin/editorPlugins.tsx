import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { OnChangePlugin as LexicalOnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { createCommand, $getSelection, $isRangeSelection, type LexicalEditor } from 'lexical';
import { useEffect } from 'react';

export const INSERT_EMOJI_COMMAND = createCommand<string>('INSERT_EMOJI');

// 에디터 인스턴스 초기화
export function EditorInitEffect({ onEditorInit }: { onEditorInit: (editor: LexicalEditor) => void }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        onEditorInit(editor);
    }, [editor, onEditorInit]);

    return null;
}

// 이모지 삽입
export function EmojiPlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerCommand(INSERT_EMOJI_COMMAND, (emoji: string) => {
            editor.focus();
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    selection.insertText(emoji);
                }
            });
            return true;
        }, 1);
    }, [editor]);

    return null;
}


// 텍스트 변경
export function OnChangePlugin({ onChangeText }: { onChangeText: (text: string) => void }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        onChangeText(editor.getRootElement()?.textContent?.trim() ?? '');
    }, [editor]);

    return (
        <LexicalOnChangePlugin
            onChange={(_, editor) => {
                editor.read(() => {
                    const text = editor.getRootElement()?.textContent?.trim() ?? '';
                    onChangeText(text);
                });
            }}
        />
    );
}
