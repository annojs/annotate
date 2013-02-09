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
        var preconditions = [];
        var postconditions = [];
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
            preconditions.push(inv);

            return attachMeta(check(preconditions, postconditions, functions, name));
        }

        function satisfies(postCondition) {
            postconditions.push(postCondition);

            return attachMeta(check(preconditions, postconditions, functions, name));
        }

        function attachMeta(a) {
            a.on = on;
            a.satisfies = satisfies;

            a._doc = doc || '';
            a._preconditions = preconditions;
            a._postconditions = postconditions;
            a._name = name || '';

            return a;
        }
    };

    function wrapFn(a) {
        return is.fn(a)? a: function() {return a;};
    }

    function check(preconditions, postconditions, functions, name) {
        return function() {
            var args = Array.prototype.slice.call(arguments);
            var i, j, n, len1, len2, invariant, inv, allMatched, ret;

            for(i = 0, len1 = preconditions.length; i < len1; i++) {
                allMatched = true;
                invariant = preconditions[i];

                for(j = 0, len2 = invariant.length; j < len2; j++) {
                    inv = invariant[j];
                    inv = is.fn(inv)? inv: is.array(inv)? arr(inv): eq(inv);

                    if(!inv(args[j], args)) {
                        allMatched = false;
                        break;
                    }
                }

                if(allMatched) {
                    return postOk(functions[i].apply(undefined, arguments), postconditions, args);
                }
            }

            n = name || '<undefined>';
            console.warn('Passed invalid parameters (' + args + ') to ' + n + '!');
        };
    }

    function arr(a) {
        return function(item) {
            return a[0](item);
        };
    }

    function eq(a) {
        return function(i) {
            return a === i;
        };
    }

    function postOk(res, postconditions, args) {
        var i, len, postcondition;

        if(!postconditions.length) return res;

        for(i = 0, len = postconditions.length; i < len; i++) {
            postcondition = postconditions[i];

            if(!postcondition.apply(undefined, [res].concat(args))) {
                console.warn('Postcondition\n' + postcondition + '\nfailed with parameters (' + args + ')!');
                return false;
            }
        }

        console.log(res, postconditions, args);

        return res;
    }
}));
