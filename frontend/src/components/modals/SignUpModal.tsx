import { useState } from 'react';
import ModalLayout from '@/layouts/ModalLayout';
import { StepOne, StepTwo, StepThree } from '@/components/modals/steps/signup';

export default function SignUpModal() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [expiresAt, setExpiresAt] = useState(0);

    const renderStepContent = () => {
        if (step === 1) {
            return (
                <StepOne
                    onNext={(email: string, expiresAt: number) => {
                        setEmail(email);
                        setExpiresAt(expiresAt);
                        setStep(2);
                    }}
                />
            );
        }

        if (step === 2) {
            return (
                <StepTwo
                    onNext={() => setStep(3)}
                    email={email}
                    expiresAt={expiresAt}
                    setExpiresAt={setExpiresAt}
                />
            );
        }

        if (step === 3) {
            return <StepThree />;
        }

        return <div>잘못된 단계입니다.</div>;
    };
    return (
        <ModalLayout className='md:!h-[450px]'>
            {renderStepContent()}
        </ModalLayout>
    );
}
