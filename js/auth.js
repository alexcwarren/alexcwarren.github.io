/**
 * Function called when clicking the Login/Logout button.
 */
// [START buttoncallback]
function toggleSignIn() {
  if (!firebase.auth().currentUser) {
    // [START createprovider]
    var provider = new firebase.auth.GoogleAuthProvider();
    // [END createprovider]
    // [START addscopes]
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    // [END addscopes]
    // [START signin]
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;

      // get user data from the auth trigger
      const userUid = user.uid; // The UID of the user.
      const userEmail = user.email; // The email of the user.
      const displayName = user.displayName; // The display name of the user.

      const about = {
        email: userEmail,
        name: displayName
      };

      var ref = database.ref('users/' + userUid + '/about');
      console.log("Creating user database...");
      ref.set(about);

      document.getElementById('sign-in-status').textContent = 'You are Signed In, ' + displayName;
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // [START_EXCLUDE]
      if (errorCode === 'auth/account-exists-with-different-credential') {
        alert('You have already signed up with a different auth provider for that email.');
        // If you are using multiple auth providers on your app you should handle linking
        // the user's accounts here.
      } else {
        console.error(error);
      }
      // [END_EXCLUDE]
    });
    // [END signin]
  } else {
    // [START signout]
    firebase.auth().signOut();
    // [END signout]
    document.getElementById('sign-in-status').textContent = 'You are Signed Out';
  }
  // [START_EXCLUDE]
  document.getElementById('sign-in').disabled = true;
  // [END_EXCLUDE]
}
// [END buttoncallback]

function getUID() {
  var userId = firebase.auth().currentUser.uid;
  console.log(userId);
}
