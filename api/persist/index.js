const data = require('@begin/data')
const CryptoJS = require('crypto-js');
const dynamo = require('@begin/data/src/helpers/_dynamo').doc
let getTableName = require('@begin/data/src/helpers/_get-table-name')
let getKey = require('@begin/data/src/helpers/_get-key')
let createKey = require('@begin/data/src/helpers/_create-key')
let waterfall = require('run-waterfall')
let validate = require('@begin/data/src/helpers/_validate')
let unfmt = require('@begin/data/src/helpers/_unfmt')
let fmt = require('@begin/data/src/helpers/_fmt')

let arc = require('@architect/functions')
let parseBody = arc.http.helpers.bodyParser

const prettyPrintJSON = (json) => {
  console.log(`json value: \n${JSON.stringify(json, null, 4)}`);
}


function maybeCreateKey (params, callback) {
  if (params.key) {
    callback(null, fmt(params))
  }
  else {
    createKey(params.table, function _createKey (err, key) {
      if (err) callback(err)
      else {
        params.key = key
        callback(null, fmt(params))
      }
    })
  }
}

const persistDeckList = async (body) => {
  console.log(`MD5 HASH => ${CryptoJS.MD5(body?.url)}`);
  const id = `${CryptoJS.MD5(body?.url)}`;
  const urlSlug = body?.url?.substring(body?.url?.lastIndexOf(`/`) + 1);

  console.log(`persisting data for decklist ${body.url}; slug: ${urlSlug}`);
  
  let deckData = {
    id,
    data: { 
      ...body, 
      dateLastIndexed: ``,
      timesIndexed: ``,
    },
  }

  deckData.data.commanders = deckData.data.commanders.toString();

  try {
    let callback;
    let params = {
      table: 'decks_v3'
    };
    let Item = deckData;

    waterfall([
      function getKey (callback) {
        maybeCreateKey(params, callback)
      },
      function getTable (Item, callback) {
        getTableName(function done (err, TableName) {
          const tableName = TableName.substring(0, TableName.lastIndexOf(`data`));
          if (err) callback(err)
          else callback(null, `${tableName}decks`, Item)
        })
      },
      function _dynamo (TableName, Item, callback) {
        dynamo(function done (err, doc) {
          if (err) callback(err)
          else callback(null, TableName, Item, doc)
        })
      },
      function write (TableName, Item, doc, callback) {
        validate.size(Item)
        Item = {
          table: 'decks_v3',
          key: id,
          ...deckData.data,
        };
        console.log(`[SET] TableName ${TableName}`)
        console.log(`[SET] Item ${JSON.stringify(Item)}`)
        doc.put({
          TableName,
          Item
        },
        function done (err) {
          if (err) callback(err)
          else callback(null, unfmt(Item))
        })
      }
    ], callback)

    // await data.set({
    //   table: 'decks_v3',
    //   key: id,
    //   ...deckData.data,
    // })
  } catch (error) {
    console.log(`[ERROR] ${error}`)
  }

  return deckData;
}

exports.handler = async function http (requestObject) {
  try {
    const body = parseBody(requestObject); // Pass the entire request object
    const response = await persistDeckList(JSON.parse(body));
    
    return {
      headers: {
        'content-type': 'application/json; charset=utf8',
        'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
      },
      statusCode: 200,
      body: JSON.stringify(response),
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

