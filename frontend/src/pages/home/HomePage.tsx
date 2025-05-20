import HomeScreen from './HomeScreen';
import AuthLanding from './AuthLanding';

export default function HomePage() {
    const user = null;
    return <>{user ? <HomeScreen /> : <AuthLanding />}</>;
}
