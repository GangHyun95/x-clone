import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { TextInput } from '@/components/common/input';
import StickyHeader from '@/components/common/StickyHeader';
import { getCurrentUser } from '@/store/authStore';

export default function EditUsernamePanel() {
    const me = getCurrentUser();
	const navigate = useNavigate();
    const form = useForm<{ nickname: string }>({
        defaultValues: {
			nickname: me.nickname,
		},
    })

    const { register, formState: { errors } } = form;

	return (
		<>
			<StickyHeader.Header onPrev={() => navigate(-1)}>
				<p className='text-xl font-bold'>Change username</p>
			</StickyHeader.Header>
			<div className='px-4 py-3 border-b border-base-300'>
				<TextInput
					id='nickname'
					label='Username'
					register={register('nickname', {
						required: '이름을 입력해 주세요.',
					})}
					error={errors.nickname}
				/>
			</div>
			<div className='flex justify-end py-3'>
				<button className='btn btn-primary btn-circle text-white w-auto h-auto min-h-9 px-4 mr-3'>Save</button>
			</div>
		</>
	);
}
