const fetch = require('node-fetch');


let cardList = [];

const prettyPrintJSON = (json) => {
  console.log(`${JSON.stringify(json, null, 4)}`);
}

const spacify = (text, length, prepend = false, fillerChar = " ") => {
  text = text.toString();

  if (text.length < length) {
    const delta = length - text.length;

    for (let i = 0; i < delta; i++) {
      text = prepend ? `${fillerChar}${text}` : `${text}${fillerChar}`;
    }
  }

  return text;
};

const getMoxfieldDeckList = async (sha) => {
  console.log(`GETTING DECK LIST`);

  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
    'maxRedirects': 20,
  };

  let response = await fetch(`https://api.moxfield.com/v2/decks/all/${sha}`, requestOptions);
  let text = await response.text();
  const json = JSON.parse(text);

  // console.log(`${JSON.stringify(response}`);
  // prettyPrintJSON(json);
  // const json = response.json();


  return {
    ...json.commanders,
    ...json.mainboard,
  }
}

exports.handler = async function http (uri) {
  const decklist = uri?.queryStringParameters?.url;
  const sha = decklist.substring(decklist.lastIndexOf(`/`) + 1);

  console.log(`decklist api hit with sha: ${sha}`);

  const nodes = await getMoxfieldDeckList(sha);
  // cardList = [];
  //
  // const cardnameList = [];
  //
  // Object.keys(nodes).forEach((cardname) => {
  //   cardnameList.push(cardname);
  // })
  //
  // for (let i = 0; i < cardnameList.length; i++) {
  //   const cardname = cardnameList[i];
  //   const sanitizedCardName = cardname.toLowerCase()
  //       .replace(`'`, '')
  //       .replace(` `, '-');
  //
  //   const data = await getEdhrecCardEntry(sanitizedCardName);
  //
  //   if (data?.salt) {
  //     cardList.push({
  //       name: cardname,
  //       salt: data.salt,
  //     });
  //   }
  // }
  //
  // const output = await printSummary();

  return {
    headers: {
      'content-type': 'application/json; charset=utf8',
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
    },
    statusCode: 200,
    body: JSON.stringify({ nodes })
  }
}

