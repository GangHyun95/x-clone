type EmptyStateProps = {
    title: string;
    description: string;
};

export default function EmptyState({ title, description }: EmptyStateProps) {
    return (
        <section className='max-w-[400px] mx-auto my-8 px-8'>
            <header className='flex flex-col'>
                <h2 className='text-4xl font-extrabold mb-2'>{title}</h2>
                <p className='text-gray-500 mb-7'>{description}</p>
            </header>
        </section>
    );
}
