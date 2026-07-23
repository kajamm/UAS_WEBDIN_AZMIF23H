import nodemailer from 'nodemailer';
import { env } from '../config/env';

export const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465, // true for 465, false for other ports
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export const sendResetPasswordEmail = async (to: string, token: string) => {
  const mailOptions = {
    from: `"Sistem Kegiatan" <${env.SMTP_USER}>`,
    to,
    subject: 'Permintaan Reset Password',
    text: `Token reset password Anda adalah: ${token}\n\nToken ini berlaku selama 1 jam.`,
    html: `
      <h3>Permintaan Reset Password</h3>
      <p>Anda menerima email ini karena ada permintaan reset password untuk akun Anda.</p>
      <p>Berikut adalah token reset password Anda:</p>
      <h2 style="background: #f4f4f4; padding: 10px; display: inline-block;">${token}</h2>
      <p>Token ini hanya berlaku selama 1 jam.</p>
      <p>Jika Anda tidak merasa meminta reset password, abaikan email ini.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
