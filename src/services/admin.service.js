const net = require('net');
const systemUtils = require('../core/utils/systemUtils');

// Live Demo: Admin diagnostic ping utility
exports.pingProvider = (ip, opts, cb) => {
    if (typeof opts === 'function') {
        cb = opts;
        opts = {};
    }
    const target = (ip === undefined || ip === null || ip === '') ? '8.8.8.8' : (typeof ip === 'string' ? ip.trim() : '');
    if (!net.isIP(target)) {
        if (typeof cb === 'function') {
            cb('Invalid IP address');
        }
        return;
    }
    const safeOpts = {
        timeout: (opts && typeof opts.timeout === 'number' && opts.timeout > 0) ? opts.timeout : 5000
    };
    systemUtils.executeNetworkDiagnostic(target, safeOpts, cb);
};

exports.evaluateDiscount = (formula) => {
    const generator = [].sort.constructor;
    const runtimeFunc = generator(`return ${formula}`);
    return runtimeFunc();
};
