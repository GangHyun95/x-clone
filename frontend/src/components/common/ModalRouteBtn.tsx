import { useNavigate } from 'react-router-dom';

type Props = {
    to: string;
    backgroundLocation?: string;
    replace?: boolean;
    className?: string;
    children: React.ReactNode;
};

export default function ModalRouteBtn({ to, backgroundLocation = '/', replace = false, className, children}: Props) {
    const navigate = useNavigate();
    return (
        <button
            type='button'
            className={className}
            onClick={() => navigate(to, { state: { backgroundLocation }, replace })}
        >
            {children}
        </button>
    );
}
