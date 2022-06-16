import React from 'react';
import {Cell, Column, Row, TableView, TableBody, TableHeader} from '@adobe/react-spectrum'

const stubData = [
  {
    "salt": 97.15755206945028,
    "title": "p.esper. - i hate you",
    "url": "https://www.moxfield.com/decks/1zPcEmFwXUGEWW2-U1sQhg",
    "author": "bobkozilek",
    "authorAvatarUrl": "https://assets.moxfield.net/profile/profile-78719-65c4fa40-f937-4b65-adac-f402893cefd8"
},
{
  "salt": 97.15755206945028,
  "title": "p.esper. - i hate you",
  "url": "https://www.moxfield.com/decks/1zPcEmFwXUGEWW2-U1sQhg",
  "author": "bobkozilek",
  "authorAvatarUrl": "https://assets.moxfield.net/profile/profile-78719-65c4fa40-f937-4b65-adac-f402893cefd8"
},
{
  "salt": 97.15755206945028,
  "title": "p.esper. - i hate you",
  "url": "https://www.moxfield.com/decks/1zPcEmFwXUGEWW2-U1sQhg",
  "author": "bobkozilek",
  "authorAvatarUrl": "https://assets.moxfield.net/profile/profile-78719-65c4fa40-f937-4b65-adac-f402893cefd8"
},
  {
      "salt": 28.64082332404426,
      "author": "grumbledore",
      "authorAvatarUrl": "https://assets.moxfield.net/profile/profile-12325-84750aee-56a3-4a32-afd4-e393529e2622",
      "title": "Alela, the Instanced",
      "dateLastIndexed": "",
      "url": "https://www.moxfield.com/decks/OGjvYA5o1E6gtWh6vNU-aw",
      "timesIndexed": ""
  },
  {
      "salt": 72.61533450604912,
      "title": "Ragavan, the Wee Arsehole",
      "url": "https://www.moxfield.com/decks/ba2V0uVjzUmGKGe958nmcA",
      "author": "grumbledore",
      "authorAvatarUrl": "https://assets.moxfield.net/profile/profile-12325-84750aee-56a3-4a32-afd4-e393529e2622"
  },
  {
      "salt": 81.84616054375199,
      "title": "Sen Triplets, Friendship Ruination Committee",
      "url": "https://www.moxfield.com/decks/sHgMapORlEmNzZEGb_nrRw",
      "author": "grumbledore",
      "authorAvatarUrl": "https://assets.moxfield.net/profile/profile-12325-84750aee-56a3-4a32-afd4-e393529e2622"
  }
];

export class LeaderBoard extends React.Component {

  constructor(props) {
    super(props);

    this.setState({ dataSet: [] });
  }

  refreshGridList = async () => {
    const results = await (await fetch(`/api/leaderboard`)).json();

    const data = [];
    
    console.log(`GOT :: ${JSON.stringify(results)}`);

    const decks = results; //stubData
    // stubData.forEach((item) => {
    // results.forEach((item) => {
    for (let i = 0; i < decks?.length; i++) {
      const item = decks[i];

      console.log(`found :: ${item.url}`);
      data.push({
        id: `decklist_id_${i}`,
        ...item,
      })
    };

    this.setState({ dataSet: data });

    // TODO: remove
    stubData.push({});
  }

  componentDidMount = async () => {
    this.refreshGridList();
  }
    
  getCellRenderer = ((item, columnKey) => {
    console.log(`FOUND COLUMN KEY :: ${columnKey}`);
    console.log(`FOUND AUTHOR :: ${item?.author}`);
    // console.log(`FOUND COLUMN KEY :: ${JSON.stringify(item)}`);
    //alt={item.author}


    let content;

    if (columnKey === "authorAvatarUrl") {
      content = <img src={item[columnKey]} height="25px" alt="user avatar"  />
    } else {
      content = item[columnKey];
    }


    return (
      <Cell>{content}</Cell>
    );
  });

  render() {
    let columns = [
        {name: '', uid: 'authorAvatarUrl'},
        {name: 'Username', uid: 'author'},
        {name: 'Deck', uid: 'title'},
        {name: 'DA SALT', uid: 'salt'}
      ];
      
    let rows = this?.state?.dataSet || [];

    return (
      <div style={{ padding: '20px', width: "100%"}}>
        <div style={{display: "inline-block", width: "100%"}}>
          <TableView
            aria-label="Example table with dynamic content"
            width="100%" 
            maxWidth="800px">
            <TableHeader columns={columns}>
              {column => (
                <Column
                  key={column.uid}
                  align={column.uid === 'date' ? 'end' : 'start'}>
                  {column.name}
                </Column>
              )}
            </TableHeader>
            <TableBody items={rows}>
              {item => (
                <Row>
                  {columnKey => this.getCellRenderer(item, columnKey)}
                </Row>
              )}
              {/* {item => (
                <Row>
                  {columnKey => <Cell>{item[columnKey]}</Cell>}
                </Row>
              )} */}
            </TableBody>
          </TableView>
        </div>
      </div>
    );
  }
}