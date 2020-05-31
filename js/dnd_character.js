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
  if (list === undefined) {
    return [];
  }

  var profs = [];

  for (p of list) {
    if (p.hasOwnProperty('id')) {
      var val = getVal(p.path);
      profs.push(val[p.id].name + '\n');
    }
    else {
      var choose = 'Choose ' + p.choose.amount + ':\n';

      for (c of p.choose.choices) {
        var choiceVal = getVal(c.path);

        if (c.hasOwnProperty('id')) {
          if (c.id === 'any') {
            for (i in choiceVal) {
              var item = choiceVal[i];
              choose += '  ' + item.name + '\n';
            }
          }
          else {
            choose += '  ';

            if (c.hasOwnProperty('quantity') && c.quantity > 1) {
              choose += c.quantity + ' ';
            }

            choose += choiceVal[c.id].name + '\n';
          }
        }
        else {
          var conditionVal = getVal(c.searchPath);
          for (x of c.conditions) {
            for (i in conditionVal) {
              var item = conditionVal[i];
              if (item.hasOwnProperty(x.attribute) && item[x.attribute] === x.id) {
                choose += '  ' + item.name + '\n';
              }
            }
          }
        }
      }

      profs.push(choose);
    }
  }

  return profs;
}

function update(whatChanged) {
  console.log('Updating ' + whatChanged + '...');

  if (whatChanged === 'race') {
    updateSubrace();
    updateAbilities();
    updateSpeed();
    updateProficiencies();
    updateTraits();
  }
  else if (whatChanged === 'subrace') {
    updateAbilities();
    updateSpeed();
    updateProficiencies();
    updateTraits();
  }
  else if (whatChanged === 'class') {
    updateHitDice();
    updateProficiencies();
  }
  else {
    console.log('Nothing to update!');
  }
}

function updateSubrace() {
  document.getElementById('subraceDiv').style.display = 'none';

  // Clear subrace select before adding new options
  var subraceSelect = document.getElementById('subrace');
  for (i in subraceSelect.options) {
    subraceSelect.options[i] = null;
  }

  var raceValue = document.getElementById('race').value;

  if (raceValue === '') {
    return;
  }

  console.log('Loading Subrace dropdown...');
  loadList('subrace', 'subraces/' + raceValue);
  document.getElementById('subraceDiv').style.display = 'block';
}

function updateAbilities() {
  var abilityMods = document.getElementsByClassName('abilityMod');
  for (aM of abilityMods) {
    aM.innerText = '';
  }

  var raceValue = document.getElementById('race').value;
  if (raceValue === '') {
    return;
  }
  var race = racesVal[raceValue];

  addAbilityModifiers(race.increases);

  var subraceValue = document.getElementById('subrace').value;
  if (subraceValue === '') {
    return;
  }
  race = subracesVal[raceValue];
  var subrace = race[subraceValue];

  addAbilityModifiers(subrace.increases);
}

function addAbilityModifiers(modList) {
  for (m of modList) {
    var modID = m.ability.toLowerCase() + 'Mod';
    var mod = document.getElementById(modID);
    if (mod.innerText !== '') {
      alert(modID + ' already has a modifier!');
      return;
    }
    mod.innerText = ' +' + m.mod;
  }
}

function updateSpeed() {
  var speed = document.getElementById('speed');
  speed.value = '';

  var raceValue = document.getElementById('race').value;
  if (raceValue === '') {
    return;
  }
  var race = racesVal[raceValue];

  speed.value = race.speed;

  var subraceValue = document.getElementById('subrace').value;
  if (subraceValue === '') {
    return;
  }
  race = subracesVal[raceValue];
  var subrace = race[subraceValue];

  if (subrace.hasOwnProperty('speed')) {
    speed.value = subrace.speed;
  }
}

function updateProficiencies() {
  var proficiencies = document.getElementById('proficiencies');
  proficiencies.value = '';

  var profs = new Set();

  var raceValue = document.getElementById('race').value;
  if (raceValue !== '') {
    var race = racesVal[raceValue];
    var raceProfs = getProficiencies(race.proficiencies);

    raceProfs.forEach(prof => profs.add(prof));
  }

  var subraceValue = document.getElementById('subrace').value;
  if (subraceValue !== '') {
    race = subracesVal[raceValue];
    var subrace = race[subraceValue];
    var subraceProfs = getProficiencies(subrace.proficiencies);

    subraceProfs.forEach(prof => profs.add(prof));
  }

  var classValue = document.getElementById('class').value;
  if (classValue !== '') {
    var clss = classesVal[classValue];
    var classProfs = getProficiencies(clss.proficiencies);

    classProfs.forEach(prof => profs.add(prof));
  }

  var profsText = '';

  var abilities = document.getElementsByClassName('row ability');
  for (a of abilities) {
    a.style.fontWeight = 'normal';
  }

  profs.forEach(function(prof) {
    profsText += prof;

    // Check for proficiencies in abilities
    if (prof.includes('STR') || prof.includes('DEX') || prof.includes('CON')
     || prof.includes('INT') || prof.includes('WIS') || prof.includes('CHA')) {

       var rowID = prof.match(/[A-Z]{3}/g)[0].toLowerCase() + '-row';
       var row = document.getElementById(rowID);
       row.style.fontWeight = '900';
    }
  });

  proficiencies.value = profsText;
}

function updateTraits() {
  var traitsObj = document.getElementById('traits');
  traitsObj.value = '';

  var traits = new Set();

  var raceValue = document.getElementById('race').value;
  if (raceValue !== '') {
    var race = racesVal[raceValue];
    race.traits.forEach(trait => traits.add(traitsVal[trait].name + '\n'));
  }

  var subraceValue = document.getElementById('subrace').value;
  if (subraceValue !== '') {
    race = subracesVal[raceValue];
    var subrace = race[subraceValue];
    subrace.traits.forEach(trait => traits.add(traitsVal[trait].name + '\n'));
  }

  traits.forEach(trait => traitsObj.value += trait);
}

function updateHitDice() {
  var hitDice = document.getElementById('hitDice');
  hitDice.value = '';

  var classValue = document.getElementById('class').value;
  if (classValue === '') {
    return;
  }
  var clss = classesVal[classValue];

  hitDice.value = clss.hitDice.text;
}

window.onload = function() {
  initApp();
  loadData();
};
