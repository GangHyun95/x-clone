import Avatar from '@/components/Avatar';
import StickyHeader from '@/components/layout/StickyHeader';
import { BackArrowSvg, BookmarkSvg, CommentSvg, HeartSvg, SearchSvg, ShareSvg } from '@/components/svgs';

export default function BookmarkPage() {
    const postActions = [
        { icon: CommentSvg, count: 3 },
        { icon: HeartSvg, count: 523, color: 'red-500' },
        { icon: BookmarkSvg },
        { icon: ShareSvg },
    ];
    return (
        <div className='flex flex-col h-full'>
            <StickyHeader>
                <div className='flex items-center px-4'>
                    <div className='min-w-[53px]'>
                        <div className='btn btn-ghost btn-circle min-w-6 min-h-6'>
                            <BackArrowSvg className='size-5'/>
                        </div>
                    </div>
                    <h2 className='font-pyeojin py-3 grow text-xl font-bold'>Bookmarks</h2>
                </div>
            </StickyHeader>
            
            <div className='w-full max-w-[600px] grow'>
                <div className='flex flex-col items-center my-2'>
                    <div className='w-[95%] min-h-10'>
                        <div className='border border-gray-300 rounded-full focus-within:border-primary'>
                            <div className='flex items-center border border-transparent rounded-full focus-within:border-primary'>
                                <div>
                                    <SearchSvg className='size-4 pl-3 shrink-0 box-content z-10'/>
                                </div>
                                <input type='text' className='text-sm min-h-10 grow outline-0 pl-1 pr-4 placeholder:text-gray-500 text-gray-500 peer' placeholder='Search Bookmarks' />
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className='max-w-[400px] mx-auto my-8 px-8'>
                    <div className='flex flex-col'>
                        <h2 className='font-pyeojin text-4xl font-extrabold mb-2'>Save posts for later</h2>
                        <p className='text-gray-500 mb-7'>Bookmark posts to easily find them again in the future.</p>
                    </div>
                </div> */}

                <div className='w-full max-w-[600px] grow'>
                    <article className='flex flex-col px-4 py-3 border-b border-base-300'>
                        <div className='flex'>
                            <div className='mr-2'>
                                <Avatar src='/temp.png'/>
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
                                        const hoverBgClass =
                                            color === 'red-500' ? 'group-hover:bg-red-500/10' : 'group-hover:bg-primary/10';
                                        const hoverFillClass =
                                            color === 'red-500' ? 'group-hover:fill-red-500' : 'group-hover:fill-primary';
                                    
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
                    </article>
                </div>
            </div>
        </div>
    );
}

