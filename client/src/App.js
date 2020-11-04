import { useEffect, useState } from 'react';
import io from 'socket.io-client';

import './App.css';
import GameBoard from './GameBoard/GameBoard';
import Messaging from './Messaging/Messaging';

const ENDPOINT = 'http://localhost:4001';

function App() {
  const [socket, setSocket] = useState(null);
  const [response, setResponse] = useState('');

  useEffect(() => {
    const socket = io(ENDPOINT);
    setSocket(socket);

    socket.on('FromAPI', (data) => {
      setResponse(data);
    });

    return () => socket.disconnect();
  }, []);

  const clickedHandler = () => {
    socket.emit('test', 'hello there');
  }

  return (
    <div className='App'>
      <h1>Tic Tac Toe</h1>
      {/* <GameBoard /> */}
      {/* <Messaging /> */}
      <p>
        It's <time dateTime={response}>{response}</time>
      </p>
      <button onClick={clickedHandler}>Emit event</button>
    </div>
  );
}

export default App;
