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
    'handRow': document.getElementById('handRow'),
    'assetRow': document.getElementById('assetRow'),
    'investigatorFront': document.getElementById('investigator_front'),
    'health': document.getElementById('health'),
    'sanity': document.getElementById('sanity'),
    'cluesPool': document.getElementById('clues-pool'),
    'playerDiscard': document.getElementById('player-discard')
  };
  
  var game = {
    'campaign': null,
    'part': null,
    'chaosBag': null,
    'agendaIndex': 0,
    'actIndex': 0,
    'visitedEncounterIndices': null,
    'visitedPlayerCardIndices': null,
  
    'investigator': null,
  
    'init': function(campaignName, partNum, difficulty, investigatorName, playerDeck='deck') {
      this.campaign = campaigns[campaignName];
      
      this.part = this.campaign.part[partNum];
  
      element.campaignTitle.innerText = `${game.campaign.title} - Part ${game.part.num}: ${game.part.title}`;
      element.roundNum.innerText = 1;
      // element.phase.innerText = PHASE.INVESTIGATION;
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
  
      for (aKey in this.part.aside) {
        let aCard = this.part.aside[aKey];
        let option = document.createElement('option');
        option.text = aCard.name;
        option.value = aCard.src;
        asideSelect.add(option);
      }
  
      // Investigator:
      this.investigator = investigators[investigatorName];
      
      this.visitedPlayerCardIndices = new Set();
  
      element.investigatorFront.id = this.investigator.card;
      element.investigatorFront.src = cards[this.investigator.card].src;
      element.investigatorFront.alt = this.investigator.card;
  
      element.health.innerText = this.investigator.health;
      element.sanity.innerText = this.investigator.sanity;
  
      this.investigator.deck = investigators[investigatorName][playerDeck];
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
      const el = document.getElementById(elementID);
      var num = parseInt(el.innerText);
      el.innerText = num + delta;
  
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
          return;
        }
      }
  
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
      let index = getRandomInt(this.chaosBag.length - 1);
      element.chaosToken.innerText = this.chaosBag[index];
    },
    'drawEncounter': function() {
      if (this.visitedEncounterIndices.size === this.part.encounter.length) {
        alert('All encounters drawn');
        return;
      }
  
      let index = getRandomInt(this.part.encounter.length - 1);
      while (this.visitedEncounterIndices.has(index)) {
        index = getRandomInt(this.part.encounter.length - 1);
      }
      this.visitedEncounterIndices.add(index);
      element.encounter.src = `${this.part.encounter[index]}`;
      element.encounter.alt = 'not-empty';
    },
    'playEncounter': function(encounterSrc=null) {
      if (encounterSrc !== null) {
        if (encounterSrc === cards['empty'].src) {
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
        element.threat4
      ];
  
      for (t of threats) {
        if (t.className === 'card empty-threat') {
          if (encounterSrc !== null) {
            t.src = encounterSrc;
          }
          else {
            t.src = element.encounter.src;
            element.encounter.src = cards['empty'].src;
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
      element.encounter.src = cards['empty'].src;
      element.encounter.alt = 'empty';
    },
    'discardThreat': function(img) {
      element.encounterDiscard.src = img.src;
      img.src = cards['empty'].src;
      img.className = 'card empty-threat';
      
      var idNum = parseInt(img.id.match(/\d/g)[0]);
      const threatLocation = document.getElementById(`threat-location${idNum}`);
      threatLocation.value = 'location';
      const threatDoom = document.getElementById(`doom${idNum}`);
      threatDoom.innerText = '0';
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
  
      
      let index = getRandomInt(this.investigator.deck.length - 1);
      while (this.visitedPlayerCardIndices.has(index)) {
        index = getRandomInt(this.investigator.deck.length - 1);
      }
      this.visitedPlayerCardIndices.add(index);
      
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
      for (let i = 0; i < 4; i++) {
        var checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        usesDiv.appendChild(checkBox);
      }
  
      cardDiv.appendChild(usesDiv);
      element.assetRow.appendChild(cardDiv);
  
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
    },
    'shuffleBack': function(divID) {
      let index = parseInt(divID.match(/\d+/g)[0]);
      this.visitedPlayerCardIndices.delete(index);
  
      var cardDiv = document.getElementById(divID);
      element.handRow.removeChild(cardDiv);
    },
    'shuffleEncountersBack': function() {
      // TODO NOW
    },
    'discardPlayerCard': function(rowID, imgID=null, divID=null) {
      var row = document.getElementById(rowID);
      
      if (imgID === null) {
        const handCards = document.getElementsByClassName('card hand');
        let randomIndex = getRandomInt(handCards.length - 1);
        let i = 0;
        for (card of handCards) {
          if (i === randomIndex) {
            divID = card.id.match(/\d+/g)[0];
            var cardDiv = document.getElementById(`cardDiv${divID}`);
            // TODO NOW Investigate unfound cardDiv
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
      // TODO NOW
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
    'southside_a': {
      'src': `${imageRootPath}southside_unrevealed.jpg`,
      'flipSide': 'southside_b'
    },
    'southside_b': {
      'src': `${imageRootPath}southside_revealed.jpg`,
      'flipSide': 'southside_a'
    },
    'st_marys_hospital_a': {
      'src': `${imageRootPath}st_marys_hospital_unrevealed.jpg`,
      'flipSide': 'st_marys_hospital_b'
    },
    'st_marys_hospital_b': {
      'src': `${imageRootPath}st_marys_hospital_revealed.jpg`,
      'flipSide': 'st_marys_hospital_a'
    },
    'miskatonic_university_a': {
      'src': `${imageRootPath}miskatonic_university_unrevealed.jpg`,
      'flipSide': 'miskatonic_university_b'
    },
    'miskatonic_university_b': {
      'src': `${imageRootPath}miskatonic_university_revealed.jpg`,
      'flipSide': 'miskatonic_university_a'
    },
    'downtown_a': {
      'src': `${imageRootPath}downtown_unrevealed.jpg`,
      'flipSide': 'downtown_b'
    },
    'downtown_b': {
      'src': `${imageRootPath}downtown_revealed.jpg`,
      'flipSide': 'downtown_a'
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
    }
  };
  
  var campaigns = {
    'init': function(campaignName, partNum) {
    },
  
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
            cards['flesh_eater'].src,
            cards['icy_ghoul'].src,
            cards['swarm_of_rats'].src,
            cards['swarm_of_rats'].src,
            cards['swarm_of_rats'].src,
            cards['ghoul_minion'].src,
            cards['ghoul_minion'].src,
            cards['ghoul_minion'].src,
            cards['ravenous_ghoul'].src,
            cards['grasping_hands'].src,
            cards['grasping_hands'].src,
            cards['grasping_hands'].src,
            cards['rotting_remains'].src,
            cards['rotting_remains'].src,
            cards['rotting_remains'].src,
            cards['frozen_in_fear'].src,
            cards['frozen_in_fear'].src,
            cards['dissonant_voices'].src,
            cards['dissonant_voices'].src,
            cards['ancient_evils'].src,
            cards['ancient_evils'].src,
            cards['ancient_evils'].src,
            cards['crypt_chill'].src,
            cards['crypt_chill'].src,
            cards['obscuring_fog'].src,
            cards['obscuring_fog'].src
          ],
          'aside': [
            cards['ghoul_priest'],
            cards['lita_chantler']
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
          ],
          'aside': [
            cards['the_masked_hunter'],
          ],
          'location': [
            {
              'name': 'your_house_a',
              'card': cards['your_house_a'].src
            },
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
        cards['lita_chantler']
      ]
    }
  };
  
  
  
  
  
  var currCampaign = {
    'campaign': null,
    'scenario': null,
    'part': null,
    'agenda': null,
    'act': null,
    'round': null,
    'phase': null,
    'visitedEncounters': null,
  
    'init': function(campaignName) {
      this.campaign = campaigns[campaignName];
      this.part = this.campaign['Part 1'];
      this.scenario = this.part.scenario;
      this.agenda = this.part.agendas['Agenda 1a'];
      this.act = this.part.acts['Act 1a'];
      this.round = 1;
      this.phase = PHASE.INVESTIGATION;
      this.visitedEncounters = new Set();
    },
  
    'toggleScenarioCard': function(img) {
      if (img.id === 'scenario-front') {
        img.src = `images/arkham/${this.scenario}_back.jpg`;
        img.id = 'scenario-back';
      }
      else {
        img.src = `images/arkham/${this.scenario}_front.jpg`
        img.id = 'scenario-front';
      }
    },
    
    'prevAgenda': function() {
      var agendaKey = this.agenda.prev();
      if (agendaKey === null) {
        return;
      }
      this.agenda = this.part.agendas[agendaKey];
  
      const img = document.getElementById('agenda');
      img.setAttribute('src', `images/arkham/${this.agenda.src}`);
    },
    'nextAgenda': function() {
      var nextAgendaKey = this.agenda.next();
      if (nextAgendaKey === null) {
        return;
      }
      this.agenda = this.part.agendas[nextAgendaKey];
  
      const img = document.getElementById('agenda');
      img.setAttribute('src', `images/arkham/${this.agenda.src}`);
    },
    'prevAct': function() {
      var actKey = this.act.prev();
      if (actKey === null) {
        return;
      }
      this.act = this.part.acts[actKey];
  
      const img = document.getElementById('act');
      img.setAttribute('src', `images/arkham/${this.act.src}`);
    },
    'nextAct': function() {
      var nextActKey = this.act.next();
      if (nextActKey === null) {
        return;
      }
      this.act = this.part.acts[nextActKey];
  
      const img = document.getElementById('act');
      img.setAttribute('src', `images/arkham/${this.act.src}`);
    },
    'drawEncounter': function() {
      var randomIndex = getRandomInt(this.part.encounters.length - 1);;
      while (this.visitedEncounters.has(randomIndex)) {
        randomIndex = getRandomInt(this.part.encounters.length - 1);
      }
  
      var encounterCard = this.part.encounters[randomIndex];
  
      const encounter = document.getElementById('encounter');
      encounter.src = `images/arkham/${encounterCard.src}`;
  
      this.visitedEncounters.add(randomIndex);
    }
  };
  
  var player = {
    'investigator': {},
    'investigatorName': null,
    'health': null,
    'sanity': null,
    'hand': [],
    'assets': [],
  
    'init': function(investigatorName) {
      this.investigator = investigators[investigatorName];
      this.investigatorName = this.investigator.name;
      this.health = this.investigator.health;
      this.sanity = this.investigator.sanity;
    },
    'toggleInvestigatorCard': function(img) {
      if (img.id === 'investigator-front') {
        img.src = `images/arkham/${this.investigatorName}_back.png`;
        img.id = 'investigator-back';
      }
      else {
        img.src = `images/arkham/${this.investigatorName}_front.png`
        img.id = 'investigator-front';
      }
    }
  };
  
  var mainDiv = document.getElementById('main');
  
  /* MODEL */
  var model = {
    'TABLE_NAME': {
      'campaigns': 'campaigns',
      'difficulties': 'difficulties',
      'investigators': 'investigators'
    },
  
    'getCampaign': function(name) {
      return this.campaigns[name];
    },
  
    'getInvestigator': function(name) {
      return this.investigators[name];
    },
  
    'getTable': function(tableName) {
      return this[tableName];
    },
  
    'campaigns': {
      'Night of the Zealot': {
        'parts': [
          'Part 1: The Gathering'
        ]
      },
      'Campaign 2': {}
    },
  
    'difficulties': {
      'Easy': {},
      'Standard': {},
      'Hard': {},
      'Expert': {}
    },
  
    'investigators': {
      'Roland': {
        'deck': [
          '32_colt.jpg',
          'eat_lead.jpg',
          'daring.jpg',
          'first_watch.jpg',
          'emergency_aid.jpg',
          'machete.jpg',
          'guard_dog.jpg',
          'intrepid.jpg',
          'scene_of_the_crime.jpg',
          'second_wind.jpg'
        ]
      },
      'Wendy': {}
    }
  };
  
  /* VIEW */
  var view = {
    'clearMainDiv': function() {
      html.removeChildren(mainDiv);
    },
  
    'loadStartPage': function() {
      this.clearMainDiv();
      html.setClassName(mainDiv, 'start-page');
  
      var header1 = html.createH1('Arkham Horror');
      html.setClassName(header1, 'page-title');
  
      var headerDiv = html.createDiv();
      headerDiv.appendChild(header1);
      this.addElementToPage(headerDiv);
  
      var newGameButton = html.createButton('view.loadStartNewGamePage()', 'New Game');
      html.setClassName(newGameButton, 'start-button');
      this.addElementToPage(newGameButton);
      
      var loadGameButton = html.createButton('view.loadStartNewGamePage()', 'Load Game');
      html.setClassName(loadGameButton, 'start-button');
      this.addElementToPage(loadGameButton);
    },
  
    'loadStartNewGamePage': function() {
      this.clearMainDiv();
      html.setClassName(mainDiv, 'newgame-page');
  
      var header1 = html.createH1('Arkham Horror');
      html.setClassName(header1, 'page-title');
      this.addElementToPage(header1);
  
      const campaignID = 'campaign';
      var labelCampaign = html.createLabel('Campaign', campaignID);
      html.setClassName(labelCampaign, 'newpage-label');
      var campaignList = controller.getCampaignNameList();
      var selectCampaign = html.createSelect(campaignList, campaignID);
      html.setClassName(selectCampaign, 'newpage-select');
  
      const difficultyID = 'difficulty';
      var labelDifficulty = html.createLabel('Difficulty', difficultyID);
      html.setClassName(labelDifficulty, 'newpage-label');
      var difficultyList = controller.getDifficultyNameList();
      var selectDifficulty = html.createSelect(difficultyList, difficultyID);
      html.setClassName(selectDifficulty, 'newpage-select');
  
      const investigatorID = 'investigator';
      var labelInvestigator = html.createLabel('Investigator', investigatorID);
      html.setClassName(labelInvestigator, 'newpage-label');
      var investigatorList = controller.getInvestigatorNameList();
      var selectInvestigator = html.createSelect(investigatorList, investigatorID);
      html.setClassName(selectInvestigator, 'newpage-select');
  
      var startButton = html.createButton(`controller.verifyStartGame('${campaignID}', '${difficultyID}', '${investigatorID}')`, 'Start Game');
      html.setClassName(startButton, 'start-button');
  
      var containerDiv = html.createDiv();
      html.setClassName(containerDiv, 'container center-children');
      containerDiv.appendChild(labelCampaign);
      containerDiv.appendChild(selectCampaign);
      containerDiv.appendChild(labelDifficulty);
      containerDiv.appendChild(selectDifficulty);
      containerDiv.appendChild(labelInvestigator);
      containerDiv.appendChild(selectInvestigator);
      containerDiv.appendChild(startButton);
  
      this.addElementToPage(containerDiv);
    },
  
    'loadLoadGamePage': function() {
      this.clearMainDiv();
      html.setClassName(mainDiv, 'loadgame-page');
    },
  
    'loadCardTablePage': function(campaignName, investigatorName) {
      // Scenario Reference Card (click to flip to other side)
      // Agenda Deck (click to trigger alert confirming advancement)
      // Act Deck (click to activate - triggers locations, and other things...)
      //   (click Clue-icon to spend clues and advance - only executes when Player has min clues in pool)
      // Encounter Deck (click to draw)
      // Discarded Encounters pile
      // Token pool (click to acquire 1)
      // Player card (display only)
      // Player Resource pool (display only)
      // Player Clue pool (display only)
      // Player Deck (click to draw)
      // Player discard pile
      // Player Assets area
      // Player hand (click to redraw - only happens once) ()
      // Done button under Player hand (click to change onclick for Player hand cards: click to add to assets)
    },
  
    'loadNewGamePage': function(campaignName, difficulty, investigatorName) {
      this.clearMainDiv();
      html.setClassName(mainDiv, 'game-page');
  
      controller.loadNewCampaign(campaignName, difficultyName);
  
      var gameHeader = html.createH2(`${campaignName}\n${controller.stateOfPlay.part}`);
      html.setClassName(gameHeader, 'page-title');
      this.addElementToPage(gameHeader);
  
      var characterHeader = html.createH3(`${investigatorName}'s Opening Hand`);
      var headerDiv = html.createDiv();
      html.setClassName(headerDiv, 'row');
      headerDiv.appendChild(characterHeader);
      this.addElementToPage(headerDiv);
  
      var cardsDiv = html.createDiv();
      html.setClassName(cardsDiv, 'row');
  
      var discardDiv = html.createDiv('Discard?');
      html.setClassName(discardDiv, 'col-md-2 card');
      cardsDiv.appendChild(discardDiv);
  
      var openingHand = controller.stateOfPlay.player.draw(5);
  
      this.addElementToPage(cardsDiv);
    },
  
    'addElementToPage': function(element) {
      mainDiv.appendChild(element);
    }
  };
  
  /* CONTROLLER */
  var controller = {
    'stateOfPlay': {
      'campaign': {},
      'difficulty': null,
      'player': {}
    },
  
    'verifyStartGame': function(campaignID, difficultyID, investigatorID) {
      const campaign = document.getElementById(campaignID).value;
      if (campaign === '') {
        alert('Please choose a campaign');
        return;
      }
  
      const difficulty = document.getElementById(difficultyID).value;
      if (difficulty === '') {
        alert('Please choose a difficulty');
        return;
      }
  
      const investigator = document.getElementById(investigatorID).value;
      if (investigator === '') {
        alert('Please choose an investigator');
        return;
      }
  
      loadGame(campaign, difficulty, investigator);
      // view.loadCardTablePage(campaign, investigator);
      // view.loadNewGamePage(campaign, difficulty, investigator);
    },
  
    'loadNewCampaign': function(campaignName, difficultyName) {
      this.stateOfPlay.difficulty = difficultyName;
  
      var campaign = model.getCampaign(campaignName);
      this.stateOfPlay.campaign = campaign;
      
      this.stateOfPlay.part = campaign.parts[0];
    },
  
    'loadNewInvestigator': function(investigatorName) {
      var investigator = model.getInvestigator(investigatorName);
      this.stateOfPlay.player = investigator;
      this.stateOfPlay.player['draw'] = function(num=1) {
        // TODO
      };
    },
  
    'getNameList': function(tableName) {
      var table = model.getTable(tableName);
  
      var nameList = [];
      for (name in table) {
        nameList.push(name);
      }
  
      return nameList;
    },
  
    'getCampaignNameList': function() {
      return this.getNameList(model.TABLE_NAME.campaigns);
    },
  
    'getDifficultyNameList': function() {
      return this.getNameList(model.TABLE_NAME.difficulties);
    },
  
    'getInvestigatorNameList': function() {
      return this.getNameList(model.TABLE_NAME.investigators);
    }
  };
  
  /* HTML */
  var html = {
    'setClassName': function(element, className) {
      element.className = className;
    },
  
    'removeChildren': function(element) {
      var child = element.lastElementChild;
      while (child) {
        element.removeChild(child);
        child = element.lastElementChild;
      }
    },
  
    'createLabel': function(innerText, htmlFor) {
      var label = document.createElement('label');
      label.innerText = innerText;
      label.htmlFor = htmlFor;
      label.className = '';
  
      return label;
    },
  
    'createOption': function(text, value='') {
      var option = document.createElement('option');
      option.text = text;
      option.value = value;
  
      return option;
    },
  
    'createSelect': function(options, name) {
      var select = document.createElement('select');
      select.name = name;
      select.id = name;
      select.className = '';
  
      select.add(this.createOption(`Select ${name}`));
      options.forEach(o => select.add(this.createOption(o, o)));
  
      return select;
    },
  
    'createButton': function(onclick, innerText) {
      var button = document.createElement('button');
      button.setAttribute('onclick', onclick);
      button.innerText = innerText;
      
      return button;
    },
    
    'createDiv': function(innerText=null) {
      var div = document.createElement('div');
      div.innerText = innerText;
  
      return div;
    },
  
    'createH': function(num, innerText) {
      var h = document.createElement(`h${num}`);
      h.innerText = innerText;
  
      return h;
    },
  
    'createH1': function(innerText) {
      return this.createH(1, innerText);
    },
  
    'createH2': function(innerText) {
      return this.createH(2, innerText);
    },
    
    'createH3': function(innerText) {
      return this.createH(3, innerText);
    }
  };
  
  function getRandomInt(max) {
    // get random int in range [0,max]
    return Math.floor(Math.random() * Math.floor(max));
  }
  
  window.onload = function() {
    initApp();
    // game.init('Night of the Zealot', 1, 'Easy', 'Roland');
    game.init('Night of the Zealot', 2, 'Easy', 'Roland', 'deck1');
    
    
    // currCampaign.init('Night of the Zealot');
    // player.init('Roland');
    // view.loadStartPage();
  
    // view.loadStartNewGamePage();
  
    // view.loadCardTablePage();
  
    // controller.loadNewCampaign('Night of the Zealot', 'Easy');
    // controller.loadNewInvestigator('Roland');
    // view.loadNewGamePage('Night of the Zealot', 'Roland');
  };