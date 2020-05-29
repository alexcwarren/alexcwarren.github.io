var abilitiesQuery = database.ref('data/abilities/');
var abilitiesVal;

var racesQuery = database.ref('data/races/');
var racesVal;

var classesQuery = database.ref('data/classes/');
var classesVal;

var traitsQuery = database.ref('data/traits/');
var traitsVal;

var armorQuery = database.ref('data/armor/');
var armorVal;

var weaponsQuery = database.ref('data/weapons/');
var weaponsVal;

var armorCategoriesQuery = database.ref('data/armor/categories');
var armorCategoriesVal;

var weaponsCategoriesQuery = database.ref('data/weapons/categories');
var weaponsCategoriesVal;

var skillsQuery = database.ref('data/skills/');
var skillsVal;

var toolsQuery = database.ref('data/tools/');
var toolsVal;

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

  // Make initial queries here since first query is undefined (for some reason)
  abilitiesQuery.on('value', function(snap) {
    abilitiesVal = snap.val();
  });

  racesQuery.on('value', function(snap) {
    racesVal = snap.val();
  });

  classesQuery.on('value', function(snap) {
    classesVal = snap.val();
  });

  traitsQuery.on('value', function(snap) {
    traitsVal = snap.val();
  });

  armorQuery.on('value', function(snap) {
    armorVal = snap.val();
  });

  weaponsQuery.on('value', function(snap) {
    weaponsVal = snap.val();
  });

  armorCategoriesQuery.on('value', function(snap) {
    armorCategoriesVal = snap.val();
  });

  weaponsCategoriesQuery.on('value', function(snap) {
    weaponsCategoriesVal = snap.val();
  });

  skillsQuery.on('value', function(snap) {
    skillsVal = snap.val();
  });

  toolsQuery.on('value', function(snap) {
    toolsVal = snap.val();
  });
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
  document.getElementById('hitDice').value = '';
  document.getElementById('traits').value = '';
  document.getElementById('proficiencies').value = '';
}

function getVal(path) {
  var val;

  switch(path) {
    case 'armor':
      val = armorVal;
      break;
    case 'weapons':
      val = weaponsVal;
      break;
    case 'tools':
      val = toolsVal;
      break;
    case 'skills':
      val = skillsVal;
      break;
    case 'abilities':
      val = abilitiesVal;
      break;
    case 'armor/categories':
      val = armorCategoriesVal;
      break;
    case 'weapons/categories':
      val = weaponsCategoriesVal;
      break;
    default:
      val = null;
  }

  return val;
}

function getProficiencies(list) {
  // TODO - Make list of proficiencies unique
  var profs = '';

  for (p of list) {
    if (p.hasOwnProperty('id')) {
      var val = getVal(p.path);

      profs += val[p.id].name + '\n';
    }
    else {
      profs += 'Choose ' + p.choose.amount + ':\n';

      for (c of p.choose.choices) {
        if (c.hasOwnProperty('id')) {
          if (c.id === 'any') {
            profs += '  ' + c.id + ' ' + c.path + '\n';
          }
          else {
            var val = getVal(c.path);

            profs += '  ';

            if (c.hasOwnProperty('quantity') && c.quantity > 1) {
              profs += c.quantity + ' ';
            }

            profs += val[c.id].name + '\n';
          }
        }
        else {
          // var val = getVal(c.searchPath);
          profs += '  ' + c.searchPath + ' with ';
          for (x of c.conditions) {
            profs += x.attribute + ' of ' + x.id + '\n';
          }
        }
      }
    }
  }

  return profs
}

function updateRace() {
  var raceValue = document.getElementById('race').value;

  if (raceValue === '') {
    return;
  }

  var race = racesVal[raceValue];
  document.getElementById('speed').value = race.speed;

  var traitsTag = document.getElementById('traits');
  for (trait of race.traits) {
    traitsTag.value += traitsVal[trait].name + '\n';
  }

  var profsTag = document.getElementById('proficiencies');
  profsTag.value += getProficiencies(race.proficiencies);
}

function updateClass() {
  var classValue = document.getElementById('class').value;

  if (classValue === '') {
    return;
  }

  var clas = classesVal[classValue];
  document.getElementById('hitDice').value = clas.hitDice.text;

  var profsTag = document.getElementById('proficiencies');
  profsTag.value += getProficiencies(clas.proficiencies);
}

function update() {
  console.log('Updating...');
  clear();
  updateRace();
  updateClass();

  // Update abilities
  // Update proficiencies
}

window.onload = function() {
  initApp();
  loadData();
};
