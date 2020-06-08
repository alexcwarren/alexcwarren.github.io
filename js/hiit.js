// Buttons
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const resetButton = document.getElementById('reset-button');

// Stopwatch time fields
const minutesField = document.getElementById('minutes');
const secondsField = document.getElementById('seconds');
const millisecondsField = document.getElementById('milliseconds');

var counter = null;
var startTime = null;

function startTimer() {
  setDisabled(true, false, false);
  if (startTime === null) {
    startTime = new Date().getTime();
  }
  counter = setInterval(updateTime, 1);
}

var stopTime = 0;

function stopTimer() {
  setDisabled(false, true, false);
  clearInterval(counter);
  stopTime += new Date().getTime() - startTime;
  startTime = null;
}

function resetTimer() {
  setDisabled(false, false, false);
  clearInterval(counter);
  setTime();
  counter = null;
  startTime = null;
  stopTime = 0;
}

function setDisabled(start, stop, reset) {
  startButton.disabled = start;
  stopButton.disabled = stop;
  resetButton.disabled = reset;
}

function updateTime() {
  var now = new Date().getTime();
  var timeDelta = now - startTime + stopTime;

  var minutes = getMinutes(timeDelta);
  var seconds = getSeconds(timeDelta, minutes);
  var milliseconds = getMilliseconds(timeDelta, minutes, seconds);

  setTime(minutes, seconds, milliseconds);
}

function getMinutes(milli) {return Math.floor((milli/1000) / 60);}
function getSeconds(milli, min) {return Math.floor((milli - min*60*1000) / 1000);}
function getMilliseconds(milli, min, sec) {return milli - min*60*1000 - sec*60;}

function setTime(min=0, sec=0, milli=0) {
  minutesField.innerText = min.toString().padStart(2, '0');
  secondsField.innerText = sec.toString().padStart(2, '0');
  millisecondsField.innerText = milli.toString().padStart(3, '0');
}
