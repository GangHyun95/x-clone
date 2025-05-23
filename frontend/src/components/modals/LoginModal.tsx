import { useState } from 'react';
import ModalLayout from '@/layouts/ModalLayout';
import { StepOne, StepTwo } from '@/components/modals/steps/login';

export default function LoginModal() {
    const [step, setStep] = useState(1);

    const renderStepContent = () => {
        if (step === 1) return <StepOne onNext={() => setStep(2)} />;
        if (step === 2) return <StepTwo />;
    };
    return <ModalLayout>{renderStepContent()}</ModalLayout>;
}
