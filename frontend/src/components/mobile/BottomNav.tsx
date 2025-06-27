import { NavLink } from 'react-router-dom';

import { navItems } from '@/constants/navItems';
import { useBottomBarFade } from '@/hooks/useBottomBarFade';
import { getCurrentUser } from '@/store/authStore';

export default function BottomNav() {
    const { username } = getCurrentUser();
    const opacity = useBottomBarFade();

    return (
        <nav
            style={{ opacity }}
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
    );
}
