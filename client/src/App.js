import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { SocketIOProvider } from 'use-socketio';

import './App.css';
import Home from './Home/Home';
import GameContainer from './GameContainer/GameContainer';

const ENDPOINT = 'http://localhost:4001';

function App() {
  return (
    <SocketIOProvider url={ENDPOINT}>
      <Router>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/game/:gameId' component={GameContainer} />
          <Route path='*'>
            <Redirect to='/' />
          </Route>
        </Switch>
      </Router>
    </SocketIOProvider>
  );
}

export default App;
