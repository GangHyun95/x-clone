import useLogout from '@/hooks/auth/useLogout';

export default function HomeScreen() {
    const { logout } = useLogout();
    return <div onClick={logout}>로그아웃!</div>;
}
