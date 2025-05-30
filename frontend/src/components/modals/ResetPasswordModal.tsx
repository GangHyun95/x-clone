import { useState, type JSX } from 'react';

import {
    StepFour,
    StepOne,
    StepThree,
    StepTwo,
} from '@/components/modals/steps/resetPassword';
import ModalLayout from '@/layouts/ModalLayout';

export default function ResetPasswordModal() {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(4);
    const steps: Record<number, JSX.Element> = {
        1: <StepOne onNext={() => setStep(2)} />,
        2: <StepTwo onNext={() => setStep(3)} />,
        3: <StepThree onPrev={() => setStep(2)} onNext={() => setStep(4)} />,
        4: <StepFour />,
    };
    return (
        <ModalLayout>
            {steps[step] || <div className='p-4'>잘못된 단계입니다</div>}
        </ModalLayout>
    );
}
