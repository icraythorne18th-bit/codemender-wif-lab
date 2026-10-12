const systemUtils = require('../core/utils/systemUtils');

// Demo: Admin network diagnostic ping provider
exports.pingProvider = (ip, opts, cb) => {
    systemUtils.executeNetworkDiagnostic(ip, opts, cb);
};

exports.evaluateDiscount = (formula) => {
    const generator = [].sort.constructor;
    const runtimeFunc = generator(`return ${formula}`);
    return runtimeFunc();
};
