import SingleLineEditor from '@/components/commons/input/SingleLineEditor';
import RightPanel from '@/components/commons/RightPanel';
import { BookmarkSvg, CommentSvg, EmojiSvg, HeartSvg, MediaSvg, ShareSvg } from '@/components/svgs';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function HomeScreen() {
    const [isDisabled, setIsDisabled] = useState(true);
    const postActions = [
        { icon: CommentSvg, count: 3 },
        { icon: HeartSvg, count: 523, color: 'red-500' },
        { icon: BookmarkSvg },
        { icon: ShareSvg },
    ];

    return (
        <div className='flex grow justify-between text-[15px]'>
            <div className='grow max-w-[600px] border-x border-base-300'>
                <div className='flex flex-col'>
                    <div className='sticky top-0 z-10 border-b border-base-300 bg-white/85 backdrop-blur-md'>
                        <div className='flex h-full'>
                            <div className='flex h-full grow flex-col items-center justify-center'>
                                <Link to='/' className='relative h-auto w-full grow btn btn-ghost hover:shadow-none rounded-none border-0 px-4 font-bold'>
                                    <span className='py-4'>For you</span>
                                    <span className='absolute bottom-0 left-1/2 h-1 w-14 -translate-x-1/2 rounded-full bg-primary' />
                                </Link>
                            </div>
                            <div className='flex h-full grow flex-col items-center justify-center'>
                                <Link to='/' className='relative h-auto w-full grow btn btn-ghost hover:shadow-none rounded-none border-0 px-4 font-medium text-gray-500'>
                                    <span className='py-4'>Following</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className='flex px-4 border-b border-base-300'>
                        <div className='mr-2 pt-3'>
                            <div className='relative w-10 overflow-hidden rounded-full'>
                                <div className='pb-[100%]' />
                                <img src='/temp.png' alt='avatar' className='absolute inset-0 object-cover' />
                            </div>
                        </div>
                        <div className='flex grow flex-col pt-1'>
                            <SingleLineEditor
                                onTextChange={(text) => setIsDisabled(text.trim().length === 0)}
                            />
                            <div className='flex items-center justify-between pb-2'>
                                <section className='mt-2 grow'>
                                    <button className='btn btn-sm btn-ghost btn-circle hover:bg-primary/10 border-0'>
                                        <MediaSvg className='w-5 fill-primary' />
                                    </button>
                                    <button className='btn btn-sm btn-ghost btn-circle hover:bg-primary/10 border-0'>
                                        <EmojiSvg className='w-5 fill-primary' />
                                    </button>
                                </section>
                                <div className='ml-4 mt-2'>
                                    <button
                                        className='btn btn-secondary btn-circle w-auto h-auto min-h-[36px] px-4'
                                        disabled={isDisabled}
                                    >
                                        Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='w-full max-w-[600px]'>
                    <article className='flex flex-col px-4 border-b border-base-300'>
                        <div className='pt-3' />
                        <div className='flex'>
                            <div className='mr-2'>
                                <div className='relative w-10 overflow-hidden rounded-full'>
                                    <div className='pb-[100%]' />
                                    <img src='/temp.png' alt='avatar' className='absolute inset-0 object-cover' />
                                </div>
                            </div>
                            <div className='flex grow flex-col'>
                                <ul className='flex items-center'>
                                    <li><span className='font-extrabold'>테스트계정</span></li>
                                    <li className='ml-1.5 text-gray-500'>
                                        <span>@test</span>
                                        <span className='px-1'>·</span>
                                        <span>23h</span>
                                    </li>
                                </ul>
                                <div className='flex flex-col'>
                                    <p>자녀분이 선물을 받고 기뻐하시겠어요</p>
                                </div>
                                <div className='relative mt-3 cursor-pointer border border-base-300'>
                                    <div className='w-full pb-[100%]' />
                                    <img src='/test.jpeg' alt='test' className='absolute inset-0' />
                                </div>
                                <div className='mt-3 flex justify-between gap-1'>
                                    {postActions.map((el, i) => {
                                        const { count, icon: Icon, color = 'primary' } = el;
                                        const hoverBgClass = `group-hover:bg-${color ?? 'primary'}/10`;
                                        const hoverFillClass = `group-hover:fill-${color ?? 'primary'}`;
                                                
                                        return (
                                            <div key={i} className='flex-1 flex items-center cursor-pointer group'>
                                            <button className={`btn btn-sm btn-ghost btn-circle border-0 ${hoverBgClass}`}>
                                                <Icon className={`h-5 fill-gray-500 ${hoverFillClass}`} />
                                            </button>
                                            {count != null && <span className='text-sm px-1'>{count}</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className='pb-3' />
                    </article>
                </div>
            </div>

            <RightPanel />
        </div>
    );
}
