import { Link } from 'react-router-dom';

type Props = {
    src: string;
    username?: string;
    alt?: string;
    className?: string;
}
export default function Avatar({ src, alt='avatar', className, username }: Props) {
    return (
        <div className={`relative bg-slate-300 w-10 h-10 overflow-hidden rounded-full shrink-0 ${username && 'group'} ${className}`}>
            <div className='pb-[100%]' />
            <img
                src={src || '/avatar-placeholder.png'}
                alt={alt}
                className='absolute inset-0 object-cover'
            />
            
            {username && (
                <Link
                    to={`/profile/${username}`}
                    onClick={(e) => e.stopPropagation()}
                    className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer'
                />
            )}
        </div>
    );
}
