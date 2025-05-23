import { useState } from 'react';
import ModalLayout from '@/layouts/ModalLayout';
import { StepOne, StepTwo } from '@/components/modals/steps/signup';

export default function SignUpModal() {
    const [step, setStep] = useState(1);

    const renderStepContent = () => {
        if (step === 1) return <StepOne onNext={() => setStep(2)} />;
        if (step === 2) return <StepTwo />;
    };
    return (
        <ModalLayout className='md:!h-[450px]'>
            {renderStepContent()}
        </ModalLayout>
    );
}
