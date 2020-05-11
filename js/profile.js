function submit() {
  var userId = firebase.auth().currentUser.uid;

  var data = {
    username: document.getElementById('username').value,
    score: document.getElementById('score').value
  };
  console.log(data);

  var dataRef = database.ref('users/' + userId + '/data');
  dataRef.set(data);
}

window.onload = function() {
  initApp();

  document.getElementById('sign-in').addEventListener('click', toggleSignIn, false);
};
