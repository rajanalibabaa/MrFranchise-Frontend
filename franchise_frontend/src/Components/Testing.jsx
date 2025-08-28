import React from 'react'
import socket from '../Utils/Socket'

const Testing = () => {
    const handleSocket = async () => {
        socket.emit("newbrand","approved"); 
    }
  return (
    <div>
        <h1>Testing</h1>
        <button onClick={handleSocket}>Submit</button>
    </div>
  )
}

export default Testing