import EmojiPicker from 'emoji-picker-react';
import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { EmojiSvg } from '@/components/svgs';

type Props = {
    insertEmoji: (emoji: string) => void;
};

export default function EmojiInsertBtn({ insertEmoji }: Props) {
    const [show, setShow] = useState(false);
    const btnRef = useRef<HTMLButtonElement>(null);
    const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

    useEffect(() => {
        if (show && btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();
            setPos({ top: rect.bottom + 4, left: rect.left });
        }
    }, [show]);

    const containerEl =
        typeof window !== 'undefined'
            ? document.querySelector('dialog') || document.body
            : null;

    return (
        <>
            <button
                type='button'
                ref={btnRef}
                onClick={() => setShow(prev => !prev)}
                className='btn btn-sm btn-ghost btn-circle hover:bg-primary/10 border-0'
                title='Add emoji'
            >
                <EmojiSvg className='w-5 fill-primary' />
            </button>

            {show && pos && containerEl &&
                createPortal(
                    <div className='absolute inset-0 z-[9999]'>
                        <div
                            className='fixed inset-0 z-0'
                            onClick={() => setShow(false)}
                        />

                        <div
                            className='absolute z-10 bg-white shadow-md rounded-md'
                            style={{
                                top: `${pos.top}px`,
                                left: `${pos.left}px`,
                            }}
                        >
                            <EmojiPicker
                                onEmojiClick={(emojiData) => {
                                    insertEmoji(emojiData.emoji);
                                    setShow(false);
                                }}
                            />
                        </div>
                    </div>,
                    containerEl
                )
            }
        </>
    );
}
