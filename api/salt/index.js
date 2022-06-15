const fetch = require('node-fetch');
const data = require('@begin/data')
let arc = require('@architect/functions')
let parseBody = arc.http.helpers.bodyParser

const prettyPrintJSON = (json) => {
  console.log(`json value: \n${JSON.stringify(json, null, 4)}`);
}

const getEdhrecCardEntry = async (cardname = '') => {
  let cached = await data.get({
    table: 'cached-card-list',
    key: cardname
  });

  
  // prettyPrintJSON(cached);

  if (!cached?.data?.salt) {
    const requestOptions = {
      'method': 'GET',
      'hostname': 'cards.edhrec.com',
      'path': '/thassas-oracle',
      'headers': {
      },
      'maxRedirects': 20
    };
  
    const response = await fetch(`https://cards.edhrec.com/${cardname}`, requestOptions);
    const text = await response.text();
    const json = JSON.parse(text);

    await data.set({
      table: 'cached-card-list',
      key: cardname,
      data: { salt: json.salt },
    })
  
    return json;
  }

  console.log(`RETURNING CACHED VALUE FOR ${cardname}: ${cached?.data?.salt}`);
  return {
    salt: cached.data.salt,
  }
}

const persistDeckList = async (body) => {
  const urlSlug = body?.url?.substring(body?.url?.lastIndexOf(`/`) + 1);
  console.log(`persisting data for decklist ${body.url}; slug: ${urlSlug}`);
  prettyPrintJSON(body);

  await data.set({
    table: 'cached-deck-list',
    key: urlSlug,
    data: { ...body },
  })

  console.log(`... done`);
}

exports.handler = async function http (requestObject) {
  try {
    const body = parseBody(requestObject); // Pass the entire request object
    await persistDeckList(JSON.parse(body));
    
    return {
      headers: {
        'content-type': 'application/json; charset=utf8',
        'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
      },
      statusCode: 200,
    }
  } catch (error) {
    console.log(`[ERROR] ${error}`);
    return {
      headers: {
        'content-type': 'application/json; charset=utf8',
        'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
      },
      statusCode: 500,
      body: JSON.stringify({ message: error }),
    }
  }
}

