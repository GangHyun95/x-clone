import { Link, NavLink } from 'react-router-dom';

import { BellSvg, HomeSvg, MoreSvg, SettingsSvg, UserSvg, XSvg } from '@/components/svgs';

const navItems = [
    { name: 'home', label: 'Home', path: '/', icon: HomeSvg },
    { name: 'notifications', label: 'Notifications', path: '/notifications', icon: BellSvg },
    { name: 'profile', label: 'Profile', path: '/profile', icon: UserSvg },
    { name: 'settings', label: 'Settings', path: '/settings', icon: SettingsSvg },
];

export default function Sidebar() {
    return (
        <header className='flex flex-col items-end grow shrink-0'>
            <div className='relative flex w-[275px] ml-[60px]'>
                <div className='fixed top-0 flex flex-col h-full shrink-0 pb-14'>
                    <div className='flex flex-col justify-between w-[275px] h-full overflow-y-auto px-2'>
                        <section className='flex flex-col items-start w-full'>
                            <div className='py-0.5'>
                                <Link to='/' className='btn btn-circle btn-ghost border-none min-w-[52px] min-h-[52px]'>
                                    <XSvg className='w-6 h-[30px] grow' />
                                </Link>
                            </div>
                            <nav className='w-full mt-0.5 mb-1 flex flex-col items-start'>
                                {navItems.map(({ name, label, path, icon: Icon }) => (
                                    <NavLink key={name} to={path}>
                                        {({ isActive }) => (
                                            <div className={`flex items-center p-3 w-full rounded-full relative transition-colors ${isActive ? 'font-bold' : ''}`}>
                                            <div className="relative flex items-center justify-center w-6.5 h-6.5">
                                                <Icon className="w-6.5 h-6.5 transition-colors" filled={isActive} />
                                                {isActive && <span className="absolute -top-1 right-0 w-[7px] h-[7px] bg-primary rounded-full" />}
                                            </div>
                                            <span className="ml-5 mr-4 text-xl">{label}</span>
                                            </div>
                                        )}
                                    </NavLink>
                                ))}
                            </nav>
                            <button className='btn btn-secondary rounded-full w-[90%] min-h-[52px] text-lg my-3'>
                                <span>Post</span>
                            </button>
                        </section>
                        <section className='my-3'>
                            <button className="btn btn-ghost rounded-full p-3 min-h-0 h-auto w-full border-none gap-0">
                                <div className="w-10 relative rounded-full overflow-hidden">
                                    <div className="pb-[100%]" />
                                    <img
                                        src="/temp.png"
                                        alt="avatar"
                                        className="absolute inset-0 object-cover"
                                    />
                                </div>
                                <div className='flex flex-col mx-3 shrink-1'>
                                    <span className='text-start font-semibold shrink-1'>ㅇㅅㅇ</span>
                                    <span className='text-gray-500 font-normal shrink-1'>@hgh6128</span>
                                </div>
                                <div className='flex flex-col grow'>
                                    <MoreSvg className='w-5 h-5 shrink-0 self-end' />
                                </div>
                            </button>
                        </section>
                    </div>
                </div>
            </div>
        </header>
    );
}
