// TODO - Replace reference to IDs with the entry's name

var usedIDs = [];

function pushID(id) {
  if (usedIDs.includes(id)) {
    console.log('ERROR: duplicate id ' + id)
  }
  else if (id == '') {
    console.log('ERROR: empty id ' + id)
  }
  else {
    usedIDs.push(id);
    return id;
  }
  return null;
}

function getNextID() {
  // Make sure nextID is always exactly 4 hex digits
  let minLimit = 4096; // 16^(4-1) = 16^3
  let maxLimit = 65536 - 4096; // 16^4 - 16^3

  let nextID = Math.floor(Math.random() * maxLimit) + minLimit;

  if (usedIDs.includes(nextID)) {
    return getNextID();
  }
  console.log(nextID.toString(16));

  usedIDs.push(nextID.toString(16));
  var list = '[';
  for (id of usedIDs) {
    list += '\'' + id + '\', ';
  }
  console.log(list.slice(0, list.length-2) + ']');
}

function getTag(path, id, quantity = 0) {
  if (quantity === 0) {
    var tag = {
      'path': path,
      'id': id
    };

    return tag;
  }

  var item = {
    'quantity': quantity,
    'path': path,
    'id': id
  };

  return item;
}

function getCondition(attribute, id) {
  var condition = {
    'attribute': attribute,
    'id': id
  };

  return condition;
}

function getTagFilter(searchPath, conditions, quantity = 0) {
  if (quantity === 0) {
    var filter = {
      'searchPath': searchPath,
      'conditions': conditions
    };

    return filter;
  }

  var itemFilter = {
    'quantity': quantity,
    'searchPath': searchPath,
    'conditions': conditions
  };

  return itemFilter;
}

function getChooseGroup(amount, tags) {
  var group = {
    'choose': {
      'amount': amount,
      'choices': tags
    }
  };

  return group;
}

function storeData() {
  usedIDs.splice(0, usedIDs.length);

  storeAbilities();
  storeSkills();
  storeLanguages();
  storeWeapons();
  storeArmor();
  storeTools();
  storeGear();
  storeTraits();
  storeSubraces();
  storeRaces();
  storeClasses();

  console.log(usedIDs);
}

function storeAbilities() {
  var abilities = {
    'STR': {
      'id': pushID('8d66'),
      'name': 'STR',
      'longName': 'Strength'
    },
    'DEX': {
      'id': pushID('5336'),
      'name': 'DEX',
      'longName': 'Dexterity'
    },
    'CON': {
      'id': pushID('3aca'),
      'name': 'CON',
      'longName': 'Constitution'
    },
    'INT': {
      'id': pushID('f676'),
      'name': 'INT',
      'longName': 'Intelligence'
    },
    'WIS': {
      'id': pushID('8543'),
      'name': 'WIS',
      'longName': 'Wisdom'
    },
    'CHA': {
      'id': pushID('1842'),
      'name': 'CHA',
      'longName': 'Charisma'
    }
  };

  console.log('Storing abilities...');
  var dataRef = database.ref('data/abilities');
  dataRef.set(abilities);
  console.log('Abilities stored!');
}

function storeSkills() {
  var skills = {
    'athletics': {
      'id': pushID('71c6'),
      'name': 'Athletics',
      'parentAbility': '8d66'
    },
    'acrobatics': {
      'id': pushID('cb4b'),
      'name': 'Acrobatics',
      'parentAbility': '5336'
    },
    'sleight_of_hand': {
      'id': pushID('a8e0'),
      'name': 'Sleight of Hand',
      'parentAbility': '5336'
    },
    'stealth': {
      'id': pushID('94da'),
      'name': 'Stealth',
      'parentAbility': '5336'
    },
    'arcana': {
      'id': pushID('86d9'),
      'name': 'Arcana',
      'parentAbility': 'f676'
    },
    'history': {
      'id': pushID('3f94'),
      'name': 'History',
      'parentAbility': 'f676'
    },
    'investigation': {
      'id': pushID('c68b'),
      'name': 'Investigation',
      'parentAbility': 'f676'
    },
    'nature': {
      'id': pushID('5b8c'),
      'name': 'Nature',
      'parentAbility': 'f676'
    },
    'religion': {
      'id': pushID('3783'),
      'name': 'Religion',
      'parentAbility': 'f676'
    },
    'animal_handling': {
      'id': pushID('26bb'),
      'name': 'Animal Handling',
      'parentAbility': '8543'
    },
    'insight': {
      'id': pushID('ecd9'),
      'name': 'Insight',
      'parentAbility': '8543'
    },
    'medicine': {
      'id': pushID('7290'),
      'name': 'Medicine',
      'parentAbility': '8543'
    },
    'perception': {
      'id': pushID('efb6'),
      'name': 'Perception',
      'parentAbility': '8543'
    },
    'survival': {
      'id': pushID('a75f'),
      'name': 'Survival',
      'parentAbility': '8543'
    },
    'deception': {
      'id': pushID('9705'),
      'name': 'Deception',
      'parentAbility': '1842'
    },
    'intimidation': {
      'id': pushID('518d'),
      'name': 'Intimidation',
      'parentAbility': '1842'
    },
    'performance': {
      'id': pushID('978a'),
      'name': 'Performance',
      'parentAbility': '1842'
    },
    'persuasion': {
      'id': pushID('1561'),
      'name': 'Persuasion',
      'parentAbility': '1842'
    }
  };

  console.log('Storing skills...');
  var dataRef = database.ref('data/skills');
  dataRef.set(skills);
  console.log('Skills stored!');
}

function storeLanguages() {
  var languages = {
    'common': {
      'id': pushID('3731'),
      'name': 'Common'
    },
    'dwarvish': {
      'id': pushID('1412'),
      'name': 'Dwarvish'
    },
    'elvish': {
      'id': pushID('fa0b'),
      'name': 'Elvish'
    },
    'halfling': {
      'id': pushID('4f72'),
      'name': 'Halfling'
    },
    'draconic': {
      'id': pushID('5216'),
      'name': 'Draconic'
    },
    'gnomish': {
      'id': pushID('f409'),
      'name': 'Gnomish'
    },
    'orc': {
      'id': pushID('f3b1'),
      'name': 'Orc'
    },
    'infernal': {
      'id': pushID('eca4'),
      'name': 'Infernal'
    }
  };

  console.log('Storing languages...');
  var dataRef = database.ref('data/languages');
  dataRef.set(languages);
  console.log('Languages stored!');
}

function storeWeapons() {
  var weaponClasses = {
    'melee': {'id': pushID('16d3'), 'name': 'Melee weapons'},
    'ranged': {'id': pushID('f15d'), 'name': 'Ranged weapons'}
  };

  var weaponCategories = {
    'simple': {'id': pushID('471c'), 'name': 'Simple weapons'},
    'martial': {'id': pushID('ee14'), 'name': 'Martial weapons'}
  };

  var weapons = {
    'classes': weaponClasses,
    'categories': weaponCategories,
    'battleaxe': {
      'id': pushID('29ef'),
      'name': 'Battleaxe',
      'class': 'melee',
      'category': 'martial',
      'costGP': 10,
      'damage': {
        'num': 1,
        'die': 8,
        'type': 'slashing'
      },
      'weightLB': 4,
      'properties': [
        {
          'name': 'Versatile',
          'num': 1,
          'die': 10
        }
      ]
    },
    'handaxe': {
      'id': pushID('14a4'),
      'name': 'Handaxe',
      'class': 'melee',
      'category': 'simple',
      'costGP': 5,
      'damage': {
        'num': 1,
        'die': 6,
        'type': 'slashing'
      },
      'weightLB': 2,
      'properties': [
        {'name': 'Light',},
        {
          'name': 'Thrown',
          'normalRange': 20,
          'maxRange': 60
        }
      ]
    },
    'light_hammer': {
      'id': pushID('b114'),
      'name': 'Light hammer',
      'class': 'melee',
      'category': 'simple',
      'costGP': 2,
      'damage': {
        'num': 1,
        'die': 4,
        'type': 'bludgeoning'
      },
      'weightLB': 2,
      'properties': [
        {'name': 'Light',},
        {
          'name': 'Thrown',
          'normalRange': 20,
          'maxRange': 60
        }
      ]
    },
    'warhammer': {
      'id': pushID('ed2b'),
      'name': 'Warhammer',
      'class': 'melee',
      'category': 'martial',
      'costGP': 15,
      'damage': {
        'num': 1,
        'die': 8,
        'type': 'bludgeoning'
      },
      'weightLB': 2,
      'properties': [
        {
          'name': 'Versatile',
          'num': 1,
          'die': 10
        }
      ]
    },
    'longsword': {
      'id': pushID('e9d7'),
      'name': 'Longsword',
      'class': 'melee',
      'category': 'martial',
      'costGP': 15,
      'damage': {
        'num': 1,
        'die': 8,
        'type': 'slashing'
      },
      'weightLB': 3,
      'properties': [
        {
          'name': 'Versatile',
          'num': 1,
          'die': 10
        }
      ]
    },
    'shortsword': {
      'id': pushID('c002'),
      'name': 'Shortsword',
      'class': 'melee',
      'category': 'martial',
      'costGP': 10,
      'damage': {
        'num': 1,
        'die': 6,
        'type': 'piercing'
      },
      'weightLB': 2,
      'properties': [
        {'name': 'Finesse'},
        {'name': 'Light'}
      ]
    },
    'shortbow': {
      'id': pushID('ce74'),
      'name': 'Shortbow',
      'class': 'ranged',
      'category': 'simple',
      'costGP': 25,
      'damage': {
        'num': 1,
        'die': 6,
        'type': 'piercing'
      },
      'weightLB': 2,
      'properties': [
        {
          'name': 'Ammunition',
          'normalRange': 80,
          'maxRange': 320
        },
        {'name': 'Loading'},
        {'name': 'Two-handed'}
      ]
    },
    'longbow': {
      'id': pushID('3382'),
      'name': 'Longbow',
      'class': 'ranged',
      'category': 'martial',
      'costGP': 50,
      'damage': {
        'num': 1,
        'die': 8,
        'type': 'piercing'
      },
      'weightLB': 2,
      'properties': [
        {
          'name': 'Ammunition',
          'normalRange': 150,
          'maxRange': 600
        },
        {'name': 'Heavy'},
        {'name': 'Loading'},
        {'name': 'Two-handed'}
      ]
    },
    'rapier': {
      'id': pushID('d4e8'),
      'name': 'Rapier',
      'class': 'melee',
      'category': 'martial',
      'costGP': 25,
      'damage': {
        'num': 1,
        'die': 8,
        'type': 'piercing'
      },
      'weightLB': 2,
      'properties': [
        {'name': 'Finesse'}
      ]
    },
    'hand_crossbow': {
      'id': pushID('306a'),
      'name': 'Hand crossbow',
      'class': 'ranged',
      'category': 'martial',
      'costGP': 75,
      'damage': {
        'num': 1,
        'die': 6,
        'type': 'piercing'
      },
      'weightLB': 3,
      'properties': [
        {
          'name': 'Ammunition',
          'normalRange': 30,
          'maxRange': 120
        },
        {'name': 'Light'},
        {'name': 'Loading'}
      ]
    },
    'greataxe': {
      'id': pushID('21bc'),
      'name': 'Greataxe',
      'class': 'melee',
      'category': 'martial',
      'costGP': 30,
      'damage': {
        'num': 1,
        'die': 12,
        'type': 'slashing'
      },
      'weightLB': 7,
      'properties': [
        {'name': 'Heavy'},
        {'name': 'Two-handed'}
      ]
    },
    'javelin': {
      'id': pushID('86c3'),
      'name': 'Javelin',
      'class': 'melee',
      'category': 'simple',
      'costGP': 0.5,
      'damage': {
        'num': 1,
        'die': 6,
        'type': 'piercing'
      },
      'weightLB': 2,
      'properties': [
        {
          'name': 'Thrown',
          'normalRange': 30,
          'maxRange': 120
        }
      ]
    },
    'dagger': {
      'id': pushID('e68a'),
      'name': 'Dagger',
      'class': 'melee',
      'category': 'simple',
      'costGP': 2,
      'damage': {
        'num': 1,
        'die': 4,
        'type': 'piercing'
      },
      'weightLB': 1,
      'properties': [
        {'name': 'Finesse',},
        {'name': 'Light',},
        {
          'name': 'Thrown',
          'normalRange': 20,
          'maxRange': 60
        }
      ]
    }
  };
  // for (p of weapons.hand_crossbow.properties) {
  //   console.log(p.name);
  //   if (p.hasOwnProperty('normalRange')) {
  //     console.log(p.normalRange);
  //   }
  // }

  console.log('Storing weapons...');
  var dataRef = database.ref('data/weapons');
  dataRef.set(weapons);
  console.log('Weapons stored!');
}

function storeArmor() {
  var armorCategories = {
    'light': {'id': pushID('83d3'), 'name': 'Light armor'},
    'medium': {'id': pushID('d373'), 'name': 'Medium armor'},
    'hard': {'id': pushID('edbb'), 'name': 'Hard armor'},
    'shield': {'id': pushID('553a'), 'name': 'Shields'}
  };

  var armor = {
    'categories': armorCategories,
    'padded': {
      'id': pushID('b800'),
      'name': 'Padded',
      'category': '83d3',
      'costGP': 5,
      'AC': '11+',
      'maxACmod': null,
      'STRreq': null,
      'stealthDisAdv': true,
      'weightLB': 0
    },
    'leather': {
      'id': pushID('e740'),
      'name': 'Leather',
      'category': '83d3',
      'costGP': 10,
      'AC': '11+',
      'maxACmod': null,
      'STRreq': null,
      'stealthDisAdv': false,
      'weightLB': 10
    },
    'studded_leather': {
      'id': pushID('c620'),
      'name': 'Studded leather',
      'category': '83d3',
      'costGP': 45,
      'AC': '12+',
      'maxACmod': null,
      'STRreq': null,
      'stealthDisAdv': false,
      'weightLB': 13
    },
    'hide': {
      'id': pushID('71b3'),
      'name': 'Hide',
      'category': 'd373',
      'costGP': 10,
      'AC': '12+',
      'maxACmod': 2,
      'STRreq': null,
      'stealthDisAdv': false,
      'weightLB': 12
    },
    'chain_shirt': {
      'id': pushID('8e08'),
      'name': 'Chain shirt',
      'category': 'd373',
      'costGP': 50,
      'AC': '13+',
      'maxACmod': 2,
      'STRreq': null,
      'stealthDisAdv': false,
      'weightLB': 20
    },
    'scale_mail': {
      'id': pushID('51e1'),
      'name': 'Scale mail',
      'category': 'd373',
      'costGP': 50,
      'AC': '14+',
      'maxACmod': 2,
      'STRreq': null,
      'stealthDisAdv': true,
      'weightLB': 45
    },
    'breastplate': {
      'id': pushID('baf8'),
      'name': 'Breastplate',
      'category': 'd373',
      'costGP': 400,
      'AC': '14+',
      'maxACmod': 2,
      'STRreq': null,
      'stealthDisAdv': false,
      'weightLB': 20
    },
    'half_plate': {
      'id': pushID('6958'),
      'name': 'Half plate',
      'category': 'd373',
      'costGP': 750,
      'AC': '15+',
      'maxACmod': 2,
      'STRreq': null,
      'stealthDisAdv': true,
      'weightLB': 40
    },
    'ring_mail': {
      'id': pushID('88e2'),
      'name': 'Ring mail',
      'category': 'edbb',
      'costGP': 30,
      'AC': '14',
      'maxACmod': null,
      'STRreq': null,
      'stealthDisAdv': true,
      'weightLB': 40
    },
    'chain_mail': {
      'id': pushID('6af0'),
      'name': 'Chain mail',
      'category': 'edbb',
      'costGP': 75,
      'AC': '16',
      'maxACmod': null,
      'STRreq': 13,
      'stealthDisAdv': true,
      'weightLB': 55
    },
    'splint': {
      'id': pushID('3bdc'),
      'name': 'Splint',
      'category': 'edbb',
      'costGP': 200,
      'AC': '17',
      'maxACmod': null,
      'STRreq': 15,
      'stealthDisAdv': true,
      'weightLB': 60
    },
    'plate': {
      'id': pushID('43dd'),
      'name': 'Plate',
      'category': 'edbb',
      'costGP': 1500,
      'AC': '18',
      'maxACmod': null,
      'STRreq': 15,
      'stealthDisAdv': true,
      'weightLB': 65
    },
    'shield': {
      'id': pushID('a949'),
      'name': 'Shield',
      'category': '553a',
      'costGP': 10,
      'AC': '+2',
      'maxACmod': null,
      'STRreq': null,
      'stealthDisAdv': false,
      'weightLB': 6
    }
  };

  console.log('Storing armor...');
  var dataRef = database.ref('data/armor');
  dataRef.set(armor);
  console.log('Armor stored!');
}

function storeTools() {
  var toolCategories = {
    'artisan': {
      'id': pushID('bad9'),
      'name': 'Artisan\'s tools'
    },
    'gaming': {
      'id': pushID('e020'),
      'name': 'Gaming set'
    },
    'instrument': {
      'id': pushID('6858'),
      'name': 'Musical instrument'
    }
  };

  var tools = {
    'categories': toolCategories,
    'alchemists_supplies': {
      'id': pushID('69ed'),
      'name': 'Alchemist\'s supplies',
      'category': 'bad9',
      'costGP': 50,
      'weightLB': 8
    },
    'smiths_tools': {
      'id': pushID('72da'),
      'name': 'Smith\'s tools',
      'category': 'bad9',
      'costGP': 20,
      'weightLB': 8
    },
    'brewers_supplies': {
      'id': pushID('cebd'),
      'name': 'Brewer\'s supplies',
      'category': 'bad9',
      'costGP': 20,
      'weightLB': 9
    },
    'masons_tools': {
      'id': pushID('12db'),
      'name': 'Mason\'s tools',
      'category': 'bad9',
      'costGP': 10,
      'weightLB': 8
    },
    'disguise_kit': {
      'id': pushID('b6a6'),
      'name': 'Disguise kit',
      'costGP': 25,
      'weightLB': 3
    }
  };

  console.log('Storing tools...');
  var dataRef = database.ref('data/tools');
  dataRef.set(tools);
  console.log('Tools stored!');
}

function storeGear() {
  var packs = {
    'explorer': {
      'id': pushID('ec6d'),
      'name': 'Explorer\'s pack',
      'costGP': 10,
      'contents': [
        {'quantity': 1, 'id': 'eacf'},
        {'quantity': 1, 'id': 'dd88'},
        {'quantity': 1, 'id': 'd2ee'},
        {'quantity': 1, 'id': '9271'},
        {'quantity': 10, 'id': '60da'},
        {'quantity': 10, 'id': '74e8'},
        {'quantity': 1, 'id': '2848'},
        {'quantity': 1, 'id': '2b9e'}
      ]
    },
    'diplomat': {
      'id': pushID('61fc'),
      'name': 'Diplomat\'s pack',
      'costGP': 39,
      'contents': [
        {'quantity': 1, 'id': 'b4a8'},
        {'quantity': 2, 'id': '628c'},
        {'quantity': 1, 'id': 'bd72'},
        {'quantity': 1, 'id': '4faf'},
        {'quantity': 1, 'id': '84ec'},
        {'quantity': 1, 'id': 'f869'},
        {'quantity': 2, 'id': '4433'},
        {'quantity': 5, 'id': '263c'},
        {'quantity': 1, 'id': 'd0a1'},
        {'quantity': 1, 'id': 'e468'},
        {'quantity': 1, 'id': 'e468'}
      ]
    },
    'entertainer': {
      'id': pushID('6f3e'),
      'name': 'Entertainer\'s pack',
      'costGP': 40,
      'contents': [
        {'quantity': 1, 'id': 'eacf'},
        {'quantity': 1, 'id': 'dd88'},
        {'quantity': 2, 'id': 'bb28'},
        {'quantity': 5, 'id': '5d88'},
        {'quantity': 5, 'id': '74e8'},
        {'quantity': 1, 'id': '2848'},
        getTag('tools', 'b6a6')
      ]
    }
  };

  var gear = {
    'packs': packs,
    'backpack': {
      'id': pushID('eacf'),
      'name': 'Backpack',
      'container': {
        'dimensionLimit': 1,
        'capacity': 30,
        'units': 'lb',
        'isFilled': false,
        'contents': []
      },
      'costGP': 2,
      'weightLB': 5
    },
    'waterskin': {
      'id': pushID('2848'),
      'name': 'Waterskin',
      'container': {
        'capacity': 4,
        'units': 'lb',
        'full%': 100,
        'contents': ['water']
      },
      'costGP': 0.2,
      'weightLB': 5
    },
    'bedroll': {
      'id': pushID('dd88'),
      'name': 'Bedroll',
      'costGP': 1,
      'weightLB': 7
    },
    'mess_kit': {
      'id': pushID('d2ee'),
      'name': 'Mess kit',
      'costGP': 0.2,
      'weightLB': 1
    },
    'tinderbox': {
      'id': pushID('9271'),
      'name': 'Tinderbox',
      'costGP': 0.5,
      'weightLB': 1
    },
    'torch': {
      'id': pushID('60da'),
      'name': 'Torch',
      'costGP': 0.01,
      'weightLB': 1
    },
    'rations': {
      'id': pushID('74e8'),
      'name': 'Rations (1 day)',
      'costGP': 0.5,
      'weightLB': 2
    },
    'hempen_rope': {
      'id': pushID('2b9e'),
      'name': 'Rope, hempen (50 feet)',
      'costGP': 1,
      'weightLB': 10
    },
    'chest': {
      'id': pushID('b4a8'),
      'name': 'Chest',
      'container': {
        'dimensionLimit': 12,
        'capacity': 300,
        'units': 'lb',
        'full%': 0,
        'contents': []
      },
      'costGP': 5,
      'weightLB': 25
    },
    'case_map_scroll': {
      'id': pushID('628c'),
      'name': 'Case, map or scroll',
      'costGP': 1,
      'weightLB': 1
    },
    'clothes_fine': {
      'id': pushID('bd72'),
      'name': 'Clothes, fine',
      'costGP': 15,
      'weightLB': 6
    },
    'clothes_costume': {
      'id': pushID('bb28'),
      'name': 'Clothes, costume',
      'costGP': 5,
      'weightLB': 4
    },
    'ink_bottle': {
      'id': pushID('4faf'),
      'name': 'Ink (1 ounce bottle)',
      'container': {
        'capacity': 1,
        'units': 'oz',
        'full%': 100,
        'contents': ['oil']
      },
      'costGP': 10,
      'weightLB': 0
    },
    'ink_pen': {
      'id': pushID('84ec'),
      'name': 'Ink pen',
      'costGP': 0.02,
      'weightLB': 0
    },
    'lamp': {
      'id': pushID('f869'),
      'name': 'Lamp',
      'costGP': 0.5,
      'weightLB': 1
    },
    'flask_empty': {
      'id': pushID('2f53'),
      'name': 'Flask',
      'container': {
        'capacity': 1.5,
        'units': 'pt',
        'full%': 0,
        'contents': []
      },
      'costGP': 0.02,
      'weightLB': 1
    },
    'flask_oil': {
      'id': pushID('4433'),
      'name': 'Flask',
      'container': {
        'capacity': 1.5,
        'units': 'pt',
        'full%': 100,
        'contents': ['oil']
      },
      'costGP': 0.1,
      'weightLB': 1
    },
    'paper': {
      'id': pushID('263c'),
      'name': 'Paper (one sheet)',
      'costGP': 0.2,
      'weightLB': 0
    },
    'vial_empty': {
      'id': pushID('6cef'),
      'name': 'Vial',
      'container': {
        'capacity': 4,
        'units': 'oz',
        'full%': 0,
        'contents': []
      },
      'costGP': 1,
      'weightLB': 0
    },
    'vial_perfume': {
      'id': pushID('d0a1'),
      'name': 'Vial',
      'container': {
        'capacity': 4,
        'units': 'oz',
        'full%': 100,
        'contents': ['perfume']
      },
      'costGP': 5,
      'weightLB': 0
    },
    'sealing_wax': {
      'id': pushID('e468'),
      'name': 'Sealing wax',
      'costGP': 0.5,
      'weightLB': 0
    },
    'candle': {
      'id': pushID('5d88'),
      'name': 'Candle',
      'costGP': 0.01,
      'weightLB': 0
    },
    'soap': {
      'id': pushID('744d'),
      'name': 'Soap',
      'costGP': 0.02,
      'weightLB': 0
    }
  };

  console.log('Storing gear...');
  var dataRef = database.ref('data/gear');
  dataRef.set(gear);
  console.log('Gear stored!');
}

function storeTraits() {
  var traits = {
    'darkvision': {
      'id': pushID('c306'),
      'name': 'Darkvision',
      'desc': 'You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it w ere dim light. You can’t discern color in darkness, only shades of gray.'
    },
    'dwarven_resilience': {
      'id': pushID('bbc0'),
      'name': 'Dwarven Resilience',
      'desc': 'You have advantage on saving throws against poison, and you have resistance against poison damage.'
    },
    'dwarven_combat_training': {
      'id': pushID('c2a3'),
      'name': 'Dwarven Combat Training',
      'desc': 'You have proficiency with the battleaxe, handaxe, throwing hammer, and warhammer.'
    },
    'stonecunning': {
      'id': pushID('458d'),
      'name': 'Stonecunning',
      'desc': 'Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient in the History skill and add double your proficiency bonus to the check, instead of your normal proficiency bonus.'
    },
    'dwarven_toughness': {
      'id': pushID('3e47'),
      'name': 'Dwarven Toughness',
      'desc': 'Your hit point maximum increases by 1, and it increases by 1 every time you gain a level.'
    },
    'dwarven_armor_training': {
      'id': pushID('6449'),
      'name': 'Dwarven Armor Training',
      'desc': 'You have proficiency with light and medium armor.'
    },
    'keen_senses': {
      'id': pushID('f40a'),
      'name': 'Keen Senses',
      'desc': 'You have proficiency in the Perception skill.'
    },
    'fey_ancestry': {
      'id': pushID('a8de'),
      'name': 'Fey Ancestry',
      'desc': 'You have advantage on saving throws against being charmed, and magic can’t put you to sleep.'
    },
    'trance': {
      'id': pushID('ff1e'),
      'name': 'Trance',
      'desc': 'Elves don’t need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day. (The Common word for such meditation is “trance.”) While meditating, you can dream after a fashion; such dreams are actually mental exercises that have become reflexive through years of practice. After resting in this way, you gain the same benefit that a human does from 8 hours of sleep.'
    },
    'elf_weapon_training': {
      'id': pushID('f5c4'),
      'name': 'Elf Weapon Training',
      'desc': 'You have proficiency with the longsword, shortsword, shortbow, and longbow.'
    },
    'cantrip': {
      'id': pushID('809d'),
      'name': 'Cantrip',
      'desc': 'You know one cantrip of your choice from the wizard spell list. Intelligence is your spellcasting ability for it.'
    },
    'extra_language': {
      'id': pushID('50c0'),
      'name': 'Extra Language',
      'desc': 'You can speak, read, and write one extra language of your choice.'
    },
    'fleet_of_foot': {
      'id': pushID('132c'),
      'name': 'Fleet of Foot',
      'desc': 'Your base walking speed increases to 35 feet.'
    },
    'mask_of_the_wild': {
      'id': pushID('844d'),
      'name': 'Mask of the Wild',
      'desc': 'You can attempt to hide even when you are only lightly obscured by foliage, heavy rain, falling snow, mist, and other natural phenomena.'
    },
    'superior_darkvision': {
      'id': pushID('a640'),
      'name': 'Superior Darkvision',
      'desc': 'Your darkvision has a radius of 120 feet.'
    },
    'sunlight_sensitivity': {
      'id': pushID('61b6'),
      'name': 'Sunlight Sensitivity',
      'desc': 'You have disadvantage on attack rolls and on Wisdom (Perception) checks that rely on sight when you, the target of your attack, or whatever you are trying to perceive is in direct sunlight.'
    },
    'drow_magic': {
      'id': pushID('8e43'),
      'name': 'Drow Magic',
      'desc': 'You know the dancing lights cantrip. When you reach 3rd level, you can cast the faerie fire spell once per day. When you reach 5th level, you can also cast the darkness spell once per day. Charisma is your spellcasting ability for these spells.'
    },
    'drow_weapon_training': {
      'id': pushID('a652'),
      'name': 'Drow Weapon Training',
      'desc': 'You have proficiency with rapiers, shortswords, and hand crossbows.'
    }
  };

  console.log('Storing traits...');
  var dataRef = database.ref('data/traits');
  dataRef.set(traits);
  console.log('Traits stored!');
}

function storeSubraces() {
  var subraces = {
    'dwarf': {
      'hill_dwarf': {
        'id': pushID('58e0'),
        'name': 'Hill Dwarf',
        'increases': [
          {'ability': 'WIS', 'mod': 1}
        ],
        'traits': [
          '3e47'
        ],
        'maxHP_bonus': 1
      },
      'mountain_dwarf': {
        'id': pushID('f52b'),
        'name': 'Mountain Dwarf',
        'increases': [
          {'ability': 'STR', 'mod': 2}
        ],
        'traits': [
          '6449'
        ],
        'proficiencies': [
          getTag('armor/categories', '83d3'),
          getTag('armor/categories', 'd373')
        ]
      }
    },
    'elf': {
      'high_elf': {
        'id': pushID('7af4'),
        'name': 'High Elf',
        'increases': [
          {'ability': 'INT', 'mod': 1}
        ],
        'traits': [
          '809d',
          '50c0'
        ],
        'languages': [
          getChooseGroup(1, [getTag('languages', 'any')])
        ]
      },
      'wood_elf': {
        'id': pushID('8e7a'),
        'name': 'Wood Elf',
        'increases': [
          {'ability': 'WIS', 'mod': 1}
        ],
        'speed': 35,
        'traits': [
          '132c',
          '844d'
        ]
      },
      'dark_elf': {
        'id': pushID('5b81'),
        'name': 'Dark Elf (Drow)',
        'increases': [
          {'ability': 'CHA', 'mod': 1}
        ],
        'traits': [
          'a640',
          '61b6',
          '8e43',
          'a652'
        ],
        'proficiencies': [
          getTag('weapons', 'd4e8'),
          getTag('weapons', 'c002'),
          getTag('weapons', '306a'),
        ]
      }
    }
  };

  console.log('Storing subraces...');
  var dataRef = database.ref('data/subraces');
  dataRef.set(subraces);
  console.log('Subraces stored!');
}

function storeRaces() {
  var races = {
    'dwarf': {
      'id': pushID('9726'),
      'name': 'Dwarf',
      'increases': [
        {'ability': 'CON', 'mod': 2}
      ],
      'speed': 25,
      'traits': [
        'darkvision',
        'dwarven_resilience',
        'dwarven_combat_training',
        'stonecunning'
      ],
      'proficiencies': [
        getTag('weapons', 'battleaxe'),
        getTag('weapons', 'handaxe'),
        getTag('weapons', 'light_hammer'),
        getTag('weapons', 'warhammer'),
        getChooseGroup(1, [getTag('tools', 'smiths_tools', 1), getTag('tools', 'brewers_supplies', 1), getTag('tools', 'masons_tools', 1)])
      ],
      'languages': [
        'common',
        'dwarvish'
      ],
      'subraces': [
        'hill_dwarf',
        'mountain_dwarf'
      ],
      'maxHP_bonus': 0
    },
    'elf': {
      'id': pushID('e772'),
      'name': 'Elf',
      'increases': [
        {'ability': 'DEX', 'mod': 2}
      ],
      'speed': 30,
      'traits': [
        'darkvision',
        'keen_senses',
        'fey_ancestry',
        'trance',
        'elf_weapon_training'
      ],
      'proficiencies': [
        getTag('skills', 'perception'),
        getTag('weapons', 'longsword'),
        getTag('weapons', 'shortsword'),
        getTag('weapons', 'shortbow'),
        getTag('weapons', 'longbow')
      ],
      'languages': [
        'common',
        'elvish'
      ],
      'subraces': [
        'high_elf',
        'wood_elf',
        'dark_elf'
      ],
      'maxHP_bonus': 0
    }
  };

  console.log('Storing races...');
  var dataRef = database.ref('data/races');
  dataRef.set(races);
  console.log('Races stored!');
}

function storeClasses() {
  var classes = {
    'barbarian': {
      'id': pushID('d2d8'),
      'name': 'Barbarian',
      'hitDice': {
        'num': 1,
        'die': 12,
        'text': '1d12'
      },
      'proficiencies': [
        getTag('armor/categories', 'light'),
        getTag('armor/categories', 'medium'),
        getTag('armor/categories', 'shield'),
        getTag('weapons/categories', 'simple'),
        getTag('weapons/categories', 'martial'),
        getTag('abilities', 'STR'),
        getTag('abilities', 'CON'),
        getChooseGroup(2, [
          getTag('skills', 'animal_handling'),
          getTag('skills', 'athletics'),
          getTag('skills', 'intimidation'),
          getTag('skills', 'nature'),
          getTag('skills', 'perception'),
          getTag('skills', 'survival')
        ])
      ],
      'equipment': [
        getChooseGroup(1, [
          getTag('weapons', 'greataxe', 1),
          getTagFilter('weapons', [
              getCondition('class', 'melee'),
              getCondition('category', 'martial')
            ],
            1
          )
        ]),
        getChooseGroup(1, [
          getTag('weapons', 'handaxe', 2),
          getTagFilter('weapons', [
              getCondition('category', 'simple')
            ],
            1
          )
        ]),
        getTag('gear/packs', 'explorer'),
        getTag('weapons', 'javelin', 4)
      ]
    },
    'bard': {
      'id': pushID('cfc4'),
      'name': 'Bard',
      'hitDice': {
        'num': 1,
        'die': 8,
        'text': '1d8'
      },
      'proficiencies': [
        getTag('armor/categories', 'light'),
        getTag('weapons/categories', 'simple'),
        getTag('weapons', 'hand_crossbow'),
        getTag('weapons', 'longsword'),
        getTag('weapons', 'rapier'),
        getTag('weapons', 'shortsword'),
        getChooseGroup(3, [getTagFilter('tools', [
          getCondition('category', 'instrument')
        ])]),
        getTag('abilities', 'DEX'),
        getTag('abilities', 'CHA'),
        getChooseGroup(3, [getTag('skills', 'any')])
      ],
      'equipment': [
        getChooseGroup(1, [
          getTag('weapons', 'rapier', 1),
          getTag('weapons', 'longsword', 1),
          getTagFilter('weapons', [getCondition('category', 'simple')], 1),
        ]),
        getChooseGroup(1, [
          getTag('gear/packs', 'diplomat', 1),
          getTag('gear/packs', 'entertainer', 1)
        ]),
        getChooseGroup(1, [getTagFilter('tools', [getCondition('category', 'instrument')])]),
        getTag('armor', 'leather', 1),
        getTag('weapons', 'dagger', 4)
      ]
    }
  };

  console.log('Storing classes...');
  var dataRef = database.ref('data/classes');
  dataRef.set(classes);
  console.log('Classes stored!');
}
