import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import {Aggregator} from "./aggregator/Aggregator";

const App = () => {
  const [message, setMessage] = useState('...loading')

  let decklistUrl = '';

  async function handleChange(event) {
    const url = event.target.value;
    decklistUrl = url;
  };

  useEffect(() => {
    async function fetchData () {
      try {
        console.log(`USING URL :: ${decklistUrl}`);
        const aggregator = new Aggregator();
        let data = await (await fetch(`/api/decklist?url=${decklistUrl}`)).json()

        const total = await aggregator.parseDeckList(data.nodes);

        setMessage(`YOUR SALT TOTAL IS ${total}`);
      } catch (err) {
        setMessage(err.message)
      }
    }

    fetchData()
  })

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{message}</p>

        <form>
          <label>
            Paste your moxfield deck like here
            <input type="text" name="name" />
          </label>
          <input type="submit" value="Submit" onChange={handleChange} />
        </form>
      </header>


    </div>
  );
}

export default App;
