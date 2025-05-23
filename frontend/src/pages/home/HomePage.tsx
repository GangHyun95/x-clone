import HomeScreen from '@/pages/home/HomeScreen';
import AuthLanding from '@/pages/home/AuthLanding';

export default function HomePage() {
    const user = null;
    return <>{user ? <HomeScreen /> : <AuthLanding />}</>;
}
