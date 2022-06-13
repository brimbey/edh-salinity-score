import React, { useState, useEffect } from 'react';
import './App.css';
import { SubmitForm } from './components/SubmitForm';
import { MainView } from './components/MainView';
import { defaultTheme, Provider as ProviderV3 } from '@adobe/react-spectrum';

// const App = () => {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <MainView />
//       </header>


//     </div>
//   );
// }

// export default App;

class App extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {
      return (
          <ProviderV3 height={`100%`} theme={defaultTheme} colorScheme="dark">
            <div className="App">
              <header className="App-header">
                <MainView />
              </header>
            </div>
          </ProviderV3>
    );
  }
}

export default App;
