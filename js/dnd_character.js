function loadData() {
  console.log('Loading Race dropdown...');
  loadList('race', dbRefs.races);

  console.log('Loading Class dropdown...');
  loadList('class', dbRefs.classes);

  console.log('Loading Background dropdown...');
  loadList('background', dbRefs.backgrounds);

  console.log('Loading Alignment dropdown...');
  loadList('alignment', dbRefs.alignments);
}

function loadListFromArray(listID, array) {
  nullText = '-- Select ' + listID[0].toUpperCase() + listID.slice(1).replace('-', ' ') + ' --';

  const select = document.getElementById(listID);
  var nullOption = document.createElement('option');
  nullOption.text = nullText;
  nullOption.value = '';
  select.add(nullOption);

  for (a of array) {
    var option = document.createElement('option');
    option.text = a.hasOwnProperty('text') ? a.text : a;
    option.value = a.hasOwnProperty('value') ? a.value : a;
    select.add(option);

    if (array.length === 1) {
      select.value = a;
    }
  }

}

function loadList(listID, dbRef, nullText='') {
  if (nullText === '') {
    nullText = '-- Select ' + listID[0].toUpperCase() + listID.slice(1).replace('-', ' ') + ' --';
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

function update(whatChanged) {
  console.log('Updating ' + whatChanged + '...');

  if (whatChanged === 'race') {
    updateSubrace();
    updateAbilities();
    updateSpeed();
    updateProficiencies();
    updateTraits();
    updateLanguages();
  }
  else if (whatChanged === 'subrace') {
    updateAbilities();
    updateSpeed();
    updateProficiencies();
    updateTraits();
    updateLanguages();
  }
  else if (whatChanged === 'class') {
    updateHitDice();
    updateProficiencies();
    // TODO updateEquipment();
  }
  else if (whatChanged === 'background') {
    updateFeature();
    updateCharacteristic('personality-trait', 'traits');
    updateCharacteristic('ideal', 'ideals');
    updateCharacteristic('bond', 'bonds');
    updateCharacteristic('flaw', 'flaws');
    updateVariant();
    updateProficiencies();
    updateLanguages();
    // TODO updateEquipment();
  }
  else {
    console.log('Nothing to update!');
  }
}

function updateSubrace() {
  document.getElementById('subraceDiv').style.display = 'none';

  // Clear subrace select before adding new options
  var subraceSelect = document.getElementById('subrace');
  removeOptions(subraceSelect);

  var raceValue = document.getElementById('race').value;

  if (raceValue === '') {
    return;
  }

  var subraces = new DbRef(raceValue + ' subraces', PATH.SUBRACES + '/' + raceValue);

  if (subraces.val === null) {
    return;
  }

  console.log('Loading Subrace dropdown...');
  loadList('subrace', subraces);
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
    if (ability === ANY) {
      // TODO - Handle prompting user for ability choice
      continue;
    }
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

  var backgroundValue = document.getElementById('background').value;
  if (backgroundValue !== '') {
    var background = dbRefs.backgrounds.val[backgroundValue];

    addProficiencies(profs, background.proficiencies);
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
    else if (Object.keys(ABILITY).includes(prof)) {

       var rowID = prof.toLowerCase() + '-row';
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
  var hasAny = false;

  for (key in list) {
    if (key !== ANY) {
      var item = list[key];
      set.add(dbVal[key].name + '\n');
    }
    else {
      hasAny = true;
    }
  }

  return hasAny;
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

function updateFeature() {
  const FEATURE = 'feature';
  const VARIANT = 'variantFeature';

  var select = document.getElementById(FEATURE);
  removeOptions(select);

  var backgroundValue = document.getElementById('background').value;

  if (backgroundValue === '') {
    return;
  }

  var background = new DbRef('Backgrounds', PATH.BACKGROUNDS + '/' + backgroundValue).val;

  if (background === null) {
    return;
  }

  var features = [];
  features.push(background[FEATURE].name);

  if (background.hasOwnProperty(VARIANT)) {
    features.push(background[VARIANT].name);
  }

  loadListFromArray(FEATURE, features);
}

function updateCharacteristic(elementId, characteristic) {
  var select = document.getElementById(elementId);
  removeOptions(select);

  var backgroundValue = document.getElementById('background').value;

  if (backgroundValue === '') {
    return;
  }

  var background = new DbRef('Backgrounds', PATH.BACKGROUNDS + '/' + backgroundValue).val;

  if (background === null) {
    return;
  }

  var characteristicObj = background[characteristic];
  var options = processCharacteristic(characteristicObj.options);

  loadListFromArray(elementId, options);
}

function processCharacteristic(options) {
  var array = [{
    'text': 'Roll...',
    'value': 'ROLL'
  }];

  for (key of Object.keys(options)) {
    let o = options[key];
    let option = {
      'text': o.desc,
      'value': key
    };
    array.push(option);
  }

  return array;
}

function updateVariant() {
  const variantDiv = document.getElementById('variantDiv');
  removeChildren(variantDiv);
  variantDiv.style.display = 'none';

  const backgroundValue = document.getElementById('background').value;

  if (backgroundValue === '') {
    return;
  }

  const background = dbRefs.backgrounds.val[backgroundValue];
  if (!background.hasOwnProperty('variant')) {
    return;
  }

  const variant = background.variant;
  var checkbox = new Checkbox(variant.name.toLowerCase());
  checkbox.setClassName('checkbox-padded');

  var checkLabel = new Label(variant.name, checkbox.name);
  checkLabel.setClassName('normal');

  var label = new Label('Variant');

  variantDiv.appendChild(label.element);
  variantDiv.appendChild(checkbox.element);
  variantDiv.appendChild(checkLabel.element);

  variantDiv.style.display = 'block';
}

class Label {
  constructor(text, htmlFor=null) {
    this.element = document.createElement('label');
    if (htmlFor !== null) {
      this.element.htmlFor = htmlFor;
    }
    this.element.innerText = text;
  }
  
  setClassName(className) {
    this.element.className = className;
  }
}

class Checkbox {
  constructor(name=null, value=null) {
    this.element = document.createElement('input');
    this.element.type = 'checkbox';
    if (name !== null) {
      this.setName(name);
    }
    if (value !== null) {
      this.setValue(value);
    }
  }

  setName(name) {
    this.element.name = name;
  }

  setValue(value) {
    this.element.value = value;
  }

  setClassName(className) {
    this.element.className = className;
  }

  setOnclick(onclick) {
    this.element.setAttribute('onclick', onclick);
  }
}

function updateLanguages() {
  var languageSpan = document.getElementById('languages');
  removeChildren(languageSpan);

  var language_set = new Set();
  var anyCount = 0;

  var raceValue = document.getElementById('race').value;
  if (raceValue !== '') {
    var race = dbRefs.races.val[raceValue];
    var hasANY = massAppendToSet(language_set, race.languages, dbRefs.languages.val);
    if (hasANY) {
      anyCount++
    }
  }

  var subraceValue = document.getElementById('subrace').value;
  if (subraceValue !== '') {
    subraces = dbRefs.subraces.val[raceValue];
    var subrace = subraces[subraceValue];
    if (subrace.hasOwnProperty('languages')) {
      var hasANY = massAppendToSet(language_set, subrace.languages, dbRefs.languages.val);
      if (hasANY) {
        anyCount++
      }
    }
  }

  var backgroundValue = document.getElementById('background').value;
  if (backgroundValue !== '') {
    var background = dbRefs.backgrounds.val[backgroundValue];
    if (background.hasOwnProperty('languages')) {
      var hasANY = massAppendToSet(language_set, background.languages, dbRefs.languages.val);
      if (hasANY) {
        anyCount += background.languages[ANY];
      }
    }
  }

  var languageText = '';
  
  language_set.forEach(function(language) {
    languageText += language.replace(/\n/g, '') + ', ';
  });
  languageText = languageText.slice(0, languageText.length - 2);

  var div = document.createElement('div');
  div.innerText = languageText;
  languageSpan.appendChild(div);

  var languageList = [];
  for (key in dbRefs.languages.val) {
    var l = {
      'text': dbRefs.languages.val[key].name,
      'value': key
    };

    languageList.push(l);
  }

  for (let i = 0; i < anyCount; i++) {
    var chooseLanguage = new Select('language', languageList);
    languageSpan.appendChild(chooseLanguage.element);
  }
}

class Select {
  constructor(name, options) {
    this.element = document.createElement('select');
    this.element.name = name;
    this.element.className = 'form-control';
    this.loadOptions(options, name);
  }

  loadOptions(options, name) {
    var nullText = '-- Select ' + name[0].toUpperCase() + name.slice(1).replace('-', ' ') + ' --';
    var nullOption = new Option(nullText);
    this.element.add(nullOption.element);

    for (key in options) {
      var o = options[key];
      var option = new Option(o.text, o.value);
      this.element.add(option.element);

      if (options.length === 1) {
        this.element.value = o.value;
      }
    }
  }
}

class Option {
  constructor(text, value='') {
    this.element = document.createElement('option');
    this.element.text = text;
    this.element.value = value;
  }
}

function removeOptions(select) {
  for (i in select.options) {
    select.options[i] = null;
  }
}

window.onload = function() {
  initApp();
  loadData();
};
