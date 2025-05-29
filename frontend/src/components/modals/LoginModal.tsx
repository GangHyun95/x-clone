import { useState, type JSX } from 'react';

import { StepOne, StepTwo } from '@/components/modals/steps/login';
import ModalLayout from '@/layouts/ModalLayout';

export default function LoginModal() {
    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState('');

    const steps: Record<1 | 2, () => JSX.Element> = {
        1: () => (
            <StepOne
                onNext={({ email }) => {
                    setEmail(email);
                    setStep(2);
                }}
            />
        ),
        2: () => <StepTwo email={email} />,
    };

    return (
        <ModalLayout>
            {steps[step]?.() ?? <div>잘못된 단계입니다.</div>}
        </ModalLayout>
    );
}
