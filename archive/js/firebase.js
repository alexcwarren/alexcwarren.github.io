/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
  // Listening for auth state changes.
  // [START authstatelistener]
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      // [START_EXCLUDE]
      document.getElementById('sign-in-tab').textContent = 'Sign Out';
      if (document.body.contains(document.getElementById('sign-in'))) {
        document.getElementById('sign-in').textContent = 'Sign Out';
      }
      if (document.body.contains(document.getElementById('sign-in-status'))) {
        document.getElementById('sign-in-status').textContent = 'You are Signed In, ' + displayName;
      }
      // [END_EXCLUDE]
    } else {
      // User is signed out.
      // [START_EXCLUDE]
      document.getElementById('sign-in-tab').textContent = 'Sign In';
      if (document.body.contains(document.getElementById('sign-in'))) {
        document.getElementById('sign-in').textContent = 'Sign In';
      }
      if (document.body.contains(document.getElementById('sign-in-status'))) {
        document.getElementById('sign-in').textContent = 'You are Signed Out';
      }
      // [END_EXCLUDE]
    }
    // [START_EXCLUDE]
    // document.getElementById('sign-in').disabled = false;
    // [END_EXCLUDE]
  });
  // [END authstatelistener]
  // document.getElementById('sign-in').addEventListener('click', toggleSignIn, false);
}

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyApe3zVUzA7YUHz5MZfmr-iiKGND2xgPpU",
  authDomain: "my-website-890bd.firebaseapp.com",
  databaseURL: "https://my-website-890bd.firebaseio.com",
  projectId: "my-website-890bd",
  storageBucket: "my-website-890bd.appspot.com",
  messagingSenderId: "331914125238",
  appId: "1:331914125238:web:ecfdc64ebc4f76a290eb17",
  measurementId: "G-1RFK4QMCGC"
};

// Initialize Firebase
if (firebase.apps.length === 0) {
  console.log('Initializing Firebase app...');
  firebase.initializeApp(firebaseConfig);
}
else {
  console.log('Firebase already initialized!');
}

// Get a reference to Firebase services
var database = firebase.database();
var analytics = firebase.analytics();
