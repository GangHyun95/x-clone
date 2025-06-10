import { Link, NavLink, useLocation } from 'react-router-dom';

import ModalRouteBtn from '@/components/common/ModalRouteBtn';
import { BellSvg, BookmarkSvg, HomeSvg, PostSvg, SettingsSvg, UserSvg, XSvg } from '@/components/svgs';

import { getCurrentUser } from '@/store/authStore';

import UserMenuBtn from './UserMenuBtn';

const navItems = [
    { name: 'home', label: 'Home', path: '/', icon: HomeSvg },
    { name: 'notifications', label: 'Notifications', path: '/notifications', icon: BellSvg },
    { name: 'bookmarks', label: 'Bookmarks', path: '/bookmarks', icon: BookmarkSvg },
    { name: 'profile', label: 'Profile', path: '/profile', icon: UserSvg },
    { name: 'settings', label: 'Settings', path: '/settings', icon: SettingsSvg },
];

export default function Sidebar() {
    const location = useLocation();
    const me = getCurrentUser();
    return (
        <header className='flex flex-col items-end grow'>
            <div className='relative flex w-[68px] sm:w-[88px] xl:w-[275px] xl-plus:ml-[60px]'>
                <div className='fixed top-0 flex h-full flex-col'>
                    <div className='flex flex-col justify-between h-full w-[68px] px-1 overflow-y-auto xl:w-[275px] sm:w-[88px] sm:px-2'>
                        <section className='flex flex-col items-center w-full xl:items-start'>
                            <div className='py-0.5'>
                                <Link to='/' className='btn btn-ghost btn-circle min-w-[52px] min-h-[52px]'>
                                    <XSvg className='w-6 h-[30px] grow' />
                                </Link>
                            </div>

                            <nav className='flex flex-col items-center mt-0.5 mb-1 xl:items-start'>
                                {navItems.map(({ name, label, icon: Icon, path }) => {
                                    const finalPath = name === 'profile'
                                        ? `/profile/${me.nickname}`
                                        : path;

                                    return (
                                        <NavLink
                                            key={name}
                                            to={finalPath}
                                            className='group flex flex-col items-center w-full xl:items-start'
                                        >
                                            {({ isActive }) => (
                                                <div
                                                    className={`flex items-center p-3 rounded-full transition-colors relative w-max group-hover:bg-base-300 ${
                                                        isActive ? 'font-bold' : ''
                                                    }`}
                                                >
                                                    <div className='flex items-center justify-center relative w-6.5 h-6.5'>
                                                        <Icon className='w-6.5 h-6.5 transition-colors' filled={isActive} />
                                                        {isActive && (
                                                            <span className='absolute -top-1 right-0 w-[7px] h-[7px] bg-primary rounded-full' />
                                                        )}
                                                    </div>
                                                    <span className='ml-5 mr-4 text-xl hidden xl:block'>{label}</span>
                                                </div>
                                            )}
                                        </NavLink>
                                    );
                                })}
                            </nav>

                            <ModalRouteBtn
                                to='/post/new'
                                backgroundLocation={location.pathname}
                                className='btn btn-secondary btn-circle my-3 p-0 text-lg min-w-[52px] min-h-[52px] hover:bg-secondary/90 xl:w-[90%]'
                            >
                                <span className='hidden font-bold xl:block'>Post</span>
                                <PostSvg className='w-6 fill-white xl:hidden' />
                            </ModalRouteBtn>
                        </section>

                        <section className='flex flex-col items-stretch my-3 xl:items-start'>
                            <UserMenuBtn />
                        </section>
                    </div>
                </div>
            </div>
        </header>
    );
}
