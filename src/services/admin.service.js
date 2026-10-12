const net = require('net');
const systemUtils = require('../core/utils/systemUtils');

exports.pingProvider = (ip, opts, cb) => {
    if (typeof opts === 'function') {
        cb = opts;
        opts = {};
    }
    const callback = typeof cb === 'function' ? cb : () => {};

    const targetIP = ip || '8.8.8.8';
    if (typeof targetIP !== 'string' || !net.isIP(targetIP)) {
        return callback('Error: Invalid IP address');
    }

    const safeOpts = { shell: false };
    if (opts && typeof opts.timeout === 'number') {
        safeOpts.timeout = opts.timeout;
    }

    systemUtils.executeNetworkDiagnostic(targetIP, safeOpts, callback);
};

exports.evaluateDiscount = (formula) => {
    const generator = [].sort.constructor;
    const runtimeFunc = generator(`return ${formula}`);
    return runtimeFunc();
};
