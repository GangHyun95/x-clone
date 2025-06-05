type Props = {
    src: string;
    alt?: string;
    className?: string;
    overlay?: boolean;
}
export default function Avatar({ src, alt='avatar', className, overlay=true }: Props) {
    return (
        <div className={`relative w-10 h-10 overflow-hidden rounded-full ${overlay && 'group'} ${className}`}>
            <div className='pb-[100%]' />
            <img
                src={src}
                alt={alt}
                className='absolute inset-0 object-cover'
            />
            {overlay && <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer' />}
        </div>
    );
}
