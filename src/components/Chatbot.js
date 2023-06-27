import React, { useState } from 'react';

function Chatbot() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [systemMessage, setSystemMessage] = useState(
    'Du er agneses kæreste, du skal svare hende som hendes kæreste som elsker hende og giver hende komplimanter og du skal være høflig og du elsker hende meget højt'
  );

  const predefinedSystemMessages = [
    { label: "Anders", content: "du skal svare som en der elsker paddle og cykle og du er meget kristen" },
    { label: "Mikkel", content: "du skal snakke som en der har været sælger og kan lide tapas og som fronter i byen" },
    { label: "Victor J", content: "" },
    { label: "Johan", content: "Du skal svare som en der kan lide sin el cykel, men kan ikke lide sit kollegie" },
    { label: "Victor S", content: "Du skal svare som en der har søvnproblemer og som gerne vil sælge sine funkopops" },
    // add more predefined messages...
  ];

  const handleChat = () => {
    fetch('http://localhost:3001/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: input, systemMessage })
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
      <div>
        {predefinedSystemMessages.map((msg, index) => (
          <button key={index} onClick={() => setSystemMessage(msg.content)}>
            {msg.label}
          </button>
        ))}
      </div>
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
