import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { type LexicalEditor } from 'lexical';

import { EditorInitEffect, EmojiPlugin, OnChangePlugin } from '@/components/editor/plugin/editorPlugins';

type Props = {
    onChangeText: (text: string) => void;
    placeholder?: string;
    isModal?: boolean;
    onEditorInit: (editor: LexicalEditor) => void;
};

export default function SingleLineEditor({ onChangeText, placeholder, isModal, onEditorInit }: Props) {
    const config = {
        namespace: 'PostEditor',
        theme: {},
        onError: (error: Error) => console.error(error),
    };

    return (
        <LexicalComposer initialConfig={config}>
            <div className='relative'>
                <PlainTextPlugin
                    contentEditable={
                        <ContentEditable
                            className={`editor-input ${isModal ? 'min-h-24' : 'min-h-6'} py-3`}
                        />
                    }
                    placeholder={<div className='editor-placeholder'>{placeholder ?? 'What\'s happening?'}</div>}
                    ErrorBoundary={LexicalErrorBoundary}
                />
            </div>
            <EditorInitEffect onEditorInit={onEditorInit} />
            <OnChangePlugin onChangeText={onChangeText} />
            <EmojiPlugin />
        </LexicalComposer>
    );
}