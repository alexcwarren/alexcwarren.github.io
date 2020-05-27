// Class=name variables
var offClass = 'nonocell cellOff';
var onClass = 'nonocell cellOn';
var countClass = 'nonocell countCell'

// Keep track of counter IDs
var rowCounterIDs = new Map();
var colCounterIDs = new Map();

function createNonogram() {
  var dimension = document.getElementById('nonoDim').value;
  let table = document.getElementById('nonogramTable');

  for (let i = 0; i <= dimension; i++) {
    // Add row
    let row = table.insertRow();

    for (let j = 0; j <= dimension; j++) {
      // Add cell (column) to row
      let td = document.createElement('td');

      if ((i === 0 && j != 0) || (j === 0 && i != 0)) {
        td.className = countClass;

        let pD = getPulldown(dimension);
        var id = j === 0 ? addRowCounter(i) : addColCounter(j);
        pD.setAttribute('id', id);

        td.appendChild(pD);
      }
      else if (i != 0 || j != 0) {
        td.className = offClass;
        td.setAttribute('onclick', 'toggleNonocell(this)');
      }

      row.appendChild(td);
    }
  }

  document.getElementById('controls').hidden = true;
  document.getElementById('nonogram').hidden = false;
  document.getElementById('submit').hidden = false;
}


function getPulldown(end, start=0) {
  let pullDown = document.createElement('select');

  for (let i = start; i <= end; i++) {
    let option = document.createElement('option');
    option.text = i;
    option.setAttribute('value', i);
    pullDown.add(option);
  }

  pullDown.className = 'counter';
  return pullDown;
}

function addRowCounter(row) {
  rowCounterIDs.set(row, 'counter' + row);
  return rowCounterIDs.get(row);
}

function addColCounter(col) {
  colCounterIDs.set(col, 'counter' + col);
  return colCounterIDs.get(col);
}

function toggleNonocell(cell) {
  cell.className = cell.className === onClass ? offClass : onClass;
}

function verifyNonogram() {
  let table = document.getElementById('nonogramTable');

  var rowCount = new Map();
  var colCount = new Map();

  for (let i = 1; i < table.rows.length; i++) {
    rowCount.set(i, 0);
    colCount.set(i, 0);
  }

  for (var i = 1, row; row = table.rows[i]; i++) {
    //iterate through rows
    //rows would be accessed using the "row" variable assigned in the for loop
    for (var j = 1, col; col = row.cells[j]; j++) {
      //iterate through columns
      //columns would be accessed using the "col" variable assigned in the for loop
      if (col.className === onClass) {
        rowCount.set(i, rowCount.get(i) + 1);
        colCount.set(j, colCount.get(j) + 1);
      }
    }
  }

  for (var i = 1; i < table.rows.length; i++) {
    if (rowCount.get(i) != parseInt(document.getElementById(rowCounterIDs.get(i)).value)
     || colCount.get(i) != parseInt(document.getElementById(colCounterIDs.get(i)).value)) {
       alert('Incorrect!  Try again.');
       return;
     }
  }

  alert('Correct!  Good job!');
}
