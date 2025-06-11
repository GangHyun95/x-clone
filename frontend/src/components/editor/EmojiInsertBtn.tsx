import EmojiPicker from 'emoji-picker-react';
import { useState } from 'react';

import { EmojiSvg } from '@/components/svgs';

type Props = {
    insertEmoji: (emoji: string) => void;
};

export default function EmojiInsertBtn({ insertEmoji }: Props) {
    const [show, setShow] = useState(false);

    return (
        <div className='relative'>
            <button
                type='button'
                className='btn btn-sm btn-ghost btn-circle hover:bg-primary/10 border-0'
                title='Add emoji'
                onClick={() => setShow(prev => !prev)}
            >
                <EmojiSvg className='w-5 fill-primary' />
            </button>

            {show && (
                <div className='absolute top-full z-10'>
                    <EmojiPicker
                        onEmojiClick={(emojiData) => {
                            insertEmoji(emojiData.emoji);
                            setShow(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
}
