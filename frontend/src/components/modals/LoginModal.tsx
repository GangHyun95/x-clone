import { useState } from 'react';
import ModalLayout from '@/layouts/ModalLayout';
import { StepOne, StepTwo } from '@/components/modals/steps/login';

export default function LoginModal() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');

    const renderStepContent = () => {
        if (step === 1) return <StepOne onNext={({ email }) => {
            setEmail(email)
            setStep(2);
        }} />;
        if (step === 2) return <StepTwo email={email}/>;
    };
    return <ModalLayout>{renderStepContent()}</ModalLayout>;
}
