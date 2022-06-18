const data = require('@begin/data')
let arc = require('@architect/functions');
// const { APIUtils } = require('../common/APIUtils');
let parseBody = arc.http.helpers.bodyParser

const stubData = [
  {
    "id": "ccdf233e4ef583c3d07e2e68da09abc9",
    data: {
        "salt": 111.3378,
        "author": "bobkozilek",
        "commanders": ["Ragaskankavan"],
        "authorAvatarUrl": "https://assets.moxfield.net/profile/profile-78719-65c4fa40-f937-4b65-adac-f402893cefd8",
        "source": "moxfield",
        "title": "zur3",
        "authorProfileUrl": "https://www.moxfield.com/users/bobkozilek",
        "dateLastIndexed": "",
        "url": "https://www.moxfield.com/decks/S3_OUj3m0UatiYy2VMOM8Q",
        "timesIndexed": "",
        "id": "ccdf233e4ef583c3d07e2e68da09abc9"
    },
  },
  {
    "id": "ccdf233e4ef583c3d07e2e68da09abcsdfq3r9",
    data: {
      "salt": 81.8462,
      "commanders": ["Ragaskankavan"],
      "author": "grumbledore",
      "authorAvatarUrl": "https://assets.moxfield.net/profile/profile-12325-84750aee-56a3-4a32-afd4-e393529e2622",
      "source": "moxfield",
      "title": "Sen Triplets, Friendship Ruination Committee",
      "authorProfileUrl": "https://www.moxfield.com/users/grumbledore",
      "dateLastIndexed": "",
      "url": "https://www.moxfield.com/decks/sHgMapORlEmNzZEGb_nrRw",
      "timesIndexed": "",
      "id": "c7940c28156dbde0339dc204d94e7c12"
    }
  },
  {
    "id": "ccdf233e4ef583c3d07e2e68da09abc9ds123123f",
    data: {
      "salt": 72.6154,
      "commanders": ["Ragaskankavan"],
      "author": "grumbledore",
      "authorAvatarUrl": "https://assets.moxfield.net/profile/profile-12325-84750aee-56a3-4a32-afd4-e393529e2622",
      "source": "moxfield",
      "title": "Ragavan, the Wee Arsehole",
      "authorProfileUrl": "https://www.moxfield.com/users/grumbledore",
      "dateLastIndexed": "",
      "url": "https://www.moxfield.com/decks/ba2V0uVjzUmGKGe958nmcA",
      "timesIndexed": "",
      "id": "e910a61ffbf537b7c3d9164850701c84"
    }
  },
  {
    "id": "ccdf233e4ef583c3d07e2e68da09abc9sdfd",
    data: {
      "salt": 52.8813,
      "commanders": ["Ragaskankavan", "Sextuples"],
      "author": "grumbledore",
      "authorAvatarUrl": "https://assets.moxfield.net/profile/profile-12325-84750aee-56a3-4a32-afd4-e393529e2622",
      "source": "moxfield",
      "title": "Rakdos, Lord of Death Punchies",
      "authorProfileUrl": "https://www.moxfield.com/users/grumbledore",
      "dateLastIndexed": "",
      "url": "https://www.moxfield.com/decks/kchtLi5Kmk2K94zHoNlXMA",
      "timesIndexed": "",
      "id": "25fc173802ccc249aad3edc0f7b27714"
    }
  },
]

const prettyPrintJSON = (json) => {
  console.log(`${JSON.stringify(json, null, 4)}`);
}

const formatSalt = (value) => {
    return Math.ceil(value * 10000) / 10000;
}

const getSaltList = async () => {
  let cached = {};

  try {
    cached = await data.get({
      table: 'decks',
    });
  } catch (error) {
    cached = stubData;
  }

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

