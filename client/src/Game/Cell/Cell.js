import React from 'react';

import './Cell.css';

const Cell = ({ value, clicked }) => {
  return (
    <div className='Cell' onClick={clicked}>
      {value}
    </div>
  );
};

export default Cell;
