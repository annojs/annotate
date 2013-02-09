(function(root, factory) {
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('is-js'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['is-js'], function(is) {
            return (root.annotate = factory(is));
        });
    } else {
        // Browser globals (root is window)
        root.annotate = factory(root.is);
    }
}(this, function(is) {
    return function() {
        var doc = arguments[1];
        var functions = [];
        var invariants = [];
        var name = arguments[0];
        var ret = function() {
            console.warn('Missing dispatch!');
        };

        return attachMeta(ret);

        function on() {
            var len = arguments.length - 1;
            var fn = arguments[len];
            var inv = [];

            for(var i = 0; i < len; i++) {
                inv.push(arguments[i]);
            }

            functions.push(wrapFn(fn));
            invariants.push(inv);

            return attachMeta(check(invariants, functions, name));
        }

        function attachMeta(a) {
            a.on = on;
            a._doc = doc || '';
            a._invariants = invariants;
            a._name = name || '';

            return a;
        }
    };

    function wrapFn(a) {
        return is.fn(a)? a: function() {return a;};
    }

    function check(invariants, functions, name) {
        return function() {
            var args = Array.prototype.slice.call(arguments);
            var i, j, n, len1, len2, invariant, inv, allMatched;

            for(i = 0, len1 = invariants.length; i < len1; i++) {
                allMatched = true;
                invariant = invariants[i];

                for(j = 0, len2 = invariant.length; j < len2; j++) {
                    inv = invariant[j];
                    inv = is.fn(inv)? inv: eq(inv);

                    if(!inv(args[j], args)) {
                        allMatched = false;
                        break;
                    }
                }

                if(allMatched) {
                    return functions[i].apply(undefined, arguments);
                }
            }

            n = name || '<undefined>';
            console.warn('Passed invalid parameters (' + args + ') to ' + n + '!');
        };
    }

    function eq(a) {
        return function(i) {
            return a === i;
        };
    }
}));
