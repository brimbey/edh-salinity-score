const fetch = require('node-fetch');
const data = require('@begin/data')
const begin = require('@architect/functions') // Reads & writes session data

const prettyPrintJSON = (json) => {
  console.log(`json value: \n${JSON.stringify(json, null, 4)}`);
}

const getEdhrecCardEntry = async (cardname = '') => {
  let cached = null;

  try {
    cached = await data.get({
      table: 'cards',
      key: cardname
    });
  } catch(error) {
    // do nothing
  }

  
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

    try {
      await data.set({
        table: 'cards',
        key: cardname,
        data: { salt: json.salt },
      })
    } catch(error) {
      // do nothing
    }
  
    return json;
  }
  
  return {
    salt: cached.data.salt,
  }
  
}

exports.handler = async function http (requestObject) {
  const cardname = requestObject?.queryStringParameters?.card;
  console.log(`card api hit with cardname: ${cardname}`);

  if (cardname?.length > 0) {
    const sanitizedCardName = cardname?.toLowerCase()
        .replace(/,|'/g, '')
        .replace(/ /g, '-');

    const card = await getEdhrecCardEntry(sanitizedCardName);

    return {
      headers: {
        'content-type': 'application/json; charset=utf8',
        'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
      },
      statusCode: 200,
      body: JSON.stringify({...card})
    }
  } else {
    return {
      headers: {
        'content-type': 'application/json; charset=utf8',
        'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
      },
      statusCode: 404,
      body: JSON.stringify({ message: `not found` }),
    }
  }
}

