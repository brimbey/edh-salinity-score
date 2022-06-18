const data = require('@begin/data')
let arc = require('@architect/functions');
// const { APIUtils } = require('../common/APIUtils');
let parseBody = arc.http.helpers.bodyParser

const prettyPrintJSON = (json) => {
  console.log(`${JSON.stringify(json, null, 4)}`);
}

const formatSalt = (value) => {
    return Math.ceil(value * 10000) / 10000;
}

const getSaltList = async () => {
  console.log(`GETTING SALT LISTS`);

  let cached = await data.get({
    table: 'decks',
  });

  console.log(`GOT CACHED!`);
  prettyPrintJSON(cached);
  

  let retData = [];

  try {
    retData = cached.map((deck) => {
        return {
            ...deck.data,
            id: deck.id,
            salt: formatSalt(deck.data.salt),
        }
    });

    retData = retData.sort((a, b) => {
        return b?.salt - a?.salt;
    });
  } catch (error) {
    console.log(`[ERROR] ${error}`);
    retData = [];
  }

  // default
  return retData;
}

exports.handler = async function http () {
  const list = await getSaltList();

  return {
    headers: {
      'content-type': 'application/json; charset=utf8',
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
    },
    statusCode: 200,
    body: JSON.stringify(list)
  }
}

