import React from 'react';

import './Cell.css';

const Cell = ({ index, value, clicked }) => {
  return <div className='cell' onClick={clicked}>{value}</div>;
};

export default Cell;
