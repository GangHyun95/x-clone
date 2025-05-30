export default function StepOne({ onNext }: { onNext: () => void }) {
    return (
        <form className='flex flex-col h-full'>
            <div className='flex-1 overflow-auto px-8 md:px-20'>
                <div className='my-5'>
                    <h1 className='text-2xl md:text-4xl font-bold'>
                        Find your X account
                    </h1>
                    <h3 className='text-sm text-gray-500 mt-2'>
                        Enter the email associated with your account to change
                        your password.
                    </h3>
                </div>

                <div className='py-3'>
                    <label htmlFor='email' className='floating-label'>
                        <input
                            id='email'
                            type='text'
                            placeholder='Email'
                            className={`input input-xl w-full text-base peer placeholder:text-base focus:outline-0 focus:border-primary focus:ring-primary`}
                        />
                        <span className='floating-label label-text peer-focus:text-primary peer-focus:text-sm'>
                            Email
                        </span>
                    </label>
                </div>
            </div>
            <div className='flex flex-col items-stretch flex-none my-6 px-8 md:px-20'>
                <button 
                    className='btn w-full min-h-14 rounded-full text-base text-white bg-secondary hover:bg-secondary/90'
                    onClick={onNext}
                >
                    Next
                </button>
            </div>
        </form>
    );
}
