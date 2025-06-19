import { InlineSpinner } from '@/components/common/Spinner';

type Props = {
    label: string;
    isLoading: boolean;
    disabled: boolean;
    loadingLabel?: string;
    className?: string;
}

export default function AuthSubmitBtn({ label, isLoading, loadingLabel,  disabled, className = '' }: Props) {
    return (
        <button
            type='submit'
            className={`btn btn-secondary btn-circle w-full min-h-14 text-base hover:bg-secondary/90 ${className}`}
            disabled={disabled || isLoading}
        >   
            {isLoading ? (
                <InlineSpinner label={loadingLabel ?? label}/>
            ) : (
                <span>{label}</span>
            )}
        </button>
    );
}

