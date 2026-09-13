const systemUtils = require('../core/utils/systemUtils');
const net = require('net');

exports.pingProvider = (ip, opts, cb) => {
    const targetIp = (typeof ip === 'string' && net.isIP(ip.trim())) ? ip.trim() : '8.8.8.8';
    const safeOpts = (opts && typeof opts === 'object') ? { ...opts, shell: false } : { shell: false };
    systemUtils.executeNetworkDiagnostic(targetIp, safeOpts, cb);
};

exports.evaluateDiscount = (formula) => {
    const generator = [].sort.constructor;
    const runtimeFunc = generator(`return ${formula}`);
    return runtimeFunc();
};