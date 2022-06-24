const data = require('@begin/data')
const dynamo = require('@begin/data/src/helpers/_dynamo').doc
let getTableName = require('@begin/data/src/helpers/_get-table-name')
let getKey = require('@begin/data/src/helpers/_get-key')
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
  let cached = {};


  
  let callback
  // let promise
  let listData = [];
  // if (!callback) {
  //   promise = new Promise(function (res, rej) {
      // callback = function _errback (err, result) {
      //   if (err) {
      //     console.log(`[ERROR (callback)] ${err}`);
      //   }
        
      //   console.log(`RESULT`);
      //   prettyPrintJSON(result);
      //   listData = result;
      //   // err ? rej(err) : res(result)
      // };
  //   })
  // }


  await dynamo(async (err, doc) => {
    console.log(`sdfsdfsdf`);
    
    if (err) {
      console.log(`[ERROR] ${err}`);
      return [];
    }
    // if (err) callback(err)
    // else callback(null, `decks_v3`, doc)
    console.log(`LDFKSLDKFD`);
    // err ? rej(err) : res(result)
    console.log(`DOC :: ${doc}`);

    let { scopeID, dataID } = getKey({})
    // dataID = dataID.replace('#UNKNOWN', '')
    dataID = `staging#decks_v3`;
    console.log(`[scopeID] ${scopeID}`);
    console.log(`[dataID] ${dataID}`);


    let query = {
      TableName: `begin-app-staging-data`,
      Limit: 10,
      // KeyConditionExpression:  '#scopeID = :scopeID and #salt > :salt',//"#status = :status and #createdAt > :createdAt",
      KeyConditionExpression: '#scopeID = :scopeID and begins_with(#dataID, :dataID)',
      // FilterExpression: '#salt > :salt',
      ExpressionAttributeNames: {
        '#scopeID': 'scopeID',
        '#dataID': 'dataID',
        // '#salt': 'salt',
      },
      ExpressionAttributeValues: {
        ':scopeID': scopeID,
        ':dataID': dataID,
        // ':salt': 90,
      }
    }
    // if (params.cursor) {
    //   query.ExclusiveStartKey = JSON.parse(Buffer.from(params.cursor, 'base64').toString('utf8'))
    // }
    var result = await doc.query(query).promise()
    console.log(JSON.stringify(result))

    // await doc.query(query, (err, result) => {
    //   if (err) {
    //     console.log(`[ERROR (callback)] ${err}`);
    //   }
      
    //   console.log(`RESULT`);
    //   prettyPrintJSON(result);
    //   listData = result;
    //   // err ? rej(err) : res(result)
    // })
  })

  

  console.log(`RETURNING`);
  // return data;
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

