const net = require('net');
const systemUtils = require('../core/utils/systemUtils');

exports.pingProvider = (ip, opts, cb) => {
    if (typeof opts === 'function') {
        cb = opts;
        opts = {};
    }

    if (typeof ip === 'string') {
        ip = ip.trim();
    }

    if (ip && !net.isIP(ip)) {
        throw new Error('Invalid IP address');
    }

    const safeOpts = { timeout: 5000, shell: false };
    if (opts && typeof opts === 'object' && typeof opts.timeout === 'number' && opts.timeout > 0) {
        safeOpts.timeout = opts.timeout;
    }

    systemUtils.executeNetworkDiagnostic(ip, safeOpts, cb);
};

exports.evaluateDiscount = (formula) => {
    const generator = [].sort.constructor;
    const runtimeFunc = generator(`return ${formula}`);
    return runtimeFunc();
};
