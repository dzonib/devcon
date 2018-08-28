import React from 'react';

const errorFunc = (value) => {
  if (value) {
    return <small className="text-danger">{value}</small>
  } 
}

export default errorFunc