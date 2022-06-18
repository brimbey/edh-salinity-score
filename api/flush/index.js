const data = require('@begin/data')

exports.handler = async function http (uri) {

    console.log(`FLUSHING DATA`);
    try {
        await data.destroy({table: 'decks'});
        await data.destroy({table: 'cards'});
      } catch(error) {
        // do nothing
      }

    return {
        headers: {
        'content-type': 'application/json; charset=utf8',
        'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
        },
        statusCode: 200,
        body: JSON.stringify({ message: `done` })
    }
}

