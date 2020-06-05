function loadData() {
  console.log('Loading Race dropdown...');
  loadList('race', dbRefs.races);

  console.log('Loading Class dropdown...');
  loadList('class', dbRefs.classes);
}

function loadList(listID, dbRef, nullText='') {
  if (nullText === '') {
    nullText = '-- Select ' + listID[0].toUpperCase() + listID.slice(1) + ' --';
  }

  const select = document.getElementById(listID);

  dbRef.query.once('value').then(function(snapshot) {
    var nullOption = document.createElement('option');
    nullOption.text = nullText;
    nullOption.value = '';
    select.add(nullOption);

    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key;
      var option = document.createElement('option');
      option.text = childSnapshot.child(NAME).val();
      option.value = key;
      select.add(option);
    });
  });
}

function getProficiencies2(list) {
  if (list === undefined) {
    return [];
  }

  var profs = [];

  for (lKey in list) {
    var p = list[lKey];

    if (p.hasOwnProperty(CHOOSE)) {
      var amount = Object.keys(p)[0];;
      var choose = 'Choose ' + amount + ':\n';

      var choices = p[amount];

      for (cKey in choices) {
        var c = choices[cKey];

        if (c.hasOwnProperty(CONDITIONS)) {
          for (cdKey in c.conditions) {
            var path = c.conditions[cdKey];

            var conditionVal = dbRefs[path].val;

            var items = null;
            var itemsVal = null;

            if (cdKey === ANY) {
              items = conditionVal;
              itemsVal = conditionVal;
            }
            else {
              items = conditionVal[cdKey];
              var firstItemKey = Object.keys(items)[0];
              var itemsPath = items[firstItemKey];
              itemsVal = dbRefs[itemsPath].val;
            }

            for (itemKey in items) {
              var item = itemsVal[itemKey];

              choose += '  ' + item.name + '\n';
            }
          }
        }
        else {
          c['id'] = cKey;

          var choiceVal = dbRefs[c.path].val;

          if (c.id === ANY) {
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
      }

      profs.push(choose);
    }
    else {
      var profRef = dbRefs[p];
      var prof = profRef.val[lKey];

      if (prof.hasOwnProperty(NAME)) {
        profs.push(profRef.val[lKey].name + '\n');
      }
      else {
        var pPath = null;
        var pRef = null;

        for (pKey in prof) {
          if (pPath === null) {
            pPath = prof[pKey];
            pRef = dbRefs[pPath];
          }

          profs.push(pRef.val[pKey].name + '\n');
        }
      }
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
  loadList('subrace', new DbRef(raceValue + ' subraces', PATH.SUBRACES + '/' + raceValue));
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
  var race = dbRefs.races.val[raceValue];

  addAbilityModifiers(race.increases);

  var subraceValue = document.getElementById('subrace').value;
  if (subraceValue === '') {
    return;
  }
  race = dbRefs.subraces.val[raceValue];
  var subrace = race[subraceValue];

  addAbilityModifiers(subrace.increases);
}

function addAbilityModifiers(modList) {
  for (key in modList) {
    var ability = key;
    var abilityMod = modList[key];

    var modID = ability.toLowerCase() + 'Mod';
    var mod = document.getElementById(modID);
    if (mod.innerText !== '') {
      alert(modID + ' already has a modifier!');
      return;
    }
    mod.innerText = ' +' + abilityMod;
  }
}

function updateSpeed() {
  var speed = document.getElementById('speed');
  speed.value = '';

  var raceValue = document.getElementById('race').value;
  if (raceValue === '') {
    return;
  }
  var race = dbRefs.races.val[raceValue];

  speed.value = race.speed;

  var subraceValue = document.getElementById('subrace').value;
  if (subraceValue === '') {
    return;
  }
  var subraces = dbRefs.subraces.val[raceValue];
  var subrace = subraces[subraceValue];

  if (subrace.hasOwnProperty('speed')) {
    speed.value = subrace.speed;
  }
}

function updateProficiencies() {
  var proficiencies = document.getElementById('proficiencies');
  removeChildren(proficiencies);

  var profs = new Set();

  var raceValue = document.getElementById('race').value;
  if (raceValue !== '') {
    var race = dbRefs.races.val[raceValue];

    addProficiencies(profs, race.proficiencies);
  }

  var subraceValue = document.getElementById('subrace').value;
  if (subraceValue !== '') {
    var subraces = dbRefs.subraces.val[raceValue];
    var subrace = subraces[subraceValue];

    addProficiencies(profs, subrace.proficiencies);
  }

  var classValue = document.getElementById('class').value;
  if (classValue !== '') {
    var clss = dbRefs.classes.val[classValue];

    addProficiencies(profs, clss.proficiencies);
  }

  var abilities = document.getElementsByClassName('row ability');
  for (a of abilities) {
    a.style.fontWeight = 'normal';
  }

  var choiceCount = 1;

  profs.forEach(function(prof) {
    var div = document.createElement('div');

    if (typeof prof === typeof Object()) {
      if (prof.hasOwnProperty(CHOOSE)) {
          var amount = Object.keys(prof)[0];
          var choices = prof[amount];
          var choiceName = 'choice' + choiceCount;
          choiceCount++;

          var label = document.createElement('label');
          label.innerText = 'Choose ' + amount + ':';
          label.htmlFor = choiceName;
          label.className = 'choice';
          div.appendChild(label);

          for (choiceKey in choices) {
            var innerDiv = document.createElement('div');

            var choiceData = choices[choiceKey]

            if (choiceData.hasOwnProperty(CONDITIONS)) {
              var conditions = choiceData[CONDITIONS];

              var commonItems = [];
              var firstIteration = true;
              for (conditionKey in conditions) {
                var conditionPath = conditions[conditionKey];
                var tableData = dbRefs[conditionPath].val;

                var conditionData = null;
                var itemsPath = null;

                if (conditionKey === ANY) {
                  conditionData = tableData;
                  itemsPath = conditionPath;
                }
                else {
                  conditionData = tableData[conditionKey];
                  var firstItem = Object.keys(conditionData)[0];
                  itemsPath = conditionData[firstItem];
                }

                var items = [];
                for (itemKey in conditionData) {
                  if (itemKey !== NAME) {
                    var itemsData = dbRefs[itemsPath].val;
                    var item = {
                      'id': itemsData[itemKey].id,
                      'name': itemsData[itemKey].name
                    };
                    items.push(item);
                  }
                }

                if (!firstIteration) {
                  // Find common values
                  commonItems.filter(item => items.includes(item));
                }
                else {
                  commonItems = Object.assign([], items);
                }

                firstIteration = false;
              }

              for (i in commonItems) {
                var innerMostDiv = document.createElement('div');
                var item = commonItems[i];
                var input = document.createElement('input');

                if (amount > 1) {
                  input.type = 'checkbox';
                  input.name = item.name;
                  input.className = 'choice profCheckbox' + choiceCount;
                  input.setAttribute('onclick', 'limitChecks(' + amount + ', this.className)');
                }
                else {
                  input.type = 'radio';
                  input.name = choiceName;
                  input.className = 'choice';
                }

                input.value = item.id; // TODO - Find a suitable value here
                innerMostDiv.appendChild(input);

                var choiceLabel = document.createElement('label');
                choiceLabel.innerText = item.name;
                choiceLabel.className = 'choice';
                innerMostDiv.appendChild(choiceLabel);

                innerDiv.appendChild(innerMostDiv);
              }

              div.appendChild(innerDiv);
            }
            else {
              var choiceTable = dbRefs[choiceData.path].val;
              var choice = choiceTable[choiceKey];

              var innerMostDiv = document.createElement('div');
              var input = document.createElement('input');

              if (amount > 1) {
                input.type = 'checkbox';
                input.name = choice.name;
                input.className = 'choice profCheckbox' + choiceCount
                input.setAttribute('onclick', 'limitChecks(' + amount + ', this.className)');
              }
              else {
                input.type = 'radio';
                input.name = choiceName;
                input.className = 'choice';
              }

              input.value = choice.id;
              innerDiv.appendChild(input);

              var choiceLabel = document.createElement('label');
              choiceLabel.innerText = choice.name;
              choiceLabel.className = 'choice';
              innerDiv.appendChild(choiceLabel);

              div.appendChild(innerDiv);
            }
        }
      }
      else {
        console.log('ERROR: Proficiency is unknown object');
      }
    }

    // Check for proficiencies in abilities
    else if (prof.hasOwnProperty('STR') || prof.hasOwnProperty('DEX') || prof.hasOwnProperty('CON')
     || prof.hasOwnProperty('INT') || prof.hasOwnProperty('WIS') || prof.hasOwnProperty('CHA')) {

       var profKey = Object.keys(prof)[0];
       var rowID = profKey.match(/[A-Z]{3}/g)[0].toLowerCase() + '-row';
       var row = document.getElementById(rowID);
       row.style.fontWeight = '900';
    }
    else {
      var p = document.createElement('p');
      p.innerText = prof;
      div.appendChild(p);
    }

    proficiencies.appendChild(div);
  });
}

function limitChecks(limit, className) {
  var profCheckboxes = document.getElementsByClassName(className);

  var checkedCount = 0;
  var limitReached = false;

  for (key in profCheckboxes) {
    var cbx = profCheckboxes[key];

    if (cbx.type === 'checkbox') {
      if (cbx.checked) {
        checkedCount++;
      }
    }

    if (checkedCount >= limit) {
      limitReached = true;
      break;
    }
  }

  for (key in profCheckboxes) {
    var cbx = profCheckboxes[key];

    if (cbx.type === 'checkbox') {
      if (limitReached) {
        cbx.disabled = cbx.checked ? false : true;
      }
      else {
        cbx.disabled = false;
      }
    }
  }
}

function addProficiencies(set, list) {
  for (key in list) {
    var prof = list[key];

    if (typeof prof === typeof 'string') {
      var path = prof;
      var pathVal = dbRefs[path].val;
      prof = pathVal[key].name;
    }

    set.add(prof);
  }
}

function removeChildren(div) {
  var child = div.lastElementChild;
  while (child) {
    div.removeChild(child);
    child = div.lastElementChild;
  }
}

function updateTraits() {
  var traitsObj = document.getElementById('traits');
  removeChildren(traitsObj);

  var traits = new Set();

  var raceValue = document.getElementById('race').value;
  if (raceValue !== '') {
    var race = dbRefs.races.val[raceValue];
    massAppendToSet(traits, race.traits, dbRefs.traits.val);
  }

  var subraceValue = document.getElementById('subrace').value;
  if (subraceValue !== '') {
    subraces = dbRefs.subraces.val[raceValue];
    var subrace = subraces[subraceValue];
    massAppendToSet(traits, subrace.traits, dbRefs.traits.val);
  }

  traits.forEach(function(trait) {
    var div = document.createElement('div');
    div.innerText = trait;

    traitsObj.appendChild(div);
  });
}

function massAppendToSet(set, list, dbVal) {
  for (key in list) {
    var item = list[key];
    set.add(dbVal[key].name + '\n');
  }
}

function updateHitDice() {
  var hitDice = document.getElementById('hitDice');
  hitDice.value = '';

  var classValue = document.getElementById('class').value;
  if (classValue === '') {
    return;
  }
  var clss = dbRefs.classes.val[classValue];

  hitDice.value = clss.hitDice.text;
}

window.onload = function() {
  initApp();
  loadData();
};
