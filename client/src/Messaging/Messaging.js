import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

import './Messaging.css';

const Messaging = ({socket}) => {
  const [inputValue, setInputValue] = useState('');

  // useEffect(() => {
  //   // const socket = ;

  //   socket.on('connect', () => {
  //     console.log('connected: ' + socket.connected);
  //   });
  // }, [socket]);

  const submitFormHandler = (event) => {
    event.preventDefault();
    socket.emit('chat message', event.target.value);
  };

  return (
    <React.Fragment>
      <ul id='messages'></ul>
      <form onSubmit={submitFormHandler}>
        <input
          autoComplete='off'
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
        <button>Send</button>
      </form>
    </React.Fragment>
  );
};

export default Messaging;
