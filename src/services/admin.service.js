const systemUtils = require('../core/utils/systemUtils');
// Live Demo: Admin diagnostic ping utility
exports.pingProvider = (ip, opts, cb) => {
    systemUtils.executeNetworkDiagnostic(ip, opts, cb);
};

function parseSafeFormula(formula) {
    if (typeof formula === 'number') {
        return formula;
    }
    if (typeof formula !== 'string') {
        throw new Error('Formula must be a string or number');
    }
    const str = formula.trim();
    if (!str) {
        throw new Error('Formula cannot be empty');
    }

    let pos = 0;
    const tokens = [];

    while (pos < str.length) {
        const ch = str[pos];

        if (/\s/.test(ch)) {
            pos++;
            continue;
        }

        if (ch === '+' || ch === '-' || ch === '*' || ch === '/' || ch === '%' || ch === '(' || ch === ')') {
            tokens.push({ type: ch, value: ch });
            pos++;
            continue;
        }

        if (/\d/.test(ch) || (ch === '.' && pos + 1 < str.length && /\d/.test(str[pos + 1]))) {
            let numStr = '';
            while (pos < str.length && (/\d/.test(str[pos]) || str[pos] === '.')) {
                if (str[pos] === '.' && numStr.includes('.')) {
                    throw new Error('Invalid number format in formula');
                }
                numStr += str[pos];
                pos++;
            }
            if (pos < str.length && (str[pos] === 'e' || str[pos] === 'E')) {
                let eStr = str[pos];
                let ePos = pos + 1;
                if (ePos < str.length && (str[ePos] === '+' || str[ePos] === '-')) {
                    eStr += str[ePos];
                    ePos++;
                }
                if (ePos < str.length && /\d/.test(str[ePos])) {
                    while (ePos < str.length && /\d/.test(str[ePos])) {
                        eStr += str[ePos];
                        ePos++;
                    }
                    numStr += eStr;
                    pos = ePos;
                }
            }
            tokens.push({ type: 'NUMBER', value: parseFloat(numStr) });
            continue;
        }

        throw new Error(`Unexpected character in formula: ${ch}`);
    }

    if (tokens.length === 0) {
        throw new Error('Formula cannot be empty');
    }

    let current = 0;

    function peek() {
        return tokens[current];
    }

    function consume(expectedType) {
        const token = tokens[current];
        if (!token || (expectedType && token.type !== expectedType)) {
            throw new Error(`Unexpected token: ${token ? token.type : 'EOF'}, expected: ${expectedType}`);
        }
        current++;
        return token;
    }

    function parseExpression() {
        let result = parseTerm();
        while (current < tokens.length && (tokens[current].type === '+' || tokens[current].type === '-')) {
            const op = consume().type;
            const right = parseTerm();
            if (op === '+') {
                result = result + right;
            } else {
                result = result - right;
            }
        }
        return result;
    }

    function parseTerm() {
        let result = parseFactor();
        while (current < tokens.length && (tokens[current].type === '*' || tokens[current].type === '/' || tokens[current].type === '%')) {
            const op = consume().type;
            const right = parseFactor();
            if (op === '*') {
                result = result * right;
            } else if (op === '/') {
                result = result / right;
            } else {
                result = result % right;
            }
        }
        return result;
    }

    function parseFactor() {
        const token = peek();
        if (!token) {
            throw new Error('Unexpected end of formula');
        }

        if (token.type === '+') {
            consume('+');
            return parseFactor();
        }

        if (token.type === '-') {
            consume('-');
            return -parseFactor();
        }

        if (token.type === 'NUMBER') {
            consume('NUMBER');
            return token.value;
        }

        if (token.type === '(') {
            consume('(');
            const val = parseExpression();
            consume(')');
            return val;
        }

        throw new Error(`Unexpected token in formula: ${token.type}`);
    }

    const value = parseExpression();
    if (current < tokens.length) {
        throw new Error(`Unexpected extra tokens in formula: ${tokens[current].type}`);
    }
    return value;
}

exports.evaluateDiscount = (formula) => {
    return parseSafeFormula(formula);
};
