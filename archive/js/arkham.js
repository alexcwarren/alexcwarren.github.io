/* Database data
 */
var data = {
  'campaigns': {
    'night_of_the_zealot': {
      'name': 'Night of the Zealot',
      'key': 'night_of_the_zealot',
      'chaosBag': {
        'easy': {
          '+1': {
            'quantity': 2,
            'value': '+1'
          },
          '0': {
            'quantity': 3,
            'value': '0'
          },
          '-1': {
            'quantity': 3,
            'value': '-1'
          },
          '-2': {
            'quantity': 2,
            'value': '-2'
          },
          'skull': {
            'quantity': 2,
            'value': 'skull'
          },
          'hood': {
            'quantity': 1,
            'value': 'hood'
          },
          'tablet': {
            'quantity': 1,
            'value': 'tablet'
          },
          'cthulu': {
            'quantity': 1,
            'value': 'cthulu'
          },
          'star': {
            'quantity': 1,
            'value': 'star'
          }
        },
        'standard': {},
        'hard': {},
        'expert': {}
      }
    },
    'campaign2': {
      'name': 'Campaign 2',
      'key': 'campaign2'
    },
    'campaign3': {
      'name': 'Campaign 3',
      'key': 'campaign3'
    }
  },

  'difficulties': {
    'easy': {
      'name': 'Easy',
      'key': 'easy'
    },
    'standard': {
      'name': 'Standard',
      'key': 'standard'
    },
    'hard': {
      'name': 'Hard',
      'key': 'hard'
    },
    'expert': {
      'name': 'Expert',
      'key': 'expert'
    }
  },

  'investigators': {
    'roland': {
      'name': 'Roland',
      'key': 'roland',
      'deck': {
        'card1': true,
        'card2': true,
        'card3': true
      }
    },
    'wendy': {
      'name': 'Wendy',
      'key': 'wendy',
      'deck': {
        'card4': true,
        'card5': true,
        'card6': true
      }
    }
  },

  'decks': {
    'roland': {
      'card1': true,
      'card2': true,
      'card3': true
    },
    'wendy': {
      'card4': true,
      'card5': true,
      'card6': true
    }
  },

  'cards': {
    'card1': {
      'key': 'card1',
      'name': 'Card 1',
      'type': 'player',
      'subType': 'event'
    },
    'card2': {
      'key': 'card2',
      'name': 'Card 2',
      'type': 'player',
      'subType': 'skill'
    },
    'card3': {
      'key': 'card3',
      'name': 'Card 3',
      'type': 'player',
      'subType': 'event'
    },
    'card4': {
      'key': 'card4',
      'name': 'Card 4',
      'type': 'player',
      'subType': 'skill'
    },
    'card5': {
      'key': 'card5',
      'name': 'Card 5',
      'type': 'player',
      'subType': 'event'
    },
    'card6': {
      'key': 'card6',
      'name': 'Card 6',
      'type': 'player',
      'subType': 'event'
    }
  }
};


/* Model
*/
var model = {
  'hasKey': function(dataKey, objectName=null) {
    if (objectName === null) {
      return Object.keys(data).includes(dataKey);
    }
    return Object.keys(data[objectName]).includes(dataKey);
  },

  'getObj': function(dataKey, objectName=null) {
    if (objectName === null) {
      return data[dataKey];
    }
    return data[objectName][dataKey];
  }
};

/* View
 */
var view = {
  'MAIN': document.getElementById('main'),

  'append': function(element) {
    this.MAIN.appendChild(element);
  },

  'remove': function(element) {
    this.MAIN.removeChild(element);
  },

  'removeAll': function() {
    this.removeChildren(this.MAIN);
  },

  'getStartPageSelectDiv': function(elementId, labelName, dataKey) {
    var selectDiv = document.createElement('div');
    
    var label = document.createElement('label');
    label.innerText = labelName;
    selectDiv.appendChild(label);
    
    var select = document.createElement('select');
    select.id = elementId;
    let nullOption = document.createElement('option');
    nullOption.text = `-- Choose ${labelName} --`;
    nullOption.value = null;
    select.add(nullOption);
    
    const objList = controller.getData(dataKey);
    for (objKey in objList) {
      let obj = objList[objKey];

      let option = document.createElement('option');
      option.text = obj.name;
      option.value = obj.key;
      
      select.add(option);
    }
    selectDiv.appendChild(select);

    return selectDiv;
  },

  'loadStartPage': function() {
    game.deactivate();
    this.removeAll();

    var title = document.createElement('h1');
    title.innerText = 'Arkham Horror';
    this.append(title);

    var newGameButton = document.createElement('button');
    newGameButton.innerText = 'New Game';
    newGameButton.setAttribute('onclick', `game.start()`);
    this.append(newGameButton);

    var loadGameButton = document.createElement('button');
    loadGameButton.innerText = 'Load Game';
    loadGameButton.setAttribute('onclick', `game.load()`);
    this.append(loadGameButton);
  },

  'loadNewGamePage': function() {
    this.removeAll();

    var title = document.createElement('h1');
    title.innerText = 'Arkham Horror';
    this.append(title);

    var selectCampaign = this.getStartPageSelectDiv('select-campaign', 'Campaign', 'campaigns');
    this.append(selectCampaign);

    var selectDifficulty = this.getStartPageSelectDiv('select-difficulty', 'Difficulty', 'difficulties');
    this.append(selectDifficulty);

    var selectInvestigator = this.getStartPageSelectDiv('select-investigator', 'Investigator', 'investigators');
    this.append(selectInvestigator);

    var backButton = document.createElement('button');
    backButton.innerText = 'Back to Menu';
    backButton.setAttribute('onclick', 'view.loadStartPage()');
    this.append(backButton);

    var startButton = document.createElement('button');
    startButton.innerText = 'Start Game';
    let onclick = `game.init(document.getElementById('select-campaign').value, document.getElementById('select-difficulty').value, document.getElementById('select-investigator').value)`;
    startButton.setAttribute('onclick', onclick);
    this.append(startButton);
  },

  'loadGamePage': function() {
    this.removeAll();

    var menuButton = document.createElement('button');
    menuButton.innerText = 'Menu';
    menuButton.setAttribute('onclick', `view.loadStartPage()`);
    this.append(menuButton);

    var campaign = document.createElement('label');
    campaign.innerText = '>>' + game.getCampaignName() + '<<';
    campaign.style.display = 'block';
    this.append(campaign);

    var difficulty = document.createElement('label');
    difficulty.innerText = '>>' + game.getDifficulty() + '<<';
    difficulty.style.display = 'block';
    this.append(difficulty);

    var investigator = document.createElement('label');
    investigator.innerText = '>>' + game.getInvestigatorName() + '<<';
    investigator.style.display = 'block';
    this.append(investigator);

    var playerDeckLabel = document.createElement('label');
    playerDeckLabel.innerText = 'Player deck:';
    playerDeckLabel.style.display = 'block';
    this.append(playerDeckLabel);

    var playerDeckUL = document.createElement('ul');
    for (let card of game.getPlayerDeck().cards) {
      let li = document.createElement('li');
      li.innerText = card.name;
      playerDeckUL.appendChild(li);
    }
    this.append(playerDeckUL);

    var chaosBagLabel = document.createElement('label');
    chaosBagLabel.innerText = 'Chaos bag:';
    chaosBagLabel.style.display = 'block';
    this.append(chaosBagLabel);

    var chaosBagUL = document.createElement('ul');
    for (let token of game.getChaosBag()) {
      let li = document.createElement('li');
      li.innerText = token;
      chaosBagUL.appendChild(li);
    }
    this.append(chaosBagUL);

    this.append(game.playerDeck.div);
  },

  'removeChildren': function(element) {
    var child = element.lastElementChild;
    while (child) {
      element.removeChild(child);
      child = element.lastElementChild;
    }
  }
};

/* Controller
 */
var controller = {
  'getData': function(dataKey) {
    if (!model.hasKey(dataKey)) {
      console.log(`${dataKey} is invalid data key`);
      return null;
    }
    return model.getObj(dataKey);
  },

  /* Returns array of card objects
   */
  'getInvestigatorDeck': function(investigatorName) {
    if (!model.hasKey(investigatorName, 'investigators')) {
      console.log(`${investigatorName} is invalid investigator name`);
      return null;
    }

    let cardKeys = model.getObj(investigatorName, 'investigators').deck;
    let cardsObj = model.getObj('cards');
    let deck = [];
    for (cardKey in cardKeys) {
      let card = cardsObj[cardKey];
      deck.push(card);
    }
    return deck;
  },

  'getCampaignName': function(campaignKey) {
    if (!model.hasKey(campaignKey, 'campaigns')) {
      console.log(`${campaignKey} is invalid campaign key`);
      return null;
    }
    return model.getObj(campaignKey, 'campaigns').name;
  },

  'getDifficultyName': function(difficultyKey) {
    if (!model.hasKey(difficultyKey, 'difficulties')) {
      console.log(`${difficultyKey} is invalid difficulty key`);
      return null;
    }
    return model.getObj(difficultyKey, 'difficulties').name;
  },

  'getInvestigatorName': function(investigatorKey) {
    if (!model.hasKey(investigatorKey, 'investigators')) {
      console.log(`${investigatorKey} is invalid investigator key`);
      return null;
    }
    return model.getObj(investigatorKey, 'investigators').name;
  },

  'getPlayerDeckKey': function(investigatorKey) {
    if (!model.hasKey(investigatorKey, 'decks')) {
      console.log(`${investigatorKey} is invalid investigator key`);
      return null;
    }
    return model.getObj(investigatorKey, 'decks').name;
  },

  'getChaosBag': function(campaignKey, difficultyKey) {
    if (!model.hasKey(campaignKey, 'campaigns')) {}
    if (!model.hasKey(difficultyKey, 'difficulties')) {}
    
    let chaosBagList = [];
    var chaosBagObj = model.getObj(campaignKey, 'campaigns').chaosBag[difficultyKey];
    for (let tokenKey in chaosBagObj) {
      let chaosToken = chaosBagObj[tokenKey];
      for (let i = 0; i < chaosToken.quantity; i++) {
        chaosBagList.push(chaosToken.value);
      }
    }
    return chaosBagList;
  }
};


/* Factories
 */
const DeckFactory = {
  'getDeck': function(deckType, cardList) {
    if (deckType.toLowerCase() === 'player') {
      return new PlayerDeck(cardList);
    }
    else if (deckType.toLowerCase() === 'agenda') {}
    else if (deckType.toLowerCase() === 'act') {}
    else if (deckType.toLowerCase() === 'encounter') {}

    return null;
  }
};

const CardFactory = {
  'getCard': function(cardObj) {
    let card = new NullCard();

    if (cardObj.type.toLowerCase() === 'player') {
      if (cardObj.subType.toLowerCase() === 'event') {
        card = new EventCard(cardObj);
      }
    }
    else if (cardType.toLowerCase() === 'agenda') {}
    else if (cardType.toLowerCase() === 'act') {}
    else if (cardType.toLowerCase() === 'encounter') {}
    else if (cardType.toLowerCase() === 'location') {}

    return card.type === null ? null : card;
  }
};

/* Classes
 */
class Deck {
  constructor(deckType, cardList) {
    this.type = deckType;
    
    this.cards = [];
    for (let cardKey in cardList) {
      let cardObj = cardList[cardKey];
      let card = CardFactory.getCard(cardObj);

      if (card !== null) {
        this.cards.push(card);
      }
    }

    this.div = this.getDiv();
  }

  getDiv() {
    let div = document.createElement('div');
    div.innerText = `${this.type.toUpperCase()}DECK_DIV`;
    return div;
  }
}

class PlayerDeck extends Deck {
  constructor(cardList) {
    super('player', cardList);
  }
}

class Card {
  constructor(type=null, subType=null, card=null) {
    if (type === null) {
      this.type = null;
      return;
    }

    this.type = type;
    this.subType = subType;
    this.obj = card;
    this.name = card.name;
  }
}

class NullCard extends Card {
  constructor() {
    super();
  }
}

class PlayerCard extends Card {
  constructor(subType, card) {
    super('player', subType, card);
  }
}

class AssetCard extends PlayerCard {
  constructor(card) {
    super('asset', card);
    this.resourceCost = 0;
    this.skillBoosts = [];
    this.level = 0;
  }
}

class SkillCard extends PlayerCard {
  constructor(card) {
    super('skill', card);
    this.skillBoosts = [];
    this.level = 0;
  }
}

class EventCard extends PlayerCard {
  constructor(card) {
    super('event', card);
    this.resourceCost = 0;
    this.skillBoosts = [];
    this.level = 0;
  }
}

class WeaknessCard extends PlayerCard {
  constructor(card) {
    super('event', card);
  }
}

class ScenarioCard extends Card {
  constructor(subType, cardKey) {
    super('scenario', subType, cardKey);
  }
}

class AgendaCard extends ScenarioCard {
  constructor(cardKey) {
    super('agenda', cardKey);
  }
}

class ActCard extends ScenarioCard {
  constructor(cardKey) {
    super('act', cardKey);
  }
}

class ReferenceCard extends ScenarioCard {
  constructor(cardKey) {
    super('reference', cardKey);
  }
}

class LocationCard extends ScenarioCard {
  constructor(cardKey) {
    super('location', cardKey);
  }
}

class EncounterCard extends ScenarioCard {
  constructor(cardKey) {
    super('encounter', cardKey);
  }
}

class EnemyCard extends EncounterCard {
  constructor(cardKey) {
    super('enemy', cardKey);
  }
}

class TreacheryCard extends EncounterCard {
  constructor(cardKey) {
    super('treachery', cardKey);
  }
}

/* Game
 */
var game = {
  'campaignKey': null,
  'campaignName': null,
  'difficultyKey': null,
  'difficulty': null,
  'chaosBag': null,
  'investigatorKey': null,
  'investigatorName': null,
  'playerDeck': null,
  'encounterDeck': null,

  'init': function(campaignKey, difficultyKey, investigatorKey) {
    console.log('Loading game...');
    localStorage.clear();
    
    this.campaignKey = campaignKey;
    this.campaignName = controller.getCampaignName(campaignKey);

    this.difficultyKey = difficultyKey;
    this.difficulty = controller.getDifficultyName(difficultyKey);

    this.chaosBag = this.getChaosBag();

    this.investigatorKey = investigatorKey;
    this.investigatorName = controller.getInvestigatorName(investigatorKey);

    this.playerDeck = this.getPlayerDeck();

    this.autosave();
    view.loadGamePage();
  },

  'start': function() {
    view.loadNewGamePage()
  },

  'load': function() {
    view.loadGamePage();
  },

  'getCampaignKey': function() {
    if (this.campaignKey === null) {
      this.campaignKey = localStorage.getItem('campaignKey');
    }
    return this.campaignKey;
  },

  'getCampaignName': function() {
    if (this.campaignName === null) {
      this.campaignName = localStorage.getItem('campaignName');
    }
    return this.campaignName;
  },

  'getDifficultyKey': function() {
    if (this.difficultyKey === null) {
      this.difficultyKey = localStorage.getItem('difficultyKey');
    }
    return this.difficultyKey;
  },

  'getDifficulty': function() {
    if (this.difficulty === null) {
      this.difficulty = localStorage.getItem('difficulty');
    }
    return this.difficulty;
  },

  'getChaosBag': function() {
    if (this.chaosBag === null) {
      this.chaosBag = controller.getChaosBag(this.getCampaignKey(), this.getDifficultyKey());
    }
    return this.chaosBag;
  },

  'getInvestigatorKey': function() {
    if (this.investigatorKey === null) {
      this.investigatorKey = localStorage.getItem('investigatorKey');
    }
    return this.investigatorKey;
  },

  'getInvestigatorName': function() {
    if (this.investigatorName === null) {
      this.investigatorName = localStorage.getItem('investigatorName');
    }
    return this.investigatorName;
  },

  'getPlayerDeck': function() {
    if (this.playerDeck === null) {
      this.playerDeck = DeckFactory.getDeck('PLAYER', controller.getInvestigatorDeck(this.getInvestigatorKey()));
    }
    return this.playerDeck;
  },

  'deactivate': function() {
    localStorage.setItem('isGameActive', 'false');
  },

  'autosave': function() {
    localStorage.setItem('isGameActive', 'true');
    localStorage.setItem('campaignKey', this.campaignKey),
    localStorage.setItem('campaignName', this.campaignName),
    localStorage.setItem('difficultyKey', this.difficultyKey),
    localStorage.setItem('difficulty', this.difficulty),
    localStorage.setItem('investigatorKey', this.investigatorKey)
    localStorage.setItem('investigatorName', this.investigatorName)
  }
};

window.onload = function() {
  if (localStorage.getItem('isGameActive') === 'true') {
    view.loadGamePage();
  }
  else {
    view.loadStartPage();
  }
};