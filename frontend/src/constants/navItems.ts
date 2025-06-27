import { BellSvg, BookmarkSvg, HomeSvg, SettingsSvg, UserSvg } from '@/components/svgs';

export const navItems = [
    { name: 'home', label: 'Home', path: '/', icon: HomeSvg },
    { name: 'notifications', label: 'Notifications', path: '/notifications', icon: BellSvg },
    { name: 'bookmarks', label: 'Bookmarks', path: '/bookmarks', icon: BookmarkSvg },
    { name: 'profile', label: 'Profile', path: '/profile', icon: UserSvg },
    { name: 'settings', label: 'Settings', path: '/settings', icon: SettingsSvg },
] as const;