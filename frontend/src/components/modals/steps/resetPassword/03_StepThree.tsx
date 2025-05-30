export default function StepThree({ onPrev, onNext }: { onPrev: () => void; onNext: () => void; }) {
    return (
        <form className='flex flex-col h-full'>
            <input type='hidden' name='isResend' value='true' />
            <div className='flex-1 overflow-auto px-8 md:px-20'>
                <div className='my-5'>
                    <h1 className='text-2xl md:text-4xl font-bold'>
                        We sent you a code
                    </h1>
                    <h3 className='text-sm text-gray-500 mt-2'>
                        Check your email to get your confirmation code. If you
                        need to request a new code, go back and reselect a
                        confirmation.
                    </h3>
                </div>

                <div className='py-3'>
                    <label htmlFor='code' className='floating-label'>
                        <input
                            id='code'
                            type='text'
                            placeholder='Enter your code'
                            className={`input input-xl w-full text-base peer placeholder:text-base focus:outline-0 focus:border-primary focus:ring-primary`}
                        />
                        <span className='floating-label label-text peer-focus:text-primary peer-focus:text-sm'>
                            Enter your code
                        </span>
                    </label>
                </div>

                <div className='mt-3'>
                    <span className='text-sm text-gray-500'>
                        Time remaining: 03:00
                    </span>
                </div>
            </div>

            <div className='flex flex-col items-stretch flex-none my-6 px-8 md:px-20'>
                <button className='btn w-full min-h-14 rounded-full text-base text-white bg-secondary hover:bg-secondary/90' onClick={onPrev}>
                    back
                </button>
                <button className='btn w-full min-h-14 rounded-full text-base text-white bg-secondary hover:bg-secondary/90' onClick={onNext}>
                    back
                </button>
            </div>
        </form>
    );
}
