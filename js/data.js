const dataRef = database.ref('data');

var usedIDs = [];

function pushID(name) {
  if (name === '') {
    console.log('ERROR: Missing name');
    return null;
  }

  var id = getNextID();

  usedIDs.forEach(function(u) {
    if (id === u.id && name !== u.name) {
      console.log('ERROR: ' + id + ' already used by ' + u.name);
      return null;
    }
  });

  var entry = {
    'id': id,
    'name': name
  }
  usedIDs.push(entry);

  return id;
}

function getNextID() {
  // Make sure nextID is always exactly 4 hex digits
  let minLimit = 4096; // 16^(4-1) = 16^3
  let maxLimit = 65536 - 4096; // 16^4 - 16^3

  let nextID = Math.floor(Math.random() * maxLimit) + minLimit;

  var alreadyUsed = false;
  var count = 1;
  usedIDs.forEach(function(item) {
    if (nextID === item.id) {
      alreadyUsed = true;
      console.log(count);
      count++;
    }
  });
  if (alreadyUsed) {
    return getNextID();
  }

  usedIDs.push(nextID.toString(16));
  // console.log(nextID.toString(16));
  return nextID.toString(16);
}

function showUsedIDs() {
  getAbilities();
  getSkills();
  getLanguages();
  // getWeaponsClasses();
  // getWeaponsCategories();
  // getWeapons();
  getArmor();
  getTools();
  getGear();
  getTraits();
  getSubraces();
  getRaces();
  getClasses();

  getWeapons();
  getWeaponsClasses();
  getWeaponsCategories();

  var message = '[';
  usedIDs.forEach(item => message += item.id + ' ' + item.name + ', ');
  console.log(message.slice(0, message.length - 2) + ']');
}

function show(name, data, attribute='', value='') {
  var message = '';

  if (attribute !== '' && value !== '') {
    console.log(name, 'where', attribute, '=', value + ':');
    for (key of Object.keys(data)) {
      var item = data[key];

      if (item.hasOwnProperty(attribute) && item[attribute] === value) {
        message += getEnumerationRef(value, [name, key, 'value']);
      }
    }
    // message = message.slice(0, message.length - 2);
  }
  else {
    console.log('Every', name + ':');
    for (key of Object.keys(data)) {
      message += makeEnumerationString(key);
    }

    message = message.slice(0, message.length - 2);
  }

  console.log(message);
}

function makeKeyString(value) {
  return '\'' + value + '\': true,\n';
}

function makeEnumerationString(value) {
  return '\'' + value.toUpperCase() + '\': \'' + value + '\',\n';
}

function getEnumerationRef(name, layers, value='true') {
  var ref = '';

  layers.forEach(layer => ref += layer.toUpperCase() + '.');

  return name + '[' + ref.slice(0, ref.length - 1) + '] = ' + value + ';\n';
}

function storeData() {
  store(ABILITY_PATH, getAbilities(), 'Abilities');
  store(SKILL_PATH, getSkills(), 'Skills');
  store(LANGUAGE_PATH, getLanguages(), 'Languages');
  store(WEAPON_CLASS_PATH, getWeaponClasses(), 'WeaponClasses');
  store(WEAPON_CATEGORY_PATH, getWeaponCategories(), 'WeaponCategories');
  store(WEAPON_PATH, getWeapons(), 'Weapons');
  store(ARMOR_TYPE_PATH, getArmorTypes(), 'ArmorTypes');
  store(ARMOR_PATH, getArmor(), 'Armor');
  store(TOOL_CATEGORY_PATH, getToolCategories(), 'ToolCategories');
  store(TOOL_PATH, getTools(), 'Tools');
  store(PACK_PATH, getPacks(), 'Packs');
  store(GEAR_PATH, getGear(), 'Gear');
  store(TRAIT_PATH, getTraits(), 'Traits');
  store(SUBRACE_PATH, getSubraces(), 'Subraces');
  store(RACE_PATH, getRaces(), 'Races');
  store(CLASS_PATH, getClasses(), 'Classes');
}

function store(path, data, name) {
  console.log('Storing ' + name + '...');
  var childRef = dataRef.child(path);
  childRef.set(data);
  console.log(name + ' stored!');
}

const ANY = 'any';
const ALL = 'all';

/***********
* ABILITIES
***********/

const ABILITY_PATH = 'abilities';

const ABILITY = {
  'STR': {
    'VALUE': 'STR',
    'PATH': ABILITY_PATH
  },
  'DEX': {
    'VALUE': 'DEX',
    'PATH': ABILITY_PATH
  },
  'CON': {
    'VALUE': 'CON',
    'PATH': ABILITY_PATH
  },
  'INT': {
    'VALUE': 'INT',
    'PATH': ABILITY_PATH
  },
  'WIS': {
    'VALUE': 'WIS',
    'PATH': ABILITY_PATH
  },
  'CHA': {
    'VALUE': 'CHA',
    'PATH': ABILITY_PATH
  },
  'ANY': {
    'VALUE': ANY,
    'PATH': ABILITY_PATH
  }
};

function Ability(id, name, longName, skillsList=null) {
  if (arguments.length < 3) {
    console.log('ERROR: Missing required arguments');
    return null;
  }

  var ability = {
    'id': id,
    'name': name,
    'longName': longName,
  }

  if (skillsList !== null) {
    var skills = {};
    for (s of skillsList) {
      skills[s] = true;
    }
    ability['skills'] = skills;
  }

  return ability;
}

function getAbilities() {
  var abilities = {};

  abilities[ABILITY.STR.VALUE] = Ability(
    pushID(ABILITY.STR.VALUE),
    ABILITY.STR.VALUE,
    'Strength',
    [
      SKILL.ATHLETICS.VALUE
    ]
  );

  abilities[ABILITY.DEX.VALUE] = Ability(
    pushID(ABILITY.DEX.VALUE),
    ABILITY.DEX.VALUE,
    'Dexterity',
    [
      SKILL.ACROBATICS.VALUE,
      SKILL.SLEIGHT_OF_HAND.VALUE,
      SKILL.STEALTH.VALUE
    ]
  );

  abilities[ABILITY.CON.VALUE] = Ability(
    pushID(ABILITY.CON.VALUE),
    ABILITY.CON.VALUE,
    'Constitution'
  );

  abilities[ABILITY.INT.VALUE] = Ability(
    pushID(ABILITY.INT.VALUE),
    ABILITY.INT.VALUE,
    'Intelligence',
    [
      SKILL.ARCANA.VALUE,
      SKILL.HISTORY.VALUE,
      SKILL.INVESTIGATION.VALUE,
      SKILL.NATURE.VALUE,
      SKILL.RELIGION.VALUE
    ]
  );

  abilities[ABILITY.WIS.VALUE] = Ability(
    pushID(ABILITY.WIS.VALUE),
    ABILITY.WIS.VALUE,
    'Wisdom',
    [
      SKILL.ANIMAL_HANDLING.VALUE,
      SKILL.INSIGHT.VALUE,
      SKILL.MEDICINE.VALUE,
      SKILL.PERCEPTION.VALUE,
      SKILL.SURVIVAL.VALUE
    ]
  );

  abilities[ABILITY.CHA.VALUE] = Ability(
    pushID(ABILITY.CHA.VALUE),
    ABILITY.CHA.VALUE,
    'Charisma',
    [
      SKILL.DECEPTION.VALUE,
      SKILL.INTIMIDATION.VALUE,
      SKILL.PERFORMANCE.VALUE,
      SKILL.PERSUASION.VALUE
    ]
  );

  return abilities;
}

/********
* SKILLS
********/

const SKILL_PATH = 'skills';

const SKILL = {
  'ATHLETICS': {
    'VALUE': 'athletics',
    'PATH': SKILL_PATH
  },
  'ACROBATICS': {
    'VALUE': 'acrobatics',
    'PATH': SKILL_PATH
  },
  'SLEIGHT_OF_HAND': {
    'VALUE': 'sleight_of_hand',
    'PATH': SKILL_PATH
  },
  'STEALTH': {
    'VALUE': 'stealth',
    'PATH': SKILL_PATH
  },
  'ARCANA': {
    'VALUE': 'arcana',
    'PATH': SKILL_PATH
  },
  'HISTORY': {
    'VALUE': 'history',
    'PATH': SKILL_PATH
  },
  'INVESTIGATION': {
    'VALUE': 'investigation',
    'PATH': SKILL_PATH
  },
  'NATURE': {
    'VALUE': 'nature',
    'PATH': SKILL_PATH
  },
  'RELIGION': {
    'VALUE': 'religion',
    'PATH': SKILL_PATH
  },
  'ANIMAL_HANDLING': {
    'VALUE': 'animal_handling',
    'PATH': SKILL_PATH
  },
  'INSIGHT': {
    'VALUE': 'insight',
    'PATH': SKILL_PATH
  },
  'MEDICINE': {
    'VALUE': 'medicine',
    'PATH': SKILL_PATH
  },
  'PERCEPTION': {
    'VALUE': 'perception',
    'PATH': SKILL_PATH
  },
  'SURVIVAL': {
    'VALUE': 'survival',
    'PATH': SKILL_PATH
  },
  'DECEPTION': {
    'VALUE': 'deception',
    'PATH': SKILL_PATH
  },
  'INTIMIDATION': {
    'VALUE': 'intimidation',
    'PATH': SKILL_PATH
  },
  'PERFORMANCE': {
    'VALUE': 'performance',
    'PATH': SKILL_PATH
  },
  'PERSUASION': {
    'VALUE': 'persuasion',
    'PATH': SKILL_PATH
  },
  'ANY': {
    'VALUE': ANY,
    'PATH': SKILL_PATH
  }
};

function Skill(id, name, parentAbility) {
  if (arguments.length < 3) {
    console.log('ERROR: Missing required arguments');
    return null;
  }

  return {
    'id': id,
    'name': name,
    'parentAbility': parentAbility
  };
}

function getSkills() {
  var skills = {};

  skills[SKILL.ATHLETICS.VALUE] = Skill(
    pushID(SKILL.ATHLETICS.VALUE),
    'Athletics',
    ABILITY.STR.VALUE
  );

  skills[SKILL.ACROBATICS.VALUE] = Skill(
    pushID(SKILL.ACROBATICS.VALUE),
    'Acrobatics',
    ABILITY.DEX.VALUE
  );

  skills[SKILL.SLEIGHT_OF_HAND.VALUE] = Skill(
    pushID(SKILL.SLEIGHT_OF_HAND.VALUE),
    'Sleight of Hand',
    ABILITY.DEX.VALUE
  );

  skills[SKILL.STEALTH.VALUE] = Skill(
    pushID(SKILL.STEALTH.VALUE),
    'Stealth',
    ABILITY.DEX.VALUE
  );

  skills[SKILL.ARCANA.VALUE] = Skill(
    pushID(SKILL.ARCANA.VALUE),
    'Arcana',
    ABILITY.INT.VALUE
  );

  skills[SKILL.HISTORY.VALUE] = Skill(
    pushID(SKILL.HISTORY.VALUE),
    'History',
    ABILITY.INT.VALUE
  );

  skills[SKILL.INVESTIGATION.VALUE] = Skill(
    pushID(SKILL.INVESTIGATION.VALUE),
    'Investigation',
    ABILITY.INT.VALUE
  );

  skills[SKILL.NATURE.VALUE] = Skill(
    pushID(SKILL.NATURE.VALUE),
    'Nature',
    ABILITY.INT.VALUE
  );

  skills[SKILL.RELIGION.VALUE] = Skill(
    pushID(SKILL.RELIGION.VALUE),
    'Religion',
    ABILITY.INT.VALUE
  );

  skills[SKILL.ANIMAL_HANDLING.VALUE] = Skill(
    pushID(SKILL.ANIMAL_HANDLING.VALUE),
    'Animal Handling',
    ABILITY.WIS.VALUE
  );

  skills[SKILL.INSIGHT.VALUE] = Skill(
    pushID(SKILL.INSIGHT.VALUE),
    'Insight',
    ABILITY.WIS.VALUE
  );

  skills[SKILL.MEDICINE.VALUE] = Skill(
    pushID(SKILL.MEDICINE.VALUE),
    'Medicine',
    ABILITY.WIS.VALUE
  );

  skills[SKILL.PERCEPTION.VALUE] = Skill(
    pushID(SKILL.PERCEPTION.VALUE),
    'Perception',
    ABILITY.WIS.VALUE
  );

  skills[SKILL.SURVIVAL.VALUE] = Skill(
    pushID(SKILL.SURVIVAL.VALUE),
    'Survival',
    ABILITY.WIS.VALUE
  );

  skills[SKILL.DECEPTION.VALUE] = Skill(
    pushID(SKILL.DECEPTION.VALUE),
    'Deception',
    ABILITY.CHA.VALUE
  );

  skills[SKILL.INTIMIDATION.VALUE] = Skill(
    pushID(SKILL.INTIMIDATION.VALUE),
    'Intimidation',
    ABILITY.CHA.VALUE
  );

  skills[SKILL.PERFORMANCE.VALUE] = Skill(
    pushID(SKILL.PERFORMANCE.VALUE),
    'Performance',
    ABILITY.CHA.VALUE
  );

  skills[SKILL.PERSUASION.VALUE] = Skill(
    pushID(SKILL.PERSUASION.VALUE),
    'Persuasion',
    ABILITY.CHA.VALUE
  );

  return skills;
}

/***********
* LANGUAGES
***********/

const LANGUAGE_PATH = 'languages';

// LANGUAGE does not have VALUE or PATH
const LANGUAGE = {
  'COMMON': 'common',
  'DWARVISH': 'dwarvish',
  'ELVISH': 'elvish',
  'HALFLING': 'halfling',
  'DRACONIC': 'draconic',
  'GNOMISH': 'gnomish',
  'ORC': 'orc',
  'INFERNAL': 'infernal',
  'ANY': ANY,
  'ALL': ALL
};

function Language(id, name) {
  if (arguments.length < 2) {
    console.log('ERROR: Missing required arguments');
    return null;
  }

  return {
    'id': id,
    'name': name
  };
}

function getLanguages() {
  var languages = {};

  languages[LANGUAGE.COMMON] = Language(
    pushID(LANGUAGE.COMMON),
    'Common'
  );

  languages[LANGUAGE.DWARVISH] = Language(
    pushID(LANGUAGE.DWARVISH),
    'Dwarvish'
  );

  languages[LANGUAGE.ELVISH] = Language(
    pushID(LANGUAGE.ELVISH),
    'Elvish'
  );

  languages[LANGUAGE.HALFLING] = Language(
    pushID(LANGUAGE.HALFLING),
    'Halfling'
  );

  languages[LANGUAGE.DRACONIC] = Language(
    pushID(LANGUAGE.DRACONIC),
    'Draconic'
  );

  languages[LANGUAGE.GNOMISH] = Language(
    pushID(LANGUAGE.GNOMISH),
    'Gnomish'
  );

  languages[LANGUAGE.ORC] = Language(
    pushID(LANGUAGE.ORC),
    'Orc'
  );

  languages[LANGUAGE.INFERNAL] = Language(
    pushID(LANGUAGE.INFERNAL),
    'Infernal'
  );

  return languages;
}

/*********
* WEAPONS
*********/

const WEAPON_PATH = 'weapons';
const WEAPON_CLASS_PATH = 'weapon_classes';
const WEAPON_CATEGORY_PATH = 'weapon_categories';

const WEAPON = {
  'CLUB': {
    'VALUE': 'club',
    'PATH': WEAPON_PATH
  },
  'DAGGER': {
    'VALUE': 'dagger',
    'PATH': WEAPON_PATH
  },
  'GREATCLUB': {
    'VALUE': 'greatclub',
    'PATH': WEAPON_PATH
  },
  'HANDAXE': {
    'VALUE': 'handaxe',
    'PATH': WEAPON_PATH
  },
  'JAVELIN': {
    'VALUE': 'javelin',
    'PATH': WEAPON_PATH
  },
  'LIGHT_HAMMER': {
    'VALUE': 'light_hammer',
    'PATH': WEAPON_PATH
  },
  'MACE': {
    'VALUE': 'mace',
    'PATH': WEAPON_PATH
  },
  'QUARTERSTAFF': {
    'VALUE': 'quarterstaff',
    'PATH': WEAPON_PATH
  },
  'SICKLE': {
    'VALUE': 'sickle',
    'PATH': WEAPON_PATH
  },
  'SPEAR': {
    'VALUE': 'spear',
    'PATH': WEAPON_PATH
  },
  'LIGHT_CROSSBOW': {
    'VALUE': 'light_crossbow',
    'PATH': WEAPON_PATH
  },
  'DART': {
    'VALUE': 'dart',
    'PATH': WEAPON_PATH
  },
  'SHORTBOW': {
    'VALUE': 'shortbow',
    'PATH': WEAPON_PATH
  },
  'SLING': {
    'VALUE': 'sling',
    'PATH': WEAPON_PATH
  },
  'BATTLEAXE': {
    'VALUE': 'battleaxe',
    'PATH': WEAPON_PATH
  },
  'FLAIL': {
    'VALUE': 'flail',
    'PATH': WEAPON_PATH
  },
  'GLAIVE': {
    'VALUE': 'glaive',
    'PATH': WEAPON_PATH
  },
  'GREATAXE': {
    'VALUE': 'greataxe',
    'PATH': WEAPON_PATH
  },
  'GREATSWORD': {
    'VALUE': 'greatsword',
    'PATH': WEAPON_PATH
  },
  'HALBERD': {
    'VALUE': 'halberd',
    'PATH': WEAPON_PATH
  },
  'LANCE': {
    'VALUE': 'lance',
    'PATH': WEAPON_PATH
  },
  'LONGSWORD': {
    'VALUE': 'longsword',
    'PATH': WEAPON_PATH
  },
  'MAUL': {
    'VALUE': 'maul',
    'PATH': WEAPON_PATH
  },
  'MORNINGSTAR': {
    'VALUE': 'morningstar',
    'PATH': WEAPON_PATH
  },
  'PIKE': {
    'VALUE': 'pike',
    'PATH': WEAPON_PATH
  },
  'RAPIER': {
    'VALUE': 'rapier',
    'PATH': WEAPON_PATH
  },
  'SCIMITAR': {
    'VALUE': 'scimitar',
    'PATH': WEAPON_PATH
  },
  'SHORTSWORD': {
    'VALUE': 'shortsword',
    'PATH': WEAPON_PATH
  },
  'TRIDENT': {
    'VALUE': 'trident',
    'PATH': WEAPON_PATH
  },
  'WAR_PICK': {
    'VALUE': 'war_pick',
    'PATH': WEAPON_PATH
  },
  'WARHAMMER': {
    'VALUE': 'warhammer',
    'PATH': WEAPON_PATH
  },
  'WHIP': {
    'VALUE': 'whip',
    'PATH': WEAPON_PATH
  },
  'BLOWGUN': {
    'VALUE': 'blowgun',
    'PATH': WEAPON_PATH
  },
  'HAND_CROSSBOW': {
    'VALUE': 'hand_crossbow',
    'PATH': WEAPON_PATH
  },
  'HEAVY_CROSSBOW': {
    'VALUE': 'heavy_crossbow',
    'PATH': WEAPON_PATH
  },
  'LONGBOW': {
    'VALUE': 'longbow',
    'PATH': WEAPON_PATH
  },
  'NET': {
    'VALUE': 'net',
    'PATH': WEAPON_PATH
  },
  'ANY': {
    'VALUE': ANY,
    'PATH': WEAPON_PATH
  },
  'ALL': {
    'VALUE': ALL,
    'PATH': WEAPON_PATH
  },

  'CLASS': {
    'MELEE': {
      'VALUE': 'melee',
      'PATH': WEAPON_CLASS_PATH
    },
    'RANGED': {
      'VALUE': 'ranged',
      'PATH': WEAPON_CLASS_PATH
    }
  },
  'CATEGORY': {
    'SIMPLE': {
      'VALUE': 'simple',
      'PATH': WEAPON_CATEGORY_PATH
    },
    'MARTIAL': {
      'VALUE': 'martial',
      'PATH': WEAPON_CATEGORY_PATH
    }
  },
  'DAMAGE': {
    'BLUDGEONING': 'bludgeoning',
    'PIERCING': 'piercing',
    'SLASHING': 'slashing'
  },
  'PROPERTY': {
    'AMMUNITION': 'ammunition',
    'FINESSE': 'finesse',
    'HEAVY': 'heavy',
    'LIGHT': 'light',
    'LOADING': 'loading',
    'REACH': 'reach',
    'SPECIAL': 'special',
    'THROWN': 'thrown',
    'TWO_HANDED': 'two_handed',
    'VERSATILE': 'versatile'
  }
}

function getWeaponClasses() {
  var melee = {};
  melee[WEAPON.CLUB.VALUE] = true;
  melee[WEAPON.DAGGER.VALUE] = true;
  melee[WEAPON.GREATCLUB.VALUE] = true;
  melee[WEAPON.HANDAXE.VALUE] = true;
  melee[WEAPON.JAVELIN.VALUE] = true;
  melee[WEAPON.LIGHT_HAMMER.VALUE] = true;
  melee[WEAPON.MACE.VALUE] = true;
  melee[WEAPON.QUARTERSTAFF.VALUE] = true;
  melee[WEAPON.SICKLE.VALUE] = true;
  melee[WEAPON.SPEAR.VALUE] = true;
  melee[WEAPON.BATTLEAXE.VALUE] = true;
  melee[WEAPON.FLAIL.VALUE] = true;
  melee[WEAPON.GLAIVE.VALUE] = true;
  melee[WEAPON.GREATAXE.VALUE] = true;
  melee[WEAPON.GREATSWORD.VALUE] = true;
  melee[WEAPON.HALBERD.VALUE] = true;
  melee[WEAPON.LANCE.VALUE] = true;
  melee[WEAPON.LONGSWORD.VALUE] = true;
  melee[WEAPON.MAUL.VALUE] = true;
  melee[WEAPON.MORNINGSTAR.VALUE] = true;
  melee[WEAPON.PIKE.VALUE] = true;
  melee[WEAPON.RAPIER.VALUE] = true;
  melee[WEAPON.SCIMITAR.VALUE] = true;
  melee[WEAPON.SHORTSWORD.VALUE] = true;
  melee[WEAPON.TRIDENT.VALUE] = true;
  melee[WEAPON.WAR_PICK.VALUE] = true;
  melee[WEAPON.WARHAMMER.VALUE] = true;
  melee[WEAPON.WHIP.VALUE] = true;

  var ranged = {};
  ranged[WEAPON.LIGHT_CROSSBOW.VALUE] = true;
  ranged[WEAPON.DART.VALUE] = true;
  ranged[WEAPON.SHORTBOW.VALUE] = true;
  ranged[WEAPON.SLING.VALUE] = true;
  ranged[WEAPON.BLOWGUN.VALUE] = true;
  ranged[WEAPON.HAND_CROSSBOW.VALUE] = true;
  ranged[WEAPON.HEAVY_CROSSBOW.VALUE] = true;
  ranged[WEAPON.LONGBOW.VALUE] = true;
  ranged[WEAPON.NET.VALUE] = true;

  var weaponClasses = {};
  weaponClasses[WEAPON.CLASS.MELEE.VALUE] = melee;
  weaponClasses[WEAPON.CLASS.RANGED.VALUE] = ranged;

  return weaponClasses;
}

function getWeaponCategories() {
  var simple = {};
  simple[WEAPON.CLUB.VALUE] = true;
  simple[WEAPON.DAGGER.VALUE] = true;
  simple[WEAPON.GREATCLUB.VALUE] = true;
  simple[WEAPON.HANDAXE.VALUE] = true;
  simple[WEAPON.JAVELIN.VALUE] = true;
  simple[WEAPON.LIGHT_HAMMER.VALUE] = true;
  simple[WEAPON.MACE.VALUE] = true;
  simple[WEAPON.QUARTERSTAFF.VALUE] = true;
  simple[WEAPON.SICKLE.VALUE] = true;
  simple[WEAPON.SPEAR.VALUE] = true;
  simple[WEAPON.LIGHT_CROSSBOW.VALUE] = true;
  simple[WEAPON.DART.VALUE] = true;
  simple[WEAPON.SHORTBOW.VALUE] = true;
  simple[WEAPON.SLING.VALUE] = true;

  var martial = {};
  martial[WEAPON.BATTLEAXE.VALUE] = true;
  martial[WEAPON.FLAIL.VALUE] = true;
  martial[WEAPON.GLAIVE.VALUE] = true;
  martial[WEAPON.GREATAXE.VALUE] = true;
  martial[WEAPON.GREATSWORD.VALUE] = true;
  martial[WEAPON.HALBERD.VALUE] = true;
  martial[WEAPON.LANCE.VALUE] = true;
  martial[WEAPON.LONGSWORD.VALUE] = true;
  martial[WEAPON.MAUL.VALUE] = true;
  martial[WEAPON.MORNINGSTAR.VALUE] = true;
  martial[WEAPON.PIKE.VALUE] = true;
  martial[WEAPON.RAPIER.VALUE] = true;
  martial[WEAPON.SCIMITAR.VALUE] = true;
  martial[WEAPON.SHORTSWORD.VALUE] = true;
  martial[WEAPON.TRIDENT.VALUE] = true;
  martial[WEAPON.WAR_PICK.VALUE] = true;
  martial[WEAPON.WARHAMMER.VALUE] = true;
  martial[WEAPON.WHIP.VALUE] = true;
  martial[WEAPON.BLOWGUN.VALUE] = true;
  martial[WEAPON.HAND_CROSSBOW.VALUE] = true;
  martial[WEAPON.HEAVY_CROSSBOW.VALUE] = true;
  martial[WEAPON.LONGBOW.VALUE] = true;
  martial[WEAPON.NET.VALUE] = true;

  var weaponCategories = {};
  weaponCategories[WEAPON.CATEGORY.SIMPLE.VALUE] = simple;
  weaponCategories[WEAPON.CATEGORY.MARTIAL.VALUE] = martial;

  return weaponCategories;
}

function Weapon(id, name, classType, category, costGP, damage, weightLB, properties=null) {
  if (arguments.length < 7) {
    console.log('ERROR: Missing required arguments');
    return null;
  }

  var weapon = {
    'id': id,
    'name': name,
    'class': classType,
    'category': category,
    'costGP': costGP,
    'damage': damage,
    'weightLB': weightLB
  };

  if (properties !== null) {
    weapon['properties'] = properties;
  }

  return weapon;
}

function Damage(num, die, type) {
  if (arguments.length === 0) {
    num = 0;
    die = 0;
    type = 'none';
  }
  else if (arguments.length < 3) {
    console.log('ERROR: Missing arguments');
    return null;
  }

  var damage = {
    'num': num,
    'die': die,
    'type': type
  };

  return damage;
}

function Properties(list) {
  if (list.length === 0) {
    return null;
  }

  var properties = {};

  for (l of list) {
    if (l.hasOwnProperty('range')) {
      var property = {};
      for (key of Object.keys(l)) {
        if (key !== 'id') {
          property[key] = l[key];
        }
      }

      properties[l.id] = property;
    }
    else {
      properties[l] = true;
    }
  }

  return properties;
}

function Range(id, normal, max) {
  if (arguments.length < 3) {
    console.log('ERROR: Missing arguments');
    return null;
  }

  var name = id[0].toUpperCase() + id.slice(1);

  return {
    'id': id,
    'name': name,
    'range': {
      'normal':normal,
      'max':max
    }
  };
}

function getWeapons() {
  const weapons = {
    'club': Weapon(
      pushID(WEAPON.CLUB.VALUE),
      'Club',
      WEAPON.CLASS.MELEE.VALUE,
      WEAPON.CATEGORY.SIMPLE.VALUE,
      0.1,
      Damage(1, 4, WEAPON.DAMAGE.BLUDGEONING),
      2,
      Properties([
        WEAPON.PROPERTY.LIGHT
      ])
    ),
    'dagger': Weapon(
      pushID(WEAPON.DAGGER.VALUE),
      'Dagger',
      WEAPON.CLASS.MELEE.VALUE,
      WEAPON.CATEGORY.SIMPLE.VALUE,
      2,
      Damage(1, 4, WEAPON.DAMAGE.PIERCING),
      1,
      Properties([
        WEAPON.PROPERTY.FINESSE,
        WEAPON.PROPERTY.LIGHT,
        Range(WEAPON.PROPERTY.THROWN, 20, 60)
      ])
    ),
    'greatclub': Weapon(
      pushID(WEAPON.GREATCLUB.VALUE),
      'Greatclub',
      WEAPON.CLASS.MELEE.VALUE,
      WEAPON.CATEGORY.SIMPLE.VALUE,
      0.2,
      Damage(1, 8, WEAPON.DAMAGE.BLUDGEONING),
      10,
      Properties([
        WEAPON.PROPERTY.TWO_HANDED
      ])
    ),
    'handaxe': Weapon(
      pushID(WEAPON.HANDAXE.VALUE),
      'Handaxe',
      WEAPON.CLASS.MELEE.VALUE,
      WEAPON.CATEGORY.SIMPLE.VALUE,
      5,
      Damage(1, 6, WEAPON.DAMAGE.SLASHING),
      2,
      Properties([
        WEAPON.PROPERTY.LIGHT,
        Range(WEAPON.PROPERTY.THROWN, 20, 60)
      ])
    ),
    'javelin': Weapon(
      pushID(WEAPON.JAVELIN.VALUE),
      'Javelin',
      WEAPON.CLASS.MELEE.VALUE,
      WEAPON.CATEGORY.SIMPLE.VALUE,
      0.5,
      Damage(1, 6, WEAPON.DAMAGE.PIERCING),
      2,
      Properties([
        Range(WEAPON.PROPERTY.THROWN, 30, 120)
      ])
    ),
    'light_hammer': Weapon(
      pushID(WEAPON.LIGHT_HAMMER.VALUE),
      'Light hammer',
      WEAPON.CLASS.MELEE.VALUE,
      WEAPON.CATEGORY.SIMPLE.VALUE,
      2,
      Damage(1, 4, WEAPON.DAMAGE.BLUDGEONING),
      2,
      Properties([
        WEAPON.PROPERTY.LIGHT,
        Range(WEAPON.PROPERTY.THROWN, 20, 60)
      ])
    ),
    'mace': Weapon(
      pushID(WEAPON.MACE.VALUE),
      'Mace',
      WEAPON.CLASS.MELEE.VALUE,
      WEAPON.CATEGORY.SIMPLE.VALUE,
      5,
      Damage(1, 6, WEAPON.DAMAGE.BLUDGEONING),
      4
    ),
    'quarterstaff': Weapon(
      pushID(WEAPON.QUARTERSTAFF.VALUE),
      'Quarterstaff',
      WEAPON.CLASS.MELEE.VALUE,
      WEAPON.CATEGORY.SIMPLE.VALUE,
      0.2,
      Damage(1, 6, WEAPON.DAMAGE.BLUDGEONING),
      4,
      Properties([
        WEAPON.PROPERTY.VERSATILE
      ])
    ),
    'sickle': Weapon(
      pushID(WEAPON.SICKLE.VALUE),
      'Sickle',
      WEAPON.CLASS.MELEE.VALUE,
      WEAPON.CATEGORY.SIMPLE.VALUE,
      1,
      Damage(1, 4, WEAPON.DAMAGE.SLASHING),
      2,
      Properties([
        WEAPON.PROPERTY.LIGHT
      ])
    ),
    'spear': Weapon(
      pushID(WEAPON.SPEAR.VALUE),
      'Spear',
      WEAPON.CLASS.MELEE.VALUE,
      WEAPON.CATEGORY.SIMPLE.VALUE,
      1,
      Damage(1, 6, WEAPON.DAMAGE.PIERCING),
      3,
      Properties([
        Range(WEAPON.PROPERTY.THROWN, 20, 60),
        WEAPON.PROPERTY.VERSATILE
      ])
    ),
    'light_crossbow': Weapon(
      pushID(WEAPON.LIGHT_CROSSBOW.VALUE),
      'Crossbow, light',
      WEAPON.CLASS.RANGED.VALUE,
      WEAPON.CATEGORY.SIMPLE.VALUE,
      25,
      Damage(1, 8, WEAPON.DAMAGE.PIERCING),
      5,
      Properties([
        Range(WEAPON.PROPERTY.AMMUNITION, 80, 320),
        WEAPON.PROPERTY.LOADING,
        WEAPON.PROPERTY.TWO_HANDED
      ])
    ),
    'dart': Weapon(
      pushID(WEAPON.DART.VALUE),
      'Dart',
      WEAPON.CLASS.RANGED.VALUE,
      WEAPON.CATEGORY.SIMPLE.VALUE,
      0.05,
      Damage(1, 4, WEAPON.DAMAGE.PIERCING),
      0.25,
      Properties([
        WEAPON.PROPERTY.FINESSE,
        Range(WEAPON.PROPERTY.THROWN, 20, 60)
      ])
    ),
    'shortbow': Weapon(
      pushID(WEAPON.SHORTBOW.VALUE),
      'Shortbow',
      WEAPON.CLASS.RANGED.VALUE,
      WEAPON.CATEGORY.SIMPLE.VALUE,
      25,
      Damage(1, 6, WEAPON.DAMAGE.PIERCING),
      2,
      Properties([
        Range(WEAPON.PROPERTY.AMMUNITION, 80, 320),
        WEAPON.PROPERTY.LOADING,
        WEAPON.PROPERTY.TWO_HANDED
      ])
    ),
    'sling': Weapon(
      pushID(WEAPON.SLING.VALUE),
      'Sling',
      WEAPON.CLASS.RANGED.VALUE,
      WEAPON.CATEGORY.SIMPLE.VALUE,
      0.1,
      Damage(1, 4, WEAPON.DAMAGE.BLUDGEONING),
      0,
      Properties([
        Range(WEAPON.PROPERTY.AMMUNITION, 30, 120)
      ])
    ),
    'battleaxe': Weapon(
      pushID(WEAPON.BATTLEAXE.VALUE),
      'Battleaxe',
      WEAPON.CLASS.MELEE.VALUE,
      WEAPON.CATEGORY.MARTIAL.VALUE,
      10,
      Damage(1, 8, WEAPON.DAMAGE.SLASHING),
      4,
      Properties([
        WEAPON.PROPERTY.VERSATILE
      ])
    ),
    'flail': Weapon(
      pushID(WEAPON.FLAIL.VALUE),
      'Flail',
      WEAPON.CLASS.MELEE.VALUE,
      WEAPON.CATEGORY.MARTIAL.VALUE,
      10,
      Damage(1, 8, WEAPON.DAMAGE.BLUDGEONING),
      2
    ),
    'glaive': Weapon(
      pushID(WEAPON.GLAIVE.VALUE),
      'Glaive',
      WEAPON.CLASS.MELEE.VALUE,
      WEAPON.CATEGORY.MARTIAL.VALUE,
      20,
      Damage(1, 10, WEAPON.DAMAGE.SLASHING),
      6,
      Properties([
        WEAPON.PROPERTY.HEAVY,
        WEAPON.PROPERTY.REACH,
        WEAPON.PROPERTY.TWO_HANDED
      ])
    ),
    'greataxe': Weapon(
      pushID(WEAPON.GREATAXE.VALUE),
      'Greataxe',
      WEAPON.CLASS.MELEE.VALUE,
      WEAPON.CATEGORY.MARTIAL.VALUE,
      30,
      Damage(1, 12, WEAPON.DAMAGE.SLASHING),
      7,
      Properties([
        WEAPON.PROPERTY.HEAVY,
        WEAPON.PROPERTY.TWO_HANDED
      ])
    ),
    'greatsword': Weapon(
      pushID(WEAPON.GREATSWORD.VALUE),
      'Greatsword',
      WEAPON.CLASS.MELEE.VALUE,
      WEAPON.CATEGORY.MARTIAL.VALUE,
      50,
      Damage(2, 6, WEAPON.DAMAGE.SLASHING),
      6,
      Properties([
        WEAPON.PROPERTY.HEAVY,
        WEAPON.PROPERTY.TWO_HANDED
      ])
    ),
    'halberd': Weapon(
      pushID(WEAPON.HALBERD.VALUE),
      'Halberd',
      WEAPON.CLASS.MELEE.VALUE,
      WEAPON.CATEGORY.MARTIAL.VALUE,
      20,
      Damage(1, 10, WEAPON.DAMAGE.SLASHING),
      6,
      Properties([
        WEAPON.PROPERTY.HEAVY,
        WEAPON.PROPERTY.REACH,
        WEAPON.PROPERTY.TWO_HANDED
      ])
    ),
    'lance': Weapon(
      pushID(WEAPON.LANCE.VALUE),
      'Lance',
      WEAPON.CLASS.MELEE.VALUE,
      WEAPON.CATEGORY.MARTIAL.VALUE,
      10,
      Damage(1, 12, WEAPON.DAMAGE.PIERCING),
      6,
      Properties([
        WEAPON.PROPERTY.REACH,
        WEAPON.PROPERTY.SPECIAL
      ])
    ),
    'longsword': Weapon(
      pushID(WEAPON.LONGSWORD.VALUE),
      'Longsword',
      WEAPON.CLASS.MELEE.VALUE,
      WEAPON.CATEGORY.MARTIAL.VALUE,
      15,
      Damage(1, 8, WEAPON.DAMAGE.SLASHING),
      3,
      Properties([
        WEAPON.PROPERTY.VERSATILE
      ])
    ),
    'maul': Weapon(
      pushID(WEAPON.MAUL.VALUE),
      'Maul',
      WEAPON.CLASS.MELEE.VALUE,
      WEAPON.CATEGORY.MARTIAL.VALUE,
      10,
      Damage(2, 6, WEAPON.DAMAGE.BLUDGEONING),
      10,
      Properties([
        WEAPON.PROPERTY.HEAVY,
        WEAPON.PROPERTY.TWO_HANDED
      ])
    ),
    'morningstar': Weapon(
      pushID(WEAPON.MORNINGSTAR.VALUE),
      'Morningstar',
      WEAPON.CLASS.MELEE.VALUE,
      WEAPON.CATEGORY.MARTIAL.VALUE,
      15,
      Damage(1, 8, WEAPON.DAMAGE.PIERCING),
      4
    ),
    'pike': Weapon(
      pushID(WEAPON.PIKE.VALUE),
      'Pike',
      WEAPON.CLASS.MELEE.VALUE,
      WEAPON.CATEGORY.MARTIAL.VALUE,
      5,
      Damage(1, 10, WEAPON.DAMAGE.PIERCING),
      18,
      Properties([
        WEAPON.PROPERTY.HEAVY,
        WEAPON.PROPERTY.REACH,
        WEAPON.PROPERTY.TWO_HANDED
      ])
    ),
    'rapier': Weapon(
      pushID(WEAPON.RAPIER.VALUE),
      'Rapier',
      WEAPON.CLASS.MELEE.VALUE,
      WEAPON.CATEGORY.MARTIAL.VALUE,
      25,
      Damage(1, 8, WEAPON.DAMAGE.PIERCING),
      2,
      Properties([
        WEAPON.PROPERTY.FINESSE
      ])
    ),
    'scimitar': Weapon(
      pushID(WEAPON.SCIMITAR.VALUE),
      'Scimitar',
      WEAPON.CLASS.MELEE.VALUE,
      WEAPON.CATEGORY.MARTIAL.VALUE,
      25,
      Damage(1, 6, WEAPON.DAMAGE.SLASHING),
      3,
      Properties([
        WEAPON.PROPERTY.FINESSE,
        WEAPON.PROPERTY.LIGHT
      ])
    ),
    'shortsword': Weapon(
      pushID(WEAPON.SHORTSWORD.VALUE),
      'Shortsword',
      WEAPON.CLASS.MELEE.VALUE,
      WEAPON.CATEGORY.MARTIAL.VALUE,
      10,
      Damage(1, 6, WEAPON.DAMAGE.PIERCING),
      2,
      Properties([
        WEAPON.PROPERTY.FINESSE,
        WEAPON.PROPERTY.LIGHT
      ])
    ),
    'trident': Weapon(
      pushID(WEAPON.TRIDENT.VALUE),
      'Trident',
      WEAPON.CLASS.MELEE.VALUE,
      WEAPON.CATEGORY.MARTIAL.VALUE,
      5,
      Damage(1, 6, WEAPON.DAMAGE.PIERCING),
      4,
      Properties([
        Range(WEAPON.PROPERTY.THROWN, 20, 60),
        WEAPON.PROPERTY.VERSATILE
      ])
    ),
    'war_pick': Weapon(
      pushID(WEAPON.WAR_PICK.VALUE),
      'War pick',
      WEAPON.CLASS.MELEE.VALUE,
      WEAPON.CATEGORY.MARTIAL.VALUE,
      5,
      Damage(1, 8, WEAPON.DAMAGE.PIERCING),
      2
    ),
    'warhammer': Weapon(
      pushID(WEAPON.WARHAMMER.VALUE),
      'Warhammer',
      WEAPON.CLASS.MELEE.VALUE,
      WEAPON.CATEGORY.MARTIAL.VALUE,
      15,
      Damage(1, 8, WEAPON.DAMAGE.BLUDGEONING),
      2,
      Properties([
        WEAPON.PROPERTY.VERSATILE
      ])
    ),
    'whip': Weapon(
      pushID(WEAPON.WHIP.VALUE),
      'Whip',
      WEAPON.CLASS.MELEE.VALUE,
      WEAPON.CATEGORY.MARTIAL.VALUE,
      2,
      Damage(1, 4, WEAPON.DAMAGE.SLASHING),
      3,
      Properties([
        WEAPON.PROPERTY.FINESSE,
        WEAPON.PROPERTY.REACH
      ])
    ),
    'blowgun': Weapon(
      pushID(WEAPON.BLOWGUN.VALUE),
      'Blowgun',
      WEAPON.CLASS.RANGED.VALUE,
      WEAPON.CATEGORY.MARTIAL.VALUE,
      10,
      Damage(1, 1, WEAPON.DAMAGE.PIERCING),
      1,
      Properties([
        Range(WEAPON.PROPERTY.AMMUNITION, 25, 100),
        WEAPON.PROPERTY.LOADING
      ])
    ),
    'hand_crossbow': Weapon(
      pushID(WEAPON.HAND_CROSSBOW.VALUE),
      'Crossbow, hand',
      WEAPON.CLASS.RANGED.VALUE,
      WEAPON.CATEGORY.MARTIAL.VALUE,
      75,
      Damage(1, 6, WEAPON.DAMAGE.PIERCING),
      3,
      Properties([
        Range(WEAPON.PROPERTY.AMMUNITION, 30, 120),
        WEAPON.PROPERTY.LIGHT,
        WEAPON.PROPERTY.LOADING
      ])
    ),
    'heavy_crossbow': Weapon(
      pushID(WEAPON.HEAVY_CROSSBOW.VALUE),
      'Crossbow, heavy',
      WEAPON.CLASS.RANGED.VALUE,
      WEAPON.CATEGORY.MARTIAL.VALUE,
      50,
      Damage(1, 10, WEAPON.DAMAGE.PIERCING),
      18,
      Properties([
        Range(WEAPON.PROPERTY.AMMUNITION, 100, 400),
        WEAPON.PROPERTY.HEAVY,
        WEAPON.PROPERTY.LOADING,
        WEAPON.PROPERTY.TWO_HANDED
      ])
    ),
    'longbow': Weapon(
      pushID(WEAPON.LONGBOW.VALUE),
      'Longbow',
      WEAPON.CLASS.RANGED.VALUE,
      WEAPON.CATEGORY.MARTIAL.VALUE,
      50,
      Damage(1, 8, WEAPON.DAMAGE.PIERCING),
      2,
      Properties([
        Range(WEAPON.PROPERTY.AMMUNITION, 150, 600),
        WEAPON.PROPERTY.HEAVY,
        WEAPON.PROPERTY.TWO_HANDED
      ])
    ),
    'net': Weapon(
      pushID(WEAPON.NET.VALUE),
      'Net',
      WEAPON.CLASS.RANGED.VALUE,
      WEAPON.CATEGORY.MARTIAL.VALUE,
      1,
      Damage(),
      3,
      Properties([
        WEAPON.PROPERTY.SPECIAL,
        Range(WEAPON.PROPERTY.THROWN, 5, 15)
      ])
    )
  };

  return weapons;
}

/*******
* ARMOR
*******/

const ARMOR_PATH = 'armor';
const ARMOR_TYPE_PATH = 'armor_type';

const ARMOR = {
  'PADDED': {
    'VALUE': 'padded',
    'PATH': ARMOR_PATH
  },
  'LEATHER': {
    'VALUE': 'leather',
    'PATH': ARMOR_PATH
  },
  'STUDDED_LEATHER': {
    'VALUE': 'studded_leather',
    'PATH': ARMOR_PATH
  },
  'HIDE': {
    'VALUE': 'hide',
    'PATH': ARMOR_PATH
  },
  'CHAIN_SHIRT': {
    'VALUE': 'chain_shirt',
    'PATH': ARMOR_PATH
  },
  'SCALE_MAIL': {
    'VALUE': 'scale_mail',
    'PATH': ARMOR_PATH
  },
  'BREASTPLATE': {
    'VALUE': 'breastplate',
    'PATH': ARMOR_PATH
  },
  'HALF_PLATE': {
    'VALUE': 'half_plate',
    'PATH': ARMOR_PATH
  },
  'RING_MAIL': {
    'VALUE': 'ring_mail',
    'PATH': ARMOR_PATH
  },
  'CHAIN_MAIL': {
    'VALUE': 'chain_mail',
    'PATH': ARMOR_PATH
  },
  'SPLINT': {
    'VALUE': 'splint',
    'PATH': ARMOR_PATH
  },
  'PLATE': {
    'VALUE': 'plate',
    'PATH': ARMOR_PATH
  },
  'SHIELD': {
    'VALUE': 'shield',
    'PATH': ARMOR_PATH
  },
  'ANY': {
    'VALUE': ANY,
    'PATH': ARMOR_PATH
  },
  'ALL': {
    'VALUE': ALL,
    'PATH': ARMOR_PATH
  },

  'TYPE': {
    'LIGHT': {
      'VALUE': 'light',
      'PATH': ARMOR_TYPE_PATH
    },
    'MEDIUM': {
      'VALUE': 'medium',
      'PATH': ARMOR_TYPE_PATH
    },
    'HEAVY': {
      'VALUE': 'heavy',
      'PATH': ARMOR_TYPE_PATH
    },
    'SHIELD': {
      'VALUE': 'shield',
      'PATH': ARMOR_TYPE_PATH
    }
  }
}

function getArmorTypes() {
  var light = {};
  light[ARMOR.PADDED.VALUE] = true;
  light[ARMOR.LEATHER.VALUE] = true;
  light[ARMOR.STUDDED_LEATHER.VALUE] = true;

  var medium = {};
  medium[ARMOR.HIDE.VALUE] = true;
  medium[ARMOR.CHAIN_SHIRT.VALUE] = true;
  medium[ARMOR.SCALE_MAIL.VALUE] = true;
  medium[ARMOR.BREASTPLATE.VALUE] = true;
  medium[ARMOR.HALF_PLATE.VALUE] = true;

  var heavy = {};
  heavy[ARMOR.RING_MAIL.VALUE] = true;
  heavy[ARMOR.CHAIN_MAIL.VALUE] = true;
  heavy[ARMOR.SPLINT.VALUE] = true;
  heavy[ARMOR.PLATE.VALUE] = true;

  var shield = {};
  shield[ARMOR.SHIELD.VALUE] = true;

  var armorTypes = {};
  armorTypes[ARMOR.TYPE.LIGHT.VALUE] = light;
  armorTypes[ARMOR.TYPE.MEDIUM.VALUE] = medium;
  armorTypes[ARMOR.TYPE.HEAVY.VALUE] = heavy;
  armorTypes[ARMOR.TYPE.SHIELD.VALUE] = shield;

  return armorTypes;
}

function Armor(id, name, type, costGP, baseAC, stealthDisAdv, weightLB, isModified=false, hasMaxAC=false, minSTR=0) {
  if (arguments.length < 7) {
    console.log('ERROR: Missing required arguments');
    return null;
  }

  return {
    'id': id,
    'name': name,
    'type': type,
    'costGP': costGP,
    'baseAC': baseAC,
    'stealthDisAdv': stealthDisAdv,
    'weightLB': weightLB,
    'isModified': isModified,
    'hasMaxAC': hasMaxAC,
    'minSTR': minSTR
  };
}

function getArmor() {
  const armor = {
    'padded': Armor(
      pushID('padded'),
      'Padded',
      ARMOR.TYPE.LIGHT.VALUE,
      5,
      11,
      true,
      8,
      true
    ),
    'leather': Armor(
      pushID('leather'),
      'Leather',
      ARMOR.TYPE.LIGHT.VALUE,
      10,
      11,
      false,
      10,
      true
    ),
    'studded_leather': Armor(
      pushID('studded_leather'),
      'Studded leather',
      ARMOR.TYPE.LIGHT.VALUE,
      45,
      12,
      false,
      13,
      true
    ),
    'hide': Armor(
      pushID('hide'),
      'Hide',
      ARMOR.TYPE.MEDIUM.VALUE,
      10,
      12,
      false,
      12,
      true,
      true
    ),
    'chain_shirt': Armor(
      pushID('chain_shirt'),
      'Chain shirt',
      ARMOR.TYPE.MEDIUM.VALUE,
      50,
      13,
      false,
      20,
      true,
      true
    ),
    'scale_mail': Armor(
      pushID('scale_mail'),
      'Scale mail',
      ARMOR.TYPE.MEDIUM.VALUE,
      50,
      14,
      true,
      45,
      true,
      true
    ),
    'breastplate': Armor(
      pushID('breastplate'),
      'Breastplate',
      ARMOR.TYPE.MEDIUM.VALUE,
      400,
      14,
      false,
      20,
      true,
      true
    ),
    'half_plate': Armor(
      pushID('half_plate'),
      'Half plate',
      ARMOR.TYPE.MEDIUM.VALUE,
      750,
      15,
      true,
      40,
      true,
      true
    ),
    'ring_mail': Armor(
      pushID('ring_mail'),
      'Ring mail',
      ARMOR.TYPE.HEAVY.VALUE,
      30,
      14,
      true,
      40
    ),
    'chain_mail': Armor(
      pushID('chain_mail'),
      'Chain mail',
      ARMOR.TYPE.HEAVY.VALUE,
      75,
      16,
      true,
      55,
      false,
      false,
      13
    ),
    'splint': Armor(
      pushID('splint'),
      'Splint',
      ARMOR.TYPE.HEAVY.VALUE,
      200,
      17,
      true,
      60,
      false,
      false,
      15
    ),
    'plate': Armor(
      pushID('plate'),
      'Plate',
      ARMOR.TYPE.HEAVY.VALUE,
      1500,
      18,
      true,
      65,
      false,
      false,
      15
    ),
    'shield': Armor(
      pushID('shield'),
      'Shield',
      ARMOR.TYPE.SHIELD.VALUE,
      10,
      2,
      false,
      6
    )
  };

  return armor;
}

/*******
* TOOLS
*******/

const TOOL_PATH = 'tools';
const TOOL_CATEGORY_PATH = 'tool_categories';

const TOOL = {
  'ALCHEMISTS_SUPPLIES': {
    'VALUE': 'alchemists_supplies',
    'PATH': TOOL_PATH
  },
  'BREWERS_SUPPLIES': {
    'VALUE': 'brewers_supplies',
    'PATH': TOOL_PATH
  },
  'CALLIGRAPHERS_SUPPLIES': {
    'VALUE': 'calligraphers_supplies',
    'PATH': TOOL_PATH
  },
  'CARPENTERS_TOOLS': {
    'VALUE': 'carpenters_tools',
    'PATH': TOOL_PATH
  },
  'CARTOGRAPHERS_TOOLS': {
    'VALUE': 'cartographers_tools',
    'PATH': TOOL_PATH
  },
  'COBBLERS_TOOLS': {
    'VALUE': 'cobblers_tools',
    'PATH': TOOL_PATH
  },
  'COOKS_UTENSILS': {
    'VALUE': 'cooks_utensils',
    'PATH': TOOL_PATH
  },
  'GLASSBLOWERS_TOOLS': {
    'VALUE': 'glassblowers_tools',
    'PATH': TOOL_PATH
  },
  'JEWELERS_TOOLS': {
    'VALUE': 'jewelers_tools',
    'PATH': TOOL_PATH
  },
  'LEATHERWORKERS_TOOLS': {
    'VALUE': 'leatherworkers_tools',
    'PATH': TOOL_PATH
  },
  'MASONS_TOOLS': {
    'VALUE': 'masons_tools',
    'PATH': TOOL_PATH
  },
  'PAINTERS_SUPPLIES': {
    'VALUE': 'painters_supplies',
    'PATH': TOOL_PATH
  },
  'POTTERS_TOOLS': {
    'VALUE': 'potters_tools',
    'PATH': TOOL_PATH
  },
  'SMITHS_TOOLS': {
    'VALUE': 'smiths_tools',
    'PATH': TOOL_PATH
  },
  'TINKERS_TOOLS': {
    'VALUE': 'tinkers_tools',
    'PATH': TOOL_PATH
  },
  'WEAVERS_TOOLS': {
    'VALUE': 'weavers_tools',
    'PATH': TOOL_PATH
  },
  'WOODCARVERS_TOOLS': {
    'VALUE': 'woodcarvers_tools',
    'PATH': TOOL_PATH
  },
  'DISGUISE_KIT': {
    'VALUE': 'disguise_kit',
    'PATH': TOOL_PATH
  },
  'FORGERY_KIT': {
    'VALUE': 'forgery_kit',
    'PATH': TOOL_PATH
  },
  'DICE_SET': {
    'VALUE': 'dice_set',
    'PATH': TOOL_PATH
  },
  'DRAGONCHESS_SET': {
    'VALUE': 'dragonchess_set',
    'PATH': TOOL_PATH
  },
  'PLAYING_CARD_SET': {
    'VALUE': 'playing_card_set',
    'PATH': TOOL_PATH
  },
  'THREE_DRAGON_ANTE_SET': {
    'VALUE': 'three_dragon_ante_set',
    'PATH': TOOL_PATH
  },
  'HERBALISM_KIT': {
    'VALUE': 'herbalism_kit',
    'PATH': TOOL_PATH
  },
  'BAGPIPES': {
    'VALUE': 'bagpipes',
    'PATH': TOOL_PATH
  },
  'DRUM': {
    'VALUE': 'drum',
    'PATH': TOOL_PATH
  },
  'DULCIMER': {
    'VALUE': 'dulcimer',
    'PATH': TOOL_PATH
  },
  'FLUTE': {
    'VALUE': 'flute',
    'PATH': TOOL_PATH
  },
  'LUTE': {
    'VALUE': 'lute',
    'PATH': TOOL_PATH
  },
  'LYRE': {
    'VALUE': 'lyre',
    'PATH': TOOL_PATH
  },
  'HORN': {
    'VALUE': 'horn',
    'PATH': TOOL_PATH
  },
  'PAN_FLUTE': {
    'VALUE': 'pan_flute',
    'PATH': TOOL_PATH
  },
  'SHAWM': {
    'VALUE': 'shawm',
    'PATH': TOOL_PATH
  },
  'VIOL': {
    'VALUE': 'viol',
    'PATH': TOOL_PATH
  },
  'NAVIGATORS_TOOLS': {
    'VALUE': 'navigators_tools',
    'PATH': TOOL_PATH
  },
  'POISONERS_KIT': {
    'VALUE': 'poisoners_kit',
    'PATH': TOOL_PATH
  },
  'THIEVES_TOOLS': {
    'VALUE': 'thieves_tools',
    'PATH': TOOL_PATH
  },
  'ANY': {
    'VALUE': ANY,
    'PATH': TOOL_PATH
  },

  'CATEGORY': {
    'ARTISAN': {
      'VALUE': 'artisan',
      'PATH': TOOL_CATEGORY_PATH
    },
    'GAMING_SET': {
      'VALUE': 'gaming_set',
      'PATH': TOOL_CATEGORY_PATH
    },
    'MUSICAL_INSTRUMENT': {
      'VALUE': 'musical_instrument',
      'PATH': TOOL_CATEGORY_PATH
    }
  }
};

function getToolCategories() {
  var artisan = {};
  artisan[TOOL.ALCHEMISTS_SUPPLIES.VALUE] = true;
  artisan[TOOL.BREWERS_SUPPLIES.VALUE] = true;
  artisan[TOOL.CALLIGRAPHERS_SUPPLIES.VALUE] = true;
  artisan[TOOL.CARPENTERS_TOOLS.VALUE] = true;
  artisan[TOOL.CARTOGRAPHERS_TOOLS.VALUE] = true;
  artisan[TOOL.COBBLERS_TOOLS.VALUE] = true;
  artisan[TOOL.COOKS_UTENSILS.VALUE] = true;
  artisan[TOOL.GLASSBLOWERS_TOOLS.VALUE] = true;
  artisan[TOOL.JEWELERS_TOOLS.VALUE] = true;
  artisan[TOOL.LEATHERWORKERS_TOOLS.VALUE] = true;
  artisan[TOOL.MASONS_TOOLS.VALUE] = true;
  artisan[TOOL.PAINTERS_SUPPLIES.VALUE] = true;
  artisan[TOOL.POTTERS_TOOLS.VALUE] = true;
  artisan[TOOL.SMITHS_TOOLS.VALUE] = true;
  artisan[TOOL.TINKERS_TOOLS.VALUE] = true;
  artisan[TOOL.WEAVERS_TOOLS.VALUE] = true;
  artisan[TOOL.WOODCARVERS_TOOLS.VALUE] = true;

  var gaming_set = {};
  gaming_set[TOOL.DICE_SET.VALUE] = true;
  gaming_set[TOOL.DRAGONCHESS_SET.VALUE] = true;
  gaming_set[TOOL.PLAYING_CARD_SET.VALUE] = true;
  gaming_set[TOOL.THREE_DRAGON_ANTE_SET.VALUE] = true;

  var musical_instrument = {};
  musical_instrument[TOOL.BAGPIPES.VALUE] = true;
  musical_instrument[TOOL.DRUM.VALUE] = true;
  musical_instrument[TOOL.DULCIMER.VALUE] = true;
  musical_instrument[TOOL.FLUTE.VALUE] = true;
  musical_instrument[TOOL.LUTE.VALUE] = true;
  musical_instrument[TOOL.LYRE.VALUE] = true;
  musical_instrument[TOOL.HORN.VALUE] = true;
  musical_instrument[TOOL.PAN_FLUTE.VALUE] = true;
  musical_instrument[TOOL.SHAWM.VALUE] = true;
  musical_instrument[TOOL.VIOL.VALUE] = true;

  var toolCategories = {};
  toolCategories[TOOL.CATEGORY.ARTISAN.VALUE] = artisan;
  toolCategories[TOOL.CATEGORY.GAMING_SET.VALUE] = gaming_set;
  toolCategories[TOOL.CATEGORY.MUSICAL_INSTRUMENT.VALUE] = musical_instrument;

  return toolCategories;
}

function Tool(id, name, costGP, weightLB, category=null) {
  if (arguments.length < 4) {
    console.log('ERROR: Missing required arguments');
    return null;
  }

  var tool = {
    'id': id,
    'name': name,
    'costGP': costGP,
    'weightLB': weightLB
  };

  if (category !== null) {
    tool['category'] = category;
  }

  return tool;
}

function getTools() {
  var tools = {
    'alchemists_supplies': Tool(
      pushID('alchemists_supplies'),
      'Alchemist\'s supplies',
      50,
      8,
      TOOL.CATEGORY.ARTISAN.VALUE
    ),
    'brewers_supplies': Tool(
      pushID('brewers_supplies'),
      'Brewer\'s supplies',
      20,
      9,
      TOOL.CATEGORY.ARTISAN.VALUE
    ),
    'calligraphers_supplies': Tool(
      pushID('calligraphers_supplies'),
      'Calligrapher\'s supplies',
      10,
      5,
      TOOL.CATEGORY.ARTISAN.VALUE
    ),
    'carpenters_tools': Tool(
      pushID('carpenters_tools'),
      'Carpenter\'s tools',
      8,
      6,
      TOOL.CATEGORY.ARTISAN.VALUE
    ),
    'cartographers_tools': Tool(
      pushID('cartographers_tools'),
      'Cartographer\'s tools',
      15,
      6,
      TOOL.CATEGORY.ARTISAN.VALUE
    ),
    'cobblers_tools': Tool(
      pushID('cobblers_tools'),
      'Cobbler\'s tools',
      5,
      8,
      TOOL.CATEGORY.ARTISAN.VALUE
    ),
    'cooks_utensils': Tool(
      pushID('cooks_utensils'),
      'Cook\'s utensils',
      1,
      8,
      TOOL.CATEGORY.ARTISAN.VALUE
    ),
    'glassblowers_tools': Tool(
      pushID('glassblowers_tools'),
      'Glassblower\'s tools',
      30,
      5,
      TOOL.CATEGORY.ARTISAN.VALUE
    ),
    'jewelers_tools': Tool(
      pushID('jewelers_tools'),
      'Jeweler\'s tools',
      25,
      2,
      TOOL.CATEGORY.ARTISAN.VALUE
    ),
    'leatherworkers_tools': Tool(
      pushID('leatherworkers_tools'),
      'Leatherworker\'s tools',
      5,
      5,
      TOOL.CATEGORY.ARTISAN.VALUE
    ),
    'masons_tools': Tool(
      pushID('masons_tools'),
      'Mason\'s tools',
      10,
      8,
      TOOL.CATEGORY.ARTISAN.VALUE
    ),
    'painters_supplies': Tool(
      pushID('painters_supplies'),
      'Painter\'s supplies',
      10,
      5,
      TOOL.CATEGORY.ARTISAN.VALUE
    ),
    'potters_tools': Tool(
      pushID('potters_tools'),
      'Potter\'s tools',
      10,
      3,
      TOOL.CATEGORY.ARTISAN.VALUE
    ),
    'smiths_tools': Tool(
      pushID('smiths_tools'),
      'Smith\'s tools',
      20,
      8,
      TOOL.CATEGORY.ARTISAN.VALUE
    ),
    'tinkers_tools': Tool(
      pushID('tinkers_tools'),
      'Tinker\'s tools',
      50,
      10,
      TOOL.CATEGORY.ARTISAN.VALUE
    ),
    'weavers_tools': Tool(
      pushID('weavers_tools'),
      'Weaver\'s tools',
      1,
      5,
      TOOL.CATEGORY.ARTISAN.VALUE
    ),
    'woodcarvers_tools': Tool(
      pushID('woodcarvers_tools'),
      'Woodcarver\'s tools',
      1,
      5,
      TOOL.CATEGORY.ARTISAN.VALUE
    ),
    'disguise_kit': Tool(
      pushID('disguise_kit'),
      'Disguise kit',
      25,
      3
    ),
    'forgery_kit': Tool(
      pushID('forgery_kit'),
      'Forgery kit',
      15,
      5
    ),
    'dice_set': Tool(
      pushID('dice_set'),
      'Dice set',
      0.1,
      0,
      TOOL.CATEGORY.GAMING_SET.VALUE
    ),
    'dragonchess_set': Tool(
      pushID('dragonchess_set'),
      'Dragonchess set',
      1,
      0.5,
      TOOL.CATEGORY.GAMING_SET.VALUE
    ),
    'playing_card_set': Tool(
      pushID('playing_card_set'),
      'Playing card set',
      0.5,
      0,
      TOOL.CATEGORY.GAMING_SET.VALUE
    ),
    'three_dragon_ante_set': Tool(
      pushID('three_dragon_ante_set'),
      'Three-Dragon Ante set',
      1,
      0,
      TOOL.CATEGORY.GAMING_SET.VALUE
    ),
    'herbalism_kit': Tool(
      pushID('herbalism_kit'),
      'Herbalism kit',
      5,
      3
    ),
    'bagpipes': Tool(
      pushID('bagpipes'),
      'Bagpipes',
      30,
      6,
      TOOL.CATEGORY.MUSICAL_INSTRUMENT.VALUE
    ),
    'drum': Tool(
      pushID('drum'),
      'Drum',
      6,
      3,
      TOOL.CATEGORY.MUSICAL_INSTRUMENT.VALUE
    ),
    'dulcimer': Tool(
      pushID('dulcimer'),
      'Dulcimer',
      25,
      10,
      TOOL.CATEGORY.MUSICAL_INSTRUMENT.VALUE
    ),
    'flute': Tool(
      pushID('flute'),
      'Flute',
      2,
      1,
      TOOL.CATEGORY.MUSICAL_INSTRUMENT.VALUE
    ),
    'lute': Tool(
      pushID('lute'),
      'Lute',
      35,
      2,
      TOOL.CATEGORY.MUSICAL_INSTRUMENT.VALUE
    ),
    'lyre': Tool(
      pushID('lyre'),
      'Lyre',
      30,
      2,
      TOOL.CATEGORY.MUSICAL_INSTRUMENT.VALUE
    ),
    'horn': Tool(
      pushID('horn'),
      'Horn',
      3,
      2,
      TOOL.CATEGORY.MUSICAL_INSTRUMENT.VALUE
    ),
    'pan_flute': Tool(
      pushID('pan_flute'),
      'Pan flute',
      12,
      2,
      TOOL.CATEGORY.MUSICAL_INSTRUMENT.VALUE
    ),
    'shawm': Tool(
      pushID('shawm'),
      'Shawm',
      2,
      1,
      TOOL.CATEGORY.MUSICAL_INSTRUMENT.VALUE
    ),
    'viol': Tool(
      pushID('viol'),
      'Viol',
      2,
      1,
      TOOL.CATEGORY.MUSICAL_INSTRUMENT.VALUE
    ),
    'navigators_tools': Tool(
      pushID('navigators_tools'),
      'Navigator\'s tools',
      25,
      2
    ),
    'poisoners_kit': Tool(
      pushID('poisoners_kit'),
      'Poisener\'s kit',
      50,
      2
    ),
    'thieves_tools': Tool(
      pushID('thieves_tools'),
      'Thieves\' tools',
      25,
      1
    )
  };

  return tools;
}

/******
* GEAR
******/

const PACK_PATH = 'packs';

const PACK = {
  'DIPLOMAT': {
    'VALUE': 'diplomat',
    'PATH': PACK_PATH
  },
  'ENTERTAINER': {
    'VALUE': 'entertainer',
    'PATH': PACK_PATH
  },
  'EXPLORER': {
    'VALUE': 'explorer',
    'PATH': PACK_PATH
  },
  'ANY': {
    'VALUE': ANY,
    'PATH': PACK_PATH
  }
};

const GEAR_PATH = 'gear';

// GEAR does not have VALUE or PATH
const GEAR = {
  'BACKPACK': 'backpack',
  'WATERSKIN': 'waterskin',
  'BEDROLL': 'bedroll',
  'MESS_KIT': 'mess_kit',
  'TINDERBOX': 'tinderbox',
  'TORCH': 'torch',
  'RATIONS': 'rations',
  'HEMPEN_ROPE': 'hempen_rope',
  'CHEST': 'chest',
  'CASE_MAP_SCROLL': 'case_map_scroll',
  'CLOTHES_FINE': 'clothes_fine',
  'CLOTHES_COSTUME': 'clothes_costume',
  'INK_BOTTLE_EMPTY': 'ink_bottle_empty',
  'INK_BOTTLE': 'ink_bottle',
  'INK_PEN': 'ink_pen',
  'LAMP': 'lamp',
  'FLASK_EMPTY': 'flask_empty',
  'FLASK_OIL': 'flask_oil',
  'PAPER': 'paper',
  'VIAL_EMPTY': 'vial_empty',
  'VIAL_PERFUME': 'vial_perfume',
  'SEALING_WAX': 'sealing_wax',
  'CANDLE': 'candle',
  'SOAP': 'soap'
};

function Pack(id, name, costGP, contentsList) {
  if (arguments.length < 4) {
    console.log('ERROR: Missing required arguments');
    return null;
  }

  var pack = {
    'id': id,
    'name': name,
    'costGP': costGP
  };

  var contents = {};
  for (content of contentsList) {
    contents[content.item] = {'quantity': content.quantity};
  }

  pack['contents'] = contents;

  return pack;
}

function Content(quanity, item) {
  if (arguments.length < 2) {
    console.log('ERROR: Missing required arguments');
    return null;
  }

  return {
    'quantity': quanity,
    'item': item
  };
}

function getPacks() {
  var packs = {};
  packs[PACK.EXPLORER.VALUE] = Pack(
    pushID(PACK.EXPLORER.VALUE),
    'Explorer\'s pack',
    10,
    [
      Content(1, GEAR.BACKPACK),
      Content(1, GEAR.BEDROLL),
      Content(1, GEAR.MESS_KIT),
      Content(1, GEAR.TINDERBOX),
      Content(10, GEAR.TORCH),
      Content(10, GEAR.RATIONS),
      Content(1, GEAR.WATERSKIN),
      Content(1, GEAR.HEMPEN_ROPE)
    ]
  );

  packs[PACK.DIPLOMAT.VALUE] = Pack(
    pushID(PACK.DIPLOMAT.VALUE),
    'Diplomat\'s pack',
    39,
    [
      Content(1, GEAR.CHEST),
      Content(2, GEAR.CASE_MAP_SCROLL),
      Content(1, GEAR.CLOTHES_FINE),
      Content(1, GEAR.INK_BOTTLE),
      Content(1, GEAR.INK_PEN),
      Content(1, GEAR.LAMP),
      Content(2, GEAR.FLASK_OIL),
      Content(5, GEAR.PAPER),
      Content(1, GEAR.VIAL_PERFUME),
      Content(1, GEAR.SEALING_WAX),
      Content(1, GEAR.SOAP)
    ]
  );

  packs[PACK.ENTERTAINER.VALUE] = Pack(
    pushID(PACK.ENTERTAINER.VALUE),
    'Entertainer\'s pack',
    40,
    [
      Content(1, GEAR.BACKPACK),
      Content(1, GEAR.BEDROLL),
      Content(2, GEAR.CLOTHES_COSTUME),
      Content(5, GEAR.CANDLE),
      Content(5, GEAR.RATIONS),
      Content(1, GEAR.WATERSKIN),
      Content(1, TOOL.DISGUISE_KIT.VALUE)
    ]
  );

  return packs;
}

function Gear(id, name, costGP, weightLB, container=null, packs=null) {
  if (arguments.length < 4) {
    console.log('ERROR: Missing required arguments');
    return null;
  }

  var gear = {
    'id': id,
    'name': name,
    'costGP': costGP,
    'weightLB': weightLB
  };

  if (container !== null) {
    for (key of Object.keys(container)) {
      gear[key] = container[key];
    }
  }

  if (packs !== null) {
    gear['packs'] = packs;
  }

  return gear;
}

function PackList(list) {
  if (arguments.length < 1) {
    console.log('ERROR: Missing required arguments');
    return null;
  }

  var packs = {};

  for (l of list) {
    packs[l] = true;
  }

  return packs;
}

// UNIT does not have VALUE or PATH
const UNIT = {
  'VOLUME': {
    'FT3': 'cubic feet',
    'GALLON': 'gallons',
    'PINT': 'pint',
    'OUNCE': 'ounces'
  },
  'WEIGHT': {
    'LB': 'pounds'
  },
  'COUNT': {
    'MAP_SCROLL': 'map or scroll'
  }
};

function Container(volume, volumeUnit, weightLimit=null, weightUnit=null, isFull=false, contents={}) {
  if (arguments.length < 2) {
    console.log('ERROR: Missing required arguments');
    return null;
  }

  var percentageFilled = isFull ? 100 : 0;

  var container = {
    'volume': volume,
    'volumeUnit': volumeUnit,
    'percentageFilled': percentageFilled,
    'contents': contents
  };

  if (weightLimit !== null && weightUnit !== null) {
    container['weightLimit'] = weightLimit;
    container['weightUnit'] = weightUnit;
  }
  else if (weightLimit === null && weightUnit !== null
        || weightLimit !== null && weightUnit === null) {
    console.log('ERROR: Both weightLimit(' + weightLimit + ') and weightUnit(' + weightUnit + ') cannot be null');
    return null;
  }

  return container;
}

function getGear(id, name) {
  var gear = {};

  gear[GEAR.BACKPACK] = Gear(
    pushID(GEAR.BACKPACK),
    'Backpack',
    2,
    5,
    Container(1, UNIT.VOLUME.FT3, 30, UNIT.WEIGHT.LB),
    PackList([
      PACK.ENTERTAINER.VALUE,
      PACK.EXPLORER.VALUE
    ])
  );

  gear[GEAR.WATERSKIN] = Gear(
    pushID(GEAR.WATERSKIN),
    'Waterskin',
    0.2,
    5,
    Container(4, UNIT.VOLUME.PINT),
    PackList([
      PACK.ENTERTAINER.VALUE,
      PACK.EXPLORER.VALUE
    ])
  );

  gear[GEAR.BEDROLL] = Gear(
    pushID(GEAR.BEDROLL),
    'Bedroll',
    1,
    7,
    PackList([
      PACK.ENTERTAINER.VALUE,
      PACK.EXPLORER.VALUE
    ])
  );

  gear[GEAR.MESS_KIT] = Gear(
    pushID(GEAR.MESS_KIT),
    'Mess kit',
    0.2,
    1,
    PackList([
      PACK.EXPLORER.VALUE
    ])
  );

  gear[GEAR.TINDERBOX] = Gear(
    pushID(GEAR.TINDERBOX),
    'Tinderbox',
    0.5,
    1,
    PackList([
      PACK.EXPLORER.VALUE
    ])
  );

  gear[GEAR.TORCH] = Gear(
    pushID(GEAR.TORCH),
    'Torch',
    0.01,
    1,
    PackList([
      PACK.EXPLORER.VALUE
    ])
  );

  gear[GEAR.RATIONS] = Gear(
    pushID(GEAR.RATIONS),
    'Rations (1 day)',
    0.5,
    2,
    PackList([
      PACK.ENTERTAINER.VALUE,
      PACK.EXPLORER.VALUE
    ])
  );

  gear[GEAR.HEMPEN_ROPE] = Gear(
    pushID(GEAR.HEMPEN_ROPE),
    'Rope, hempen (50 feet)',
    1,
    10,
    PackList([
      PACK.EXPLORER.VALUE
    ])
  );

  gear[GEAR.CHEST] = Gear(
    pushID(GEAR.CHEST),
    'Chest',
    5,
    25,
    Container(12, UNIT.VOLUME.FT3, 300, UNIT.WEIGHT.LB),
    PackList([
      PACK.DIPLOMAT.VALUE
    ])
  );

  gear[GEAR.CASE_MAP_SCROLL] = Gear(
    pushID(GEAR.CASE_MAP_SCROLL),
    'Case, map or scroll',
    1,
    1,
    Container(1, UNIT.COUNT.MAP_SCROLL),
    PackList([
      PACK.DIPLOMAT.VALUE
    ])
  );

  gear[GEAR.CLOTHES_FINE] = Gear(
    pushID(GEAR.CLOTHES_FINE),
    'Clothes, fine',
    15,
    6,
    PackList([
      PACK.DIPLOMAT.VALUE
    ])
  );

  gear[GEAR.CLOTHES_COSTUME] = Gear(
    pushID(GEAR.CLOTHES_COSTUME),
    'Clothes, costume',
    5,
    4,
    PackList([
      PACK.ENTERTAINER.VALUE
    ])
  );

  gear[GEAR.INK_BOTTLE_EMPTY] = Gear(
    pushID(GEAR.INK_BOTTLE_EMPTY),
    'Ink (1 ounce bottle)',
    10,
    0,
    Container(1, UNIT.VOLUME.OUNCE)
  );

  gear[GEAR.INK_BOTTLE] = Gear(
    pushID(GEAR.INK_BOTTLE),
    'Ink (1 ounce bottle)',
    10,
    0,
    Container(1, UNIT.VOLUME.OUNCE, null, null, true, {'ink': true}),
    PackList([
      PACK.DIPLOMAT.VALUE
    ])
  );

  gear[GEAR.INK_PEN] = Gear(
    pushID(GEAR.INK_PEN),
    'Ink pen',
    0.02,
    0,
    PackList([
      PACK.DIPLOMAT.VALUE
    ])
  );

  gear[GEAR.LAMP] = Gear(
    pushID(GEAR.LAMP),
    'Lamp',
    0.5,
    1,
    PackList([
      PACK.DIPLOMAT.VALUE
    ])
  );

  gear[GEAR.FLASK_EMPTY] = Gear(
    pushID(GEAR.FLASK_EMPTY),
    'Flask',
    0.02,
    1,
    Container(1.5, UNIT.VOLUME.PINT)
  );

  gear[GEAR.FLASK_OIL] = Gear(
    pushID(GEAR.FLASK_OIL),
    'Flask',
    0.1,
    1,
    Container(1.5, UNIT.VOLUME.PINT, null, null, true, {'oil': true}),
    PackList([
      PACK.DIPLOMAT.VALUE
    ])
  );

  gear[GEAR.PAPER] = Gear(
    pushID(GEAR.PAPER),
    'Paper (one sheet)',
    0.2,
    0,
    PackList([
      PACK.DIPLOMAT.VALUE
    ])
  );

  gear[GEAR.VIAL_EMPTY] = Gear(
    pushID(GEAR.VIAL_EMPTY),
    'Vial',
    1,
    0,
    Container(4, UNIT.VOLUME.OUNCE)
  );

  gear[GEAR.VIAL_PERFUME] = Gear(
    pushID(GEAR.VIAL_PERFUME),
    'Vial',
    5,
    0,
    Container(4, UNIT.VOLUME.OUNCE, null, null, true, {'perfume': true}),
    PackList([
      PACK.DIPLOMAT.VALUE
    ])
  );

  gear[GEAR.SEALING_WAX] = Gear(
    pushID(GEAR.SEALING_WAX),
    'Sealing wax',
    0.5,
    0,
    PackList([
      PACK.DIPLOMAT.VALUE
    ])
  );

  gear[GEAR.CANDLE] = Gear(
    pushID(GEAR.CANDLE),
    'Candle',
    0.01,
    0,
    PackList([
      PACK.ENTERTAINER.VALUE
    ])
  );

  gear[GEAR.SOAP] = Gear(
    pushID(GEAR.SOAP),
    'Soap',
    0.02,
    0,
    PackList([
      PACK.DIPLOMAT.VALUE
    ])
  );

  return gear;
}

/********
* TRAITS
********/

const TRAIT_PATH = 'traits';
// TRAIT does not have VALUE or PATH
const TRAIT = {
  'DARKVISION': 'darkvision',
  'DWARVEN_RESILIENCE': 'dwarven_resilience',
  'DWARVEN_COMBAT_TRAINING': 'dwarven_combat_training',
  'STONECUNNING': 'stonecunning',
  'DWARVEN_TOUGHNESS': 'dwarven_toughness',
  'DWARVEN_ARMOR_TRAINING': 'dwarven_armor_training',
  'KEEN_SENSES': 'keen_senses',
  'FEY_ANCESTRY': 'fey_ancestry',
  'TRANCE': 'trance',
  'ELF_WEAPON_TRAINING': 'elf_weapon_training',
  'CANTRIP': 'cantrip',
  'EXTRA_LANGUAGE': 'extra_language',
  'FLEET_OF_FOOT': 'fleet_of_foot',
  'MASK_OF_THE_WILD': 'mask_of_the_wild',
  'SUPERIOR_DARKVISION': 'superior_darkvision',
  'SUNLIGHT_SENSITIVITY': 'sunlight_sensitivity',
  'DROW_MAGIC': 'drow_magic',
  'DROW_WEAPON_TRAINING': 'drow_weapon_training'
};

function Trait(id, name, desc) {
  if (arguments.length < 3) {
    console.log('ERROR: Missing required arguments');
    return null;
  }

  return {
    'id': id,
    'name': name,
    'desc': desc
  };
}

function getTraits() {
  const traits = {};

  traits[TRAIT.DARKVISION] = Trait(
    pushID(TRAIT.DARKVISION),
    'Darkvision',
    'You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it w ere dim light. You can’t discern color in darkness, only shades of gray.'
  );

  traits[TRAIT.DWARVEN_RESILIENCE] = Trait(
    pushID(TRAIT.DWARVEN_RESILIENCE),
    'Dwarven Resilience',
    'You have advantage on saving throws against poison, and you have resistance against poison damage.'
  );

  traits[TRAIT.DWARVEN_COMBAT_TRAINING] = Trait(
    pushID(TRAIT.DWARVEN_COMBAT_TRAINING),
    'Dwarven Combat Training',
    'You have proficiency with the battleaxe, handaxe, throwing hammer, and warhammer.'
  );

  traits[TRAIT.STONECUNNING] = Trait(
    pushID(TRAIT.STONECUNNING),
    'Stonecunning',
    'Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient in the History skill and add double your proficiency bonus to the check, instead of your normal proficiency bonus.'
  );

  traits[TRAIT.DWARVEN_TOUGHNESS] = Trait(
    pushID(TRAIT.DWARVEN_TOUGHNESS),
    'Dwarven Toughness',
    'Your hit point maximum increases by 1, and it increases by 1 every time you gain a level.'
  );

  traits[TRAIT.DWARVEN_ARMOR_TRAINING] = Trait(
    pushID(TRAIT.DWARVEN_ARMOR_TRAINING),
    'Dwarven Armor Training',
    'You have proficiency with light and medium armor.'
  );

  traits[TRAIT.KEEN_SENSES] = Trait(
    pushID(TRAIT.KEEN_SENSES),
    'Keen Senses',
    'You have proficiency in the Perception skill.'
  );

  traits[TRAIT.FEY_ANCESTRY] = Trait(
    pushID(TRAIT.FEY_ANCESTRY),
    'Fey Ancestry',
    'You have advantage on saving throws against being charmed, and magic can’t put you to sleep.'
  );

  traits[TRAIT.TRANCE] = Trait(
    pushID(TRAIT.TRANCE),
    'Trance',
    'Elves don’t need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day. (The Common word for such meditation is “trance.”) While meditating, you can dream after a fashion; such dreams are actually mental exercises that have become reflexive through years of practice. After resting in this way, you gain the same benefit that a human does from 8 hours of sleep.'
  );

  traits[TRAIT.ELF_WEAPON_TRAINING] = Trait(
    pushID(TRAIT.ELF_WEAPON_TRAINING),
    'Elf Weapon Training',
    'You have proficiency with the longsword, shortsword, shortbow, and longbow.'
  );

  traits[TRAIT.CANTRIP] = Trait(
    pushID(TRAIT.CANTRIP),
    'Cantrip',
    'You know one cantrip of your choice from the wizard spell list. Intelligence is your spellcasting ability for it.'
  );

  traits[TRAIT.EXTRA_LANGUAGE] = Trait(
    pushID(TRAIT.EXTRA_LANGUAGE),
    'Extra Language',
    'You can speak, read, and write one extra language of your choice.'
  );

  traits[TRAIT.FLEET_OF_FOOT] = Trait(
    pushID(TRAIT.FLEET_OF_FOOT),
    'Fleet of Foot',
    'Your base walking speed increases to 35 feet.'
  );

  traits[TRAIT.MASK_OF_THE_WILD] = Trait(
    pushID(TRAIT.MASK_OF_THE_WILD),
    'Mask of the Wild',
    'You can attempt to hide even when you are only lightly obscured by foliage, heavy rain, falling snow, mist, and other natural phenomena.'
  );

  traits[TRAIT.SUPERIOR_DARKVISION] = Trait(
    pushID(TRAIT.SUPERIOR_DARKVISION),
    'Superior Darkvision',
    'Your darkvision has a radius of 120 feet.'
  );

  traits[TRAIT.SUNLIGHT_SENSITIVITY] = Trait(
    pushID(TRAIT.SUNLIGHT_SENSITIVITY),
    'Sunlight Sensitivity',
    'You have disadvantage on attack rolls and on Wisdom (Perception) checks that rely on sight when you, the target of your attack, or whatever you are trying to perceive is in direct sunlight.'
  );

  traits[TRAIT.DROW_MAGIC] = Trait(
    pushID(TRAIT.DROW_MAGIC),
    'Drow Magic',
    'You know the dancing lights cantrip. When you reach 3rd level, you can cast the faerie fire spell once per day. When you reach 5th level, you can also cast the darkness spell once per day. Charisma is your spellcasting ability for these spells.'
  );

  traits[TRAIT.DROW_WEAPON_TRAINING] = Trait(
    pushID(TRAIT.DROW_WEAPON_TRAINING),
    'Drow Weapon Training',
    'You have proficiency with rapiers, shortswords, and hand crossbows.'
  );

  return traits;
}

/*******
* RACES
*******/

const SUBRACE_PATH = 'subraces';

// SUBRACE does not have VALUE or PATH
const SUBRACE = {
  'HILL_DWARF': 'hill_dwarf',
  'MOUNTAIN_DWARF': 'mountain_dwarf',
  'HIGH_ELF': 'high_elf',
  'WOOD_ELF': 'wood_elf',
  'DARK_ELF': 'dark_elf'
};

function Subrace(id, name, increasesList, traitsList, maxHP_bonus=0, profsList=null, languagesList=null, speed=null) {
  if (arguments.length < 4) {
    console.log('ERROR: Missing required arguments');
    return null;
  }

  var subrace = {
    'id': id,
    'name': name
  };

  var increases = {};
  for (i of increasesList) {
    increases[i.ability] = i.mod;
  }
  subrace['increases'] = increases;

  var traits = {};
  for (t of traitsList) {
    traits[t] = true;
  }
  subrace['traits'] = traits;

  if (maxHP_bonus > 0) {
    subrace['maxHP_bonus'] = maxHP_bonus;
  }

  if (profsList !== null) {
    var proficiencies = {};
    for (p of profsList) {
      proficiencies[p.VALUE] = p.PATH;
    }
    subrace['proficiencies'] = proficiencies;
  }

  if (languagesList !== null) {
    var languages = {};
    for (l of languagesList) {
      languages[l] = true;
    }
    subrace['languages'] = languages;
  }

  if (speed !== null) {
    subrace['speed'] = speed;
  }

  return subrace;
}

function Increase(ability, mod) {
  if (arguments.length < 2) {
    console.log('ERROR: Missing required arguments');
    return null;
  }

  return {
    'ability': ability,
    'mod': mod
  };
}

function getSubraces() {
  var dwarf = {};
  dwarf[SUBRACE.HILL_DWARF] = Subrace(
    pushID(SUBRACE.HILL_DWARF),
    'Hill Dwarf',
    [
      Increase(ABILITY.WIS.VALUE, 1)
    ],
    [
      TRAIT.DWARVEN_TOUGHNESS
    ],
    1
  );
  dwarf[SUBRACE.MOUNTAIN_DWARF] = Subrace(
    pushID(SUBRACE.MOUNTAIN_DWARF),
    'Mountain Dwarf',
    [
      Increase(ABILITY.STR.VALUE, 2)
    ],
    [
      TRAIT.DWARVEN_ARMOR_TRAINING
    ],
    0,
    [
      ARMOR.TYPE.LIGHT,
      ARMOR.TYPE.MEDIUM
    ]
  );

  var elf = {};
  elf[SUBRACE.HIGH_ELF] = Subrace(
    pushID(SUBRACE.HIGH_ELF),
    'High Elf',
    [
      Increase(ABILITY.INT.VALUE, 1)
    ],
    [
      TRAIT.CANTRIP,
      TRAIT.EXTRA_LANGUAGE
    ],
    0,
    null,
    [
      LANGUAGE.ANY
    ]
  );
  elf[SUBRACE.WOOD_ELF] = Subrace(
    pushID(SUBRACE.WOOD_ELF),
    'Wood Elf',
    [
      Increase(ABILITY.WIS.VALUE, 1)
    ],
    [
      TRAIT.FLEET_OF_FOOT,
      TRAIT.MASK_OF_THE_WILD
    ],
    35
  );
  elf[SUBRACE.DARK_ELF] = Subrace(
    pushID(SUBRACE.DARK_ELF),
    'Dark Elf (Drow)',
    [
      Increase(ABILITY.CHA.VALUE, 1)
    ],
    [
      TRAIT.SUPERIOR_DARKVISION,
      TRAIT.SUNLIGHT_SENSITIVITY,
      TRAIT.DROW_MAGIC,
      TRAIT.DROW_WEAPON_TRAINING
    ],
    0,
    [
      WEAPON.RAPIER,
      WEAPON.SHORTSWORD,
      WEAPON.HAND_CROSSBOW,
    ]
  );

  var subraces = {};
  subraces[RACE.DWARF] = dwarf;
  subraces[RACE.ELF] = elf;

  return subraces;
}

const RACE_PATH = 'races';

// RACE does not have VALUE or PATH
const RACE = {
  'DWARF': 'dwarf',
  'ELF': 'elf',
  'HALFLING': 'halfling',
  'HUMAN': 'human',
  'DRAGONBRON': 'dragonborn',
  'GNOME': 'gnome',
  'HALF_ELF': 'half_elf',
  'HALF_ORC': 'half_orc',
  'TIEFLING': 'tiefling'
};

function Race(id, name, increasesList, speed, traitsList, profsList, languagesList, subracesList, maxHP_bonus=0) {
  if (arguments.length < 8) {
    console.log('ERROR: Missing required arguments');
    return null;
  }

  var race = {
    'id': id,
    'name': name,
    'speed': speed
  };

  var increases = {};
  for (i of increasesList) {
    increases[i.ability] = i.mod;
  }
  race['increases'] = increases;

  var traits = {};
  for (t of traitsList) {
    traits[t] = true;
  }
  race['traits'] = traits;

  if (maxHP_bonus > 0) {
    subrace['maxHP_bonus'] = maxHP_bonus;
  }

  var proficiencies = {};
  var choiceCount = 1;
  for (p of profsList) {
    if (p.hasOwnProperty(CHOOSE)) {
      delete p[CHOOSE];
      proficiencies['choice' + choiceCount] = p;
      choiceCount++;
    }
    else {
      proficiencies[p.VALUE] = p.PATH;
    }
  }
  race['proficiencies'] = proficiencies;

  var languages = {};
  for (l of languagesList) {
    languages[l] = true;
  }
  race['languages'] = languages;

  return race;
}

const CHOOSE = 'choose';

function Choices(amount, choicesList) {
  if (arguments.length < 2) {
    console.log('ERROR: Missing required arguments');
    return null;
  }

  var choices = {};
  choices[CHOOSE] = true;

  var choice = {};
  var conditionCount = 1;
  for (c of choicesList) {
    if (c.hasOwnProperty(CONDITIONS)) {
      choice['condition' + conditionCount] = c;
      conditionCount++;
    }
    else {
      choice[c.value] = {
        'quantity': c.quantity,
        'path': c.path
      };
    }
  }
  choices[amount] = choice;

  return choices;
}

function Choice(item, quantity=1) {
  if (arguments.length < 1) {
    console.log('ERROR: Missing required arguments');
    return null;
  }

  return {
    'value': item.VALUE,
    'quantity': quantity,
    'path': item.PATH
  };
}

const CONDITIONS = 'conditions';

function Condition(list, quantity=1) {
  if (arguments.length < 1) {
    console.log('ERROR: Missing required arguments');
    return null;
  }
  if (list.length === 0) {
    console.log('ERROR: list is empty');
    return null;
  }

  var conditions = {
    'quantity': quantity // is quality really necessary?
  };

  var condition = {};
  for (l of list) {
    condition[l.VALUE] = l.PATH;
  }
  conditions[CONDITIONS] = condition;

  return conditions;
}

function getRaces() {
  var races = {};

  races[RACE.DWARF] = Race(
    pushID(RACE.DWARF),
    'Dwarf',
    [
      Increase(ABILITY.CON.VALUE, 2)
    ],
    25,
    [
      TRAIT.DARKVISION,
      TRAIT.DWARVEN_RESILIENCE,
      TRAIT.DWARVEN_COMBAT_TRAINING,
      TRAIT.STONECUNNING
    ],
    [
      WEAPON.BATTLEAXE,
      WEAPON.HANDAXE,
      WEAPON.LIGHT_HAMMER,
      WEAPON.WARHAMMER,
      Choices(
        1,
        [
          Choice(TOOL.SMITHS_TOOLS),
          Choice(TOOL.BREWERS_SUPPLIES),
          Choice(TOOL.MASONS_TOOLS)
        ]
      )
    ],
    [
      LANGUAGE.COMMON,
      LANGUAGE.DWARVISH
    ],
    [
      SUBRACE.HILL_DWARF,
      SUBRACE.MOUNTAIN_DWARF
    ],
    0
  );

  races[RACE.ELF] = Race(
    pushID(RACE.ELF),
    'Elf',
    [
      Increase(ABILITY.DEX.VALUE, 2)
    ],
    30,
    [
      TRAIT.DARKVISION,
      TRAIT.KEEN_SENSES,
      TRAIT.FEY_ANCESTRY,
      TRAIT.TRANCE,
      TRAIT.ELF_WEAPON_TRAINING
    ],
    [
      SKILL.PERCEPTION,
      WEAPON.LONGSWORD,
      WEAPON.SHORTSWORD,
      WEAPON.SHORTBOW,
      WEAPON.LONGBOW
    ],
    [
      LANGUAGE.COMMON,
      LANGUAGE.ELVISH
    ],
    [
      SUBRACE.HIGH_ELF,
      SUBRACE.WOOD_ELF,
      SUBRACE.DARK_ELF
    ],
    0
  );

  return races;
}

/*********
* CLASSES
*********/

const CLASS_PATH = 'classes';

// CLASS does not have VALUE or PATH
const CLASS = {
  'BARBARIAN': 'barbarian',
  'BARD': 'bard'
};

function Class(id, name, hitDice, profsList, equipmentList) {
  if (arguments.length < 5) {
    console.log('ERROR: Missing required arguments');
    return null;
  }

  var classObj = {
    'id': id,
    'name': name,
    'hitDice': hitDice
  };

  var proficiencies = {};
  var choiceCount = 1;
  for (p of profsList) {
    if (p.hasOwnProperty(CHOOSE)) {
      delete p[CHOOSE];
      proficiencies['choice' + choiceCount] = p;
      choiceCount++;
    }
    else {
      proficiencies[p.VALUE] = p.PATH;
    }
  }
  classObj['proficiencies'] = proficiencies;

  var equipment = {};
  choiceCount = 1;
  for (e of equipmentList) {
    if (e.hasOwnProperty(CHOOSE)) {
      delete e[CHOOSE];
      equipment['choice' + choiceCount] = e;
      choiceCount++;
    }
    else {
      equipment[e.item] = {
        'quantity': e.quantity,
        'path': e.path
      };
    }
  }
  classObj['equipment'] = equipment;

  return classObj;
}

function HitDice(num, die) {
  if (arguments.length < 2) {
    console.log('ERROR: Missing required arguments');
    return null;
  }

  return {
    'num': num,
    'die': die,
    'text': num + 'd' + die
  };
}

function Equipment(item, quantity=1) {
  if (arguments.length < 1) {
    console.log('ERROR: Missing required arguments');
    return null;
  }

  return {
    'item': item.VALUE,
    'path': item.PATH,
    'quantity': quantity
  };
}

function getClasses() {
  var classes = {};

  classes[CLASS.BARBARIAN] = Class(
    pushID(CLASS.BARBARIAN),
    'Barbarian',
    HitDice(1, 12),
    [
      ARMOR.TYPE.LIGHT,
      ARMOR.TYPE.MEDIUM,
      ARMOR.TYPE.SHIELD,
      WEAPON.CATEGORY.SIMPLE,
      WEAPON.CATEGORY.MARTIAL,
      ABILITY.STR,
      ABILITY.CON,
      Choices(
        2,
        [
          Choice(SKILL.ANIMAL_HANDLING),
          Choice(SKILL.ATHLETICS),
          Choice(SKILL.INTIMIDATION),
          Choice(SKILL.NATURE),
          Choice(SKILL.PERCEPTION),
          Choice(SKILL.SURVIVAL)
        ]
      )
    ],
    [
      Choices(
        1,
        [
          Choice(WEAPON.GREATAXE),
          Condition([WEAPON.CLASS.MELEE, WEAPON.CATEGORY.MARTIAL])
        ]
      ),
      Choices(
        1,
        [
          Choice(WEAPON.HANDAXE, 2),
          Condition([WEAPON.CATEGORY.SIMPLE])
        ]
      ),
      Equipment(PACK.EXPLORER),
      Equipment(WEAPON.JAVELIN, 4)
    ]
  );

  classes[CLASS.BARD] = Class(
    pushID(CLASS.BARD),
    'Bard',
    HitDice(1, 8),
    [
      ARMOR.TYPE.LIGHT,
      WEAPON.CATEGORY.SIMPLE,
      WEAPON.HAND_CROSSBOW,
      WEAPON.LONGSWORD,
      WEAPON.RAPIER,
      WEAPON.SHORTSWORD,
      Choices(
        3,
        [
          Condition([TOOL.CATEGORY.MUSICAL_INSTRUMENT])
        ]
      ),
      ABILITY.DEX,
      ABILITY.CHA,
      Choices(
        3,
        [
          Condition([SKILL.ANY])
        ]
      )
    ],
    [
      Choices(
        1,
        [
          Choice(WEAPON.RAPIER),
          Choice(WEAPON.LONGSWORD),
          Condition([WEAPON.CATEGORY.SIMPLE])
        ]
      ),
      Choices(
        1,
        [
          Choice(PACK.DIPLOMAT),
          Choice(PACK.ENTERTAINER)
        ]
      ),
      Choices(
        1,
        [
          Condition([TOOL.CATEGORY.MUSICAL_INSTRUMENT])
        ]
      ),
      Equipment(ARMOR.LEATHER),
      Equipment(WEAPON.DAGGER)
    ]
  );

  return classes;
}
