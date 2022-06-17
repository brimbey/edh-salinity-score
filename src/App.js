import React from 'react';
import './App.css';
import { MainView } from './components/MainView';
import { defaultTheme, Provider as ProviderV3 } from '@adobe/react-spectrum';

class App extends React.Component {
  render() {
      return (
        <div className="App-body" >
          <ProviderV3 height="100%" width="100%" theme={defaultTheme} colorScheme="dark">
                <MainView />
          </ProviderV3>
        </div>
    );
  }
}

export default App;
