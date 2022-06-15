const data = require('@begin/data')
let arc = require('@architect/functions')
let parseBody = arc.http.helpers.bodyParser

const prettyPrintJSON = (json) => {
  console.log(`${JSON.stringify(json, null, 4)}`);
}

const getSaltList = async () => {
  console.log(`GETTING SALT LISTS`);

  let cached = await data.get({
    table: 'cached-deck-list',
  });

  console.log(`GOT CACHED!`);
  prettyPrintJSON(cached);
  
  try {
    return cached.map((deck) => {
        return {
            ...deck.data,
        }
    })
  } catch (error) {
    console.log(`[ERROR] ${error}`);
  }

  // default
  return []
}

exports.handler = async function http () {
  const list = await getSaltList();

  return {
    headers: {
      'content-type': 'application/json; charset=utf8',
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
    },
    statusCode: 200,
    body: JSON.stringify({ list })
  }
}

