import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { TextInput } from '@/components/common/input';
import { InlineSpinner } from '@/components/common/Spinner';
import StickyHeader from '@/components/common/StickyHeader';
import { updateMeCache } from '@/lib/queryCacheHelpers';
import { useUpdateUsername } from '@/queries/user';
import { getCurrentUser } from '@/store/authStore';

export default function EditUsernamePanel() {
    const me = getCurrentUser();
	const navigate = useNavigate();
    const form = useForm<{ username: string }>({
		mode: 'onChange',
        defaultValues: {
			username: me.username,
		},
    })

    const { register, handleSubmit, formState: { errors, isValid }, watch } = form;
	const { mutate: updateUsername, isPending } = useUpdateUsername();

	const onSubmit = (data: { username: string}) => {
		console.log(data);
		updateUsername(data.username, {
			onSuccess: (data) => {
				toast.success(data.message);
				updateMeCache({ username: data.data.username });
			}
		})
	};
	console.log(errors);
	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<StickyHeader.Header onPrev={() => navigate(-1)}>
				<p className='text-xl font-bold'>Change username</p>
			</StickyHeader.Header>
			<div className='px-4 py-3 border-b border-base-300'>
				<TextInput
					id='username'
					label='Username'
					register={register('username', {
						required: true,
						minLength: {
							value: 5,
							message: '사용자 이름은 최소 5자 이상이어야 합니다.',
						},
						maxLength: {
							value: 15,
							message: '사용자 이름은 최대 15자 이하로 입력해 주세요.',
						},
					})}
					maxLength={15}
					currentLength={watch('username').length || 0}
					error={errors.username}
				/>
			</div>
			<div className='flex justify-end py-3'>
				<button className='btn btn-primary btn-circle text-white w-auto h-auto min-h-9 px-4 mr-3' disabled={isPending || !isValid}>
					{isPending ? <InlineSpinner /> : <span>Save</span>}

				</button>
			</div>
		</form>
	);
}
