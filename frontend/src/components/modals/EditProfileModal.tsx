import { useForm } from 'react-hook-form';

import { TextAreaField, TextInput } from '@/components/common/input';
import CoverImageSection from '@/components/profile/CoverImageSection';
import ProfileImageSection from '@/components/profile/ProfileImageSection';
import { CloseSvg } from '@/components/svgs';
import RouteModal from '@/layouts/RouteModal';
import { getCurrentUser } from '@/store/authStore';

export default function EditProfileModal() {
    const user = getCurrentUser();

    const form = useForm({
        mode: 'onChange',
        defaultValues: {
            fullName: user.full_name,
            bio: user.bio,
            link: user.link,
        },
    });
    
    const { register, formState: { errors, isValid } } = form;

    return (
        <RouteModal>
            <div
                className='
                    modal-box flex flex-col w-full h-full max-w-none p-0 rounded-none
                    md:min-w-[600px] md:h-[650px] md:min-h-[400px] md:max-h-[90vh] md:rounded-2xl md:max-w-[600px]
                '
            >
                <header className='flex h-14 justify-center items-center px-4'>
                    <form method='dialog' className='flex items-center min-w-[56px]'>
                        <button className='btn btn-ghost btn-circle border-0 font-normal -ml-2'>
                            <CloseSvg className='w-5' />
                        </button>
                    </form>
                    <div className='flex flex-auto text-xl font-bold min-w-8 items-center'>
                        <span>Edit profile</span>
                    </div>
                    <div className='min-h-8 shrink-0' >

                        <button className='btn btn-secondary btn-circle px-4 w-auto h-auto min-h-8 font-bold' disabled={!isValid}>Save</button>
                    </div>
                </header>

                <section className='flex-1 flex flex-col overflow-hidden'>
                    <section className='flex flex-col overflow-auto'>
                        <CoverImageSection src={user.cover_img} editable={true} />
                        <div className='px-4 pt-3 flex flex-col'>
                            <div className='flex items-start justify-between'>
                                <ProfileImageSection src={user.profile_img} editable={true} />
                            </div>
                        </div>
                        <div className='px-4'>
                        <TextInput
                            id='fullName'
                            label='Name'
                            register={register('fullName', {
                                required: '이름을 입력해 주세요.',
                            })}
                            error={errors.fullName}
                        />

                        <TextAreaField
                            id='bio'
                            label='Bio'
                            register={register('bio', {
                                maxLength: {
                                    value: 160,
                                    message: '160자 이하로 입력해 주세요.',
                                },
                            })}
                            error={errors.bio}
                        />

                        <TextInput
                            id='link'
                            label='Website'
                            register={register('link', {
                                pattern: {
                                    value: /^\S*$/,
                                    message: '공백 없이 입력해 주세요.',
                                },
                            })}
                            error={errors.link}
                        />
                        </div>
                    </section>
                </section>
            </div>
        </RouteModal>
    );
}
