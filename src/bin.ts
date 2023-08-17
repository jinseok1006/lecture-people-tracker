import { run } from './app';
const [node, bin, subject, div, interval] = process.argv;
const intervalSecond = parseFloat(interval);

if (process.env.NODE_ENV === 'production') {
  if (subject && interval && div) {
    console.log(`${subject} ${div}분반 ${interval}초 마다 요청...`);
    // setInterval(() => run(subject, div), 1000 * 60 * trackingIntervalMinute);
    tracker(subject, div);
  } else {
    console.error('강의명 분반 트래킹간격 순으로 인자를 입력해주세요');
  }
} else {
  setInterval(() => run('알고리즘', '4'), 5000);
}

function tracker(subject: string, div: string) {
  const trackingInterval = 1000 * intervalSecond;
  const mutation = (Math.random() * 5 - 2.5) * 1000;

  setTimeout(() => {
    run(subject, div);
    tracker(subject, div);
  }, trackingInterval + mutation);
}
