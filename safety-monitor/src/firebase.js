// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  // PASTE YOUR CONFIG OBJECT HERE (Same one you used in the service worker)
  apiKey: "AIzaSyAv0SX5O_zNG3lkUCNlS4kfE8trYoJpMvY",
  authDomain: "firealert-nx.firebaseapp.com",
  projectId: "firealert-nx",
  storageBucket: "firealert-nx.firebasestorage.app",
  messagingSenderId: "279690232360",
  appId: "1:279690232360:web:3a26aa31972be5ec446b1d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// This function requests permission and returns the Token
export const requestForToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, { 
        vapidKey: 'BOQbgEQtz4ELgpLMgKLfsBKnIrY00NxogGU1NF-DdewedujYioKXyRzr1VsFzM2_KjAD9s2LTy9kA7Ggl2nRgYM' 
      });
      if (token) {
        return token;
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    } else {
      console.log('Unable to get permission to notify.');
    }
  } catch (err) {
    console.log('An error occurred while retrieving token. ', err);
  }
};

// This handles messages when the page is OPEN
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
});