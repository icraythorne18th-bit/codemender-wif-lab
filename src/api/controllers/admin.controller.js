const adminService = require('../../services/admin.service');

function evaluateFormula(formula) {
    if (typeof formula !== 'string') {
        throw new Error('Invalid formula');
    }
    if (!/^[0-9+\-*/%().\s]+$/.test(formula)) {
        throw new Error('Invalid characters in formula');
    }

    let pos = 0;
    const str = formula;

    function skipWhitespace() {
        while (pos < str.length && /\s/.test(str[pos])) {
            pos++;
        }
    }

    function parseExpression() {
        return parseAdditive();
    }

    function parseAdditive() {
        let left = parseMultiplicative();
        while (true) {
            skipWhitespace();
            if (pos < str.length && str[pos] === '+') {
                pos++;
                left = left + parseMultiplicative();
            } else if (pos < str.length && str[pos] === '-') {
                pos++;
                left = left - parseMultiplicative();
            } else {
                break;
            }
        }
        return left;
    }

    function parseMultiplicative() {
        let left = parsePrimary();
        while (true) {
            skipWhitespace();
            if (pos < str.length && str[pos] === '*' && str[pos + 1] !== '*') {
                pos++;
                left = left * parsePrimary();
            } else if (pos < str.length && str[pos] === '/') {
                pos++;
                const right = parsePrimary();
                if (right === 0) throw new Error('Division by zero');
                left = left / right;
            } else if (pos < str.length && str[pos] === '%') {
                pos++;
                const right = parsePrimary();
                left = left % right;
            } else {
                break;
            }
        }
        return left;
    }

    function parsePrimary() {
        skipWhitespace();
        if (pos >= str.length) {
            throw new Error('Unexpected end of formula');
        }

        if (str[pos] === '+') {
            pos++;
            return parsePrimary();
        }

        if (str[pos] === '-') {
            pos++;
            return -parsePrimary();
        }

        if (str[pos] === '(') {
            pos++;
            const val = parseExpression();
            skipWhitespace();
            if (pos >= str.length || str[pos] !== ')') {
                throw new Error('Mismatched parentheses');
            }
            pos++;
            return val;
        }

        if (str[pos] === '.' || (str[pos] >= '0' && str[pos] <= '9')) {
            const numStart = pos;
            let hasDot = false;
            while (pos < str.length) {
                const ch = str[pos];
                if (ch >= '0' && ch <= '9') {
                    pos++;
                } else if (ch === '.' && !hasDot) {
                    hasDot = true;
                    pos++;
                } else {
                    break;
                }
            }
            const numStr = str.slice(numStart, pos);
            if (numStr === '.') {
                throw new Error('Invalid number');
            }
            const val = parseFloat(numStr);
            if (isNaN(val)) {
                throw new Error('Invalid number');
            }
            return val;
        }

        throw new Error('Unexpected token');
    }

    const result = parseExpression();
    skipWhitespace();
    if (pos < str.length) {
        throw new Error('Unexpected token after formula');
    }
    if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
        throw new Error('Invalid calculation result');
    }
    return result;
}

exports.checkShippingStatus = (req, res) => {
    adminService.pingProvider(req.body.providerIP, req.body.options, out => res.send(out));
};

exports.previewDynamicPricing = (req, res) => {
    try {
        res.json({ price: evaluateFormula(req.body.formula) });
    } catch (e) {
        res.status(400).send("Evaluation Failed");
    }
};
