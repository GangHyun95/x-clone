import { Link, useNavigate } from 'react-router-dom';

import StickyHeader from '@/components/common/StickyHeader';
import { RightArrowSvg } from '@/components/svgs';

export default function AccountPanel() {
	const navigate = useNavigate();

	return (
		<>
			<StickyHeader.Header onPrev={() => navigate(-1)}>
				<p className='text-xl font-bold'>Account information</p>
			</StickyHeader.Header>

			<Link to='/settings/account/username' className='flex items-center border-b border-base-300 hover:bg-base-200 px-4 py-3'>
				<div className='flex-auto flex flex-col'>
					<h3>Username</h3>
					<p className='text-sm text-gray-400'>@hgh6128</p>
				</div>
				<RightArrowSvg className='h-5 fill-gray-500' />
			</Link>

			<div className='flex flex-col border-b border-base-300'>
				<div className='flex flex-col px-4 py-3'>
					<h3>Email</h3>
					<p className='text-sm text-gray-400'>hgh6128@gmail.com</p>
				</div>
			</div>

			<div className='flex flex-col border-b border-base-300'>
				<div className='flex flex-col px-4 py-3'>
					<h3>Account creation</h3>
					<p className='text-sm text-gray-400'>May 17, 2025, 3:50:39 PM</p>
					<p className='text-sm text-gray-400'>121.55.185.123 (South Korea)</p>
				</div>
			</div>
		</>
	);
}
