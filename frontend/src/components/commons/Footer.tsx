export default function Footer() {
    return (
        <footer className='px-8 border-t border-gray-800'>
            <div className='flex items-center justify-between gap-4 h-14'>
                <p className='text-balance text-center text-sm leading-loose text-muted-foreground md:text-left'>
                    소스 코드는{' '}
                    <a
                        href='https://github.com/GangHyun95/x-clone'
                        target='_blank'
                        rel='noreferrer'
                        className='font-medium underline underline-offset-4'
                    >
                        GitHub
                    </a>{' '}
                    에서 확인하실 수 있습니다.
                </p>
            </div>
        </footer>
    );
}
