import { useState } from 'react';
import ModalLayout from '@/layouts/ModalLayout';
import { StepOne, StepTwo, StepThree } from '@/components/modals/steps/signup';

export default function SignUpModal() {
    const [step, setStep] = useState(1);
    const [signupInfo, setSignupInfo] = useState({
        email: '',
        fullName: '',
    });
    const [expiresAt, setExpiresAt] = useState(0);

    const { email, fullName } = signupInfo;

    const renderStepContent = () => {
        if (step === 1) {
            return (
                <StepOne
                    onNext={({ email, fullName, expiresAt }) => {
                        setSignupInfo((prev) => ({ ...prev, email, fullName }));
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
            return <StepThree email={email} fullName={fullName} />;
        }

        return <div>잘못된 단계입니다.</div>;
    };
    return (
        <ModalLayout className='md:!h-[450px]'>
            {renderStepContent()}
        </ModalLayout>
    );
}
