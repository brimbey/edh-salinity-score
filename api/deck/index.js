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
  let text = await response.text();
  const json = JSON.parse(text);

  let legal = json?.format === "commander" && json?.mainboardCount === 100;
  console.log(`legal: ${legal}; format ${json?.format}, count: ${json?.mainboardCount}`);
  
  if (legal) {
    // json?.mainboard?.forEach((data) => {
    //   if (data?.card?.legalities?.commander !== "legal") {
    //     console.log(`FOUND ILLEGAL CARD :: ${card?.card?.name}`)
    //     legal = false;
    //   }
    // });
  }

  return {
    commanders: {
      ...json?.commanders,
    },
    cards: {
      ...json?.commanders,
      ...json?.mainboard,
    },
    author: {
      ...json?.createdByUser,
    },
    url: json?.publicUrl,
    name: json?.name,
    legal: legal,
  }
}

exports.handler = async function http (requestObject) {
  const url = requestObject.queryStringParameters.url;
  const sha = url?.substring(url?.lastIndexOf(`/`) + 1);

  console.log(`deck api hit with sha: ${sha}`);

  const deck = await getMoxfieldDeckList(sha);

  return {
    headers: {
      'content-type': 'application/json; charset=utf8',
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
    },
    statusCode: 200,
    body: JSON.stringify({ deck })
  }
}

