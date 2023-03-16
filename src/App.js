import logo from './logo.svg';
import React, { useEffect, useContext, useState, useRef } from "react";
import { HexaEightProvider, HexaEightContext } from './hexaeight.js';
import {  BrowserRouter,  Routes, Route, Link  } from "react-router-dom";
import './App.css';

function App() {
  return (
    <HexaEightProvider clientId="<YOUR CLIENT ID>" tokenServerUrl="<YOUR TOKEN SERVER URL>">
      <div className="App">
        <BrowserRouter>
        <header className="App-header">
          <h1>HexaEight Session</h1>
          <h3>Authentication Demo</h3>
          <Header />
          <img src={logo} className="App-logo" alt="logo" />
          <nav className="App-nav">
	   <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/encrypt">Encrypt</Link></li>
              <li><Link to="/protect">Protect</Link></li>
            </ul>
          </nav>
        </header>
          <Routes>
	    <Route exact path="/" element={<AppPage />} />
            <Route path="/" element={<AppPage />} />
            <Route path="/encrypt" element={<MessageEncryptor />} />
            <Route path="/protect" element={<MessageProtector />} />
          </Routes>
        </BrowserRouter>
      </div>
    </HexaEightProvider>
  );

}

function Header() {
  const { appName, userName } = React.useContext(HexaEightContext);
  return (
    <header className="App-header">
      <h3>{appName}</h3>
      <p>{userName}</p>
    </header>
  );
}

const AppPage = () => {
  return (
    <div>
      <h2>Welcome to HexaEight Demo</h2>
      <p>This is the homepage of the demo application.</p>
    </div>
  );
};

const MessageEncryptor = () => {
  const { encryptTextMessage, decryptTextMessage } = useContext(HexaEightContext);
  const [destination, setDestination] = useState('');
  const [message, setMessage] = useState('');
  const [encryptedMessage, setEncryptedMessage] = useState('');

  const handleEncrypt = async () => {
    const encrypted = await encryptTextMessage(destination, message);
    setEncryptedMessage(encrypted);
  };

  const handleDecrypt = async () => {
    const decrypted = await decryptTextMessage(encryptedMessage);
    setEncryptedMessage(decrypted);
  };

  return (
    <div className="Message">
      <h2>Encrypt and Decrypt Messages</h2>
      <input
        type="text"
        placeholder="Destination Email Address Or Resource Name  : (Required Only For Encryption)"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Enter a message to encrypt Or Paste The Encrypted Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <br />
      <button onClick={handleEncrypt}>ENCRYPT MESSAGE</button>
      <button onClick={handleDecrypt}>DECRYPT MESSAGE</button>
      <br />
      <br />
      <br />
      <textarea placeholder="Encrypted And Decrypted Output Area" value={encryptedMessage} readOnly />
      <br />
      <br />

    </div>
  );
};

const MessageProtector = () => {
  const { protectMessage, decipherMessage } = useContext(HexaEightContext);
  const [message, setMessage] = useState('');
  const [key, setKey] = useState('');
  const [protectedMessage, setEncryptedMessage] = useState('');

  const handleProtect = () => {
    const encrypted = protectMessage(message);
    encrypted.then(msg => {
	setEncryptedMessage(msg);
	localStorage.setItem(key, msg);
    });
    
    
  };

  const handleDecrypt = () => {
    const encrypted = localStorage.getItem(key);
    if (encrypted) {
      const decrypted = decipherMessage(encrypted);
      decrypted.then(msg => {
		setEncryptedMessage(msg);
	    });
    }
  };

  return (
    <div className="Message">
      <h2>Protect and Decipher Data Message</h2>
      <input
        type="text"
        placeholder="Enter a Key Identifier, you will need this key to retrive the Data message"
        value={key}
        onChange={(e) => setKey(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Enter Data message to protect"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <br />
      <button onClick={handleProtect}>PROTECT DATA MESSAGE</button>
      <button onClick={handleDecrypt}>RETRIVE DATA MESSAGE</button>
      <br />
      <br />
      <br />
      <textarea placeholder="Protected And Deciphered Output Area" value={protectedMessage} readOnly />
      <br />
      <br />
    </div>
  );
};
export default App;

