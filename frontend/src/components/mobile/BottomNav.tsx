import { NavLink } from 'react-router-dom';

import ModalRouteBtn from '@/components/common/ModalRouteBtn';
import { PostSvg } from '@/components/svgs';
import { navItems } from '@/constants/navItems';
import { useBottomBarFade } from '@/hooks/useBottomBarFade';
import { getCurrentUser } from '@/store/authStore';

export default function BottomNav() {
    const { username } = getCurrentUser();
    const opacity = useBottomBarFade();
    return (
        <div style={{ opacity }}>
            <ModalRouteBtn
                to='/post/new'
                backgroundLocation={location.pathname}
                className='btn btn-primary btn-circle fixed bottom-18 right-5 xs:hidden w-14 h-14'
            >
                <PostSvg className='fill-white w-6 h-6'/>
            </ModalRouteBtn>

            <nav
                className='fixed bottom-0 left-0 right-0 flex justify-around items-center h-13 bg-white transition-opacity duration-200 xs:hidden'
            >
                {navItems.map(({ name, icon: Icon, path }) => {
                    const finalPath = name === 'profile' ? `/profile/${username}` : path;
                    return (
                        <NavLink
                            key={name}
                            to={finalPath}
                            className='flex flex-col items-center justify-center p-2'>
                            {({ isActive }) => <Icon className='w-6 h-6' filled={isActive} />}
                        </NavLink>
                    );
                })}
            </nav>
        </div>
    );
}
