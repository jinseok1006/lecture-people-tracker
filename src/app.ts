import 'dotenv/config.js';
import nodeMailer from 'nodemailer';
import { getPayload, request, parse } from './request';

const transporter = nodeMailer.createTransport({
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  secure: false,
});

export async function run(subject: string, div: string): Promise<void> {
  const payload = getPayload(subject);

  try {
    const data = await request(payload);
    const [numberOfPeople, seat] = parse(data, div);

    if (numberOfPeople === seat) {
      return console.log(
        `${subject} ${div}분반: ${numberOfPeople}/${seat} 최대인원`
      );
    }

    const res = await transporter.sendMail({
      to: process.env.MAIL_USER,
      subject: `${subject} ${div}분반 ${numberOfPeople}/${seat} 정원 감소`,
    });
    console.log('메일발송', res);
  } catch (err) {
    console.log(err);
  }
}
