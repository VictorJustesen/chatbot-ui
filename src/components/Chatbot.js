import React, { useState } from 'react';

function Chatbot() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleChat = () => {
    fetch('http://localhost:3001/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: input })
    })
    .then(res => res.text()) // Expect plain text
    .then(data => {
      console.log("Response from server:", data); // Log the response
      setResponse(data);
    })
    .catch(err => console.error(err));
  };
  
  

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleChat}>Chat</button>
      <div>{response}</div>
    </div>
  );
}

export default Chatbot;
