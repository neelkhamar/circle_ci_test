import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { addFcmToken } from "../../../requests/fcm_token";

const firebaseConfig = initializeApp({
  apiKey: "AIzaSyCgbX1O5ZLzHgJvY2pmLg4MmJ0UkPMcs4A",
  authDomain: "porteton.firebaseapp.com",
  projectId: "porteton",
  storageBucket: "porteton.appspot.com",
  messagingSenderId: "1082736344231",
  appId: "1:1082736344231:web:d7f17e437d240647146f82",
  measurementId: "G-B9GMFY7PLE",
});

const messaging = getMessaging(firebaseConfig);

export const getFcmToken = (currentUser, setTokenFound) => {
  return getToken(messaging, {
    vapidKey:
      "BODOZiRh_0h8IZJSK_CT0swIjQLolvPgwK_RZU49e-HiOpS2Rmvy6yCemQ0y-Qj-LspiZByzLMtrKju3URjgvoM",
  })
    .then((currentToken) => {
      if (currentToken) {
        let payload = { token: currentToken };
        console.log(currentToken);
        addFcmToken(
          currentUser.accessToken,
          currentUser.uid,
          currentUser.client,
          payload
        ).then(
          (response) => {
            setTokenFound(true);
          },
          (error) => {
            console.log(error);
          }
        );
        // Track the token -> client mapping, by sending to backend server
        // show on the UI that permission is secured
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
        setTokenFound(false);
        // shows on the UI that permission is required
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
      // catch error while creating client token
    });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      resolve(payload);
    });
  });
