var characterClass = null;

function saveCharacter() {
  var userId = firebase.auth().currentUser.uid;

  var character = {
    name: document.getElementById('characterName').value
  };
  console.log(character);

  var dataRef = database.ref('users/' + userId + '/data/characters');
  dataRef.set(character);
}

function loadData() {
  console.log('Loading form data...');

  console.log('Loading Race dropdown...');
  loadList('race', 'races', '-- Select Race --');

  console.log('Loading Class dropdown...');
  loadList('class', 'classes', '-- Select Class --');
}

function loadList(listID, dbRef, nullText) {
  const select = document.getElementById(listID);

  var query = database.ref('data/' + dbRef).orderByKey();
  query.once('value').then(function(snapshot) {
    var nullOption = document.createElement('option');
    nullOption.text = nullText;
    nullOption.value = '';
    select.add(nullOption);

    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key;
      var childData = childSnapshot.val();
      var option = document.createElement('option');
      option.text = childSnapshot.child('name').val();
      option.value = key;
      select.add(option);
    });
  });
}

function clear() {
  document.getElementById('speed').value = '';
  document.getElementById('traits').value = '';
  document.getElementById('hitDice').value = '';
  document.getElementById('proficiencies').value = '';
}

function updateRace() {
  const raceValue = document.getElementById('race').value;

  if (raceValue == '') {
    return;
  }

  var raceQuery = database.ref('data/races/' + raceValue).orderByKey();
  raceQuery.once('value').then(function(raceSnapshot) {
    var race = raceSnapshot.val();
    document.getElementById('speed').value = race.speed;

    var traitQuery = database.ref('data/traits').orderByKey();
    traitQuery.once('value').then(function(traitSnapshot) {
      var traits = traitSnapshot.val();
      var traitText = '';
      for (traitID of race.traits) {
        for (t in traits) {
          if (traitID === traits[t].id) {
            traitText += traits[t].name + '\n';
            break;
          }
        }
      }
      document.getElementById('traits').value = traitText;

      var proficiencies = raceSnapshot.val().proficiencies;
      var proficiencyText = '';
      for (prof of proficiencies) {
        proficiencyText += prof.path + '\n';
      }
      document.getElementById('proficiencies').value = proficiencyText;
    });
  });
}

function updateClass() {
  const classValue = document.getElementById('class').value;

  if (classValue == '') {
    return;
  }

  var classQuery = database.ref('data/classes/' + classValue).orderByKey();
  classQuery.once('value').then(function(classSnapshot) {
    var classObj = classSnapshot.val();
    document.getElementById('hitDice').value = classObj.hitDice.text;

    var proficiencies = classSnapshot.val().proficiencies;

    // Iterate through the class proficiencies
    for (i in proficiencies) {
      var prof = proficiencies[i];

      if (prof.hasOwnProperty('id')) {
        document.getElementById('proficiencies').value += prof.id;
      }
      else {
        document.getElementById('proficiencies').value += 'choose';
      }

      if (i < proficiencies.length - 1) {
        document.getElementById('proficiencies').value += '\n';
      }

      // Query path for class proficiency
      var profQuery = database.ref('data/' + prof.path).orderByKey();
      profQuery.once('value').then(function(profSnapshot) {
        var proficiency = profSnapshot.val();
        var ids = document.getElementById('proficiencies').value.split('\n');

        // Find matching proficiency
        for (p in proficiency) {
          if (prof.id === proficiency[p].id) {
            console.log('p: ', proficiency[p], proficiency[p].id);
            document.getElementById('proficiencies').value += proficiency[p].name + '\n';
          }
        }
      });
    }
  });
}

function myTest() {
  const race = document.getElementById('race').value;
  const url = firebaseConfig.databaseURL + '/races/' + race + '.json';
  console.log(url);

  var dwarf = httpGet(url);
  console.log(dwarf);
}

function httpGet(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', url);
    xmlHttp.send();
    return xmlHttp.responseText;
}

function loadClass() {
  const classValue = document.getElementById('class').value;

  if (classValue == '') {
    return;
  }

  var classQuery = database.ref('data/classes/' + classValue).orderByKey();
  classQuery.once('value', function(snapshot) {
    // var classObj = JSON.parse(snapshot.val())
    const tmp = document.getElementById('tmp');
    tmp.value = '';
    tmp.value = JSON.stringify(snapshot.val());
  });
}

function updateClass() {
  loadClass();

  console.log('tmp: ', document.getElementById('tmp').value);
  var classObj = document.getElementById('tmp').value;
  console.log('classObj: ', classObj);
}

function update() {
  console.log('Updating...');
  clear();
  updateClass();
  // updateRace();
  // updateClass();

  // Update abilities
  // Update proficiencies
}

window.onload = function() {
  initApp();
  loadData();
};
