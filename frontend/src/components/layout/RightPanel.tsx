import Avatar from '@/components/Avatar'

export default function RightPanel() {
    return (
        <div className='hidden lg:flex flex-col'>
            <aside className='sticky top-0 flex flex-col w-[290px] mr-[10px] lg-plus:w-[350px] xl-plus:mr-[70px]'>
                <section className='flex flex-col pt-3'>
                    <div className='flex flex-col mb-4 rounded-2xl border border-base-300'>
                        <h2 className='px-4 py-3 text-xl font-extrabold'>Who to follow</h2>
                        <ul className='flex flex-col'>
                            {[1, 2, 3, 4].map((_, i) => (
                                <li key={i} className='px-4 py-3 leading-5'>
                                    <article className='flex'>
                                        <Avatar src='/temp.png' className='mr-2' />
                                        <div className='flex grow items-center justify-between'>
                                            <div className='flex flex-col w-full'>
                                                <h3 className='font-bold'>테스트계정</h3>
                                                <span className='text-gray-500'>@testtest</span>
                                            </div>
                                            <div className='ml-4'>
                                                <button className='btn btn-sm text-sm px-4 text-white rounded-full btn-secondary'>
                                                    <span>Follow</span>
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                </li>
                            ))}
                        </ul>
                        <button className='bn btn-ghost justify-start rounded-t-none border-0 p-4 text-left text-primary'>
                            Show more
                        </button>
                    </div>
                </section>
            </aside>
        </div>
    );
}
