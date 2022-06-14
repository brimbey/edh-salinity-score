const fetch = require('node-fetch');

const prettyPrintJSON = (json) => {
  console.log(`${JSON.stringify(json, null, 4)}`);
}

const getMoxfieldDeckList = async (sha) => {
  console.log(`GETTING DECK LIST`);

  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
    'maxRedirects': 20,
  };

  let response = await fetch(`https://api.moxfield.com/v2/decks/all/${sha}`, requestOptions);

  console.log(`response :: ${response.statusCode}`);
  console.log(`json`);
  prettyPrintJSON(response);
  

  let text = await response.text();
  
  const json = JSON.parse(text);

  console.log(`json 2`);
  prettyPrintJSON(json);

  // console.log(`${JSON.stringify(response}`);
  // prettyPrintJSON(json);
  // const json = response.json();


  return {
    ...json?.commanders,
    ...json?.mainboard,
  }
}

exports.handler = async function http (uri) {
  const decklist = uri.queryStringParameters.url;
  const sha = decklist.substring(decklist.lastIndexOf(`/`) + 1);

  console.log(`decklist api hit with sha: ${sha}`);

  const nodes = await getMoxfieldDeckList(sha);

  return {
    headers: {
      'content-type': 'application/json; charset=utf8',
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
    },
    statusCode: 200,
    body: JSON.stringify({ nodes })
  }
}

