import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';

const HexaEightContext = createContext({});

const HexaEightProvider = ({ clientId, tokenServerUrl, children }) => {
  const sessionRef = useRef(null);
  const [appName, setAppName] = useState('');
  const [userName, setUserName] = useState('');
  const [sessionInitialized, setSessionInitialized] = useState(false);

  const callback = useCallback(async () => {
    try {
    if (sessionRef.current) {
      const userStatus = await sessionRef.current.isauthenticated();
      const userStatusJSON = JSON.parse(await userStatus);
      if (userStatusJSON.data === 'True') {
        const appNamePromise = sessionRef.current.Login('FETCH-APPNAME', '');
        const userNamePromise = sessionRef.current.Login('FETCH-LOGGED-IN-USER-EMAIL', '');

        Promise.all([appNamePromise, userNamePromise]).then((values) => {
          const appName = JSON.parse(values[0]).data;
          const email = JSON.parse(values[1]).data.toString().split('@')[0];
          const userName = `Welcome ${email.charAt(0).toUpperCase() + email.slice(1)}`;

          setAppName(appName);
          setUserName(userName);
        });
      }
     } else {
	setTimeout(() => {
	      console.log("Refreshing...");
	      callback();
	    }, 1000);
     }
    } catch (error) {
      console.error('Failed to set session user details:', error);
    }
  }, [sessionRef]);



  const initSession = useCallback(async () => {
    try {
      const hexaEightScript = document.createElement('script');
      hexaEightScript.crossOrigin = true;
      hexaEightScript.src = 'https://cdn.jsdelivr.net/gh/hexaeightteam/session-js-spa-https/hexaeightsession.js';
      hexaEightScript.onload = async () => {
        try {
	  const newSession = new window.HexaEight();
	  await newSession.init(clientId, tokenServerUrl,callback);
	  sessionRef.current = newSession;
          setSessionInitialized(true);
        } catch (error) {
          console.error('Failed to initialize HexaEight session:', error);
        }
      };
      document.head.appendChild(hexaEightScript);
    } catch (error) {
      console.error('Failed to load HexaEight script:', error);
    }
  },[clientId, tokenServerUrl,callback]);

 
  useEffect(() => {
    if (!sessionInitialized) {
      initSession();
    } else if (sessionRef.current) {
      callback();
    }
  }, [sessionRef, sessionInitialized, callback, initSession]);


  const encryptTextMessage = async (recipient, message) => {
    try {
      const encryptedMessage = await sessionRef.current.EncryptTextMessage(recipient, message);
      return encryptedMessage;
    } catch (error) {
      console.error('Failed to encrypt text message:', error);
      return '';
    }
  };

  const decryptTextMessage = async (encryptedMessage) => {
    try {
      const decryptedMessage = await sessionRef.current.DecryptTextMessage(encryptedMessage);
      return decryptedMessage;
    } catch (error) {
      console.error('Failed to decrypt text message:', error);
      return '';
    }
  };

  const protectMessage = async (dataInput) => {
    try {
      const protectedMessage = await sessionRef.current.ProtectMessage(dataInput);
      return protectedMessage;
    } catch (error) {
      console.error('Failed to protect message:', error);
      return '';
    }
  };

  const decipherMessage = async (encryptedMessage) => {
    try {
      const decryptedMessage = await sessionRef.current.DecipherMessage(encryptedMessage);
      const body = JSON.parse(decryptedMessage).BODY;
      return body;
    } catch (error) {
      console.error('Failed to decipher message:', error);
      return '';
    }
  };

  return (
    <HexaEightContext.Provider
      value={{
        sessionRef,
        appName,
        userName,
        encryptTextMessage,
        decryptTextMessage,
        protectMessage,
        decipherMessage,
      }}
    >
      {children}
    </HexaEightContext.Provider>
  );
};

export { HexaEightContext, HexaEightProvider };
