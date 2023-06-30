import React, { useState, useEffect } from 'react';

function Chatbot() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [systemMessage, setSystemMessage] = useState('');
  const [PersonaName, setPersonaName] = useState('');
  const [customLabel, setCustomLabel] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customMessages, setCustomMessages] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [mood, setMood] = useState(2);
  const [language, setLanguage] = useState('English');


  
  const prefix = "you are not chatgpt and not an ai. You will never talk about you being an Ai becouse you are this persona"

  const predefinedSystemMessages = [
    { label: "Anders", content: "du skal svare som en der elsker paddle og cykle og du er meget kristen" },
    { label: "Mikkel", content: "du skal snakke som en der har været sælger og kan lide tapas og som fronter i byen" },
    { label: "Victor J", content: "" },
    { label: "Johan", content: "Du skal svare som en der kan lide sin el cykel, men kan ikke lide sit kollegie" },
    { label: "Victor S", content: "Du skal svare som en der har søvnproblemer og som gerne vil sælge sine funkopops" },
    { label: "Obama", content: "You are the president obama of the united states" },
  ];

  const moodMap = {
   
    1: { display: "sad", value: "you are feeling down today" },
    2: { display: "neutral", value: "" },
    3: { display: "happy", value: "you are excitied today" },
    4: { display: "Rap battle", value: "You will answer as if the promt is a diss and you are in a rap battle" },
    5: { display: "Flirty", value: "Your goal is to agrresively seduce the user, you will always hit on them" },
   
  };

  const languages = [
    'English',
    'Dansk',
    'espanol',
    // ... you can add more languages
  ];

  const handleChat = () => {
    const finalSystemMessage = `${moodMap[mood].value}, ${prefix} ${PersonaName} ${systemMessage} you will always answer in this language:${language}.`;
  
     fetch('http://localhost:3001/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: input, systemMessage: finalSystemMessage })
    })
      .then(res => res.text())
      .then(data => {
        const userMessage = { sender: 'user', text: input };
       
        setChatHistory(prev => [...prev, userMessage]);
        
     })
      .catch(err => console.error(err));
  };

  const handleEditContent = (index) => {
    const msg = customMessages[index];
    setCustomLabel(msg.label);
    setCustomContent(msg.content); // Add this line
    setShowCustomForm(true);
    setEditingIndex(index);
  };

  const handleCustomSubmit = () => {
    const newMessage = { label: customLabel, content:customContent };
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
    setPersonaName(newMessage.label);

  };

  return (
    <div>
      <div>
        {predefinedSystemMessages.map((msg, index) => (
          <button key={index} onClick={() => {
            setSystemMessage(msg.content)
            setPersonaName(msg.label)}}>
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
     <div>
        <label htmlFor="mood">Mood:</label>
        <select
          id="mood"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        >
          {Object.keys(moodMap).map(key => (
            <option key={key} value={key}>{moodMap[key].display}</option>
          ))}
        </select>
      </div>
      <div>
  <label htmlFor="language">Language:</label>
  <select
    id="language"
    value={language}
    onChange={(e) => setLanguage(e.target.value)}
  >
    {languages.map(lang => (
      <option key={lang} value={lang}>{lang}</option>
    ))}
  </select>
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