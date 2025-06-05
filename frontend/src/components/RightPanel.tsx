export default function RightPanel() {
    return (
        <div className='flex flex-col'>
            <aside className='sticky top-0 flex flex-col w-[350px] mr-[70px]'>
                <div className='flex flex-col pt-3'>
                    <div className='flex flex-col mb-4 rounded-2xl border border-base-300'>
                        <h2 className='px-4 py-3 text-xl font-extrabold'>Who to follow</h2>
                        <ul className='flex flex-col'>
                            {[1, 2, 3, 4].map((_, i) => (
                                <li key={i} className='px-4 py-3 leading-5'>
                                    <div className='flex'>
                                        <div className='relative flex w-10 h-10 overflow-hidden rounded-full group mr-2'>
                                            <div className='pb-[100%]' />
                                            <img src='/temp.png' alt='avatar' className='absolute inset-0 object-cover' />
                                            <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer' />
                                        </div>
                                        <div className='flex grow items-center justify-between'>
                                            <div className='flex flex-col w-full'>
                                                <h2 className='font-bold'>테스트계정</h2>
                                                <span className='text-gray-500'>@testtest</span>
                                            </div>
                                            <div className='ml-4'>
                                                <button className='btn btn-sm text-sm px-4 text-white rounded-full btn-secondary'>
                                                    <span>Follow</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <button className='bn btn-ghost text-[15px] justify-start rounded-t-none border-0 p-4 text-left text-primary'>
                            Show more
                        </button>
                    </div>
                </div>
            </aside>
        </div>
    );
}
