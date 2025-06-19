import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { TextInput } from '@/components/common/input';
import StickyHeader from '@/components/common/StickyHeader';
import { SpinnerSvg } from '@/components/svgs';
import { queryClient } from '@/lib/queryClient';
import { useUpdateUsername } from '@/queries/user';
import { getCurrentUser } from '@/store/authStore';
import type { User } from '@/types/user';

export default function EditUsernamePanel() {
    const me = getCurrentUser();
	const navigate = useNavigate();
    const form = useForm<{ username: string }>({
        defaultValues: {
			username: me.username,
		},
    })

    const { register, handleSubmit, formState: { errors, isValid } } = form;
	const { mutate: updateUsername, isPending } = useUpdateUsername();

	const onSubmit = (data: { username: string}) => {
		console.log(data);
		updateUsername(data.username, {
			onSuccess: (data) => {
				toast.success(data.message);
				queryClient.setQueryData(['me'], (old: User | undefined) => {
					if (!old) return old;
					return {
						...old,
						username: data.data.username,
					}
				});
			}
		})
	};

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
						required: '이름을 입력해 주세요.',
					})}
					error={errors.username}
				/>
			</div>
			<div className='flex justify-end py-3'>
				<button className='btn btn-primary btn-circle text-white w-auto h-auto min-h-9 px-4 mr-3' disabled={isPending || !isValid}>
					{isPending ? (
						<>
							<SpinnerSvg className='size-5 text-primary animate-spin'/>
							<span className='ml-1'>Saving...</span>
						</>
					) : (
						<span>Save</span>
					)}
				</button>
			</div>
		</form>
	);
}
