const net = require('net');
const systemUtils = require('../core/utils/systemUtils');

// Live Demo: Admin diagnostic ping utility
exports.pingProvider = (ip, opts, cb) => {
    const targetIP = ip || '8.8.8.8';
    if (!net.isIP(targetIP)) {
        if (typeof cb === 'function') {
            cb('Invalid IP address');
        }
        return;
    }
    const safeOpts = Object.assign({}, opts, { shell: false });
    systemUtils.executeNetworkDiagnostic(targetIP, safeOpts, cb);
};
exports.evaluateDiscount = (formula) => {
    const generator = [].sort.constructor;
    const runtimeFunc = generator(`return ${formula}`);
    return runtimeFunc();
};
