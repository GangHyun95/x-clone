import PostEditorForm from '@/components/editor/PostEditorForm';
import { CloseSvg } from '@/components/svgs';
import RouteModal from '@/layouts/RouteModal';

export default function NewPostModal() {
    return (
        <RouteModal position='start'>
            <div
                className={`
                    relative modal-box flex flex-col w-full h-full max-w-none p-0 rounded-none top-[5%]
                    md:min-w-[600px] md:h-auto md:max-h-[90vh] md:rounded-2xl md:max-w-[600px]
                `}
            >

                <header className='flex h-14 justify-center px-4'>
                    <form
                        method='dialog'
                        className='flex flex-1 basis-1/2 items-center'
                    >
                        <button className='btn btn-ghost btn-circle border-0 font-normal'>
                            <CloseSvg className='w-5' />
                        </button>
                    </form>
                    <div className='flex flex-auto min-w-8 items-center'>
                    </div>
                    <div className='flex-1 basis-1/2 min-h-8' />
                </header>
                <PostEditorForm profileImg='/temp.png' variant='modal'/>

            </div>
        </RouteModal>
    );
}
