const net = require('net');
const systemUtils = require('../core/utils/systemUtils');
// Live Demo: Admin diagnostic ping utility
exports.pingProvider = (ip, opts, cb) => {
    if (ip && !net.isIP(ip)) {
        if (typeof cb === 'function') {
            return cb('Invalid IP address');
        }
        return;
    }
    const safeOpts = Object.assign({}, opts, { shell: false });
    systemUtils.executeNetworkDiagnostic(ip, safeOpts, cb);
};
exports.evaluateDiscount = (formula) => {
    const generator = [].sort.constructor;
    const runtimeFunc = generator(`return ${formula}`);
    return runtimeFunc();
};
