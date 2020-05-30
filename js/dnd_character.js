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

var subracesQuery = database.ref('data/subraces');
var subracesVal;

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

  subracesQuery.on('value', function(snap) {
    subracesVal = snap.val();
  });
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

function loadList(listID, dbRef, nullText='') {
  if (nullText === '') {
    nullText = '-- Select ' + listID[0].toUpperCase() + listID.slice(1) + ' --';
  }

  const select = document.getElementById(listID);

  var query = database.ref('data/' + dbRef).orderByKey();
  query.once('value').then(function(snapshot) {
    var nullOption = document.createElement('option');
    nullOption.text = nullText;
    nullOption.value = '';
    select.add(nullOption);

    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key;
      // var childData = childSnapshot.val();
      var option = document.createElement('option');
      option.text = childSnapshot.child('name').val();
      option.value = key;
      select.add(option);
    });
  });
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

  return profs;
}

function updateSubrace(raceValue) {
  var subraceValue = document.getElementById('subrace').value;
  if (subraceValue === '') {
    return;
  }

  var race = subracesVal[raceValue];
  var subrace = race[subraceValue];

  // TODO - Update traits, if they exist
  // TODO - Update proficiencies, if they exits

  for (inc of subrace.increases) {
    var modID = inc.ability.toLowerCase() + 'Mod';
    var mod = document.getElementById(modID);
    if (mod.innerText !== '') {
      alert(modID + ' already has a modifier!');
    }
    mod.innerText = ' +' + inc.mod;
  }
}

function updateRace(raceChange, subraceChange) {
  var raceValue = document.getElementById('race').value;

  if (raceChange) {
    document.getElementById('subraceDiv').style.display = 'none';
  }

  if (raceValue === '') {
    return;
  }

  var race = racesVal[raceValue];

  if (raceChange || subraceChange) {
    if (raceChange && race.hasOwnProperty('subraces')) {
      // Clear subrace select before adding new options
      var subraceSelect = document.getElementById('subrace');
      for (i in subraceSelect.options) {
        subraceSelect.options[i] = null;
      }

      console.log('Loading Subrace dropdown...');
      loadList('subrace', 'subraces/' + raceValue);
      document.getElementById('subraceDiv').style.display = 'block';
    }

    document.getElementById('speed').value = race.speed;

    var traitsTag = document.getElementById('traits');
    for (trait of race.traits) {
      traitsTag.value += traitsVal[trait].name + '\n';
    }

    for (inc of race.increases) {
      var modID = inc.ability.toLowerCase() + 'Mod';
      document.getElementById(modID).innerText = ' +' + inc.mod;
    }

    if (subraceChange) {
      updateSubrace(raceValue)
    }
  }

  var profs = getProficiencies(race.proficiencies);
  document.getElementById('proficiencies').value = profs;
}

function updateClass() {
  var classValue = document.getElementById('class').value;

  if (classValue === '') {
    return;
  }

  var clas = classesVal[classValue];
  document.getElementById('hitDice').value = clas.hitDice.text;

  var profs = getProficiencies(clas.proficiencies);
  document.getElementById('proficiencies').value = profs;
}

function update2(raceChange, classChange, subraceChange) {
  console.log('Updating...');

  document.getElementById('proficiencies').value = '';

  if (raceChange || subraceChange) {
    document.getElementById('speed').value = '';
    document.getElementById('traits').value = '';
    var abilityMods = document.getElementsByClassName('abilityMod');
    for (aM of abilityMods) {
      aM.innerText = '';
    }
  }
  else if (classChange) {
    document.getElementById('hitDice').value = '';
  }

  updateRace(raceChange, subraceChange);
  updateClass();
}

function update(whatChanged) {
  console.log('update:', whatChanged);
  if (whatChanged === 'race') {
    console.log('Race...');
  }
  else if (whatChanged === 'subrace') {
    console.log('Subrace...');
  }
  else if (whatChanged === 'class') {
    console.log('Class...');
  }
}

window.onload = function() {
  initApp();
  loadData();
};
