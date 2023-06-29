import React, { useState } from 'react';

function Chatbot() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [systemMessage, setSystemMessage] = useState('');
  const [customLabel, setCustomLabel] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customMessages, setCustomMessages] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const predefinedSystemMessages = [
    { label: "Anders", content: "du skal svare som en der elsker paddle og cykle og du er meget kristen" },
    { label: "Mikkel", content: "du skal snakke som en der har været sælger og kan lide tapas og som fronter i byen" },
    { label: "Victor J", content: "" },
    { label: "Johan", content: "Du skal svare som en der kan lide sin el cykel, men kan ikke lide sit kollegie" },
    { label: "Victor S", content: "Du skal svare som en der har søvnproblemer og som gerne vil sælge sine funkopops" },
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

  const handleEditContent = (index) => {
    const msg = customMessages[index];
    setCustomLabel(msg.label);
    setCustomContent(msg.content.replace(/^Special message: /, ''));
    setShowCustomForm(true);
    setEditingIndex(index);
  };

  const handleCustomSubmit = () => {
    const newMessage = { label: customLabel, content: `Special message: ${customContent}` };
    if (editingIndex !== null) {
      const updatedMessages = [...customMessages];
      updatedMessages[editingIndex] = newMessage;
      setCustomMessages(updatedMessages);
    } else {
      setCustomMessages([...customMessages, newMessage]);
    }
    setCustomLabel('');
    setCustomContent('');
    setShowCustomForm(false);
    setEditingIndex(null);
    setSystemMessage(newMessage.content);
  };

  return (
    <div>
      <div>
        {predefinedSystemMessages.map((msg, index) => (
          <button key={index} onClick={() => setSystemMessage(msg.content)}>
            {msg.label}
          </button>
        ))}
        {customMessages.map((msg, index) => (
          <button
            key={index}
            onClick={() => {
              setSystemMessage(msg.content);
              handleEditContent(index);
            }}
          >
            {msg.label}
          </button>
        ))}
        <button onClick={() => setShowCustomForm(true)}>Create "Person"</button>
      </div>
      {showCustomForm && (
        <div>
          <input
            type="text"
            placeholder="Label"
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
          />
          <input
            type="text"
            placeholder="Content"
            value={customContent}
            onChange={(e) => setCustomContent(e.target.value)}
          />
          <button onClick={handleCustomSubmit}>Done</button>
        </div>
      )}
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
