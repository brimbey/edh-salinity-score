const data = require('@begin/data')
let arc = require('@architect/functions')
let parseBody = arc.http.helpers.bodyParser

const prettyPrintJSON = (json) => {
  console.log(`json value: \n${JSON.stringify(json, null, 4)}`);
}

const persistDeckList = async (body) => {
  const urlSlug = body?.url?.substring(body?.url?.lastIndexOf(`/`) + 1);
  console.log(`persisting data for decklist ${body.url}; slug: ${urlSlug}`);
  prettyPrintJSON(body);

  await data.set({
    table: 'cached-deck-list',
    key: urlSlug,
    data: { 
      ...body, 
      dateLastIndexed: ``,
      timesIndexed: ``,
    },
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

