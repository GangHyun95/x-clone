import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (email: string, code: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    await transporter.sendMail({
        from: `"X Clone" <${process.env.SMTP_USER}>`,
        to: email,
        subject: '이메일 인증번호',
        text: `인증번호는 ${code} 입니다.`,
    });
};
