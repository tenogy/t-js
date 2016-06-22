(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.tjs = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "jquery"], factory);
    }
})(function (require, exports) {
    "use strict";
    var $ = (typeof window !== "undefined" ? window['jquery'] : typeof global !== "undefined" ? global['jquery'] : null);
    var AjaxService = (function () {
        function AjaxService(config) {
            this.config = config;
            this.loading = false;
        }
        AjaxService.prototype.execute = function () {
            this.loading = true;
            var options = {
                url: this.config.url,
                type: "POST",
                data: this.config.data,
                contentType: null,
                dataType: null,
                headers: { RequestVerificationToken: null }
            };
            if (this.config.json) {
                options.contentType = "application/json";
                options.data = JSON.stringify(this.config.data);
                options.dataType = "json";
            }
            this.jqxhr = $.ajax(options).done($.proxy(this.success, this)).fail($.proxy(this.failure, this));
        };
        AjaxService.prototype.runCallback = function (data, textStatus, jqxhr) {
            if (this.config.callback) {
                var scope = this.config.scope || this;
                this.config.callback.apply(scope, arguments);
            }
            this.loading = false;
        };
        AjaxService.prototype.success = function (data, textStatus, jqxhr) {
            if (data.redirect && !this.config.ignoreRedirect) {
                window.location = data.redirect;
                return;
            }
            this.runCallback(data, textStatus, jqxhr);
        };
        AjaxService.prototype.failure = function (jqxhr, textStatus) {
            this.runCallback(null, textStatus, jqxhr);
        };
        AjaxService.prototype.abort = function () {
            if (!this.loading)
                return;
            try {
                this.jqxhr.abort();
            }
            catch (e) { }
        };
        return AjaxService;
    }());
    exports.AjaxService = AjaxService;
    function ajax(config) {
        var service = new AjaxService(config);
        service.execute();
        return service;
    }
    exports.ajax = ajax;
    var AjaxServices = (function () {
        function AjaxServices(serviceEndpoints) {
            var target = this;
            for (var endpointName in serviceEndpoints) {
                target[endpointName] = createServiceMethod(serviceEndpoints[endpointName]);
            }
        }
        return AjaxServices;
    }());
    exports.AjaxServices = AjaxServices;
    function createServiceMethod(endpoint) {
        return function (parameters, callback, context) {
            if (context != null) {
                callback = callback.bind(context);
            }
            return ajax({ url: endpoint, json: true, data: parameters, callback: callback });
        };
    }
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./utils", "./ajax", "./ko/ko-utils", "./ko/core/baseBinding", "./ko/bindings/aliasBinding", "./ko/bindings/enterBinding", "./ko/bindings/alertPanelBinding", "./ko/bindings/spinBinding", "./ko/alert", "./ko/loadingProgress", "./lists/sort", "./lists/sortBinding", "./lists/sortRule", "./lists/listPaging", "./lists/listWithServerHtml"], factory);
    }
})(function (require, exports) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(require("./utils"));
    __export(require("./ajax"));
    __export(require("./ko/ko-utils"));
    __export(require("./ko/core/baseBinding"));
    __export(require("./ko/bindings/aliasBinding"));
    __export(require("./ko/bindings/enterBinding"));
    __export(require("./ko/bindings/alertPanelBinding"));
    __export(require("./ko/bindings/spinBinding"));
    __export(require("./ko/alert"));
    __export(require("./ko/loadingProgress"));
    __export(require("./lists/sort"));
    __export(require("./lists/sortBinding"));
    __export(require("./lists/sortRule"));
    __export(require("./lists/listPaging"));
    __export(require("./lists/listWithServerHtml"));
});
},{"./ajax":1,"./ko/alert":3,"./ko/bindings/alertPanelBinding":4,"./ko/bindings/aliasBinding":5,"./ko/bindings/enterBinding":6,"./ko/bindings/spinBinding":7,"./ko/core/baseBinding":8,"./ko/ko-utils":9,"./ko/loadingProgress":10,"./lists/listPaging":11,"./lists/listWithServerHtml":12,"./lists/sort":13,"./lists/sortBinding":14,"./lists/sortRule":15,"./utils":16}],3:[function(require,module,exports){
(function (global){
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "knockout"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ko = (typeof window !== "undefined" ? window['knockout'] : typeof global !== "undefined" ? global['knockout'] : null);
    var AlertMessage = (function () {
        function AlertMessage(message, caption, shown, type) {
            if (message === void 0) { message = ""; }
            if (caption === void 0) { caption = ""; }
            if (shown === void 0) { shown = false; }
            if (type === void 0) { type = ""; }
            this.type = ko.observable(message);
            this.shown = ko.observable(shown);
            this.caption = ko.observable(caption);
            this.message = ko.observable(type);
        }
        AlertMessage.prototype.typeClass = function () {
            return "alert-" + this.type();
        };
        AlertMessage.prototype.hide = function () {
            this.shown(false);
        };
        AlertMessage.prototype.show = function (message, caption, type) {
            if (!message && !caption)
                return;
            this.message(message);
            this.caption(caption);
            this.type(type);
            this.shown(true);
        };
        AlertMessage.prototype.showError = function (message, caption) {
            this.show(message, caption, "danger");
        };
        return AlertMessage;
    }());
    exports.AlertMessage = AlertMessage;
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],4:[function(require,module,exports){
(function (global){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "knockout", "./../core/baseBinding"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ko = (typeof window !== "undefined" ? window['knockout'] : typeof global !== "undefined" ? global['knockout'] : null);
    var baseBinding_1 = require("./../core/baseBinding");
    var AlertPanelBinding = (function (_super) {
        __extends(AlertPanelBinding, _super);
        function AlertPanelBinding() {
            _super.apply(this, arguments);
        }
        AlertPanelBinding.prototype.init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            element.innerHTML = "<div class=\"alert\" data-bind=\"visible: shown, css: typeClass()\">" +
                "<button type=\"button\" class=\"close\" data-bind=\"click: hide\"><span>&times;</span></button>" +
                "<strong data-bind=\"text: caption\"></strong> " +
                "<span data-bind=\"text: message\"></span>" +
                "</div>";
            var alertMessage = _super.prototype.unwrap.call(this, valueAccessor());
            ko.applyBindingsToDescendants(alertMessage, element);
            return { controlsDescendantBindings: true };
        };
        return AlertPanelBinding;
    }(baseBinding_1.BaseBinding));
    exports.AlertPanelBinding = AlertPanelBinding;
    baseBinding_1.BaseBinding.register("alertPanel", AlertPanelBinding);
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../core/baseBinding":8}],5:[function(require,module,exports){
(function (global){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "jquery", "./../core/baseBinding"], factory);
    }
})(function (require, exports) {
    "use strict";
    var $ = (typeof window !== "undefined" ? window['jquery'] : typeof global !== "undefined" ? global['jquery'] : null);
    var baseBinding_1 = require("./../core/baseBinding");
    var AliasBinding = (function (_super) {
        __extends(AliasBinding, _super);
        function AliasBinding() {
            _super.apply(this, arguments);
        }
        AliasBinding.prototype.update = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var aliases = valueAccessor();
            if (!$.isArray(aliases)) {
                aliases = [aliases];
            }
            aliases.foreach(function (alias) {
                if (alias.name == null || alias.name.length === 0) {
                    throw "Alias name is not specified.";
                }
                if (alias.data == null) {
                    throw "Data is not specified for the '" + alias.name + "' alias.";
                }
                bindingContext[alias.name] = alias.data;
            });
        };
        return AliasBinding;
    }(baseBinding_1.BaseBinding));
    exports.AliasBinding = AliasBinding;
    baseBinding_1.BaseBinding.register("alias", AliasBinding, true);
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../core/baseBinding":8}],6:[function(require,module,exports){
(function (global){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "jquery", "./../core/baseBinding"], factory);
    }
})(function (require, exports) {
    "use strict";
    var $ = (typeof window !== "undefined" ? window['jquery'] : typeof global !== "undefined" ? global['jquery'] : null);
    var baseBinding_1 = require("./../core/baseBinding");
    var EnterBinding = (function (_super) {
        __extends(EnterBinding, _super);
        function EnterBinding() {
            _super.apply(this, arguments);
        }
        EnterBinding.prototype.init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var _this = this;
            $(element).keypress(function (event) {
                var code = event.keyCode || event.which;
                if (code != 13)
                    return;
                var handler = _super.prototype.unwrap.call(_this, valueAccessor());
                $(element).blur();
                handler.call(viewModel);
                event.preventDefault();
            });
        };
        return EnterBinding;
    }(baseBinding_1.BaseBinding));
    exports.EnterBinding = EnterBinding;
    baseBinding_1.BaseBinding.register("enter", EnterBinding, true);
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../core/baseBinding":8}],7:[function(require,module,exports){
(function (global){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "knockout", "./../core/baseBinding", "./../../utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ko = (typeof window !== "undefined" ? window['knockout'] : typeof global !== "undefined" ? global['knockout'] : null);
    var baseBinding_1 = require("./../core/baseBinding");
    var utils_1 = require("./../../utils");
    var SpinBinding = (function (_super) {
        __extends(SpinBinding, _super);
        function SpinBinding() {
            _super.apply(this, arguments);
        }
        SpinBinding.prototype.update = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var show = _super.prototype.unwrap.call(this, valueAccessor());
            var spinOptions = _super.prototype.unwrap.call(this, allBindingsAccessor ? allBindingsAccessor.get("spinOptions") : {}) || {};
            var $el = element;
            if (show) {
                setTimeout(function () {
                    return showSpinner($el, spinOptions);
                }, 1);
                return;
            }
            var spin = ko.utils.domData.get(element, "spin");
            if (spin) {
                spin.stop();
            }
        };
        return SpinBinding;
    }(baseBinding_1.BaseBinding));
    exports.SpinBinding = SpinBinding;
    function showSpinner(element, options) {
        var spinOptions = {
            lines: 13,
            length: 28,
            width: 14,
            radius: 42,
            scale: 0.25,
            corners: 1,
            color: '#000',
            opacity: 0.25,
            rotate: 0,
            direction: 1,
            speed: 1,
            trail: 60,
            fps: 20,
            zIndex: 2e9,
            className: 'spinner',
            top: '0',
            left: '50%',
            shadow: false,
            hwaccel: false,
            position: 'relative'
        };
        spinOptions = utils_1.Utils.extend(options, spinOptions);
        var spin = ko.utils.domData.get(element, "spin");
        if (!spin) {
            spin = new Spinner(spinOptions);
            ko.utils.domData.set(element, "spin", spin);
        }
        spin.spin(element);
    }
    baseBinding_1.BaseBinding.register("spin", SpinBinding);
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../../utils":16,"./../core/baseBinding":8}],8:[function(require,module,exports){
(function (global){
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "knockout"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ko = (typeof window !== "undefined" ? window['knockout'] : typeof global !== "undefined" ? global['knockout'] : null);
    var BaseBinding = (function () {
        function BaseBinding() {
        }
        BaseBinding.prototype.init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        };
        BaseBinding.prototype.update = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        };
        BaseBinding.prototype.preprocess = function (value, name, addBindingCallback) {
            return value;
        };
        BaseBinding.prototype.unwrap = function (value) {
            if (value == null)
                return null;
            return ko.utils.unwrapObservable(value);
        };
        BaseBinding.register = function (bindingName, bindingType, supportsVirtualElements) {
            ko.bindingHandlers[bindingName] = new bindingType();
            if (supportsVirtualElements) {
                ko.virtualElements.allowedBindings[bindingName] = true;
            }
        };
        return BaseBinding;
    }());
    exports.BaseBinding = BaseBinding;
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],9:[function(require,module,exports){
(function (global){
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "knockout"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ko = (typeof window !== "undefined" ? window['knockout'] : typeof global !== "undefined" ? global['knockout'] : null);
    var markTemplate = "$ko$computed";
    function computed(target, propertyKey, descriptor) {
        var method = target[propertyKey];
        var mark = { name: propertyKey, read: method };
        method[markTemplate] = mark;
        return method;
    }
    exports.computed = computed;
    function registerComputed(target) {
        var original = target;
        var constructor = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            registerComputedMethods(this);
            return original.apply(this, args);
        };
        constructor.prototype = original.prototype;
        return constructor;
    }
    exports.registerComputed = registerComputed;
    function registerComputedMethods(target) {
        var dependentObservables = {};
        for (var memberName in target) {
            var member = target[memberName];
            if (!(member instanceof Function))
                continue;
            var computedMember = member[markTemplate];
            if (computedMember == undefined)
                continue;
            if (computedMember.name == null)
                computedMember.name = memberName;
            var registeredDependentObservable = dependentObservables[computedMember.name];
            if (registeredDependentObservable == null) {
                dependentObservables[computedMember.name] = computedMember;
            }
            else {
                if (computedMember.read != null) {
                    registeredDependentObservable.read = computedMember.read;
                }
                if (computedMember.write != null) {
                    registeredDependentObservable.write = computedMember.write;
                }
            }
        }
        var orderedDependentObservables = [];
        for (var name in dependentObservables) {
            orderedDependentObservables.push(dependentObservables[name]);
        }
        orderedDependentObservables.sort(function (x, y) { return (x.orderIndex - y.orderIndex); });
        for (var i = 0; i < orderedDependentObservables.length; ++i) {
            var dependentObservable = orderedDependentObservables[i];
            if (dependentObservable.read == null) {
                throw "Computed observable '" + dependentObservable.name + "' is incorrectly defined.";
            }
            target[dependentObservable.name] = ko.pureComputed(dependentObservable.read, target);
            if (dependentObservable.extenders) {
                target[dependentObservable.name].extend(dependentObservable.extenders);
            }
        }
    }
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],10:[function(require,module,exports){
(function (global){
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "knockout", "./ko-utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ko = (typeof window !== "undefined" ? window['knockout'] : typeof global !== "undefined" ? global['knockout'] : null);
    var ko_utils_1 = require("./ko-utils");
    var LoadingProgress = (function () {
        function LoadingProgress(options) {
            var _this = this;
            this.options = options;
            this.loading = ko.observable(false);
            this.options = this.options || { delay: 800, noWaitMessage: null, waitMessage: null };
            var delay = this.options.delay;
            if (delay == null)
                delay = 800;
            this.loadingDelayed = ko.observable(false);
            ko.pureComputed(this.loading)
                .extend({ rateLimit: delay })
                .subscribe(function () {
                _this.loadingDelayed(_this.loading());
            }, this);
        }
        LoadingProgress.prototype.isVisible = function () {
            return this.loading() && this.loadingDelayed();
        };
        LoadingProgress.prototype.start = function () {
            this.loading(true);
        };
        LoadingProgress.prototype.stop = function () {
            this.loading(false);
        };
        LoadingProgress.prototype.running = function () {
            return this.loading();
        };
        LoadingProgress.prototype.hasWaitMessage = function () {
            return !this.options.noWaitMessage;
        };
        LoadingProgress.prototype.waitMessage = function () {
            return this.options.waitMessage;
        };
        __decorate([
            ko_utils_1.computed, 
            __metadata('design:type', Function), 
            __metadata('design:paramtypes', []), 
            __metadata('design:returntype', void 0)
        ], LoadingProgress.prototype, "isVisible", null);
        __decorate([
            ko_utils_1.computed, 
            __metadata('design:type', Function), 
            __metadata('design:paramtypes', []), 
            __metadata('design:returntype', void 0)
        ], LoadingProgress.prototype, "running", null);
        __decorate([
            ko_utils_1.computed, 
            __metadata('design:type', Function), 
            __metadata('design:paramtypes', []), 
            __metadata('design:returntype', void 0)
        ], LoadingProgress.prototype, "waitMessage", null);
        LoadingProgress = __decorate([
            ko_utils_1.registerComputed, 
            __metadata('design:paramtypes', [Object])
        ], LoadingProgress);
        return LoadingProgress;
    }());
    exports.LoadingProgress = LoadingProgress;
    if (!ko.components.isRegistered("loading-progress")) {
        ko.components.register("loading-progress", {
            viewModel: {
                createViewModel: function (params) {
                    return params.controller;
                }
            },
            template: "<div class=\"loading-progress\" data-bind=\"visible: isVisible\">\r\n\t<div class=\"spinner-container\" data-bind=\"spin: isVisible\"></div>\r\n\t<div class=\"message-container\" data-bind=\"visible: hasWaitMessage\">\r\n\t\t<div class=\"message\" data-bind=\"text: waitMessage\"></div>\r\n\t</div>\r\n</div>"
        });
    }
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./ko-utils":9}],11:[function(require,module,exports){
(function (global){
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "knockout", "./../ko/ko-utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ko = (typeof window !== "undefined" ? window['knockout'] : typeof global !== "undefined" ? global['knockout'] : null);
    var ko_utils_1 = require("./../ko/ko-utils");
    var ListPaging = (function () {
        function ListPaging(paging, gotoPageHandler) {
            this.paging = ko.isObservable(paging) ?
                ko.computed(function () { return normalizePaging.call(this, paging() || []); }, this) :
                normalizePaging.call(this, paging || []);
            if (!ko.isObservable(this.paging))
                this.paging = ko.observable(this.paging);
            this.gotoPageHandler = gotoPageHandler;
        }
        ListPaging.prototype.needShow = function () {
            return this.paging().length > 1;
        };
        ListPaging.prototype.gotoPage = function (page) {
            if (page.active)
                return;
            if (this.gotoPageHandler == null) {
                throw "gotoPageHandler is not specified for the paging.";
            }
            this.gotoPageHandler(page.index);
        };
        __decorate([
            ko_utils_1.computed, 
            __metadata('design:type', Function), 
            __metadata('design:paramtypes', []), 
            __metadata('design:returntype', void 0)
        ], ListPaging.prototype, "needShow", null);
        ListPaging = __decorate([
            ko_utils_1.registerComputed, 
            __metadata('design:paramtypes', [Object, Object])
        ], ListPaging);
        return ListPaging;
    }());
    exports.ListPaging = ListPaging;
    function normalizePaging(pagingItems) {
        return pagingItems.map(function (page) { return ({
            index: page.index || page.Index,
            caption: page.caption || page.Caption,
            active: page.active || page.Active
        }); });
    }
    ;
    if (!ko.components.isRegistered("list-paging")) {
        ko.components.register("list-paging", {
            viewModel: { createViewModel: function (params) { return new ListPaging(params.paging, params.gotoPageHandler); } },
            template: "<div class=\"list-paging\" data-bind=\"visible: needShow, foreach: paging\">\r\n\t<a href=\"#\" class=\"btn\" data-bind=\"text: caption, click: $parent.gotoPage.bind($parent, $data), css: {'btn-primary': active, 'btn-default': !active}\"></a>\r\n</div>\r\n"
        });
    }
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../ko/ko-utils":9}],12:[function(require,module,exports){
(function (global){
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "knockout"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ko = (typeof window !== "undefined" ? window['knockout'] : typeof global !== "undefined" ? global['knockout'] : null);
    var ListWithServerHtml = (function () {
        function ListWithServerHtml(items, html, paging, options) {
            options = options || {};
            this.items = ko.observable(items || []);
            this.itemsHtml = ko.observable(html || "");
            this.paging = ko.observable(paging || []);
            this.gotoPageHandler = options.gotoPageHandler;
        }
        return ListWithServerHtml;
    }());
    exports.ListWithServerHtml = ListWithServerHtml;
    if (!ko.components.isRegistered("list-with-server-html")) {
        ko.components.register("list-with-server-html", {
            viewModel: {
                createViewModel: function (params) {
                    return ko.isObservable(params.list) ?
                        ko.pureComputed(function () { return (params.list() || new ListWithServerHtml()); }, null) :
                        params.list || new ListWithServerHtml();
                }
            },
            template: "<!-- ko with: items -->\r\n<div class=\"list-items\" data-bind=\"html: $parent.itemsHtml\"></div>\r\n<!-- /ko -->\r\n<list-paging params=\"paging: paging, gotoPageHandler: gotoPageHandler\"></list-paging>\r\n"
        });
    }
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],13:[function(require,module,exports){
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    (function (SortDirection) {
        SortDirection[SortDirection["asc"] = 1] = "asc";
        SortDirection[SortDirection["desc"] = 2] = "desc";
    })(exports.SortDirection || (exports.SortDirection = {}));
    var SortDirection = exports.SortDirection;
});
},{}],14:[function(require,module,exports){
(function (global){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "knockout", "jquery", "./../ko/core/baseBinding", "./sort"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ko = (typeof window !== "undefined" ? window['knockout'] : typeof global !== "undefined" ? global['knockout'] : null);
    var $ = (typeof window !== "undefined" ? window['jquery'] : typeof global !== "undefined" ? global['jquery'] : null);
    var baseBinding_1 = require("./../ko/core/baseBinding");
    var sort_1 = require("./sort");
    var SortBinding = (function (_super) {
        __extends(SortBinding, _super);
        function SortBinding() {
            _super.apply(this, arguments);
        }
        SortBinding.prototype.init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var $element = $(element);
            var $controller = $element;
            var options = allBindingsAccessor();
            var sortType = options.sortType;
            var controllerElementSelector = options.parentController;
            if (controllerElementSelector != null) {
                $controller = $element.parent(controllerElementSelector);
            }
            var sortRule = _super.prototype.unwrap.call(this, valueAccessor());
            var vm = ko.observable(sortRule);
            ko.utils.domData.set(element, "vm", vm);
            $controller.addClass("sort");
            function sortRuleChanged() {
                var sr = vm();
                $controller.removeClass("sort-none sort-asc sort-desc");
                var direction = sr.direction();
                var newClass;
                if (sr.type() === sortType)
                    newClass = direction === sort_1.SortDirection.asc ? "sort-asc" : (direction === sort_1.SortDirection.desc ? "sort-desc" : "sort-none");
                else
                    newClass = "sort-none";
                $controller.addClass(newClass);
            }
            function clickHandler() {
                var sr = vm();
                var direction = sr.direction();
                var newDirection;
                if (sr.type() === sortType) {
                    newDirection = direction === sort_1.SortDirection.asc ? sort_1.SortDirection.desc : sort_1.SortDirection.asc;
                }
                else {
                    newDirection = sort_1.SortDirection.asc;
                    sr.type(sortType);
                }
                sr.direction(newDirection);
            }
            function viewModelChanged(sr) {
                if (sr == null)
                    return;
                sr.subscribe(sortRuleChanged);
                $controller.unbind("click", clickHandler);
                $controller.click(clickHandler);
            }
            sortRule.subscribe(sortRuleChanged);
            vm.subscribe(viewModelChanged);
            $element.html("<div class=\"arrow-desc\"></div><div class=\"arrow-asc\"></div>");
            ko.applyBindingsToDescendants(vm, element);
            viewModelChanged(sortRule);
            sortRuleChanged();
            return { controlsDescendantBindings: true };
        };
        SortBinding.prototype.update = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var sortRule = _super.prototype.unwrap.call(this, valueAccessor());
            var vm = ko.utils.domData.get(element, "vm");
            if (vm) {
                vm(sortRule);
            }
        };
        return SortBinding;
    }(baseBinding_1.BaseBinding));
    exports.SortBinding = SortBinding;
    baseBinding_1.BaseBinding.register("sort", SortBinding);
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../ko/core/baseBinding":8,"./sort":13}],15:[function(require,module,exports){
(function (global){
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "knockout", "rx", "./sort"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ko = (typeof window !== "undefined" ? window['knockout'] : typeof global !== "undefined" ? global['knockout'] : null);
    var Rx = (typeof window !== "undefined" ? window['rx'] : typeof global !== "undefined" ? global['rx'] : null);
    var sort_1 = require("./sort");
    var SortRule = (function () {
        function SortRule(type, direction) {
            this.type = ko.observable(type || null);
            this.direction = ko.observable(direction || sort_1.SortDirection.asc);
        }
        SortRule.prototype.subscribe = function (handler, context) {
            var components = [this.type, this.direction];
            var changes = Rx.Observable.create(function (observer) {
                for (var _i = 0, components_1 = components; _i < components_1.length; _i++) {
                    var component = components_1[_i];
                    component.subscribe(function (v) { observer.onNext(v); }, null, null);
                }
            });
            changes.debounce(10).subscribe(handler, context);
        };
        SortRule.prototype.toModel = function (options) {
            var type = this.type();
            var direction = this.direction();
            return {
                Type: type == null ? options.defaultType : type,
                Direction: direction == null ? options.defaultDirection : direction
            };
        };
        return SortRule;
    }());
    exports.SortRule = SortRule;
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./sort":13}],16:[function(require,module,exports){
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Utils = (function () {
        function Utils() {
        }
        Utils.uuid = function () {
            var i;
            var random;
            var uuid = "";
            for (i = 0; i < 32; i++) {
                random = Math.random() * 16 | 0;
                if (i === 8 || i === 12 || i === 16 || i === 20) {
                    uuid += "-";
                }
                uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
                    .toString(16);
            }
            return uuid;
        };
        Utils.pluralize = function (count, word) {
            return count === 1 ? word : word + "s";
        };
        Utils.store = function (namespace, data) {
            if (data) {
                return localStorage.setItem(namespace, JSON.stringify(data));
            }
            var store = localStorage.getItem(namespace);
            return (store && JSON.parse(store)) || [];
        };
        Utils.extend = function () {
            var objs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                objs[_i - 0] = arguments[_i];
            }
            var newObj = {};
            for (var i = 0; i < objs.length; i++) {
                var obj = objs[i];
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        newObj[key] = obj[key];
                    }
                }
            }
            return newObj;
        };
        return Utils;
    }());
    exports.Utils = Utils;
});
},{}]},{},[2])(2)
});


//# sourceMappingURL=t-js.js.map
