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

let latestMailingTime = new Date(0);

export async function run(subject: string, div: string): Promise<void> {
  const payload = getPayload(subject);

  try {
    const data = await request(payload);
    const [numberOfPeople, seat] = parse(data, div);

    // 인원 변동 확인
    if (numberOfPeople === seat) {
      return console.log(`${subject} ${div}분반: ${numberOfPeople}/${seat} 최대인원`);
    }

    // 최근에 발송한 경우 미발송
    const now = new Date();
    const gap = now.getTime() - latestMailingTime.getTime();
    const gapMinutes = (gap / 1000) * 60;
    if (gapMinutes <= 5) {
      return console.log(
        `마지막 메일 발송 시각: ${latestMailingTime.getHours()}:${latestMailingTime.getMinutes()}`
      );
    }

    const res = await transporter.sendMail({
      to: process.env.MAIL_USER,
      subject: `${subject} ${div}분반 ${numberOfPeople}/${seat} 정원 감소`,
    });
    latestMailingTime = now;
    console.log('메일발송 성공', res);
  } catch (err) {
    console.log(err);
  }
}
