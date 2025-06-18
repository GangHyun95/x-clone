import { Link, useNavigate } from 'react-router-dom';

import StickyHeader from '@/components/common/StickyHeader';
import { RightArrowSvg } from '@/components/svgs';
import { getCurrentUser } from '@/store/authStore';
import { formatFullDateKST } from '@/utils/formatters';

export default function AccountPanel() {
	const navigate = useNavigate();
	const me = getCurrentUser();
	
	return (
		<>
			<StickyHeader.Header onPrev={() => navigate(-1)}>
				<p className='text-xl font-bold'>Account information</p>
			</StickyHeader.Header>

			<Link to='/settings/account/username' className='flex items-center border-b border-base-300 hover:bg-base-200 px-4 py-3'>
				<div className='flex-auto flex flex-col'>
					<h3>Username</h3>
					<p className='text-sm text-gray-400'>@{me.username}</p>
				</div>
				<RightArrowSvg className='h-5 fill-gray-500' />
			</Link>

			<div className='flex flex-col border-b border-base-300'>
				<div className='flex flex-col px-4 py-3'>
					<h3>Email</h3>
					<p className='text-sm text-gray-400'>{me.email}</p>
				</div>
			</div>

			<div className='flex flex-col border-b border-base-300'>
				<div className='flex flex-col px-4 py-3'>
					<h3>Account creation</h3>
					<p className='text-sm text-gray-400'>{formatFullDateKST(me.created_at)}</p>
				</div>
			</div>
		</>
	);
}
