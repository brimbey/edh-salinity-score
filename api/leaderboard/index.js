const data = require('@begin/data')
const dynamo = require('@begin/data/src/helpers/_dynamo').doc
let getTableName = require('@begin/data/src/helpers/_get-table-name')
let getKey = require('@begin/data/src/helpers/_get-key')
let arc = require('@architect/functions');
let waterfall = require('run-waterfall')
let unfmt = require('@begin/data/src/helpers/_unfmt')
// const { APIUtils } = require('../common/APIUtils');
let parseBody = arc.http.helpers.bodyParser


const prettyPrintJSON = (json) => {
  console.log(`${JSON.stringify(json, null, 4)}`);
}

const formatSalt = (value) => {
    return Math.ceil(value * 10000) / 10000;
}

const getSaltList = async () => {
  let callback;
  let params = {
    table: 'decks_v3'
  };

  // boilerplague
  let promise
  if (!callback) {
    promise = new Promise(function (res, rej) {
      callback = function _errback (err, result) {
        console.log(`RESULT`);
        console.log(JSON.stringify(result));
        err ? rej(err) : res(result)
      }
    })
  }

  waterfall([
    getTableName,
    (TableName, callback) => { 
      console.log(`injected ::  ${JSON.stringify(TableName)}`);
      callback(null, TableName.replace(`data`, `decks`));
    },
    function _dynamo (TableName, callback) {
      console.log(`GOT TABLENAME :: ${TableName}`);
      dynamo(function done (err, doc) {
        if (err) callback(err)
        else callback(null, TableName, doc)
      })
    },
    function pager (TableName, doc, callback) {

      params.key = params.begin || 'UNKNOWN'
      let { scopeID, dataID } = getKey(params)
      dataID = dataID.replace('#UNKNOWN', '')
      // dataID = dataID.replace('undefined', 'decks_v3')

      console.log(`[scopeID] ${scopeID}`);
      console.log(`[dataID] ${dataID}`);
      console.log(`[TableName] ${TableName}`);

      let query = {
        TableName,
        Limit: params.limit || 10,
        KeyConditionExpression: '#scopeID = :scopeID and #salt = :salt',
        ExpressionAttributeNames: {
          '#scopeID': 'scopeID',
          '#salt': 'salt',
          // '#dataID': 'dataID'
        },
        ExpressionAttributeValues: {
          ':scopeID': scopeID,
          ':salt': 52.16020841374736, 
          // ':dataID': dataID,
        }
      }
      if (params.cursor) {
        query.ExclusiveStartKey = JSON.parse(Buffer.from(params.cursor, 'base64').toString('utf8'))
      }
      doc.query(query, callback)
    },
  ],
  function paged (err, result) {
    if (err) callback(err)
    else {
      let exact = item => item.table === params.table
      let returns = result.Items.map(unfmt).filter(exact)
      if (result.LastEvaluatedKey)
        returns.cursor = Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
      callback(null, returns)
    }
  })

  return promise
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

