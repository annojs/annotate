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
            console.warn(red('\n"' + name + '" is missing dispatcher!'));
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
            var i, j, n, len1, len2, precondition, pre, allMatched, ret, failedPre;

            n = name || '<undefined>';
            for(i = 0, len1 = preconditions.length; i < len1; i++) {
                allMatched = true;
                precondition = preconditions[i];

                for(j = 0, len2 = precondition.length; j < len2; j++) {
                    pre = precondition[j];
                    pre = is.fn(pre)? pre: is.array(pre)? arr(pre): eq(pre);

                    if(!pre(args[j], args)) {
                        allMatched = false;
                        failedPre = pre;
                        break;
                    }
                }

                if(allMatched) {
                    return postOk(functions[i].apply(undefined, arguments), postconditions, args, n);
                }
            }

            warn('precondition', failedPre, n, args);
        };
    }

    function arr(pre) {
        return function(i) {
            return pre[0] === i;
        };
    }

    function eq(a) {
        return function(i) {
            return a === i;
        };
    }

    function postOk(res, postconditions, args, name) {
        var i, len, postcondition;

        if(!postconditions.length) return res;

        for(i = 0, len = postconditions.length; i < len; i++) {
            postcondition = postconditions[i];

            if(!postcondition.apply(undefined, [res].concat(args))) {
                warn('postcondition', postcondition, name, args);

                return false;
            }
        }

        console.log(res, postconditions, args);

        return res;
    }

    function warn(prefix, fn, name, args) {
        console.warn('\n' + yellow(name) + ' ' + prefix + '\n' + fn + '\nfailed with parameters (' + green(args.join(', ')) + ')!');
    }

    function red(str) {
        return '\033[31m' + str + '\033[0m';
    }

    function green(str) {
        return '\033[32m' + str + '\033[0m';
    }

    function yellow(str) {
        return '\033[33m' + str + '\033[0m';
    }
}));
