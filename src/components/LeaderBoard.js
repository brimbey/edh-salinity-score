import React from 'react';
import {Cell, Column, Row, TableView, TableBody, TableHeader, Text} from '@adobe/react-spectrum'
import { ActionButton } from "@adobe/react-spectrum";

const stubData = [
  {
    "salt": 43.3105255085861,
    "title": "No one drinks Jobu's Rum.",
    "dateLastIndexed": "",
    "url": "https://www.moxfield.com/decks/iAIy9Vg85kGP4P0FCdooOg",
    "author": "Khan187",
    "timesIndexed": ""
  },
  {
    "salt": 97.15755206945028,
    "title": "p.esper. - i hate you",
    "url": "https://www.moxfield.com/decks/1zPcEmFwXUGEWW2-U1sQhg",
    "author": "bobkozilek",
    "authorAvatarUrl": "https://assets.moxfield.net/profile/profile-78719-65c4fa40-f937-4b65-adac-f402893cefd8",
    "authorProfileUrl": "http://google.com",
  },
{
  "salt": 97.15755206945028,
  "title": "p.esper. - i hate you",
  "url": "https://www.moxfield.com/decks/1zPcEmFwXUGEWW2-U1sQhg",
  "author": "bobkozilek",
  "authorAvatarUrl": "https://assets.moxfield.net/profile/profile-78719-65c4fa40-f937-4b65-adac-f402893cefd8",
  "authorProfileUrl": "http://google.com",
},
{
  "salt": 97.15755206945028,
  "title": "p.esper. - i hate you",
  "url": "https://www.moxfield.com/decks/1zPcEmFwXUGEWW2-U1sQhg",
  "author": "bobkozilek",
  "authorAvatarUrl": "https://assets.moxfield.net/profile/profile-78719-65c4fa40-f937-4b65-adac-f402893cefd8",
  "authorProfileUrl": "http://google.com",
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

    const decks = results;// stubData;
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

  openLinkFromGrid = (link) => {
    // console.log(`LINK :: ${link}`);
    
    if (link) {
      window.location.href = link;
    }
  }
    
  getCellRenderer = ((item, columnKey) => {
    let content;

    if (columnKey === "authorAvatarUrl") {
      const avatarUrl = item?.[columnKey] || `/resources/blank-user-avatar.png`;
      const authorUrl = item?.authorProfileUrl;
      console.log(`found: ${authorUrl}`);

      content =
        <ActionButton aria-label={item.author} onPress={() => { this.openLinkFromGrid(`${item?.authorProfileUrl}`) }}>
          <img src={avatarUrl} height="25px" alt={item.author}  />
        </ActionButton>;
    } else if (columnKey === "url") {
      const url = item?.url;
      console.log(`found deck url: ${url}`);
      const title = `${item.title}`;

      content =
        <ActionButton aria-label={title} onPress={() => { this.openLinkFromGrid(`${item?.url}`) }}>
          <Text style={{float: 'left'}}>{title}</Text>
        </ActionButton>;
    } else {
      content = item[columnKey];
    }


    return (
      <Cell>{content}</Cell>
    );
  });

  getColumnRenderer = ((item) => {
    let content;

    if (item.uid === "salt") {
      content =
      <img src="/resources/salt-shaker.png" height="25px" alt="Salt Score"  />
    } else {
      content = item.name;
    }


    return (
      <div>
        {content}
      </div>
    );
  });

  render() {
    let columns = [
        {name: '', uid: 'authorAvatarUrl', maxWidth: 15},
        // {name: 'Username', uid: 'author'},
        {name: 'Deck', uid: 'url'},
        {name: 'DA SALT', uid: 'salt', maxWidth: 100}
      ];
      
    let rows = this?.state?.dataSet || [];

    return (      
      <div style={{ padding: '20px'}}>
        <TableView
          aria-label="All time salt index"
          density='compact'
          width='static-size-6000' 
        >
          <TableHeader columns={columns}>
            {column => (
              <Column
                key={column.uid}
                align={column.uid === 'authorAvatarUrl' ? 'start' : 'start'}
                maxWidth={column.maxWidth}
              >
                {this.getColumnRenderer(column)}
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
    );
  }
}