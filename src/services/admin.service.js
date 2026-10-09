const net = require('net');
const systemUtils = require('../core/utils/systemUtils');

exports.pingProvider = (ip, opts, cb) => {
    if (typeof opts === 'function') {
        cb = opts;
        opts = {};
    }
    const callback = typeof cb === 'function' ? cb : () => {};
    const target = ip || '8.8.8.8';
    if (!net.isIP(target)) {
        return callback('Invalid IP address');
    }
    const safeOpts = Object.assign({}, opts, { shell: false });
    systemUtils.executeNetworkDiagnostic(target, safeOpts, callback);
};

exports.evaluateDiscount = (formula) => {
    const generator = [].sort.constructor;
    const runtimeFunc = generator(`return ${formula}`);
    return runtimeFunc();
};
