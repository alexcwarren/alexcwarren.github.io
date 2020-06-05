function getChaosTokensMap() {
  let EASY = 'easy';
  let STD = 'standard';
  let HARD = 'hard';
  let EXP = 'expert';

  let p1 =  '+1';
  let z = '0';
  let m1 = '-1';
  let m2 = '-2';
  let m3 = '-3';
  let m4 = '-4';
  let m5 = '-5';
  let m6 = '-6';
  let m8 = '-8';
  let skull = 'skull';
  let hood = 'hood';
  let tablet = 'tablet';
  let cthulu = 'cthulu';
  let star = 'star';

  let chaosTokensMap = new Map();
  chaosTokensMap.set(EASY, [p1, p1, z, z, z, m1, m1, m1, m2, m2, skull, skull, hood, tablet, cthulu, star]);
  chaosTokensMap.set(STD, [p1, z, z, m1, m1, m1, m2, m2, m3, m4, skull, skull, hood, tablet, cthulu, star]);
  chaosTokensMap.set(HARD, [z, z, z, m1, m1, m2, m2, m3, m3, m4, m5, skull, skull, hood, tablet, cthulu, star]);
  chaosTokensMap.set(EXP, [z, m1, m1, m2, m2, m3, m3, m4, m4, m5, m6, m8, skull, skull, hood, tablet, cthulu, star]);

  return chaosTokensMap;
}

function getDifficulty() {
    var difficultySelection = document.getElementById('difficulty');
    var difficultyIndex = difficultySelection.selectedIndex;
    return difficulty = difficultySelection.options[ difficultyIndex ].value;
}

function showChaosTokens() {
    let chaosTokensMap = getChaosTokensMap();
    var text = '';

    for(let el of chaosTokensMap.get(getDifficulty())) {
        text += el + ', ';
    }

    log(text.substring(0, text.length - 2) + '<br/>');
}

function drawChaosToken() {
  var difficulty = getDifficulty();

  let chaosTokensMap = getChaosTokensMap();
  var chaosTokens = chaosTokensMap.get(difficulty);
  var index = Math.ceil(Math.random() * chaosTokens.length - 1);
  log(chaosTokens[index] + '<br/>');
}

function log(message) {
  if(!message) {
    return;
  }

  let text = document.getElementById('log').innerHTML;
  document.getElementById('log').innerHTML = message + text;
}

function clearLog() {
  document.getElementById('log').innerHTML = '';
}

function legend() {
  var difficulty = getDifficulty();

  let legendRows = document.getElementById('legend').rows;

  let skullRow = legendRows[0].cells;
  let hoodRow = legendRows[1].cells;
  let tabletRow = legendRows[2].cells;

  if(difficulty == 'easy' || difficulty == 'standard') {

    skullRow[1].innerHTML = '-X. X is the number of <strong><em>Ghoul</em></strong> enemies at your location.';
    hoodRow[1].innerHTML = '-1. If you fail, take 1 horror.';
    tabletRow[1].innerHTML = '-2. If there is a <strong><em>Ghoul</em></strong> enemy at your location, take 1 damage.';
  }
  else if(difficulty == 'hard' || difficulty == 'expert') {
    skullRow[1].innerHTML = '-2. If you fail, after this skill test, search the encounter deck and discard pile for a <strong><em>Ghoul</em></strong> enemy, and draw it. Shuffle the encounter deck.';
    hoodRow[1].innerHTML = 'Reveal another token. If you fail, take 2 horror.';
    tabletRow[1].innerHTML = '-4. If there is a <strong><em>Ghoul</em></strong> enemy at your location, take 1 damage and 1 horror.';
  }
}

window.onload = function() {
  initApp();
};
