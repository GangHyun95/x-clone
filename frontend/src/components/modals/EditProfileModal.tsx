import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { TextAreaField, TextInput } from '@/components/common/input';
import { InlineSpinner } from '@/components/common/Spinner';
import CoverImageSection from '@/components/profile/CoverImageSection';
import ProfileImageSection from '@/components/profile/ProfileImageSection';
import { CloseSvg } from '@/components/svgs';
import RouteModal from '@/layouts/RouteModal';
import { updateMeCache } from '@/lib/queryCacheHelpers';
import { useUpdateProfile } from '@/queries/user';
import { getCurrentUser } from '@/store/authStore';

type EditProfileFormValues = {
    fullName: string;
    bio: string;
    link: string;
};

export default function EditProfileModal() {
    const [files, setFiles] = useState<{ cover: File | null; profile: File | null }>({
        cover: null,
        profile: null,
    });

    const user = getCurrentUser();
    const { mutate: updateProfile, isPending } = useUpdateProfile();
    const navigate = useNavigate();

    const form = useForm<EditProfileFormValues>({
        mode: 'onChange',
        defaultValues: {
            fullName: user.full_name,
            bio: user.bio,
            link: user.link,
        },
    });
    
    const { register, handleSubmit, formState: { errors, isValid }, watch } = form;
    
    const onSubmit = (data: EditProfileFormValues) => {
        const formData = new FormData();
        formData.append('fullName', data.fullName);
        formData.append('bio', data.bio || '');
        formData.append('link', data.link || '');

        if (files.cover) formData.append('coverImg', files.cover);
        if (files.profile) formData.append('profileImg', files.profile);

        updateProfile(formData, {
            onSuccess: (data) => {
                const updated = data.data.user;
                updateMeCache(updated);
                setFiles({ cover: null, profile: null });
                navigate(-1);
            },
            onError: (error) => {
                console.error(error);
            },
        });
    };
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
                        <button
                            type='submit'
                            form='edit-profile-form'
                            className='btn btn-secondary btn-circle px-4 w-auto h-auto min-h-8 font-bold'
                            disabled={!isValid || isPending}
                        >
                            {isPending ? <InlineSpinner /> : <span>Save</span>}
                        </button>
                    </div>
                </header>

                <section className='flex-1 flex flex-col overflow-hidden'>
                    <form
                        id='edit-profile-form'
                        onSubmit={handleSubmit(onSubmit)}
                        className='flex flex-col overflow-auto'
                    >
                        <fieldset disabled={isPending} className='contents'>
                            <CoverImageSection
                                src={user.cover_img}
                                editable={true}
                                onChange={(file) => setFiles(prev => ({ ...prev, cover: file }))}
                            />
                            <div className='px-4 pt-3 flex flex-col'>
                                <div className='flex items-start justify-between'>
                                    <ProfileImageSection
                                        src={user.profile_img}
                                        editable={true}
                                        onChange={(file) => setFiles(prev => ({ ...prev, profile: file }))}
                                    />
                                </div>
                            </div>
                            <div className='px-4'>
                                <TextInput
                                    id='fullName'
                                    label='Name'
                                    register={register('fullName', {
                                        required: '이름을 입력해 주세요.',
                                        maxLength: {
                                            value: 50,
                                            message: '50자 이하로 입력해 주세요.',
                                        },
                                    })}
                                    error={errors.fullName}
                                    maxLength={50}
                                    currentLength={watch('fullName').length || 0}
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
                                    maxLength={160}
                                    currentLength={watch('bio').length || 0}
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
                        </fieldset>
                    </form>

                </section>
            </div>
        </RouteModal>
    );
}
