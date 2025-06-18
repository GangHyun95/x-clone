import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { TextInput } from '@/components/common/input';
import StickyHeader from '@/components/common/StickyHeader';
import { getCurrentUser } from '@/store/authStore';
import { useUpdateNickname } from '@/queries/user';
import { queryClient } from '@/lib/queryClient';
import type { User } from '@/types/user';
import { SpinnerSvg } from '@/components/svgs';

export default function EditUsernamePanel() {
    const me = getCurrentUser();
	const navigate = useNavigate();
    const form = useForm<{ nickname: string }>({
        defaultValues: {
			nickname: me.nickname,
		},
    })

    const { register, handleSubmit, formState: { errors, isValid } } = form;
	const { mutate: updateNickname, isPending } = useUpdateNickname();

	const onSubmit = (data: { nickname: string}) => {
		console.log(data);
		updateNickname(data.nickname, {
			onSuccess: (data) => {
				console.log(data);
				queryClient.setQueryData(['me'], (old: User | undefined) => {
					if (!old) return old;
					return {
						...old,
						nickname: data.data.nickname,
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
					id='nickname'
					label='Username'
					register={register('nickname', {
						required: '이름을 입력해 주세요.',
					})}
					error={errors.nickname}
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
