const element = {
    'campaignTitle': document.getElementById('campaign-title'),
    'roundNum': document.getElementById('round-num'),
    'phase': document.getElementById('phase'),
    'intro': document.getElementById('intro'),
    'difficulty': document.getElementById('difficulty'),
    'scenario': document.getElementById('scenario-front'),
    'agenda': document.getElementById('agenda'),
    'act': document.getElementById('act'),
    'totalDoom': document.getElementById('total-doom'),
    'totalClues': document.getElementById('total-clues'),
    'chaosToken': document.getElementById('chaos-token'),
    'encounter': document.getElementById('encounter'),
    'encounterDiscard': document.getElementById('encounter-discard'),
    'threat1': document.getElementById('threat1'),
    'threat2': document.getElementById('threat2'),
    'threat3': document.getElementById('threat3'),
    'threat4': document.getElementById('threat4'),
    'threat5': document.getElementById('threat5'),
    'threat6': document.getElementById('threat6'),
    'threat7': document.getElementById('threat7'),
    'threat8': document.getElementById('threat8'),
    'handRow': document.getElementById('handRow'),
    'assetRow': document.getElementById('assetRow'),
    'investigatorFront': document.getElementById('investigator_front'),
    'health': document.getElementById('health'),
    'sanity': document.getElementById('sanity'),
    'cluesPool': document.getElementById('clues-pool'),
    'playerDiscard': document.getElementById('player-discard'),
    'cultistDiv': document.getElementById('cultist-div'),
    'cultistCards': document.getElementById('cultist-cards'),
    'discardedEncounters': document.getElementById('discarded-encounters'),
    'deckCards': document.getElementById('deck-cards')
  };
  
  var game = {
    'campaign': null,
    'part': null,
    'chaosBag': null,
    'agendaIndex': 0,
    'actIndex': 0,
    'visitedEncounterIndices': null,
    'discardedEncounters': [],
    'visitedCultistIndices': null,
    'visitedPlayerCardIndices': null,
    'playerDeck': [],
  
    'investigator': null,
  
    'init': function(campaignName, partNum, difficulty, investigatorName, playerDeck='deck') {
      this.campaign = campaigns[campaignName];
      
      this.part = this.campaign.part[partNum];
  
      element.cultistDiv.display = 'none';
  
      if (campaignName === 'Night of the Zealot' && partNum === '2') {
        /* Add 1 of 2 Downtown and Southside locations
         */
        var downtownIndex = getRandomInt(100) % 2 === 0 ? '1' : '2';
        var downtown = `downtown_a${downtownIndex}`;
        this.part.location.push({
          'name': downtown,
          'card': cards[downtown].src
        });
  
        var southsideIndex = getRandomInt(100) % 2 === 0 ? '1' : '2';
        var southside = `southside_a${southsideIndex}`;
        this.part.location.push({
          'name': southside,
          'card': cards[southside].src
        });
  
        /* Add Cultist deck
         */
        this.part['cultist'] = [
          cards['wolf-man_drew'].src,
          cards['herman_collins'].src,
          cards['peter_warren'].src,
          cards['victoria_devereux'].src,
          cards['ruth_turner'].src,
        ];
        element.cultistDiv.display = 'block';
  
        /* Set locations
         */
        cards.loadCard('location00', 'northside_a');
        cards.loadCard('location01', downtown);
        cards.loadCard('location02', 'easttown_a')
        cards.loadCard('location10', 'miskatonic_a')
        cards.loadCard('location11', 'rivertown_a')
        cards.loadCard('location12', 'graveyard_a')
        cards.loadCard('location20', 'st_marys_a')
        cards.loadCard('location21', southside)
      }
  
      element.campaignTitle.innerText = `${game.campaign.title} - Part ${game.part.num}: ${game.part.title}`;
      element.roundNum.innerText = 1;
      element.intro.innerText = this.part.intro;
      element.difficulty.innerText = difficulty;
  
      element.scenario.id = game.part.scenario;
      element.scenario.src = `${cards[game.part.scenario].src}`;
      element.scenario.alt = game.part.scenario;
  
      game.changeCard('agenda');
      game.changeCard('act');
      
      this.chaosBag = this.campaign.getChaosBag(difficulty);
      if (this.chaosBag === null) {
        alert('Could not load chaos bag');
        return;
      }
      
      this.visitedEncounterIndices = new Set();
      this.visitedCultistIndices = new Set();
      
      for (el of document.getElementsByClassName('locations')) {
        let nullOption = document.createElement('option');
        nullOption.text = 'location';
        el.add(nullOption);
  
        for (l of this.part.location) {
          let option = document.createElement('option');
          option.text = l.name;
          el.add(option);
        }
      }
  
      const asideSelect = document.getElementById('aside-cards');
      let nullOption = document.createElement('option');
      nullOption.text = '--';
      nullOption.value = cards['empty'].src;
      asideSelect.add(nullOption);
  
      for (aKey of this.part.aside) {
        // let aCard = this.part.aside[aKey];
        let aCard = cards[aKey];
        let option = document.createElement('option');
        option.text = aCard.name;
        option.value = aKey;
        asideSelect.add(option);
      }
  
      let nullOption2 = document.createElement('option');
      nullOption2.text = '--';
      nullOption2.value = cards['empty'].src;
      element.discardedEncounters.add(nullOption2);
  
      // Investigator:
      this.investigator = investigators[investigatorName];
      
      this.visitedPlayerCardIndices = new Set();
  
      element.investigatorFront.id = this.investigator.card;
      element.investigatorFront.src = cards[this.investigator.card].src;
      element.investigatorFront.alt = this.investigator.card;
  
      element.health.innerText = this.investigator.health;
      element.sanity.innerText = this.investigator.sanity;
  
      this.investigator.deck = investigators[investigatorName][playerDeck];
      for (i in this.investigator.deck) {
        this.playerDeck.push(this.investigator.deck[i]);
        let option = document.createElement('option');
        option.text = this.investigator.deck[i];
        option.value = this.investigator.deck[i];
        element.deckCards.add(option);
      }
      for (let i = 0; i < 5; i++) {
        game.drawPlayerCard();
      }
  
      /* Set phase to INVESTIGATION after drawing opening hand.
       * Drawing Player cards will use up Actions if phase == INVESTIGATION.
       */
      element.phase.innerText = PHASE.INVESTIGATION;
    },
    'changeCard': function(property, delta=0) {
      if (this[`${property}Index`] + delta >= this.part[property].length || this[`${property}Index`] + delta < 0) {
        return;
      }
  
      this[`${property}Index`] += delta;
      element[property].src = `${this.part[property][this[`${property}Index`]]}`;
    },
    'changeCount': function(elementID, delta) {
      if (delta > 0 && elementID === 'resources-pool' && element.phase.innerText === PHASE.INVESTIGATION) {
        var usedAction = false;
        const playerActions = document.getElementsByClassName('player-action');
        for (a of playerActions) {
          if (a.checked === false) {
            a.checked = true;
            usedAction = true;
            break;
          }
        }
        if (usedAction === false) {
          alert('No Actions left');
          return;
        }
      }
  
      const el = document.getElementById(elementID);
      var num = parseInt(el.innerText);
      el.innerText = num + delta;
  
      if (el.className === 'doom') {
        this.updateTotalDoom();
      }
      else if (el.id === 'clues-pool') {
        this.updateTotalClues();
      }
    },
    'updateTotalDoom': function() {
      let doomCount = 0;
      var dooms = document.getElementsByClassName('doom');
      for (d of dooms) {
        doomCount += parseInt(d.innerText);
      }
      element.totalDoom.innerText = doomCount;
    },
    'updateTotalClues': function() {
      element.totalClues.innerText = element.cluesPool.innerText;
    },
    'drawChaos': function() {
      let index = getRandomInt(this.chaosBag.length);
      element.chaosToken.innerText = this.chaosBag[index];
    },
    'drawEncounter': function(cultist=null) {
      if (cultist === null) {
        if (this.visitedEncounterIndices.size === this.part.encounter.length) {
          alert('All encounters drawn');
          return;
        }
  
        let index = getRandomInt(this.part.encounter.length);
        let card = this.part.encounter[index];
        while (this.visitedEncounterIndices.has(card.name)) {
          index = getRandomInt(this.part.encounter.length);
          card = this.part.encounter[index];
        }
        this.visitedEncounterIndices.add(card.name);
  
        element.encounter.src = cards[card.key].src;
        element.encounter.alt = card.name;
      }
      else {
        if (this.visitedCultistIndices.size === this.part.cultist.length) {
          alert('All cultist drawn');
          return;
        }
  
        let index = getRandomInt(this.part.cultist.length);
        while (this.visitedCultistIndices.has(index)) {
          index = getRandomInt(this.part.cultist.length);
        }
        this.visitedCultistIndices.add(index);
  
        element.encounter.src = this.part.cultist[index];
        element.encounter.alt = this.part.cultist[index];
      }
    },
    'playEncounter': function(encounterKey=null) {
      if (encounterKey !== null) {
        if (encounterKey === cards['empty'].src) {
          return;
        }
      }
      else if (element.encounter.alt === 'empty') {
        return;
      }
  
      var threats = [
        element.threat1,
        element.threat2,
        element.threat3,
        element.threat4,
        element.threat5,
        element.threat6,
        element.threat7,
        element.threat8
      ];
  
      for (t of threats) {
        if (t.className === 'card empty-threat') {
          if (encounterKey !== null) {
            // let cardKey = null;
            // for (e of this.part.aside) {
            //   if (e.name === encounterKey) {
            //     cardKey = e.key;
            //     break;
            //   }
            // }
            t.src = cards[encounterKey].src;
            t.alt = encounterKey;
          }
          else {
            t.src = element.encounter.src;
            element.encounter.src = cards['empty'].src;
            t.alt = element.encounter.alt;
            element.encounter.alt = 'empty';
          }
          
          t.className = 'card threat';
          return;
        }
      }
      alert('No empty threat cards');
    },
    'discardEncounter': function() {
      if (element.encounter.alt === 'empty') {
        return;
      }
  
      element.encounterDiscard.src = element.encounter.src;
      element.encounterDiscard.alt = element.encounter.alt;
  
      element.encounter.src = cards['empty'].src;
      element.encounter.alt = 'empty';
      
      this.discardedEncounters.push(element.encounterDiscard.alt);
  
      var option = document.createElement('option');
      option.text = element.encounterDiscard.alt;
      option.value = element.encounterDiscard.alt;
      element.discardedEncounters.add(option);
    },
    'discardThreat': function(img) {
      element.encounterDiscard.src = img.src;
      element.encounterDiscard.alt = img.alt;
      img.src = cards['empty'].src;
      img.className = 'card empty-threat';
  
      this.discardedEncounters.push(element.encounterDiscard.alt);
      
      var option = document.createElement('option');
      option.text = element.encounterDiscard.alt;
      option.value = element.encounterDiscard.alt;
      element.discardedEncounters.add(option);
      
      var idNum = parseInt(img.id.match(/\d/g)[0]);
      const threatLocation = document.getElementById(`threat-location${idNum}`);
      threatLocation.value = 'location';
      
      const threatDoom = document.getElementById(`doom${idNum}`);
      var lessDoom = parseInt(threatDoom.innerText);
      game.changeCount(`doom${idNum}`, -lessDoom);
  
      const exhausted = document.getElementById(`exhausted${idNum}`);
      exhausted.checked = false;
      const health = document.getElementById(`health${idNum}`);
      health.innerText = '0';
    },
    'drawPlayerCard': function() {
      if (this.visitedPlayerCardIndices.size === this.investigator.deck.length) {
        alert('All player cards drawn');
        return;
      }
  
      let index = getRandomInt(this.investigator.deck.length);
      while (this.visitedPlayerCardIndices.has(index)) {
        index = getRandomInt(this.investigator.deck.length);
      }
      
      var playerCard = this.investigator.deck[index];
      
      if (element.phase.innerText === '') {
        if (playerCard.hasOwnProperty('type')) {
          for (tKey in playerCard.type) {
            if (playerCard.type[tKey] === 'weakness') {
              this.drawPlayerCard();
              return;
            }
          }
        }
      }
      else if (element.phase.innerText === PHASE.INVESTIGATION) {
        var usedAction = false;
        const playerActions = document.getElementsByClassName('player-action');
        for (a of playerActions) {
          if (a.checked === false) {
            a.checked = true;
            usedAction = true;
            break;
          }
        }
        if (usedAction === false) {
          alert('No Actions left');
          return;
        }
      }
  
      this.playerDeck.splice(index, 1);
      this.visitedPlayerCardIndices.add(index);
  
      var cardDiv = document.createElement('div');
      cardDiv.id = `cardDiv${index}`;
      cardDiv.className = 'col-md-2 card';
  
      var cardImg = document.createElement('img');
      cardImg.className = 'card hand';
      cardImg.src = playerCard.src;
      cardImg.id = `playerCard${index}`;
      cardImg.alt = 'Hand card';
      cardImg.setAttribute('onclick', `game.discardPlayerCard('assetRow', '${cardImg.id}', '${cardDiv.id}')`);
      cardDiv.appendChild(cardImg);
  
      var buttonDiv = document.createElement('div');
      buttonDiv.id = `buttonDiv${index}`;
      var assetButton = document.createElement('button');
      assetButton.innerText = 'Add Asset';
      assetButton.setAttribute('onclick', `game.addAsset('${cardDiv.id}', '${buttonDiv.id}')`);
      buttonDiv.appendChild(assetButton);
  
      var shuffleButton = document.createElement('button');
      shuffleButton.innerText = 'Shuffle';
      shuffleButton.setAttribute('onclick', `game.shuffleBack('${cardDiv.id}')`);
      buttonDiv.appendChild(shuffleButton);
  
      var discardButton = document.createElement('button');
      discardButton.innerText = 'Discard';
      discardButton.setAttribute('onclick', `game.discardPlayerCard('handRow', '${cardImg.id}', '${cardDiv.id}')`);
      buttonDiv.appendChild(discardButton);
  
      cardDiv.appendChild(buttonDiv);
      element.handRow.appendChild(cardDiv);
    },
    'addAsset': function(divID, buttonDivID) {
      var cardDiv = document.getElementById(divID);
  
      var buttonDiv = document.getElementById(buttonDivID);
      cardDiv.removeChild(buttonDiv);
  
      var usesDiv = document.createElement('div');
      usesDiv.innerText = 'Uses: ';
      for (let i = 0; i < 6; i++) {
        var checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        usesDiv.appendChild(checkBox);
      }
  
      cardDiv.appendChild(usesDiv);
      element.assetRow.appendChild(cardDiv);
  
      if (element.phase.innerText === PHASE.INVESTIGATION) {
        var usedAction = false;
        const playerActions = document.getElementsByClassName('player-action');
        for (a of playerActions) {
          if (a.checked === false) {
            a.checked = true;
            usedAction = true;
            break;
          }
        }
        if (usedAction === false) {
          alert('No Actions left');
        }
      }
    },
    'shuffleBack': function(divID) {
      let index = parseInt(divID.match(/\d+/g)[0]);
      this.visitedPlayerCardIndices.delete(index);
  
      var cardDiv = document.getElementById(divID);
      element.handRow.removeChild(cardDiv);
    },
    'shuffleEncountersBack': function() {
      // this.visitedEncounterIndices = new Set();
      for (card of this.discardedEncounters) {
        this.visitedEncounterIndices.delete(card);
      }
  
      this.discardedEncounters = [];
      removeChildren(element.discardedEncounters);
  
      element.encounterDiscard.src = cards['empty'].src;
      element.encounterDiscard.alt = 'empty'
    },
    'discardPlayerCard': function(rowID, imgID=null, divID=null) {
      var row = document.getElementById(rowID);
      
      if (imgID === null) {
        const handCards = document.getElementsByClassName('card hand');
        let randomIndex = getRandomInt(handCards.length);
        let i = 0;
        for (card of handCards) {
          if (i === randomIndex) {
            divID = card.id.match(/\d+/g)[0];
            var cardDiv = document.getElementById(`cardDiv${divID}`);
            // TODO Investigate unfound cardDiv
            row.removeChild(cardDiv);
            break;
          }
          i++;
        }
        return;
      }
      
      var img = document.getElementById(imgID);
      element.playerDiscard.src = img.src;
      
      var cardDiv = document.getElementById(divID);
      row.removeChild(cardDiv);
    },
    'highlightPlayerLocation': function() {
      // TODO
      return;
    }
  };
  
  
  const PHASE = {
    'MYTHOS': 'Mythos',
    'INVESTIGATION': 'Investigation',
    'ENEMY': 'Enemy',
    'UPKEEP': 'Upkeep',
    'next': function() {
      const phase = document.getElementById('phase');
      const phaseName = phase.innerText;
  
      const round = document.getElementById('round-num');
  
      if (phaseName === this.MYTHOS) {
        phase.innerText = this.INVESTIGATION;
      }
      else if (phaseName === this.INVESTIGATION) {
        phase.innerText = this.ENEMY
        const playerActions = document.getElementsByClassName('player-action');
        for (a of playerActions) {
          a.checked = false;
        }
      }
      else if (phaseName === this.ENEMY) {
        phase.innerText = this.UPKEEP
        const exhaustedBoxes = document.getElementsByClassName('exhausted');
        for (e of exhaustedBoxes) {
          e.checked = false;
        }
        game.drawPlayerCard();
        game.changeCount('resources-pool', 1);
      }
      else {
        round.innerText = parseInt(round.innerText) + 1;
        phase.innerText = this.MYTHOS;
        game.changeCount('doom0', 1);
        game.drawEncounter();
      }
    },
    'prev': function() {
      const phase = document.getElementById('phase');
      const phaseName = phase.innerText;
  
      const round = document.getElementById('round-num');
  
      if (phaseName === this.MYTHOS) {
        var roundNum = parseInt(round.innerText);
  
        round.innerText = Math.max(1, roundNum - 1);
        phase.innerText = this.UPKEEP;
      }
      else if (phaseName === this.INVESTIGATION) {
        var roundNum = parseInt(round.innerText);
        if (roundNum === 1) {
          return;
        }
  
        phase.innerText = this.MYTHOS
      }
      else if (phaseName === this.ENEMY) {
        phase.innerText = this.INVESTIGATION
      }
      else {
        phase.innerText = this.ENEMY;
      }
    }
  };
  
  const imageRootPath = 'images/arkham/';
  
  var cards = {
    'switchToFlipSide': function(cardElement) {
      let cardName = cardElement.alt;
      if (!this.hasOwnProperty(cardName)) {
        alert(`Cannot find ${cardName}`);
        return null;
      }
  
      if (!this[cardName].hasOwnProperty('flipSide')) {
        console.log(`${cardName} does not have propert 'flipSide'`);
        return null;
      }
      
      var flipSide = this[cardName].flipSide;
      cardElement.alt = flipSide;
      cardElement.src = `${this[flipSide].src}`;
    },
    'loadCard': function(imgID, selectValue) {
      var img = document.getElementById(imgID);
      if (selectValue === 'location') {
        img.src = cards['empty'].src;
        return;
      }
      img.src = cards[selectValue].src;
      img.alt = selectValue;
      img.setAttribute('onclick', `cards.switchToFlipSide(this)`);
    },
  
    'empty': {
      'src': `${imageRootPath}empty.jpg`
    },
    'the_gathering_front': {
      'src': `${imageRootPath}the_gathering_front.jpg`,
      'flipSide': 'the_gathering_back'
    },
    'the_gathering_back': {
      'src': `${imageRootPath}the_gathering_back.jpg`,
      'flipSide': 'the_gathering_front'
    },
    'the_gathering_agenda1a': {
      'src': `${imageRootPath}the_gathering_agenda1a.jpg`
    },
    'the_gathering_agenda1b': {
      'src': `${imageRootPath}the_gathering_agenda1b.jpg`
    },
    'the_gathering_agenda2a': {
      'src': `${imageRootPath}the_gathering_agenda2a.jpg`
    },
    'the_gathering_agenda2b': {
      'src': `${imageRootPath}the_gathering_agenda2b.jpg`
    },
    'the_gathering_agenda3a': {
      'src': `${imageRootPath}the_gathering_agenda3a.jpg`
    },
    'the_gathering_agenda3b': {
      'src': `${imageRootPath}the_gathering_agenda3b.jpg`
    },
    'the_gathering_act1a': {
      'src': `${imageRootPath}the_gathering_act1a.jpg`
    },
    'the_gathering_act1b': {
      'src': `${imageRootPath}the_gathering_act1b.jpg`
    },
    'the_gathering_act2a': {
      'src': `${imageRootPath}the_gathering_act2a.jpg`
    },
    'the_gathering_act2b': {
      'src': `${imageRootPath}the_gathering_act2b.jpg`
    },
    'the_gathering_act3a': {
      'src': `${imageRootPath}the_gathering_act3a.jpg`
    },
    'the_gathering_act3b': {
      'src': `${imageRootPath}the_gathering_act3b.jpg`
    },
    'encounter_card_back': {
      'src': `${imageRootPath}encounter_card_back.png`
    },
    'study_a': {
      'src': `${imageRootPath}study_unrevealed.png`,
      'flipSide': 'study_b'
    },
    'study_b': {
      'src': `${imageRootPath}study_revealed.png`,
      'flipSide': 'study_a',
      'clueValue': 2,
      'shroudValue': 2
    },
    'hallway_a': {
      'src': `${imageRootPath}hallway_unrevealed.png`,
      'flipSide': 'hallway_b'
    },
    'hallway_b': {
      'src': `${imageRootPath}hallway_revealed.jpg`,
      'flipSide': 'hallway_a'
    },
    'attic_a': {
      'src': `${imageRootPath}attic_unrevealed.png`,
      'flipSide': 'attic_b'
    },
    'attic_b': {
      'src': `${imageRootPath}attic_revealed.jpg`,
      'flipSide': 'attic_a'
    },
    'cellar_a': {
      'src': `${imageRootPath}cellar_unrevealed.png`,
      'flipSide': 'cellar_b'
    },
    'cellar_b': {
      'src': `${imageRootPath}cellar_revealed.jpg`,
      'flipSide': 'cellar_a'
    },
    'parlor_a': {
      'src': `${imageRootPath}parlor_unrevealed.png`,
      'flipSide': 'parlor_b'
    },
    'parlor_b': {
      'src': `${imageRootPath}parlor_revealed.jpg`,
      'flipSide': 'parlor_a'
    },
    'roland_a': {
      'src': `${imageRootPath}roland_front.png`,
      'flipSide': 'roland_b'
    },
    'roland_b': {
      'src': `${imageRootPath}roland_back.png`,
      'flipSide': 'roland_a'
    },
    'ghoul_priest': {
      'src': `${imageRootPath}ghoul_priest.png`,
      'name': 'Ghoul Priest'
    },
    'lita_chantler': {
      'src': `${imageRootPath}lita_chantler.jpg`,
      'name': 'Lita Chantler'
    },
    'flesh_eater': {
      'src': `${imageRootPath}flesh_eater.jpg`
    },
    'icy_ghoul': {
      'src': `${imageRootPath}icy_ghoul.png`
    },
    'swarm_of_rats': {
      'src': `${imageRootPath}swarm_of_rats.png`
    },
    'ghoul_minion': {
      'src': `${imageRootPath}ghoul_minion.jpg`
    },
    'ravenous_ghoul': {
      'src': `${imageRootPath}ravenous_ghoul.png`
    },
    'grasping_hands': {
      'src': `${imageRootPath}grasping_hands.png`
    },
    'rotting_remains': {
      'src': `${imageRootPath}rotting_remains.png`
    },
    'frozen_in_fear': {
      'src': `${imageRootPath}frozen_in_fear.png`
    },
    'dissonant_voices': {
      'src': `${imageRootPath}dissonant_voices.png`
    },
    'ancient_evils': {
      'src': `${imageRootPath}ancient_evils.jpg`
    },
    'crypt_chill': {
      'src': `${imageRootPath}crypt_chill.jpg`
    },
    'obscuring_fog': {
      'src': `${imageRootPath}obscuring_fog.jpg`
    },
    'rolands_38': {
      'src': `${imageRootPath}rolands_38_special.png`
    },
    'cover_up': {
      'src': `${imageRootPath}cover_up.png`,
      'type': ['weakness']
    },
    '45_automatic': {
      'src': `${imageRootPath}45_automatic.png`
    },
    'physical_training': {
      'src': `${imageRootPath}physical_training.png`
    },
    'beat_cop': {
      'src': `${imageRootPath}beat_cop.png`
    },
    'first_aid': {
      'src': `${imageRootPath}first_aid.jpg`
    },
    'machete': {
      'src': `${imageRootPath}machete.png`
    },
    'guard_dog': {
      'src': `${imageRootPath}guard_dog.jpg`
    },
    'evidence': {
      'src': `${imageRootPath}evidence.jpg`
    },
    'dodge': {
      'src': `${imageRootPath}dodge.jpg`
    },
    'dynamite_blast': {
      'src': `${imageRootPath}dynamite_blast.jpg`
    },
    'vicious_blow': {
      'src': `${imageRootPath}vicious_blow.jpg`
    },
    'magnifying_glass': {
      'src': `${imageRootPath}magnifying_glass.png`
    },
    'old_book_of_lore': {
      'src': `${imageRootPath}old_book_of_lore.png`
    },
    'research_librarian': {
      'src': `${imageRootPath}research_librarian.png`
    },
    'dr_milan_christopher': {
      'src': `${imageRootPath}dr_milan_christopher.png`
    },
    'hyperawareness': {
      'src': `${imageRootPath}hyperawareness.png`
    },
    'medical_texts': {
      'src': `${imageRootPath}medical_texts.jpg`
    },
    'mind_over_matter': {
      'src': `${imageRootPath}mind_over_matter.png`
    },
    'working_a_hunch': {
      'src': `${imageRootPath}working_a_hunch.jpg`
    },
    'barricade': {
      'src': `${imageRootPath}barricade.png`
    },
    'deduction': {
      'src': `${imageRootPath}deduction.jpg`
    },
    'knife': {
      'src': `${imageRootPath}knife.png`,
      'type': [
        'item',
        'weapon',
        'meleee'
      ],
      'resourceCost': 1,
      'slot': 'hand'
    },
    'flashlight': {
      'src': `${imageRootPath}flashlight.png`
    },
    'emergency_cache': {
      'src': `${imageRootPath}emergency_cache.jpg`
    },
    'guts': {
      'src': `${imageRootPath}guts.jpg`
    },
    'manual_dexterity': {
      'src': `${imageRootPath}manual_dexterity.jpg`
    },
    'paranoia': {
      'src': `${imageRootPath}paranoia.png`,
      'type': ['weakness']
    },
    'encyclopedia': {
      'src': `${imageRootPath}encyclopedia.png`,
      'type': [
        'item',
        'tome'
      ],
      'resourceCost': 2
    },
    'the_midnight_masks_front': {
      'src': `${imageRootPath}the_midnight_masks_front.jpg`
    },
    'the_midnight_masks_back': {
      'src': `${imageRootPath}the_midnight_masks_back.jpg`
    },
    'the_midnight_masks_agenda1a': {
      'src': `${imageRootPath}the_midnight_masks_agenda1a.jpg`
    },
    'the_midnight_masks_agenda1b': {
      'src': `${imageRootPath}the_masked_hunter.jpg`
    },
    'the_masked_hunter': {
      'src': `${imageRootPath}the_masked_hunter.jpg`,
      'name': 'The Masked Hunter'
    },
    'the_midnight_masks_agenda2a': {
      'src': `${imageRootPath}the_midnight_masks_agenda2a.jpg`
    },
    'the_midnight_masks_agenda2b': {
      'src': `${imageRootPath}the_midnight_masks_agenda2b.jpg`
    },
    'the_midnight_masks_act1a': {
      'src': `${imageRootPath}the_midnight_masks_act1a.jpg`
    },
    'the_midnight_masks_act1b': {
      'src': `${imageRootPath}the_midnight_masks_act1b.jpg`
    },
    'your_house_a': {
      'src': `${imageRootPath}your_house_unrevealed.jpg`,
      'flipSide': 'your_house_b'
    },
    'your_house_b': {
      'src': `${imageRootPath}your_house_revealed.jpg`,
      'flipSide': 'your_house_a'
    },
    'rivertown_a': {
      'src': `${imageRootPath}rivertown_unrevealed.jpg`,
      'flipSide': 'rivertown_b'
    },
    'rivertown_b': {
      'src': `${imageRootPath}rivertown_revealed.jpg`,
      'flipSide': 'rivertown_a'
    },
    'southside_a1': {
      'src': `${imageRootPath}southside_unrevealed.jpg`,
      'flipSide': 'southside_b1'
    },
    'southside_b1': {
      'src': `${imageRootPath}southside_revealed1.jpg`,
      'flipSide': 'southside_a1'
    },
    'southside_a2': {
      'src': `${imageRootPath}southside_unrevealed.jpg`,
      'flipSide': 'southside_b2'
    },
    'southside_b2': {
      'src': `${imageRootPath}southside_revealed2.jpg`,
      'flipSide': 'southside_a2'
    },
    'st_marys_a': {
      'src': `${imageRootPath}st_marys_hospital_unrevealed.jpg`,
      'flipSide': 'st_marys_b'
    },
    'st_marys_b': {
      'src': `${imageRootPath}st_marys_hospital_revealed.jpg`,
      'flipSide': 'st_marys_a'
    },
    'miskatonic_a': {
      'src': `${imageRootPath}miskatonic_university_unrevealed.jpg`,
      'flipSide': 'miskatonic_b'
    },
    'miskatonic_b': {
      'src': `${imageRootPath}miskatonic_university_revealed.jpg`,
      'flipSide': 'miskatonic_a'
    },
    'downtown_a1': {
      'src': `${imageRootPath}downtown_unrevealed.jpg`,
      'flipSide': 'downtown_b1'
    },
    'downtown_b1': {
      'src': `${imageRootPath}downtown_revealed1.jpg`,
      'flipSide': 'downtown_a1'
    },
    'downtown_a2': {
      'src': `${imageRootPath}downtown_unrevealed.jpg`,
      'flipSide': 'downtown_b2'
    },
    'downtown_b2': {
      'src': `${imageRootPath}downtown_revealed2.jpg`,
      'flipSide': 'downtown_a2'
    },
    'easttown_a': {
      'src': `${imageRootPath}easttown_unrevealed.jpg`,
      'flipSide': 'easttown_b'
    },
    'easttown_b': {
      'src': `${imageRootPath}easttown_revealed.jpg`,
      'flipSide': 'easttown_a'
    },
    'graveyard_a': {
      'src': `${imageRootPath}graveyard_unrevealed.jpg`,
      'flipSide': 'graveyard_b'
    },
    'graveyard_b': {
      'src': `${imageRootPath}graveyard_revealed.jpg`,
      'flipSide': 'graveyard_a'
    },
    'northside_a': {
      'src': `${imageRootPath}northside_unrevealed.jpg`,
      'flipSide': 'northside_b'
    },
    'northside_b': {
      'src': `${imageRootPath}northside_revealed.jpg`,
      'flipSide': 'northside_a'
    },
    'hunting_shadow': {
      'src': `${imageRootPath}hunting_shadow.jpg`
    },
    'false_lead': {
      'src': `${imageRootPath}false_lead.jpg`
    },
    'hunting_nightgaunt': {
      'src': `${imageRootPath}hunting_nightgaunt.jpg`
    },
    'on_wings_of_darkness': {
      'src': `${imageRootPath}on_wings_of_darkness.jpg`
    },
    'acolyte': {
      'src': `${imageRootPath}acolyte.jpg`
    },
    'wizard_of_the_order': {
      'src': `${imageRootPath}wizard_of_the_order.jpg`
    },
    'mysterious_chanting': {
      'src': `${imageRootPath}mysterious_chanting.png`
    },
    'locked_door': {
      'src': `${imageRootPath}locked_door.jpg`
    },
    'wolf-man_drew': {
      'src': `${imageRootPath}wolf-man_drew.jpg`
    },
    'herman_collins': {
      'src': `${imageRootPath}herman_collins.jpg`
    },
    'peter_warren': {
      'src': `${imageRootPath}peter_warren.jpg`
    },
    'victoria_devereux': {
      'src': `${imageRootPath}victoria_devereux.jpg`
    },
    'ruth_turner': {
      'src': `${imageRootPath}ruth_turner.jpg`
    },
    'extra_ammunition': {
      'src': `${imageRootPath}extra_ammunition.png`
    },
    'shotgun': {
      'src': `${imageRootPath}shotgun.png`
    }
  };
  
  var campaigns = {
    // 'init': function(campaignName, partNum) {
      
    // },
  
    'Night of the Zealot': {
      'title': 'Night of the Zealot',
      'getChaosBag': function(difficulty) {
        if (difficulty === 'Easy') {
          return ['+1', '+1', '0', '0', '0', '-1', '-1', '-1', '-2', '-2', 'skull', 'skull', 'hood', 'tablet', 'cthulu', 'star'];
        }
        else if (difficulty === 'Standard') {
          return ['+1', '0', '0', '-1', '-1', '-1', '-2', '-2', '-3', '-4', 'skull', 'skull', 'hood', 'tablet', 'cthulu', 'star'];
        }
        else if (difficulty === 'Hard') {
          return ['0', '0', '0', '-1', '-1', '-2', '-2', '-3', '-3', '-4', '-5', 'skull', 'skull', 'hood', 'tablet', 'cthulu', 'star'];
        }
        else if (difficulty === 'Expert') {
          return ['0', '-1', '-1', '-2', '-2', '-3', '-3', '-4', '-4', '-5', '-6', '-8', 'skull', 'skull', 'hood', 'tablet', 'cthulu', 'star'];
        }
        else {
          return null;
        }
      },
      'part': {
        '1': {
          'num': 1,
          'title': 'The Gathering',
          'intro': `You and your partners have been investigating strange events taking
            place in your home city of Arkham, Massachusetts. Over the past few
            weeks, several townspeople have mysteriously gone missing. Recently,
            their corpses turned up in the woods, savaged and half-eaten. The police
            and newspapers have stated that wild animals are responsible, but you
            believe there is something else going on. You are gathered together at the
            lead investigator’s home to discuss these bizarre events.`,
          'scenario': 'the_gathering_front',
          'agenda': [
            cards['the_gathering_agenda1a'].src,
            cards['the_gathering_agenda1b'].src,
            cards['the_gathering_agenda2a'].src,
            cards['the_gathering_agenda2b'].src,
            cards['the_gathering_agenda3a'].src,
            cards['the_gathering_agenda3b'].src,
          ],
          'act': [
            cards['the_gathering_act1a'].src,
            cards['the_gathering_act1b'].src,
            cards['the_gathering_act2a'].src,
            cards['the_gathering_act2b'].src,
            cards['the_gathering_act3a'].src,
            cards['the_gathering_act3b'].src,
          ],
          'encounter': [
            {
              'name': 'flesh_eater',
              'key': 'flesh_eater'
            },
            {
              'name': 'icy_ghoul',
              'key': 'icy_ghoul'
            },
            {
              'name': 'swarm_of_rats1',
              'key': 'swarm_of_rats'
            },
            {
              'name': 'swarm_of_rats2',
              'key': 'swarm_of_rats'
            },
            {
              'name': 'swarm_of_rats3',
              'key': 'swarm_of_rats'
            },
            {
              'name': 'ghoul_minion1',
              'key': 'ghoul_minion'
            },
            {
              'name': 'ghoul_minion2',
              'key': 'ghoul_minion'
            },
            {
              'name': 'ghoul_minion3',
              'key': 'ghoul_minion'
            },
            {
              'name': 'ravenous_ghoul',
              'key': 'ravenous_ghoul'
            },
            {
              'name': 'grasping_hands1',
              'key': 'grasping_hands'
            },
            {
              'name': 'grasping_hands2',
              'key': 'grasping_hands'
            },
            {
              'name': 'grasping_hands3',
              'key': 'grasping_hands'
            },
            {
              'name': 'rotting_remains1',
              'key': 'rotting_remains'
            },
            {
              'name': 'rotting_remains2',
              'key': 'rotting_remains'
            },
            {
              'name': 'rotting_remains3',
              'key': 'rotting_remains'
            },
            {
              'name': 'frozen_in_fear1',
              'key': 'frozen_in_fear'
            },
            {
              'name': 'frozen_in_fear2',
              'key': 'frozen_in_fear'
            },
            {
              'name': 'dissonant_voices1',
              'key': 'dissonant_voices'
            },
            {
              'name': 'dissonant_voices2',
              'key': 'dissonant_voices'
            },
            {
              'name': 'ancient_evils1',
              'key': 'ancient_evils'
            },
            {
              'name': 'ancient_evils2',
              'key': 'ancient_evils'
            },
            {
              'name': 'ancient_evils3',
              'key': 'ancient_evils'
            },
            {
              'name': 'crypt_chill1',
              'key': 'crypt_chill'
            },
            {
              'name': 'crypt_chill2',
              'key': 'crypt_chill'
            },
            {
              'name': 'obscuring_fog1',
              'key': 'obscuring_fog'
            },
            {
              'name': 'obscuring_fog2',
              'key': 'obscuring_fog'
            }
          ],
          'aside': [
            'ghoul_priest',
            'lita_chantler',
          ],
          'location': [
            {
              'name': 'study_a',
              'card': cards['study_a'].src
            },
            {
              'name': 'hallway_a',
              'card': cards['hallway_a'].src
            },
            {
              'name': 'attic_a',
              'card': cards['attic_a'].src
            },
            {
              'name': 'cellar_a',
              'card': cards['cellar_a'].src
            },
            {
              'name': 'parlor_a',
              'card': cards['parlor_a'].src
            }
          ]
        },
        '2': {
          'num': 2,
          'title': 'The Midnight Masks',
          'intro': `In the wake of the disaster at your home, Lita Chantler, the
          red‑haired woman from your parlor, lays out a tale that—even in light of
          what you have just witnessed—strains the limits of your belief. "The creatures
          in your home," she claims, "are called ghouls—cruel beings who plague the
          crypts, caverns, and tunnels beneath the city of Arkham..."`,
          'scenario': 'the_midnight_masks_front',
          'agenda': [
            cards['the_midnight_masks_agenda1a'].src,
            cards['the_midnight_masks_agenda1b'].src,
            cards['the_midnight_masks_agenda2a'].src,
            cards['the_midnight_masks_agenda2b'].src
          ],
          'act': [
            cards['the_midnight_masks_act1a'].src,
            cards['the_midnight_masks_act1b'].src
          ],
          'encounter': [
            {
              'name': 'hunting_shadow1',
              'key': 'hunting_shadow'
            },
            {
              'name': 'hunting_shadow2',
              'key': 'hunting_shadow'
            },
            {
              'name': 'hunting_shadow3',
              'key': 'hunting_shadow'
            },
            {
              'name': 'false_lead1',
              'key': 'false_lead'
            },
            {
              'name': 'false_lead2',
              'key': 'false_lead'
            },
            {
              'name': 'crypt_chill1',
              'key': 'crypt_chill'
            },
            {
              'name': 'crypt_chill2',
              'key': 'crypt_chill'
            },
            {
              'name': 'obscuring_fog1',
              'key': 'obscuring_fog'
            },
            {
              'name': 'obscuring_fog2',
              'key': 'obscuring_fog'
            },
            {
              'name': 'hunting_nightgaunt1',
              'key': 'hunting_nightgaunt'
            },
            {
              'name': 'hunting_nightgaunt2',
              'key': 'hunting_nightgaunt'
            },
            {
              'name': 'on_wings_of_darkness1',
              'key': 'on_wings_of_darkness'
            },
            {
              'name': 'on_wings_of_darkness2',
              'key': 'on_wings_of_darkness'
            },
            {
              'name': 'acolyte1',
              'key': 'acolyte'
            },
            {
              'name': 'acolyte2',
              'key': 'acolyte'
            },
            {
              'name': 'acolyte3',
              'key': 'acolyte'
            },
            {
              'name': 'wizard_of_the_order',
              'key': 'wizard_of_the_order'
            },
            {
              'name': 'mysterious_chanting1',
              'key': 'mysterious_chanting'
            },
            {
              'name': 'mysterious_chanting2',
              'key': 'mysterious_chanting'
            },
            {
              'name': 'locked_door1',
              'key': 'locked_door'
            },
            {
              'name': 'locked_door2',
              'key': 'locked_door'
            }
          ],
          'aside': [
            'the_masked_hunter',
          ],
          'location': [
            /* House present if not burned down in Part 1
             */
            // {
            //   'name': 'your_house_a',
            //   'card': cards['your_house_a'].src
            // },
            {
              'name': 'rivertown_a',
              'card': cards['rivertown_a'].src
            },
            {
              'name': 'st_marys_a',
              'card': cards['st_marys_a'].src
            },
            {
              'name': 'miskatonic_a',
              'card': cards['miskatonic_a'].src
            },
            {
              'name': 'easttown_a',
              'card': cards['easttown_a'].src
            },
            {
              'name': 'graveyard_a',
              'card': cards['graveyard_a'].src
            },
            {
              'name': 'northside_a',
              'card': cards['northside_a'].src
            }
          ]
        }
      }
    }
  };
  
  var investigators = {
    'SLOT_LIMITS': {
      'accessory': 1,
      'body': 1,
      'ally': 1,
      'oneHand': 1,
      'twoHand': 1,
      'oneArcane': 1,
      'twoArcane': 1
    },
  
    'Roland': {
      'name': 'Roland',
      'health': 9,
      'sanity': 5,
      'card': 'roland_a',
      'deck': [
        cards['rolands_38'],
        cards['cover_up'],
        cards['45_automatic'],
        cards['physical_training'],
        cards['beat_cop'],
        cards['first_aid'],
        cards['machete'],
        cards['guard_dog'],
        cards['evidence'],
        cards['dodge'],
        cards['dynamite_blast'],
        cards['vicious_blow'],
        cards['magnifying_glass'],
        cards['old_book_of_lore'],
        cards['research_librarian'],
        cards['dr_milan_christopher'],
        cards['hyperawareness'],
        cards['medical_texts'],
        cards['mind_over_matter'],
        cards['working_a_hunch'],
        cards['barricade'],
        cards['deduction'],
        cards['knife'],
        cards['knife'],
        cards['flashlight'],
        cards['flashlight'],
        cards['emergency_cache'],
        cards['emergency_cache'],
        cards['guts'],
        cards['guts'],
        cards['manual_dexterity'],
        cards['manual_dexterity'],
        cards['paranoia']
      ],
      'deck1': [
        cards['rolands_38'],
        cards['cover_up'],
        cards['45_automatic'],
        cards['physical_training'],
        cards['beat_cop'],
        cards['first_aid'],
        cards['machete'],
        cards['guard_dog'],
        cards['evidence'],
        cards['dodge'],
        cards['dynamite_blast'],
        cards['vicious_blow'],
        cards['magnifying_glass'],
        cards['old_book_of_lore'],
        cards['research_librarian'],
        cards['dr_milan_christopher'],
        cards['hyperawareness'],
        cards['medical_texts'],
        cards['mind_over_matter'],
        cards['working_a_hunch'],
        cards['barricade'],
        cards['deduction'],
        cards['knife'],
        cards['knife'],
        cards['flashlight'],
        cards['flashlight'],
        
        cards['emergency_cache'],
        cards['guts'],
        cards['guts'],
        cards['manual_dexterity'],
        
        cards['paranoia'],
  
        cards['lita_chantler'],
  
        cards['extra_ammunition'],
        cards['shotgun']
      ]
    }
  };
  
  function removeChildren(element) {
    var child = element.lastElementChild;
    while (child) {
      element.removeChild(child);
      child = element.lastElementChild;
    }
  }
  
  function getRandomInt(max) {
    /* Get random int in range [0,max)
     */
    return Math.floor(Math.random() * Math.floor(max));
  }
  
  window.onload = function() {
    initApp();
    // game.init('Night of the Zealot', '1', 'Easy', 'Roland');
    game.init('Night of the Zealot', '2', 'Easy', 'Roland', 'deck1');
  };