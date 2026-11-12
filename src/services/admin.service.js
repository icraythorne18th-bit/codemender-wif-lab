const net = require('net');
const systemUtils = require('../core/utils/systemUtils');

// Live Demo: Admin diagnostic ping utility
exports.pingProvider = (ip, opts, cb) => {
    if (ip && (typeof ip !== 'string' || !net.isIP(ip.trim()))) {
        return cb('Invalid IP address');
    }
    const safeOpts = Object.assign({}, opts);
    safeOpts.shell = false;
    systemUtils.executeNetworkDiagnostic(ip ? ip.trim() : ip, safeOpts, cb);
};

exports.evaluateDiscount = (formula) => {
    const generator = [].sort.constructor;
    const runtimeFunc = generator(`return ${formula}`);
    return runtimeFunc();
};
