import { useState, type JSX } from 'react';
import { StepFour, StepOne, StepThree, StepTwo } from '@/components/modals/steps/resetPassword';

import ModalLayout from '@/layouts/ModalLayout';

export default function ResetPasswordModal() {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [email, setEmail] = useState('');
    const [expiresAt, setExpiresAt] = useState(0);
    const steps: Record<number, JSX.Element> = {
        1: (
            <StepOne
                onNext={({ email }) => {
                    setEmail(email);
                    setStep(2);
                }}
            />
        ),
        2: (
            <StepTwo
                onNext={({ expiresAt }) => {
                    setStep(3);
                    setExpiresAt(expiresAt);
                }}
                email={email}
            />
        ),
        3: (
            <StepThree
                email={email}
                expiresAt={expiresAt}
                onPrev={() => setStep(2)}
                onNext={() => setStep(4)}
            />
        ),
        4: <StepFour
            email={email}
        />,
    };
    return (
        <ModalLayout>
            {steps[step] || <div className='p-4'>잘못된 단계입니다</div>}
        </ModalLayout>
    );
}
