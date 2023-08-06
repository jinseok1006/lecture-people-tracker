import { run } from './app';
const [node, bin, subject, div, interval] = process.argv;

if (process.env.NODE_ENV === 'production') {
  if (subject && interval && div) {
    const trackingIntervalMinute = parseInt(interval);

    console.log(`${subject} ${div}분반 ${interval}분 마다 요청...`);
    setInterval(() => run(subject, div), 1000 * 60 * trackingIntervalMinute);
  } else {
    console.error('강의명 분반 트래킹간격 순으로 인자를 입력해주세요');
  }
} else {
  setInterval(() => run('알고리즘', '4'), 5000);
}
