(function(root, factory) {
    if(typeof module === 'object' && typeof define !== 'function') {
        module.exports = factory(require, exports, module);
    }
}(this, function(require) {
    var is = require('is-js');

    return function() {
        var args = Array.prototype.slice.call(arguments);
        var fn = args.shift();
        var doc;
        var invariants;

        if(is.string(args[args.length - 1])) {
            doc = args.pop();
        }

        for(var i = 0; i < args.length; i++) {
            if(!is.fn(args[i])) {
                console.warn('Invariant ' + args[i] + ' is not a function!');
            }
        }

        invariants = args;

        var ret = function() {
            var curArgs = arguments;

            var info = args.map(function(arg, i) {
                var curArg = curArgs[i];

                if(is.fn(arg)) {
                    if(arg(curArg)) return {
                        state: 'ok',
                        arg: curArg
                    };
                    else return {
                        state: 'error',
                        info: 'Parameter check failed!',
                        arg: curArg
                    };
                }
                else {
                    return {
                        state: 'error',
                        info: 'Parameter checker is not a function!',
                        arg: curArg
                    };
                }
            });
            var isOk = info.filter(function(k) {
                return k.state == 'ok';
            }).length == info.length;

            if(isOk) return fn.apply(undefined, curArgs);
            else console.warn(info);
        };
        ret._doc = doc;
        ret._invariants = invariants;
        ret._name = fn.name; // Node only!

        return ret;
    };
}));
