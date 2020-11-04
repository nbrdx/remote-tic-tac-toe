import { useEffect, useState } from 'react';
import io from 'socket.io-client';

import './App.css';
import GameBoard from './GameBoard/GameBoard';

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

  const clickedButtonHandler = () => {
    // socket.emit('test', 'hello there');
    socket.emit('createRoom');
  }

  return (
    <div className='App'>
      <h1>Tic Tac Toe</h1>
      {/* <GameBoard /> */}
      <button onClick={clickedButtonHandler}>Create room</button>
    </div>
  );
}

export default App;
