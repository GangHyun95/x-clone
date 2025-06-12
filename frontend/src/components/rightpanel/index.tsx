
import SuggestedUserList from '@/components/rightpanel/SuggestedUserList';

export default function RightPanel() {

    return (
        <div className='hidden lg:flex flex-col'>
            <aside className='sticky top-0 flex flex-col w-[290px] mr-[10px] lg-plus:w-[350px] xl-plus:mr-[70px]'>
                <section className='flex flex-col pt-3'>
                    <div className='flex flex-col mb-4 rounded-2xl border border-base-300'>
                        <h2 className='px-4 py-3 text-xl font-extrabold'>Who to follow</h2>
                        <SuggestedUserList />
                    </div>
                </section>
            </aside>
        </div>
    );
}
