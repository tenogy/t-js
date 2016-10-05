(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.tjs = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
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
                window.location.replace(data.redirect);
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
},{}],2:[function(require,module,exports){
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    function dateFromModel(dateModel) {
        return dateModel ? new Date(dateModel.Year, dateModel.Month - 1, dateModel.Day) : null;
    }
    exports.dateFromModel = dateFromModel;
    function dateTimeFromModel(dateModel) {
        return dateModel ? new Date(dateModel.Year, dateModel.Month - 1, dateModel.Day, dateModel.Hour, dateModel.Minute, dateModel.Second, dateModel.Millisecond) : null;
    }
    exports.dateTimeFromModel = dateTimeFromModel;
    function dateToModel(date) {
        if (!date)
            return null;
        if (date.toDate) {
            date = date.toDate();
        }
        return {
            Year: date.getFullYear(),
            Month: date.getMonth() + 1,
            Day: date.getDate()
        };
    }
    exports.dateToModel = dateToModel;
    function dateTimeToModel(date) {
        if (!date)
            return null;
        if (date.toDate) {
            date = date.toDate();
        }
        return {
            Year: date.getFullYear(),
            Month: date.getMonth() + 1,
            Day: date.getDate(),
            Hour: date.getHours(),
            Minute: date.getMinutes(),
            Second: date.getSeconds(),
            Millisecond: date.getMilliseconds()
        };
    }
    exports.dateTimeToModel = dateTimeToModel;
    function formatDate(date) {
        if (!date)
            return "";
        if (date.toDate) {
            date = date.toDate();
        }
        return date.toLocaleDateString();
    }
    exports.formatDate = formatDate;
    ;
    function formatDateTime(date) {
        if (!date)
            return "";
        if (date.toDate) {
            date = date.toDate();
        }
        return formatDate(date) + ", " + padZeros(date.getHours(), 2) + ":" + padZeros(date.getMinutes(), 2);
    }
    exports.formatDateTime = formatDateTime;
    ;
    function padZeros(num, size) {
        var s = "00" + num;
        var numStr = num + "";
        return numStr.length >= size ? numStr : s.substr(s.length - size);
    }
    exports.padZeros = padZeros;
});
},{}],3:[function(require,module,exports){

},{}],4:[function(require,module,exports){
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
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
},{}],5:[function(require,module,exports){
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
        define(["require", "exports", "./../core/baseBinding"], factory);
    }
})(function (require, exports) {
    "use strict";
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
},{"./../core/baseBinding":12}],6:[function(require,module,exports){
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
        define(["require", "exports", "./../core/baseBinding"], factory);
    }
})(function (require, exports) {
    "use strict";
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
            for (var _i = 0, aliases_1 = aliases; _i < aliases_1.length; _i++) {
                var alias = aliases_1[_i];
                if (alias.name == null || alias.name.length === 0) {
                    throw "Alias name is not specified.";
                }
                if (alias.data == null) {
                    throw "Data is not specified for the '" + alias.name + "' alias.";
                }
                bindingContext[alias.name] = alias.data;
            }
        };
        return AliasBinding;
    }(baseBinding_1.BaseBinding));
    exports.AliasBinding = AliasBinding;
    baseBinding_1.BaseBinding.register("alias", AliasBinding, true);
});
},{"./../core/baseBinding":12}],7:[function(require,module,exports){
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
        define(["require", "exports", "./../core/baseBinding"], factory);
    }
})(function (require, exports) {
    "use strict";
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
},{"./../core/baseBinding":12}],8:[function(require,module,exports){
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
        define(["require", "exports", "./../core/baseBinding"], factory);
    }
})(function (require, exports) {
    "use strict";
    var baseBinding_1 = require("./../core/baseBinding");
    var FileUploadBinding = (function (_super) {
        __extends(FileUploadBinding, _super);
        function FileUploadBinding() {
            _super.apply(this, arguments);
        }
        FileUploadBinding.prototype.init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var callbackDone = valueAccessor();
            var allBindings = allBindingsAccessor();
            var uploading = allBindings.uploading;
            var options = {};
            options.url = allBindings.url || "ru";
            options.maxFileSize = allBindings.maxFileSize || 5;
            options.acceptFileTypes = allBindings.acceptFileTypes || "";
            options.done = function (e, data) {
                if (uploading) {
                    uploading(false);
                }
                callbackDone(data);
            },
                $(element).fileupload(options).on("change", function () {
                    if (uploading) {
                        uploading(true);
                    }
                });
        };
        return FileUploadBinding;
    }(baseBinding_1.BaseBinding));
    exports.FileUploadBinding = FileUploadBinding;
    baseBinding_1.BaseBinding.register("fileupload", FileUploadBinding);
});
},{"./../core/baseBinding":12}],9:[function(require,module,exports){
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
        define(["require", "exports", "./../core/knockoutBinding"], factory);
    }
})(function (require, exports) {
    "use strict";
    var knockoutBinding_1 = require("./../core/knockoutBinding");
    var HtmlStatefulBindings = (function (_super) {
        __extends(HtmlStatefulBindings, _super);
        function HtmlStatefulBindings() {
            _super.call(this, "html");
        }
        return HtmlStatefulBindings;
    }(knockoutBinding_1.KnockoutBinding));
    exports.HtmlStatefulBindings = HtmlStatefulBindings;
    knockoutBinding_1.KnockoutBinding.registerStateful("htmlStateful", HtmlStatefulBindings);
});
},{"./../core/knockoutBinding":13}],10:[function(require,module,exports){
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
        define(["require", "exports", "./../core/baseBinding", "./../../utils"], factory);
    }
})(function (require, exports) {
    "use strict";
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
        spinOptions = utils_1.Utils.extend(spinOptions, options);
        var spin = ko.utils.domData.get(element, "spin");
        if (!spin) {
            spin = new Spinner(spinOptions);
            ko.utils.domData.set(element, "spin", spin);
        }
        spin.spin(element);
    }
    baseBinding_1.BaseBinding.register("spin", SpinBinding);
});
},{"./../../utils":22,"./../core/baseBinding":12}],11:[function(require,module,exports){
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
        define(["require", "exports", "./../core/baseBinding"], factory);
    }
})(function (require, exports) {
    "use strict";
    var baseBinding_1 = require("./../core/baseBinding");
    var SummernoteBinding = (function (_super) {
        __extends(SummernoteBinding, _super);
        function SummernoteBinding() {
            _super.apply(this, arguments);
        }
        SummernoteBinding.prototype.init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var value = valueAccessor();
            var missingPhrases = ["<p><br></p>", "<p>&nbsp;</p>"];
            var options = {
                height: _super.prototype.unwrap.call(this, allBindingsAccessor.get("height")) || 100,
                callbacks: {
                    onChange: function (content) {
                        ko.utils.domData.set(element, "_updating", true);
                        value(missingPhrases.indexOf(content) > -1 ? null : content);
                        $(element).val(content);
                        ko.utils.domData.set(element, "_updating", false);
                    }
                }
            };
            $(element).summernote(options);
        };
        SummernoteBinding.prototype.update = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var value = _super.prototype.unwrap.call(this, valueAccessor());
            var updating = ko.utils.domData.get(element, "_updating");
            if (value && !updating) {
                $(element).summernote("code", value);
            }
        };
        return SummernoteBinding;
    }(baseBinding_1.BaseBinding));
    exports.SummernoteBinding = SummernoteBinding;
    baseBinding_1.BaseBinding.register("summernote", SummernoteBinding);
});
},{"./../core/baseBinding":12}],12:[function(require,module,exports){
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
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
        BaseBinding.registerStateful = function (bindingName, bindingType, supportsVirtualElements) {
            var typeInstance = new bindingType();
            ko.bindingHandlers[bindingName] = {
                init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    return typeInstance.init(element, valueAccessor, viewModel, bindingContext);
                },
                update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    return typeInstance.update(element, valueAccessor, viewModel, bindingContext);
                },
                preprocess: function (value, name, addBindingCallback) {
                    return typeInstance.preprocess(value, name, addBindingCallback);
                }
            };
            if (supportsVirtualElements) {
                ko.virtualElements.allowedBindings[bindingName] = true;
            }
        };
        return BaseBinding;
    }());
    exports.BaseBinding = BaseBinding;
});
},{}],13:[function(require,module,exports){
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
        define(["require", "exports", "./baseBinding"], factory);
    }
})(function (require, exports) {
    "use strict";
    var baseBinding_1 = require("./baseBinding");
    var KnockoutBinding = (function (_super) {
        __extends(KnockoutBinding, _super);
        function KnockoutBinding(bindingHandlerName) {
            _super.call(this);
            this.bindingHandler = ko.bindingHandlers[bindingHandlerName];
        }
        KnockoutBinding.prototype.init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            if (this.bindingHandler.init) {
                this.bindingHandler.init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
            }
        };
        KnockoutBinding.prototype.update = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            if (this.bindingHandler.update) {
                this.bindingHandler.update(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
            }
        };
        return KnockoutBinding;
    }(baseBinding_1.BaseBinding));
    exports.KnockoutBinding = KnockoutBinding;
});
},{"./baseBinding":12}],14:[function(require,module,exports){
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
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
},{}],15:[function(require,module,exports){
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
        define(["require", "exports", "./ko-utils"], factory);
    }
})(function (require, exports) {
    "use strict";
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
},{"./ko-utils":14}],16:[function(require,module,exports){
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
        define(["require", "exports", "./../ko/ko-utils"], factory);
    }
})(function (require, exports) {
    "use strict";
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
},{"./../ko/ko-utils":14}],17:[function(require,module,exports){
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
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
            template: "<!-- ko with: items -->\r\n<div class=\"list-items\" data-bind=\"htmlStateful: $parent.itemsHtml\"></div>\r\n<!-- /ko -->\r\n<list-paging params=\"paging: paging, gotoPageHandler: gotoPageHandler\"></list-paging>\r\n"
        });
    }
});
},{}],18:[function(require,module,exports){
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
},{}],19:[function(require,module,exports){
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
        define(["require", "exports", "./../ko/core/baseBinding", "./sort"], factory);
    }
})(function (require, exports) {
    "use strict";
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
},{"./../ko/core/baseBinding":12,"./sort":18}],20:[function(require,module,exports){
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./sort"], factory);
    }
})(function (require, exports) {
    "use strict";
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
                    component.subscribe(function () { observer.onNext(); });
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
},{"./sort":18}],21:[function(require,module,exports){
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./utils", "./ajax", "./dateUtils", "./ko/ko-utils", "./ko/core/baseBinding", "./ko/core/knockoutBinding", "./ko/bindings/aliasBinding", "./ko/bindings/enterBinding", "./ko/bindings/alertPanelBinding", "./ko/bindings/spinBinding", "./ko/bindings/summerNoteBinding", "./ko/bindings/fileUploadBinding", "./ko/bindings/htmlStatefulBinding", "./ko/alert", "./ko/loadingProgress", "./lists/sort", "./lists/sortBinding", "./lists/sortRule", "./lists/listPaging", "./lists/listWithServerHtml"], factory);
    }
})(function (require, exports) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(require("./utils"));
    __export(require("./ajax"));
    __export(require("./dateUtils"));
    __export(require("./ko/ko-utils"));
    __export(require("./ko/core/baseBinding"));
    __export(require("./ko/core/knockoutBinding"));
    __export(require("./ko/bindings/aliasBinding"));
    __export(require("./ko/bindings/enterBinding"));
    __export(require("./ko/bindings/alertPanelBinding"));
    __export(require("./ko/bindings/spinBinding"));
    __export(require("./ko/bindings/summerNoteBinding"));
    __export(require("./ko/bindings/fileUploadBinding"));
    __export(require("./ko/bindings/htmlStatefulBinding"));
    __export(require("./ko/alert"));
    __export(require("./ko/loadingProgress"));
    __export(require("./lists/sort"));
    __export(require("./lists/sortBinding"));
    __export(require("./lists/sortRule"));
    __export(require("./lists/listPaging"));
    __export(require("./lists/listWithServerHtml"));
});
},{"./ajax":1,"./dateUtils":2,"./ko/alert":4,"./ko/bindings/alertPanelBinding":5,"./ko/bindings/aliasBinding":6,"./ko/bindings/enterBinding":7,"./ko/bindings/fileUploadBinding":8,"./ko/bindings/htmlStatefulBinding":9,"./ko/bindings/spinBinding":10,"./ko/bindings/summerNoteBinding":11,"./ko/core/baseBinding":12,"./ko/core/knockoutBinding":13,"./ko/ko-utils":14,"./ko/loadingProgress":15,"./lists/listPaging":16,"./lists/listWithServerHtml":17,"./lists/sort":18,"./lists/sortBinding":19,"./lists/sortRule":20,"./utils":22}],22:[function(require,module,exports){
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
},{}]},{},[3,21])(21)
});


//# sourceMappingURL=tenogy.js.map
