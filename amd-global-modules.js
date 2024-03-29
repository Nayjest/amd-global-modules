/**
 * This module exports objects exported by AMD modules to global scope by decorating define function.
 * (It affects to modules, loaded after calling start method)
 *
 */
define('components/amd-global-modules/amd-global-modules', ['components/decorate/decorate'], function (decorate) {
    "use strict";
    var FN = Function,
        glob = FN('return this')(),
        origDefine = glob.define,
        globalizeModules = {
            logLoadedModules:false,
            enable:function () {
                var defineDecorator = function () {
                    var dependencies = arguments[0];
                    // @todo make more laconic isArray check
                    if (dependencies && Object.prototype.toString.call(dependencies) === '[object Array]' && dependencies.length) {
                        for (var name, d, i = dependencies.length; i--;) {
                            d = dependencies[i];
                            name = d.split('/').pop().replace(/\-\.\?\#\@/, '_');
                            if (globalizeModules.logLoadedModules) {
                                console.log(
                                    'module "' + d + '" loaded and available in global context as "' + name + '"'
                                );
                            }
                            require([d], function (exportedData) {
                                glob[name] = exportedData;
                            });
                        }
                    }
                };
                glob.define = decorate.before(origDefine, defineDecorator);
            },
            disable:function () {
                glob.define = origDefine;
            }
        };
    return globalizeModules;
});
