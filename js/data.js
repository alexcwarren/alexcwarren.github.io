

function storeData() {
  storeAbilities();
  storeSkills();
  storeLanguages();
  storeWeapons();
  storeArmor();
  storeTools();
  storeTraits();
  storeRaces();
}

function storeAbilities() {
  var abilities = {
    'STR': {
      'id': '8d66',
      'name': 'STR',
      'longName': 'Strength'
    },
    'DEX': {
      'id': '5336',
      'name': 'DEX',
      'longName': 'Dexterity'
    },
    'CON': {
      'id': '3aca',
      'name': 'CON',
      'longName': 'Constitution'
    },
    'INT': {
      'id': 'f676',
      'name': 'INT',
      'longName': 'Intelligence'
    },
    'WIS': {
      'id': '8543',
      'name': 'WIS',
      'longName': 'Wisdom'
    },
    'CHA': {
      'id': '1842',
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
      'id': '71c6',
      'name': 'Athletics',
      'parentAbility': '8d66'
    },
    'acrobatics': {
      'id': 'cb4b',
      'name': 'Acrobatics',
      'parentAbility': '5336'
    },
    'sleight_of_hand': {
      'id': 'a8e0',
      'name': 'Sleight of Hand',
      'parentAbility': '5336'
    },
    'stealth': {
      'id': '94da',
      'name': 'Stealth',
      'parentAbility': '5336'
    },
    'arcana': {
      'id': '86d9',
      'name': 'Arcana',
      'parentAbility': 'f676'
    },
    'history': {
      'id': '3f94',
      'name': 'History',
      'parentAbility': 'f676'
    },
    'investigation': {
      'id': 'c68b',
      'name': 'Investigation',
      'parentAbility': 'f676'
    },
    'nature': {
      'id': '5b8c',
      'name': 'Nature',
      'parentAbility': 'f676'
    },
    'religion': {
      'id': '3783',
      'name': 'Religion',
      'parentAbility': 'f676'
    },
    'animal_handling': {
      'id': '26bb',
      'name': 'Animal Handling',
      'parentAbility': '8543'
    },
    'insight': {
      'id': 'ecd9',
      'name': 'Insight',
      'parentAbility': '8543'
    },
    'medicine': {
      'id': '7290',
      'name': 'Medicine',
      'parentAbility': '8543'
    },
    'perception': {
      'id': 'efb6',
      'name': 'Perception',
      'parentAbility': '8543'
    },
    'survival': {
      'id': 'a75f',
      'name': 'Survival',
      'parentAbility': '8543'
    },
    'deception': {
      'id': '9705',
      'name': 'Deception',
      'parentAbility': '1842'
    },
    'intimidation': {
      'id': '518d',
      'name': 'Intimidation',
      'parentAbility': '1842'
    },
    'performance': {
      'id': '978a',
      'name': 'Performance',
      'parentAbility': '1842'
    },
    'persuasion': {
      'id': '1561',
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
      'id': '3731',
      'name': 'Common'
    },
    'dwarvish': {
      'id': '1412',
      'name': 'Dwarvish'
    },
    'elvish': {
      'id': 'fa0b',
      'name': 'Elvish'
    },
    'halfling': {
      'id': '4f72',
      'name': 'Halfling'
    },
    'draconic': {
      'id': '5216',
      'name': 'Draconic'
    },
    'gnomish': {
      'id': 'f409',
      'name': 'Gnomish'
    },
    'orc': {
      'id': 'f3b1',
      'name': 'Orc'
    },
    'infernal': {
      'id': 'eca4',
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
    'melee': {'id': '16d3'},
    'ranged': {'id': 'f15d'}
  };

  var weaponCategories = {
    'simple': {'id': '471c'},
    'martial': {'id': 'ee14'}
  };

  var weapons = {
    'classes': weaponClasses,
    'categories': weaponCategories,
    'battleaxe': {
      'id': '29ef',
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
      'id': '14a4',
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
    'hammer': {
      'id': 'b114',
      'name': 'Hammer',
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
      'id': 'ed2b',
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
      'id': 'e9d7',
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
      'id': 'c002',
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
      'id': 'ce74',
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
      'id': '3382',
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
      'id': 'd4e8',
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
      'id': '306a',
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
    'light': {'id': '83d3'},
    'medium': {'id': 'd373'},
    'hard': {'id': 'edbb'},
    'shield': {'id': '553a'}
  };

  var armor = {
    'categories': armorCategories,
    'padded': {
      'id': 'b800',
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
      'id': 'e740',
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
      'id': 'c620',
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
      'id': '71b3',
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
      'id': '8e08',
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
      'id': '51e1',
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
      'id': 'baf8',
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
      'id': '6958',
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
      'id': '88e2',
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
      'id': '6af0',
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
      'id': '3bdc',
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
      'id': '43dd',
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
      'id': 'a949',
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
      'id': 'bad9',
      'name': 'Artisan\'s tools'
    },
    'gaming': {
      'id': 'e020',
      'name': 'Gaming set'
    },
    'instrument': {
      'id': '6858',
      'name': 'Musical instrument'
    }
  };

  var tools = {
    'categories': toolCategories,
    'alchemists_supplies': {
      'id': '69ed',
      'name': 'Alchemist\'s supplies',
      'category': 'bad9',
      'costGP': 50,
      'weightLB': 8
    },
    'smiths_tools': {
      'id': '72da',
      'name': 'Smith\'s tools',
      'category': 'bad9',
      'costGP': 20,
      'weightLB': 8
    },
    'brewers_supplies': {
      'id': 'cebd',
      'name': 'Brewer\'s supplies',
      'category': 'bad9',
      'costGP': 20,
      'weightLB': 9
    },
    'masons_tools': {
      'id': '12db',
      'name': 'Mason\'s tools',
      'category': 'bad9',
      'costGP': 10,
      'weightLB': 8
    }
  };

  console.log('Storing tools...');
  var dataRef = database.ref('data/tools');
  dataRef.set(tools);
  console.log('Tools stored!');
}

function storeTraits() {
  var traits = {
    'darkvision': {
      'id': 'c306',
      'name': 'Darkvision',
      'desc': 'You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it w ere dim light. You can’t discern color in darkness, only shades of gray.'
    },
    'dwarven_resilience': {
      'id': 'bbc0',
      'name': 'Dwarven Resilience',
      'desc': 'You have advantage on saving throws against poison, and you have resistance against poison damage.'
    },
    'dwarven_combat_training': {
      'id': 'c2a3',
      'name': 'Dwarven Combat Training',
      'desc': 'You have proficiency with the battleaxe, handaxe, throwing hammer, and warhammer.'
    },
    'stonecunning': {
      'id': '458d',
      'name': 'Stonecunning',
      'desc': 'Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient in the History skill and add double your proficiency bonus to the check, instead of your normal proficiency bonus.'
    },
    'dwarven_toughness': {
      'id': '3e47',
      'name': 'Dwarven Toughness',
      'desc': 'Your hit point maximum increases by 1, and it increases by 1 every time you gain a level.'
    },
    'dwarven_armor_training': {
      'id': '6449',
      'name': 'Dwarven Armor Training',
      'desc': 'You have proficiency with light and medium armor.'
    },
    'keen_senses': {
      'id': 'f40a',
      'name': 'Keen Senses',
      'desc': 'You have proficiency in the Perception skill.'
    },
    'fey_ancestry': {
      'id': 'a8de',
      'name': 'Fey Ancestry',
      'desc': 'You have advantage on saving throws against being charmed, and magic can’t put you to sleep.'
    },
    'trance': {
      'id': 'ff1e',
      'name': 'Trance',
      'desc': 'Elves don’t need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day. (The Common word for such meditation is “trance.”) While meditating, you can dream after a fashion; such dreams are actually mental exercises that have become reflexive through years of practice. After resting in this way, you gain the same benefit that a human does from 8 hours of sleep.'
    },
    'elf_weapon_training': {
      'id': 'f5c4',
      'name': 'Elf Weapon Training',
      'desc': 'You have proficiency with the longsword, shortsword, shortbow, and longbow.'
    },
    'cantrip': {
      'id': '809d',
      'name': 'Cantrip',
      'desc': 'You know one cantrip of your choice from the wizard spell list. Intelligence is your spellcasting ability for it.'
    },
    'extra_language': {
      'id': '50c0',
      'name': 'Extra Language',
      'desc': 'You can speak, read, and write one extra language of your choice.'
    },
    'fleet_of_foot': {
      'id': '132c',
      'name': 'Fleet of Foot',
      'desc': 'Your base walking speed increases to 35 feet.'
    },
    'mask_of_the_wild': {
      'id': '844d',
      'name': 'Mask of the Wild',
      'desc': 'You can attempt to hide even when you are only lightly obscured by foliage, heavy rain, falling snow, mist, and other natural phenomena.'
    },
    'superior_darkvision': {
      'id': 'a640',
      'name': 'Superior Darkvision',
      'desc': 'Your darkvision has a radius of 120 feet.'
    },
    'sunlight_sensitivity': {
      'id': '61b6',
      'name': 'Sunlight Sensitivity',
      'desc': 'You have disadvantage on attack rolls and on Wisdom (Perception) checks that rely on sight when you, the target of your attack, or whatever you are trying to perceive is in direct sunlight.'
    },
    'drow_magic': {
      'id': '8e43',
      'name': 'Drow Magic',
      'desc': 'You know the dancing lights cantrip. When you reach 3rd level, you can cast the faerie fire spell once per day. When you reach 5th level, you can also cast the darkness spell once per day. Charisma is your spellcasting ability for these spells.'
    },
    'drow_weapon_training': {
      'id': 'a652',
      'name': 'Drow Weapon Training',
      'desc': 'You have proficiency with rapiers, shortswords, and hand crossbows.'
    }
  };

  console.log('Storing traits...');
  var dataRef = database.ref('data/traits');
  dataRef.set(traits);
  console.log('Traits stored!');
}

function storeRaces() {
  var subraces = {
    'hill_dwarf': {
      'id': '58e0',
      'name': 'Hill Dwarf',
      'parentRace': '9726',
      'increases': [
        {'ability': '8543', 'mod': 1}
      ],
      'abilities': [
        '3e47'
      ],
      'maxHP_bonus': 1
    },
    'mountain_dwarf': {
      'id': 'f52b',
      'name': 'Mountain Dwarf',
      'parentRace': '9726',
      'increases': [
        {'ability': '8d66', 'mod': 2}
      ],
      'abilities': [
        '6449'
      ],
      'proficiencies': [
        {'path': 'armor', 'id': '83d3'},
        {'path': 'armor', 'id': 'd373'}
      ]
    },
    'high_elf': {
      'id': '7af4',
      'name': 'High Elf',
      'parentRace': 'e772',
      'increases': [
        {'ability': 'f676', 'mod': 1}
      ],
      'abilities': [
        '809d',
        '50c0'
      ],
      'languages': [
        [
          '1412',
          '4f72',
          '5216',
          'f409',
          'f3b1',
          'eca4'
        ]
      ]
    },
    'wood_elf': {
      'id': '8e7a',
      'name': 'Wood Elf',
      'parentRace': 'e772',
      'increases': [
        {'ability': '8543', 'mod': 1}
      ],
      'speed': 35,
      'abilities': [
        '132c',
        '844d'
      ]
    },
    'dark_elf': {
      'id': '5b81',
      'name': 'Dark Elf (Drow)',
      'parentRace': 'e772',
      'increases': [
        {'ability': '1842', 'mod': 1}
      ],
      'abilities': [
        'a640',
        '61b6',
        '8e43',
        'a652'
      ],
      'proficiencies': [
        {'path': 'weapons', 'id': 'd4e8'},
        {'path': 'weapons', 'id': 'c002'},
        {'path': 'weapons', 'id': '306a'}
      ]
    }
  };

  var races = {
    'subraces': subraces,
    'dwarf': {
      'id': '9726',
      'name': 'Dwarf',
      'increases': [
        {'ability': '3aca', 'mod': 2}
      ],
      'speed': 25,
      'abilities': [
        'c306',
        'bbc0',
        'c2a3',
        '458d'
      ],
      'proficiencies': [
        {'path': 'weapons', 'id': '29ef'},
        {'path': 'weapons', 'id': '14a4'},
        {'path': 'weapons', 'id': 'b114'},
        {'path': 'weapons', 'id': 'ed2b'},
        {'choose': [
          {'path': 'tools', 'id': '72da'},
          {'path': 'tools', 'id': 'cebd'},
          {'path': 'tools', 'id': '12db'}
        ]},
      ],
      'languages': [
        '3731',
        '1412'
      ],
      'subraces': [
        '58e0',
        'f52b'
      ],
      'maxHP_bonus': 0
    },
    'elf': {
      'id': 'e772',
      'name': 'Elf',
      'increases': [
        {'ability': '5336', 'mod': 2}
      ],
      'speed': 30,
      'abilities': [
        'c306',
        'f40a',
        'a8de',
        'ff1e',
        'f5c4'
      ],
      'proficiencies': [
        {'path': 'skills', 'id': 'efb6'},
        {'path': 'weapons', 'id': 'e9d7'},
        {'path': 'weapons', 'id': 'c002'},
        {'path': 'weapons', 'id': 'ce74'},
        {'path': 'weapons', 'id': '3382'}
      ],
      'languages': [
        '3731',
        'fa0b'
      ],
      'subraces': [
        '7af4',
        '8e7a',
        '5b81'
      ],
      'maxHP_bonus': 0
    }
  };

  console.log('Storing races...');
  var dataRef = database.ref('data/races');
  dataRef.set(races);
  console.log('Races stored!');
}
