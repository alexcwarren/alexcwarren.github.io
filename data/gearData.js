function makeGearEnum(name) {
  // console.log('before:', name);
  name = name.replace(/ \((\d+)\)/g, '_$1');
  name = name.replace(/\'/g, '');
  name = name.replace(/, /g, '_');
  name = name.replace(/ /g, '_');
  // console.log('after:', name);

  var upper = name.toUpperCase();
  // console.log('upper:', upper);
  var value = name.toLowerCase();
  // console.log('value:', value);

  var gearEnum =
  `
    '${upper}': {
      'VALUE': '${value}',
      'PATH': PATH.GEAR
    },`;

  return gearEnum;
}

const COIN = {
  'CP': 'cp',
  'SP': 'sp',
  'EP': 'ep',
  'GP': 'gp',
  'PP': 'pp'
};
const COIN_MULTIPLIER = {
  'cp': 100,
  'sp': 10,
  'ep': 2,
  'gp': 1,
  'pp': 0.1
};
const coinTypes = [COIN.CP, COIN.SP, COIN.EP, COIN.GP, COIN.PP];

function makeGear(name, cost, coinType, weight=0, weightUnit=null) {
  // Input validation
  if (name === '' || typeof cost !== typeof 1 || !coinTypes.includes(coinType)) {
    var error = 'ERROR: Invalid input';
    console.log(error);
    alert(error);
  }

  if (weightUnit !== null && weightUnit !== 'lb.') {
    var warning = 'ERROR: ' + name + ': Different weight unit: ' + weightUnit;
    console.log(warning);
    alert(warning);
  }

  // Convert cost to costGP
  var costGP = cost * COIN_MULTIPLIER[coinType];
  // console.log(cost, coinType, COIN_MULTIPLIER[coinType], costGP);

  var gear = 'gear[GEAR..VALUE] = Gear(\n';
     gear += '  pushID(GEAR..VALUE),\n';
     gear += '  \'' + name + '\',\n';
     gear += '  ' + costGP + ',\n';
     gear += '  ' + weight + ',\n';
     gear += '  ' + 'null' + ',\n';
     gear += '  ' + 'null' + ',\n';
     gear += '  ' + 'null' + '\n';
     gear += '\);\n\n';

  return gear;
}

function makeGearEnums() {
  var gearEnums = '';

  // gearEnums += makeGearEnum('Abacus');
  gearEnums += makeGearEnum('Acid (vial)');
  gearEnums += makeGearEnum('Alchemist\'s fire (flask)');

  // Ammunition
  // gearEnums += makeGearEnum('Arrows (20)');
  // gearEnums += makeGearEnum('Blowgun needles (50)');
  // gearEnums += makeGearEnum('Crossbow bolts (20)');
  // gearEnums += makeGearEnum('Sling bullets (20)');

  gearEnums += makeGearEnum('Antitoxin (vial)');

  // Arcane focus
  // gearEnums += makeGearEnum('Crystal');
  // gearEnums += makeGearEnum('Orb');
  // gearEnums += makeGearEnum('Rod');
  // gearEnums += makeGearEnum('Staff');
  // gearEnums += makeGearEnum('Wand');

  gearEnums += makeGearEnum('Ball bearings (bag of 1,000)');
  // gearEnums += makeGearEnum('Barrel');
  // gearEnums += makeGearEnum('Basket');
  // gearEnums += makeGearEnum('Bell');
  // gearEnums += makeGearEnum('Blanket');
  // gearEnums += makeGearEnum('Block and tackle');
  // gearEnums += makeGearEnum('Book');
  gearEnums += makeGearEnum('Bottle, glass');
  // gearEnums += makeGearEnum('Bucket');
  gearEnums += makeGearEnum('Caltrops (bag of 20)');
  // gearEnums += makeGearEnum('Case, crossbow bolt');
  gearEnums += makeGearEnum('Chain (10 feet)');
  gearEnums += makeGearEnum('Chalk (1 piece)');
  // gearEnums += makeGearEnum('Climber\'s kit');
  // gearEnums += makeGearEnum('Clothes, common');
  // gearEnums += makeGearEnum('Clothes, traveler\'s');
  // gearEnums += makeGearEnum('Component pouch');
  // gearEnums += makeGearEnum('Crowbar');

  // Druidic focus
  // gearEnums += makeGearEnum('Sprig of mistletoe');
  // gearEnums += makeGearEnum('Totem');
  // gearEnums += makeGearEnum('Wooden staff');
  // gearEnums += makeGearEnum('Yew wand');
  //
  // gearEnums += makeGearEnum('Fishing tackle');
  // gearEnums += makeGearEnum('Grappling hook');
  // gearEnums += makeGearEnum('Hammer');
  // gearEnums += makeGearEnum('Hammer, sledge');
  // gearEnums += makeGearEnum('Healer\'s kit');
  //
  // // Holy symbol
  // gearEnums += makeGearEnum('Amulet');
  // gearEnums += makeGearEnum('Emblem');
  // gearEnums += makeGearEnum('Reliquary');

  gearEnums += makeGearEnum('Holy water (flask)');
  // gearEnums += makeGearEnum('Hourglass');
  // gearEnums += makeGearEnum('Hunting trap');
  gearEnums += makeGearEnum('Jug or pitcher');
  gearEnums += makeGearEnum('Ladder (10-foot)');
  // gearEnums += makeGearEnum('Lantern, bullseye');
  // gearEnums += makeGearEnum('Lantern, hooded');
  // gearEnums += makeGearEnum('Lock');
  // gearEnums += makeGearEnum('Magnifying glass');
  // gearEnums += makeGearEnum('Manacles');
  // gearEnums += makeGearEnum('Mirror, steel');
  gearEnums += makeGearEnum('Parchment (one sheet)');
  // gearEnums += makeGearEnum('Pick, miner\'s');
  // gearEnums += makeGearEnum('Piton');
  gearEnums += makeGearEnum('Poison, basic (vial)');
  gearEnums += makeGearEnum('Pole (10-foot)');
  // gearEnums += makeGearEnum('Pot, iron');
  // gearEnums += makeGearEnum('Potion of healing');
  // gearEnums += makeGearEnum('Pouch');
  // gearEnums += makeGearEnum('Quiver');
  // gearEnums += makeGearEnum('Ram, portable');
  // gearEnums += makeGearEnum('Robes');
  gearEnums += makeGearEnum('Rope, silk (50 feet)');
  // gearEnums += makeGearEnum('Sack');
  // gearEnums += makeGearEnum('Scale, merchant\'s');
  // gearEnums += makeGearEnum('Shovel');
  // gearEnums += makeGearEnum('Signal whistle');
  // gearEnums += makeGearEnum('Signet ring');
  // gearEnums += makeGearEnum('Spellbook');
  // gearEnums += makeGearEnum('Spikes, iron (10)');
  // gearEnums += makeGearEnum('Spyglass');
  // gearEnums += makeGearEnum('Tent, two-person');
  // gearEnums += makeGearEnum('Whetstone');

  console.log(gearEnums);
}

function makeGears() {
  var gears = '';

  gears += makeGear('Abacus', 2, 'gp', 2, 'lb.');
  gears += makeGear('Acid (vial)', 25, 'gp', 1, 'lb.');
  gears += makeGear('Alchemist\'s fire (flask)', 50, 'gp', 1, 'lb.');

  // Ammunition
  gears += makeGear('Arrows (20)', 1, 'gp', 1, 'lb.');
  gears += makeGear('Blowgun needles (50)', 1, 'gp', 1, 'lb.');
  gears += makeGear('Crossbow bolts (20)', 1, 'gp', 1.5, 'lb.');
  gears += makeGear('Sling bullets (20)', 4, 'cp', 1.5, 'lb.');

  gears += makeGear('Antitoxin (vial)', 50, 'gp');

  // Arcane focus
  gears += makeGear('Crystal', 10, 'gp', 1, 'lb.');
  gears += makeGear('Orb', 20, 'gp', 3, 'lb.');
  gears += makeGear('Rod', 10, 'gp', 2, 'lb.');
  gears += makeGear('Staff', 5, 'gp', 4, 'lb.');
  gears += makeGear('Wand', 10, 'gp', 1, 'lb.');

  // makeGear('Backpack', 2, 'gp', 5, 'lb.');
  gears += makeGear('Ball bearings (bag of 1,000)', 1, 'gp', 2, 'lb.');
  gears += makeGear('Barrel', 2, 'gp', 70, 'lb.');
  gears += makeGear('Basket', 4, 'sp', 2, 'lb.');
  // makeGear('Bedroll', 1, 'gp', 7, 'lb.');
  gears += makeGear('Bell', 1, 'gp');
  gears += makeGear('Blanket', 5, 'sp', 3, 'lb.');
  gears += makeGear('Block and tackle', 1, 'gp', 5, 'lb.');
  gears += makeGear('Book', 25, 'gp', 5, 'lb.');
  gears += makeGear('Bottle, glass', 2, 'gp', 2, 'lb.');
  gears += makeGear('Bucket', 5, 'cp', 2, 'lb.');
  gears += makeGear('Caltrops (bag of 20)', 1, 'gp', 2, 'lb.');
  // makeGear('Candle', 1, 'cp');
  gears += makeGear('Case, crossbow bolt', 1, 'gp', 1, 'lb.');
  // makeGear('Case, map or scroll', 1, 'gp', 1, 'lb.');
  gears += makeGear('Chain (10 feet)', 5, 'gp', 10, 'lb.');
  gears += makeGear('Chalk (1 piece)', 1, 'cp');
  // makeGear('Chest', 5, 'gp', 25, 'lb.');
  gears += makeGear('Climber\'s kit', 25, 'gp', 12, 'lb.');
  gears += makeGear('Clothes, common', 5, 'sp', 3, 'lb.');
  // makeGear('Clothes, costume', 5, 'gp', 4, 'lb.');
  // makeGear('Clothes, fine', 15, 'gp', 6, 'lb.');
  gears += makeGear('Clothes, traveler\'s', 2, 'gp', 4, 'lb.');
  gears += makeGear('Component pouch', 25, 'gp', 2, 'lb.');
  gears += makeGear('Crowbar', 2, 'gp', 5, 'lb.');

  // Druidic focus
  gears += makeGear('Sprig of mistletoe', 1, 'gp');
  gears += makeGear('Totem', 1, 'gp');
  gears += makeGear('Wooden staff', 5, 'gp', 4, 'lb.');
  gears += makeGear('Yew wand', 10, 'gp', 1, 'lb.');

  gears += makeGear('Fishing tackle', 1, 'gp', 4, 'lb.');
  // makeGear('Flask or tankard', 2, 'cp', 1, 'lb.');
  gears += makeGear('Grappling hook', 2, 'gp', 4, 'lb.');
  gears += makeGear('Hammer', 1, 'gp', 3, 'lb.');
  gears += makeGear('Hammer, sledge', 2, 'gp', 10, 'lb.');
  gears += makeGear('Healer\'s kit', 5, 'gp', 3, 'lb.');

  // Holy symbol
  gears += makeGear('Amulet', 5, 'gp', 1, 'lb.');
  gears += makeGear('Emblem', 5, 'gp');
  gears += makeGear('Reliquary', 5, 'gp', 2, 'lb.');

  gears += makeGear('Holy water (flask)', 25, 'gp', 1, 'lb.');
  gears += makeGear('Hourglass', 25, 'gp', 1, 'lb.');
  gears += makeGear('Hunting trap', 5, 'gp', 25, 'lb.');
  // makeGear('Ink (1 ounce bottle)', 10, 'gp');
  // makeGear('Ink pen', 2, 'cp');
  gears += makeGear('Jug or pitcher', 2, 'cp', 4, 'lb.');
  gears += makeGear('Ladder (10-foot)', 1, 'sp', 25, 'lb.');
  // makeGear('Lamp', 5, 'sp', 1, 'lb.');
  gears += makeGear('Lantern, bullseye', 10, 'gp', 2, 'lb.');
  gears += makeGear('Lantern, hooded', 5, 'gp', 2, 'lb.');
  gears += makeGear('Lock', 10, 'gp', 1, 'lb.');
  gears += makeGear('Magnifying glass', 100, 'gp');
  gears += makeGear('Manacles', 2, 'gp', 6, 'lb.');
  // makeGear('Mess kit', 2, 'sp', 1, 'lb.');
  gears += makeGear('Mirror, steel', 5, 'gp', 0.5, 'lb.');
  // makeGear('Oil (flask)', 1, 'sp', 1, 'lb.');
  // makeGear('Paper (one sheet)', 2, 'sp');
  gears += makeGear('Parchment (one sheet)', 1, 'sp');
  // makeGear('Perfume (vial)', 5, 'gp');
  gears += makeGear('Pick, miner\'s', 2, 'gp', 10, 'lb.');
  gears += makeGear('Piton', 5, 'cp', 0.25, 'lb.');
  gears += makeGear('Poison, basic (vial)', 100, 'gp');
  gears += makeGear('Pole (10-foot)', 5, 'cp', 7, 'lb.');
  gears += makeGear('Pot, iron', 2, 'gp', 10, 'lb.');
  gears += makeGear('Potion of healing', 50, 'gp', 0.5, 'lb.');
  gears += makeGear('Pouch', 5, 'sp', 1, 'lb.');
  gears += makeGear('Quiver', 1, 'gp', 1, 'lb.');
  gears += makeGear('Ram, portable', 4, 'gp', 35, 'lb.');
  // makeGear('Rations (1 day)', 5, 'sp', 2, 'lb.');
  gears += makeGear('Robes', 1, 'gp', 4, 'lb.');
  // makeGear('Rope, hempen (50 feet)', 1, 'gp', 10, 'lb.');
  gears += makeGear('Rope, silk (50 feet)', 10, 'gp', 5, 'lb.');
  gears += makeGear('Sack', 1, 'cp', 0.5, 'lb.');
  gears += makeGear('Scale, merchant\'s', 5, 'gp', 3, 'lb.');
  // makeGear('Sealing wax', 5, 'sp');
  gears += makeGear('Shovel', 2, 'gp', 5, 'lb.');
  gears += makeGear('Signal whistle', 5, 'cp');
  gears += makeGear('Signet ring', 5, 'gp');
  // makeGear('Soap', 2, 'cp');
  gears += makeGear('Spellbook', 50, 'gp', 3, 'lb.');
  gears += makeGear('Spikes, iron (10)', 1, 'gp', 5, 'lb.');
  gears += makeGear('Spyglass', 1000, 'gp', 1, 'lb.');
  gears += makeGear('Tent, two-person', 2, 'gp', 20, 'lb.');
  // makeGear('Tinderbox', 5, 'sp', 1, 'lb.');
  // makeGear('Torch', 1, 'cp', 1, 'lb.');
  // makeGear('Vial', 1, 'gp');
  // makeGear('Waterskin', 2, 'sp', 5, 'lb.');
  gears += makeGear('Whetstone', 1, 'cp', 1, 'lb.');

  console.log(gears);
}
