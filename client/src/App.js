import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { SocketIOProvider } from 'use-socketio';

import './App.css';
import HomeActions from './HomeActions/HomeActions';
import GameContainer from './GameContainer/GameContainer';

const ENDPOINT = 'http://localhost:4001';

function App() {
  return (
    <SocketIOProvider url={ENDPOINT}>
      <Router>
        <div className='App'>
          <h1 className='Title'>Tic Tac Toe</h1>

          <Switch>
            <Route exact path='/' component={HomeActions} />
            <Route path='/game/:gameId' component={GameContainer} />
            <Route path='*'>
              <Redirect to='/' />
            </Route>
          </Switch>
        </div>
      </Router>
    </SocketIOProvider>
  );
}

export default App;
