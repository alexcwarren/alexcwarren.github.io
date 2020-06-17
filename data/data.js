const BAD_APOSTROPHE = '’';
const EXTENDED_HYPHEN = '—';

const dataRef = database.ref('dnd_data');

const ANY = 'any';
const ALL = 'all';
const NAME = 'name';

var usedIDs = [];

function pushID(name) {
  if (name === '') {
    console.log('pushID: ERROR: Missing name');
    return null;
  }

  var id = getNextID();

  usedIDs.forEach(function(u) {
    if (id === u.id && name !== u.name) {
      console.log(`pushID: ERROR: Cannot store ${name}: ${id} already used by ${u.name}`);
      return null;
    }
  });

  var entry = {
    'id': id
  };
  entry[NAME] = name;
  usedIDs.push(entry);

  return id;
}

function getNextID() {
  // Make sure nextID is always exactly 4 hex digits
  let minLimit = 4096; // 16^(4-1) = 16^3
  let maxLimit = 65536 - 4096; // 16^4 - 16^3

  let nextID = getRandomNum(minLimit, maxLimit).toString(16);

  var alreadyUsed = false;
  var count = 1;
  usedIDs.forEach(function(item) {
    if (nextID === item.id) {
      alreadyUsed = true;
      count++;
    }
  });
  if (alreadyUsed) {
    return getNextID();
  }

  usedIDs.push(nextID);

  return nextID;
}

function getRandomNum(min=0, max=1) {
  return Math.floor(Math.random() * max) + min;
}

function showUsedIDs() {
  getAbilities();
  getArmor();
  getArmorTypes();
  getClasses();
  getGear();
  getLanguages();
  getSkills();
  getRaces();
  getSubraces();
  getTools();
  getTraits();
  getWeaponCategories();
  getWeaponClasses();
  getWeapons();

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

const PATH = {
  'ABILITIES': 'abilities',
  'ALIGNMENTS': 'alignments',
  'ARMOR': 'armor',
  'ARMOR_TYPES': 'armor_types',
  'BACKGROUNDS': 'backgrounds',
  'CLASSES': 'classes',
  'GEAR': 'gear',
  'GEAR_TYPES': 'gear_types',
  'LANGUAGES': 'languages',
  'PACKS': 'packs',
  'PETS': 'pets',
  'RACES': 'races',
  'SKILLS': 'skills',
  'SUBRACES': 'subraces',
  'TOOL_CATEGORIES': 'tool_categories',
  'TOOLS': 'tools',
  'TRAITS': 'traits',
  'TRINKETS': 'trinkets',
  'VEHICLE_TYPES': 'vehicle_types',
  'WEAPON_CATEGORIES': 'weapon_categories',
  'WEAPON_CLASSES': 'weapon_classes',
  'WEAPONS': 'weapons'
};

/***********
* ABILITIES
***********/

const ABILITY = {
  'STR': {
    'VALUE': 'STR',
    'PATH': PATH.ABILITIES
  },
  'DEX': {
    'VALUE': 'DEX',
    'PATH': PATH.ABILITIES
  },
  'CON': {
    'VALUE': 'CON',
    'PATH': PATH.ABILITIES
  },
  'INT': {
    'VALUE': 'INT',
    'PATH': PATH.ABILITIES
  },
  'WIS': {
    'VALUE': 'WIS',
    'PATH': PATH.ABILITIES
  },
  'CHA': {
    'VALUE': 'CHA',
    'PATH': PATH.ABILITIES
  },
  'ANY': {
    'VALUE': ANY,
    'PATH': PATH.ABILITIES
  }
};

function Ability(id, name, longName, skillsList=null) {
  if (arguments.length < 3) {
    printRequiredArgumentsError(arguments);
    return null;
  }

  var ability = {
    'id': id,
    'longName': longName
  };
  ability[NAME] = name;

  if (skillsList !== null) {
    var skills = {};
    for (s of skillsList) {
      skills[s] = PATH.SKILLS;
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

const SKILL = {
  'ATHLETICS': {
    'VALUE': 'athletics',
    'PATH': PATH.SKILLS
  },
  'ACROBATICS': {
    'VALUE': 'acrobatics',
    'PATH': PATH.SKILLS
  },
  'SLEIGHT_OF_HAND': {
    'VALUE': 'sleight_of_hand',
    'PATH': PATH.SKILLS
  },
  'STEALTH': {
    'VALUE': 'stealth',
    'PATH': PATH.SKILLS
  },
  'ARCANA': {
    'VALUE': 'arcana',
    'PATH': PATH.SKILLS
  },
  'HISTORY': {
    'VALUE': 'history',
    'PATH': PATH.SKILLS
  },
  'INVESTIGATION': {
    'VALUE': 'investigation',
    'PATH': PATH.SKILLS
  },
  'NATURE': {
    'VALUE': 'nature',
    'PATH': PATH.SKILLS
  },
  'RELIGION': {
    'VALUE': 'religion',
    'PATH': PATH.SKILLS
  },
  'ANIMAL_HANDLING': {
    'VALUE': 'animal_handling',
    'PATH': PATH.SKILLS
  },
  'INSIGHT': {
    'VALUE': 'insight',
    'PATH': PATH.SKILLS
  },
  'MEDICINE': {
    'VALUE': 'medicine',
    'PATH': PATH.SKILLS
  },
  'PERCEPTION': {
    'VALUE': 'perception',
    'PATH': PATH.SKILLS
  },
  'SURVIVAL': {
    'VALUE': 'survival',
    'PATH': PATH.SKILLS
  },
  'DECEPTION': {
    'VALUE': 'deception',
    'PATH': PATH.SKILLS
  },
  'INTIMIDATION': {
    'VALUE': 'intimidation',
    'PATH': PATH.SKILLS
  },
  'PERFORMANCE': {
    'VALUE': 'performance',
    'PATH': PATH.SKILLS
  },
  'PERSUASION': {
    'VALUE': 'persuasion',
    'PATH': PATH.SKILLS
  },
  'ANY': {
    'VALUE': ANY,
    'PATH': PATH.SKILLS
  }
};

function Skill(id, name, parentAbility) {
  if (arguments.length < 3) {
    printRequiredArgumentsError(arguments);
    return null;
  }

  var skill = {
    'id': id,
    'parentAbility': parentAbility
  };
  skill[NAME] = name;

  return skill;
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

const LANGUAGE = {
  'COMMON': {
    'VALUE': 'common',
    'PATH': PATH.LANGUAGES
  },
  'DWARVISH': {
    'VALUE': 'dwarvish',
    'PATH': PATH.LANGUAGES
  },
  'ELVISH': {
    'VALUE': 'elvish',
    'PATH': PATH.LANGUAGES
  },
  'HALFLING': {
    'VALUE': 'halfling',
    'PATH': PATH.LANGUAGES
  },
  'DRACONIC': {
    'VALUE': 'draconic',
    'PATH': PATH.LANGUAGES
  },
  'GNOMISH': {
    'VALUE': 'gnomish',
    'PATH': PATH.LANGUAGES
  },
  'ORC': {
    'VALUE': 'orc',
    'PATH': PATH.LANGUAGES
  },
  'INFERNAL': {
    'VALUE': 'infernal',
    'PATH': PATH.LANGUAGES
  },
  'ANY': {
    'VALUE': ANY,
    'PATH': PATH.LANGUAGES
  },
  'ALL': {
    'VALUE': ALL,
    'PATH': PATH.LANGUAGES
  }
};

function Language(id, name) {
  if (arguments.length < 2) {
    printRequiredArgumentsError(arguments);
    return null;
  }

  var language = {
    'id': id
  };
  language[NAME] = name;

  return language;
}

function getLanguages() {
  var languages = {};

  languages[LANGUAGE.COMMON.VALUE] = Language(
    pushID(LANGUAGE.COMMON.VALUE),
    'Common'
  );

  languages[LANGUAGE.DWARVISH.VALUE] = Language(
    pushID(LANGUAGE.DWARVISH.VALUE),
    'Dwarvish'
  );

  languages[LANGUAGE.ELVISH.VALUE] = Language(
    pushID(LANGUAGE.ELVISH.VALUE),
    'Elvish'
  );

  languages[LANGUAGE.HALFLING.VALUE] = Language(
    pushID(LANGUAGE.HALFLING.VALUE),
    'Halfling'
  );

  languages[LANGUAGE.DRACONIC.VALUE] = Language(
    pushID(LANGUAGE.DRACONIC.VALUE),
    'Draconic'
  );

  languages[LANGUAGE.GNOMISH.VALUE] = Language(
    pushID(LANGUAGE.GNOMISH.VALUE),
    'Gnomish'
  );

  languages[LANGUAGE.ORC.VALUE] = Language(
    pushID(LANGUAGE.ORC.VALUE),
    'Orc'
  );

  languages[LANGUAGE.INFERNAL.VALUE] = Language(
    pushID(LANGUAGE.INFERNAL.VALUE),
    'Infernal'
  );

  return languages;
}

/*********
* WEAPONS
*********/

const WEAPON = {
  'CLUB': {
    'VALUE': 'club',
    'PATH': PATH.WEAPONS
  },
  'DAGGER': {
    'VALUE': 'dagger',
    'PATH': PATH.WEAPONS
  },
  'GREATCLUB': {
    'VALUE': 'greatclub',
    'PATH': PATH.WEAPONS
  },
  'HANDAXE': {
    'VALUE': 'handaxe',
    'PATH': PATH.WEAPONS
  },
  'JAVELIN': {
    'VALUE': 'javelin',
    'PATH': PATH.WEAPONS
  },
  'LIGHT_HAMMER': {
    'VALUE': 'light_hammer',
    'PATH': PATH.WEAPONS
  },
  'MACE': {
    'VALUE': 'mace',
    'PATH': PATH.WEAPONS
  },
  'QUARTERSTAFF': {
    'VALUE': 'quarterstaff',
    'PATH': PATH.WEAPONS
  },
  'SICKLE': {
    'VALUE': 'sickle',
    'PATH': PATH.WEAPONS
  },
  'SPEAR': {
    'VALUE': 'spear',
    'PATH': PATH.WEAPONS
  },
  'LIGHT_CROSSBOW': {
    'VALUE': 'light_crossbow',
    'PATH': PATH.WEAPONS
  },
  'DART': {
    'VALUE': 'dart',
    'PATH': PATH.WEAPONS
  },
  'SHORTBOW': {
    'VALUE': 'shortbow',
    'PATH': PATH.WEAPONS
  },
  'SLING': {
    'VALUE': 'sling',
    'PATH': PATH.WEAPONS
  },
  'BATTLEAXE': {
    'VALUE': 'battleaxe',
    'PATH': PATH.WEAPONS
  },
  'FLAIL': {
    'VALUE': 'flail',
    'PATH': PATH.WEAPONS
  },
  'GLAIVE': {
    'VALUE': 'glaive',
    'PATH': PATH.WEAPONS
  },
  'GREATAXE': {
    'VALUE': 'greataxe',
    'PATH': PATH.WEAPONS
  },
  'GREATSWORD': {
    'VALUE': 'greatsword',
    'PATH': PATH.WEAPONS
  },
  'HALBERD': {
    'VALUE': 'halberd',
    'PATH': PATH.WEAPONS
  },
  'LANCE': {
    'VALUE': 'lance',
    'PATH': PATH.WEAPONS
  },
  'LONGSWORD': {
    'VALUE': 'longsword',
    'PATH': PATH.WEAPONS
  },
  'MAUL': {
    'VALUE': 'maul',
    'PATH': PATH.WEAPONS
  },
  'MORNINGSTAR': {
    'VALUE': 'morningstar',
    'PATH': PATH.WEAPONS
  },
  'PIKE': {
    'VALUE': 'pike',
    'PATH': PATH.WEAPONS
  },
  'RAPIER': {
    'VALUE': 'rapier',
    'PATH': PATH.WEAPONS
  },
  'SCIMITAR': {
    'VALUE': 'scimitar',
    'PATH': PATH.WEAPONS
  },
  'SHORTSWORD': {
    'VALUE': 'shortsword',
    'PATH': PATH.WEAPONS
  },
  'TRIDENT': {
    'VALUE': 'trident',
    'PATH': PATH.WEAPONS
  },
  'WAR_PICK': {
    'VALUE': 'war_pick',
    'PATH': PATH.WEAPONS
  },
  'WARHAMMER': {
    'VALUE': 'warhammer',
    'PATH': PATH.WEAPONS
  },
  'WHIP': {
    'VALUE': 'whip',
    'PATH': PATH.WEAPONS
  },
  'BLOWGUN': {
    'VALUE': 'blowgun',
    'PATH': PATH.WEAPONS
  },
  'HAND_CROSSBOW': {
    'VALUE': 'hand_crossbow',
    'PATH': PATH.WEAPONS
  },
  'HEAVY_CROSSBOW': {
    'VALUE': 'heavy_crossbow',
    'PATH': PATH.WEAPONS
  },
  'LONGBOW': {
    'VALUE': 'longbow',
    'PATH': PATH.WEAPONS
  },
  'NET': {
    'VALUE': 'net',
    'PATH': PATH.WEAPONS
  },
  'ANY': {
    'VALUE': ANY,
    'PATH': PATH.WEAPONS
  },
  'ALL': {
    'VALUE': ALL,
    'PATH': PATH.WEAPONS
  },

  'CLASS': {
    'MELEE': {
      'VALUE': 'melee',
      'PATH': PATH.WEAPON_CLASSES
    },
    'RANGED': {
      'VALUE': 'ranged',
      'PATH': PATH.WEAPON_CLASSES
    }
  },
  'CATEGORY': {
    'SIMPLE': {
      'VALUE': 'simple',
      'PATH': PATH.WEAPON_CATEGORIES
    },
    'MARTIAL': {
      'VALUE': 'martial',
      'PATH': PATH.WEAPON_CATEGORIES
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
  const value = PATH.WEAPONS;

  var melee = {};
  melee[NAME] = 'Melee weapons';
  melee[WEAPON.CLUB.VALUE] = value;
  melee[WEAPON.DAGGER.VALUE] = value;
  melee[WEAPON.GREATCLUB.VALUE] = value;
  melee[WEAPON.HANDAXE.VALUE] = value;
  melee[WEAPON.JAVELIN.VALUE] = value;
  melee[WEAPON.LIGHT_HAMMER.VALUE] = value;
  melee[WEAPON.MACE.VALUE] = value;
  melee[WEAPON.QUARTERSTAFF.VALUE] = value;
  melee[WEAPON.SICKLE.VALUE] = value;
  melee[WEAPON.SPEAR.VALUE] = value;
  melee[WEAPON.BATTLEAXE.VALUE] = value;
  melee[WEAPON.FLAIL.VALUE] = value;
  melee[WEAPON.GLAIVE.VALUE] = value;
  melee[WEAPON.GREATAXE.VALUE] = value;
  melee[WEAPON.GREATSWORD.VALUE] = value;
  melee[WEAPON.HALBERD.VALUE] = value;
  melee[WEAPON.LANCE.VALUE] = value;
  melee[WEAPON.LONGSWORD.VALUE] = value;
  melee[WEAPON.MAUL.VALUE] = value;
  melee[WEAPON.MORNINGSTAR.VALUE] = value;
  melee[WEAPON.PIKE.VALUE] = value;
  melee[WEAPON.RAPIER.VALUE] = value;
  melee[WEAPON.SCIMITAR.VALUE] = value;
  melee[WEAPON.SHORTSWORD.VALUE] = value;
  melee[WEAPON.TRIDENT.VALUE] = value;
  melee[WEAPON.WAR_PICK.VALUE] = value;
  melee[WEAPON.WARHAMMER.VALUE] = value;
  melee[WEAPON.WHIP.VALUE] = value;

  var ranged = {};
  ranged[NAME] = 'Ranged weapons';
  ranged[WEAPON.LIGHT_CROSSBOW.VALUE] = value;
  ranged[WEAPON.DART.VALUE] = value;
  ranged[WEAPON.SHORTBOW.VALUE] = value;
  ranged[WEAPON.SLING.VALUE] = value;
  ranged[WEAPON.BLOWGUN.VALUE] = value;
  ranged[WEAPON.HAND_CROSSBOW.VALUE] = value;
  ranged[WEAPON.HEAVY_CROSSBOW.VALUE] = value;
  ranged[WEAPON.LONGBOW.VALUE] = value;
  ranged[WEAPON.NET.VALUE] = value;

  var weaponClasses = {};
  weaponClasses[WEAPON.CLASS.MELEE.VALUE] = melee;
  weaponClasses[WEAPON.CLASS.RANGED.VALUE] = ranged;

  return weaponClasses;
}

function getWeaponCategories() {
  const value = PATH.WEAPONS;

  var simple = {};
  simple[NAME] = 'Simple weapons';
  simple[WEAPON.CLUB.VALUE] = value;
  simple[WEAPON.DAGGER.VALUE] = value;
  simple[WEAPON.GREATCLUB.VALUE] = value;
  simple[WEAPON.HANDAXE.VALUE] = value;
  simple[WEAPON.JAVELIN.VALUE] = value;
  simple[WEAPON.LIGHT_HAMMER.VALUE] = value;
  simple[WEAPON.MACE.VALUE] = value;
  simple[WEAPON.QUARTERSTAFF.VALUE] = value;
  simple[WEAPON.SICKLE.VALUE] = value;
  simple[WEAPON.SPEAR.VALUE] = value;
  simple[WEAPON.LIGHT_CROSSBOW.VALUE] = value;
  simple[WEAPON.DART.VALUE] = value;
  simple[WEAPON.SHORTBOW.VALUE] = value;
  simple[WEAPON.SLING.VALUE] = value;

  var martial = {};
  martial[NAME] = 'Martial weapons';
  martial[WEAPON.BATTLEAXE.VALUE] = value;
  martial[WEAPON.FLAIL.VALUE] = value;
  martial[WEAPON.GLAIVE.VALUE] = value;
  martial[WEAPON.GREATAXE.VALUE] = value;
  martial[WEAPON.GREATSWORD.VALUE] = value;
  martial[WEAPON.HALBERD.VALUE] = value;
  martial[WEAPON.LANCE.VALUE] = value;
  martial[WEAPON.LONGSWORD.VALUE] = value;
  martial[WEAPON.MAUL.VALUE] = value;
  martial[WEAPON.MORNINGSTAR.VALUE] = value;
  martial[WEAPON.PIKE.VALUE] = value;
  martial[WEAPON.RAPIER.VALUE] = value;
  martial[WEAPON.SCIMITAR.VALUE] = value;
  martial[WEAPON.SHORTSWORD.VALUE] = value;
  martial[WEAPON.TRIDENT.VALUE] = value;
  martial[WEAPON.WAR_PICK.VALUE] = value;
  martial[WEAPON.WARHAMMER.VALUE] = value;
  martial[WEAPON.WHIP.VALUE] = value;
  martial[WEAPON.BLOWGUN.VALUE] = value;
  martial[WEAPON.HAND_CROSSBOW.VALUE] = value;
  martial[WEAPON.HEAVY_CROSSBOW.VALUE] = value;
  martial[WEAPON.LONGBOW.VALUE] = value;
  martial[WEAPON.NET.VALUE] = value;

  var weaponCategories = {};
  weaponCategories[WEAPON.CATEGORY.SIMPLE.VALUE] = simple;
  weaponCategories[WEAPON.CATEGORY.MARTIAL.VALUE] = martial;

  return weaponCategories;
}

function Weapon(id, name, classType, category, costGP, damage, weightLB, properties=null) {
  if (arguments.length < 7) {
    printRequiredArgumentsError(arguments);
    return null;
  }

  var weapon = {
    'id': id,
    'class': classType,
    'category': category,
    'costGP': costGP,
    'damage': damage,
    'weightLB': weightLB
  };
  weapon[NAME] = name;

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
    printRequiredArgumentsError(arguments);
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
    printRequiredArgumentsError(arguments);
    return null;
  }

  var name = id[0].toUpperCase() + id.slice(1);

  var range = {
    'id': id,
    'range': {
      'normal':normal,
      'max':max
    }
  };
  range[NAME] = name;

  return range;
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

const ARMOR = {
  'PADDED': {
    'VALUE': 'padded',
    'PATH': PATH.ARMOR
  },
  'LEATHER': {
    'VALUE': 'leather',
    'PATH': PATH.ARMOR
  },
  'STUDDED_LEATHER': {
    'VALUE': 'studded_leather',
    'PATH': PATH.ARMOR
  },
  'HIDE': {
    'VALUE': 'hide',
    'PATH': PATH.ARMOR
  },
  'CHAIN_SHIRT': {
    'VALUE': 'chain_shirt',
    'PATH': PATH.ARMOR
  },
  'SCALE_MAIL': {
    'VALUE': 'scale_mail',
    'PATH': PATH.ARMOR
  },
  'BREASTPLATE': {
    'VALUE': 'breastplate',
    'PATH': PATH.ARMOR
  },
  'HALF_PLATE': {
    'VALUE': 'half_plate',
    'PATH': PATH.ARMOR
  },
  'RING_MAIL': {
    'VALUE': 'ring_mail',
    'PATH': PATH.ARMOR
  },
  'CHAIN_MAIL': {
    'VALUE': 'chain_mail',
    'PATH': PATH.ARMOR
  },
  'SPLINT': {
    'VALUE': 'splint',
    'PATH': PATH.ARMOR
  },
  'PLATE': {
    'VALUE': 'plate',
    'PATH': PATH.ARMOR
  },
  'SHIELD': {
    'VALUE': 'shield',
    'PATH': PATH.ARMOR
  },
  'ANY': {
    'VALUE': ANY,
    'PATH': PATH.ARMOR
  },
  'ALL': {
    'VALUE': ALL,
    'PATH': PATH.ARMOR
  },

  'TYPE': {
    'LIGHT': {
      'VALUE': 'light',
      'PATH': PATH.ARMOR_TYPES
    },
    'MEDIUM': {
      'VALUE': 'medium',
      'PATH': PATH.ARMOR_TYPES
    },
    'HEAVY': {
      'VALUE': 'heavy',
      'PATH': PATH.ARMOR_TYPES
    },
    'SHIELD': {
      'VALUE': 'shield',
      'PATH': PATH.ARMOR_TYPES
    },
    'ALL': {
      'VALUE': 'all',
      'PATH': PATH.ARMOR_TYPES
    }
  }
}

function getArmorTypes() {
  const value = PATH.ARMOR;

  var light = {};
  light[NAME] = 'Light armor';
  light[ARMOR.PADDED.VALUE] = value;
  light[ARMOR.LEATHER.VALUE] = value;
  light[ARMOR.STUDDED_LEATHER.VALUE] = value;

  var medium = {};
  medium[NAME] = 'Medium armor';
  medium[ARMOR.HIDE.VALUE] = value;
  medium[ARMOR.CHAIN_SHIRT.VALUE] = value;
  medium[ARMOR.SCALE_MAIL.VALUE] = value;
  medium[ARMOR.BREASTPLATE.VALUE] = value;
  medium[ARMOR.HALF_PLATE.VALUE] = value;

  var heavy = {};
  heavy[NAME] = 'Heavy armor';
  heavy[ARMOR.RING_MAIL.VALUE] = value;
  heavy[ARMOR.CHAIN_MAIL.VALUE] = value;
  heavy[ARMOR.SPLINT.VALUE] = value;
  heavy[ARMOR.PLATE.VALUE] = value;

  var shield = {};
  shield[NAME] = 'Shields';
  shield[ARMOR.SHIELD.VALUE] = value;

  var armorTypes = {};
  armorTypes[ARMOR.TYPE.LIGHT.VALUE] = light;
  armorTypes[ARMOR.TYPE.MEDIUM.VALUE] = medium;
  armorTypes[ARMOR.TYPE.HEAVY.VALUE] = heavy;
  armorTypes[ARMOR.TYPE.SHIELD.VALUE] = shield;
  armorTypes[ARMOR.TYPE.ALL.VALUE] = true;

  return armorTypes;
}

function Armor(id, name, type, costGP, baseAC, stealthDisAdv, weightLB, isModified=false, hasMaxAC=false, minSTR=0) {
  if (arguments.length < 7) {
    printRequiredArgumentsError(arguments);
    return null;
  }

  var armor = {
    'id': id,
    'type': type,
    'costGP': costGP,
    'baseAC': baseAC,
    'stealthDisAdv': stealthDisAdv,
    'weightLB': weightLB,
    'isModified': isModified,
    'hasMaxAC': hasMaxAC,
    'minSTR': minSTR
  };
  armor[NAME] = name;

  return armor;
}

function getArmor() {
  var armor = {};

  armor[ARMOR.PADDED.VALUE] = Armor(
    pushID(ARMOR.PADDED),
    'Padded armor',
    ARMOR.TYPE.LIGHT.VALUE,
    5,
    11,
    true,
    8,
    true
  );

  armor[ARMOR.LEATHER.VALUE] = Armor(
    pushID(ARMOR.LEATHER),
    'Leather armor',
    ARMOR.TYPE.LIGHT.VALUE,
    10,
    11,
    false,
    10,
    true
  );

  armor[ARMOR.STUDDED_LEATHER.VALUE] = Armor(
    pushID(ARMOR.STUDDED_LEATHER),
    'Studded leather armor',
    ARMOR.TYPE.LIGHT.VALUE,
    45,
    12,
    false,
    13,
    true
  );

  armor[ARMOR.HIDE.VALUE] = Armor(
    pushID(ARMOR.HIDE),
    'Hide armor',
    ARMOR.TYPE.MEDIUM.VALUE,
    10,
    12,
    false,
    12,
    true,
    true
  );

  armor[ARMOR.CHAIN_SHIRT.VALUE] = Armor(
    pushID(ARMOR.CHAIN_SHIRT),
    'Chain shirt armor',
    ARMOR.TYPE.MEDIUM.VALUE,
    50,
    13,
    false,
    20,
    true,
    true
  );

  armor[ARMOR.SCALE_MAIL.VALUE] = Armor(
    pushID(ARMOR.SCALE_MAIL),
    'Scale mail armor',
    ARMOR.TYPE.MEDIUM.VALUE,
    50,
    14,
    true,
    45,
    true,
    true
  );

  armor[ARMOR.BREASTPLATE.VALUE] = Armor(
    pushID(ARMOR.BREASTPLATE),
    'Breastplate armor',
    ARMOR.TYPE.MEDIUM.VALUE,
    400,
    14,
    false,
    20,
    true,
    true
  );

  armor[ARMOR.HALF_PLATE.VALUE] = Armor(
    pushID(ARMOR.HALF_PLATE),
    'Half plate armor',
    ARMOR.TYPE.MEDIUM.VALUE,
    750,
    15,
    true,
    40,
    true,
    true
  );
  
  armor[ARMOR.RING_MAIL.VALUE] = Armor(
    pushID(ARMOR.RING_MAIL),
    'Ring mail armor',
    ARMOR.TYPE.HEAVY.VALUE,
    30,
    14,
    true,
    40
  );

  armor[ARMOR.CHAIN_MAIL.VALUE] = Armor(
    pushID(ARMOR.CHAIN_MAIL),
    'Chain mail armor',
    ARMOR.TYPE.HEAVY.VALUE,
    75,
    16,
    true,
    55,
    false,
    false,
    13
  );

  armor[ARMOR.SPLINT.VALUE] = Armor(
    pushID(ARMOR.SPLINT),
    'Splint armor',
    ARMOR.TYPE.HEAVY.VALUE,
    200,
    17,
    true,
    60,
    false,
    false,
    15
  );

  armor[ARMOR.PLATE.VALUE] = Armor(
    pushID(ARMOR.PLATE),
    'Plate armor',
    ARMOR.TYPE.HEAVY.VALUE,
    1500,
    18,
    true,
    65,
    false,
    false,
    15
  );

  armor[ARMOR.SHIELD.VALUE] = Armor(
    pushID(ARMOR.SHIELD),
    'Shield',
    ARMOR.TYPE.SHIELD.VALUE,
    10,
    2,
    false,
    6
  );

  armor[ARMOR.ALL.VALUE] = Armor(
    pushID(ARMOR.ALL),
    'All armor',
    ARMOR.TYPE.ALL.VALUE,
    0,
    0,
    false,
    0
  );

  return armor;
}

/*******
* TOOLS
*******/

const TOOL = {
  'ALCHEMISTS_SUPPLIES': {
    'VALUE': 'alchemists_supplies',
    'PATH': PATH.TOOLS
  },
  'BREWERS_SUPPLIES': {
    'VALUE': 'brewers_supplies',
    'PATH': PATH.TOOLS
  },
  'CALLIGRAPHERS_SUPPLIES': {
    'VALUE': 'calligraphers_supplies',
    'PATH': PATH.TOOLS
  },
  'CARPENTERS_TOOLS': {
    'VALUE': 'carpenters_tools',
    'PATH': PATH.TOOLS
  },
  'CARTOGRAPHERS_TOOLS': {
    'VALUE': 'cartographers_tools',
    'PATH': PATH.TOOLS
  },
  'COBBLERS_TOOLS': {
    'VALUE': 'cobblers_tools',
    'PATH': PATH.TOOLS
  },
  'COOKS_UTENSILS': {
    'VALUE': 'cooks_utensils',
    'PATH': PATH.TOOLS
  },
  'GLASSBLOWERS_TOOLS': {
    'VALUE': 'glassblowers_tools',
    'PATH': PATH.TOOLS
  },
  'JEWELERS_TOOLS': {
    'VALUE': 'jewelers_tools',
    'PATH': PATH.TOOLS
  },
  'LEATHERWORKERS_TOOLS': {
    'VALUE': 'leatherworkers_tools',
    'PATH': PATH.TOOLS
  },
  'MASONS_TOOLS': {
    'VALUE': 'masons_tools',
    'PATH': PATH.TOOLS
  },
  'PAINTERS_SUPPLIES': {
    'VALUE': 'painters_supplies',
    'PATH': PATH.TOOLS
  },
  'POTTERS_TOOLS': {
    'VALUE': 'potters_tools',
    'PATH': PATH.TOOLS
  },
  'SMITHS_TOOLS': {
    'VALUE': 'smiths_tools',
    'PATH': PATH.TOOLS
  },
  'TINKERS_TOOLS': {
    'VALUE': 'tinkers_tools',
    'PATH': PATH.TOOLS
  },
  'WEAVERS_TOOLS': {
    'VALUE': 'weavers_tools',
    'PATH': PATH.TOOLS
  },
  'WOODCARVERS_TOOLS': {
    'VALUE': 'woodcarvers_tools',
    'PATH': PATH.TOOLS
  },
  'DISGUISE_KIT': {
    'VALUE': 'disguise_kit',
    'PATH': PATH.TOOLS
  },
  'FORGERY_KIT': {
    'VALUE': 'forgery_kit',
    'PATH': PATH.TOOLS
  },
  'DICE_SET': {
    'VALUE': 'dice_set',
    'PATH': PATH.TOOLS
  },
  'DRAGONCHESS_SET': {
    'VALUE': 'dragonchess_set',
    'PATH': PATH.TOOLS
  },
  'PLAYING_CARD_SET': {
    'VALUE': 'playing_card_set',
    'PATH': PATH.TOOLS
  },
  'THREE_DRAGON_ANTE_SET': {
    'VALUE': 'three_dragon_ante_set',
    'PATH': PATH.TOOLS
  },
  'HERBALISM_KIT': {
    'VALUE': 'herbalism_kit',
    'PATH': PATH.TOOLS
  },
  'BAGPIPES': {
    'VALUE': 'bagpipes',
    'PATH': PATH.TOOLS
  },
  'DRUM': {
    'VALUE': 'drum',
    'PATH': PATH.TOOLS
  },
  'DULCIMER': {
    'VALUE': 'dulcimer',
    'PATH': PATH.TOOLS
  },
  'FLUTE': {
    'VALUE': 'flute',
    'PATH': PATH.TOOLS
  },
  'LUTE': {
    'VALUE': 'lute',
    'PATH': PATH.TOOLS
  },
  'LYRE': {
    'VALUE': 'lyre',
    'PATH': PATH.TOOLS
  },
  'HORN': {
    'VALUE': 'horn',
    'PATH': PATH.TOOLS
  },
  'PAN_FLUTE': {
    'VALUE': 'pan_flute',
    'PATH': PATH.TOOLS
  },
  'SHAWM': {
    'VALUE': 'shawm',
    'PATH': PATH.TOOLS
  },
  'VIOL': {
    'VALUE': 'viol',
    'PATH': PATH.TOOLS
  },
  'NAVIGATORS_TOOLS': {
    'VALUE': 'navigators_tools',
    'PATH': PATH.TOOLS
  },
  'POISONERS_KIT': {
    'VALUE': 'poisoners_kit',
    'PATH': PATH.TOOLS
  },
  'THIEVES_TOOLS': {
    'VALUE': 'thieves_tools',
    'PATH': PATH.TOOLS
  },
  'ANY': {
    'VALUE': ANY,
    'PATH': PATH.TOOLS
  },

  'CATEGORY': {
    'ARTISAN': {
      'VALUE': 'artisan',
      'PATH': PATH.TOOL_CATEGORIES
    },
    'GAMING_SET': {
      'VALUE': 'gaming_set',
      'PATH': PATH.TOOL_CATEGORIES
    },
    'MUSICAL_INSTRUMENT': {
      'VALUE': 'musical_instrument',
      'PATH': PATH.TOOL_CATEGORIES
    }
  }
};

function getToolCategories() {
  const value = PATH.TOOLS;

  var artisan = {};
  artisan[NAME] = 'Artisan\'s tools';
  artisan[TOOL.ALCHEMISTS_SUPPLIES.VALUE] = value;
  artisan[TOOL.BREWERS_SUPPLIES.VALUE] = value;
  artisan[TOOL.CALLIGRAPHERS_SUPPLIES.VALUE] = value;
  artisan[TOOL.CARPENTERS_TOOLS.VALUE] = value;
  artisan[TOOL.CARTOGRAPHERS_TOOLS.VALUE] = value;
  artisan[TOOL.COBBLERS_TOOLS.VALUE] = value;
  artisan[TOOL.COOKS_UTENSILS.VALUE] = value;
  artisan[TOOL.GLASSBLOWERS_TOOLS.VALUE] = value;
  artisan[TOOL.JEWELERS_TOOLS.VALUE] = value;
  artisan[TOOL.LEATHERWORKERS_TOOLS.VALUE] = value;
  artisan[TOOL.MASONS_TOOLS.VALUE] = value;
  artisan[TOOL.PAINTERS_SUPPLIES.VALUE] = value;
  artisan[TOOL.POTTERS_TOOLS.VALUE] = value;
  artisan[TOOL.SMITHS_TOOLS.VALUE] = value;
  artisan[TOOL.TINKERS_TOOLS.VALUE] = value;
  artisan[TOOL.WEAVERS_TOOLS.VALUE] = value;
  artisan[TOOL.WOODCARVERS_TOOLS.VALUE] = value;

  var gaming_set = {};
  gaming_set[NAME] = 'Gaming sets';
  gaming_set[TOOL.DICE_SET.VALUE] = value;
  gaming_set[TOOL.DRAGONCHESS_SET.VALUE] = value;
  gaming_set[TOOL.PLAYING_CARD_SET.VALUE] = value;
  gaming_set[TOOL.THREE_DRAGON_ANTE_SET.VALUE] = value;

  var musical_instrument = {};
  musical_instrument[NAME] = 'Musical instruments';
  musical_instrument[TOOL.BAGPIPES.VALUE] = value;
  musical_instrument[TOOL.DRUM.VALUE] = value;
  musical_instrument[TOOL.DULCIMER.VALUE] = value;
  musical_instrument[TOOL.FLUTE.VALUE] = value;
  musical_instrument[TOOL.LUTE.VALUE] = value;
  musical_instrument[TOOL.LYRE.VALUE] = value;
  musical_instrument[TOOL.HORN.VALUE] = value;
  musical_instrument[TOOL.PAN_FLUTE.VALUE] = value;
  musical_instrument[TOOL.SHAWM.VALUE] = value;
  musical_instrument[TOOL.VIOL.VALUE] = value;

  var toolCategories = {};
  toolCategories[TOOL.CATEGORY.ARTISAN.VALUE] = artisan;
  toolCategories[TOOL.CATEGORY.GAMING_SET.VALUE] = gaming_set;
  toolCategories[TOOL.CATEGORY.MUSICAL_INSTRUMENT.VALUE] = musical_instrument;

  return toolCategories;
}

function printRequiredArgumentsError(arguments) {
  let caller = printRequiredArgumentsError.caller;
  printRequiredArgumentsError(arguments);
  console.log(errorMessage);

  for (i in arguments) {
    let arg = arguments[i];
    console.log(arg);
    // errorMessage += ` arg${i}=${arg},`;
  }

  // console.log(errorMessage.slice(0, errorMessage.length - 1));
}

function Tool(id, name, costGP, weightLB, category=null) {
  if (arguments.length < 4) {
    printRequiredArgumentsError(arguments);
    return null;
  }

  var tool = {
    'id': id,
    'costGP': costGP,
    'weightLB': weightLB
  };
  tool[NAME] = name;

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

const PACK = {
  'BURGLAR': {
    'VALUE': 'burglar',
    'PATH': PATH.PACKS
  },
  'DIPLOMAT': {
    'VALUE': 'diplomat',
    'PATH': PATH.PACKS
  },
  'DUNGEONEER': {
    'VALUE': 'dungeoneer',
    'PATH': PATH.PACKS
  },
  'ENTERTAINER': {
    'VALUE': 'entertainer',
    'PATH': PATH.PACKS
  },
  'EXPLORER': {
    'VALUE': 'explorer',
    'PATH': PATH.PACKS
  },
  'PRIEST': {
    'VALUE': 'priest',
    'PATH': PATH.PACKS
  },
  'SCHOLAR': {
    'VALUE': 'scholar',
    'PATH': PATH.PACKS
  },
  'ANY': {
    'VALUE': ANY,
    'PATH': PATH.PACKS
  }
};

const GEAR = {
  'MAP': {
    'VALUE': 'map',
    'PATH': PATH.GEAR
  },
  'RANK_INSIGNIA': {
    'VALUE': 'rank_insignia',
    'PATH': PATH.GEAR
  },
  'ENEMY_TROPHY': {
    'VALUE': 'enemy_trophy',
    'PATH': PATH.GEAR
  },
  'BONE_DICE': {
    'VALUE': 'bone_dice',
    'PATH': PATH.GEAR
  },
  'DECK_OF_CARDS': {
    'VALUE': 'deck_of_cards',
    'PATH': PATH.GEAR
  },
  'LUCKY_CHARM': {
    'VALUE': 'lucky_charm',
    'PATH': PATH.GEAR
  },
  'COLLEAGUES_LETTER': {
    'VALUE': 'colleagues_letter',
    'PATH': PATH.GEAR
  },
  'ANIMAL_TROPHY': {
    'VALUE': 'animal_trophy',
    'PATH': PATH.GEAR
  },
  'SCROLL_OF_PEDIGREE': {
    'VALUE': 'scroll_of_pedigree',
    'PATH': PATH.GEAR
  },
  'CASE_SCROLL_FILLED': {
    'VALUE': 'case_scroll_filled',
    'PATH': PATH.GEAR
  },
  'GUILD_LETTER': {
    'VALUE': 'guild_letter',
    'PATH': PATH.GEAR
  },
  'LOVE_LETTER': {
    'VALUE': 'love_letter',
    'PATH': PATH.GEAR
  },
  'LOCK_OF_HAIR': {
    'VALUE': 'lock_of_hair',
    'PATH': PATH.GEAR
  },
  'TRINKET': {
    'VALUE': 'trinket',
    'PATH': PATH.GEAR
  },
  'CLOTHES_COMMON_DARK': {
    'VALUE': 'clothes_common_dark',
    'PATH': PATH.GEAR
  },
  'STOPPERED_BOTTLES_10': {
    'VALUE': 'stoppered_bottles',
    'PATH': PATH.GEAR
  },
  'WEIGHTED_DICE': {
    'VALUE': 'weighted_dice',
    'PATH': PATH.GEAR
  },
  'DECK_OF_MARKED_CARDS': {
    'VALUE': 'deck_of_marked_cards',
    'PATH': PATH.GEAR
  },
  'SIGNET_RING_DUKE': {
    'VALUE': 'signet_ring_duke',
    'PATH': PATH.GEAR
  },
  'PRAYER_BOOK': {
    'VALUE': 'prayer_book',
    'PATH': PATH.GEAR
  },
  'PRAYER_WHEEL': {
    'VALUE': 'prayer_wheel',
    'PATH': PATH.GEAR
  },
  'INCENSE_STICK': {
    'VALUE': 'incense_stick',
    'PATH': PATH.GEAR
  },
  'VIAL_ACID': {
    'VALUE': 'vial_acid',
    'PATH': PATH.GEAR
  },
  'FLASK_ALCHEMISTS_FIRE': {
    'VALUE': 'flask_alchemists_fire',
    'PATH': PATH.GEAR
  },
  'VIAL_ANTITOXIN': {
    'VALUE': 'vial_antitoxin',
    'PATH': PATH.GEAR
  },
  'BALL_BEARINGS_BAG_1000': {
    'VALUE': 'ball_bearings_bag_1000',
    'PATH': PATH.GEAR
  },
  'CALTROPS_BAG_20': {
    'VALUE': 'caltrops_bag_20',
    'PATH': PATH.GEAR
  },
  'CHAIN': {
    'VALUE': 'chain',
    'PATH': PATH.GEAR
  },
  'CHALK': {
    'VALUE': 'chalk',
    'PATH': PATH.GEAR
  },
  'FLASK_HOLY_WATER': {
    'VALUE': 'flask_holy_water',
    'PATH': PATH.GEAR
  },
  'JUG': {
    'VALUE': 'jug',
    'PATH': PATH.GEAR
  },
  'LADDER': {
    'VALUE': 'ladder',
    'PATH': PATH.GEAR
  },
  'PARCHMENT': {
    'VALUE': 'parchment',
    'PATH': PATH.GEAR
  },
  'VIAL_POISON': {
    'VALUE': 'vial_poison',
    'PATH': PATH.GEAR
  },
  'POLE': {
    'VALUE': 'pole',
    'PATH': PATH.GEAR
  },
  'ROPE_SILK': {
    'VALUE': 'rope_silk',
    'PATH': PATH.GEAR
  },
  'BOTTLE': {
    'VALUE': 'bottle',
    'PATH': PATH.GEAR
  },
  'ABACUS': {
    'VALUE': 'abacus',
    'PATH': PATH.GEAR
  },
  'ARROWS_20': {
    'VALUE': 'arrows_20',
    'PATH': PATH.GEAR
  },
  'BLOWGUN_NEEDLES_50': {
    'VALUE': 'blowgun_needles_50',
    'PATH': PATH.GEAR
  },
  'CROSSBOW_BOLTS_20': {
    'VALUE': 'crossbow_bolts_20',
    'PATH': PATH.GEAR
  },
  'SLING_BULLETS_20': {
    'VALUE': 'sling_bullets_20',
    'PATH': PATH.GEAR
  },
  'CRYSTAL': {
    'VALUE': 'crystal',
    'PATH': PATH.GEAR
  },
  'ORB': {
    'VALUE': 'orb',
    'PATH': PATH.GEAR
  },
  'ROD': {
    'VALUE': 'rod',
    'PATH': PATH.GEAR
  },
  'STAFF': {
    'VALUE': 'staff',
    'PATH': PATH.GEAR
  },
  'WAND': {
    'VALUE': 'wand',
    'PATH': PATH.GEAR
  },
  'BARREL': {
    'VALUE': 'barrel',
    'PATH': PATH.GEAR
  },
  'BASKET': {
    'VALUE': 'basket',
    'PATH': PATH.GEAR
  },
  'BELL': {
    'VALUE': 'bell',
    'PATH': PATH.GEAR
  },
  'BLANKET': {
    'VALUE': 'blanket',
    'PATH': PATH.GEAR
  },
  'BLOCK_AND_TACKLE': {
    'VALUE': 'block_and_tackle',
    'PATH': PATH.GEAR
  },
  'BOOK': {
    'VALUE': 'book',
    'PATH': PATH.GEAR
  },
  'BOOK_LORE': {
    'VALUE': 'book_lore',
    'PATH': PATH.GEAR
  },
  'BUCKET': {
    'VALUE': 'bucket',
    'PATH': PATH.GEAR
  },
  'CASE_CROSSBOW_BOLT': {
    'VALUE': 'case_crossbow_bolt',
    'PATH': PATH.GEAR
  },
  'CLIMBERS_KIT': {
    'VALUE': 'climbers_kit',
    'PATH': PATH.GEAR
  },
  'CLOTHES_COMMON': {
    'VALUE': 'clothes_common',
    'PATH': PATH.GEAR
  },
  'CLOTHES_TRAVELERS': {
    'VALUE': 'clothes_travelers',
    'PATH': PATH.GEAR
  },
  'COMPONENT_POUCH': {
    'VALUE': 'component_pouch',
    'PATH': PATH.GEAR
  },
  'CROWBAR': {
    'VALUE': 'crowbar',
    'PATH': PATH.GEAR
  },
  'SPRIG_OF_MISTLETOE': {
    'VALUE': 'sprig_of_mistletoe',
    'PATH': PATH.GEAR
  },
  'TOTEM': {
    'VALUE': 'totem',
    'PATH': PATH.GEAR
  },
  'WOODEN_STAFF': {
    'VALUE': 'wooden_staff',
    'PATH': PATH.GEAR
  },
  'YEW_WAND': {
    'VALUE': 'yew_wand',
    'PATH': PATH.GEAR
  },
  'FISHING_TACKLE': {
    'VALUE': 'fishing_tackle',
    'PATH': PATH.GEAR
  },
  'GRAPPLING_HOOK': {
    'VALUE': 'grappling_hook',
    'PATH': PATH.GEAR
  },
  'HAMMER': {
    'VALUE': 'hammer',
    'PATH': PATH.GEAR
  },
  'HAMMER_SLEDGE': {
    'VALUE': 'hammer_sledge',
    'PATH': PATH.GEAR
  },
  'HEALERS_KIT': {
    'VALUE': 'healers_kit',
    'PATH': PATH.GEAR
  },
  'AMULET': {
    'VALUE': 'amulet',
    'PATH': PATH.GEAR
  },
  'EMBLEM': {
    'VALUE': 'emblem',
    'PATH': PATH.GEAR
  },
  'RELIQUARY': {
    'VALUE': 'reliquary',
    'PATH': PATH.GEAR
  },
  'HOURGLASS': {
    'VALUE': 'hourglass',
    'PATH': PATH.GEAR
  },
  'HUNTING_TRAP': {
    'VALUE': 'hunting_trap',
    'PATH': PATH.GEAR
  },
  'LANTERN_BULLSEYE': {
    'VALUE': 'lantern_bullseye',
    'PATH': PATH.GEAR
  },
  'LANTERN_HOODED': {
    'VALUE': 'lantern_hooded',
    'PATH': PATH.GEAR
  },
  'LOCK': {
    'VALUE': 'lock',
    'PATH': PATH.GEAR
  },
  'MAGNIFYING_GLASS': {
    'VALUE': 'magnifying_glass',
    'PATH': PATH.GEAR
  },
  'MANACLES': {
    'VALUE': 'manacles',
    'PATH': PATH.GEAR
  },
  'MIRROR_STEEL': {
    'VALUE': 'mirror_steel',
    'PATH': PATH.GEAR
  },
  'PICK_MINERS': {
    'VALUE': 'pick_miners',
    'PATH': PATH.GEAR
  },
  'PITON': {
    'VALUE': 'piton',
    'PATH': PATH.GEAR
  },
  'POT_IRON': {
    'VALUE': 'pot_iron',
    'PATH': PATH.GEAR
  },
  'POTION_OF_HEALING': {
    'VALUE': 'potion_of_healing',
    'PATH': PATH.GEAR
  },
  'POUCH': {
    'VALUE': 'pouch',
    'PATH': PATH.GEAR
  },
  'QUIVER': {
    'VALUE': 'quiver',
    'PATH': PATH.GEAR
  },
  'RAM_PORTABLE': {
    'VALUE': 'ram_portable',
    'PATH': PATH.GEAR
  },
  'ROBES': {
    'VALUE': 'robes',
    'PATH': PATH.GEAR
  },
  'SACK': {
    'VALUE': 'sack',
    'PATH': PATH.GEAR
  },
  'SCALE_MERCHANTS': {
    'VALUE': 'scale_merchants',
    'PATH': PATH.GEAR
  },
  'SHOVEL': {
    'VALUE': 'shovel',
    'PATH': PATH.GEAR
  },
  'SIGNAL_WHISTLE': {
    'VALUE': 'signal_whistle',
    'PATH': PATH.GEAR
  },
  'SIGNET_RING': {
    'VALUE': 'signet_ring',
    'PATH': PATH.GEAR
  },
  'SPELLBOOK': {
    'VALUE': 'spellbook',
    'PATH': PATH.GEAR
  },
  'SPIKES_IRON_10': {
    'VALUE': 'spikes_iron_10',
    'PATH': PATH.GEAR
  },
  'SPYGLASS': {
    'VALUE': 'spyglass',
    'PATH': PATH.GEAR
  },
  'TENT_TWO_PERSON': {
    'VALUE': 'tent_two_person',
    'PATH': PATH.GEAR
  },
  'WHETSTONE': {
    'VALUE': 'whetstone',
    'PATH': PATH.GEAR
  },
  'BACKPACK': {
    'VALUE': 'backpack',
    'PATH': PATH.GEAR
  },
  'WATERSKIN': {
    'VALUE': 'waterskin',
    'PATH': PATH.GEAR
  },
  'BEDROLL': {
    'VALUE': 'bedroll',
    'PATH': PATH.GEAR
  },
  'MESS_KIT': {
    'VALUE': 'mess_kit',
    'PATH': PATH.GEAR
  },
  'TINDERBOX': {
    'VALUE': 'tinderbox',
    'PATH': PATH.GEAR
  },
  'TORCH': {
    'VALUE': 'torch',
    'PATH': PATH.GEAR
  },
  'RATIONS': {
    'VALUE': 'rations',
    'PATH': PATH.GEAR
  },
  'HEMPEN_ROPE': {
    'VALUE': 'hempen_rope',
    'PATH': PATH.GEAR
  },
  'CHEST': {
    'VALUE': 'chest',
    'PATH': PATH.GEAR
  },
  'CASE_MAP_SCROLL': {
    'VALUE': 'case_map_scroll',
    'PATH': PATH.GEAR
  },
  'CLOTHES_FINE': {
    'VALUE': 'clothes_fine',
    'PATH': PATH.GEAR
  },
  'CLOTHES_COSTUME': {
    'VALUE': 'clothes_costume',
    'PATH': PATH.GEAR
  },
  'INK_BOTTLE': {
    'VALUE': 'ink_bottle',
    'PATH': PATH.GEAR
  },
  'INK_PEN': {
    'VALUE': 'ink_pen',
    'PATH': PATH.GEAR
  },
  'LAMP': {
    'VALUE': 'lamp',
    'PATH': PATH.GEAR
  },
  'FLASK_EMPTY': {
    'VALUE': 'flask_empty',
    'PATH': PATH.GEAR
  },
  'FLASK_OIL': {
    'VALUE': 'flask_oil',
    'PATH': PATH.GEAR
  },
  'PAPER': {
    'VALUE': 'paper',
    'PATH': PATH.GEAR
  },
  'VIAL_EMPTY': {
    'VALUE': 'vial_empty',
    'PATH': PATH.GEAR
  },
  'VIAL_PERFUME': {
    'VALUE': 'vial_perfume',
    'PATH': PATH.GEAR
  },
  'SEALING_WAX': {
    'VALUE': 'sealing_wax',
    'PATH': PATH.GEAR
  },
  'CANDLE': {
    'VALUE': 'candle',
    'PATH': PATH.GEAR
  },
  'SOAP': {
    'VALUE': 'soap',
    'PATH': PATH.GEAR
  },
  'BOX_ALMS': {
    'VALUE': 'box_alms',
    'PATH': PATH.GEAR
  },
  'INCENSE_BLOCK': {
    'VALUE': 'incense_block'
  },
  'CENSER': {
    'VALUE': 'censer',
    'PATH': PATH.GEAR
  },
  'VESTMENTS': {
    'VALUE': 'vestments',
    'PATH': PATH.GEAR
  },
  'BAG_SAND': {
    'VALUE': 'bag_sand',
    'PATH': PATH.GEAR
  },
  'STRING_10FT': {
    'VALUE': 'string_10ft',
    'PATH': PATH.GEAR
  },
  'SMALL_KNIFE': {
    'VALUE': 'small_knife',
    'PATH': PATH.GEAR
  },

  'TYPE': {
    'AMMUNITION': {
      'VALUE': 'ammunition',
      'PATH': PATH.GEAR_TYPES
    },
    'ARCANE_FOCUS': {
      'VALUE': 'arcane_focus',
      'PATH': PATH.GEAR_TYPES
    },
    'DRUIDIC_FOCUS': {
      'VALUE': 'druidic_foucs',
      'PATH': PATH.GEAR_TYPES
    },
    'HOLY_SYMBOL': {
      'VALUE': 'holy_symbol',
      'PATH': PATH.GEAR_TYPES
    },
    'CONTAINER': {
      'VALUE': 'container',
      'PATH': PATH.GEAR_TYPES
    },
    'COMPONENT': {
      'VALUE': 'component',
      'PATH': PATH.GEAR_TYPES
    },
    'CON': {
      'VALUE': 'con',
      'PATH': PATH.GEAR_TYPES
    },
    'FAVOR': {
      'VALUE': 'favor',
      'PATH': PATH.GEAR_TYPES
    }
  }
};

function Pack(id, name, costGP, contentsList) {
  if (arguments.length < 4) {
    printRequiredArgumentsError(arguments);
    return null;
  }

  var pack = {
    'id': id,
    'costGP': costGP
  };
  pack[NAME] = name;

  var contents = {};
  for (content of contentsList) {
    contents[content.item] = {'quantity': content.quantity};
  }

  pack['contents'] = contents;

  return pack;
}

function Content(quantity, item) {
  if (arguments.length < 2) {
    printRequiredArgumentsError(arguments);
    return null;
  }

  return {
    'quantity': quantity,
    'item': item
  };
}

function getPacks() {
  var packs = {};

  packs[PACK.BURGLAR.VALUE] = Pack(
    pushID(PACK.BURGLAR.VALUE),
    'Burglar\'s pack',
    16,
    [
      Content(1, GEAR.BACKPACK.VALUE),
      Content(1, GEAR.CALTROPS_BAG_20.VALUE),
      Content(1, GEAR.STRING_10FT.VALUE),
      Content(1, GEAR.BELL.VALUE),
      Content(5, GEAR.CANDLE.VALUE),
      Content(1, GEAR.CROWBAR.VALUE),
      Content(1, GEAR.HAMMER.VALUE),
      Content(10, GEAR.PITON.VALUE),
      Content(1, GEAR.LANTERN_HOODED.VALUE),
      Content(2, GEAR.FLASK_OIL.VALUE),
      Content(5, GEAR.RATIONS.VALUE),
      Content(1, GEAR.TINDERBOX.VALUE),
      Content(1, GEAR.WATERSKIN.VALUE),
      Content(1, GEAR.HEMPEN_ROPE.VALUE)
    ]
  );

  packs[PACK.DIPLOMAT.VALUE] = Pack(
    pushID(PACK.DIPLOMAT.VALUE),
    'Diplomat\'s pack',
    39,
    [
      Content(1, GEAR.CHEST.VALUE),
      Content(2, GEAR.CASE_MAP_SCROLL.VALUE),
      Content(1, GEAR.CLOTHES_FINE.VALUE),
      Content(1, GEAR.INK_BOTTLE.VALUE),
      Content(1, GEAR.INK_PEN.VALUE),
      Content(1, GEAR.LAMP.VALUE),
      Content(2, GEAR.FLASK_OIL.VALUE),
      Content(5, GEAR.PAPER.VALUE),
      Content(1, GEAR.VIAL_PERFUME.VALUE),
      Content(1, GEAR.SEALING_WAX.VALUE),
      Content(1, GEAR.SOAP.VALUE)
    ]
  );

  packs[PACK.DUNGEONEER.VALUE] = Pack(
    pushID(PACK.DUNGEONEER.VALUE),
    'Dungeoneer\'s pack',
    12,
    [
      Content(1, GEAR.BACKPACK.VALUE),
      Content(1, GEAR.CROWBAR.VALUE),
      Content(1, GEAR.HAMMER.VALUE),
      Content(10, GEAR.PITON.VALUE),
      Content(10, GEAR.TORCH.VALUE),
      Content(1, GEAR.TINDERBOX.VALUE),
      Content(10, GEAR.RATIONS.VALUE),
      Content(1, GEAR.WATERSKIN.VALUE),
      Content(1, GEAR.HEMPEN_ROPE.VALUE)
    ]
  );

  packs[PACK.ENTERTAINER.VALUE] = Pack(
    pushID(PACK.ENTERTAINER.VALUE),
    'Entertainer\'s pack',
    40,
    [
      Content(1, GEAR.BACKPACK.VALUE),
      Content(1, GEAR.BEDROLL.VALUE),
      Content(2, GEAR.CLOTHES_COSTUME.VALUE),
      Content(5, GEAR.CANDLE.VALUE),
      Content(5, GEAR.RATIONS.VALUE),
      Content(1, GEAR.WATERSKIN.VALUE),
      Content(1, TOOL.DISGUISE_KIT.VALUE)
    ]
  );

  packs[PACK.EXPLORER.VALUE] = Pack(
    pushID(PACK.EXPLORER.VALUE),
    'Explorer\'s pack',
    10,
    [
      Content(1, GEAR.BACKPACK.VALUE),
      Content(1, GEAR.BEDROLL.VALUE),
      Content(1, GEAR.MESS_KIT.VALUE),
      Content(1, GEAR.TINDERBOX.VALUE),
      Content(10, GEAR.TORCH.VALUE),
      Content(10, GEAR.RATIONS.VALUE),
      Content(1, GEAR.WATERSKIN.VALUE),
      Content(1, GEAR.HEMPEN_ROPE.VALUE)
    ]
  );

  packs[PACK.PRIEST.VALUE] = Pack(
    pushID(PACK.PRIEST.VALUE),
    'Priest\'s pack',
    19,
    [
      Content(1, GEAR.BACKPACK.VALUE),
      Content(1, GEAR.BLANKET.VALUE),
      Content(10, GEAR.CANDLE.VALUE),
      Content(1, GEAR.TINDERBOX.VALUE),
      Content(1, GEAR.BOX_ALMS.VALUE),
      Content(2, GEAR.INCENSE_BLOCK.VALUE),
      Content(1, GEAR.CENSER.VALUE),
      Content(1, GEAR.VESTMENTS.VALUE),
      Content(2, GEAR.RATIONS.VALUE),
      Content(1, GEAR.WATERSKIN.VALUE)
    ]
  );

  packs[PACK.SCHOLAR.VALUE] = Pack(
    pushID(PACK.SCHOLAR.VALUE),
    'Scholar\'s pack',
    40,
    [
      Content(1, GEAR.BACKPACK.VALUE),
      Content(1, GEAR.BOOK_LORE.VALUE),
      Content(1, GEAR.INK_BOTTLE.VALUE),
      Content(1, GEAR.INK_PEN.VALUE),
      Content(10, GEAR.PARCHMENT.VALUE),
      Content(1, GEAR.BAG_SAND.VALUE),
      Content(1, GEAR.SMALL_KNIFE.VALUE)
    ]
  );

  return packs;
}

function Gear(id, name, costGP, weightLB, container=null, packs=null, type=null) {
  if (arguments.length < 4) {
    printRequiredArgumentsError(arguments);
    return null;
  }

  var gear = {
    'id': id,
    'costGP': costGP,
    'weightLB': weightLB
  };
  gear[NAME] = name;

  if (container !== null) {
    for (key of Object.keys(container)) {
      gear[key] = container[key];
    }
  }

  if (packs !== null) {
    gear['packs'] = packs;
  }

  if (type !== null) {
    gear['type'] = type;
  }

  return gear;
}

function PackList(list) {
  if (arguments.length < 1) {
    printRequiredArgumentsError(arguments);
    return null;
  }

  var packs = {};

  for (l of list) {
    packs[l] = PATH.PACKS;
  }

  return packs;
}

// UNIT does not use VALUE or PATH
const UNIT = {
  'VOLUME': {
    'FT3': 'cubic feet',
    'IN3': 'cubic inches',
    'GALLON': 'gallons',
    'PINT': 'pint',
    'OUNCE': 'ounces'
  },
  'WEIGHT': {
    'LB': 'pounds'
  },
  'COUNT': true
};

function Container(volume, volumeUnit, weightLimit=null, weightUnit=null, isFull=false, contents={}, strapped=null) {
  if (arguments.length < 2) {
    printRequiredArgumentsError(arguments);
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
          printRequiredArgumentsError(arguments);
    return null;
  }

  if (strapped !== null) {
    container['strapped'] = strapped;
  }

  return container;
}

function getGearTypes() {
  var ammunition = {};
  // ammunition[NAME] = 'Ammunition';
  ammunition[GEAR.ARROWS_20.VALUE] = PATH.GEAR;
  ammunition[GEAR.BLOWGUN_NEEDLES_50.VALUE] = PATH.GEAR;
  ammunition[GEAR.CROSSBOW_BOLTS_20.VALUE] = PATH.GEAR;
  ammunition[GEAR.SLING_BULLETS_20.VALUE] = PATH.GEAR;

  var arcaneFocus = {};
  // arcaneFocus[NAME] = 'Arcane focus';
  arcaneFocus[GEAR.CRYSTAL.VALUE] = PATH.GEAR;
  arcaneFocus[GEAR.ORB.VALUE] = PATH.GEAR;
  arcaneFocus[GEAR.ROD.VALUE] = PATH.GEAR;
  arcaneFocus[GEAR.STAFF.VALUE] = PATH.GEAR;
  arcaneFocus[GEAR.WAND.VALUE] = PATH.GEAR;

  var druidicFocus = {};
  // druidicFocus[NAME] = 'Druidic focus';
  druidicFocus[GEAR.SPRIG_OF_MISTLETOE.VALUE] = PATH.GEAR;
  druidicFocus[GEAR.TOTEM.VALUE] = PATH.GEAR;
  druidicFocus[GEAR.WOODEN_STAFF.VALUE] = PATH.GEAR;
  druidicFocus[GEAR.YEW_WAND.VALUE] = PATH.GEAR;

  var holySymbols = {};
  // holySymbols[NAME] = 'Holy symbol';
  holySymbols[GEAR.AMULET.VALUE] = PATH.GEAR;
  holySymbols[GEAR.EMBLEM.VALUE] = PATH.GEAR;
  holySymbols[GEAR.RELIQUARY.VALUE] = PATH.GEAR;

  var containers = {};
  // containers[NAME] = 'Container';
  containers[GEAR.BACKPACK.VALUE] = PATH.GEAR;
  containers[GEAR.BARREL.VALUE] = PATH.GEAR;
  containers[GEAR.BASKET.VALUE] = PATH.GEAR;
  containers[GEAR.BOTTLE.VALUE] = PATH.GEAR;
  containers[GEAR.BUCKET.VALUE] = PATH.GEAR;
  containers[GEAR.CHEST.VALUE] = PATH.GEAR;
  containers[GEAR.FLASK_EMPTY.VALUE] = PATH.GEAR;
  containers[GEAR.FLASK_OIL.VALUE] = PATH.GEAR;
  containers[GEAR.FLASK_HOLY_WATER.VALUE] = PATH.GEAR;
  containers[GEAR.FLASK_ALCHEMISTS_FIRE.VALUE] = PATH.GEAR;
  containers[GEAR.JUG.VALUE] = PATH.GEAR;
  containers[GEAR.POT_IRON.VALUE] = PATH.GEAR;
  containers[GEAR.POUCH.VALUE] = PATH.GEAR;
  containers[GEAR.SACK.VALUE] = PATH.GEAR;
  containers[GEAR.VIAL_EMPTY.VALUE] = PATH.GEAR;
  containers[GEAR.VIAL_ACID.VALUE] = PATH.GEAR;
  containers[GEAR.VIAL_POISON.VALUE] = PATH.GEAR;
  containers[GEAR.VIAL_PERFUME.VALUE] = PATH.GEAR;
  containers[GEAR.VIAL_ANTITOXIN.VALUE] = PATH.GEAR;
  containers[GEAR.WATERSKIN.VALUE] = PATH.GEAR;

  var cons = {};
  // cons[NAME] = 'Con';
  cons[GEAR.STOPPERED_BOTTLES_10.VALUE] = PATH.GEAR;
  cons[GEAR.WEIGHTED_DICE.VALUE] = PATH.GEAR;
  cons[GEAR.DECK_OF_MARKED_CARDS.VALUE] = PATH.GEAR;
  cons[GEAR.SIGNET_RING_DUKE.VALUE] = PATH.GEAR;

  var favors = {};
  // favors[NAME] = 'Favor';
  favors[GEAR.LOVE_LETTER.VALUE] = PATH.GEAR;
  favors[GEAR.LOCK_OF_HAIR.VALUE] = PATH.GEAR;
  favors[GEAR.TRINKET.VALUE] = PATH.GEAR;

  var components = {};
  // components[NAME] = 'Components';
  components[GEAR.INCENSE_BLOCK.VALUE] = PATH.GEAR;
  // TODO - Add remaining components

  var gearTypes = {};
  gearTypes[GEAR.TYPE.AMMUNITION.VALUE] = ammunition;
  gearTypes[GEAR.TYPE.ARCANE_FOCUS.VALUE] = arcaneFocus;
  gearTypes[GEAR.TYPE.DRUIDIC_FOCUS.VALUE] = druidicFocus;
  gearTypes[GEAR.TYPE.HOLY_SYMBOL.VALUE] = holySymbols;
  gearTypes[GEAR.TYPE.CONTAINER.VALUE] = containers;
  gearTypes[GEAR.TYPE.CON.VALUE] = cons;
  gearTypes[GEAR.TYPE.FAVOR.VALUE] = favors;
  gearTypes[GEAR.TYPE.COMPONENT.VALUE] = components;

  return gearTypes;
}

function getGear() {
  var gear = {};

  gear[GEAR.MAP.VALUE] = Gear(
    pushID(GEAR.MAP.VALUE),
    'Map',
    0,
    0
  );

  gear[GEAR.RANK_INSIGNIA.VALUE] = Gear(
    pushID(GEAR.RANK_INSIGNIA.VALUE),
    'Insignia of rank',
    0,
    0
  );

  gear[GEAR.ENEMY_TROPHY.VALUE] = Gear(
    pushID(GEAR.ENEMY_TROPHY.VALUE),
    'Trophy taken from fallen enemy',
    0,
    0
  );

  gear[GEAR.BONE_DICE.VALUE] = Gear(
    pushID(GEAR.BONE_DICE.VALUE),
    'A set of bone dice',
    0,
    0
  );

  gear[GEAR.DECK_OF_CARDS.VALUE] = Gear(
    pushID(GEAR.DECK_OF_CARDS.VALUE),
    'Deck of cards',
    0,
    0
  );

  gear[GEAR.LUCKY_CHARM.VALUE] = Gear(
    pushID(GEAR.LUCKY_CHARM.VALUE),
    'Lucky charm',
    0,
    0
  );

  gear[GEAR.COLLEAGUES_LETTER.VALUE] = Gear(
    pushID(GEAR.COLLEAGUES_LETTER.VALUE),
    'A letter from a dead colleague',
    0,
    0
  );

  gear[GEAR.ANIMAL_TROPHY.VALUE] = Gear(
    pushID(GEAR.ANIMAL_TROPHY.VALUE),
    'Animal trophy',
    0,
    0
  );

  gear[GEAR.SCROLL_OF_PEDIGREE.VALUE] = Gear(
    pushID(GEAR.SCROLL_OF_PEDIGREE.VALUE),
    'Scroll of pedigree',
    0,
    0
  );

  gear[GEAR.CASE_SCROLL_FILLED.VALUE] = Gear(
    pushID(GEAR.CASE_SCROLL_FILLED.VALUE),
    'Case, scroll: filled with notes',
    0,
    0,
    Container(1, UNIT.COUNT, null, null, true, {'notes': true}),
    null,
    GEAR.TYPE.CONTAINER
  );

  gear[GEAR.GUILD_LETTER.VALUE] = Gear(
    pushID(GEAR.GUILD_LETTER.VALUE),
    'Letter of introduction from your guild',
    0,
    0
  );

  gear[GEAR.LOVE_LETTER.VALUE] = Gear(
    pushID(GEAR.LOVE_LETTER.VALUE),
    'Love letter',
    0,
    0
  );

  gear[GEAR.LOCK_OF_HAIR.VALUE] = Gear(
    pushID(GEAR.LOCK_OF_HAIR.VALUE),
    'Lock of hair',
    0,
    0
  );

  gear[GEAR.TRINKET.VALUE] = Gear(
    pushID(GEAR.TRINKET.VALUE),
    'Trinket',
    0,
    0
  );

  gear[GEAR.CLOTHES_COMMON_DARK.VALUE] = Gear(
    pushID(GEAR.CLOTHES_COMMON_DARK.VALUE),
    'Clothes, common: dark including a hood',
    0,
    0
  );

  gear[GEAR.STOPPERED_BOTTLES_10.VALUE] = Gear(
    pushID(GEAR.STOPPERED_BOTTLES_10.VALUE),
    '10 stoppered bottles filled with colored liquid',
    0,
    0
  );

  gear[GEAR.WEIGHTED_DICE.VALUE] = Gear(
    pushID(GEAR.WEIGHTED_DICE.VALUE),
    'Weighted dice',
    0,
    0
  );

  gear[GEAR.DECK_OF_MARKED_CARDS.VALUE] = Gear(
    pushID(GEAR.DECK_OF_MARKED_CARDS.VALUE),
    'Deck of marked cards',
    0,
    0
  );

  gear[GEAR.SIGNET_RING_DUKE.VALUE] = Gear(
    pushID(GEAR.SIGNET_RING_DUKE.VALUE),
    'Signet ring of imaginary duke',
    0,
    0
  );

  gear[GEAR.PRAYER_BOOK.VALUE] = Gear(
    pushID(GEAR.PRAYER_BOOK.VALUE),
    'Prayer book',
    0,
    0
  );

  gear[GEAR.PRAYER_WHEEL.VALUE] = Gear(
    pushID(GEAR.PRAYER_WHEEL.VALUE),
    'Prayer wheel',
    0,
    0
  );

  gear[GEAR.INCENSE_STICK.VALUE] = Gear(
    pushID(GEAR.INCENSE_STICK.VALUE),
    'Stick of incense',
    0,
    0
  );

  gear[GEAR.STRING_10FT.VALUE] = Gear(
    pushID(GEAR.STRING_10FT.VALUE),
    'String (10-feet)',
    0,
    0,
    null,
    PackList([
      PACK.BURGLAR.VALUE
    ])
  );

  gear[GEAR.BOX_ALMS.VALUE] = Gear(
    pushID(GEAR.BOX_ALMS.VALUE),
    'Alms box',
    0,
    0,
    null,
    PackList([
      PACK.PRIEST.VALUE
    ]),
    GEAR.TYPE.CONTAINER
  );

  gear[GEAR.INCENSE_BLOCK.VALUE] = Gear(
    pushID(GEAR.INCENSE_BLOCK.VALUE),
    'Block of incense',
    0,
    0,
    null,
    PackList([
      PACK.PRIEST.VALUE
    ]),
    GEAR.TYPE.COMPONENT
  );

  gear[GEAR.CENSER.VALUE] = Gear(
    pushID(GEAR.CENSER.VALUE),
    'Censer',
    0,
    0,
    null,
    PackList([
      PACK.PRIEST.VALUE
    ])
  );

  gear[GEAR.VESTMENTS.VALUE] = Gear(
    pushID(GEAR.VESTMENTS.VALUE),
    'Vestments',
    0,
    0,
    null,
    PackList([
      PACK.PRIEST.VALUE
    ])
  );

  gear[GEAR.BAG_SAND.VALUE] = Gear(
    pushID(GEAR.BAG_SAND.VALUE),
    'Bag of sand',
    0,
    0,
    null,
    PackList([
      PACK.PRIEST.SCHOLAR
    ])
  );

  gear[GEAR.SMALL_KNIFE.VALUE] = Gear(
    pushID(GEAR.SMALL_KNIFE.VALUE),
    'Small knife',
    0,
    0,
    null,
    PackList([
      PACK.PRIEST.SCHOLAR
    ])
  );

  gear[GEAR.ABACUS.VALUE] = Gear(
    pushID(GEAR.ABACUS.VALUE),
    'Abacus',
    2,
    2
  );

  gear[GEAR.VIAL_ACID.VALUE] = Gear(
    pushID(GEAR.VIAL_ACID.VALUE),
    'Acid (vial)',
    25,
    1,
    Container(4, UNIT.VOLUME.OUNCE, null, null, true, {'acid': true}),
    null,
    GEAR.TYPE.CONTAINER
  );

  gear[GEAR.FLASK_ALCHEMISTS_FIRE.VALUE] = Gear(
    pushID(GEAR.FLASK_ALCHEMISTS_FIRE.VALUE),
    'Alchemist\'s fire (flask)',
    50,
    1,
    Container(1, UNIT.VOLUME.PINT, null, null, true, {'alchemist\'s fire': true}),
    null,
    GEAR.TYPE.CONTAINER
  );

  gear[GEAR.ARROWS_20.VALUE] = Gear(
    pushID(GEAR.ARROWS_20.VALUE),
    'Arrows (20)',
    1,
    1,
    null,
    null,
    GEAR.TYPE.AMMUNITION
  );

  gear[GEAR.BLOWGUN_NEEDLES_50.VALUE] = Gear(
    pushID(GEAR.BLOWGUN_NEEDLES_50.VALUE),
    'Blowgun needles (50)',
    1,
    1,
    null,
    null,
    GEAR.TYPE.AMMUNITION
  );

  gear[GEAR.CROSSBOW_BOLTS_20.VALUE] = Gear(
    pushID(GEAR.CROSSBOW_BOLTS_20.VALUE),
    'Crossbow bolts (20)',
    1,
    1.5,
    null,
    null,
    GEAR.TYPE.AMMUNITION
  );

  gear[GEAR.SLING_BULLETS_20.VALUE] = Gear(
    pushID(GEAR.SLING_BULLETS_20.VALUE),
    'Sling bullets (20)',
    400,
    1.5,
    null,
    null,
    GEAR.TYPE.AMMUNITION
  );

  gear[GEAR.VIAL_ANTITOXIN.VALUE] = Gear(
    pushID(GEAR.VIAL_ANTITOXIN.VALUE),
    'Antitoxin (vial)',
    50,
    0,
    Container(4, UNIT.VOLUME.OUNCE, null, null, true, {'antitoxin': true}),
    null,
    GEAR.TYPE.CONTAINER
  );

  gear[GEAR.CRYSTAL.VALUE] = Gear(
    pushID(GEAR.CRYSTAL.VALUE),
    'Crystal',
    10,
    1,
    null,
    null,
    GEAR.TYPE.ARCANE_FOCUS
  );

  gear[GEAR.ORB.VALUE] = Gear(
    pushID(GEAR.ORB.VALUE),
    'Orb',
    20,
    3,
    null,
    null,
    GEAR.TYPE.ARCANE_FOCUS
  );

  gear[GEAR.ROD.VALUE] = Gear(
    pushID(GEAR.ROD.VALUE),
    'Rod',
    10,
    2,
    null,
    null,
    GEAR.TYPE.ARCANE_FOCUS
  );

  gear[GEAR.STAFF.VALUE] = Gear(
    pushID(GEAR.STAFF.VALUE),
    'Staff',
    5,
    4,
    null,
    null,
    GEAR.TYPE.ARCANE_FOCUS
  );

  gear[GEAR.WAND.VALUE] = Gear(
    pushID(GEAR.WAND.VALUE),
    'Wand',
    10,
    1,
    null,
    null,
    GEAR.TYPE.ARCANE_FOCUS
  );

  gear[GEAR.BALL_BEARINGS_BAG_1000.VALUE] = Gear(
    pushID(GEAR.BALL_BEARINGS_BAG_1000.VALUE),
    'Ball bearings (bag of 1,000)',
    1,
    2,
    Container(5, UNIT.VOLUME.IN3, 2, UNIT.WEIGHT.LB, true, {'ball bearings': true}),
    PackList([
      PACK.BURGLAR.VALUE
    ]),
    GEAR.TYPE.CONTAINER
  );

  gear[GEAR.BARREL.VALUE] = Gear(
    pushID(GEAR.BARREL.VALUE),
    'Barrel',
    2,
    70,
    Container(40, UNIT.VOLUME.GALLON),
    null,
    GEAR.TYPE.CONTAINER
  );

  gear[GEAR.BASKET.VALUE] = Gear(
    pushID(GEAR.BASKET.VALUE),
    'Basket',
    40,
    2,
    Container(2, UNIT.VOLUME.FT3, 40, UNIT.WEIGHT.LB),
    null,
    GEAR.TYPE.CONTAINER
  );

  gear[GEAR.BELL.VALUE] = Gear(
    pushID(GEAR.BELL.VALUE),
    'Bell',
    1,
    0,
    null,
    PackList([
      PACK.BURGLAR.VALUE
    ])
  );

  gear[GEAR.BLANKET.VALUE] = Gear(
    pushID(GEAR.BLANKET.VALUE),
    'Blanket',
    50,
    3,
    null,
    PackList([
      PACK.PRIEST.VALUE
    ])
  );

  gear[GEAR.BLOCK_AND_TACKLE.VALUE] = Gear(
    pushID(GEAR.BLOCK_AND_TACKLE.VALUE),
    'Block and tackle',
    1,
    5
  );

  gear[GEAR.BOOK.VALUE] = Gear(
    pushID(GEAR.BOOK.VALUE),
    'Book',
    25,
    5
  );

  gear[GEAR.BOOK_LORE.VALUE] = Gear(
    pushID(GEAR.BOOK_LORE.VALUE),
    'Book of lore',
    25,
    5,
    null,
    PackList([
      PACK.SCHOLAR.VALUE
    ])
  );

  gear[GEAR.BUCKET.VALUE] = Gear(
    pushID(GEAR.BUCKET.VALUE),
    'Bucket',
    500,
    2,
    Container(3, UNIT.VOLUME.GALLON),
    null,
    GEAR.TYPE.CONTAINER
  );

  gear[GEAR.CALTROPS_BAG_20.VALUE] = Gear(
    pushID(GEAR.CALTROPS_BAG_20.VALUE),
    'Caltrops (bag of 20)',
    1,
    2
  );

  gear[GEAR.CASE_CROSSBOW_BOLT.VALUE] = Gear(
    pushID(GEAR.CASE_CROSSBOW_BOLT.VALUE),
    'Case, crossbow bolt',
    1,
    1,
    Container(20, UNIT.COUNT, false, {'bolts': 0}),
    null,
    GEAR.TYPE.CONTAINER
  );

  gear[GEAR.CHAIN.VALUE] = Gear(
    pushID(GEAR.CHAIN.VALUE),
    'Chain (10 feet)',
    5,
    10
  );

  gear[GEAR.CHALK.VALUE] = Gear(
    pushID(GEAR.CHALK.VALUE),
    'Chalk (1 piece)',
    100,
    0
  );

  gear[GEAR.CLIMBERS_KIT.VALUE] = Gear(
    pushID(GEAR.CLIMBERS_KIT.VALUE),
    'Climber\'s kit',
    25,
    12
  );

  gear[GEAR.CLOTHES_COMMON.VALUE] = Gear(
    pushID(GEAR.CLOTHES_COMMON.VALUE),
    'Clothes, common',
    50,
    3
  );

  gear[GEAR.CLOTHES_TRAVELERS.VALUE] = Gear(
    pushID(GEAR.CLOTHES_TRAVELERS.VALUE),
    'Clothes, traveler\'s',
    2,
    4
  );

  gear[GEAR.COMPONENT_POUCH.VALUE] = Gear(
    pushID(GEAR.COMPONENT_POUCH.VALUE),
    'Component pouch',
    25,
    2
  );

  gear[GEAR.CROWBAR.VALUE] = Gear(
    pushID(GEAR.CROWBAR.VALUE),
    'Crowbar',
    2,
    5,
    null,
    PackList([
      PACK.BURGLAR.VALUE,
      PACK.DUNGEONEER.VALUE
    ])
  );

  gear[GEAR.SPRIG_OF_MISTLETOE.VALUE] = Gear(
    pushID(GEAR.SPRIG_OF_MISTLETOE.VALUE),
    'Sprig of mistletoe',
    1,
    0
  );

  gear[GEAR.TOTEM.VALUE] = Gear(
    pushID(GEAR.TOTEM.VALUE),
    'Totem',
    1,
    0
  );

  gear[GEAR.WOODEN_STAFF.VALUE] = Gear(
    pushID(GEAR.WOODEN_STAFF.VALUE),
    'Wooden staff',
    5,
    4
  );

  gear[GEAR.YEW_WAND.VALUE] = Gear(
    pushID(GEAR.YEW_WAND.VALUE),
    'Yew wand',
    10,
    1
  );

  gear[GEAR.FISHING_TACKLE.VALUE] = Gear(
    pushID(GEAR.FISHING_TACKLE.VALUE),
    'Fishing tackle',
    1,
    4
  );

  gear[GEAR.GRAPPLING_HOOK.VALUE] = Gear(
    pushID(GEAR.GRAPPLING_HOOK.VALUE),
    'Grappling hook',
    2,
    4
  );

  gear[GEAR.HAMMER.VALUE] = Gear(
    pushID(GEAR.HAMMER.VALUE),
    'Hammer',
    1,
    3,
    null,
    PackList([
      PACK.BURGLAR.VALUE,
      PACK.DUNGEONEER.VALUE
    ])
  );

  gear[GEAR.HAMMER_SLEDGE.VALUE] = Gear(
    pushID(GEAR.HAMMER_SLEDGE.VALUE),
    'Hammer, sledge',
    2,
    10
  );

  gear[GEAR.HEALERS_KIT.VALUE] = Gear(
    pushID(GEAR.HEALERS_KIT.VALUE),
    'Healer\'s kit',
    5,
    3
  );

  gear[GEAR.AMULET.VALUE] = Gear(
    pushID(GEAR.AMULET.VALUE),
    'Amulet',
    5,
    1
  );

  gear[GEAR.EMBLEM.VALUE] = Gear(
    pushID(GEAR.EMBLEM.VALUE),
    'Emblem',
    5,
    0
  );

  gear[GEAR.RELIQUARY.VALUE] = Gear(
    pushID(GEAR.RELIQUARY.VALUE),
    'Reliquary',
    5,
    2
  );

  gear[GEAR.FLASK_HOLY_WATER.VALUE] = Gear(
    pushID(GEAR.FLASK_HOLY_WATER.VALUE),
    'Holy water (flask)',
    25,
    1,
    Container(1, UNIT.VOLUME.PINT, null, null, true, {'holy water': true}),
    null,
    GEAR.TYPE.CONTAINER
  );

  gear[GEAR.HOURGLASS.VALUE] = Gear(
    pushID(GEAR.HOURGLASS.VALUE),
    'Hourglass',
    25,
    1
  );

  gear[GEAR.HUNTING_TRAP.VALUE] = Gear(
    pushID(GEAR.HUNTING_TRAP.VALUE),
    'Hunting trap',
    5,
    25
  );

  gear[GEAR.JUG.VALUE] = Gear(
    pushID(GEAR.JUG.VALUE),
    'Jug or pitcher',
    200,
    4,
    Container(1, UNIT.VOLUME.GALLON),
    null,
    GEAR.TYPE.CONTAINER
  );

  gear[GEAR.LADDER.VALUE] = Gear(
    pushID(GEAR.LADDER.VALUE),
    'Ladder (10-foot)',
    10,
    25
  );

  gear[GEAR.LANTERN_BULLSEYE.VALUE] = Gear(
    pushID(GEAR.LANTERN_BULLSEYE.VALUE),
    'Lantern, bullseye',
    10,
    2
  );

  gear[GEAR.LANTERN_HOODED.VALUE] = Gear(
    pushID(GEAR.LANTERN_HOODED.VALUE),
    'Lantern, hooded',
    5,
    2,
    null,
    PackList([
      PACK.BURGLAR.VALUE
    ])
  );

  gear[GEAR.LOCK.VALUE] = Gear(
    pushID(GEAR.LOCK.VALUE),
    'Lock',
    10,
    1
  );

  gear[GEAR.MAGNIFYING_GLASS.VALUE] = Gear(
    pushID(GEAR.MAGNIFYING_GLASS.VALUE),
    'Magnifying glass',
    100,
    0
  );

  gear[GEAR.MANACLES.VALUE] = Gear(
    pushID(GEAR.MANACLES.VALUE),
    'Manacles',
    2,
    6
  );

  gear[GEAR.MIRROR_STEEL.VALUE] = Gear(
    pushID(GEAR.MIRROR_STEEL.VALUE),
    'Mirror, steel',
    5,
    0.5
  );

  gear[GEAR.PARCHMENT.VALUE] = Gear(
    pushID(GEAR.PARCHMENT.VALUE),
    'Parchment (one sheet)',
    10,
    0,
    null,
    PackList([
      PACK.SCHOLAR.VALUE
    ])
  );

  gear[GEAR.PICK_MINERS.VALUE] = Gear(
    pushID(GEAR.PICK_MINERS.VALUE),
    'Pick, miner\'s',
    2,
    10
  );

  gear[GEAR.PITON.VALUE] = Gear(
    pushID(GEAR.PITON.VALUE),
    'Piton',
    500,
    0.25,
    null,
    PackList([
      PACK.BURGLAR.VALUE,
      PACK.DUNGEONEER.VALUE
    ])
  );

  gear[GEAR.VIAL_POISON.VALUE] = Gear(
    pushID(GEAR.VIAL_POISON.VALUE),
    'Poison, basic (vial)',
    100,
    0,
    Container(4, UNIT.VOLUME.OUNCE, null, null, true, {'poison': true}),
    null,
    GEAR.TYPE.CONTAINER
  );

  gear[GEAR.POLE.VALUE] = Gear(
    pushID(GEAR.POLE.VALUE),
    'Pole (10-foot)',
    500,
    7
  );

  gear[GEAR.POT_IRON.VALUE] = Gear(
    pushID(GEAR.POT_IRON.VALUE),
    'Pot, iron',
    2,
    10,
    Container(1, UNIT.VOLUME.GALLON),
    null,
    GEAR.TYPE.CONTAINER
  );

  gear[GEAR.POUCH.VALUE] = Gear(
    pushID(GEAR.POUCH.VALUE),
    'Pouch',
    50,
    1,
    Container(0.2, UNIT.VOLUME.FT3, 6, UNIT.WEIGHT.LB),
    null,
    GEAR.TYPE.CONTAINER
  );

  gear[GEAR.QUIVER.VALUE] = Gear(
    pushID(GEAR.QUIVER.VALUE),
    'Quiver',
    1,
    1,
    Container(20, UNIT.COUNT, false, {'arrows': 0}),
    null,
    GEAR.TYPE.CONTAINER
  );

  gear[GEAR.RAM_PORTABLE.VALUE] = Gear(
    pushID(GEAR.RAM_PORTABLE.VALUE),
    'Ram, portable',
    4,
    35
  );

  gear[GEAR.ROBES.VALUE] = Gear(
    pushID(GEAR.VALUE),
    'Robes',
    1,
    4
  );

  gear[GEAR.ROPE_SILK.VALUE] = Gear(
    pushID(GEAR.VALUE),
    'Rope, silk (50 feet)',
    10,
    5
  );

  gear[GEAR.SACK.VALUE] = Gear(
    pushID(GEAR.SACK.VALUE),
    'Sack',
    100,
    0.5,
    Container(1, UNIT.VOLUME.FT3, 30, UNIT.WEIGHT.LB),
    null,
    GEAR.TYPE.CONTAINER
  );

  gear[GEAR.SCALE_MERCHANTS.VALUE] = Gear(
    pushID(GEAR.SCALE_MERCHANTS.VALUE),
    'Scale, merchant\'s',
    5,
    3
  );

  gear[GEAR.SHOVEL.VALUE] = Gear(
    pushID(GEAR.SHOVEL.VALUE),
    'Shovel',
    2,
    5
  );

  gear[GEAR.SIGNAL_WHISTLE.VALUE] = Gear(
    pushID(GEAR.SIGNAL_WHISTLE.VALUE),
    'Signal whistle',
    500,
    0
  );

  gear[GEAR.SIGNET_RING.VALUE] = Gear(
    pushID(GEAR.SIGNET_RING.VALUE),
    'Signet ring',
    5,
    0
  );

  gear[GEAR.SPELLBOOK.VALUE] = Gear(
    pushID(GEAR.SPELLBOOK.VALUE),
    'Spellbook',
    50,
    3
  );

  gear[GEAR.SPIKES_IRON_10.VALUE] = Gear(
    pushID(GEAR.SPIKES_IRON_10.VALUE),
    'Spikes, iron (10)',
    1,
    5
  );

  gear[GEAR.SPYGLASS.VALUE] = Gear(
    pushID(GEAR.SPYGLASS.VALUE),
    'Spyglass',
    1000,
    1
  );

  gear[GEAR.TENT_TWO_PERSON.VALUE] = Gear(
    pushID(GEAR.TENT_TWO_PERSON.VALUE),
    'Tent, two-person',
    2,
    20
  );

  gear[GEAR.WHETSTONE.VALUE] = Gear(
    pushID(GEAR.WHETSTONE.VALUE),
    'Whetstone',
    100,
    1
  );

  gear[GEAR.BOTTLE.VALUE] = Gear(
    pushID(GEAR.BOTTLE.VALUE),
    'Bottle, empty',
    2,
    2,
    Container(1.5, UNIT.VOLUME.PINT),
    null,
    GEAR.TYPE.CONTAINER
  );

  gear[GEAR.POTION_OF_HEALING.VALUE] = Gear(
    pushID(GEAR.POTION_OF_HEALING.VALUE),
    'Potion of healing',
    50,
    2
  );

  gear[GEAR.BACKPACK.VALUE] = Gear(
    pushID(GEAR.BACKPACK.VALUE),
    'Backpack',
    2,
    5,
    Container(1, UNIT.VOLUME.FT3, 30, UNIT.WEIGHT.LB, {}, {}),
    PackList([
      PACK.BURGLAR.VALUE,
      PACK.DUNGEONEER.VALUE,
      PACK.ENTERTAINER.VALUE,
      PACK.EXPLORER.VALUE,
      PACK.PRIEST.VALUE,
      PACK.SCHOLAR.VALUE
    ]),
    GEAR.TYPE.CONTAINER
  );

  gear[GEAR.WATERSKIN.VALUE] = Gear(
    pushID(GEAR.WATERSKIN.VALUE),
    'Waterskin',
    0.2,
    5,
    Container(4, UNIT.VOLUME.PINT),
    PackList([
      PACK.BURGLAR.VALUE,
      PACK.DUNGEONEER.VALUE,
      PACK.ENTERTAINER.VALUE,
      PACK.EXPLORER.VALUE,
      PACK.PRIEST.VALUE
    ]),
    GEAR.TYPE.CONTAINER
  );

  gear[GEAR.BEDROLL.VALUE] = Gear(
    pushID(GEAR.BEDROLL.VALUE),
    'Bedroll',
    1,
    7,
    PackList([
      PACK.ENTERTAINER.VALUE,
      PACK.EXPLORER.VALUE
    ])
  );

  gear[GEAR.MESS_KIT.VALUE] = Gear(
    pushID(GEAR.MESS_KIT.VALUE),
    'Mess kit',
    0.2,
    1,
    PackList([
      PACK.EXPLORER.VALUE
    ])
  );

  gear[GEAR.TINDERBOX.VALUE] = Gear(
    pushID(GEAR.TINDERBOX.VALUE),
    'Tinderbox',
    0.5,
    1,
    PackList([
      PACK.BURGLAR.VALUE,
      PACK.DUNGEONEER.VALUE,
      PACK.EXPLORER.VALUE,
      PACK.PRIEST.VALUE
    ])
  );

  gear[GEAR.TORCH.VALUE] = Gear(
    pushID(GEAR.TORCH.VALUE),
    'Torch',
    0.01,
    1,
    PackList([
      PACK.DUNGEONEER.VALUE,
      PACK.EXPLORER.VALUE
    ])
  );

  gear[GEAR.RATIONS.VALUE] = Gear(
    pushID(GEAR.RATIONS.VALUE),
    'Rations (1 day)',
    0.5,
    2,
    PackList([
      PACK.BURGLAR.VALUE,
      PACK.DUNGEONEER.VALUE,
      PACK.ENTERTAINER.VALUE,
      PACK.EXPLORER.VALUE,
      PACK.PRIEST.VALUE
    ])
  );

  gear[GEAR.HEMPEN_ROPE.VALUE] = Gear(
    pushID(GEAR.HEMPEN_ROPE.VALUE),
    'Rope, hempen (50 feet)',
    1,
    10,
    PackList([
      PACK.BURGLAR.VALUE,
      PACK.DUNGEONEER.VALUE,
      PACK.EXPLORER.VALUE
    ])
  );

  gear[GEAR.CHEST.VALUE] = Gear(
    pushID(GEAR.CHEST.VALUE),
    'Chest',
    5,
    25,
    Container(12, UNIT.VOLUME.FT3, 300, UNIT.WEIGHT.LB),
    PackList([
      PACK.DIPLOMAT.VALUE
    ]),
    GEAR.TYPE.CONTAINER
  );

  gear[GEAR.CASE_MAP_SCROLL.VALUE] = Gear(
    pushID(GEAR.CASE_MAP_SCROLL.VALUE),
    'Case, map or scroll',
    1,
    1,
    Container(1, UNIT.COUNT),
    PackList([
      PACK.DIPLOMAT.VALUE
    ]),
    GEAR.TYPE.CONTAINER
  );

  gear[GEAR.CLOTHES_FINE.VALUE] = Gear(
    pushID(GEAR.CLOTHES_FINE.VALUE),
    'Clothes, fine',
    15,
    6,
    PackList([
      PACK.DIPLOMAT.VALUE
    ])
  );

  gear[GEAR.CLOTHES_COSTUME.VALUE] = Gear(
    pushID(GEAR.CLOTHES_COSTUME.VALUE),
    'Clothes, costume',
    5,
    4,
    PackList([
      PACK.ENTERTAINER.VALUE
    ])
  );

  gear[GEAR.INK_BOTTLE.VALUE] = Gear(
    pushID(GEAR.INK_BOTTLE.VALUE),
    'Ink (1 ounce bottle)',
    10,
    0,
    Container(1, UNIT.VOLUME.OUNCE, null, null, true, {'ink': true}),
    PackList([
      PACK.DIPLOMAT.VALUE,
      PACK.SCHOLAR.VALUE
    ]),
    GEAR.TYPE.CONTAINER
  );

  gear[GEAR.INK_PEN.VALUE] = Gear(
    pushID(GEAR.INK_PEN.VALUE),
    'Ink pen',
    0.02,
    0,
    PackList([
      PACK.DIPLOMAT.VALUE,
      PACK.SCHOLAR.VALUE
    ])
  );

  gear[GEAR.LAMP.VALUE] = Gear(
    pushID(GEAR.LAMP.VALUE),
    'Lamp',
    0.5,
    1,
    PackList([
      PACK.DIPLOMAT.VALUE
    ])
  );

  gear[GEAR.FLASK_EMPTY.VALUE] = Gear(
    pushID(GEAR.FLASK_EMPTY.VALUE),
    'Flask or tankard',
    0.02,
    1,
    Container(1.5, UNIT.VOLUME.PINT),
    GEAR.TYPE.CONTAINER
  );

  gear[GEAR.FLASK_OIL.VALUE] = Gear(
    pushID(GEAR.FLASK_OIL.VALUE),
    'Flask of oil',
    0.1,
    1,
    Container(1.5, UNIT.VOLUME.PINT, null, null, true, {'oil': true}),
    PackList([
      PACK.BURGLAR.VALUE,
      PACK.DIPLOMAT.VALUE
    ]),
    GEAR.TYPE.CONTAINER
  );

  gear[GEAR.PAPER.VALUE] = Gear(
    pushID(GEAR.PAPER.VALUE),
    'Paper (one sheet)',
    0.2,
    0,
    PackList([
      PACK.DIPLOMAT.VALUE
    ])
  );

  gear[GEAR.VIAL_EMPTY.VALUE] = Gear(
    pushID(GEAR.VIAL_EMPTY.VALUE),
    'Vial',
    1,
    0,
    Container(4, UNIT.VOLUME.OUNCE),
    GEAR.TYPE.CONTAINER
  );

  gear[GEAR.VIAL_PERFUME.VALUE] = Gear(
    pushID(GEAR.VIAL_PERFUME.VALUE),
    'Vial of perfume',
    5,
    0,
    Container(4, UNIT.VOLUME.OUNCE, null, null, true, {'perfume': true}),
    PackList([
      PACK.DIPLOMAT.VALUE
    ]),
    GEAR.TYPE.CONTAINER
  );

  gear[GEAR.SEALING_WAX.VALUE] = Gear(
    pushID(GEAR.SEALING_WAX.VALUE),
    'Sealing wax',
    0.5,
    0,
    PackList([
      PACK.DIPLOMAT.VALUE
    ])
  );

  gear[GEAR.CANDLE.VALUE] = Gear(
    pushID(GEAR.CANDLE.VALUE),
    'Candle',
    0.01,
    0,
    PackList([
      PACK.BURGLAR.VALUE,
      PACK.ENTERTAINER.VALUE,
      PACK.PRIEST.VALUE
    ])
  );

  gear[GEAR.SOAP.VALUE] = Gear(
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

/**********
* VEHICLES
**********/

const VEHICLE = {
  'TYPE': {
    'LAND': {
      'VALUE': 'land',
      'PATH': PATH.VEHICLE_TYPES
    },
    'WATER': {
      'VALUE': 'water',
      'PATH': PATH.VEHICLE_TYPES
    }
  }
};

function getVehicleTypes() {
  var land = {};
  land[NAME] = 'Land vehicles';

  var water = {};
  water[NAME] = 'Water vehicles';

  var vehicle_types = {};
  vehicle_types[VEHICLE.TYPE.LAND.VALUE] = land;
  vehicle_types[VEHICLE.TYPE.WATER.VALUE] = water;

  return vehicle_types;
}

/******
* PETS
******/

const PET = {
  'MOUSE': {
    'VALUE': 'mouse',
    'PATH': PATH.PETS
  }
}

class Pet {
  constructor(name) {
    this.id = pushID(name);
    this.name = name;
  }
}

function getPets() {
  var pets = {};

  pets[PET.MOUSE.VALUE] = new Pet(
    'Mouse'
  );

  return pets;
}

/**********
* TRINKETS
**********/

const TRINKET = {
  'ANY': {
    'VALUE': ANY,
    'PATH': PATH.TRINKETS
  }
}

class Trinket {
  constructor(name) {
    this.id = pushID(name);
    this.name = name;
  }
}

function getTrinkets() {
  var trinkets = {};

  trinkets[TRINKET.ANY.VALUE] = new Trinket(
    'Any trinket'
  );

  return trinkets;
}

/********
* TRAITS
********/

const TRAIT = {
  'DARKVISION': {
    'VALUE': 'darkvision',
    'PATH': PATH.TRAIT
  },
  'DWARVEN_RESILIENCE': {
    'VALUE': 'dwarven_resilience',
    'PATH': PATH.TRAIT
  },
  'DWARVEN_COMBAT_TRAINING': {
    'VALUE': 'dwarven_combat_training',
    'PATH': PATH.TRAIT
  },
  'STONECUNNING': {
    'VALUE': 'stonecunning',
    'PATH': PATH.TRAIT
  },
  'DWARVEN_TOUGHNESS': {
    'VALUE': 'dwarven_toughness',
    'PATH': PATH.TRAIT
  },
  'DWARVEN_ARMOR_TRAINING': {
    'VALUE': 'dwarven_armor_training',
    'PATH': PATH.TRAIT
  },
  'KEEN_SENSES': {
    'VALUE': 'keen_senses',
    'PATH': PATH.TRAIT
  },
  'FEY_ANCESTRY': {
    'VALUE': 'fey_ancestry',
    'PATH': PATH.TRAIT
  },
  'TRANCE': {
    'VALUE': 'trance',
    'PATH': PATH.TRAIT
  },
  'ELF_WEAPON_TRAINING': {
    'VALUE': 'elf_weapon_training',
    'PATH': PATH.TRAIT
  },
  'CANTRIP': {
    'VALUE': 'cantrip',
    'PATH': PATH.TRAIT
  },
  'EXTRA_LANGUAGE': {
    'VALUE': 'extra_language',
    'PATH': PATH.TRAIT
  },
  'FLEET_OF_FOOT': {
    'VALUE': 'fleet_of_foot',
    'PATH': PATH.TRAIT
  },
  'MASK_OF_THE_WILD': {
    'VALUE': 'mask_of_the_wild',
    'PATH': PATH.TRAIT
  },
  'SUPERIOR_DARKVISION': {
    'VALUE': 'superior_darkvision',
    'PATH': PATH.TRAIT
  },
  'SUNLIGHT_SENSITIVITY': {
    'VALUE': 'sunlight_sensitivity',
    'PATH': PATH.TRAIT
  },
  'DROW_MAGIC': {
    'VALUE': 'drow_magic',
    'PATH': PATH.TRAIT
  },
  'DROW_WEAPON_TRAINING': {
    'VALUE': 'drow_weapon_training',
    'PATH': PATH.TRAIT
  },
  'LUCKY': {
    'VALUE': 'lucky',
    'PATH': PATH.TRAIT
  },
  'BRAVE': {
    'VALUE': 'brave',
    'PATH': PATH.TRAIT
  },
  'HALFLING_NIMBLENESS': {
    'VALUE': 'halfling_nimbleness',
    'PATH': PATH.TRAIT
  },
  'DRACONIC_ANCESTRY': {
    'VALUE': 'draconic_ancestry',
    'PATH': PATH.TRAIT
  },
  'BREATH_WEAPON': {
    'VALUE': 'breath_weapon',
    'PATH': PATH.TRAIT
  },
  'DAMAGE_RESISTANCE': {
    'VALUE': 'damage_resistance',
    'PATH': PATH.TRAIT
  },
  'GNOME_CUNNING': {
    'VALUE': 'gnome_cunning',
    'PATH': PATH.TRAIT
  },
  'SKILL_VERSATILITY': {
    'VALUE': 'skill_versatility',
    'PATH': PATH.TRAIT
  },
  'MENACING': {
    'VALUE': 'menacing',
    'PATH': PATH.TRAIT
  },
  'RELENTLESS_ENDURANCE': {
    'VALUE': 'relentless_endurance',
    'PATH': PATH.TRAIT
  },
  'SAVAGE_ATTACKS': {
    'VALUE': 'savage_attacks',
    'PATH': PATH.TRAIT
  },
  'HELLISH_RESISTANCE': {
    'VALUE': 'hellish_resistance',
    'PATH': PATH.TRAIT
  },
  'INFERNAL_LEGACY': {
    'VALUE': 'infernal_legacy',
    'PATH': PATH.TRAIT
  },
  'NATURALLY_STEALTHY': {
    'VALUE': 'naturally_stealthy',
    'PATH': PATH.TRAIT
  },
  'STOUT_RESILIENCE': {
    'VALUE': 'stout_resilience',
    'PATH': PATH.TRAIT
  },
  'NATURAL_ILLUSIONIST': {
    'VALUE': 'natural_illusionist',
    'PATH': PATH.TRAIT
  },
  'SPEAK_WITH_SMALL_BEASTS': {
    'VALUE': 'speak_with_small_beasts',
    'PATH': PATH.TRAIT
  },
  'ARTIFICERS_LORE': {
    'VALUE': 'artificers_lore',
    'PATH': PATH.TRAIT
  },
  'TINKER': {
    'VALUE': 'tinker',
    'PATH': PATH.TRAIT
  }
};

function Trait(id, name, desc) {
  if (arguments.length < 3) {
    printRequiredArgumentsError(arguments);
    return null;
  }

  var trait = {
    'id': id,
    'desc': desc
  };
  trait[NAME] = name;

  return trait;
}

function getTraits() {
  const traits = {};

  traits[TRAIT.DARKVISION.VALUE] = Trait(
    pushID(TRAIT.DARKVISION.VALUE),
    `Darkvision`,
    `You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it w ere dim light. You can't discern color in darkness, only shades of gray.`
  );

  traits[TRAIT.DWARVEN_RESILIENCE.VALUE] = Trait(
    pushID(TRAIT.DWARVEN_RESILIENCE.VALUE),
    `Dwarven Resilience`,
    `You have advantage on saving throws against poison, and you have resistance against poison damage.`
  );

  traits[TRAIT.DWARVEN_COMBAT_TRAINING.VALUE] = Trait(
    pushID(TRAIT.DWARVEN_COMBAT_TRAINING.VALUE),
    `Dwarven Combat Training`,
    `You have proficiency with the battleaxe, handaxe, throwing hammer, and warhammer.`
  );

  traits[TRAIT.STONECUNNING.VALUE] = Trait(
    pushID(TRAIT.STONECUNNING.VALUE),
    `Stonecunning`,
    `Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient in the History skill and add double your proficiency bonus to the check, instead of your normal proficiency bonus.`
  );

  traits[TRAIT.DWARVEN_TOUGHNESS.VALUE] = Trait(
    pushID(TRAIT.DWARVEN_TOUGHNESS.VALUE),
    `Dwarven Toughness`,
    `Your hit point maximum increases by 1, and it increases by 1 every time you gain a level.`
  );

  traits[TRAIT.DWARVEN_ARMOR_TRAINING.VALUE] = Trait(
    pushID(TRAIT.DWARVEN_ARMOR_TRAINING.VALUE),
    `Dwarven Armor Training`,
    `You have proficiency with light and medium armor.`
  );

  traits[TRAIT.KEEN_SENSES.VALUE] = Trait(
    pushID(TRAIT.KEEN_SENSES.VALUE),
    `Keen Senses`,
    `You have proficiency in the Perception skill.`
  );

  traits[TRAIT.FEY_ANCESTRY.VALUE] = Trait(
    pushID(TRAIT.FEY_ANCESTRY.VALUE),
    `Fey Ancestry`,
    `You have advantage on saving throws against being charmed, and magic can't put you to sleep.`
  );

  traits[TRAIT.TRANCE.VALUE] = Trait(
    pushID(TRAIT.TRANCE.VALUE),
    `Trance`,
    `Elves don't need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day. (The Common word for such meditation is “trance.”) While meditating, you can dream after a fashion; such dreams are actually mental exercises that have become reflexive through years of practice. After resting in this way, you gain the same benefit that a human does from 8 hours of sleep.`
  );

  traits[TRAIT.ELF_WEAPON_TRAINING.VALUE] = Trait(
    pushID(TRAIT.ELF_WEAPON_TRAINING.VALUE),
    `Elf Weapon Training`,
    `You have proficiency with the longsword, shortsword, shortbow, and longbow.`
  );

  traits[TRAIT.CANTRIP.VALUE] = Trait(
    pushID(TRAIT.CANTRIP.VALUE),
    `Cantrip`,
    `You know one cantrip of your choice from the wizard spell list. Intelligence is your spellcasting ability for it.`
  );

  traits[TRAIT.EXTRA_LANGUAGE.VALUE] = Trait(
    pushID(TRAIT.EXTRA_LANGUAGE.VALUE),
    `Extra Language`,
    `You can speak, read, and write one extra language of your choice.`
  );

  traits[TRAIT.FLEET_OF_FOOT.VALUE] = Trait(
    pushID(TRAIT.FLEET_OF_FOOT.VALUE),
    `Fleet of Foot`,
    `Your base walking speed increases to 35 feet.`
  );

  traits[TRAIT.MASK_OF_THE_WILD.VALUE] = Trait(
    pushID(TRAIT.MASK_OF_THE_WILD.VALUE),
    `Mask of the Wild`,
    `You can attempt to hide even when you are only lightly obscured by foliage, heavy rain, falling snow, mist, and other natural phenomena.`
  );

  traits[TRAIT.SUPERIOR_DARKVISION.VALUE] = Trait(
    pushID(TRAIT.SUPERIOR_DARKVISION.VALUE),
    `Superior Darkvision`,
    `Your darkvision has a radius of 120 feet.`
  );

  traits[TRAIT.SUNLIGHT_SENSITIVITY.VALUE] = Trait(
    pushID(TRAIT.SUNLIGHT_SENSITIVITY.VALUE),
    `Sunlight Sensitivity`,
    `You have disadvantage on attack rolls and on Wisdom (Perception) checks that rely on sight when you, the target of your attack, or whatever you are trying to perceive is in direct sunlight.`
  );

  traits[TRAIT.DROW_MAGIC.VALUE] = Trait(
    pushID(TRAIT.DROW_MAGIC.VALUE),
    `Drow Magic`,
    `You know the dancing lights cantrip. When you reach 3rd level, you can cast the faerie fire spell once per day. When you reach 5th level, you can also cast the darkness spell once per day. Charisma is your spellcasting ability for these spells.`
  );

  traits[TRAIT.DROW_WEAPON_TRAINING.VALUE] = Trait(
    pushID(TRAIT.DROW_WEAPON_TRAINING.VALUE),
    `Drow Weapon Training`,
    `You have proficiency with rapiers, shortswords, and hand crossbows.`
  );

  traits[TRAIT.LUCKY.VALUE] = Trait(
    pushID(TRAIT.LUCKY.VALUE),
    `Lucky`,
    `When you roll a 1 on an attack roll, ability
    check, or saving throw, you can reroll the die and must
    use the new roll.`
  );

  traits[TRAIT.BRAVE.VALUE] = Trait(
    pushID(TRAIT.BRAVE.VALUE),
    `Brave`,
    `You have advantage on saving throws against
    being frightened.`
  );
  
  traits[TRAIT.HALFLING_NIMBLENESS.VALUE] = Trait(
    pushID(TRAIT.HALFLING_NIMBLENESS.VALUE),
    `Halfling Nimbleness`,
    `You can move through the
    space of any creature that is of a size larger than yours.`
  );
  
  traits[TRAIT.DRACONIC_ANCESTRY.VALUE] = Trait(
    pushID(TRAIT.DRACONIC_ANCESTRY.VALUE),
    `Draconic Ancestry`,
    `You have draconic ancestry.
    Choose one type of dragon from the Draconic Ancestry
    table. Your breath weapon and damage resistance are
    determined by the dragon type, as shown in the table.`
  );
  
  traits[TRAIT.BREATH_WEAPON.VALUE] = Trait(
    pushID(TRAIT.BREATH_WEAPON.VALUE),
    `Breath Weapon`,
    `You can use your action to exhale
    destructive energy. Your draconic ancestry determines
    the size, shape, and damage type of the exhalation.
    When you use your breath w eapon, each creature in
    the area of the exhalation must make a saving throw,
    the type of which is determined by your draconic
    ancestry. The DC for this saving throw equals 8 +
    your Constitution modifier + your proficiency bonus. A
    creature takes 2d6 damage on a failed save, and half
    as much damage on a successful one. The damage
    increases to 3d6 at 6th level, 4d6 at 11th level, and 5d6
    at 16th level.
    After you use your breath weapon, you can't use it
    again until you complete a short or long rest.`
  );
  
  traits[TRAIT.DAMAGE_RESISTANCE.VALUE] = Trait(
    pushID(TRAIT.DAMAGE_RESISTANCE.VALUE),
    `Damage Resistance`,
    `You have resistance to the
    damage type associated with your draconic ancestry.`
  );
  
  traits[TRAIT.GNOME_CUNNING.VALUE] = Trait(
    pushID(TRAIT.GNOME_CUNNING.VALUE),
    `Gnome Cunning`,
    `You have advantage on all
    Intelligence, Wisdom, and Charisma saving throws
    against magic.`
  );
  
  traits[TRAIT.SKILL_VERSATILITY.VALUE] = Trait(
    pushID(TRAIT.SKILL_VERSATILITY.VALUE),
    `Skill Versatility`,
    `You gain proficiency in two skills
    of your choice.`
  );
  
  traits[TRAIT.MENACING.VALUE] = Trait(
    pushID(TRAIT.MENACING.VALUE),
    `Menacing`,
    `You gain proficiency in the
    Intimidation skill.`
  );
  
  traits[TRAIT.RELENTLESS_ENDURANCE.VALUE] = Trait(
    pushID(TRAIT.RELENTLESS_ENDURANCE.VALUE),
    `Relentless Endurance`,
    `When you are reduced to
    0 hit points but not killed outright, you can drop to 1 hit
    point instead. You can't use this feature again until you
    finish a long rest.`
  );
  
  traits[TRAIT.SAVAGE_ATTACKS.VALUE] = Trait(
    pushID(TRAIT.SAVAGE_ATTACKS.VALUE),
    `Savage Attacks`,
    `When you score a critical hit with
    a melee weapon attack, you can roll one of the weapon's
    damage dice one additional time and add it to the extra
    damage of the critical hit.`
  );
  
  traits[TRAIT.HELLISH_RESISTANCE.VALUE] = Trait(
    pushID(TRAIT.HELLISH_RESISTANCE.VALUE),
    `Hellish Resistance`,
    `You have resistance
    to fire damage.`
  );
  
  traits[TRAIT.INFERNAL_LEGACY.VALUE] = Trait(
    pushID(TRAIT.INFERNAL_LEGACY.VALUE),
    `Infernal Legacy`,
    `You know the thaumaturgy cantrip.
    Once you reach 3rd level, you can cast the hellish
    rebuke spell once per day as a 2nd-level spell. Once you
    reach 5th level, you can also cast the darkness spell
    once per day. Charisma is your spellcasting ability for
    these spells.`
  );
  
  traits[TRAIT.NATURALLY_STEALTHY.VALUE] = Trait(
    pushID(TRAIT.NATURALLY_STEALTHY.VALUE),
    `Naturally Stealthy`,
    `You can attempt to hide even
    when you are obscured only by a creature that is at least
    one size larger than you.`
  );
  
  traits[TRAIT.STOUT_RESILIENCE.VALUE] = Trait(
    pushID(TRAIT.STOUT_RESILIENCE.VALUE),
    `Stout Resilience`,
    `You have advantage on saving
    throws against poison, and you have resistance
    against poison damage.`
  );
  
  traits[TRAIT.NATURAL_ILLUSIONIST.VALUE] = Trait(
    pushID(TRAIT.NATURAL_ILLUSIONIST.VALUE),
    `Natural Illusionist`,
    `You know the minor illusion
    cantrip. Intelligence is your spellcasting ability for it.`
  );
  
  traits[TRAIT.SPEAK_WITH_SMALL_BEASTS.VALUE] = Trait(
    pushID(TRAIT.SPEAK_WITH_SMALL_BEASTS.VALUE),
    `Speak with Small Beasts`,
    `Through sounds and
    gestures, you can communicate simple ideas with Small
    or smaller beasts. Forest gnomes love animals and often
    keep squirrels, badgers, rabbits, moles, woodpeckers,
    and other creatures as beloved pets.`
  );
  
  traits[TRAIT.ARTIFICERS_LORE.VALUE] = Trait(
    pushID(TRAIT.ARTIFICERS_LORE.VALUE),
    `Artificer\'s Lore`,
    `Whenever you make an Intelligence
    (History) check related to magic items, alchemical
    objects, or technological devices, you can add twice your
    proficiency bonus, instead of any proficiency bonus you
    normally apply.`
  );
  
  traits[TRAIT.TINKER.VALUE] = Trait(
    pushID(TRAIT.TINKER.VALUE),
    `Tinker`,
    `You have proficiency with artisan's tools
    (tinker's tools). Using those tools, you can spend 1
    hour and 10 gp worth of materials to construct a Tiny
    clockwork device (AC 5, 1 hp). The device ceases
    to function after 24 hours (unless you spend 1 hour
    repairing it to keep the device functioning), or when
    you use your action to dismantle it; at that time, you can
    reclaim the materials used to create it. You can have up
    to three such devices active at a time.
    When you create a device, choose one of the
    following options:
    Clockwork Toy. This toy is a clockwork animal, monster,
    or person, such as a frog, mouse, bird, dragon, or
    soldier. When placed on the ground, the toy m oves
    5 feet across the ground on each of your turns in a
    random direction. It makes noises as appropriate
    to the creature it represents.
    Fire Starter. The device produces a miniature
    flame, which you can use to light a candle,
    torch, or campfire. Using the device
    requires your action.
    Music Box. When opened, this music box
    plays a single song at a moderate volume.
    The box stops playing when it
    reaches the song's end or
    when it is closed.`
  );
  

  return traits;
}

/*******
* RACES
*******/

const SUBRACE = {
  'HILL_DWARF': {
    'VALUE': 'hill_dwarf',
    'PATH': PATH.SUBRACE
  },
  'MOUNTAIN_DWARF': {
    'VALUE': 'mountain_dwarf',
    'PATH': PATH.SUBRACE
  },
  'HIGH_ELF': {
    'VALUE': 'high_elf',
    'PATH': PATH.SUBRACE
  },
  'WOOD_ELF': {
    'VALUE': 'wood_elf',
    'PATH': PATH.SUBRACE
  },
  'DARK_ELF': {
    'VALUE': 'dark_elf',
    'PATH': PATH.SUBRACE
  },
  'LIGHTFOOT': {
    'VALUE': 'lightfoot',
    'PATH': PATH.SUBRACE
  },
  'STOUT': {
    'VALUE': 'stout',
    'PATH': PATH.SUBRACE
  },
  'FOREST_GNOME': {
    'VALUE': 'forest_gnome',
    'PATH': PATH.SUBRACE
  },
  'ROCK_GNOME': {
    'VALUE': 'rock_gnome',
    'PATH': PATH.SUBRACE
  }
};

function Subrace(id, name, increasesList, traitsList, maxHP_bonus=0, profsList=null, languagesList=null, speed=null) {
  if (arguments.length < 4) {
    printRequiredArgumentsError(arguments);
    return null;
  }

  var subrace = {
    'id': id
  };
  subrace[NAME] = name;

  var increases = {};
  for (i of increasesList) {
    increases[i.ability] = i.mod;
  }
  subrace['increases'] = increases;

  var traits = {};
  for (t of traitsList) {
    traits[t] = PATH.TRAITS;
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
      languages[l] = PATH.LANGUAGES;
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
    printRequiredArgumentsError(arguments);
    return null;
  }

  return {
    'ability': ability,
    'mod': mod
  };
}

function getSubraces() {
  var dwarf = {};
  dwarf[SUBRACE.HILL_DWARF.VALUE] = Subrace(
    pushID(SUBRACE.HILL_DWARF.VALUE),
    'Hill Dwarf',
    [
      Increase(ABILITY.WIS.VALUE, 1)
    ],
    [
      TRAIT.DWARVEN_TOUGHNESS.VALUE
    ],
    1
  );
  dwarf[SUBRACE.MOUNTAIN_DWARF.VALUE] = Subrace(
    pushID(SUBRACE.MOUNTAIN_DWARF.VALUE),
    'Mountain Dwarf',
    [
      Increase(ABILITY.STR.VALUE, 2)
    ],
    [
      TRAIT.DWARVEN_ARMOR_TRAINING.VALUE
    ],
    0,
    [
      ARMOR.TYPE.LIGHT,
      ARMOR.TYPE.MEDIUM
    ]
  );

  var elf = {};
  elf[SUBRACE.HIGH_ELF.VALUE] = Subrace(
    pushID(SUBRACE.HIGH_ELF.VALUE),
    'High Elf',
    [
      Increase(ABILITY.INT.VALUE, 1)
    ],
    [
      TRAIT.CANTRIP.VALUE,
      TRAIT.EXTRA_LANGUAGE.VALUE
    ],
    0,
    null,
    [
      LANGUAGE.ANY.VALUE
    ]
  );
  elf[SUBRACE.WOOD_ELF.VALUE] = Subrace(
    pushID(SUBRACE.WOOD_ELF.VALUE),
    'Wood Elf',
    [
      Increase(ABILITY.WIS.VALUE, 1)
    ],
    [
      TRAIT.FLEET_OF_FOOT.VALUE,
      TRAIT.MASK_OF_THE_WILD.VALUE
    ],
    35
  );
  elf[SUBRACE.DARK_ELF.VALUE] = Subrace(
    pushID(SUBRACE.DARK_ELF.VALUE),
    'Dark Elf (Drow)',
    [
      Increase(ABILITY.CHA.VALUE, 1)
    ],
    [
      TRAIT.SUPERIOR_DARKVISION.VALUE,
      TRAIT.SUNLIGHT_SENSITIVITY.VALUE,
      TRAIT.DROW_MAGIC.VALUE,
      TRAIT.DROW_WEAPON_TRAINING.VALUE
    ],
    0,
    [
      WEAPON.RAPIER,
      WEAPON.SHORTSWORD,
      WEAPON.HAND_CROSSBOW,
    ]
  );

  var halfling = {};
  halfling[SUBRACE.LIGHTFOOT.VALUE] = Subrace(
    pushID(SUBRACE.LIGHTFOOT.VALUE),
    'Lightfoot',
    [
      Increase(ABILITY.CHA.VALUE, 1)
    ],
    [
      TRAIT.NATURALLY_STEALTHY.VALUE
    ]
  );
  halfling[SUBRACE.STOUT.VALUE] = Subrace(
    pushID(SUBRACE.STOUT.VALUE),
    'Stout',
    [
      Increase(ABILITY.CON.VALUE, 1)
    ],
    [
      TRAIT.STOUT_RESILIENCE.VALUE
    ]
  );

  var gnome = {};
  gnome[SUBRACE.FOREST_GNOME.VALUE] = Subrace(
    pushID(SUBRACE.FOREST_GNOME.VALUE),
    'Forest Gnome',
    [
      Increase(ABILITY.DEX.VALUE, 1)
    ],
    [
      TRAIT.NATURAL_ILLUSIONIST.VALUE,
      TRAIT.SPEAK_WITH_SMALL_BEASTS.VALUE
    ]
  );
  gnome[SUBRACE.ROCK_GNOME.VALUE] = Subrace(
    pushID(SUBRACE.ROCK_GNOME.VALUE),
    'Rock Gnome',
    [
      Increase(ABILITY.CON.VALUE, 1)
    ],
    [
      TRAIT.ARTIFICERS_LORE.VALUE,
      TRAIT.TINKER.VALUE
    ],
    0,
    [
      TOOL.CATEGORY.ARTISAN
    ]
  );

  var subraces = {};
  subraces[RACE.DWARF.VALUE] = dwarf;
  subraces[RACE.ELF.VALUE] = elf;
  subraces[RACE.HALFLING.VALUE] = halfling;
  subraces[RACE.GNOME.VALUE] = gnome;

  return subraces;
}

const RACE = {
  'DWARF': {
    'VALUE': 'dwarf',
    'PATH': PATH.RACE
  },
  'ELF': {
    'VALUE': 'elf',
    'PATH': PATH.RACE
  },
  'HALFLING': {
    'VALUE': 'halfling',
    'PATH': PATH.RACE
  },
  'HUMAN': {
    'VALUE': 'human',
    'PATH': PATH.RACE
  },
  'DRAGONBORN': {
    'VALUE': 'dragonborn',
    'PATH': PATH.RACE
  },
  'GNOME': {
    'VALUE': 'gnome',
    'PATH': PATH.RACE
  },
  'HALF_ELF': {
    'VALUE': 'half_elf',
    'PATH': PATH.RACE
  },
  'HALF_ORC': {
    'VALUE': 'half_orc',
    'PATH': PATH.RACE
  },
  'TIEFLING': {
    'VALUE': 'tiefling',
    'PATH': PATH.RACE
  },

  'SIZE': {
    'SMALL': 'small',
    'MEDIUM': 'medium'
  }
};

function Race(id, name, increasesList, speed, size, traitsList, profsList=null, languagesList, subracesList=null, maxHP_bonus=0) {
  if (arguments.length < 6) {
    printRequiredArgumentsError(arguments);
    return null;
  }

  var race = {
    'id': id,
    'speed': speed,
    'size': size
  };
  race[NAME] = name;

  var increases = {};
  for (i of increasesList) {
    increases[i.ability] = i.mod;
  }
  race['increases'] = increases;

  var traits = {};
  for (i in traitsList) {
    let t = traitsList[i];
    traits[t] = PATH.TRAITS;
  }
  race['traits'] = traits;

  if (maxHP_bonus > 0) {
    subrace['maxHP_bonus'] = maxHP_bonus;
  }

  if (profsList !== null) {
    var proficiencies = {};
    var choiceCount = 1;
    for (p of profsList) {
      if (p.hasOwnProperty(CHOOSE)) {
        proficiencies['choice' + choiceCount] = p;
        choiceCount++;
      }
      else {
        proficiencies[p.VALUE] = p.PATH;
      }
    }
    race['proficiencies'] = proficiencies;
  }

  var languages = {};
  for (l of languagesList) {
    languages[l] = PATH.LANGUAGES;
  }
  race['languages'] = languages;

  if (subracesList !== null) {
    var subraces = {};
    for (s of subracesList) {
      subraces[s] = PATH.SUBRACES;
    }
    race['subraces'] = subraces;
  }

  return race;
}

const CHOOSE = 'choose';

function Choices(amount, choicesList) {
  if (arguments.length < 2) {
    printRequiredArgumentsError(arguments);
    return null;
  }

  var choices = {};
  choices[CHOOSE] = true;

  var choice = {};
  var conditionCount = 1;
  for (i in choicesList) {
    let c = choicesList[i];
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

function Choice(item, quantity=1, item2=null, quantity2=null, item3=null, quantity3=null) {
  if (arguments.length < 1) {
    printRequiredArgumentsError(arguments);
    return null;
  }

  var choice = {
    'value': item.VALUE,
    'quantity': quantity,
    'path': item.PATH
  };

  if (item2 !== null && quantity2 !== null) {
    choice['value2'] = item2.VALUE;
    choice['quantity2'] = quantity2;
    choice['path2'] = item2.PATH;
  }
  else if (!(item2 === null && quantity2 === null)) {
    console.log('Choice: ERROR: item2 AND quantity2 must both not be null');
    console.log('item =', item, ', quantity =', quantity);
    return null;
  }

  if (item3 !== null && quantity3 !== null) {
    choice['value3'] = item3.VALUE;
    choice['quantity3'] = quantity3;
    choice['path3'] = item3.PATH;
  }
  else if (!(item3 === null && quantity3 === null)) {
    console.log('Choice: ERROR: item3 AND quantity3 must both not be null');
    console.log('item =', item, ', quantity =', quantity);
    return null;
  }

  return choice;
}

const CONDITIONS = 'conditions';

function Condition(list, quantity=1, list2=null, quantity2=null) {
  if (arguments.length < 1) {
    printRequiredArgumentsError(arguments);
    return null;
  }
  if (list.length === 0) {
    console.log('Condition: ERROR: list is empty');
    return null;
  }

  var conditions = {
    'quantity': quantity
  };

  var condition = {};
  for (l of list) {
    condition[l.VALUE] = l.PATH;
  }
  conditions[CONDITIONS] = condition;

  if (list2 !== null && quantity2 !== null) {
    condition = {};
    for (l of list2) {
      condition[l.VALUE] = l.PATH;
    }
    conditions[CONDITIONS + '2'] = condition;
    conditions['quantity2'] = quantity2;
  }
  else if (!(list2 === null && quantity2 === null)) {
    console.log('Condition: ERROR: list2 AND quantity2 must both not be null');
    console.log('list =', list, ', quantity =', quantity);
    return null;
  }

  return conditions;
}

function getRaces() {
  var races = {};

  races[RACE.DWARF.VALUE] = Race(
    pushID(RACE.DWARF.VALUE),
    'Dwarf',
    [
      Increase(ABILITY.CON.VALUE, 2)
    ],
    25,
    RACE.SIZE.MEDIUM,
    [
      TRAIT.DARKVISION.VALUE,
      TRAIT.DWARVEN_RESILIENCE.VALUE,
      TRAIT.DWARVEN_COMBAT_TRAINING.VALUE,
      TRAIT.STONECUNNING.VALUE
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
      LANGUAGE.COMMON.VALUE,
      LANGUAGE.DWARVISH.VALUE
    ],
    [
      SUBRACE.HILL_DWARF.VALUE,
      SUBRACE.MOUNTAIN_DWARF.VALUE
    ]
  );

  races[RACE.ELF.VALUE] = Race(
    pushID(RACE.ELF.VALUE),
    'Elf',
    [
      Increase(ABILITY.DEX.VALUE, 2)
    ],
    30,
    RACE.SIZE.MEDIUM,
    [
      TRAIT.DARKVISION.VALUE,
      TRAIT.KEEN_SENSES.VALUE,
      TRAIT.FEY_ANCESTRY.VALUE,
      TRAIT.TRANCE.VALUE,
      TRAIT.ELF_WEAPON_TRAINING.VALUE
    ],
    null,
    [
      LANGUAGE.COMMON.VALUE,
      LANGUAGE.ELVISH.VALUE
    ],
    [
      SUBRACE.HIGH_ELF.VALUE,
      SUBRACE.WOOD_ELF.VALUE,
      SUBRACE.DARK_ELF.VALUE
    ]
  );

  races[RACE.HALFLING.VALUE] = Race(
    pushID(RACE.HALFLING.VALUE),
    'Halfling',
    [
      Increase(ABILITY.DEX.VALUE, 2)
    ],
    25,
    RACE.SIZE.SMALL,
    [
      TRAIT.LUCKY.VALUE,
      TRAIT.BRAVE.VALUE,
      TRAIT.HALFLING_NIMBLENESS.VALUE
    ],
    null,
    [
      LANGUAGE.COMMON.VALUE,
      LANGUAGE.HALFLING.VALUE
    ],
    [
      SUBRACE.LIGHTFOOT.VALUE,
      SUBRACE.STOUT.VALUE
    ]
  );

  races[RACE.HUMAN.VALUE] = Race(
    pushID(RACE.HUMAN.VALUE),
    'Human',
    [
      Increase(ABILITY.STR.VALUE, 1),
      Increase(ABILITY.DEX.VALUE, 1),
      Increase(ABILITY.CON.VALUE, 1),
      Increase(ABILITY.INT.VALUE, 1),
      Increase(ABILITY.WIS.VALUE, 1),
      Increase(ABILITY.CHA.VALUE, 1)
    ],
    30,
    RACE.SIZE.MEDIUM,
    null,
    null,
    [
      LANGUAGE.COMMON.VALUE,
      LANGUAGE.ANY.VALUE
    ]
  );

  races[RACE.DRAGONBORN.VALUE] = Race(
    pushID(RACE.DRAGONBORN.VALUE),
    'Dragonborn',
    [
      Increase(ABILITY.STR.VALUE, 2),
      Increase(ABILITY.CHA.VALUE, 1)
    ],
    30,
    RACE.SIZE.MEDIUM,
    [
      TRAIT.DRACONIC_ANCESTRY.VALUE,
      TRAIT.BREATH_WEAPON.VALUE,
      TRAIT.DAMAGE_RESISTANCE.VALUE
    ],
    null,
    [
      LANGUAGE.COMMON.VALUE,
      LANGUAGE.DRACONIC.VALUE
    ]
  );

  races[RACE.GNOME.VALUE] = Race(
    pushID(RACE.GNOME.VALUE),
    'Gnome',
    [
      Increase(ABILITY.INT.VALUE, 2)
    ],
    25,
    RACE.SIZE.SMALL,
    [
      TRAIT.DARKVISION.VALUE,
      TRAIT.GNOME_CUNNING.VALUE
    ],
    null,
    [
      LANGUAGE.COMMON.VALUE,
      LANGUAGE.GNOMISH.VALUE
    ],
    [
      SUBRACE.FOREST_GNOME.VALUE,
      SUBRACE.ROCK_GNOME.VALUE
    ]
  );

  races[RACE.HALF_ELF.VALUE] = Race(
    pushID(RACE.HALF_ELF.VALUE),
    'Half-Elf',
    [
      Increase(ABILITY.CHA.VALUE, 2),
      Increase(ABILITY.ANY.VALUE, 1),
      Increase(ABILITY.ANY.VALUE, 1)
    ],
    30,
    RACE.SIZE.MEDIUM,
    [
      TRAIT.DARKVISION.VALUE,
      TRAIT.FEY_ANCESTRY.VALUE,
      TRAIT.SKILL_VERSATILITY.VALUE
    ],
    [
      Choices(
        2,
        [
          Condition([SKILL.ANY])
        ]
      )
    ],
    [
      LANGUAGE.COMMON.VALUE,
      LANGUAGE.ELVISH.VALUE,
      LANGUAGE.ANY.VALUE
    ]
  );

  races[RACE.HALF_ORC.VALUE] = Race(
    pushID(RACE.HALF_ORC.VALUE),
    'Half-Orc',
    [
      Increase(ABILITY.STR.VALUE, 2),
      Increase(ABILITY.CON.VALUE, 1)
    ],
    30,
    RACE.SIZE.MEDIUM,
    [
      TRAIT.DARKVISION.VALUE,
      TRAIT.MENACING.VALUE,
      TRAIT.RELENTLESS_ENDURANCE.VALUE,
      TRAIT.SAVAGE_ATTACKS.VALUE
    ],
    [
      SKILL.INTIMIDATION
    ],
    [
      LANGUAGE.COMMON.VALUE,
      LANGUAGE.ORC.VALUE
    ]
  );

  races[RACE.TIEFLING.VALUE] = Race(
    pushID(RACE.TIEFLING.VALUE),
    'Tiefling',
    [
      Increase(ABILITY.INT.VALUE, 1),
      Increase(ABILITY.CHA.VALUE, 2)
    ],
    30,
    RACE.SIZE.MEDIUM,
    [
      TRAIT.DARKVISION.VALUE,
      TRAIT.HELLISH_RESISTANCE.VALUE,
      TRAIT.INFERNAL_LEGACY.VALUE
    ],
    null,
    [
      LANGUAGE.COMMON.VALUE,
      LANGUAGE.INFERNAL.VALUE
    ]
  );

  return races;
}

/*********
* CLASSES
*********/

const CLASS = {
  'BARBARIAN': {
    'VALUE': 'barbarian',
    'PATH': PATH.CLASS
  },
  'BARD': {
    'VALUE': 'bard',
    'PATH': PATH.CLASS
  },
  'CLERIC': {
    'VALUE': 'cleric',
    'PATH': PATH.CLASS
  },
  'DRUID': {
    'VALUE': 'druid',
    'PATH': PATH.CLASS
  },
  'FIGHTER': {
    'VALUE': 'fighter',
    'PATH': PATH.CLASS
  },
  'MONK': {
    'VALUE': 'monk',
    'PATH': PATH.CLASS
  },
  'PALADIN': {
    'VALUE': 'paladin',
    'PATH': PATH.CLASS
  },
  'RANGER': {
    'VALUE': 'ranger',
    'PATH': PATH.CLASS
  },
  'ROGUE': {
    'VALUE': 'rogue',
    'PATH': PATH.CLASS
  },
  'SORCERER': {
    'VALUE': 'sorcerer',
    'PATH': PATH.CLASS
  },
  'WARLOCK': {
    'VALUE': 'warlock',
    'PATH': PATH.CLASS
  },
  'WIZARD': {
    'VALUE': 'wizard',
    'PATH': PATH.CLASS
  }
};

function Class(id, name, hitDice, profsList, equipmentList) {
  if (arguments.length < 5) {
    printRequiredArgumentsError(arguments);
    return null;
  }

  var classObj = {
    'id': id,
    'hitDice': hitDice
  };
  classObj[NAME] = name;

  var proficiencies = {};
  var choiceCount = 1;
  for (p of profsList) {
    if (p.hasOwnProperty(CHOOSE)) {
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
    printRequiredArgumentsError(arguments);
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
    printRequiredArgumentsError(arguments);
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

  classes[CLASS.BARBARIAN.VALUE] = Class(
    pushID(CLASS.BARBARIAN.VALUE),
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

  classes[CLASS.BARD.VALUE] = Class(
    pushID(CLASS.BARD.VALUE),
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

  classes[CLASS.CLERIC.VALUE] = Class(
    pushID(CLASS.CLERIC.VALUE),
    'Cleric',
    HitDice(1, 8),
    [
      ARMOR.TYPE.LIGHT,
      ARMOR.TYPE.MEDIUM,
      ARMOR.TYPE.SHIELD,
      WEAPON.CATEGORY.SIMPLE,
      ABILITY.WIS,
      ABILITY.CHA,
      Choices(
        2,
        [
          Choice(SKILL.HISTORY),
          Choice(SKILL.INSIGHT),
          Choice(SKILL.MEDICINE),
          Choice(SKILL.PERSUASION),
          Choice(SKILL.RELIGION)
        ]
      )
    ],
    [
      Choices(
        1,
        [
          Choice(WEAPON.MACE),
          Choice(WEAPON.WARHAMMER)
        ]
      ),
      Choices(
        1,
        [
          Choice(ARMOR.SCALE_MAIL),
          Choice(ARMOR.LEATHER),
          Choice(ARMOR.CHAIN_MAIL),
        ]
      ),
      Choices(
        1,
        [
          Choice(WEAPON.LIGHT_CROSSBOW, 1, GEAR.CROSSBOW_BOLTS_20, 1),
          Condition([WEAPON.CATEGORY.SIMPLE])
        ]
      ),
      Choices(
        1,
        [
          Choice(PACK.PRIEST),
          Choice(PACK.EXPLORER)
        ]
      ),
      Equipment(ARMOR.SHIELD),
      Equipment(GEAR.TYPE.HOLY_SYMBOL)
    ]
  );

  classes[CLASS.DRUID.VALUE] = Class(
    pushID(CLASS.DRUID.VALUE),
    'Druid',
    HitDice(1, 8),
    [
      ARMOR.TYPE.LIGHT,
      ARMOR.TYPE.MEDIUM,
      ARMOR.TYPE.SHIELD,
      WEAPON.CLUB,
      WEAPON.DAGGER,
      WEAPON.DART,
      WEAPON.JAVELIN,
      WEAPON.MACE,
      WEAPON.QUARTERSTAFF,
      WEAPON.SCIMITAR,
      WEAPON.SICKLE,
      WEAPON.SLING,
      WEAPON.SPEAR,
      TOOL.HERBALISM_KIT,
      ABILITY.INT,
      ABILITY.WIS,
      Choices(
        2,
        [
          Choice(SKILL.ARCANA),
          Choice(SKILL.ANIMAL_HANDLING),
          Choice(SKILL.INSIGHT),
          Choice(SKILL.MEDICINE),
          Choice(SKILL.NATURE),
          Choice(SKILL.PERCEPTION),
          Choice(SKILL.RELIGION),
          Choice(SKILL.SURVIVAL)
        ]
      )
    ],
    [
      Choices(
        1,
        [
          Choice(ARMOR.SHIELD),
          Condition([WEAPON.CATEGORY.SIMPLE])
        ]
      ),
      Choices(
        1,
        [
          Choice(WEAPON.SCIMITAR),
          Condition([WEAPON.CATEGORY.SIMPLE, WEAPON.CLASS.MELEE])
        ]
      ),
      Equipment(ARMOR.LEATHER),
      Equipment(PACK.EXPLORER),
      Equipment(GEAR.TYPE.DRUIDIC_FOCUS)
    ]
  );

  classes[CLASS.FIGHTER.VALUE] = Class(
    pushID(CLASS.FIGHTER.VALUE),
    'Fighter',
    HitDice(1, 10),
    [
      ARMOR.ALL,
      WEAPON.CATEGORY.SIMPLE,
      WEAPON.CATEGORY.MARTIAL,
      ABILITY.STR,
      ABILITY.CON,
      Choices(
        2,
        [
          Choice(SKILL.ACROBATICS),
          Choice(SKILL.ANIMAL_HANDLING),
          Choice(SKILL.ATHLETICS),
          Choice(SKILL.HISTORY),
          Choice(SKILL.INSIGHT),
          Choice(SKILL.INTIMIDATION),
          Choice(SKILL.PERCEPTION),
          Choice(SKILL.SURVIVAL)
        ]
      )
    ],
    [
      Choices(
        1,
        [
          Choice(ARMOR.CHAIN_MAIL),
          Choice(ARMOR.LEATHER, 1, WEAPON.LONGBOW, 1, GEAR.ARROWS_20, 1)
        ]
      ),
      Choices(
        1,
        [
          Condition([WEAPON.CATEGORY.MARTIAL], 1, [ARMOR.TYPE.SHIELD], 1),
          Condition([WEAPON.CATEGORY.MARTIAL], 2)
        ]
      ),
      Choices(
        1,
        [
          Choice(WEAPON.LIGHT_CROSSBOW, 1, GEAR.CROSSBOW_BOLTS_20, 1),
          Choice(WEAPON.HANDAXE, 2)
        ]
      ),Choices(
        1,
        [
          Choice(PACK.DUNGEONEER),
          Choice(PACK.EXPLORER)
        ]
      )
    ]
  );

  classes[CLASS.MONK.VALUE] = Class(
    pushID(CLASS.MONK.VALUE),
    'Monk',
    HitDice(1, 8),
    [
      WEAPON.CATEGORY.SIMPLE,
      WEAPON.SHORTSWORD,
      Choices(
        1,
        [
          Condition([TOOL.CATEGORY.ARTISAN]),
          Condition([TOOL.CATEGORY.MUSICAL_INSTRUMENT])
        ]
      ),
      ABILITY.STR,
      ABILITY.DEX,
      Choices(
        2,
        [
          Choice(SKILL.ACROBATICS),
          Choice(SKILL.ATHLETICS),
          Choice(SKILL.HISTORY),
          Choice(SKILL.INSIGHT),
          Choice(SKILL.RELIGION),
          Choice(SKILL.STEALTH)
        ]
      )
    ],
    [
      Choices(
        1,
        [
          Choice(WEAPON.SHORTSWORD),
          Condition([WEAPON.CATEGORY.SIMPLE])
        ]
      ),
      Choices(
        1,
        [
          Choice(PACK.DUNGEONEER),
          Choice(PACK.EXPLORER)
        ]
      ),
      Equipment(WEAPON.DART, 10)
    ]
  );

  classes[CLASS.PALADIN.VALUE] = Class(
    pushID(CLASS.PALADIN.VALUE),
    'Paladin',
    HitDice(1, 10),
    [
      ARMOR.ALL,
      ARMOR.TYPE.SHIELD,
      WEAPON.CATEGORY.SIMPLE,
      WEAPON.CATEGORY.MARTIAL,
      ABILITY.WIS,
      ABILITY.CHA,
      Choices(
        2,
        [
          Choice(SKILL.ATHLETICS),
          Choice(SKILL.INSIGHT),
          Choice(SKILL.INTIMIDATION),
          Choice(SKILL.MEDICINE),
          Choice(SKILL.PERSUASION),
          Choice(SKILL.RELIGION)
        ]
      )
    ],
    [
      Choices(
        1,
        [
          Condition([WEAPON.CATEGORY.MARTIAL], 1, [ARMOR.TYPE.SHIELD], 1),
          Condition([WEAPON.CATEGORY.MARTIAL], 2)
        ]
      ),
      Choices(
        1,
        [
          Choice(WEAPON.JAVELIN, 5),
          Condition([WEAPON.CATEGORY.SIMPLE, WEAPON.CLASS.MELEE])
        ]
      ),
      Choices(
        1,
        [
          Choice(PACK.PRIEST),
          Choice(PACK.EXPLORER)
        ]
      ),
      Equipment(ARMOR.CHAIN_MAIL),
      Equipment(GEAR.TYPE.HOLY_SYMBOL)
    ]
  );

  classes[CLASS.RANGER.VALUE] = Class(
    pushID(CLASS.RANGER.VALUE),
    'Ranger',
    HitDice(1, 10),
    [
      ARMOR.TYPE.LIGHT,
      ARMOR.TYPE.MEDIUM,
      ARMOR.TYPE.SHIELD,
      WEAPON.CATEGORY.SIMPLE,
      WEAPON.CATEGORY.MARTIAL,
      ABILITY.STR,
      ABILITY.DEX,
      Choices(
        3,
        [
          Choice(SKILL.ANIMAL_HANDLING),
          Choice(SKILL.ATHLETICS),
          Choice(SKILL.INSIGHT),
          Choice(SKILL.INVESTIGATION),
          Choice(SKILL.NATURE),
          Choice(SKILL.PERCEPTION),
          Choice(SKILL.STEALTH),
          Choice(SKILL.SURVIVAL)
        ]
      )
    ],
    [
      Choices(
        1,
        [
          Choice(ARMOR.SCALE_MAIL),
          Choice(ARMOR.LEATHER)
        ]
      ),
      Choices(
        1,
        [
          Choice(WEAPON.SHORTSWORD, 2),
          Condition([WEAPON.CATEGORY.SIMPLE, WEAPON.CLASS.MELEE], 2)
        ]
      ),
      Choices(
        1,
        [
          Choice(PACK.DUNGEONEER),
          Choice(PACK.EXPLORER)
        ]
      ),
      Equipment(WEAPON.LONGBOW),
      Equipment(GEAR.QUIVER),
      Equipment(GEAR.ARROWS_20)
    ]
  );

  classes[CLASS.ROGUE.VALUE] = Class(
    pushID(CLASS.ROGUE.VALUE),
    'Rogue',
    HitDice(1, 8),
    [
      ARMOR.TYPE.LIGHT,
      WEAPON.CATEGORY.SIMPLE,
      WEAPON.HAND_CROSSBOW,
      WEAPON.LONGSWORD,
      WEAPON.RAPIER,
      WEAPON.SHORTSWORD,
      TOOL.THIEVES_TOOLS,
      ABILITY.DEX,
      ABILITY.INT,
      Choices(
        4,
        [
          Choice(SKILL.ACROBATICS),
          Choice(SKILL.ATHLETICS),
          Choice(SKILL.DECEPTION),
          Choice(SKILL.INSIGHT),
          Choice(SKILL.INTIMIDATION),
          Choice(SKILL.INVESTIGATION),
          Choice(SKILL.PERCEPTION),
          Choice(SKILL.PERFORMANCE),
          Choice(SKILL.PERSUASION),
          Choice(SKILL.SLEIGHT_OF_HAND),
          Choice(SKILL.STEALTH)
        ]
      )
    ],
    [
      Choices(
        1,
        [
          Choice(WEAPON.RAPIER),
          Choice(WEAPON.SHORTSWORD)
        ]
      ),
      Choices(
        1,
        [
          Choice(WEAPON.SHORTBOW, 1, GEAR.QUIVER, 1, GEAR.ARROWS_20, 1),
          Choice(WEAPON.SHORTSWORD)
        ]
      ),
      Choices(
        1,
        [
          Choice(PACK.BURGLAR),
          Choice(PACK.DUNGEONEER),
          Choice(PACK.EXPLORER)
        ]
      ),
      Equipment(ARMOR.LEATHER),
      Equipment(WEAPON.DAGGER, 2),
      Equipment(TOOL.THIEVES_TOOLS)
    ]
  );

  classes[CLASS.SORCERER.VALUE] = Class(
    pushID(CLASS.SORCERER.VALUE),
    'Sorcerer',
    HitDice(1, 6),
    [
      WEAPON.DAGGER,
      WEAPON.DART,
      WEAPON.SLING,
      WEAPON.QUARTERSTAFF,
      WEAPON.LIGHT_CROSSBOW,
      ABILITY.CON,
      ABILITY.CHA,
      Choices(
        2,
        [
          Choice(SKILL.ARCANA),
          Choice(SKILL.DECEPTION),
          Choice(SKILL.INSIGHT),
          Choice(SKILL.INTIMIDATION),
          Choice(SKILL.PERSUASION),
          Choice(SKILL.RELIGION)
        ]
      )
    ],
    [
      Choices(
        1,
        [
          Choice(WEAPON.LIGHT_CROSSBOW, 1, GEAR.CROSSBOW_BOLTS_20, 1),
          Condition([WEAPON.CATEGORY.SIMPLE])
        ]
      ),
      Choices(
        1,
        [
          Choice(GEAR.COMPONENT_POUCH),
          Condition([GEAR.TYPE.ARCANE_FOCUS])
        ]
      ),
      Choices(
        1,
        [
          Choice(PACK.DUNGEONEER),
          Choice(PACK.EXPLORER)
        ]
      ),
      Equipment(WEAPON.DAGGER, 2)
    ]
  );

  classes[CLASS.WARLOCK.VALUE] = Class(
    pushID(CLASS.WARLOCK.VALUE),
    'Warlock',
    HitDice(1, 8),
    [
      ARMOR.TYPE.LIGHT,
      WEAPON.CATEGORY.SIMPLE,
      ABILITY.WIS,
      ABILITY.CHA,
      Choices(
        2,
        [
          Choice(SKILL.ARCANA),
          Choice(SKILL.DECEPTION),
          Choice(SKILL.HISTORY),
          Choice(SKILL.INTIMIDATION),
          Choice(SKILL.INVESTIGATION),
          Choice(SKILL.NATURE),
          Choice(SKILL.RELIGION)
        ]
      )
    ],
    [
      Choices(
        1,
        [
          Choice(WEAPON.LIGHT_CROSSBOW, 1, GEAR.CROSSBOW_BOLTS_20, 1),
          Condition([WEAPON.CATEGORY.SIMPLE])
        ]
      ),
      Choices(
        1,
        [
          Choice(GEAR.COMPONENT_POUCH),
          Condition([GEAR.TYPE.ARCANE_FOCUS])
        ]
      ),
      Choices(
        1,
        [
          Choice(PACK.SCHOLAR),
          Choice(PACK.DUNGEONEER)
        ]
      ),
      Equipment(ARMOR.LEATHER),
      Equipment(WEAPON.CATEGORY.SIMPLE),
      Equipment(WEAPON.DAGGER, 2)
    ]
  );

  classes[CLASS.WIZARD.VALUE] = Class(
    pushID(CLASS.WIZARD.VALUE),
    'Wizard',
    HitDice(1, 6),
    [
      WEAPON.DAGGER,
      WEAPON.DART,
      WEAPON.SLING,
      WEAPON.QUARTERSTAFF,
      WEAPON.LIGHT_CROSSBOW,
      ABILITY.INT,
      ABILITY.WIS,
      Choices(
        2,
        [
          Choice(SKILL.ARCANA),
          Choice(SKILL.HISTORY),
          Choice(SKILL.INSIGHT),
          Choice(SKILL.INVESTIGATION),
          Choice(SKILL.MEDICINE),
          Choice(SKILL.RELIGION)
        ]
      )
    ],
    [
      Choices(
        1,
        [
          Choice(WEAPON.QUARTERSTAFF),
          Choice(WEAPON.DAGGER)
        ]
      ),
      Choices(
        1,
        [
          Choice(GEAR.COMPONENT_POUCH),
          Condition([GEAR.TYPE.ARCANE_FOCUS])
        ]
      ),
      Choices(
        1,
        [
          Choice(PACK.SCHOLAR),
          Choice(PACK.EXPLORER)
        ]
      ),
      Equipment(GEAR.SPELLBOOK)
    ]
  );

  return classes;
}

function processProficiencies(profsList) {
  var proficiencies = {};
  var choiceCount = 1;
  for (p of profsList) {
    if (p.hasOwnProperty(CHOOSE)) {
      proficiencies['choice' + choiceCount] = p;
      choiceCount++;
    }
    else {
      proficiencies[p.VALUE] = p.PATH;
    }
  }
  return proficiencies;
}

function processEquipment(equipmentList) {
  var equipment = {};
  choiceCount = 1;
  for (e of equipmentList) {
    if (e.hasOwnProperty(CHOOSE)) {
      equipment['choice' + choiceCount] = e;
      choiceCount++;
    }
    else if (e.hasOwnProperty('gp')) {
      equipment['gp'] = e.gp;
    }
    else {
      equipment[e.item] = {
        'quantity': e.quantity,
        'path': e.path
      };
    }
  }
  return equipment;
}

function processLanguages(languagesList) {
  var languages = {};
  choiceCount = 1;
  for (l of languagesList) {
    if (l.hasOwnProperty(CHOOSE)) {
      languages['choice' + choiceCount] = l;
      choiceCount++;
    }
    else {
      languages[l] = PATH.LANGUAGES;
    }
  }
  return languages;
}

/*************
* BACKGROUNDS
*************/

const BACKGROUND = {
  'ACOLYTE': {
    'VALUE': 'acolyte',
    'PATH': PATH.BACKGROUNDS
  },
  'CHARLATAN': {
    'VALUE': 'charlatan',
    'PATH': PATH.BACKGROUNDS
  },
  'CRIMINAL': {
    'VALUE': 'criminal',
    'PATH': PATH.BACKGROUNDS
  },
  'ENTERTAINER': {
    'VALUE': 'entertainer',
    'PATH': PATH.BACKGROUNDS
  },
  'FOLK_HERO': {
    'VALUE': 'folk_hero',
    'PATH': PATH.BACKGROUNDS
  },
  'GUILD_ARTISAN': {
    'VALUE': 'guild_artisan',
    'PATH': PATH.BACKGROUNDS
  },
  'HERMIT': {
    'VALUE': 'hermit',
    'PATH': PATH.BACKGROUNDS
  },
  'NOBLE': {
    'VALUE': 'noble',
    'PATH': PATH.BACKGROUNDS
  },
  'OUTLANDER': {
    'VALUE': 'outlander',
    'PATH': PATH.BACKGROUNDS
  },
  'SAGE': {
    'VALUE': 'sage',
    'PATH': PATH.BACKGROUNDS
  },
  'SAILOR': {
    'VALUE': 'sailor',
    'PATH': PATH.BACKGROUNDS
  },
  'SOLDIER': {
    'VALUE': 'soldier',
    'PATH': PATH.BACKGROUNDS
  },
  'URCHIN': {
    'VALUE': 'urchin',
    'PATH': PATH.BACKGROUNDS
  }
};

class Background {
  constructor(name, traits, ideals, bonds, flaws, feature, proficiencyList,
              equipmentList, anyLanguageCount=null, extra=null, variant=null, variantFeature=null) {
    this.id = pushID(name);
    this.name = name;
    this.traits = traits;
    this.ideals = ideals;
    this.bonds = bonds;
    this.flaws = flaws;
    this.feature = feature;

    this.proficiencies = processProficiencies(proficiencyList);
    this.equipment = processEquipment(equipmentList);

    if (anyLanguageCount !== null) {
      // this.languages = processLanguages(languageList);
      this.languages = {};
      this.languages[ANY] = anyLanguageCount;
    }

    if (extra !== null) {
      this.extra = extra;
    }

    if (variant !== null) {
      this.variant = variant;
    }

    if (variantFeature !== null) {
      this.variantFeature = variantFeature;
    }
  }
}

class Characteristic {
  constructor(optionList, name=null) {
    this.die = optionList.length;
    
    this.options = {};
    let num = 1;
    for (let o of optionList) {
      this.options[num] = o;
      num++;
    }

    if (name !== null) {
      this.name = name;
    }
  }
}

class CharacteristicOption {
  constructor(desc, name=null) {
    this.desc = desc.replace('\n', '').replace(/ {2,}/g, '');
    this.name = name;
  }
}

class PersonalityTraits extends Characteristic {
  constructor(optionList) {
    super(optionList, 'Personality Trait');
  }
}

class Ideals extends Characteristic {
  constructor(optionList) {
    super(optionList, 'Ideal');
  }
}

class Bonds extends Characteristic {
  constructor(optionList) {
    super(optionList, 'Bond');
  }
}

class Flaws extends Characteristic {
  constructor(optionList) {
    super(optionList, 'Flaw');
  }
}

class Feature extends CharacteristicOption {
  constructor(desc, name) {
    super(desc, name)
  }
}

class Variant extends Feature {
  constructor(desc, name) {
    super(desc, name)
  }
}

class VariantFeature extends Feature {
  constructor(desc, name) {
    super(desc, name)
  }
}

function Gold(numGP) {
  return {
    'gp': numGP
  };
}

function getBackgrounds() {
  var backgrounds = {};

  backgrounds[BACKGROUND.ACOLYTE.VALUE] = new Background(
    'Acolyte',
    new PersonalityTraits([
      new CharacteristicOption(
        `I idolize a particular hero of my faith, and constantly
        refer to that person's deeds and example.`
      ),
      new CharacteristicOption(
        `I can find common ground between the fiercest
        enemies, empathizing with them and always working
        toward peace.`
      ),
      new CharacteristicOption(
        `I see omens in every event and action. The gods try to
        speak to us, we just need to listen.`
      ),
      new CharacteristicOption(
        `Nothing can shake my optimistic attitude.`
      ),
      new CharacteristicOption(
        `I quote (or misquote) sacred texts and proverbs in
        almost every situation.`
      ),
      new CharacteristicOption(
        `I am tolerant (or intolerant) of other faiths and respect
        (or condemn) the worship of other gods.`
      ),
      new CharacteristicOption(
        `I've enjoyed fine food, drink, and high society among
        my temple's elite. Rough living grates on me.`
      ),
      new CharacteristicOption(
        `I've spent so long in the temple that I have little
        practical experience dealing with people in the outside
        world.`
      )
    ]),
    new Ideals([
      new CharacteristicOption(
        `The ancient traditions o f worship and
        sacrifice must be preserved and upheld. (Lawful)`,
        `Tradition.`
      ),
      new CharacteristicOption(
        `I always try to help those in need, no matter
        what the personal cost. (Good)`,
        `Charity.`
      ),
      new CharacteristicOption(
        `We must help bring about the changes the
        gods are constantly working in the world. (Chaotic)`,
        `Change.`
      ),
      new CharacteristicOption(
        `I hope to one day rise to the top of my faith's
        religious hierarchy. (Lawful)`,
        `Power.`
      ),
      new CharacteristicOption(
        `I trust that my deity will guide my actions, I have
        faith that if I work hard, things will go well. (Lawful)`,
        `Faith.`
      ),
      new CharacteristicOption(
        `I seek to prove myself worthy of my god's
        favor by matching my actions against his or her
        teachings. (Any)`,
        `Aspiration.`
      )
    ]),
    new Bonds([
      new CharacteristicOption(
        `I would die to recover an ancient relic of my faith that
        was lost long ago.`
      ),
      new CharacteristicOption(
        `I will someday get revenge on the corrupt temple
        hierarchy who branded me a heretic.`
      ),
      new CharacteristicOption(
        `I owe my life to the priest who took me in when my
        parents died.`
      ),
      new CharacteristicOption(
        `Everything I do is for the common people.`
      ),
      new CharacteristicOption(
        `I will do anything to protect the temple where I served.`
      ),
      new CharacteristicOption(
        `I seek to preserve a sacred text that my enemies
        consider heretical and seek to destroy.`
      )
    ]),
    new Flaws([
      new CharacteristicOption(
        `I judge others harshly, and myself even more severely.`
      ),
      new CharacteristicOption(
        `I put too much trust in those who wield power within
        my temple's hierarchy.`
      ),
      new CharacteristicOption(
        `My piety sometimes leads me to blindly trust those
        that profess faith in my god.`
      ),
      new CharacteristicOption(
        `I am inflexible in my thinking.`
      ),
      new CharacteristicOption(
        `I am suspicious of strangers and expect the worst of
        them.`
      ),
      new CharacteristicOption(
        `Once I pick a goal, I become obsessed with it to the
        detriment of everything else in my life.`
      )
    ]),
    new Feature(
      `As an acolyte, you command the respect of those who
      share your faith, and you can perform the religious
      ceremonies of your deity. You and your adventuring
      companions can expect to receive free healing and
      care at a temple, shrine, or other established presence
      of your faith, though you must provide any material
      components needed for spells. Those who share
      your religion will support you (but only you) at a
      modest lifestyle.
      You might also have ties to a specific temple dedicated
      to your chosen deity or pantheon, and you have a
      residence there. This could be the temple where you
      used to serve, if you remain on good terms with it, or a
      temple where you have found a new home. While near
      your temple, you can call upon the priests for assistance,
      provided the assistance you ask for is not hazardous and
      you remain in good standing with your temple.`,
      `Shelter of the Faithful`
    ),
    [
      SKILL.INSIGHT,
      SKILL.RELIGION
    ],
    [
      Choices(
        1,
        [
          Condition([GEAR.TYPE.HOLY_SYMBOL])
        ]
      ),
      Choices(
        1,
        [
          Choice(GEAR.PRAYER_BOOK),
          Choice(GEAR.PRAYER_WHEEL)
        ]
      ),
      Equipment(GEAR.INCENSE_STICK, 5),
      Equipment(GEAR.VESTMENTS),
      Equipment(GEAR.CLOTHES_COMMON),
      Gold(15)
    ],
    2
  );

  backgrounds[BACKGROUND.CHARLATAN.VALUE] = new Background(
    'Charlatan',
    new PersonalityTraits([
      new CharacteristicOption(
        `I fall in and out of love easily, and am always pursuing
        someone.`
      ),
      new CharacteristicOption(
        `I have a joke for every occasion, especially occasions
        where humor is inappropriate.`
      ),
      new CharacteristicOption(
        `Flattery is my preferred trick for getting what I want.`
      ),
      new CharacteristicOption(
        `I'm a born gambler who can't resist taking a risk for a
        potential payoff.`
      ),
      new CharacteristicOption(
        `I lie about almost everything, even when there's no
        good reason to.`
      ),
      new CharacteristicOption(
        `Sarcasm and insults are my weapons of choice.`
      ),
      new CharacteristicOption(
        `I keep multiple holy symbols on me and invoke
        whatever deity might come in useful at any given
        moment.`
      ),
      new CharacteristicOption(
        `I pocket anything I see that might have some value.`
      )
    ]),
    new Ideals([
      new CharacteristicOption(
        `I am a free spirit— no one tells me what
        to do. (Chaotic)`,
        `Independence.`
      ),
      new CharacteristicOption(
        `I never target people who can't afford to lose
        a few coins. (Lawful)`,
        `Fairness.`
      ),
      new CharacteristicOption(
        `I distribute the money I acquire to the people
        who really need it. (Good)`,
        `Charity.`
      ),
      new CharacteristicOption(
        `I never run the same con twice. (Chaotic)`,
        `Creativity.`
      ),
      new CharacteristicOption(
        `Material goods come and go. Bonds of
        friendship last forever. (Good)`,
        `Friendship.`
      ),
      new CharacteristicOption(
        `I'm determined to make something
        of myself. (Any)`,
        `Aspiration.`
      )
    ]),
    new Bonds([
      new CharacteristicOption(
        `I fleeced the wrong person and must work to ensure
        that this individual never crosses paths with me or
        those I care about.`
      ),
      new CharacteristicOption(
        `I owe everything to my mentor—a horrible person
        who's probably rotting in jail somewhere.`
      ),
      new CharacteristicOption(
        `Somewhere out there, I have a child who doesn't
        know me. I'm making the world better for him or her.`
      ),
      new CharacteristicOption(
        `I come from a noble family, and one day I'll reclaim my
        lands and title from those who stole them from me.`
      ),
      new CharacteristicOption(
        `A powerful person killed someone I love. Some day
        soon, I'll have my revenge.`
      ),
      new CharacteristicOption(
        `I swindled and ruined a person who didn't deserve it. I
        seek to atone for my misdeeds but might never be able
        to forgive myself.`
      )
    ]),
    new Flaws([
      new CharacteristicOption(
        `I can't resist a pretty face.`
      ),
      new CharacteristicOption(
        `I'm always in debt. I spend my ill-gotten gains on
        decadent luxuries faster than I bring them in.`
      ),
      new CharacteristicOption(
        `I'm convinced that no one could ever fool me the way
        I fool others.`
      ),
      new CharacteristicOption(
        `I'm too greedy for my own good. I can't resist taking a
        risk if there's money involved.`
      ),
      new CharacteristicOption(
        `I can't resist swindling people who are more powerful
        than me.`
      ),
      new CharacteristicOption(
        `I hate to admit it and will hate myself for it, but I'll run
        and preserve my own hide if the going gets tough.`
      )
    ]),
    new Feature(
      `You have created a second identity that includes
      documentation, established acquaintances, and
      disguises that allow you to assume that persona.
      Additionally, you can forge documents including official
      papers and personal letters, as long as you have seen an
      example of the kind o f document or the handwriting you
      are trying to copy.`,
      `False Identity`
    ),
    [
      SKILL.DECEPTION,
      SKILL.SLEIGHT_OF_HAND,
      TOOL.DISGUISE_KIT,
      TOOL.FORGERY_KIT
    ],
    [
      Equipment(GEAR.CLOTHES_FINE),
      Equipment(TOOL.DISGUISE_KIT),
      Choices(
        1,
        [
          Condition([GEAR.TYPE.CON])
        ]
      ),
      Gold(15)
    ],
    null,
    new Characteristic(
      [
        new CharacteristicOption(
          `I cheat at games of chance.`
        ),
        new CharacteristicOption(
          `I shave coins or forge documents.`
        ),
        new CharacteristicOption(
          `I insinuate myself into people's lives to prey on their
          weakness and secure their fortunes.`
        ),
        new CharacteristicOption(
          `I put on new identities like clothes.`
        ),
        new CharacteristicOption(
          `I run sleight-of-hand cons on street corners.`
        ),
        new CharacteristicOption(
          `I convince people that worthless junk is worth their
          hard-earned money.`
        )
      ],
      'Favorite Scam'
    )
  );

  backgrounds[BACKGROUND.CRIMINAL.VALUE] = new Background(
    'Criminal',
    new PersonalityTraits([
      new CharacteristicOption(
        `I always have a plan for what to do when things go wrong.`
      ),
      new CharacteristicOption(
        `I am always calm, no matter what the situation. I never
        raise my voice or let me emotions control me.`
      ),
      new CharacteristicOption(
        `The first thing I do in a new places is note the locations
        of everything valuable—or where such things could be
        hidden.`
      ),
      new CharacteristicOption(
        `I would rather make a new friend than a new enemy.`
      ),
      new CharacteristicOption(
        `I am incredibly slow to trust. Those who seem the
        fairest often have the most to hide.`
      ),
      new CharacteristicOption(
        `I don't pay attention to the risks in a situation. Never
        tell me the odds.`
      ),
      new CharacteristicOption(
        `The best way to get me to do something is to tell me I
        can't do it.`
      ),
      new CharacteristicOption(
        `I blow up at the slightest insult.`
      )
    ]),
    new Ideals([
      new CharacteristicOption(
        `I don't steal from others in the trade. (Lawful)`,
        `Honor.`
      ),
      new CharacteristicOption(
        `Chains are meant to be broken, as are those
        who would forge them. (Chaotic)`,
        `Freedom.`
      ),
      new CharacteristicOption(
        `I steal from the wealthy so that I can help
        people in need. (Good)`,
        `Charity.`
      ),
      new CharacteristicOption(
        `I will do whatever it takes to become
        wealthy. (Evil)`,
        `Greed.`
      ),
      new CharacteristicOption(
        `I'm loyal to my friends, not to any ideals, and
        everyone else can take a trip down the Styx for all I
        care. (Neutral)`,
        `People.`
      ),
      new CharacteristicOption(
        `There's a spark of good in everyone. (Good)`,
        `Redemption.`
      )
    ]),
    new Bonds([
      new CharacteristicOption(
        `I'm trying to pay off an old debt I owe to a generous
        benefactor.`
      ),
      new CharacteristicOption(
        `My ill-gotten gains go to support my family.
        Something important was taken from me, and I aim to
        steal it back.`
      ),
      new CharacteristicOption(
        `I will become the greatest thief that ever lived.`
      ),
      new CharacteristicOption(
        `I'm guilty of a terrible crime. I hope I can redeem
        myself for it.`
      ),
      new CharacteristicOption(
        `Someone I loved died because of a mistake I made.`
      ),
      new CharacteristicOption(
        `That will never happen again.`
      )
    ]),
    new Flaws([
      new CharacteristicOption(
        `When I see something valuable, I can't think about
        anything but how to steal it.`
      ),
      new CharacteristicOption(
        `When faced with a choice between money and my
        friends, I usually choose the money.`
      ),
      new CharacteristicOption(
        `If there's a plan, I'll forget it. If I don't forget it, I'll
        ignore it.`
      ),
      new CharacteristicOption(
        `I have a “tell” that reveals when I'm lying.`
      ),
      new CharacteristicOption(
        `I turn tail and run when things look bad.`
      ),
      new CharacteristicOption(
        `An innocent person is in prison for a crime that I
        committed. I'm okay with that.`
      )
    ]),
    new Feature(
      `You have a reliable and trustworthy contact w ho acts as
      your liaison to a network o f other criminals. You know
      how to get messages to and from your contact, even
      over great distances; specifically, you know the local
      messengers, corrupt caravan masters, and seedy sailors
      who can deliver m essages for you.`,
      `Criminal Contact`
    ),
    [
      SKILL.DECEPTION,
      SKILL.STEALTH,
      Choices(
        1,
        [
          Condition([TOOL.CATEGORY.GAMING_SET])
        ]
      ),
      TOOL.THIEVES_TOOLS
    ],
    [
      Equipment(GEAR.CROWBAR),
      Equipment(GEAR.CLOTHES_COMMON_DARK),
      Gold(15)
    ],
    null,
    new Characteristic(
      [
        new CharacteristicOption(`Blackmailer`),
        new CharacteristicOption(`Burglar`),
        new CharacteristicOption(`Enforcer`),
        new CharacteristicOption(`Fence`),
        new CharacteristicOption(`Highway robber`),
        new CharacteristicOption(`Hired killer`),
        new CharacteristicOption(`Pickpocket`),
        new CharacteristicOption(`Smuggler`)
      ],
      'Criminal Specialty'
    ),
    new Variant(
      `Although your capabilities are not much different
      from those of a burglar or smuggler, you learned
      and practiced them in a very different context: as an
      espionage agent. You might have been an officially
      sanctioned agent of the crown, or perhaps you sold the
      secrets you uncovered to the highest bidder.`,
      `Spy`
    )
  );

  backgrounds[BACKGROUND.ENTERTAINER.VALUE] = new Background(
    'Entertainer',
    new PersonalityTraits([
      new CharacteristicOption(
        `I know a story relevant to almost every situation.`
      ),
      new CharacteristicOption(
        `Whenever I come to a new place, I collect local rumors
        and spread gossip.`
      ),
      new CharacteristicOption(
        `I'm a hopeless romantic, always searching for that
        “special someone.”`
      ),
      new CharacteristicOption(
        `Nobody stays angry at me or around me for long, since
         I can defuse any amount of tension.`
      ),
      new CharacteristicOption(
        `I love a good insult, even one directed at me.`
      ),
      new CharacteristicOption(
        `I get bitter if I'm not the center of attention.`
      ),
      new CharacteristicOption(
        `I'll settle for nothing less than perfection.`
      ),
      new CharacteristicOption(
        `I change my mood or my mind as quickly as I change
        key in a song.`
      )
    ]),
    new Ideals([
      new CharacteristicOption(
        `When I perform, I make the world better than
        it was. (Good)`,
        `Beauty.`
      ),
      new CharacteristicOption(
        `The stories, legends, and songs o f the past
        must never be forgotten, for they teach us who we
        are. (Lawful)`,
        `Tradition.`
      ),
      new CharacteristicOption(
        `The world is in need of new ideas and bold
       action. (Chaotic)`,
       `Creativity.`
      ),
      new CharacteristicOption(
        `I'm only in it for the money and fame. (Evil)`,
        `Greed.`
      ),
      new CharacteristicOption(
        `I like seeing the smiles on people's faces when
        I perform. That's all that matters. (Neutral)`,
        `People.`
      ),
      new CharacteristicOption(
        `Art should reflect the soul; it should come
        from within and reveal who we really are. (Any)`,
        `Honesty.`
      )
    ]),
    new Bonds([
      new CharacteristicOption(
        `My instrument is my most treasured possession, and it
        reminds me of someone I love.`
      ),
      new CharacteristicOption(
        `Someone stole my precious instrument, and someday
         I'll get it back.`
      ),
      new CharacteristicOption(
        `I want to be famous, whatever it takes.`
      ),
      new CharacteristicOption(
        `I idolize a hero of the old tales and measure my deeds
         against that person's.`
      ),
      new CharacteristicOption(
        `I will do anything to prove myself superior to my hated
        rival.`
      ),
      new CharacteristicOption(
        `I would do anything for the other members of my
        old troupe.`
      )
    ]),
    new Flaws([
      new CharacteristicOption(
        `I'll do anything to win fame and renown.`
      ),
      new CharacteristicOption(
        `I'm a sucker for a pretty face.`
      ),
      new CharacteristicOption(
        `A scandal prevents me from ever going home again.
        That kind of trouble seems to follow me around.`
      ),
      new CharacteristicOption(
        `I once satirized a noble who still wants my head. It was
        a mistake that I will likely repeat.`
      ),
      new CharacteristicOption(
        `I have trouble keeping my true feelings hidden. My
        sharp tongue lands me in trouble.`
      ),
      new CharacteristicOption(
        `Despite my best efforts, I am unreliable to my friends.`
      )
    ]),
    new Feature(
      `You can always find a place to perform, usually in an
      inn or tavern but possibly with a circus, at a theater, or
      even in a noble's court. At such a place, you receive free
      lodging and food of a modest or comfortable standard
      (depending on the quality of the establishment), as
      long as you perform each night. In addition, your
      performance makes you something of a local figure.
      When strangers recognize you in a town where you have
      performed, they typically take a liking to you.`,
      `By Popular Demand`
    ),
    [
      SKILL.ACROBATICS,
      SKILL.PERFORMANCE,
      TOOL.DISGUISE_KIT,
      Choices(
        1,
        [
          Condition([TOOL.CATEGORY.MUSICAL_INSTRUMENT])
        ]
      )
    ],
    [
      Choices(
        1,
        [
          Condition([TOOL.CATEGORY.MUSICAL_INSTRUMENT])
        ]
      ),
      Choices(
        1,
        [
          Condition([GEAR.TYPE.FAVOR])
        ]
      ),
      Equipment(GEAR.CLOTHES_COSTUME),
      Gold(15)
    ],
    null,
    new Characteristic(
      [
        new CharacteristicOption(`Actor`),
        new CharacteristicOption(`Dancer`),
        new CharacteristicOption(`Fire-eater`),
        new CharacteristicOption(`Jester`),
        new CharacteristicOption(`Juggler`),
        new CharacteristicOption(`Instrumentalist`),
        new CharacteristicOption(`Poet`),
        new CharacteristicOption(`Singer`),
        new CharacteristicOption(`Storyteller`),
        new CharacteristicOption(`Tumbler`),
      ],
      'Entertainer Routines'
    ),
    new Variant(
      `A gladiator is as much an entertainer as any minstrel
      or circus performer, trained to make the arts of combat
      into a spectacle the crowd can enjoy. This kind of
      flashy combat is your entertainer routine, though you
      might also have some skills as a tumbler or actor.
      Using your By Popular D emand feature, you can find a
      place to perform in any place that features combat for
      entertainment—perhaps a gladiatorial arena or secret
      pit fighting club. You can replace the musical instrument
      in your equipment package with an inexpensive but
      unusual weapon, such as a trident or net.`,
      'Gladiator'
    )
  );

  backgrounds[BACKGROUND.FOLK_HERO.VALUE] = new Background(
    'Folk Hero',
    new PersonalityTraits([
      new CharacteristicOption(
        `I judge people by their actions, not their words.`
      ),
      new CharacteristicOption(
        `If someone is in trouble, I'm always ready to lend help.`
      ),
      new CharacteristicOption(
        `When I set my mind to something, I follow through no
        matter what gets in my way.`
      ),
      new CharacteristicOption(
        `I have a strong sense of fair play and always try to find
        the most equitable solution to arguments.`
      ),
      new CharacteristicOption(
        `I'm confident in my own abilities and do what I can to
        instill confidence in others.`
      ),
      new CharacteristicOption(
        `Thinking is for other people. I prefer action.`
      ),
      new CharacteristicOption(
        `I misuse long words in an attempt to sound smarter.`
      ),
      new CharacteristicOption(
        `I get bored easily. When am I going to get on with my
        destiny?`
      )
    ]),
    new Ideals([
      new CharacteristicOption(
        `People deserve to be treated with dignity and
        respect. (Good)`,
        `Respect.`
      ),
      new CharacteristicOption(
        `No one should get preferential treatment
        before the law, and no one is above the law. (Lawful)`,
        `Fairness.`
      ),
      new CharacteristicOption(
        `Tyrants must not be allowed to oppress the
        people. (Chaotic)`,
        `Freedom.`
      ),
      new CharacteristicOption(
        `If I become strong, I can take what I want—
        what I deserve. (Evil)`,
        `Might.`
      ),
      new CharacteristicOption(
        `There's no good in pretending to be
        something I'm not. (Neutral)`,
        `Sincerity.`
      ),
      new CharacteristicOption(
        `Nothing and no one can steer me away from
        my higher calling. (Any)`,
        `Destiny.`
      )
    ]),
    new Bonds([
      new CharacteristicOption(
        `I have a family, but I have no idea where they are. One
        day, I hope to see them again.`
      ),
      new CharacteristicOption(
        `I worked the land, I love the land, and I will protect the
        land.`
      ),
      new CharacteristicOption(
        `A proud noble once gave me a horrible beating, and I
        will take my revenge on any bully I encounter.`
      ),
      new CharacteristicOption(
        `My tools are symbols of my past life, and I carry them
        so that I will never forget my roots.`
      ),
      new CharacteristicOption(
        `I protect those who cannot protect themselves.`
      ),
      new CharacteristicOption(
        `I wish my childhood sweetheart had come with me to
        pursue my destiny.`
      )
    ]),
    new Flaws([
      new CharacteristicOption(
        `The tyrant who rules my land will stop at nothing to
        see me killed.`
      ),
      new CharacteristicOption(
        `I'm convinced of the significance of my destiny, and
        blind to my shortcomings and the risk of failure.`
      ),
      new CharacteristicOption(
        `The people who knew me when I was young know my
        shameful secret, so I can never go home again.`
      ),
      new CharacteristicOption(
        `I have a weakness for the vices of the city, especially
        hard drink.`
      ),
      new CharacteristicOption(
        `Secretly, I believe that things would be better if I were a
        tyrant lording over the land.`
      ),
      new CharacteristicOption(
        `I have trouble trusting in my allies.`
      )
    ]),
    new Feature(
      `Since you come from the ranks of the common folk,
      you fit in among them with ease. You can find a place
      to hide, rest, or recuperate among other commoners,
      unless you have shown yourself to be a danger to
      them. They will shield you from the law or anyone
      else searching for you, though they w ill not risk
      their lives for you.`,
      `Rustic Hospitality`
    ),
    [
      SKILL.ANIMAL_HANDLING,
      SKILL.SURVIVAL,
      Choices(
        1,
        [
          Condition([TOOL.CATEGORY.ARTISAN])
        ]
      ),
      VEHICLE.TYPE.LAND
    ],
    [
      Choices(
        1,
        [
          Condition([TOOL.CATEGORY.ARTISAN])
        ]
      ),
      Equipment(GEAR.SHOVEL),
      Equipment(GEAR.POT_IRON),
      Equipment(GEAR.CLOTHES_COMMON),
      Gold(10)
    ],
    null,
    new Characteristic(
      [
        new CharacteristicOption(
          `I stood up to a tyrant's agents.`
        ),
        new CharacteristicOption(
          `I saved people during a natural disaster.`
        ),
        new CharacteristicOption(
          `I stood alone against a terrible monster.`
        ),
        new CharacteristicOption(
          `I stole from a corrupt merchant to help the poor.`
        ),
        new CharacteristicOption(
          `I led a militia to fight off an invading army.`
        ),
        new CharacteristicOption(
          `I broke into a tyrant's castle and stole weapons to arm
          the people.`
        ),
        new CharacteristicOption(
          `I trained the peasantry to use farm implements as
          weapons against a tyrant's soldiers.`
        ),
        new CharacteristicOption(
          `A lord rescinded an unpopular decree after I led a
          symbolic act of protect against it.`
        ),
        new CharacteristicOption(
          `A celestial, fey, or similar creature gave me a blessing
          or revealed my secret origin.`
        ),
        new CharacteristicOption(
          `Recruited into a lord's army, I rose to leadership and
          was commended for my heroism.`
        )
      ],
      'Defining Event'
    )
  );

  backgrounds[BACKGROUND.GUILD_ARTISAN.VALUE] = new Background(
    'Guild Artisan',
    new PersonalityTraits([
      new CharacteristicOption(
        `I believe that anything worth doing is worth doing
        right. I can't help it— I'm a perfectionist.`
      ),
      new CharacteristicOption(
        `I'm a snob who looks down on those who can't
        appreciate fine art.`
      ),
      new CharacteristicOption(
        `I always want to know how things work and what
        makes people tick.`
      ),
      new CharacteristicOption(
        `I'm full of witty aphorisms and have a proverb for
        every occasion.`
      ),
      new CharacteristicOption(
        `I'm rude to people who lack my commitment to hard
        work and fair play.`
      ),
      new CharacteristicOption(
        `I like to talk at length about my profession.`
      ),
      new CharacteristicOption(
        `I don't part with my money easily and will haggle
        tirelessly to get the best deal possible.`
      ),
      new CharacteristicOption(
        `I'm well known for my work, and I want to make sure
        everyone appreciates it. I'm always taken aback when
        people haven't heard of me.`
      )
    ]),
    new Ideals([
      new CharacteristicOption(
        `It is the duty of all civilized people to
        strengthen the bonds of community and the security
        of civilization. (Lawful)`,
        `Community.`
      ),
      new CharacteristicOption(
        `My talents were given to me so that I could
        use them to benefit the world. (Good)`,
        `Generosity.`
      ),
      new CharacteristicOption(
        `Everyone should be free to pursue his or her
        own livelihood. (Chaotic)`,
        `Freedom.`
      ),
      new CharacteristicOption(
        `I'm only in it for the money. (Evil)`,
        `Greed.`
      ),
      new CharacteristicOption(
        `I'm committed to the people I care about, not
        to ideals. (Neutral)`,
        `People.`
      ),
      new CharacteristicOption(
        `I work hard to be the best there is at
        my craft.`,
        `Aspiration.`
      )
    ]),
    new Bonds([
      new CharacteristicOption(
        `The workshop where I learned my trade is the most
        important place in the world to me.`
      ),
      new CharacteristicOption(
        `I created a great work for someone, and then found
        them unworthy to receive it. I'm still looking for
        someone worthy.`
      ),
      new CharacteristicOption(
        `I owe my guild a great debt for forging me into the
        person I am today.`
      ),
      new CharacteristicOption(
        `I pursue wealth to secure someone's love.`
      ),
      new CharacteristicOption(
        `One day I will return to my guild and prove that I am
        the greatest artisan of them all.`
      ),
      new CharacteristicOption(
        `I will get revenge on the evil forces that destroyed my
        place of business and ruined my livelihood.`
      )
    ]),
    new Flaws([
      new CharacteristicOption(
        `I'll do anything to get my hands on something rare or
        priceless.`
      ),
      new CharacteristicOption(
        `I'm quick to assume that someone is trying to cheat
        me.`
      ),
      new CharacteristicOption(
        `No one must ever learn that I once stole money from
        guild coffers.`
      ),
      new CharacteristicOption(
        `I'm never satisfied with what I have— I always want
        more.`
      ),
      new CharacteristicOption(
        `I would kill to acquire a noble title.`
      ),
      new CharacteristicOption(
        `I'm horribly jealous of anyone who can outshine my
        handiwork. Everywhere I go, I'm surrounded by rivals.`
      )
    ]),
    new Feature(
      `As an established and respected member of a guild, you
      can rely on certain benefits that membership provides.
      Your fellow guild members will provide you with
      lodging and food if necessary, and pay for your funeral
      if needed. In some cities and towns, a guildhall offers a
      central place to meet other members of your profession,
      which can be a good place to meet potential patrons,
      allies, or hirelings.
      Guilds often wield tremendous political power. If
      you are accused of a crime, your guild will support you
      if a good case can be made for your innocence or the
      crime is justifiable. You can also gain access to powerful
      political figures through the guild, if you are a member
      in good standing. Such connections might require the
      donation of money or magic items to the guild's coffers.
      You must pay dues of 5 gp per month to the guild. If
      you miss payments, you must make up back dues to
      remain in the guild's good graces.`,
      `Guild Membership`
    ),
    [
      SKILL.INSIGHT,
      SKILL.PERSUASION,
      Choices(
        1,
        [
          Condition([TOOL.CATEGORY.ARTISAN])
        ]
      )
    ],
    [
      Choices(
        1,
        [
          Condition([TOOL.CATEGORY.ARTISAN])
        ]
      ),
      Equipment(GEAR.GUILD_LETTER),
      Equipment(GEAR.CLOTHES_TRAVELERS),
      Gold(15)
    ],
    1,
    new Characteristic(
      [
        new CharacteristicOption(`Alchemists and apothecaries`),
        new CharacteristicOption(`Armorers, locksmiths, and finesmiths`),
        new CharacteristicOption(`Brewers, distillers, and vintners`),
        new CharacteristicOption(`Calligraphers, scribes, and scriveners`),
        new CharacteristicOption(`Carpenters, roofers, and plasterers`),
        new CharacteristicOption(`Cartographers, surveyors, and chart-makers`),
        new CharacteristicOption(`Cobblers and shoemakers`),
        new CharacteristicOption(`Cooks and bakers`),
        new CharacteristicOption(`Glassblowers and glaziers`),
        new CharacteristicOption(`Jewelers and gemcutters`),
        new CharacteristicOption(`Leatherworkers, skinners, and tanners`),
        new CharacteristicOption(`Masons and stonecutters`),
        new CharacteristicOption(`Painters, limners, and sign-makers`),
        new CharacteristicOption(`Potters and tile-makers`),
        new CharacteristicOption(`Shipwrights and sailmakers`),
        new CharacteristicOption(`Smiths and metal-forgers`),
        new CharacteristicOption(`Tinkers, pewterers, and casters`),
        new CharacteristicOption(`Wagon-makers and wheelwrights`),
        new CharacteristicOption(`Weavers and dyers`),
        new CharacteristicOption(`Woodcarvers, coopers, and bowyers`),
      ],
      `Guild Business`
    ),
    new Variant(
      `Instead of an artisans' guild, you might belong to a
      guild of traders, caravan masters, or shopkeepers. You
      don't craft items yourself but earn a living by buying
      and selling the works o f others (or the raw materials
      artisans need to practice their craft). Your guild might
      be a large merchant consortium (or family) with
      interests across the region. Perhaps you transported
      goods from one place to another, by ship, wagon, or
      caravan, or bought them from traveling traders and sold
      them in your own little shop. In some ways, the traveling
      merchant's life lends itself to adventure far more than
      the life of an artisan.
      Rather than proficiency with artisan's tools, you might
      be proficient with navigator's tools or an additional
      language. And instead of artisan's tools, you can start
      with a mule and a cart.`,
      `Guild Merchant`
    )
  );

  backgrounds[BACKGROUND.HERMIT.VALUE] = new Background(
    'Hermit',
    new PersonalityTraits([
      new CharacteristicOption(
        `I've been isolated for so long that I rarely speak,
        preferring gestures and the occasional grunt.`
      ),
      new CharacteristicOption(
        `I am utterly serene, even in the face of disaster.`
      ),
      new CharacteristicOption(
        `The leader of my community had something wise
        to say on every topic, and I am eager to share
        that wisdom.`
      ),
      new CharacteristicOption(
        `I feel tremendous empathy for all who suffer.`
      ),
      new CharacteristicOption(
        `I'm oblivious to etiquette and social expectations.`
      ),
      new CharacteristicOption(
        `I connect everything that happens to me to a grand,
        cosmic plan.`
      ),
      new CharacteristicOption(
        `I often get lost in my own thoughts and contemplation,
        becoming oblivious to my surroundings.`
      ),
      new CharacteristicOption(
        `I am working on a grand philosophical theory and love
        sharing my ideas.`
      )
    ]),
    new Ideals([
      new CharacteristicOption(
        `My gifts are meant to be shared with all,
        not used for my own benefit. (Good)`,
        `Greater Good.`
      ),
      new CharacteristicOption(
        `Emotions must not cloud our sense of what is
        right and true, or our logical thinking. (Lawful)`,
        `Logic.`
      ),
      new CharacteristicOption(
        `Inquiry and curiosity are the pillars of
        progress. (Chaotic)`,
        `Free Thinking.`
      ),
      new CharacteristicOption(
        `Solitude and contemplation are paths toward
        mystical or magical power. (Evil)`,
        `Power.`
      ),
      new CharacteristicOption(
        `Meddling in the affairs of others only
        causes trouble. (Neutral)`,
        `Live and Let Live.`
      ),
      new CharacteristicOption(
        `If you know yourself, there's nothing
        left to know. (Any)`,
        `Self-Knowledge.`
      )
    ]),
    new Bonds([
      new CharacteristicOption(
        `Nothing is more important than the other members of
        my hermitage, order, or association.`
      ),
      new CharacteristicOption(
        `I entered seclusion to hide from the ones who might
        still be hunting me. I must someday confront them.`
      ),
      new CharacteristicOption(
        `I'm still seeking the enlightenment I pursued in my
        seclusion, and it still eludes me.`
      ),
      new CharacteristicOption(
        `I entered seclusion because I loved someone I could
        not have.`
      ),
      new CharacteristicOption(
        `Should my discovery come to light, it could bring ruin to
        the world.`
      ),
      new CharacteristicOption(
        `My isolation gave me great insight into a great evil that
        only I can destroy.`
      )
    ]),
    new Flaws([
      new CharacteristicOption(
        `Now that I've returned to the world, I enjoy its delights
        a little too much.`
      ),
      new CharacteristicOption(
        `I harbor dark, bloodthirsty thoughts that my isolation
        and meditation failed to quell.`
      ),
      new CharacteristicOption(
        `I am dogmatic in my thoughts and philosophy.`
      ),
      new CharacteristicOption(
        `I let my need to win arguments overshadow
        friendships and harmony.`
      ),
      new CharacteristicOption(
        `I'd risk too much to uncover a lost bit of knowledge.`
      ),
      new CharacteristicOption(
        `I like keeping secrets and won't share them with
        anyone.`
      )
    ]),
    new Feature(
      `The quiet seclusion of your extended hermitage gave you
      access to a unique and powerful discovery. The exact
      nature of this revelation depends on the nature of your
      seclusion. It might be a great truth about the cosmos,
      the deities, the powerful beings of the outer planes, or
      the forces of nature. It could be a site that no one else
      has ever seen. You might have uncovered a fact that has
      long been forgotten, or unearthed some relic of the past
      that could rewrite history. It might be information that
      would be damaging to the people who or consigned you
      to exile, and hence the reason for your return to society.
      Work with your DM to determine the details of your
      discovery and its impact on the campaign.`,
      `Discovery`
    ),
    [
      SKILL.MEDICINE,
      SKILL.RELIGION,
      TOOL.HERBALISM_KIT
    ],
    [
      Equipment(GEAR.CASE_SCROLL_FILLED),
      Equipment(GEAR.BLANKET),
      Equipment(GEAR.CLOTHES_COMMON),
      Equipment(TOOL.HERBALISM_KIT),
      Gold(5)
    ],
    1,
    new Characteristic(
      [
        new CharacteristicOption(
          `I was searching for spiritual enlightenment.`
        ),
        new CharacteristicOption(
          `I was partaking of communal living in accordance with
          the dictates of a religious order.`
        ),
        new CharacteristicOption(
            `I was exiled for a crime I didn't commit.`
        ),
        new CharacteristicOption(
          `I retreated from society after a life-altering event.`
        ),
        new CharacteristicOption(
          `I needed a quiet place to work on my art, literature,
          music, or manifesto.`
        ),
        new CharacteristicOption(
          `I needed to commune with nature, far from civilization.`
        ),
        new CharacteristicOption(
          `I was the caretaker of an ancient ruin or relic.`
        ),
        new CharacteristicOption(
          `I was a pilgrim in search of a person, place, or relic of
          spiritual significance.`
        )
      ],
      `Life of Seclusion`
    )
  );

  backgrounds[BACKGROUND.NOBLE.VALUE] = new Background(
    'Noble',
    new PersonalityTraits([
      new CharacteristicOption(
        `My eloquent flattery makes everyone I talk to feel
        like the most wonderful and important person in the
        world.`
      ),
      new CharacteristicOption(
        `The common folk love me for my kindness and
        generosity.`
      ),
      new CharacteristicOption(
        `No one could doubt by looking at my regal bearing that
        I am a cut above the unwashed masses.`
      ),
      new CharacteristicOption(
        `I take great pains to always look my best and follow the
        latest fashions.`
      ),
      new CharacteristicOption(
        `I don't like to get my hands dirty, and I won't be caught
        dead in unsuitable accommodations.`
      ),
      new CharacteristicOption(
        `Despite my noble birth, I do not place myself above
        other folk. We all have the same blood.`
      ),
      new CharacteristicOption(
        `My favor, once lost, is lost forever.`
      ),
      new CharacteristicOption(
        `If you do me an injury, I will crush you, ruin your name,
        and salt your fields.`
      )
    ]),
    new Ideals([
      new CharacteristicOption(
        `Respect is due to me because of my position,
        but all people regardless of station deserve to be
        treated with dignity. (Good)`,
        `Respect.`
      ),
      new CharacteristicOption(
        `It is my duty to respect the authority of
        those above me, just as those below me must respect
        mine. (Lawful)`,
        `Responsibility.`
      ),
      new CharacteristicOption(
        `I must prove that I can handle myself
        without the coddling of my family. (Chaotic)`,
        `Independence.`
      ),
      new CharacteristicOption(
        `If I can attain more power, no one will tell me
        what to do. (Evil)`,
        `Power.`
      ),
      new CharacteristicOption(
        `Blood runs thicker than water. (Any)`,
        `Family.`
      ),
      new CharacteristicOption(
        `It is my duty to protect and care for
        the people beneath me. (Good)`,
        `Noble Obligation.`
      )
    ]),
    new Bonds([
      new CharacteristicOption(
        `I will face any challenge to win the approval of my
        family.`
      ),
      new CharacteristicOption(
        `My house's alliance with another noble family
        must be sustained at all costs.`
      ),
      new CharacteristicOption(
        `Nothing is more important than the other members
        of my family.`
      ),
      new CharacteristicOption(
        `I am in love with the heir of a family that my family
        despises.`
      ),
      new CharacteristicOption(
        `My loyalty to my sovereign is unwavering.`
      ),
      new CharacteristicOption(
        `The common folk must see me as a hero of the people.`
      )
    ]),
    new Flaws([
      new CharacteristicOption(
        `I secretly believe that everyone is beneath me.`
      ),
      new CharacteristicOption(
        `I hide a truly scandalous secret that could ruin my
        family forever.`
      ),
      new CharacteristicOption(
        `I too often hear veiled insults and threats in every word
        addressed to me, and I'm quick to anger.`
      ),
      new CharacteristicOption(
        `I have an insatiable desire for carnal pleasures.`
      ),
      new CharacteristicOption(
        `In fact, the world does revolve around me.`
      ),
      new CharacteristicOption(
        `By my words and actions, I often bring shame to
        my family.`
      )
    ]),
    new Feature(
      `Thanks to your noble birth, people are inclined to
      think the best of you. You are w elcome in high society,
      and people assume you have the right to be wherever
      you are. The common folk make every effort to
      accommodate you and avoid your displeasure, and other
      people of high birth treat you as a member of the same
      social sphere. You can secure an audience with a local
      noble if you need to.`,
      `Position of Privelege`
    ),
    [
      SKILL.HISTORY,
      SKILL.PERSUASION,
      Choices(
        1,
        [
          Condition([TOOL.CATEGORY.GAMING_SET])
        ]
      )
    ],
    [
      Equipment(GEAR.CLOTHES_FINE),
      Equipment(GEAR.SIGNET_RING),
      Equipment(GEAR.SCROLL_OF_PEDIGREE),
      Gold(25)
    ],
    1,
    null,
    new Variant(
      `A knighthood is among the lowest noble titles in most
      societies, but it can be a path to higher status. If you
      wish to be a knight, choose the Retainers feature (see
      the sidebar) instead of the Position o f Privilege feature.
      One of your commoner retainers is replaced by a noble
      who serves as your squire, aiding you in exchange for
      training on his or her own path to knighthood. Your two
      remaining retainers might include a groom to care for
      your horse and a servant who polishes your armor (and
      even helps you put it on).
      As an emblem of chivalry and the ideals of courtly
      love, you might include among your equipment a banner
      or other token from a noble lord or lady to whom you
      have given your heart—in a chaste sort of devotion.
      (This person could be your bond.)`,
      `Knight`
    ),
    new VariantFeature(
      `If your character has a noble background, you may select this
      background feature instead of Position of Privilege.
      You have the service of three retainers loyal to your family.
      These retainers can be attendants or messengers, and one
      might be a majordomo. Your retainers are commoners who
      can perform mundane tasks for you, but they do not fight
      for you, will not follow you into obviously dangerous areas
      (such as dungeons), and will leave if they are frequently
      endangered or abused.`,
      `Retainers`
    )
  );

  backgrounds[BACKGROUND.OUTLANDER.VALUE] = new Background(
    'Outlander',
    new PersonalityTraits([
      new CharacteristicOption(
        `I'm driven by a wanderlust that led me away
        from home.`
      ),
      new CharacteristicOption(
        `I watch over my friends as if they were a litter of
        newborn pups.`
      ),
      new CharacteristicOption(
        `I once ran twenty-five miles without stopping to warn
        to my clan of an approaching orc horde. I'd do it again
        if I had to.`
      ),
      new CharacteristicOption(
        `I have a lesson for every situation, drawn from
        observing nature.`
      ),
      new CharacteristicOption(
        `I place no stock in wealthy or well-mannered folk.
        Money and manners won't save you from a hungry
        owlbear.`
      ),
      new CharacteristicOption(
        `I'm always picking things up, absently fiddling with
        them, and sometimes accidentally breaking them.`
      ),
      new CharacteristicOption(
        `I feel far more comfortable around animals than
        people.`
      ),
      new CharacteristicOption(
        `I was, in fact, raised by wolves.`
      )
    ]),
    new Ideals([
      new CharacteristicOption(
        `Life is like the seasons, in constant change,
        and we must change with it. (Chaotic)`,
        `Change.`
      ),
      new CharacteristicOption(
        `It is each person's responsibility to
        make the most happiness for the whole tribe. (Good)`,
        `Greater Good.`
      ),
      new CharacteristicOption(
        `If I dishonor myself, I dishonor my whole
        clan. (Lawful)`,
        `Honor.`
      ),
      new CharacteristicOption(
        `The strongest are meant to rule. (Evil)`,
        `Might.`
      ),
      new CharacteristicOption(
        `The natural world is more important than all
        the constructs of civilization. (Neutral)`,
        `Nature.`
      ),
      new CharacteristicOption(
        `I must earn glory in battle, for myself and
        my clan. (Any)`,
        `Glory.`
      )
    ]),
    new Bonds([
      new CharacteristicOption(
        `My family, clan, or tribe is the most important thing in
        my life, even when they are far from me.`
      ),
      new CharacteristicOption(
        `An injury to the unspoiled wilderness of my home is an
        injury to me.`
      ),
      new CharacteristicOption(
        `I will bring terrible wrath down on the evildoers who
        destroyed my homeland.`
      ),
      new CharacteristicOption(
        `I am the last of my tribe, and it is up to me to ensure
        their names enter legend.`
      ),
      new CharacteristicOption(
        `I suffer awful visions of a coming disaster and will do
        anything to prevent it.`
      ),
      new CharacteristicOption(
        `It is my duty to provide children to sustain my tribe.`
      )
    ]),
    new Flaws([
      new CharacteristicOption(
        `I am too enamored of ale, wine, and other intoxicants.`
      ),
      new CharacteristicOption(
        `There's no room for caution in a life lived to the fullest.`
      ),
      new CharacteristicOption(
        `I remember every insult I've received and nurse a silent
        resentment toward anyone who's ever wronged me.`
      ),
      new CharacteristicOption(
        `I am slow to trust members of other races, tribes, and
        societies.`
      ),
      new CharacteristicOption(
        `Violence is my answer to almost any challenge.`
      ),
      new CharacteristicOption(
        `Don't expect me to save those who can't save
        themselves. It is nature's way that the strong thrive
        and the weak perish.`
      )
    ]),
    new Feature(
      `You have an excellent memory for maps and geography,
      and you can always recall the general layout of terrain,
      settlements, and other features around you. In addition,
      you can find food and fresh water for yourself and up to
      five other people each day, provided that the land offers
      berries, small game, water, and so forth.`,
      `Wanderer`
    ),
    [
      SKILL.ATHLETICS,
      SKILL.SURVIVAL,
      Choices(
        1,
        [
          Condition([TOOL.CATEGORY.MUSICAL_INSTRUMENT])
        ]
      )
    ],
    [
      Equipment(GEAR.STAFF),
      Equipment(GEAR.HUNTING_TRAP),
      Equipment(GEAR.ANIMAL_TROPHY),
      Equipment(GEAR.CLOTHES_TRAVELERS),
      Gold(10)
    ],
    1,
    new Characteristic(
      [
        new CharacteristicOption(`Forester`),
        new CharacteristicOption(`Trapper`),
        new CharacteristicOption(`Homesteader`),
        new CharacteristicOption(`Guide`),
        new CharacteristicOption(`Exile or outcast`),
        new CharacteristicOption(`Bounty hunter`),
        new CharacteristicOption(`Pilgrim`),
        new CharacteristicOption(`Tribal nomad`),
        new CharacteristicOption(`Hunter-gatherer`),
        new CharacteristicOption(`Tribal marauder`),
      ],
      `Origin`
    )
  );

  backgrounds[BACKGROUND.SAGE.VALUE] = new Background(
    'Sage',
    new PersonalityTraits([
      new CharacteristicOption(
        `I use polysyllabic words that convey the impression of
        great erudition.`
      ),
      new CharacteristicOption(
        `I've read every book in the world's greatest libraries—
        or I like to boast that I have.`
      ),
      new CharacteristicOption(
        `I'm used to helping out those who aren't as smart as I
        am, and I patiently explain anything and everything to
        others.`
      ),
      new CharacteristicOption(
        `There's nothing I like more than a good mystery.`
      ),
      new CharacteristicOption(
        `I'm willing to listen to every side of an argument before
        I make my own judgment.`
      ),
      new CharacteristicOption(
        `I . . . speak . . . slowly . . . when talking . . . to idiots, . . .
        which . . . almost . . . everyone . . . is . . . compared . . .
        to me.`
      ),
      new CharacteristicOption(
        `I am horribly, horribly awkward in social situations.`
      ),
      new CharacteristicOption(
        `I'm convinced that people are always trying to steal my
        secrets.`
      )
    ]),
    new Ideals([
      new CharacteristicOption(
        `The path to power and self-improvement
        is through knowledge. (Neutral)`,
        `Knowledge.`
      ),
      new CharacteristicOption(
        `What is beautiful points us beyond itself
        toward what is true. (Good)`,
        `Beauty.`
      ),
      new CharacteristicOption(
        `Emotions must not cloud our logical thinking.
        (Lawful)`,
        `Logic.`
      ),
      new CharacteristicOption(
        `Nothing should fetter the infinite possibility
        inherent in all existence. (Chaotic)`,
        `No Limits.`
      ),
      new CharacteristicOption(
        `Knowledge is the path to power and
        domination. (Evil)`,
        `Power.`
      ),
      new CharacteristicOption(
        `The goal of a life of study is the
        betterment of oneself. (Any)`,
        `Self-Improvement.`
      )
    ]),
    new Bonds([
      new CharacteristicOption(
        `It is my duty to protect my students.`
      ),
      new CharacteristicOption(
        `I have an ancient text that holds terrible secrets that
        must not fall into the wrong hands.`
      ),
      new CharacteristicOption(
        `I work to preserve a library, university, scriptorium,
        or monastery.`
      ),
      new CharacteristicOption(
        `My life's work is a series o f tomes related to a specific
        field of lore.`
      ),
      new CharacteristicOption(
        `I've been searching my whole life for the answer to a
        certain question.`
      ),
      new CharacteristicOption(
        `I sold my soul for knowledge. I hope to do great deeds
        and win it back.`
      )
    ]),
    new Flaws([
      new CharacteristicOption(
        `I am easily distracted by the promise of information.`
      ),
      new CharacteristicOption(
        `Most people scream and run when they see a demon. I
        stop and take notes on its anatomy.`
      ),
      new CharacteristicOption(
        `Unlocking an ancient mystery is worth the price of a
        civilization.`
      ),
      new CharacteristicOption(
        `I overlook obvious solutions in favor of complicated
        ones.`
      ),
      new CharacteristicOption(
        `I speak without really thinking through my words,
        invariably insulting others.`
      ),
      new CharacteristicOption(
        `I can't keep a secret to save my life, or anyone else's.`)
    ]),
    new Feature(
      `When you attempt to learn or recall a piece of lore, if you
      do not know that information, you often know where and
      from whom you can obtain it. Usually, this information
      comes from a library, scriptorium, university, or a sage
      or other learned person or creature. Your DM might
      rule that the knowledge you seek is secreted away in an
      almost inaccessible place, or that it simply cannot be
      found. Unearthing the deepest secrets o f the multiverse
      can require an adventure or even a whole campaign.`,
      `Researcher`
    ),
    [
      SKILL.ARCANA,
      SKILL.HISTORY
    ],
    [
      Equipment(GEAR.INK_BOTTLE),
      Equipment(GEAR.INK_PEN),
      Equipment(GEAR.SMALL_KNIFE),
      Equipment(GEAR.COLLEAGUES_LETTER),
      Equipment(GEAR.CLOTHES_COMMON),
      Gold(10)
    ],
    2,
    new Characteristic(
      [
        new CharacteristicOption(`Alchemist`),
        new CharacteristicOption(`Astronomer`),
        new CharacteristicOption(`Discredited academic`),
        new CharacteristicOption(`Librarian`),
        new CharacteristicOption(`Professor`),
        new CharacteristicOption(`Researcher`),
        new CharacteristicOption(`Wizard's apprentice`),
        new CharacteristicOption(`Scribe`),
      ],
      `Specialty`
    )
  );

  backgrounds[BACKGROUND.SAILOR.VALUE] = new Background(
    'Sailor',
    new PersonalityTraits([
      new CharacteristicOption(
        `My friends know they can rely on me, no matter what.`
      ),
      new CharacteristicOption(
        `I work hard so that I can play hard when the work
        is done.`
      ),
      new CharacteristicOption(
        `I enjoy sailing into new ports and making new friends
        over a flagon of ale.`
      ),
      new CharacteristicOption(
        `I stretch the truth for the sake of a good story.`
      ),
      new CharacteristicOption(
        `To me, a tavern brawl is a nice way to get to know a
        new city.`
      ),
      new CharacteristicOption(
        `I never pass up a friendly wager.`
      ),
      new CharacteristicOption(
        `My language is as foul as an otyugh nest.`
      ),
      new CharacteristicOption(
        `I like a job well done, especially if I can convince
        someone else to do it.`
      )
    ]),
    new Ideals([
      new CharacteristicOption(
        `The thing that keeps a ship together is mutual
        respect between captain and crew. (Good)`,
        `Respect.`
      ),
      new CharacteristicOption(
        `We all do the work, so we all share in the
        rewards. (Lawful)`,
        `Fairness.`
      ),
      new CharacteristicOption(
        `The sea is freedom—the freedom to go
        anywhere and do anything. (Chaotic)`,
        `Freedom.`
      ),
      new CharacteristicOption(
        `I'm a predator, and the other ships on the sea
        are my prey. (Evil)`,
        `Mastery.`
      ),
      new CharacteristicOption(
        `I'm committed to my crewmates, not to ideals.
        (Neutral)`,
        `People.`
      ),
      new CharacteristicOption(
        `Someday I'll own my own ship and chart
        my own destiny. (Any)`,
        `Aspiration.`
      )
    ]),
    new Bonds([
      new CharacteristicOption(
        `I'm loyal to my captain first, everything else second.`
      ),
      new CharacteristicOption(
        `The ship is most important—crewmates and captains
        come and go.`
      ),
      new CharacteristicOption(
        `I'll always remember my first ship.`
      ),
      new CharacteristicOption(
        `In a harbor town, I have a paramour whose eyes nearly
        stole me from the sea.`
      ),
      new CharacteristicOption(
        `I was cheated out of my fair share of the profits, and I
        want to get my due.`
      ),
      new CharacteristicOption(
        `Ruthless pirates murdered my captain and crewmates,
        plundered our ship, and left me to die. Vengeance will
        be mine.`
      )
    ]),
    new Flaws([
      new CharacteristicOption(
        `I follow orders, even if I think they're wrong.`
      ),
      new CharacteristicOption(
        `I'll say anything to avoid having to do extra work.`
      ),
      new CharacteristicOption(
        `Once someone questions my courage, I never back
        down no matter how dangerous the situation.`
      ),
      new CharacteristicOption(
        `Once I start drinking, it's hard for me to stop.`
      ),
      new CharacteristicOption(
        `I can't help but pocket loose coins and other trinkets I
        come across.`
      ),
      new CharacteristicOption(
        `My pride will probably lead to my destruction.`
      )
    ]),
    new Feature(
      `When you need to, you can secure free passage on
      a sailing ship for yourself and your adventuring
      companions. You might sail on the ship you served on,
      or another ship you have good relations with (perhaps
      one captained by a former crewmate). Because you're
      calling in a favor, you can't be certain of a schedule or
      route that w ill meet your every need. Your Dungeon
      Master w ill determine how long it takes to get where
      you need to go. In return for your free passage, you
      and your companions are expected to assist the crew
      during the voyage.`,
      `Ship's Passage`
    ),
    [
      SKILL.ATHLETICS,
      SKILL.PERCEPTION,
      TOOL.NAVIGATORS_TOOLS,
      VEHICLE.TYPE.WATER
    ],
    [
      Equipment(WEAPON.CLUB),
      Equipment(GEAR.ROPE_SILK),
      Choices(
        1,
        [
          Choice(GEAR.LUCKY_CHARM),
          Condition([TRINKET.ANY])
        ]
      ),
      Equipment(GEAR.CLOTHES_COMMON),
      Gold(10)
    ],
    null,
    null,
    new Variant(
      `You spent your youth under the sway of a dread pirate,
      a ruthless cutthroat who taught you how to survive in a
      world of sharks and savages. You've indulged in larceny
      on the high seas and sent more than one deserving soul
      to a briny grave. Fear and bloodshed are no strangers
      to you, and you've garnered a somewhat unsavory
      reputation in many a port town.
      If you decide that your sailing career involved piracy,
      you can choose the Bad Reputation feature (see sidebar)
      instead of the Ship's Passage feature.`,
      `Pirate`
    ),
    new VariantFeature(
      `If your character has a sailor background, you may select this
      background feature instead of Ship's Passage.
      No matter where you go, people are afraid of you due to
      your reputation. When you are in a civilized settlement, you
      can get away with minor criminal offenses, such as refusing
      to pay for food at a tavern or breaking down doors at a local
      shop, since most people will not report your activity to the
      authorities.`,
      `Bad Reputation`
    )
  );

  backgrounds[BACKGROUND.SOLDIER.VALUE] = new Background(
    'Soldier',
    new PersonalityTraits([
      new CharacteristicOption(
        `I'm always polite and respectful.`
      ),
      new CharacteristicOption(
        `I'm haunted by memories o f war. I can't get the images
        of violence out of my mind.`
      ),
      new CharacteristicOption(
        `I've lost too many friends, and I'm slow to make new
        ones.`
      ),
      new CharacteristicOption(
        `I'm full of inspiring and cautionary tales from my
        military experience relevant to almost every combat
        situation.`
      ),
      new CharacteristicOption(
        `I can stare down a hell hound without flinching.`
      ),
      new CharacteristicOption(
        `I enjoy being strong and like breaking things.`
      ),
      new CharacteristicOption(
        `I have a crude sense of humor.`
      ),
      new CharacteristicOption(
        `I face problems head-on. A simple, direct solution is
        the best path to success.`
      )
    ]),
    new Ideals([
      new CharacteristicOption(
        `Our lot is to lay down our lives in
        defense of others. (Good)`,
        `Greater Good.`
      ),
      new CharacteristicOption(
        `I do what I must and obey just
        authority. (Lawful)`,
        `Responsibility.`
      ),
      new CharacteristicOption(
        `When people follow orders blindly, they
        embrace a kind of tyranny. (Chaotic)`,
        `Independence.`
      ),
      new CharacteristicOption(
        `In life as in war, the stronger force wins. (Evil)`,
        `Might.`
      ),
      new CharacteristicOption(
        `Ideals aren't worth killing over or
        going to war for. (Neutral)`,
        `Live and Let Live.`
      ),
      new CharacteristicOption(
        `My city, nation, or people are all that matter.
        (Any)`,
        `Nation.`
      )
    ]),
    new Bonds([
      new CharacteristicOption(
        `I would still lay down my life for the people I
        served with.`
      ),
      new CharacteristicOption(
        `Someone saved my life on the battlefield. To this day, I
        will never leave a friend behind.`
      ),
      new CharacteristicOption(
        `My honor is my life.`
      ),
      new CharacteristicOption(
        `I'll never forget the crushing defeat my company
        suffered or the enemies who dealt it.`
      ),
      new CharacteristicOption(
        `Those who fight beside me are those worth dying for.`
      ),
      new CharacteristicOption(
        `I fight for those who cannot fight for themselves.`
      )
    ]),
    new Flaws([
      new CharacteristicOption(
        `The monstrous enemy we faced in battle still leaves
        me quivering with fear.`
      ),
      new CharacteristicOption(
        `I have little respect for anyone who is not a
        proven warrior.`
      ),
      new CharacteristicOption(
        `I made a terrible mistake in battle cost many lives—
        and I would do anything to keep that mistake secret.`
      ),
      new CharacteristicOption(
        `My hatred of my enemies is blind and unreasoning.`
      ),
      new CharacteristicOption(
        `I obey the law, even if the law causes misery.`
      ),
      new CharacteristicOption(
        `I'd rather eat my armor than admit when I'm wrong.`
      )
    ]),
    new Feature(
      `You have a military rank from your career as a soldier.
      Soldiers loyal to your former military organization
      still recognize your authority and influence, and they
      defer to you if they are of a lower rank. You can invoke
      your rank to exert influence over other soldiers and
      requisition simple equipment or horses for temporary
      use. You can also usually gain access to friendly
      military encampments and fortresses where your
      rank is recognized.`,
      `Military Rank`
    ),
    [
      SKILL.ATHLETICS,
      SKILL.INTIMIDATION,
      Choices(
        1,
        [
          Condition([TOOL.CATEGORY.GAMING_SET])
        ]
      ),
      VEHICLE.TYPE.LAND
    ],
    [
      Equipment(GEAR.RANK_INSIGNIA),
      Equipment(GEAR.ENEMY_TROPHY),
      Choices(
        1,
        [
          Choice(GEAR.BONE_DICE),
          Choice(GEAR.DECK_OF_CARDS)
        ]
      ),
      Choices(
        1,
        [
          Choice(GEAR.PRAYER_BOOK),
          Choice(GEAR.PRAYER_WHEEL)
        ]
      ),
      Equipment(GEAR.CLOTHES_COMMON),
      Gold(10)
    ],
    null,
    new Characteristic(
      [
        new CharacteristicOption(`Officer`),
        new CharacteristicOption(`Scout`),
        new CharacteristicOption(`Infantry`),
        new CharacteristicOption(`Cavalry`),
        new CharacteristicOption(`Healer`),
        new CharacteristicOption(`Quartermaster`),
        new CharacteristicOption(`Standard bearer`),
        new CharacteristicOption(`Support staff (cook, blacksmith, or the like)`),
      ],
      `Specialty`
    )
  );

  backgrounds[BACKGROUND.URCHIN.VALUE] = new Background(
    'Urchin',
    new PersonalityTraits([
      new CharacteristicOption(
        `I hide scraps of food and trinkets away in my pockets.`
      ),
      new CharacteristicOption(
        `I ask a lot of questions.`
      ),
      new CharacteristicOption(
        `I like to squeeze into small places where no one else
        can get to me.`
      ),
      new CharacteristicOption(
        `I sleep with my back to a wall or tree, with everything I
        own wrapped in a bundle in my arms.`
      ),
      new CharacteristicOption(
        `I eat like a pig and have bad manners.`
      ),
      new CharacteristicOption(
        `I think anyone who's nice to me is hiding evil intent.`
      ),
      new CharacteristicOption(
        `I don't like to bathe.`
      ),
      new CharacteristicOption(
        `I bluntly say what other people are hinting at or hiding.`
      )
    ]),
    new Ideals([
      new CharacteristicOption(
        `All people, rich or poor, deserve respect.
        (Good)`,
        `Respect.`
      ),
      new CharacteristicOption(
        `We have to take care of each other,
        because no one else is going to do it. (Lawful)`,
        `Community.`
      ),
      new CharacteristicOption(
        `The low are lifted up, and the high and mighty
        are brought down. Change is the nature o f things.
        (Chaotic)`,
        `Change.`
      ),
      new CharacteristicOption(
        `The rich need to be shown what life and
        death are like in the gutters. (Evil)`,
        `Retribution.`
      ),
      new CharacteristicOption(
        `I help the people who help me—that's what
        keeps us alive. (Neutral)`,
        `People.`
      ),
      new CharacteristicOption(
        `I'm going to prove that I'm worthy of a
        better life.`,
        `Aspiration.`
      )
    ]),
    new Bonds([
      new CharacteristicOption(
        `My town or city is my home, and I'll fight to defend it.`
      ),
      new CharacteristicOption(
        `I sponsor an orphanage to keep others from enduring
        what I was forced to endure.`
      ),
      new CharacteristicOption(
        `I owe my survival to another urchin who taught me to
        live on the streets.`
      ),
      new CharacteristicOption(
        `I owe a debt I can never repay to the person who took
        pity on me.`
      ),
      new CharacteristicOption(
        `I escaped my life of poverty by robbing an important
        person, and I'm wanted for it.`
      ),
      new CharacteristicOption(
        `No one else should have to endure the hardships I've
        been through.`
      )
    ]),
    new Flaws([
      new CharacteristicOption(
        `If I'm outnumbered, I will run away from a fight.`
      ),
      new CharacteristicOption(
        `Gold seems like a lot of money to me, and I'll do just
        about anything for more of it.`
      ),
      new CharacteristicOption(
        `I will never fully trust anyone other than myself.`
      ),
      new CharacteristicOption(
        `I'd rather kill someone in their sleep then fight fair.`
      ),
      new CharacteristicOption(
        `It's not stealing if I need it more than someone else.`
      ),
      new CharacteristicOption(
        `People who can't take care of themselves get what they
        deserve.`
      )
    ]),
    new Feature(
      `You know the secret patterns and flow to cities and can
      find passages through the urban sprawl that others would
      miss. When you are not in combat, you (and companions
      you lead) can travel between any two locations in the city
      twice as fast as your speed would normally allow.`,
      `City Secrets`
    ),
    [
      SKILL.SLEIGHT_OF_HAND,
      SKILL.STEALTH,
      TOOL.DISGUISE_KIT,
      TOOL.THIEVES_TOOLS
    ],
    [
      Equipment(GEAR.SMALL_KNIFE),
      Equipment(GEAR.MAP),
      Equipment(PET.MOUSE),
      Choices(
        1,
        [
          Condition([TRINKET.ANY])
        ]
      ),
      Equipment(GEAR.CLOTHES_COMMON),
      Gold(10)
    ]
  );

  return backgrounds;
}

/************
* ALIGNMENTS
************/

const ALIGNMENT = {
  'LAWFUL_GOOD': {
    'VALUE': 'lawful_good',
    'PATH': PATH.ALIGNMENTS
  },
  'LAWFUL_NEUTRAL': {
    'VALUE': 'lawful_neutral',
    'PATH': PATH.ALIGNMENTS
  },
  'LAWFUL_EVIL': {
    'VALUE': 'lawful_evil',
    'PATH': PATH.ALIGNMENTS
  },
  'NEUTRAL_GOOD': {
    'VALUE': 'neutral_good',
    'PATH': PATH.ALIGNMENTS
  },
  'TRUE_NEUTRAL': {
    'VALUE': 'true_neutral',
    'PATH': PATH.ALIGNMENTS
  },
  'NEUTRAL_EVIL': {
    'VALUE': 'neutral_evil',
    'PATH': PATH.ALIGNMENTS
  },
  'CHAOTIC_GOOD': {
    'VALUE': 'chaotic_good',
    'PATH': PATH.ALIGNMENTS
  },
  'CHAOTIC_NEUTRAL': {
    'VALUE': 'chaotic_neutral',
    'PATH': PATH.ALIGNMENTS
  },
  'CHAOTIC_EVIL': {
    'VALUE': 'chaotic_evil',
    'PATH': PATH.ALIGNMENTS
  }
};

class Alignment {
  constructor(name) {
    this.id = pushID(name);
    this.name = name;
  }
}

function getAlignments() {
  var alignments = {};

  alignments[ALIGNMENT.LAWFUL_GOOD.VALUE] = new Alignment('Lawful Good');
  alignments[ALIGNMENT.LAWFUL_NEUTRAL.VALUE] = new Alignment('Lawful Neutral');
  alignments[ALIGNMENT.LAWFUL_EVIL.VALUE] = new Alignment('Lawful Evil');
  alignments[ALIGNMENT.NEUTRAL_GOOD.VALUE] = new Alignment('Neutral Good');
  alignments[ALIGNMENT.TRUE_NEUTRAL.VALUE] = new Alignment('True Neutral');
  alignments[ALIGNMENT.NEUTRAL_EVIL.VALUE] = new Alignment('Neutral Evil');
  alignments[ALIGNMENT.CHAOTIC_GOOD.VALUE] = new Alignment('Chaotic Good');
  alignments[ALIGNMENT.CHAOTIC_NEUTRAL.VALUE] = new Alignment('Chaotic Neutral');
  alignments[ALIGNMENT.CHAOTIC_EVIL.VALUE] = new Alignment('Chaotic Evil');

  return alignments;
}

/***************
* DATABASE REFS
***************/

class DbRef {
  constructor(name, path, getData=null) {
    this.name = name;
    this.query = dataRef.child(path);

    if (getData !== null) {
      this.getData = getData;
      this.data = this.getData();
    }

    this.loadVal();
  }

  loadVal() {
    var dbRef = this;
    this.query.on('value', function(snap) {
      dbRef.val = snap.val();
    });
  }

  store() {
    console.log('Storing ' + this.name + '...');
    this.query.set(this.data);
    console.log(this.name + ' stored!');
  }
}

var dbRefs = {};
dbRefs[PATH.ABILITIES] = new DbRef('Abilities', PATH.ABILITIES, getAbilities);
dbRefs[PATH.ALIGNMENTS] = new DbRef('Alignments', PATH.ALIGNMENTS, getAlignments);
dbRefs[PATH.ARMOR] = new DbRef('Armor', PATH.ARMOR, getArmor);
dbRefs[PATH.ARMOR_TYPES] = new DbRef('Armor types', PATH.ARMOR_TYPES, getArmorTypes);
dbRefs[PATH.BACKGROUNDS] = new DbRef('Backgrounds', PATH.BACKGROUNDS, getBackgrounds);
dbRefs[PATH.CLASSES] = new DbRef('Classes', PATH.CLASSES, getClasses);
dbRefs[PATH.GEAR] = new DbRef('Gear', PATH.GEAR, getGear);
dbRefs[PATH.GEAR_TYPES] = new DbRef('Gear types', PATH.GEAR_TYPES, getGearTypes);
dbRefs[PATH.LANGUAGES] = new DbRef('Languages', PATH.LANGUAGES, getLanguages);
dbRefs[PATH.PACKS] = new DbRef('Packs', PATH.PACKS, getPacks);
dbRefs[PATH.PETS] = new DbRef('Pets', PATH.PETS, getPets);
dbRefs[PATH.RACES] = new DbRef('Races', PATH.RACES, getRaces);
dbRefs[PATH.SKILLS] = new DbRef('Skills', PATH.SKILLS, getSkills);
dbRefs[PATH.SUBRACES] = new DbRef('Subraces', PATH.SUBRACES, getSubraces);
dbRefs[PATH.TOOL_CATEGORIES] = new DbRef('Tool categories', PATH.TOOL_CATEGORIES, getToolCategories);
dbRefs[PATH.TOOLS] = new DbRef('Tools', PATH.TOOLS, getTools);
dbRefs[PATH.TRAITS] = new DbRef('Traits', PATH.TRAITS, getTraits);
dbRefs[PATH.VEHICLE_TYPES] = new DbRef('Vehicle types', PATH.VEHICLE_TYPES, getVehicleTypes);
dbRefs[PATH.WEAPON_CATEGORIES] = new DbRef('Weapon categories', PATH.WEAPON_CATEGORIES, getWeaponCategories);
dbRefs[PATH.WEAPON_CLASSES] = new DbRef('Weapon classes', PATH.WEAPON_CLASSES, getWeaponClasses);
dbRefs[PATH.WEAPONS] = new DbRef('Weapons', PATH.WEAPONS, getWeapons);

function storeData() {
  for (key in dbRefs) {
    dbRefs[key].store();
  }
}
