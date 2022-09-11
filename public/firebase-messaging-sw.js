//Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyCgbX1O5ZLzHgJvY2pmLg4MmJ0UkPMcs4A",
  authDomain: "porteton.firebaseapp.com",
  projectId: "porteton",
  storageBucket: "porteton.appspot.com",
  messagingSenderId: "1082736344231",
  appId: "1:1082736344231:web:d7f17e437d240647146f82",
  measurementId: "G-B9GMFY7PLE"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.body;
  const notificationOptions = {
    body: payload.notification.title,
    icon: '/images/favicon.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});