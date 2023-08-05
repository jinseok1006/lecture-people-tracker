import * as cheerio from 'cheerio';

export function getPayload(subject: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <Root xmlns="http://www.nexacroplatform.com/platform/dataset">
    <Parameters>
      <Parameter id="gvYy">2017</Parameter>
      <Parameter id="gvShtm">U211600010</Parameter>
      <Parameter id="yy">2023</Parameter>
      <Parameter id="shtm">U211600020</Parameter>
      <Parameter id="fg" />
      <Parameter id="value1" />
      <Parameter id="value2" />
      <Parameter id="value3" />
      <Parameter id="sbjtNm">${subject}</Parameter>
      <Parameter id="profNm"></Parameter>
      <Parameter id="openLectFg" />
      <Parameter id="sType">EXT1</Parameter>
    </Parameters>
  </Root>
  `;
}

function getHeader() {
  if (!process.env.REFERER_URL) throw new Error('REQUEST_URL undefined');

  const headers = {
    'Content-Type': 'application/xml',
    'X-Requested-With': 'XMLHttpRequest',
    Referer: process.env.REFERER_URL,
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
  };
  return headers;
}

const headers = getHeader();

export async function request(payload: string): Promise<string> {
  if (!process.env.REQUEST_URL) throw new Error('REQUEST_URL undefined');

  const response = await fetch(process.env.REQUEST_URL, {
    method: 'post',
    body: payload,
    headers,
  });

  if (!response.ok) {
    const err = await response.text();
    throw err;
  }

  const data = await response.text();
  return data;
}

export function parse(data: string, div: string): [number, number] {
  const $ = cheerio.load(data, { xml: true });
  const classes = $('Rows').find('Row');
  const cls = classes
    .filter((i, e) => $(e).find('Col[id="CLSS"]').text() === div)
    .first();

  if (cls.length === 0)
    throw new Error(`해당 강의의 ${div}분반이 존재하지 않습니다.`);

  const numberOfPeople = cls.find('Col[id="TLSNRCNT"]').text();
  const seat = cls.find('Col[id="ALLWRCNT"]').text();

  return [parseInt(numberOfPeople), parseInt(seat)];
}
