function submit() {
  var data = {
    name: document.getElementById('username').value,
    score: document.getElementById('score').value
  };
  console.log(data);
  var ref = database.ref('users/');
  ref.push(data);
}

function writeUserData(userId, name) {
  firebase.database().ref('users/' + userId).set({
    username: name,
  });
}

function writeNewUserData(userId, name) {
  firebase.database().ref('users/').set({
    userId: {
      username: name,
    }
  });
}
