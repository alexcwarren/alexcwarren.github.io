function parseInput() {
    var input = document.getElementById('customInput').value;

    var rolls = [];
    for(let arg of input.split(' ')) {
        var rollArg = validateArgument(arg);

        if(rollArg.isValid) {
            rolls.push(roll(rollArg.numDice, rollArg.dieType, rollArg.modifier, false));
        }
        else {
            rolls.push('Invalid argument: ' + arg);
        }
    }

    for(r of rolls) {
        log(r);
    }
}

function validateArgument(arg) {
    var validity = arg.search("\\d+[d]\\d+") >= 0 ? true : false;
    var num = arg.match("^\\d+")[0];
    var type = arg.match("[d]\\d+")[0].replace("d", "");
    var mod = arg.match("[+-]\\d+");
    mod = !mod ? 0 : mod[0].replace("+", "");

    return {
        isValid: validity,
        numDice: num,
        dieType: type,
        modifier: mod
    };
}

function rollDie(dieType) {
    return Math.ceil( Math.random() * dieType );
}

function roll(numDice, dieType, modifier=0, logRoll=true) {
    var logMessage = numDice + 'd' + dieType;
    if(modifier != 0) {
        if(modifier > 0) {
            logMessage += '+';
        }

        logMessage += modifier;
    }
    logMessage += ': ';

    var sum = 0;
    for(let i = 0; i < numDice; i++) {
        var outcome = rollDie(dieType);
        sum += outcome;
        logMessage += outcome + ' ';
    }
    if(numDice > 1) {
        logMessage += '= ' + sum + ' ';
    }

    if(modifier != 0) {
        logMessage += '+ ';
        logMessage += modifier + ' = ' + eval(sum + '+' + modifier);
    }

    // TODO: devise way to allow Ability Score functionality

    if(logRoll) {
        log(logMessage);
    }

    return logMessage;
}

function rollButton(dieType) {
    var numDice = document.getElementById('numDice').value;
    var mod = document.getElementById('mod').value;

    numDice = !numDice ? 1 : numDice;
    mod = !mod ? 0 : mod;

    roll(numDice, dieType, mod);
}

function roll20(type) {
    var msg = '';
    var useMax = false;

    if(type == 'adv') {
        msg += 'Adv ';
        useMax = true;
    }
    else if(type == 'dis'){
        msg += 'Dis '
    }
    else {
        return;
    }

    var roll1 = rollDie(20);
    var roll2 = rollDie(20);

    msg += '2d20: ' + roll1 + ' ' + roll2 + ' = ';

    msg += useMax ? Math.max(roll1, roll2) : Math.min(roll1, roll2);

    log(msg);
}

function log(message, newline=true) {
    if(!message) {
        return;
    }

    message += newline ? '<br/>' : '';

    let logText = document.getElementById('log').innerHTML;
    document.getElementById('log').innerHTML = message + logText;
}

function clearLog() {
    document.getElementById('log').innerHTML = '';
}
