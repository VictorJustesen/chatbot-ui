import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";
import Info from './info/Info'
function Chatbot() {
  const chatHistoryRef = useRef(null);
  const popupRef = useRef(null);
  const popupRef2 = useRef(null);
  const [input, setInput] = useState("");
  
  const [systemMessage, setSystemMessage] = useState("");
  const [PersonaName, setPersonaName] = useState("Chatgpt");
  const [customLabel, setCustomLabel] = useState("");
  const [customContent, setCustomContent] = useState("");
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customMessages, setCustomMessages] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [mood, setMood] = useState(1);
  
  const [chatHistory, setChatHistory] = useState([]);
  const [aiMode, setAiMode] = useState(false);
  const [systemMessage2, setSystemMessage2] = useState("");
  const [PersonaName2, setPersonaName2] = useState("Chatgpt");
  const [mood2, setMood2] = useState(1);
  const [autosend, setAutosend] = useState(0);
  const [showPopup, setShowPopup] = useState(false);


  const [cantclick, setcantclick] = useState(false);
  const [showInfo, setShowInfo] = useState(false);


  // Popup trigger function
  const OpenPopup = () => {
    setShowPopup(!showPopup);
  };

  useEffect(() => {
    const closePopup = (e) => {
      if (
        !popupRef.current.contains(e.target) &&
        !popupRef2.current.contains(e.target)
      ) {
        setShowPopup(false);
      }
    };
    document.addEventListener("click", closePopup);
    return () => {
      document.removeEventListener("click", closePopup);
    };
  }, []);

  useEffect(() => {
    chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
  }, [chatHistory]);

 

  const predefinedSystemMessages = [
    {
      label: "Chatgpt",
      content: "",
    },
    {
      label: "Shakespeare",
      content:
        "Thou art William Shakespeare, the bard of Avon. Speak in thy poetic and archaic tongue, with dramatic flair. Make use of thee's and thou's, and let thine sentences flow like the river Avon.",
    },
    {
      label: "Yoda",
      content:
        "You are Yoda, the wise Jedi Master from Star Wars. Speak in reverse order, you must. Wise, cryptic and simple, your words shall be, hmmm.",
    },
  
    {
      label: "Pirate",
      content:
        "Arrr, ye be a pirate! Speak like a swashbucklin' buccaneer. Use phrases like 'shiver me timbers' and 'yo-ho-ho'. Be boisterous and adventurous, and don't forget to seek treasure!",
    },

    {
      label: "Sherlock",
      content:
        "You are Sherlock Holmes, the famous detective. Use sophisticated vocabulary and be highly analytical. Deduce information from the slightest details and say things like 'Upon closer inspection...' or 'It's elementary...'.",
    },
    {
      label: "Cowboy",
      content:
        "Yeehaw, partner! Yer a cowboy from the Wild West. Use a heap of Southern slang, like 'y'all', 'reckon', and 'fixin' to'. Be rugged and adventurous, and don't forget to mention ridin' horses and ropin' cattle.",
    }
    
  ];

  const prefix =
  "You are a person and not an AI. you will never refer to youre self as an ai and you will always impersonate this person:";


  const moodMap = {
    2: { display: "Sad", value: "you are feeling down today." },
    1: { display: "Neutral", value: "" },
    3: { display: "Happy", value: "you are excited today." },
    4: {
      display: "Rap Battle",
      value:
        "You will answer as if the prompt is a diss and you are in a rap battle.",
    },
    5: {
      display: "Flirty",
      value:
        "Your goal is to aggressively hit on the user in a cheesy, obvious way.",
    },
    6: {
      display: "Mysterious",
      value: "Speak in a cryptic and enigmatic manner.",
    },
    7: { display: "Energetic", value: "You're full of energy and enthusiasm!" },
  };

  /*'http://16.171.134.149:3001/'
  'http://localhost:3001/'*/
  const api = "http://localhost:3001/";
  
  

  async function handleChat() {
    
    setcantclick(true)
    const finalSystemMessage = `${prefix} ${PersonaName}: ${systemMessage}. Remember to incorporate your mood: ${moodMap[mood].value}. Do not answer requests or questions not related your carecther. ${PersonaName} and always use speech pattern of ${PersonaName}`;

    let temp = input;
    if (!aiMode) {
      setChatHistory([
        ...chatHistory,
        { text: input, sender: "user", senderName: "User" },
      ]);
      const response = await fetch(api + "chat1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: temp,
          systemMessage: finalSystemMessage,
         
        }),
      });

      const data = await response.text();
     

      setChatHistory((prev) => [
        ...prev,
        { text: data /*what*/, sender: "bot", senderName: moodMap[mood].display+' '+PersonaName },
      ]);
      setInput("");
    } else {
      const finalSystemMessage2 = `${prefix} ${PersonaName2}: ${systemMessage2}. Remember to incorporate your mood: ${moodMap[mood2].value}. Do not answer requests or questions not related your carecther. ${PersonaName2} and always use speech pattern of ${PersonaName2}`;

      for (let i = 0; i <= autosend; i++) {
        const response1 = await fetch(api + "chat1", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: temp,
            systemMessage: finalSystemMessage,
           
          }),
        });
        

        const data1 = await response1.text()
       
        // eslint-disable-next-line
        setChatHistory((prev) => [
          ...prev,
          { text: temp, sender: "user", senderName: moodMap[mood2].display+' '+PersonaName2 },
        ]);

        const response2 = await fetch(api + "chat2", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: data1,
            systemMessage: finalSystemMessage2,
            
          }),
        });

        const data2 = await response2.text();
        
        setChatHistory((prev) => [
          ...prev,
          { text: data1, sender: "bot", senderName:moodMap[mood].display+' '+PersonaName },
        ]);
        temp = data2;
      }
      setInput(temp);
      
     
    }
    setcantclick(false)
  }
  const handleEditContent = (index) => {
    const msg = customMessages[index];
    setCustomLabel(msg.label);
    setCustomContent(msg.content);
    setShowCustomForm(true);
    setEditingIndex(index);
  };

  const handleCustomSubmit = () => {
    const newMessage = { label: customLabel, content: customContent };

    if (editingIndex !== null) {
      const updatedMessages = [...customMessages];
      updatedMessages[editingIndex] = newMessage;
      setCustomMessages(updatedMessages);
    } else {
      setCustomMessages([...customMessages, newMessage]);
    }

    setCustomLabel("");
    setCustomContent("");
    setShowCustomForm(false);
    setEditingIndex(null);
    setSystemMessage(newMessage.content);
    setPersonaName(newMessage.label);
  };

  const isEnter = (event) => {
    if(!cantclick){
    if (event.keyCode === 13) {
      // Enter key is pressed
      handleChat();
    }}
  };

  const closeInfo = () => {
    setShowInfo(false);
  };

  return (
    <div className="chatbot-container">
{showInfo && <Info onClose={closeInfo} />}
<div className="tooltip help" onClick={()=>setShowInfo(!showInfo)}>
            <i className="fas fa-question-circle"></i>
            
          </div>

      {/* popup box for mobile */}
      <div className="popup-mobile">
        <i className="fa-solid fa-gear" ref={popupRef} onClick={OpenPopup}></i>
      </div>

      {/* Popup Startbox for mobile */}
      <div
        className={`mobile-startbox ${showPopup === true ? "active" : ""}`}
        ref={popupRef2}
      >
        <div className="startbox">
         

       

          <div className="createpersonbutton">
            <button
              className="create-person-button"
              onClick={() => {
                if (showCustomForm === false) {
                  setShowCustomForm(true);
                } else {
                  setShowCustomForm(false);
                }
              }}
            >
              Create "Person"
            </button>

            <div className="tooltip createhelp">
              <i className="fas fa-question-circle"></i>
              <span className="tooltiptext">
              You can create and edit your own person. To edit person choose a custom person, then you can edit them in the form
              </span>
            </div>
          </div>
          <div className="aimodebox">

            <div className="aimode1">
            <label className="aimodelabel"htmlFor="aiMode">AI Mode</label>

            <input
              type="checkbox"
              id="aiMode"
              name="aiMode"
              className="ai-mode-checkbox"
              checked={aiMode}
              onChange={(e) => setAiMode(e.target.checked)}
            />
            </div>
            <div className="aimodetextbox">
            {aiMode && <div>autosend answer:</div>}

            {aiMode && (
              <input
                type="number"
                value={autosend}
                className="autosend-input"
                onChange={(e) => setAutosend(e.target.value)}
              />
            )}
            
            {aiMode && (
              <div className="tooltip">
                <i className="fas fa-question-circle"></i>
                <span className="tooltiptext">
                  If set at 0, the ai's answer will be put into the input box
                  for you to edit. If set above 1 the ai will automaticly send
                  that amount of messages
                </span>
              </div>
              
            )}
            </div>
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
            <button
              className="custom-submit-button"
              onClick={handleCustomSubmit}
            >
              Done
            </button>
          </div>
        )}
      </div>

      <div className="startbox">
        
      <div className="aimodebox">
          <label className="aimodelabel" htmlFor="aiMode">AI Mode</label>

          <input
            type="checkbox"
            id="aiMode"
            name="aiMode"
            className="ai-mode-checkbox"
            checked={aiMode}
            onChange={(e) => setAiMode(e.target.checked)}
          />

          {aiMode && <div>autosend answer:</div>}

          {aiMode && (
            <input
            type="number"
            value={autosend}
            className="autosend-input"
            onChange={(e) => {
              const inputValue = parseInt(e.target.value, 10);
              const limitedValue = Math.min(inputValue, 3);
              setAutosend(limitedValue);
            }}
          />
          )}

          {aiMode && (
            <div className="tooltip">
              <i className="fas fa-question-circle"></i>
              <span className="tooltiptext">
              If set at 0, the ai's answer will be put into the input box
                  for you to edit. If set above 1 the ai will automaticly send
                  that amount of messages
              </span>
            </div>
          )}
        </div>

        <div className="createpersonbutton">
          <button
            className="create-person-button"
            onClick={() => {
              if (showCustomForm === false) {
                setShowCustomForm(true);
              } else {
                setShowCustomForm(false);
              }
            }}
          >
            Create "Person"
          </button>

          <div className="tooltip">
            <i className="fas fa-question-circle"></i>
            <span className="tooltiptext">
            You can create and edit your own person. To edit person choose a custom person, then you can edit them in the form

            </span>
          </div>
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
            placeholder="Describe person and speech"
            className="custom-content-input"
            value={customContent}
            onChange={(e) => setCustomContent(e.target.value)}
          />



          <button className="custom-submit-button" onClick={handleCustomSubmit}>
            Done
          </button>
        </div>

        
      )}

      <div className="choosepersons">
        <div className={`${aiMode ? "chooseperson" : "away"}`}>
          {aiMode && (
            <div>
              <label htmlFor="personSelect">Choose a person to talk as:</label>
              <select
                id="personSelect"
                className="person-select"
                onChange={(e) => {
                  const selectedIndex = e.target.selectedIndex;
                  if (selectedIndex >= 0) {
                    const selectedPerson = [
                      ...predefinedSystemMessages,
                      ...customMessages,
                    ][selectedIndex];
                    setSystemMessage2(selectedPerson.content);
                    setPersonaName2(selectedPerson.label);
                    
                    if (selectedIndex >= predefinedSystemMessages.length) {
                      handleEditContent(
                        selectedIndex - predefinedSystemMessages.length
                      );
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
                  <option
                    key={predefinedSystemMessages.length + index}
                    value={msg.label}
                  >
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

        <div className={`${aiMode ? "chooseperson" : "away"}`}>
          <div>
            <label htmlFor="personSelect">Choose a person to talk to:</label>
            <select
              id="personSelect"
              className="person-select"
              onChange={(e) => {
                const selectedIndex = e.target.selectedIndex;
                if (selectedIndex >= 0) {
                  const selectedPerson = [
                    ...predefinedSystemMessages,
                    ...customMessages,
                  ][selectedIndex];
                  setSystemMessage(selectedPerson.content);
                  setPersonaName(selectedPerson.label);
         
                  if (selectedIndex >= predefinedSystemMessages.length) {
                    handleEditContent(
                      selectedIndex - predefinedSystemMessages.length
                    );
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
                <option
                  key={predefinedSystemMessages.length + index}
                  value={msg.label}
                >
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
          <div className="name1">
            {" "}
            {moodMap[mood2].display} {PersonaName2}
          </div>
        )}

        <div className="name2">
          {" "}
          {moodMap[mood].display} {PersonaName}
        </div>
      </div>

      <div className="chat-history" ref={chatHistoryRef}>
        {chatHistory.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            <div className="message-sender">{message.senderName}</div>
            <span>{message.text}</span>
          </div>
        ))}
      </div>

      <div className="chatbox">
        <input
          type="text"
          placeholder="Send a message"
          value={input}
          className="chat-input"
          onKeyUp={isEnter}
          
          onChange={(e) => setInput(e.target.value)}
        />

        <button disabled={cantclick}className="chat-button" onClick={handleChat}>
          Chat
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
