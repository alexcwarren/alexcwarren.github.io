var characterClass = null;

function clear() {
  document.getElementById('speed').value = '';
  document.getElementById('traits').value = '';
  document.getElementById('hitDice').value = '';
  document.getElementById('proficiencies').value = '';
}

function httpGet(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', url);
    xmlHttp.send();
    return xmlHttp.responseText;
}

function updateClass() {
  loadClass();

  console.log('tmp: ', document.getElementById('tmp').value);
  var classObj = document.getElementById('tmp').value;
  console.log('classObj: ', classObj);
}

function update() {
  console.log('Updating...');
  clear();
  updateClass();
  // updateRace();
  // updateClass();

  // Update abilities
  // Update proficiencies
}

// window.onload = function() {
// };
