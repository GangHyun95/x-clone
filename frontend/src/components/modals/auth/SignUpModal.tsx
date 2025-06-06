import { useState, type JSX } from 'react';

import AuthModalLayout from '@/layouts/AuthModalLayout';

import { StepOne, StepThree, StepTwo } from './steps/signup'

export default function SignUpModal() {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [signupInfo, setSignupInfo] = useState({
        email: '',
        fullName: '',
    });
    const [expiresAt, setExpiresAt] = useState(0);

    const { email, fullName } = signupInfo;

    const steps: Record<number, () => JSX.Element> = {
        1: () => (
            <StepOne
                onNext={({ email, fullName, expiresAt }) => {
                    setSignupInfo({ email, fullName });
                    setExpiresAt(expiresAt);
                    setStep(2);
                }}
            />
        ),
        2: () => (
            <StepTwo
                onNext={() => setStep(3)}
                email={email}
                expiresAt={expiresAt}
                setExpiresAt={setExpiresAt}
            />
        ),
        3: () => <StepThree email={email} fullName={fullName} />,
    };

    return (
        <AuthModalLayout>
            {steps[step]?.() ?? <div className='p-4'>잘못된 단계입니다.</div>}
        </AuthModalLayout>
    );
}
