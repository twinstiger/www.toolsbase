// ==================== Calculator Module ====================

let calcExpression = '';

function updateCalcDisplay() {
    const calcDisplay = document.getElementById('calc-display');
    if (calcDisplay) calcDisplay.value = calcExpression || '0';
}

function calcNum(num) {
    calcExpression += num;
    updateCalcDisplay();
}

function calcOp(op) {
    if (calcExpression !== '') {
        calcExpression += ' ' + op + ' ';
    }
    updateCalcDisplay();
}

function calcDot() {
    const parts = calcExpression.split(' ');
    const lastPart = parts[parts.length - 1];
    if (!lastPart.includes('.')) {
        calcExpression += lastPart ? '.' : '0.';
    }
    updateCalcDisplay();
}

function calcClear() {
    calcExpression = '';
    updateCalcDisplay();
}

function calcBackspace() {
    calcExpression = calcExpression.trim();
    if (calcExpression.length <= 1) {
        calcExpression = '';
    } else {
        const parts = calcExpression.split(' ');
        parts.pop();
        calcExpression = parts.join(' ');
    }
    updateCalcDisplay();
}

function calcEquals() {
    try {
        // Safe evaluation without using eval or Function constructor
        const result = safeCalculate(calcExpression);
        calcExpression = String(result);
        updateCalcDisplay();
    } catch (e) {
        calcExpression = 'Error';
        updateCalcDisplay();
        setTimeout(() => {
            calcExpression = '';
            updateCalcDisplay();
        }, 1500);
    }
}

// Safe calculator function to avoid eval/Function
function safeCalculate(expression) {
    // Remove any spaces and validate the expression
    const cleaned = expression.replace(/\s/g, '');
    
    // Only allow numbers, operators, and decimal points
    if (!/^[0-9.+\-*/()]+$/.test(cleaned)) {
        throw new Error('Invalid characters in expression');
    }
    
    // Parse and calculate manually
    return parseExpression(cleaned);
}

function parseExpression(expr) {
    let pos = 0;
    
    function parseNumber() {
        let num = '';
        while (pos < expr.length && (expr[pos].match(/[0-9.]/))) {
            num += expr[pos];
            pos++;
        }
        if (!num) throw new Error('Expected number');
        return parseFloat(num);
    }
    
    function parseTerm() {
        let result = parseFactor();
        
        while (pos < expr.length && (expr[pos] === '*' || expr[pos] === '/')) {
            const op = expr[pos];
            pos++;
            const right = parseFactor();
            if (op === '*') {
                result *= right;
            } else {
                if (right === 0) throw new Error('Division by zero');
                result /= right;
            }
        }
        
        return result;
    }
    
    function parseFactor() {
        if (expr[pos] === '(') {
            pos++; // skip '('
            const result = parseExpression(expr.substring(pos));
            if (expr[pos] === ')') pos++; // skip ')'
            return result;
        }
        
        if (expr[pos] === '-') {
            pos++;
            return -parseFactor();
        }
        
        if (expr[pos] === '+') {
            pos++;
            return parseFactor();
        }
        
        return parseNumber();
    }
    
    let result = parseTerm();
    
    while (pos < expr.length && (expr[pos] === '+' || expr[pos] === '-')) {
        const op = expr[pos];
        pos++;
        const right = parseTerm();
        if (op === '+') {
            result += right;
        } else {
            result -= right;
        }
    }
    
    return result;
}

function calcPercentage() {
    const value = parseFloat(document.getElementById('pct-value').value);
    const total = parseFloat(document.getElementById('pct-total').value);
    const result = (value / 100) * total;
    document.getElementById('pct-result').textContent = `Result: ${result}`;
}

function calcTip() {
    const bill = parseFloat(document.getElementById('tip-bill').value);
    const percent = parseFloat(document.getElementById('tip-percent').value);
    const split = parseInt(document.getElementById('tip-split').value);
    
    const tipAmount = bill * (percent / 100);
    const total = bill + tipAmount;
    const perPerson = total / split;
    
    document.getElementById('tip-result').textContent = 
        `Tip: $${tipAmount.toFixed(2)} | Total: $${total.toFixed(2)} | Per Person: $${perPerson.toFixed(2)}`;
}

function calcLoan() {
    const amount = parseFloat(document.getElementById('loan-amount').value);
    const rate = parseFloat(document.getElementById('loan-rate').value) / 100 / 12;
    const term = parseInt(document.getElementById('loan-term').value) * 12;
    
    const payment = amount * rate * Math.pow(1 + rate, term) / (Math.pow(1 + rate, term) - 1);
    document.getElementById('loan-result').textContent = `Monthly Payment: $${payment.toFixed(2)}`;
}

function calcAge() {
    const birthDate = new Date(document.getElementById('age-birth').value);
    const today = new Date();
    
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();
    
    if (days < 0) {
        months--;
        days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }
    
    document.getElementById('age-result').textContent = 
        `${years} years, ${months} months, ${days} days`;
}
