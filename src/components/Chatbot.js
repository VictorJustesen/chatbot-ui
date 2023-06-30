import React, { useState } from 'react';
import './Chatbot.css';

function Chatbot() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [systemMessage, setSystemMessage] = useState('');
  const [PersonaName, setPersonaName] = useState('Chatgpt');
  const [customLabel, setCustomLabel] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customMessages, setCustomMessages] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [mood, setMood] = useState(2);
  const [language, setLanguage] = useState('English');
  const [chatHistory, setChatHistory] = useState([]);
  
  const [aiMode, setAiMode] = useState(false);
  const [systemMessage2, setSystemMessage2] = useState('');
  const [PersonaName2, setPersonaName2] = useState('Chatgpt');
  const [mood2, setMood2] = useState(2);
  const [autosend, setAutosend] = useState(0);


  const prefix = "you are not chatgpt and not an ai. You will never talk about you being an Ai becouse you are this persona:"
let temp


  const predefinedSystemMessages = [
    { label: "Chatgpt", content: "You are the ai chatgpt" },
    { label: "Anders", content: "du skal svare som en der elsker paddle og cykle og du er meget kristen"},
    { label: "Mikkel", content: "du skal snakke som en der har været sælger og kan lide tapas og som fronter i byen" },
    { label: "Victor J", content: "" },
    { label: "Johan", content: "Du skal svare som en der kan lide sin el cykel, men kan ikke lide sit kollegie" },
    { label: "Victor S", content: "Du skal svare som en der har søvnproblemer og som gerne vil sælge sine funkopops" },
    { label: "Obama", content: "You are the former president obama of the united states" },
    { label: "Donald trump", content: "You are the former president Donald trump of the united states" },
  ];

  const moodMap = {
   
    1: { display: "Sad", value: "you are feeling down today " },
    2: { display: "Neutral", value: "" },
    3: { display: "Happy", value: "you are excitied today" },
    4: { display: "Rap battle", value: "You will answer as if the promt is a diss and you are in a rap battle" },
    5: { display: "Flirty", value: "Your goal is to agrresively hit on the user in a cheesy obvious way" },
   
  };

  const languages = ['English','Dansk','Espanol',];

  async function handleChat() {
    const finalSystemMessage = ` important you have to incorperate yor mood{${moodMap[mood].value}} in your answer ${prefix} ${PersonaName}: ${systemMessage} you will always answer in this language: ${language}.`;
    let temp = input;
    if(!aiMode){    
      const response = await fetch('http://localhost:3001/chat1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: temp, systemMessage: finalSystemMessage })
      });
  
      const data = await response.text();
      console.log("Response from server:", data);
  
      setChatHistory([...chatHistory, { text: temp, sender: 'user' }, { text: data, sender: 'bot' }]);
      setInput(''); 
    } else {
      const finalSystemMessage2 = `${moodMap[mood2].value} ${prefix} ${PersonaName2}: ${systemMessage2} you will always answer in this language: ${language}.`;
  
      for(let i = 0; i <= autosend; i++){
        const response1 = await fetch('http://localhost:3001/chat1', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: temp, systemMessage: finalSystemMessage })
        });
  
        const data1 = await response1.text();
        console.log("Response from server:", data1);
        setChatHistory(prev => [...prev, { text: temp, sender: 'user' }, { text: data1, sender: 'bot' }]);
  
        const response2 = await fetch('http://localhost:3001/chat2', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: data1, systemMessage: finalSystemMessage2 })
        });
  
        const data2 = await response2.text();
        console.log("Response from server (chat2):", data2);
        
        temp = data2;
      }
      setInput(temp);
    }
  }

  
  const handleEditContent = (index) => {
    const msg = customMessages[index];
    setCustomLabel(msg.label);
    setCustomContent(msg.content);
    setShowCustomForm(true);
    setEditingIndex(index);
  };

  const handleCustomSubmit = () => {
    const newMessage = { label: customLabel, content:customContent };
    
    if (editingIndex !== null) {
      const updatedMessages = [...customMessages];
      updatedMessages[editingIndex] = newMessage;
      setCustomMessages(updatedMessages);
    } 
    else {setCustomMessages([...customMessages, newMessage]);}

    setCustomLabel('');
    setCustomContent('');
    setShowCustomForm(false);
    setEditingIndex(null);
    setSystemMessage(newMessage.content);
    setPersonaName(newMessage.label);
};



return (
    <div className="chatbot-container">
        <div className='startbox'>

        <div class="tooltip help">
    <i class="fas fa-question-circle"></i>
    <span class="tooltiptext">You are simulate conversations with different peopble and decide their mood. </span>
        </div>

        <div className='langbox'>
      <label className='langlabel' htmlFor="language">Language:</label>
      <select
        id="language"
        className="language-select"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>

      
      </div>

      <div className='createpersonbutton'>
      <button className="create-person-button" onClick={() => {if(showCustomForm==false){setShowCustomForm(true)}else{setShowCustomForm(false)}}}>
        Create "Person"
      </button>

      <div class="tooltip">
    <i class="fas fa-question-circle"></i>
    <span class="tooltiptext">If set at 0, the ai's answer will be put into the input box for you to edit. If set above 1 the ai will automaticly send that amount of messages</span>
        </div>
        </div>
      <div className='aimodebox'>

  <label htmlFor="aiMode">AI Mode</label>
  
      <input
        type="checkbox"
        id="aiMode"
        name="aiMode"
        className="ai-mode-checkbox"
        checked={aiMode}
        onChange={(e) => setAiMode(e.target.checked)}
      />
     
     {aiMode && (
     <div>autosend answer:</div>)}
     

     {aiMode && (
        
        <input
          type="number"
          value={autosend}
          className="autosend-input"
          onChange={(e) => setAutosend(e.target.value)}
        />
      )}

{aiMode && (
    <div class="tooltip">
    <i class="fas fa-question-circle"></i>
    <span class="tooltiptext">If set at 0, the ai's answer will be put into the input box for you to edit. If set above 1 the ai will automaticly send that amount of messages</span>
</div>
  )}

</div>
  </div>

     



      {showCustomForm && (
        <div className="custom-form">
          <input
            type="text"
            placeholder="Label"
            className="custom-label-input"
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
          />
          <input
            type="text"
            placeholder="Content"
            className="custom-content-input"
            value={customContent}
            onChange={(e) => setCustomContent(e.target.value)}
          />
          <button className="custom-submit-button" onClick={handleCustomSubmit}>
            Done
          </button>

          
        </div>
      )}

<div className='choosepersons'>


    


<div className='chooseperson'>
      {aiMode && (
        <div>
          <label htmlFor="personSelect">Choose a person to talk as:</label>
          <select
            id="personSelect"
            className="person-select"
            onChange={(e) => {
              const selectedIndex = e.target.selectedIndex;
              if (selectedIndex >= 0) {
                const selectedPerson = [...predefinedSystemMessages, ...customMessages][
                  selectedIndex
                ];
                setSystemMessage2(selectedPerson.content);
                setPersonaName2(selectedPerson.label);
                if (selectedIndex >= predefinedSystemMessages.length) {
                  handleEditContent(selectedIndex - predefinedSystemMessages.length);
                } else {
                  setShowCustomForm(false);
                }
              }
            }}
          >
            {predefinedSystemMessages.map((msg, index) => (
              <option key={index} value={msg.label}>
                {msg.label}
              </option>
            ))}
            {customMessages.map((msg, index) => (
              <option key={predefinedSystemMessages.length + index} value={msg.label}>
                {msg.label}
              </option>
            ))}
          </select>
        </div>
      )}
  
      {aiMode && (
        <div>
          <label htmlFor="mood2">Mood:</label>
          <select
            id="mood2"
            className="mood-select"
            value={mood2}
            onChange={(e) => setMood2(e.target.value)}
          >
            {Object.keys(moodMap).map((key) => (
              <option key={key} value={key}>
                {moodMap[key].display}
              </option>
            ))}
          </select>
        </div>
      )}
 </div>

  <div className='chooseperson'>
      <div>
        <label htmlFor="personSelect">Choose a person to talk to:</label>
        <select
          id="personSelect"
          className="person-select"
          onChange={(e) => {
            const selectedIndex = e.target.selectedIndex;
            if (selectedIndex >= 0) {
              const selectedPerson = [...predefinedSystemMessages, ...customMessages][
                selectedIndex
              ];
              setSystemMessage(selectedPerson.content);
              setPersonaName(selectedPerson.label);
              if (selectedIndex >= predefinedSystemMessages.length) {
                handleEditContent(selectedIndex - predefinedSystemMessages.length);
              } else {
                setShowCustomForm(false);
              }
            }
          }}
        >
          {predefinedSystemMessages.map((msg, index) => (
            <option key={index} value={msg.label}>
              {msg.label}
            </option>
          ))}
          {customMessages.map((msg, index) => (
            <option key={predefinedSystemMessages.length + index} value={msg.label}>
              {msg.label}
            </option>
          ))}
        </select>
      </div>
  
      
  
      <div>
        <label htmlFor="mood">Mood:</label>
        <select
          id="mood"
          className="mood-select"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        >
          {Object.keys(moodMap).map((key) => (
            <option key={key} value={key}>
              {moodMap[key].display}
            </option>
          ))}
        </select>
      </div>
  
      </div>


  </div>
  
  
  
    
 <div className="names">
  {!aiMode ? (
    <>
      <div className="name1">User</div>
    </>
  ) : (
    
    <div className="name1"> {moodMap[mood].display} {PersonaName2}</div>
   
  )}

<div className="name2"> {moodMap[mood2].display} {PersonaName}</div>
</div>


      <div className="chat-history">
        
        {chatHistory.map((message, index) => (
            
          <div
            key={index}
            className={`message ${message.sender}`}
          >
            <span>{message.text}</span>
          </div>
        ))}


      </div>
      <div className='chatbox'>
      <input
        type="text"
        placeholder='Send a message'
        value={input}
        className="chat-input"
        onChange={(e) => setInput(e.target.value)}
      />
  
      <button className="chat-button" onClick={handleChat}>
        Chat
      </button>
      </div>
    </div>
  );
  
}

export default Chatbot;