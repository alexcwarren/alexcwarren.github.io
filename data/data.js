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
  'ARMOR': 'armor',
  'ARMOR_TYPES': 'armor_types',
  'BACKGROUNDS': 'backgrounds',
  'CLASSES': 'classes',
  'GEAR': 'gear',
  'GEAR_TYPES': 'gear_types',
  'LANGUAGES': 'languages',
  'PACKS': 'packs',
  'RACES': 'races',
  'SKILLS': 'skills',
  'SUBRACES': 'subraces',
  'TOOL_CATEGORIES': 'tool_categories',
  'TOOLS': 'tools',
  'TRAITS': 'traits',
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
  'COUNT': {
    'MAP_SCROLL': 'map or scroll'
  }
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
  gearTypes[GEAR.TYPE.COMPONENT.VALUE] = components;

  return gearTypes;
}

// function getGear(id, name) {
function getGear() {
  var gear = {};

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
    Container(1, UNIT.COUNT.MAP_SCROLL),
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
    'Darkvision',
    'You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it w ere dim light. You can’t discern color in darkness, only shades of gray.'
  );

  traits[TRAIT.DWARVEN_RESILIENCE.VALUE] = Trait(
    pushID(TRAIT.DWARVEN_RESILIENCE.VALUE),
    'Dwarven Resilience',
    'You have advantage on saving throws against poison, and you have resistance against poison damage.'
  );

  traits[TRAIT.DWARVEN_COMBAT_TRAINING.VALUE] = Trait(
    pushID(TRAIT.DWARVEN_COMBAT_TRAINING.VALUE),
    'Dwarven Combat Training',
    'You have proficiency with the battleaxe, handaxe, throwing hammer, and warhammer.'
  );

  traits[TRAIT.STONECUNNING.VALUE] = Trait(
    pushID(TRAIT.STONECUNNING.VALUE),
    'Stonecunning',
    'Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient in the History skill and add double your proficiency bonus to the check, instead of your normal proficiency bonus.'
  );

  traits[TRAIT.DWARVEN_TOUGHNESS.VALUE] = Trait(
    pushID(TRAIT.DWARVEN_TOUGHNESS.VALUE),
    'Dwarven Toughness',
    'Your hit point maximum increases by 1, and it increases by 1 every time you gain a level.'
  );

  traits[TRAIT.DWARVEN_ARMOR_TRAINING.VALUE] = Trait(
    pushID(TRAIT.DWARVEN_ARMOR_TRAINING.VALUE),
    'Dwarven Armor Training',
    'You have proficiency with light and medium armor.'
  );

  traits[TRAIT.KEEN_SENSES.VALUE] = Trait(
    pushID(TRAIT.KEEN_SENSES.VALUE),
    'Keen Senses',
    'You have proficiency in the Perception skill.'
  );

  traits[TRAIT.FEY_ANCESTRY.VALUE] = Trait(
    pushID(TRAIT.FEY_ANCESTRY.VALUE),
    'Fey Ancestry',
    'You have advantage on saving throws against being charmed, and magic can’t put you to sleep.'
  );

  traits[TRAIT.TRANCE.VALUE] = Trait(
    pushID(TRAIT.TRANCE.VALUE),
    'Trance',
    'Elves don’t need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day. (The Common word for such meditation is “trance.”) While meditating, you can dream after a fashion; such dreams are actually mental exercises that have become reflexive through years of practice. After resting in this way, you gain the same benefit that a human does from 8 hours of sleep.'
  );

  traits[TRAIT.ELF_WEAPON_TRAINING.VALUE] = Trait(
    pushID(TRAIT.ELF_WEAPON_TRAINING.VALUE),
    'Elf Weapon Training',
    'You have proficiency with the longsword, shortsword, shortbow, and longbow.'
  );

  traits[TRAIT.CANTRIP.VALUE] = Trait(
    pushID(TRAIT.CANTRIP.VALUE),
    'Cantrip',
    'You know one cantrip of your choice from the wizard spell list. Intelligence is your spellcasting ability for it.'
  );

  traits[TRAIT.EXTRA_LANGUAGE.VALUE] = Trait(
    pushID(TRAIT.EXTRA_LANGUAGE.VALUE),
    'Extra Language',
    'You can speak, read, and write one extra language of your choice.'
  );

  traits[TRAIT.FLEET_OF_FOOT.VALUE] = Trait(
    pushID(TRAIT.FLEET_OF_FOOT.VALUE),
    'Fleet of Foot',
    'Your base walking speed increases to 35 feet.'
  );

  traits[TRAIT.MASK_OF_THE_WILD.VALUE] = Trait(
    pushID(TRAIT.MASK_OF_THE_WILD.VALUE),
    'Mask of the Wild',
    'You can attempt to hide even when you are only lightly obscured by foliage, heavy rain, falling snow, mist, and other natural phenomena.'
  );

  traits[TRAIT.SUPERIOR_DARKVISION.VALUE] = Trait(
    pushID(TRAIT.SUPERIOR_DARKVISION.VALUE),
    'Superior Darkvision',
    'Your darkvision has a radius of 120 feet.'
  );

  traits[TRAIT.SUNLIGHT_SENSITIVITY.VALUE] = Trait(
    pushID(TRAIT.SUNLIGHT_SENSITIVITY.VALUE),
    'Sunlight Sensitivity',
    'You have disadvantage on attack rolls and on Wisdom (Perception) checks that rely on sight when you, the target of your attack, or whatever you are trying to perceive is in direct sunlight.'
  );

  traits[TRAIT.DROW_MAGIC.VALUE] = Trait(
    pushID(TRAIT.DROW_MAGIC.VALUE),
    'Drow Magic',
    'You know the dancing lights cantrip. When you reach 3rd level, you can cast the faerie fire spell once per day. When you reach 5th level, you can also cast the darkness spell once per day. Charisma is your spellcasting ability for these spells.'
  );

  traits[TRAIT.DROW_WEAPON_TRAINING.VALUE] = Trait(
    pushID(TRAIT.DROW_WEAPON_TRAINING.VALUE),
    'Drow Weapon Training',
    'You have proficiency with rapiers, shortswords, and hand crossbows.'
  );

  traits[TRAIT.LUCKY.VALUE] = Trait(
    pushID(TRAIT.LUCKY.VALUE),
    'Lucky',
    `When you roll a 1 on an attack roll, ability
    check, or saving throw, you can reroll the die and must
    use the new roll.`
  );

  traits[TRAIT.BRAVE.VALUE] = Trait(
    pushID(TRAIT.BRAVE.VALUE),
    'Brave',
    `You have advantage on saving throws against
    being frightened.`
  );
  
  traits[TRAIT.HALFLING_NIMBLENESS.VALUE] = Trait(
    pushID(TRAIT.HALFLING_NIMBLENESS.VALUE),
    'Halfling Nimbleness',
    `You can move through the
    space of any creature that is of a size larger than yours.`
  );
  
  traits[TRAIT.DRACONIC_ANCESTRY.VALUE] = Trait(
    pushID(TRAIT.DRACONIC_ANCESTRY.VALUE),
    'Draconic Ancestry',
    `You have draconic ancestry.
    Choose one type of dragon from the Draconic Ancestry
    table. Your breath weapon and damage resistance are
    determined by the dragon type, as shown in the table.`
  );
  
  traits[TRAIT.BREATH_WEAPON.VALUE] = Trait(
    pushID(TRAIT.BREATH_WEAPON.VALUE),
    'Breath Weapon',
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
    After you use your breath weapon, you can’t use it
    again until you complete a short or long rest.`
  );
  
  traits[TRAIT.DAMAGE_RESISTANCE.VALUE] = Trait(
    pushID(TRAIT.DAMAGE_RESISTANCE.VALUE),
    'Damage Resistance',
    `You have resistance to the
    damage type associated with your draconic ancestry.`
  );
  
  traits[TRAIT.GNOME_CUNNING.VALUE] = Trait(
    pushID(TRAIT.GNOME_CUNNING.VALUE),
    'Gnome Cunning',
    `You have advantage on all
    Intelligence, Wisdom, and Charisma saving throws
    against magic.`
  );
  
  traits[TRAIT.SKILL_VERSATILITY.VALUE] = Trait(
    pushID(TRAIT.SKILL_VERSATILITY.VALUE),
    'Skill Versatility',
    `You gain proficiency in two skills
    of your choice.`
  );
  
  traits[TRAIT.MENACING.VALUE] = Trait(
    pushID(TRAIT.MENACING.VALUE),
    'Menacing',
    `You gain proficiency in the
    Intimidation skill.`
  );
  
  traits[TRAIT.RELENTLESS_ENDURANCE.VALUE] = Trait(
    pushID(TRAIT.RELENTLESS_ENDURANCE.VALUE),
    'Relentless Endurance',
    `When you are reduced to
    0 hit points but not killed outright, you can drop to 1 hit
    point instead. You can’t use this feature again until you
    finish a long rest.`
  );
  
  traits[TRAIT.SAVAGE_ATTACKS.VALUE] = Trait(
    pushID(TRAIT.SAVAGE_ATTACKS.VALUE),
    'Savage Attacks',
    `When you score a critical hit with
    a melee weapon attack, you can roll one of the weapon’s
    damage dice one additional time and add it to the extra
    damage of the critical hit.`
  );
  
  traits[TRAIT.HELLISH_RESISTANCE.VALUE] = Trait(
    pushID(TRAIT.HELLISH_RESISTANCE.VALUE),
    'Hellish Resistance',
    `You have resistance
    to fire damage.`
  );
  
  traits[TRAIT.INFERNAL_LEGACY.VALUE] = Trait(
    pushID(TRAIT.INFERNAL_LEGACY.VALUE),
    'Infernal Legacy',
    `You know the thaumaturgy cantrip.
    Once you reach 3rd level, you can cast the hellish
    rebuke spell once per day as a 2nd-level spell. Once you
    reach 5th level, you can also cast the darkness spell
    once per day. Charisma is your spellcasting ability for
    these spells.`
  );
  
  traits[TRAIT.NATURALLY_STEALTHY.VALUE] = Trait(
    pushID(TRAIT.NATURALLY_STEALTHY.VALUE),
    'Naturally Stealthy',
    `You can attempt to hide even
    when you are obscured only by a creature that is at least
    one size larger than you.`
  );
  
  traits[TRAIT.STOUT_RESILIENCE.VALUE] = Trait(
    pushID(TRAIT.STOUT_RESILIENCE.VALUE),
    'Stout Resilience',
    `You have advantage on saving
    throws against poison, and you have resistance
    against poison damage.`
  );
  
  traits[TRAIT.NATURAL_ILLUSIONIST.VALUE] = Trait(
    pushID(TRAIT.NATURAL_ILLUSIONIST.VALUE),
    'Natural Illusionist',
    `You know the minor illusion
    cantrip. Intelligence is your spellcasting ability for it.`
  );
  
  traits[TRAIT.SPEAK_WITH_SMALL_BEASTS.VALUE] = Trait(
    pushID(TRAIT.SPEAK_WITH_SMALL_BEASTS.VALUE),
    'Speak with Small Beasts',
    `Through sounds and
    gestures, you can communicate simple ideas with Small
    or smaller beasts. Forest gnomes love animals and often
    keep squirrels, badgers, rabbits, moles, woodpeckers,
    and other creatures as beloved pets.`
  );
  
  traits[TRAIT.ARTIFICERS_LORE.VALUE] = Trait(
    pushID(TRAIT.ARTIFICERS_LORE.VALUE),
    'Artificer\'s Lore',
    `Whenever you make an Intelligence
    (History) check related to magic items, alchemical
    objects, or technological devices, you can add twice your
    proficiency bonus, instead of any proficiency bonus you
    normally apply.`
  );
  
  traits[TRAIT.TINKER.VALUE] = Trait(
    pushID(TRAIT.TINKER.VALUE),
    'Tinker',
    `You have proficiency with artisan’s tools
    (tinker’s tools). Using those tools, you can spend 1
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
    reaches the song’s end or
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
};

class Background {
  constructor(name, traits, ideals, bonds, flaws, proficiencyList, equipmentList, languageList=null) {
    this.id = pushID(name);
    this.name = name;
    this.traits = traits;
    this.ideals = ideals;
    this.bonds = bonds;
    this.flaws = flaws;

    this.proficiencies = processProficiencies(proficiencyList);
    this.equipment = processEquipment(equipmentList);

    if (languageList !== null) {
      this.languages = processLanguages(languageList);
    }
  }
}

class Characteristic {
  constructor(optionList) {
    this.die = optionList.length;
    
    this.options = {};
    let num = 1;
    for (let o of optionList) {
      this.options[num] = o;
      num++;
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
    super(optionList);
  }
}

class Ideals extends Characteristic {
  constructor(optionList) {
    super(optionList);
  }
}

class Bonds extends Characteristic {
  constructor(optionList) {
    super(optionList);
  }
}

class Flaws extends Characteristic {
  constructor(optionList) {
    super(optionList);
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
        refer to that person’s deeds and example.`
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
        my temple’s elite. Rough living grates on me.`
      ),
      new CharacteristicOption(
        `I’ve spent so long in the temple that I have little
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
        `I hope to one day rise to the top of my faith’s
        religious hierarchy. (Lawful)`,
        `Power.`
      ),
      new CharacteristicOption(
        `I trust that my deity will guide my actions, I have
        faith that if I work hard, things will go well. (Lawful)`,
        `Faith.`
      ),
      new CharacteristicOption(
        `I seek to prove myself worthy of my god’s
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
        my temple’s hierarchy.`
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
    [
      Choices(
        2,
        [
          Condition([LANGUAGE.ANY])
        ]
      )
    ]
  );

  return backgrounds;
}

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
dbRefs[PATH.ARMOR] = new DbRef('Armor', PATH.ARMOR, getArmor);
dbRefs[PATH.ARMOR_TYPES] = new DbRef('Armor types', PATH.ARMOR_TYPES, getArmorTypes);
dbRefs[PATH.BACKGROUNDS] = new DbRef('Backgrounds', PATH.BACKGROUNDS, getBackgrounds);
dbRefs[PATH.CLASSES] = new DbRef('Classes', PATH.CLASSES, getClasses);
dbRefs[PATH.GEAR] = new DbRef('Gear', PATH.GEAR, getGear);
dbRefs[PATH.GEAR_TYPES] = new DbRef('Gear types', PATH.GEAR_TYPES, getGearTypes);
dbRefs[PATH.LANGUAGES] = new DbRef('Languages', PATH.LANGUAGES, getLanguages);
dbRefs[PATH.PACKS] = new DbRef('Packs', PATH.PACKS, getPacks);
dbRefs[PATH.RACES] = new DbRef('Races', PATH.RACES, getRaces);
dbRefs[PATH.SKILLS] = new DbRef('Skills', PATH.SKILLS, getSkills);
dbRefs[PATH.SUBRACES] = new DbRef('Subraces', PATH.SUBRACES, getSubraces);
dbRefs[PATH.TOOL_CATEGORIES] = new DbRef('Tool categories', PATH.TOOL_CATEGORIES, getToolCategories);
dbRefs[PATH.TOOLS] = new DbRef('Tools', PATH.TOOLS, getTools);
dbRefs[PATH.TRAITS] = new DbRef('Traits', PATH.TRAITS, getTraits);
dbRefs[PATH.WEAPON_CATEGORIES] = new DbRef('Weapon categories', PATH.WEAPON_CATEGORIES, getWeaponCategories);
dbRefs[PATH.WEAPON_CLASSES] = new DbRef('Weapon classes', PATH.WEAPON_CLASSES, getWeaponClasses);
dbRefs[PATH.WEAPONS] = new DbRef('Weapons', PATH.WEAPONS, getWeapons);

function storeData() {
  for (key in dbRefs) {
    dbRefs[key].store();
  }
}
