
      var $parcel$global = globalThis;
    var $b07963189a833f03$export$a441d440b06e3168 = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof $parcel$global !== "undefined" ? $parcel$global : typeof self !== "undefined" ? self : {};
function $b07963189a833f03$export$22b09f878622677a(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}


var $5744ad4c006961b1$export$5edeffb658f039f4 = {
    exports: {}
};


(function(module) {
    var has = Object.prototype.hasOwnProperty, prefix = "~";
    /**
	 * Constructor to create a storage for our `EE` objects.
	 * An `Events` instance is a plain object whose properties are event names.
	 *
	 * @constructor
	 * @private
	 */ function Events() {}
    //
    // We try to not inherit from `Object.prototype`. In some engines creating an
    // instance in this way is faster than calling `Object.create(null)` directly.
    // If `Object.create(null)` is not supported we prefix the event names with a
    // character to make sure that the built-in object properties are not
    // overridden or used as an attack vector.
    //
    if (Object.create) {
        Events.prototype = Object.create(null);
        //
        // This hack is needed because the `__proto__` property is still inherited in
        // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
        //
        if (!new Events().__proto__) prefix = false;
    }
    /**
	 * Representation of a single event listener.
	 *
	 * @param {Function} fn The listener function.
	 * @param {*} context The context to invoke the listener with.
	 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
	 * @constructor
	 * @private
	 */ function EE(fn, context, once) {
        this.fn = fn;
        this.context = context;
        this.once = once || false;
    }
    /**
	 * Add a listener for a given event.
	 *
	 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
	 * @param {(String|Symbol)} event The event name.
	 * @param {Function} fn The listener function.
	 * @param {*} context The context to invoke the listener with.
	 * @param {Boolean} once Specify if the listener is a one-time listener.
	 * @returns {EventEmitter}
	 * @private
	 */ function addListener(emitter, event, fn, context, once) {
        if (typeof fn !== "function") throw new TypeError("The listener must be a function");
        var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
        if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
        else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
        else emitter._events[evt] = [
            emitter._events[evt],
            listener
        ];
        return emitter;
    }
    /**
	 * Clear event by name.
	 *
	 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
	 * @param {(String|Symbol)} evt The Event name.
	 * @private
	 */ function clearEvent(emitter, evt) {
        if (--emitter._eventsCount === 0) emitter._events = new Events();
        else delete emitter._events[evt];
    }
    /**
	 * Minimal `EventEmitter` interface that is molded against the Node.js
	 * `EventEmitter` interface.
	 *
	 * @constructor
	 * @public
	 */ function EventEmitter() {
        this._events = new Events();
        this._eventsCount = 0;
    }
    /**
	 * Return an array listing the events for which the emitter has registered
	 * listeners.
	 *
	 * @returns {Array}
	 * @public
	 */ EventEmitter.prototype.eventNames = function eventNames() {
        var names = [], events, name;
        if (this._eventsCount === 0) return names;
        for(name in events = this._events)if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
        if (Object.getOwnPropertySymbols) return names.concat(Object.getOwnPropertySymbols(events));
        return names;
    };
    /**
	 * Return the listeners registered for a given event.
	 *
	 * @param {(String|Symbol)} event The event name.
	 * @returns {Array} The registered listeners.
	 * @public
	 */ EventEmitter.prototype.listeners = function listeners(event) {
        var evt = prefix ? prefix + event : event, handlers = this._events[evt];
        if (!handlers) return [];
        if (handlers.fn) return [
            handlers.fn
        ];
        for(var i = 0, l = handlers.length, ee = new Array(l); i < l; i++)ee[i] = handlers[i].fn;
        return ee;
    };
    /**
	 * Return the number of listeners listening to a given event.
	 *
	 * @param {(String|Symbol)} event The event name.
	 * @returns {Number} The number of listeners.
	 * @public
	 */ EventEmitter.prototype.listenerCount = function listenerCount(event) {
        var evt = prefix ? prefix + event : event, listeners = this._events[evt];
        if (!listeners) return 0;
        if (listeners.fn) return 1;
        return listeners.length;
    };
    /**
	 * Calls each of the listeners registered for a given event.
	 *
	 * @param {(String|Symbol)} event The event name.
	 * @returns {Boolean} `true` if the event had listeners, else `false`.
	 * @public
	 */ EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
        var evt = prefix ? prefix + event : event;
        if (!this._events[evt]) return false;
        var listeners = this._events[evt], len = arguments.length, args, i;
        if (listeners.fn) {
            if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);
            switch(len){
                case 1:
                    return listeners.fn.call(listeners.context), true;
                case 2:
                    return listeners.fn.call(listeners.context, a1), true;
                case 3:
                    return listeners.fn.call(listeners.context, a1, a2), true;
                case 4:
                    return listeners.fn.call(listeners.context, a1, a2, a3), true;
                case 5:
                    return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
                case 6:
                    return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
            }
            for(i = 1, args = new Array(len - 1); i < len; i++)args[i - 1] = arguments[i];
            listeners.fn.apply(listeners.context, args);
        } else {
            var length = listeners.length, j;
            for(i = 0; i < length; i++){
                if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);
                switch(len){
                    case 1:
                        listeners[i].fn.call(listeners[i].context);
                        break;
                    case 2:
                        listeners[i].fn.call(listeners[i].context, a1);
                        break;
                    case 3:
                        listeners[i].fn.call(listeners[i].context, a1, a2);
                        break;
                    case 4:
                        listeners[i].fn.call(listeners[i].context, a1, a2, a3);
                        break;
                    default:
                        if (!args) for(j = 1, args = new Array(len - 1); j < len; j++)args[j - 1] = arguments[j];
                        listeners[i].fn.apply(listeners[i].context, args);
                }
            }
        }
        return true;
    };
    /**
	 * Add a listener for a given event.
	 *
	 * @param {(String|Symbol)} event The event name.
	 * @param {Function} fn The listener function.
	 * @param {*} [context=this] The context to invoke the listener with.
	 * @returns {EventEmitter} `this`.
	 * @public
	 */ EventEmitter.prototype.on = function on(event, fn, context) {
        return addListener(this, event, fn, context, false);
    };
    /**
	 * Add a one-time listener for a given event.
	 *
	 * @param {(String|Symbol)} event The event name.
	 * @param {Function} fn The listener function.
	 * @param {*} [context=this] The context to invoke the listener with.
	 * @returns {EventEmitter} `this`.
	 * @public
	 */ EventEmitter.prototype.once = function once(event, fn, context) {
        return addListener(this, event, fn, context, true);
    };
    /**
	 * Remove the listeners of a given event.
	 *
	 * @param {(String|Symbol)} event The event name.
	 * @param {Function} fn Only remove the listeners that match this function.
	 * @param {*} context Only remove the listeners that have this context.
	 * @param {Boolean} once Only remove one-time listeners.
	 * @returns {EventEmitter} `this`.
	 * @public
	 */ EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
        var evt = prefix ? prefix + event : event;
        if (!this._events[evt]) return this;
        if (!fn) {
            clearEvent(this, evt);
            return this;
        }
        var listeners = this._events[evt];
        if (listeners.fn) {
            if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) clearEvent(this, evt);
        } else {
            for(var i = 0, events = [], length = listeners.length; i < length; i++)if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) events.push(listeners[i]);
            //
            // Reset the array, or remove it completely if we have no more listeners.
            //
            if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
            else clearEvent(this, evt);
        }
        return this;
    };
    /**
	 * Remove all listeners, or those of the specified event.
	 *
	 * @param {(String|Symbol)} [event] The event name.
	 * @returns {EventEmitter} `this`.
	 * @public
	 */ EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
        var evt;
        if (event) {
            evt = prefix ? prefix + event : event;
            if (this._events[evt]) clearEvent(this, evt);
        } else {
            this._events = new Events();
            this._eventsCount = 0;
        }
        return this;
    };
    //
    // Alias methods names because people roll like that.
    //
    EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
    EventEmitter.prototype.addListener = EventEmitter.prototype.on;
    //
    // Expose the prefix.
    //
    EventEmitter.prefixed = prefix;
    //
    // Allow `EventEmitter` to be imported as module namespace.
    //
    EventEmitter.EventEmitter = EventEmitter;
    module.exports = EventEmitter;
})((0, $5744ad4c006961b1$export$5edeffb658f039f4));
var $602d255db586a79f$var$eventemitter3Exports = (0, $5744ad4c006961b1$export$5edeffb658f039f4).exports;
var $602d255db586a79f$export$2e2bcd8739ae039 = /*@__PURE__*/ (0, $b07963189a833f03$export$22b09f878622677a)($602d255db586a79f$var$eventemitter3Exports);


var $508449958c1d885a$export$7debb50ef11d5e0b;
(function(util) {
    util.assertEqual = (val)=>val;
    function assertIs(_arg) {}
    util.assertIs = assertIs;
    function assertNever(_x) {
        throw new Error();
    }
    util.assertNever = assertNever;
    util.arrayToEnum = (items)=>{
        const obj = {};
        for (const item of items)obj[item] = item;
        return obj;
    };
    util.getValidEnumValues = (obj)=>{
        const validKeys = util.objectKeys(obj).filter((k)=>typeof obj[obj[k]] !== "number");
        const filtered = {};
        for (const k of validKeys)filtered[k] = obj[k];
        return util.objectValues(filtered);
    };
    util.objectValues = (obj)=>{
        return util.objectKeys(obj).map(function(e) {
            return obj[e];
        });
    };
    util.objectKeys = typeof Object.keys === "function" // eslint-disable-line ban/ban
     ? (obj)=>Object.keys(obj) // eslint-disable-line ban/ban
     : (object)=>{
        const keys = [];
        for(const key in object)if (Object.prototype.hasOwnProperty.call(object, key)) keys.push(key);
        return keys;
    };
    util.find = (arr, checker)=>{
        for (const item of arr){
            if (checker(item)) return item;
        }
        return undefined;
    };
    util.isInteger = typeof Number.isInteger === "function" ? (val)=>Number.isInteger(val) // eslint-disable-line ban/ban
     : (val)=>typeof val === "number" && isFinite(val) && Math.floor(val) === val;
    function joinValues(array, separator = " | ") {
        return array.map((val)=>typeof val === "string" ? `'${val}'` : val).join(separator);
    }
    util.joinValues = joinValues;
    util.jsonStringifyReplacer = (_, value)=>{
        if (typeof value === "bigint") return value.toString();
        return value;
    };
})($508449958c1d885a$export$7debb50ef11d5e0b || ($508449958c1d885a$export$7debb50ef11d5e0b = {}));
var $508449958c1d885a$export$4aa2142c225fd5c7;
(function(objectUtil) {
    objectUtil.mergeShapes = (first, second)=>{
        return {
            ...first,
            ...second
        };
    };
})($508449958c1d885a$export$4aa2142c225fd5c7 || ($508449958c1d885a$export$4aa2142c225fd5c7 = {}));
const $508449958c1d885a$export$5716da67bfaa244d = $508449958c1d885a$export$7debb50ef11d5e0b.arrayToEnum([
    "string",
    "nan",
    "number",
    "integer",
    "float",
    "boolean",
    "date",
    "bigint",
    "symbol",
    "function",
    "undefined",
    "null",
    "array",
    "object",
    "unknown",
    "promise",
    "void",
    "never",
    "map",
    "set"
]);
const $508449958c1d885a$export$3e9057828ebd5c7a = (data)=>{
    const t = typeof data;
    switch(t){
        case "undefined":
            return $508449958c1d885a$export$5716da67bfaa244d.undefined;
        case "string":
            return $508449958c1d885a$export$5716da67bfaa244d.string;
        case "number":
            return isNaN(data) ? $508449958c1d885a$export$5716da67bfaa244d.nan : $508449958c1d885a$export$5716da67bfaa244d.number;
        case "boolean":
            return $508449958c1d885a$export$5716da67bfaa244d.boolean;
        case "function":
            return $508449958c1d885a$export$5716da67bfaa244d.function;
        case "bigint":
            return $508449958c1d885a$export$5716da67bfaa244d.bigint;
        case "symbol":
            return $508449958c1d885a$export$5716da67bfaa244d.symbol;
        case "object":
            if (Array.isArray(data)) return $508449958c1d885a$export$5716da67bfaa244d.array;
            if (data === null) return $508449958c1d885a$export$5716da67bfaa244d.null;
            if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") return $508449958c1d885a$export$5716da67bfaa244d.promise;
            if (typeof Map !== "undefined" && data instanceof Map) return $508449958c1d885a$export$5716da67bfaa244d.map;
            if (typeof Set !== "undefined" && data instanceof Set) return $508449958c1d885a$export$5716da67bfaa244d.set;
            if (typeof Date !== "undefined" && data instanceof Date) return $508449958c1d885a$export$5716da67bfaa244d.date;
            return $508449958c1d885a$export$5716da67bfaa244d.object;
        default:
            return $508449958c1d885a$export$5716da67bfaa244d.unknown;
    }
};
const $508449958c1d885a$export$5ba560653e4a1035 = $508449958c1d885a$export$7debb50ef11d5e0b.arrayToEnum([
    "invalid_type",
    "invalid_literal",
    "custom",
    "invalid_union",
    "invalid_union_discriminator",
    "invalid_enum_value",
    "unrecognized_keys",
    "invalid_arguments",
    "invalid_return_type",
    "invalid_date",
    "invalid_string",
    "too_small",
    "too_big",
    "invalid_intersection_types",
    "not_multiple_of",
    "not_finite"
]);
const $508449958c1d885a$export$913eddeaf297cfea = (obj)=>{
    const json = JSON.stringify(obj, null, 2);
    return json.replace(/"([^"]+)":/g, "$1:");
};
class $508449958c1d885a$export$f98dac4b251ab333 extends Error {
    constructor(issues){
        super();
        this.issues = [];
        this.addIssue = (sub)=>{
            this.issues = [
                ...this.issues,
                sub
            ];
        };
        this.addIssues = (subs = [])=>{
            this.issues = [
                ...this.issues,
                ...subs
            ];
        };
        const actualProto = new.target.prototype;
        if (Object.setPrototypeOf) // eslint-disable-next-line ban/ban
        Object.setPrototypeOf(this, actualProto);
        else this.__proto__ = actualProto;
        this.name = "ZodError";
        this.issues = issues;
    }
    get errors() {
        return this.issues;
    }
    format(_mapper) {
        const mapper = _mapper || function(issue) {
            return issue.message;
        };
        const fieldErrors = {
            _errors: []
        };
        const processError = (error)=>{
            for (const issue of error.issues){
                if (issue.code === "invalid_union") issue.unionErrors.map(processError);
                else if (issue.code === "invalid_return_type") processError(issue.returnTypeError);
                else if (issue.code === "invalid_arguments") processError(issue.argumentsError);
                else if (issue.path.length === 0) fieldErrors._errors.push(mapper(issue));
                else {
                    let curr = fieldErrors;
                    let i = 0;
                    while(i < issue.path.length){
                        const el = issue.path[i];
                        const terminal = i === issue.path.length - 1;
                        if (!terminal) curr[el] = curr[el] || {
                            _errors: []
                        };
                        else {
                            curr[el] = curr[el] || {
                                _errors: []
                            };
                            curr[el]._errors.push(mapper(issue));
                        }
                        curr = curr[el];
                        i++;
                    }
                }
            }
        };
        processError(this);
        return fieldErrors;
    }
    static assert(value) {
        if (!(value instanceof $508449958c1d885a$export$f98dac4b251ab333)) throw new Error(`Not a ZodError: ${value}`);
    }
    toString() {
        return this.message;
    }
    get message() {
        return JSON.stringify(this.issues, $508449958c1d885a$export$7debb50ef11d5e0b.jsonStringifyReplacer, 2);
    }
    get isEmpty() {
        return this.issues.length === 0;
    }
    flatten(mapper = (issue)=>issue.message) {
        const fieldErrors = {};
        const formErrors = [];
        for (const sub of this.issues)if (sub.path.length > 0) {
            fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
            fieldErrors[sub.path[0]].push(mapper(sub));
        } else formErrors.push(mapper(sub));
        return {
            formErrors: formErrors,
            fieldErrors: fieldErrors
        };
    }
    get formErrors() {
        return this.flatten();
    }
}
$508449958c1d885a$export$f98dac4b251ab333.create = (issues)=>{
    const error = new $508449958c1d885a$export$f98dac4b251ab333(issues);
    return error;
};
const $508449958c1d885a$export$341b0b6e0a6f5099 = (issue, _ctx)=>{
    let message;
    switch(issue.code){
        case $508449958c1d885a$export$5ba560653e4a1035.invalid_type:
            if (issue.received === $508449958c1d885a$export$5716da67bfaa244d.undefined) message = "Required";
            else message = `Expected ${issue.expected}, received ${issue.received}`;
            break;
        case $508449958c1d885a$export$5ba560653e4a1035.invalid_literal:
            message = `Invalid literal value, expected ${JSON.stringify(issue.expected, $508449958c1d885a$export$7debb50ef11d5e0b.jsonStringifyReplacer)}`;
            break;
        case $508449958c1d885a$export$5ba560653e4a1035.unrecognized_keys:
            message = `Unrecognized key(s) in object: ${$508449958c1d885a$export$7debb50ef11d5e0b.joinValues(issue.keys, ", ")}`;
            break;
        case $508449958c1d885a$export$5ba560653e4a1035.invalid_union:
            message = `Invalid input`;
            break;
        case $508449958c1d885a$export$5ba560653e4a1035.invalid_union_discriminator:
            message = `Invalid discriminator value. Expected ${$508449958c1d885a$export$7debb50ef11d5e0b.joinValues(issue.options)}`;
            break;
        case $508449958c1d885a$export$5ba560653e4a1035.invalid_enum_value:
            message = `Invalid enum value. Expected ${$508449958c1d885a$export$7debb50ef11d5e0b.joinValues(issue.options)}, received '${issue.received}'`;
            break;
        case $508449958c1d885a$export$5ba560653e4a1035.invalid_arguments:
            message = `Invalid function arguments`;
            break;
        case $508449958c1d885a$export$5ba560653e4a1035.invalid_return_type:
            message = `Invalid function return type`;
            break;
        case $508449958c1d885a$export$5ba560653e4a1035.invalid_date:
            message = `Invalid date`;
            break;
        case $508449958c1d885a$export$5ba560653e4a1035.invalid_string:
            if (typeof issue.validation === "object") {
                if ("includes" in issue.validation) {
                    message = `Invalid input: must include "${issue.validation.includes}"`;
                    if (typeof issue.validation.position === "number") message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
                } else if ("startsWith" in issue.validation) message = `Invalid input: must start with "${issue.validation.startsWith}"`;
                else if ("endsWith" in issue.validation) message = `Invalid input: must end with "${issue.validation.endsWith}"`;
                else $508449958c1d885a$export$7debb50ef11d5e0b.assertNever(issue.validation);
            } else if (issue.validation !== "regex") message = `Invalid ${issue.validation}`;
            else message = "Invalid";
            break;
        case $508449958c1d885a$export$5ba560653e4a1035.too_small:
            if (issue.type === "array") message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
            else if (issue.type === "string") message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
            else if (issue.type === "number") message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
            else if (issue.type === "date") message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
            else message = "Invalid input";
            break;
        case $508449958c1d885a$export$5ba560653e4a1035.too_big:
            if (issue.type === "array") message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
            else if (issue.type === "string") message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
            else if (issue.type === "number") message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
            else if (issue.type === "bigint") message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
            else if (issue.type === "date") message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
            else message = "Invalid input";
            break;
        case $508449958c1d885a$export$5ba560653e4a1035.custom:
            message = `Invalid input`;
            break;
        case $508449958c1d885a$export$5ba560653e4a1035.invalid_intersection_types:
            message = `Intersection results could not be merged`;
            break;
        case $508449958c1d885a$export$5ba560653e4a1035.not_multiple_of:
            message = `Number must be a multiple of ${issue.multipleOf}`;
            break;
        case $508449958c1d885a$export$5ba560653e4a1035.not_finite:
            message = "Number must be finite";
            break;
        default:
            message = _ctx.defaultError;
            $508449958c1d885a$export$7debb50ef11d5e0b.assertNever(issue);
    }
    return {
        message: message
    };
};
let $508449958c1d885a$var$overrideErrorMap = $508449958c1d885a$export$341b0b6e0a6f5099;
function $508449958c1d885a$export$1097a8289cfd22d7(map) {
    $508449958c1d885a$var$overrideErrorMap = map;
}
function $508449958c1d885a$export$32f27c719778d4c4() {
    return $508449958c1d885a$var$overrideErrorMap;
}
const $508449958c1d885a$export$244a85fde9c419ed = (params)=>{
    const { data: data, path: path, errorMaps: errorMaps, issueData: issueData } = params;
    const fullPath = [
        ...path,
        ...issueData.path || []
    ];
    const fullIssue = {
        ...issueData,
        path: fullPath
    };
    if (issueData.message !== undefined) return {
        ...issueData,
        path: fullPath,
        message: issueData.message
    };
    let errorMessage = "";
    const maps = errorMaps.filter((m)=>!!m).slice().reverse();
    for (const map of maps)errorMessage = map(fullIssue, {
        data: data,
        defaultError: errorMessage
    }).message;
    return {
        ...issueData,
        path: fullPath,
        message: errorMessage
    };
};
const $508449958c1d885a$export$1526d2e05f74572 = [];
function $508449958c1d885a$export$db7caee60e5d514d(ctx, issueData) {
    const overrideMap = $508449958c1d885a$export$32f27c719778d4c4();
    const issue = $508449958c1d885a$export$244a85fde9c419ed({
        issueData: issueData,
        data: ctx.data,
        path: ctx.path,
        errorMaps: [
            ctx.common.contextualErrorMap,
            ctx.schemaErrorMap,
            overrideMap,
            overrideMap === $508449958c1d885a$export$341b0b6e0a6f5099 ? undefined : $508449958c1d885a$export$341b0b6e0a6f5099
        ].filter((x)=>!!x)
    });
    ctx.common.issues.push(issue);
}
class $508449958c1d885a$export$5b20a5c3d05c1f6f {
    constructor(){
        this.value = "valid";
    }
    dirty() {
        if (this.value === "valid") this.value = "dirty";
    }
    abort() {
        if (this.value !== "aborted") this.value = "aborted";
    }
    static mergeArray(status, results) {
        const arrayValue = [];
        for (const s of results){
            if (s.status === "aborted") return $508449958c1d885a$export$9a105a556e65c2c0;
            if (s.status === "dirty") status.dirty();
            arrayValue.push(s.value);
        }
        return {
            status: status.value,
            value: arrayValue
        };
    }
    static async mergeObjectAsync(status, pairs) {
        const syncPairs = [];
        for (const pair of pairs){
            const key = await pair.key;
            const value = await pair.value;
            syncPairs.push({
                key: key,
                value: value
            });
        }
        return $508449958c1d885a$export$5b20a5c3d05c1f6f.mergeObjectSync(status, syncPairs);
    }
    static mergeObjectSync(status, pairs) {
        const finalObject = {};
        for (const pair of pairs){
            const { key: key, value: value } = pair;
            if (key.status === "aborted") return $508449958c1d885a$export$9a105a556e65c2c0;
            if (value.status === "aborted") return $508449958c1d885a$export$9a105a556e65c2c0;
            if (key.status === "dirty") status.dirty();
            if (value.status === "dirty") status.dirty();
            if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) finalObject[key.value] = value.value;
        }
        return {
            status: status.value,
            value: finalObject
        };
    }
}
const $508449958c1d885a$export$9a105a556e65c2c0 = Object.freeze({
    status: "aborted"
});
const $508449958c1d885a$export$325a211da9693fcf = (value)=>({
        status: "dirty",
        value: value
    });
const $508449958c1d885a$export$c6813a8d51f77eaf = (value)=>({
        status: "valid",
        value: value
    });
const $508449958c1d885a$export$afa861e3c5730743 = (x)=>x.status === "aborted";
const $508449958c1d885a$export$910b6cdd390341b3 = (x)=>x.status === "dirty";
const $508449958c1d885a$export$1ea939691cdc45b8 = (x)=>x.status === "valid";
const $508449958c1d885a$export$aefee5ebe1dcfd9e = (x)=>typeof Promise !== "undefined" && x instanceof Promise;
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */ function $508449958c1d885a$var$__classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function $508449958c1d885a$var$__classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
typeof SuppressedError === "function" && SuppressedError;
var $508449958c1d885a$var$errorUtil;
(function(errorUtil) {
    errorUtil.errToObj = (message)=>typeof message === "string" ? {
            message: message
        } : message || {};
    errorUtil.toString = (message)=>typeof message === "string" ? message : message === null || message === void 0 ? void 0 : message.message;
})($508449958c1d885a$var$errorUtil || ($508449958c1d885a$var$errorUtil = {}));
var $508449958c1d885a$var$_ZodEnum_cache, $508449958c1d885a$var$_ZodNativeEnum_cache;
class $508449958c1d885a$var$ParseInputLazyPath {
    constructor(parent, value, path, key){
        this._cachedPath = [];
        this.parent = parent;
        this.data = value;
        this._path = path;
        this._key = key;
    }
    get path() {
        if (!this._cachedPath.length) {
            if (this._key instanceof Array) this._cachedPath.push(...this._path, ...this._key);
            else this._cachedPath.push(...this._path, this._key);
        }
        return this._cachedPath;
    }
}
const $508449958c1d885a$var$handleResult = (ctx, result)=>{
    if ($508449958c1d885a$export$1ea939691cdc45b8(result)) return {
        success: true,
        data: result.value
    };
    else {
        if (!ctx.common.issues.length) throw new Error("Validation failed but no issues detected.");
        return {
            success: false,
            get error () {
                if (this._error) return this._error;
                const error = new $508449958c1d885a$export$f98dac4b251ab333(ctx.common.issues);
                this._error = error;
                return this._error;
            }
        };
    }
};
function $508449958c1d885a$var$processCreateParams(params) {
    if (!params) return {};
    const { errorMap: errorMap, invalid_type_error: invalid_type_error, required_error: required_error, description: description } = params;
    if (errorMap && (invalid_type_error || required_error)) throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
    if (errorMap) return {
        errorMap: errorMap,
        description: description
    };
    const customMap = (iss, ctx)=>{
        var _a, _b;
        const { message: message } = params;
        if (iss.code === "invalid_enum_value") return {
            message: message !== null && message !== void 0 ? message : ctx.defaultError
        };
        if (typeof ctx.data === "undefined") return {
            message: (_a = message !== null && message !== void 0 ? message : required_error) !== null && _a !== void 0 ? _a : ctx.defaultError
        };
        if (iss.code !== "invalid_type") return {
            message: ctx.defaultError
        };
        return {
            message: (_b = message !== null && message !== void 0 ? message : invalid_type_error) !== null && _b !== void 0 ? _b : ctx.defaultError
        };
    };
    return {
        errorMap: customMap,
        description: description
    };
}
class $508449958c1d885a$export$19342e026b58ebb7 {
    constructor(def){
        /** Alias of safeParseAsync */ this.spa = this.safeParseAsync;
        this._def = def;
        this.parse = this.parse.bind(this);
        this.safeParse = this.safeParse.bind(this);
        this.parseAsync = this.parseAsync.bind(this);
        this.safeParseAsync = this.safeParseAsync.bind(this);
        this.spa = this.spa.bind(this);
        this.refine = this.refine.bind(this);
        this.refinement = this.refinement.bind(this);
        this.superRefine = this.superRefine.bind(this);
        this.optional = this.optional.bind(this);
        this.nullable = this.nullable.bind(this);
        this.nullish = this.nullish.bind(this);
        this.array = this.array.bind(this);
        this.promise = this.promise.bind(this);
        this.or = this.or.bind(this);
        this.and = this.and.bind(this);
        this.transform = this.transform.bind(this);
        this.brand = this.brand.bind(this);
        this.default = this.default.bind(this);
        this.catch = this.catch.bind(this);
        this.describe = this.describe.bind(this);
        this.pipe = this.pipe.bind(this);
        this.readonly = this.readonly.bind(this);
        this.isNullable = this.isNullable.bind(this);
        this.isOptional = this.isOptional.bind(this);
    }
    get description() {
        return this._def.description;
    }
    _getType(input) {
        return $508449958c1d885a$export$3e9057828ebd5c7a(input.data);
    }
    _getOrReturnCtx(input, ctx) {
        return ctx || {
            common: input.parent.common,
            data: input.data,
            parsedType: $508449958c1d885a$export$3e9057828ebd5c7a(input.data),
            schemaErrorMap: this._def.errorMap,
            path: input.path,
            parent: input.parent
        };
    }
    _processInputParams(input) {
        return {
            status: new $508449958c1d885a$export$5b20a5c3d05c1f6f(),
            ctx: {
                common: input.parent.common,
                data: input.data,
                parsedType: $508449958c1d885a$export$3e9057828ebd5c7a(input.data),
                schemaErrorMap: this._def.errorMap,
                path: input.path,
                parent: input.parent
            }
        };
    }
    _parseSync(input) {
        const result = this._parse(input);
        if ($508449958c1d885a$export$aefee5ebe1dcfd9e(result)) throw new Error("Synchronous parse encountered promise.");
        return result;
    }
    _parseAsync(input) {
        const result = this._parse(input);
        return Promise.resolve(result);
    }
    parse(data, params) {
        const result = this.safeParse(data, params);
        if (result.success) return result.data;
        throw result.error;
    }
    safeParse(data, params) {
        var _a;
        const ctx = {
            common: {
                issues: [],
                async: (_a = params === null || params === void 0 ? void 0 : params.async) !== null && _a !== void 0 ? _a : false,
                contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap
            },
            path: (params === null || params === void 0 ? void 0 : params.path) || [],
            schemaErrorMap: this._def.errorMap,
            parent: null,
            data: data,
            parsedType: $508449958c1d885a$export$3e9057828ebd5c7a(data)
        };
        const result = this._parseSync({
            data: data,
            path: ctx.path,
            parent: ctx
        });
        return $508449958c1d885a$var$handleResult(ctx, result);
    }
    async parseAsync(data, params) {
        const result = await this.safeParseAsync(data, params);
        if (result.success) return result.data;
        throw result.error;
    }
    async safeParseAsync(data, params) {
        const ctx = {
            common: {
                issues: [],
                contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap,
                async: true
            },
            path: (params === null || params === void 0 ? void 0 : params.path) || [],
            schemaErrorMap: this._def.errorMap,
            parent: null,
            data: data,
            parsedType: $508449958c1d885a$export$3e9057828ebd5c7a(data)
        };
        const maybeAsyncResult = this._parse({
            data: data,
            path: ctx.path,
            parent: ctx
        });
        const result = await ($508449958c1d885a$export$aefee5ebe1dcfd9e(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
        return $508449958c1d885a$var$handleResult(ctx, result);
    }
    refine(check, message) {
        const getIssueProperties = (val)=>{
            if (typeof message === "string" || typeof message === "undefined") return {
                message: message
            };
            else if (typeof message === "function") return message(val);
            else return message;
        };
        return this._refinement((val, ctx)=>{
            const result = check(val);
            const setError = ()=>ctx.addIssue({
                    code: $508449958c1d885a$export$5ba560653e4a1035.custom,
                    ...getIssueProperties(val)
                });
            if (typeof Promise !== "undefined" && result instanceof Promise) return result.then((data)=>{
                if (!data) {
                    setError();
                    return false;
                } else return true;
            });
            if (!result) {
                setError();
                return false;
            } else return true;
        });
    }
    refinement(check, refinementData) {
        return this._refinement((val, ctx)=>{
            if (!check(val)) {
                ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
                return false;
            } else return true;
        });
    }
    _refinement(refinement) {
        return new $508449958c1d885a$export$a60af00cc0ce2582({
            schema: this,
            typeName: $508449958c1d885a$export$558106ce543bd011.ZodEffects,
            effect: {
                type: "refinement",
                refinement: refinement
            }
        });
    }
    superRefine(refinement) {
        return this._refinement(refinement);
    }
    optional() {
        return $508449958c1d885a$export$aa56fec1e9d629b8.create(this, this._def);
    }
    nullable() {
        return $508449958c1d885a$export$aaac0b8b429cef5.create(this, this._def);
    }
    nullish() {
        return this.nullable().optional();
    }
    array() {
        return $508449958c1d885a$export$7acfc3e64785411.create(this, this._def);
    }
    promise() {
        return $508449958c1d885a$export$3f196b0127d6e50a.create(this, this._def);
    }
    or(option) {
        return $508449958c1d885a$export$a8b236cb5070a311.create([
            this,
            option
        ], this._def);
    }
    and(incoming) {
        return $508449958c1d885a$export$c02deaf0bb5203d4.create(this, incoming, this._def);
    }
    transform(transform) {
        return new $508449958c1d885a$export$a60af00cc0ce2582({
            ...$508449958c1d885a$var$processCreateParams(this._def),
            schema: this,
            typeName: $508449958c1d885a$export$558106ce543bd011.ZodEffects,
            effect: {
                type: "transform",
                transform: transform
            }
        });
    }
    default(def) {
        const defaultValueFunc = typeof def === "function" ? def : ()=>def;
        return new $508449958c1d885a$export$bb19b37874861e7e({
            ...$508449958c1d885a$var$processCreateParams(this._def),
            innerType: this,
            defaultValue: defaultValueFunc,
            typeName: $508449958c1d885a$export$558106ce543bd011.ZodDefault
        });
    }
    brand() {
        return new $508449958c1d885a$export$66b0c798a395271f({
            typeName: $508449958c1d885a$export$558106ce543bd011.ZodBranded,
            type: this,
            ...$508449958c1d885a$var$processCreateParams(this._def)
        });
    }
    catch(def) {
        const catchValueFunc = typeof def === "function" ? def : ()=>def;
        return new $508449958c1d885a$export$75a44ec6249ac76b({
            ...$508449958c1d885a$var$processCreateParams(this._def),
            innerType: this,
            catchValue: catchValueFunc,
            typeName: $508449958c1d885a$export$558106ce543bd011.ZodCatch
        });
    }
    describe(description) {
        const This = this.constructor;
        return new This({
            ...this._def,
            description: description
        });
    }
    pipe(target) {
        return $508449958c1d885a$export$a3c3ef8a0e95c6da.create(this, target);
    }
    readonly() {
        return $508449958c1d885a$export$5d1f7ef05c4e493a.create(this);
    }
    isOptional() {
        return this.safeParse(undefined).success;
    }
    isNullable() {
        return this.safeParse(null).success;
    }
}
const $508449958c1d885a$var$cuidRegex = /^c[^\s-]{8,}$/i;
const $508449958c1d885a$var$cuid2Regex = /^[0-9a-z]+$/;
const $508449958c1d885a$var$ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/;
// const uuidRegex =
//   /^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i;
const $508449958c1d885a$var$uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
const $508449958c1d885a$var$nanoidRegex = /^[a-z0-9_-]{21}$/i;
const $508449958c1d885a$var$durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
// from https://stackoverflow.com/a/46181/1550155
// old version: too slow, didn't support unicode
// const emailRegex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
//old email regex
// const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@((?!-)([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{1,})[^-<>()[\].,;:\s@"]$/i;
// eslint-disable-next-line
// const emailRegex =
//   /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\])|(\[IPv6:(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))\])|([A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])*(\.[A-Za-z]{2,})+))$/;
// const emailRegex =
//   /^[a-zA-Z0-9\.\!\#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\~\-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
// const emailRegex =
//   /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
const $508449958c1d885a$var$emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
// const emailRegex =
//   /^[a-z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9\-]+)*$/i;
// from https://thekevinscott.com/emojis-in-javascript/#writing-a-regular-expression
const $508449958c1d885a$var$_emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
let $508449958c1d885a$var$emojiRegex;
// faster, simpler, safer
const $508449958c1d885a$var$ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
const $508449958c1d885a$var$ipv6Regex = /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/;
// https://stackoverflow.com/questions/7860392/determine-if-string-is-in-base64-using-javascript
const $508449958c1d885a$var$base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
// simple
// const dateRegexSource = `\\d{4}-\\d{2}-\\d{2}`;
// no leap year validation
// const dateRegexSource = `\\d{4}-((0[13578]|10|12)-31|(0[13-9]|1[0-2])-30|(0[1-9]|1[0-2])-(0[1-9]|1\\d|2\\d))`;
// with leap year validation
const $508449958c1d885a$var$dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
const $508449958c1d885a$var$dateRegex = new RegExp(`^${$508449958c1d885a$var$dateRegexSource}$`);
function $508449958c1d885a$var$timeRegexSource(args) {
    // let regex = `\\d{2}:\\d{2}:\\d{2}`;
    let regex = `([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d`;
    if (args.precision) regex = `${regex}\\.\\d{${args.precision}}`;
    else if (args.precision == null) regex = `${regex}(\\.\\d+)?`;
    return regex;
}
function $508449958c1d885a$var$timeRegex(args) {
    return new RegExp(`^${$508449958c1d885a$var$timeRegexSource(args)}$`);
}
// Adapted from https://stackoverflow.com/a/3143231
function $508449958c1d885a$export$a4b563879add27a(args) {
    let regex = `${$508449958c1d885a$var$dateRegexSource}T${$508449958c1d885a$var$timeRegexSource(args)}`;
    const opts = [];
    opts.push(args.local ? `Z?` : `Z`);
    if (args.offset) opts.push(`([+-]\\d{2}:?\\d{2})`);
    regex = `${regex}(${opts.join("|")})`;
    return new RegExp(`^${regex}$`);
}
function $508449958c1d885a$var$isValidIP(ip, version) {
    if ((version === "v4" || !version) && $508449958c1d885a$var$ipv4Regex.test(ip)) return true;
    if ((version === "v6" || !version) && $508449958c1d885a$var$ipv6Regex.test(ip)) return true;
    return false;
}
class $508449958c1d885a$export$1230eb29b8d3b502 extends $508449958c1d885a$export$19342e026b58ebb7 {
    _parse(input) {
        if (this._def.coerce) input.data = String(input.data);
        const parsedType = this._getType(input);
        if (parsedType !== $508449958c1d885a$export$5716da67bfaa244d.string) {
            const ctx = this._getOrReturnCtx(input);
            $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                code: $508449958c1d885a$export$5ba560653e4a1035.invalid_type,
                expected: $508449958c1d885a$export$5716da67bfaa244d.string,
                received: ctx.parsedType
            });
            return $508449958c1d885a$export$9a105a556e65c2c0;
        }
        const status = new $508449958c1d885a$export$5b20a5c3d05c1f6f();
        let ctx = undefined;
        for (const check of this._def.checks){
            if (check.kind === "min") {
                if (input.data.length < check.value) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                        code: $508449958c1d885a$export$5ba560653e4a1035.too_small,
                        minimum: check.value,
                        type: "string",
                        inclusive: true,
                        exact: false,
                        message: check.message
                    });
                    status.dirty();
                }
            } else if (check.kind === "max") {
                if (input.data.length > check.value) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                        code: $508449958c1d885a$export$5ba560653e4a1035.too_big,
                        maximum: check.value,
                        type: "string",
                        inclusive: true,
                        exact: false,
                        message: check.message
                    });
                    status.dirty();
                }
            } else if (check.kind === "length") {
                const tooBig = input.data.length > check.value;
                const tooSmall = input.data.length < check.value;
                if (tooBig || tooSmall) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    if (tooBig) $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                        code: $508449958c1d885a$export$5ba560653e4a1035.too_big,
                        maximum: check.value,
                        type: "string",
                        inclusive: true,
                        exact: true,
                        message: check.message
                    });
                    else if (tooSmall) $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                        code: $508449958c1d885a$export$5ba560653e4a1035.too_small,
                        minimum: check.value,
                        type: "string",
                        inclusive: true,
                        exact: true,
                        message: check.message
                    });
                    status.dirty();
                }
            } else if (check.kind === "email") {
                if (!$508449958c1d885a$var$emailRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                        validation: "email",
                        code: $508449958c1d885a$export$5ba560653e4a1035.invalid_string,
                        message: check.message
                    });
                    status.dirty();
                }
            } else if (check.kind === "emoji") {
                if (!$508449958c1d885a$var$emojiRegex) $508449958c1d885a$var$emojiRegex = new RegExp($508449958c1d885a$var$_emojiRegex, "u");
                if (!$508449958c1d885a$var$emojiRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                        validation: "emoji",
                        code: $508449958c1d885a$export$5ba560653e4a1035.invalid_string,
                        message: check.message
                    });
                    status.dirty();
                }
            } else if (check.kind === "uuid") {
                if (!$508449958c1d885a$var$uuidRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                        validation: "uuid",
                        code: $508449958c1d885a$export$5ba560653e4a1035.invalid_string,
                        message: check.message
                    });
                    status.dirty();
                }
            } else if (check.kind === "nanoid") {
                if (!$508449958c1d885a$var$nanoidRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                        validation: "nanoid",
                        code: $508449958c1d885a$export$5ba560653e4a1035.invalid_string,
                        message: check.message
                    });
                    status.dirty();
                }
            } else if (check.kind === "cuid") {
                if (!$508449958c1d885a$var$cuidRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                        validation: "cuid",
                        code: $508449958c1d885a$export$5ba560653e4a1035.invalid_string,
                        message: check.message
                    });
                    status.dirty();
                }
            } else if (check.kind === "cuid2") {
                if (!$508449958c1d885a$var$cuid2Regex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                        validation: "cuid2",
                        code: $508449958c1d885a$export$5ba560653e4a1035.invalid_string,
                        message: check.message
                    });
                    status.dirty();
                }
            } else if (check.kind === "ulid") {
                if (!$508449958c1d885a$var$ulidRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                        validation: "ulid",
                        code: $508449958c1d885a$export$5ba560653e4a1035.invalid_string,
                        message: check.message
                    });
                    status.dirty();
                }
            } else if (check.kind === "url") try {
                new URL(input.data);
            } catch (_a) {
                ctx = this._getOrReturnCtx(input, ctx);
                $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                    validation: "url",
                    code: $508449958c1d885a$export$5ba560653e4a1035.invalid_string,
                    message: check.message
                });
                status.dirty();
            }
            else if (check.kind === "regex") {
                check.regex.lastIndex = 0;
                const testResult = check.regex.test(input.data);
                if (!testResult) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                        validation: "regex",
                        code: $508449958c1d885a$export$5ba560653e4a1035.invalid_string,
                        message: check.message
                    });
                    status.dirty();
                }
            } else if (check.kind === "trim") input.data = input.data.trim();
            else if (check.kind === "includes") {
                if (!input.data.includes(check.value, check.position)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                        code: $508449958c1d885a$export$5ba560653e4a1035.invalid_string,
                        validation: {
                            includes: check.value,
                            position: check.position
                        },
                        message: check.message
                    });
                    status.dirty();
                }
            } else if (check.kind === "toLowerCase") input.data = input.data.toLowerCase();
            else if (check.kind === "toUpperCase") input.data = input.data.toUpperCase();
            else if (check.kind === "startsWith") {
                if (!input.data.startsWith(check.value)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                        code: $508449958c1d885a$export$5ba560653e4a1035.invalid_string,
                        validation: {
                            startsWith: check.value
                        },
                        message: check.message
                    });
                    status.dirty();
                }
            } else if (check.kind === "endsWith") {
                if (!input.data.endsWith(check.value)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                        code: $508449958c1d885a$export$5ba560653e4a1035.invalid_string,
                        validation: {
                            endsWith: check.value
                        },
                        message: check.message
                    });
                    status.dirty();
                }
            } else if (check.kind === "datetime") {
                const regex = $508449958c1d885a$export$a4b563879add27a(check);
                if (!regex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                        code: $508449958c1d885a$export$5ba560653e4a1035.invalid_string,
                        validation: "datetime",
                        message: check.message
                    });
                    status.dirty();
                }
            } else if (check.kind === "date") {
                const regex = $508449958c1d885a$var$dateRegex;
                if (!regex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                        code: $508449958c1d885a$export$5ba560653e4a1035.invalid_string,
                        validation: "date",
                        message: check.message
                    });
                    status.dirty();
                }
            } else if (check.kind === "time") {
                const regex = $508449958c1d885a$var$timeRegex(check);
                if (!regex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                        code: $508449958c1d885a$export$5ba560653e4a1035.invalid_string,
                        validation: "time",
                        message: check.message
                    });
                    status.dirty();
                }
            } else if (check.kind === "duration") {
                if (!$508449958c1d885a$var$durationRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                        validation: "duration",
                        code: $508449958c1d885a$export$5ba560653e4a1035.invalid_string,
                        message: check.message
                    });
                    status.dirty();
                }
            } else if (check.kind === "ip") {
                if (!$508449958c1d885a$var$isValidIP(input.data, check.version)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                        validation: "ip",
                        code: $508449958c1d885a$export$5ba560653e4a1035.invalid_string,
                        message: check.message
                    });
                    status.dirty();
                }
            } else if (check.kind === "base64") {
                if (!$508449958c1d885a$var$base64Regex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                        validation: "base64",
                        code: $508449958c1d885a$export$5ba560653e4a1035.invalid_string,
                        message: check.message
                    });
                    status.dirty();
                }
            } else $508449958c1d885a$export$7debb50ef11d5e0b.assertNever(check);
        }
        return {
            status: status.value,
            value: input.data
        };
    }
    _regex(regex, validation, message) {
        return this.refinement((data)=>regex.test(data), {
            validation: validation,
            code: $508449958c1d885a$export$5ba560653e4a1035.invalid_string,
            ...$508449958c1d885a$var$errorUtil.errToObj(message)
        });
    }
    _addCheck(check) {
        return new $508449958c1d885a$export$1230eb29b8d3b502({
            ...this._def,
            checks: [
                ...this._def.checks,
                check
            ]
        });
    }
    email(message) {
        return this._addCheck({
            kind: "email",
            ...$508449958c1d885a$var$errorUtil.errToObj(message)
        });
    }
    url(message) {
        return this._addCheck({
            kind: "url",
            ...$508449958c1d885a$var$errorUtil.errToObj(message)
        });
    }
    emoji(message) {
        return this._addCheck({
            kind: "emoji",
            ...$508449958c1d885a$var$errorUtil.errToObj(message)
        });
    }
    uuid(message) {
        return this._addCheck({
            kind: "uuid",
            ...$508449958c1d885a$var$errorUtil.errToObj(message)
        });
    }
    nanoid(message) {
        return this._addCheck({
            kind: "nanoid",
            ...$508449958c1d885a$var$errorUtil.errToObj(message)
        });
    }
    cuid(message) {
        return this._addCheck({
            kind: "cuid",
            ...$508449958c1d885a$var$errorUtil.errToObj(message)
        });
    }
    cuid2(message) {
        return this._addCheck({
            kind: "cuid2",
            ...$508449958c1d885a$var$errorUtil.errToObj(message)
        });
    }
    ulid(message) {
        return this._addCheck({
            kind: "ulid",
            ...$508449958c1d885a$var$errorUtil.errToObj(message)
        });
    }
    base64(message) {
        return this._addCheck({
            kind: "base64",
            ...$508449958c1d885a$var$errorUtil.errToObj(message)
        });
    }
    ip(options) {
        return this._addCheck({
            kind: "ip",
            ...$508449958c1d885a$var$errorUtil.errToObj(options)
        });
    }
    datetime(options) {
        var _a, _b;
        if (typeof options === "string") return this._addCheck({
            kind: "datetime",
            precision: null,
            offset: false,
            local: false,
            message: options
        });
        return this._addCheck({
            kind: "datetime",
            precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
            offset: (_a = options === null || options === void 0 ? void 0 : options.offset) !== null && _a !== void 0 ? _a : false,
            local: (_b = options === null || options === void 0 ? void 0 : options.local) !== null && _b !== void 0 ? _b : false,
            ...$508449958c1d885a$var$errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
        });
    }
    date(message) {
        return this._addCheck({
            kind: "date",
            message: message
        });
    }
    time(options) {
        if (typeof options === "string") return this._addCheck({
            kind: "time",
            precision: null,
            message: options
        });
        return this._addCheck({
            kind: "time",
            precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
            ...$508449958c1d885a$var$errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
        });
    }
    duration(message) {
        return this._addCheck({
            kind: "duration",
            ...$508449958c1d885a$var$errorUtil.errToObj(message)
        });
    }
    regex(regex, message) {
        return this._addCheck({
            kind: "regex",
            regex: regex,
            ...$508449958c1d885a$var$errorUtil.errToObj(message)
        });
    }
    includes(value, options) {
        return this._addCheck({
            kind: "includes",
            value: value,
            position: options === null || options === void 0 ? void 0 : options.position,
            ...$508449958c1d885a$var$errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
        });
    }
    startsWith(value, message) {
        return this._addCheck({
            kind: "startsWith",
            value: value,
            ...$508449958c1d885a$var$errorUtil.errToObj(message)
        });
    }
    endsWith(value, message) {
        return this._addCheck({
            kind: "endsWith",
            value: value,
            ...$508449958c1d885a$var$errorUtil.errToObj(message)
        });
    }
    min(minLength, message) {
        return this._addCheck({
            kind: "min",
            value: minLength,
            ...$508449958c1d885a$var$errorUtil.errToObj(message)
        });
    }
    max(maxLength, message) {
        return this._addCheck({
            kind: "max",
            value: maxLength,
            ...$508449958c1d885a$var$errorUtil.errToObj(message)
        });
    }
    length(len, message) {
        return this._addCheck({
            kind: "length",
            value: len,
            ...$508449958c1d885a$var$errorUtil.errToObj(message)
        });
    }
    /**
     * @deprecated Use z.string().min(1) instead.
     * @see {@link ZodString.min}
     */ nonempty(message) {
        return this.min(1, $508449958c1d885a$var$errorUtil.errToObj(message));
    }
    trim() {
        return new $508449958c1d885a$export$1230eb29b8d3b502({
            ...this._def,
            checks: [
                ...this._def.checks,
                {
                    kind: "trim"
                }
            ]
        });
    }
    toLowerCase() {
        return new $508449958c1d885a$export$1230eb29b8d3b502({
            ...this._def,
            checks: [
                ...this._def.checks,
                {
                    kind: "toLowerCase"
                }
            ]
        });
    }
    toUpperCase() {
        return new $508449958c1d885a$export$1230eb29b8d3b502({
            ...this._def,
            checks: [
                ...this._def.checks,
                {
                    kind: "toUpperCase"
                }
            ]
        });
    }
    get isDatetime() {
        return !!this._def.checks.find((ch)=>ch.kind === "datetime");
    }
    get isDate() {
        return !!this._def.checks.find((ch)=>ch.kind === "date");
    }
    get isTime() {
        return !!this._def.checks.find((ch)=>ch.kind === "time");
    }
    get isDuration() {
        return !!this._def.checks.find((ch)=>ch.kind === "duration");
    }
    get isEmail() {
        return !!this._def.checks.find((ch)=>ch.kind === "email");
    }
    get isURL() {
        return !!this._def.checks.find((ch)=>ch.kind === "url");
    }
    get isEmoji() {
        return !!this._def.checks.find((ch)=>ch.kind === "emoji");
    }
    get isUUID() {
        return !!this._def.checks.find((ch)=>ch.kind === "uuid");
    }
    get isNANOID() {
        return !!this._def.checks.find((ch)=>ch.kind === "nanoid");
    }
    get isCUID() {
        return !!this._def.checks.find((ch)=>ch.kind === "cuid");
    }
    get isCUID2() {
        return !!this._def.checks.find((ch)=>ch.kind === "cuid2");
    }
    get isULID() {
        return !!this._def.checks.find((ch)=>ch.kind === "ulid");
    }
    get isIP() {
        return !!this._def.checks.find((ch)=>ch.kind === "ip");
    }
    get isBase64() {
        return !!this._def.checks.find((ch)=>ch.kind === "base64");
    }
    get minLength() {
        let min = null;
        for (const ch of this._def.checks){
            if (ch.kind === "min") {
                if (min === null || ch.value > min) min = ch.value;
            }
        }
        return min;
    }
    get maxLength() {
        let max = null;
        for (const ch of this._def.checks){
            if (ch.kind === "max") {
                if (max === null || ch.value < max) max = ch.value;
            }
        }
        return max;
    }
}
$508449958c1d885a$export$1230eb29b8d3b502.create = (params)=>{
    var _a;
    return new $508449958c1d885a$export$1230eb29b8d3b502({
        checks: [],
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodString,
        coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
};
// https://stackoverflow.com/questions/3966484/why-does-modulus-operator-return-fractional-number-in-javascript/31711034#31711034
function $508449958c1d885a$var$floatSafeRemainder(val, step) {
    const valDecCount = (val.toString().split(".")[1] || "").length;
    const stepDecCount = (step.toString().split(".")[1] || "").length;
    const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
    const valInt = parseInt(val.toFixed(decCount).replace(".", ""));
    const stepInt = parseInt(step.toFixed(decCount).replace(".", ""));
    return valInt % stepInt / Math.pow(10, decCount);
}
class $508449958c1d885a$export$5b070a55c0c43e09 extends $508449958c1d885a$export$19342e026b58ebb7 {
    constructor(){
        super(...arguments);
        this.min = this.gte;
        this.max = this.lte;
        this.step = this.multipleOf;
    }
    _parse(input) {
        if (this._def.coerce) input.data = Number(input.data);
        const parsedType = this._getType(input);
        if (parsedType !== $508449958c1d885a$export$5716da67bfaa244d.number) {
            const ctx = this._getOrReturnCtx(input);
            $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                code: $508449958c1d885a$export$5ba560653e4a1035.invalid_type,
                expected: $508449958c1d885a$export$5716da67bfaa244d.number,
                received: ctx.parsedType
            });
            return $508449958c1d885a$export$9a105a556e65c2c0;
        }
        let ctx = undefined;
        const status = new $508449958c1d885a$export$5b20a5c3d05c1f6f();
        for (const check of this._def.checks){
            if (check.kind === "int") {
                if (!$508449958c1d885a$export$7debb50ef11d5e0b.isInteger(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                        code: $508449958c1d885a$export$5ba560653e4a1035.invalid_type,
                        expected: "integer",
                        received: "float",
                        message: check.message
                    });
                    status.dirty();
                }
            } else if (check.kind === "min") {
                const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
                if (tooSmall) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                        code: $508449958c1d885a$export$5ba560653e4a1035.too_small,
                        minimum: check.value,
                        type: "number",
                        inclusive: check.inclusive,
                        exact: false,
                        message: check.message
                    });
                    status.dirty();
                }
            } else if (check.kind === "max") {
                const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
                if (tooBig) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                        code: $508449958c1d885a$export$5ba560653e4a1035.too_big,
                        maximum: check.value,
                        type: "number",
                        inclusive: check.inclusive,
                        exact: false,
                        message: check.message
                    });
                    status.dirty();
                }
            } else if (check.kind === "multipleOf") {
                if ($508449958c1d885a$var$floatSafeRemainder(input.data, check.value) !== 0) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                        code: $508449958c1d885a$export$5ba560653e4a1035.not_multiple_of,
                        multipleOf: check.value,
                        message: check.message
                    });
                    status.dirty();
                }
            } else if (check.kind === "finite") {
                if (!Number.isFinite(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                        code: $508449958c1d885a$export$5ba560653e4a1035.not_finite,
                        message: check.message
                    });
                    status.dirty();
                }
            } else $508449958c1d885a$export$7debb50ef11d5e0b.assertNever(check);
        }
        return {
            status: status.value,
            value: input.data
        };
    }
    gte(value, message) {
        return this.setLimit("min", value, true, $508449958c1d885a$var$errorUtil.toString(message));
    }
    gt(value, message) {
        return this.setLimit("min", value, false, $508449958c1d885a$var$errorUtil.toString(message));
    }
    lte(value, message) {
        return this.setLimit("max", value, true, $508449958c1d885a$var$errorUtil.toString(message));
    }
    lt(value, message) {
        return this.setLimit("max", value, false, $508449958c1d885a$var$errorUtil.toString(message));
    }
    setLimit(kind, value, inclusive, message) {
        return new $508449958c1d885a$export$5b070a55c0c43e09({
            ...this._def,
            checks: [
                ...this._def.checks,
                {
                    kind: kind,
                    value: value,
                    inclusive: inclusive,
                    message: $508449958c1d885a$var$errorUtil.toString(message)
                }
            ]
        });
    }
    _addCheck(check) {
        return new $508449958c1d885a$export$5b070a55c0c43e09({
            ...this._def,
            checks: [
                ...this._def.checks,
                check
            ]
        });
    }
    int(message) {
        return this._addCheck({
            kind: "int",
            message: $508449958c1d885a$var$errorUtil.toString(message)
        });
    }
    positive(message) {
        return this._addCheck({
            kind: "min",
            value: 0,
            inclusive: false,
            message: $508449958c1d885a$var$errorUtil.toString(message)
        });
    }
    negative(message) {
        return this._addCheck({
            kind: "max",
            value: 0,
            inclusive: false,
            message: $508449958c1d885a$var$errorUtil.toString(message)
        });
    }
    nonpositive(message) {
        return this._addCheck({
            kind: "max",
            value: 0,
            inclusive: true,
            message: $508449958c1d885a$var$errorUtil.toString(message)
        });
    }
    nonnegative(message) {
        return this._addCheck({
            kind: "min",
            value: 0,
            inclusive: true,
            message: $508449958c1d885a$var$errorUtil.toString(message)
        });
    }
    multipleOf(value, message) {
        return this._addCheck({
            kind: "multipleOf",
            value: value,
            message: $508449958c1d885a$var$errorUtil.toString(message)
        });
    }
    finite(message) {
        return this._addCheck({
            kind: "finite",
            message: $508449958c1d885a$var$errorUtil.toString(message)
        });
    }
    safe(message) {
        return this._addCheck({
            kind: "min",
            inclusive: true,
            value: Number.MIN_SAFE_INTEGER,
            message: $508449958c1d885a$var$errorUtil.toString(message)
        })._addCheck({
            kind: "max",
            inclusive: true,
            value: Number.MAX_SAFE_INTEGER,
            message: $508449958c1d885a$var$errorUtil.toString(message)
        });
    }
    get minValue() {
        let min = null;
        for (const ch of this._def.checks){
            if (ch.kind === "min") {
                if (min === null || ch.value > min) min = ch.value;
            }
        }
        return min;
    }
    get maxValue() {
        let max = null;
        for (const ch of this._def.checks){
            if (ch.kind === "max") {
                if (max === null || ch.value < max) max = ch.value;
            }
        }
        return max;
    }
    get isInt() {
        return !!this._def.checks.find((ch)=>ch.kind === "int" || ch.kind === "multipleOf" && $508449958c1d885a$export$7debb50ef11d5e0b.isInteger(ch.value));
    }
    get isFinite() {
        let max = null, min = null;
        for (const ch of this._def.checks){
            if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") return true;
            else if (ch.kind === "min") {
                if (min === null || ch.value > min) min = ch.value;
            } else if (ch.kind === "max") {
                if (max === null || ch.value < max) max = ch.value;
            }
        }
        return Number.isFinite(min) && Number.isFinite(max);
    }
}
$508449958c1d885a$export$5b070a55c0c43e09.create = (params)=>{
    return new $508449958c1d885a$export$5b070a55c0c43e09({
        checks: [],
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodNumber,
        coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
};
class $508449958c1d885a$export$67d741fd70ff98f4 extends $508449958c1d885a$export$19342e026b58ebb7 {
    constructor(){
        super(...arguments);
        this.min = this.gte;
        this.max = this.lte;
    }
    _parse(input) {
        if (this._def.coerce) input.data = BigInt(input.data);
        const parsedType = this._getType(input);
        if (parsedType !== $508449958c1d885a$export$5716da67bfaa244d.bigint) {
            const ctx = this._getOrReturnCtx(input);
            $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                code: $508449958c1d885a$export$5ba560653e4a1035.invalid_type,
                expected: $508449958c1d885a$export$5716da67bfaa244d.bigint,
                received: ctx.parsedType
            });
            return $508449958c1d885a$export$9a105a556e65c2c0;
        }
        let ctx = undefined;
        const status = new $508449958c1d885a$export$5b20a5c3d05c1f6f();
        for (const check of this._def.checks){
            if (check.kind === "min") {
                const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
                if (tooSmall) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                        code: $508449958c1d885a$export$5ba560653e4a1035.too_small,
                        type: "bigint",
                        minimum: check.value,
                        inclusive: check.inclusive,
                        message: check.message
                    });
                    status.dirty();
                }
            } else if (check.kind === "max") {
                const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
                if (tooBig) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                        code: $508449958c1d885a$export$5ba560653e4a1035.too_big,
                        type: "bigint",
                        maximum: check.value,
                        inclusive: check.inclusive,
                        message: check.message
                    });
                    status.dirty();
                }
            } else if (check.kind === "multipleOf") {
                if (input.data % check.value !== BigInt(0)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                        code: $508449958c1d885a$export$5ba560653e4a1035.not_multiple_of,
                        multipleOf: check.value,
                        message: check.message
                    });
                    status.dirty();
                }
            } else $508449958c1d885a$export$7debb50ef11d5e0b.assertNever(check);
        }
        return {
            status: status.value,
            value: input.data
        };
    }
    gte(value, message) {
        return this.setLimit("min", value, true, $508449958c1d885a$var$errorUtil.toString(message));
    }
    gt(value, message) {
        return this.setLimit("min", value, false, $508449958c1d885a$var$errorUtil.toString(message));
    }
    lte(value, message) {
        return this.setLimit("max", value, true, $508449958c1d885a$var$errorUtil.toString(message));
    }
    lt(value, message) {
        return this.setLimit("max", value, false, $508449958c1d885a$var$errorUtil.toString(message));
    }
    setLimit(kind, value, inclusive, message) {
        return new $508449958c1d885a$export$67d741fd70ff98f4({
            ...this._def,
            checks: [
                ...this._def.checks,
                {
                    kind: kind,
                    value: value,
                    inclusive: inclusive,
                    message: $508449958c1d885a$var$errorUtil.toString(message)
                }
            ]
        });
    }
    _addCheck(check) {
        return new $508449958c1d885a$export$67d741fd70ff98f4({
            ...this._def,
            checks: [
                ...this._def.checks,
                check
            ]
        });
    }
    positive(message) {
        return this._addCheck({
            kind: "min",
            value: BigInt(0),
            inclusive: false,
            message: $508449958c1d885a$var$errorUtil.toString(message)
        });
    }
    negative(message) {
        return this._addCheck({
            kind: "max",
            value: BigInt(0),
            inclusive: false,
            message: $508449958c1d885a$var$errorUtil.toString(message)
        });
    }
    nonpositive(message) {
        return this._addCheck({
            kind: "max",
            value: BigInt(0),
            inclusive: true,
            message: $508449958c1d885a$var$errorUtil.toString(message)
        });
    }
    nonnegative(message) {
        return this._addCheck({
            kind: "min",
            value: BigInt(0),
            inclusive: true,
            message: $508449958c1d885a$var$errorUtil.toString(message)
        });
    }
    multipleOf(value, message) {
        return this._addCheck({
            kind: "multipleOf",
            value: value,
            message: $508449958c1d885a$var$errorUtil.toString(message)
        });
    }
    get minValue() {
        let min = null;
        for (const ch of this._def.checks){
            if (ch.kind === "min") {
                if (min === null || ch.value > min) min = ch.value;
            }
        }
        return min;
    }
    get maxValue() {
        let max = null;
        for (const ch of this._def.checks){
            if (ch.kind === "max") {
                if (max === null || ch.value < max) max = ch.value;
            }
        }
        return max;
    }
}
$508449958c1d885a$export$67d741fd70ff98f4.create = (params)=>{
    var _a;
    return new $508449958c1d885a$export$67d741fd70ff98f4({
        checks: [],
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodBigInt,
        coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
};
class $508449958c1d885a$export$723d146f80596191 extends $508449958c1d885a$export$19342e026b58ebb7 {
    _parse(input) {
        if (this._def.coerce) input.data = Boolean(input.data);
        const parsedType = this._getType(input);
        if (parsedType !== $508449958c1d885a$export$5716da67bfaa244d.boolean) {
            const ctx = this._getOrReturnCtx(input);
            $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                code: $508449958c1d885a$export$5ba560653e4a1035.invalid_type,
                expected: $508449958c1d885a$export$5716da67bfaa244d.boolean,
                received: ctx.parsedType
            });
            return $508449958c1d885a$export$9a105a556e65c2c0;
        }
        return $508449958c1d885a$export$c6813a8d51f77eaf(input.data);
    }
}
$508449958c1d885a$export$723d146f80596191.create = (params)=>{
    return new $508449958c1d885a$export$723d146f80596191({
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodBoolean,
        coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
};
class $508449958c1d885a$export$e974be33bdc55521 extends $508449958c1d885a$export$19342e026b58ebb7 {
    _parse(input) {
        if (this._def.coerce) input.data = new Date(input.data);
        const parsedType = this._getType(input);
        if (parsedType !== $508449958c1d885a$export$5716da67bfaa244d.date) {
            const ctx = this._getOrReturnCtx(input);
            $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                code: $508449958c1d885a$export$5ba560653e4a1035.invalid_type,
                expected: $508449958c1d885a$export$5716da67bfaa244d.date,
                received: ctx.parsedType
            });
            return $508449958c1d885a$export$9a105a556e65c2c0;
        }
        if (isNaN(input.data.getTime())) {
            const ctx = this._getOrReturnCtx(input);
            $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                code: $508449958c1d885a$export$5ba560653e4a1035.invalid_date
            });
            return $508449958c1d885a$export$9a105a556e65c2c0;
        }
        const status = new $508449958c1d885a$export$5b20a5c3d05c1f6f();
        let ctx = undefined;
        for (const check of this._def.checks){
            if (check.kind === "min") {
                if (input.data.getTime() < check.value) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                        code: $508449958c1d885a$export$5ba560653e4a1035.too_small,
                        message: check.message,
                        inclusive: true,
                        exact: false,
                        minimum: check.value,
                        type: "date"
                    });
                    status.dirty();
                }
            } else if (check.kind === "max") {
                if (input.data.getTime() > check.value) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                        code: $508449958c1d885a$export$5ba560653e4a1035.too_big,
                        message: check.message,
                        inclusive: true,
                        exact: false,
                        maximum: check.value,
                        type: "date"
                    });
                    status.dirty();
                }
            } else $508449958c1d885a$export$7debb50ef11d5e0b.assertNever(check);
        }
        return {
            status: status.value,
            value: new Date(input.data.getTime())
        };
    }
    _addCheck(check) {
        return new $508449958c1d885a$export$e974be33bdc55521({
            ...this._def,
            checks: [
                ...this._def.checks,
                check
            ]
        });
    }
    min(minDate, message) {
        return this._addCheck({
            kind: "min",
            value: minDate.getTime(),
            message: $508449958c1d885a$var$errorUtil.toString(message)
        });
    }
    max(maxDate, message) {
        return this._addCheck({
            kind: "max",
            value: maxDate.getTime(),
            message: $508449958c1d885a$var$errorUtil.toString(message)
        });
    }
    get minDate() {
        let min = null;
        for (const ch of this._def.checks){
            if (ch.kind === "min") {
                if (min === null || ch.value > min) min = ch.value;
            }
        }
        return min != null ? new Date(min) : null;
    }
    get maxDate() {
        let max = null;
        for (const ch of this._def.checks){
            if (ch.kind === "max") {
                if (max === null || ch.value < max) max = ch.value;
            }
        }
        return max != null ? new Date(max) : null;
    }
}
$508449958c1d885a$export$e974be33bdc55521.create = (params)=>{
    return new $508449958c1d885a$export$e974be33bdc55521({
        checks: [],
        coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodDate,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
};
class $508449958c1d885a$export$bcc3b40f6b638044 extends $508449958c1d885a$export$19342e026b58ebb7 {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== $508449958c1d885a$export$5716da67bfaa244d.symbol) {
            const ctx = this._getOrReturnCtx(input);
            $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                code: $508449958c1d885a$export$5ba560653e4a1035.invalid_type,
                expected: $508449958c1d885a$export$5716da67bfaa244d.symbol,
                received: ctx.parsedType
            });
            return $508449958c1d885a$export$9a105a556e65c2c0;
        }
        return $508449958c1d885a$export$c6813a8d51f77eaf(input.data);
    }
}
$508449958c1d885a$export$bcc3b40f6b638044.create = (params)=>{
    return new $508449958c1d885a$export$bcc3b40f6b638044({
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodSymbol,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
};
class $508449958c1d885a$export$4e780e961c30340d extends $508449958c1d885a$export$19342e026b58ebb7 {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== $508449958c1d885a$export$5716da67bfaa244d.undefined) {
            const ctx = this._getOrReturnCtx(input);
            $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                code: $508449958c1d885a$export$5ba560653e4a1035.invalid_type,
                expected: $508449958c1d885a$export$5716da67bfaa244d.undefined,
                received: ctx.parsedType
            });
            return $508449958c1d885a$export$9a105a556e65c2c0;
        }
        return $508449958c1d885a$export$c6813a8d51f77eaf(input.data);
    }
}
$508449958c1d885a$export$4e780e961c30340d.create = (params)=>{
    return new $508449958c1d885a$export$4e780e961c30340d({
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodUndefined,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
};
class $508449958c1d885a$export$a96281f914484f2d extends $508449958c1d885a$export$19342e026b58ebb7 {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== $508449958c1d885a$export$5716da67bfaa244d.null) {
            const ctx = this._getOrReturnCtx(input);
            $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                code: $508449958c1d885a$export$5ba560653e4a1035.invalid_type,
                expected: $508449958c1d885a$export$5716da67bfaa244d.null,
                received: ctx.parsedType
            });
            return $508449958c1d885a$export$9a105a556e65c2c0;
        }
        return $508449958c1d885a$export$c6813a8d51f77eaf(input.data);
    }
}
$508449958c1d885a$export$a96281f914484f2d.create = (params)=>{
    return new $508449958c1d885a$export$a96281f914484f2d({
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodNull,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
};
class $508449958c1d885a$export$b9d1edb536b4e4eb extends $508449958c1d885a$export$19342e026b58ebb7 {
    constructor(){
        super(...arguments);
        // to prevent instances of other classes from extending ZodAny. this causes issues with catchall in ZodObject.
        this._any = true;
    }
    _parse(input) {
        return $508449958c1d885a$export$c6813a8d51f77eaf(input.data);
    }
}
$508449958c1d885a$export$b9d1edb536b4e4eb.create = (params)=>{
    return new $508449958c1d885a$export$b9d1edb536b4e4eb({
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodAny,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
};
class $508449958c1d885a$export$ef3b1bb1630977ae extends $508449958c1d885a$export$19342e026b58ebb7 {
    constructor(){
        super(...arguments);
        // required
        this._unknown = true;
    }
    _parse(input) {
        return $508449958c1d885a$export$c6813a8d51f77eaf(input.data);
    }
}
$508449958c1d885a$export$ef3b1bb1630977ae.create = (params)=>{
    return new $508449958c1d885a$export$ef3b1bb1630977ae({
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodUnknown,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
};
class $508449958c1d885a$export$1e576a20c3ce9fb5 extends $508449958c1d885a$export$19342e026b58ebb7 {
    _parse(input) {
        const ctx = this._getOrReturnCtx(input);
        $508449958c1d885a$export$db7caee60e5d514d(ctx, {
            code: $508449958c1d885a$export$5ba560653e4a1035.invalid_type,
            expected: $508449958c1d885a$export$5716da67bfaa244d.never,
            received: ctx.parsedType
        });
        return $508449958c1d885a$export$9a105a556e65c2c0;
    }
}
$508449958c1d885a$export$1e576a20c3ce9fb5.create = (params)=>{
    return new $508449958c1d885a$export$1e576a20c3ce9fb5({
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodNever,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
};
class $508449958c1d885a$export$7d39f5df85f21031 extends $508449958c1d885a$export$19342e026b58ebb7 {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== $508449958c1d885a$export$5716da67bfaa244d.undefined) {
            const ctx = this._getOrReturnCtx(input);
            $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                code: $508449958c1d885a$export$5ba560653e4a1035.invalid_type,
                expected: $508449958c1d885a$export$5716da67bfaa244d.void,
                received: ctx.parsedType
            });
            return $508449958c1d885a$export$9a105a556e65c2c0;
        }
        return $508449958c1d885a$export$c6813a8d51f77eaf(input.data);
    }
}
$508449958c1d885a$export$7d39f5df85f21031.create = (params)=>{
    return new $508449958c1d885a$export$7d39f5df85f21031({
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodVoid,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
};
class $508449958c1d885a$export$7acfc3e64785411 extends $508449958c1d885a$export$19342e026b58ebb7 {
    _parse(input) {
        const { ctx: ctx, status: status } = this._processInputParams(input);
        const def = this._def;
        if (ctx.parsedType !== $508449958c1d885a$export$5716da67bfaa244d.array) {
            $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                code: $508449958c1d885a$export$5ba560653e4a1035.invalid_type,
                expected: $508449958c1d885a$export$5716da67bfaa244d.array,
                received: ctx.parsedType
            });
            return $508449958c1d885a$export$9a105a556e65c2c0;
        }
        if (def.exactLength !== null) {
            const tooBig = ctx.data.length > def.exactLength.value;
            const tooSmall = ctx.data.length < def.exactLength.value;
            if (tooBig || tooSmall) {
                $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                    code: tooBig ? $508449958c1d885a$export$5ba560653e4a1035.too_big : $508449958c1d885a$export$5ba560653e4a1035.too_small,
                    minimum: tooSmall ? def.exactLength.value : undefined,
                    maximum: tooBig ? def.exactLength.value : undefined,
                    type: "array",
                    inclusive: true,
                    exact: true,
                    message: def.exactLength.message
                });
                status.dirty();
            }
        }
        if (def.minLength !== null) {
            if (ctx.data.length < def.minLength.value) {
                $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                    code: $508449958c1d885a$export$5ba560653e4a1035.too_small,
                    minimum: def.minLength.value,
                    type: "array",
                    inclusive: true,
                    exact: false,
                    message: def.minLength.message
                });
                status.dirty();
            }
        }
        if (def.maxLength !== null) {
            if (ctx.data.length > def.maxLength.value) {
                $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                    code: $508449958c1d885a$export$5ba560653e4a1035.too_big,
                    maximum: def.maxLength.value,
                    type: "array",
                    inclusive: true,
                    exact: false,
                    message: def.maxLength.message
                });
                status.dirty();
            }
        }
        if (ctx.common.async) return Promise.all([
            ...ctx.data
        ].map((item, i)=>{
            return def.type._parseAsync(new $508449958c1d885a$var$ParseInputLazyPath(ctx, item, ctx.path, i));
        })).then((result)=>{
            return $508449958c1d885a$export$5b20a5c3d05c1f6f.mergeArray(status, result);
        });
        const result = [
            ...ctx.data
        ].map((item, i)=>{
            return def.type._parseSync(new $508449958c1d885a$var$ParseInputLazyPath(ctx, item, ctx.path, i));
        });
        return $508449958c1d885a$export$5b20a5c3d05c1f6f.mergeArray(status, result);
    }
    get element() {
        return this._def.type;
    }
    min(minLength, message) {
        return new $508449958c1d885a$export$7acfc3e64785411({
            ...this._def,
            minLength: {
                value: minLength,
                message: $508449958c1d885a$var$errorUtil.toString(message)
            }
        });
    }
    max(maxLength, message) {
        return new $508449958c1d885a$export$7acfc3e64785411({
            ...this._def,
            maxLength: {
                value: maxLength,
                message: $508449958c1d885a$var$errorUtil.toString(message)
            }
        });
    }
    length(len, message) {
        return new $508449958c1d885a$export$7acfc3e64785411({
            ...this._def,
            exactLength: {
                value: len,
                message: $508449958c1d885a$var$errorUtil.toString(message)
            }
        });
    }
    nonempty(message) {
        return this.min(1, message);
    }
}
$508449958c1d885a$export$7acfc3e64785411.create = (schema, params)=>{
    return new $508449958c1d885a$export$7acfc3e64785411({
        type: schema,
        minLength: null,
        maxLength: null,
        exactLength: null,
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodArray,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
};
function $508449958c1d885a$var$deepPartialify(schema) {
    if (schema instanceof $508449958c1d885a$export$736315c5b55efbad) {
        const newShape = {};
        for(const key in schema.shape){
            const fieldSchema = schema.shape[key];
            newShape[key] = $508449958c1d885a$export$aa56fec1e9d629b8.create($508449958c1d885a$var$deepPartialify(fieldSchema));
        }
        return new $508449958c1d885a$export$736315c5b55efbad({
            ...schema._def,
            shape: ()=>newShape
        });
    } else if (schema instanceof $508449958c1d885a$export$7acfc3e64785411) return new $508449958c1d885a$export$7acfc3e64785411({
        ...schema._def,
        type: $508449958c1d885a$var$deepPartialify(schema.element)
    });
    else if (schema instanceof $508449958c1d885a$export$aa56fec1e9d629b8) return $508449958c1d885a$export$aa56fec1e9d629b8.create($508449958c1d885a$var$deepPartialify(schema.unwrap()));
    else if (schema instanceof $508449958c1d885a$export$aaac0b8b429cef5) return $508449958c1d885a$export$aaac0b8b429cef5.create($508449958c1d885a$var$deepPartialify(schema.unwrap()));
    else if (schema instanceof $508449958c1d885a$export$e2a18bb771d8e6a3) return $508449958c1d885a$export$e2a18bb771d8e6a3.create(schema.items.map((item)=>$508449958c1d885a$var$deepPartialify(item)));
    else return schema;
}
class $508449958c1d885a$export$736315c5b55efbad extends $508449958c1d885a$export$19342e026b58ebb7 {
    constructor(){
        super(...arguments);
        this._cached = null;
        /**
         * @deprecated In most cases, this is no longer needed - unknown properties are now silently stripped.
         * If you want to pass through unknown properties, use `.passthrough()` instead.
         */ this.nonstrict = this.passthrough;
        // extend<
        //   Augmentation extends ZodRawShape,
        //   NewOutput extends util.flatten<{
        //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
        //       ? Augmentation[k]["_output"]
        //       : k extends keyof Output
        //       ? Output[k]
        //       : never;
        //   }>,
        //   NewInput extends util.flatten<{
        //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
        //       ? Augmentation[k]["_input"]
        //       : k extends keyof Input
        //       ? Input[k]
        //       : never;
        //   }>
        // >(
        //   augmentation: Augmentation
        // ): ZodObject<
        //   extendShape<T, Augmentation>,
        //   UnknownKeys,
        //   Catchall,
        //   NewOutput,
        //   NewInput
        // > {
        //   return new ZodObject({
        //     ...this._def,
        //     shape: () => ({
        //       ...this._def.shape(),
        //       ...augmentation,
        //     }),
        //   }) as any;
        // }
        /**
         * @deprecated Use `.extend` instead
         *  */ this.augment = this.extend;
    }
    _getCached() {
        if (this._cached !== null) return this._cached;
        const shape = this._def.shape();
        const keys = $508449958c1d885a$export$7debb50ef11d5e0b.objectKeys(shape);
        return this._cached = {
            shape: shape,
            keys: keys
        };
    }
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== $508449958c1d885a$export$5716da67bfaa244d.object) {
            const ctx = this._getOrReturnCtx(input);
            $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                code: $508449958c1d885a$export$5ba560653e4a1035.invalid_type,
                expected: $508449958c1d885a$export$5716da67bfaa244d.object,
                received: ctx.parsedType
            });
            return $508449958c1d885a$export$9a105a556e65c2c0;
        }
        const { status: status, ctx: ctx } = this._processInputParams(input);
        const { shape: shape, keys: shapeKeys } = this._getCached();
        const extraKeys = [];
        if (!(this._def.catchall instanceof $508449958c1d885a$export$1e576a20c3ce9fb5 && this._def.unknownKeys === "strip")) {
            for(const key in ctx.data)if (!shapeKeys.includes(key)) extraKeys.push(key);
        }
        const pairs = [];
        for (const key of shapeKeys){
            const keyValidator = shape[key];
            const value = ctx.data[key];
            pairs.push({
                key: {
                    status: "valid",
                    value: key
                },
                value: keyValidator._parse(new $508449958c1d885a$var$ParseInputLazyPath(ctx, value, ctx.path, key)),
                alwaysSet: key in ctx.data
            });
        }
        if (this._def.catchall instanceof $508449958c1d885a$export$1e576a20c3ce9fb5) {
            const unknownKeys = this._def.unknownKeys;
            if (unknownKeys === "passthrough") for (const key of extraKeys)pairs.push({
                key: {
                    status: "valid",
                    value: key
                },
                value: {
                    status: "valid",
                    value: ctx.data[key]
                }
            });
            else if (unknownKeys === "strict") {
                if (extraKeys.length > 0) {
                    $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                        code: $508449958c1d885a$export$5ba560653e4a1035.unrecognized_keys,
                        keys: extraKeys
                    });
                    status.dirty();
                }
            } else if (unknownKeys === "strip") ;
            else throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
        } else {
            // run catchall validation
            const catchall = this._def.catchall;
            for (const key of extraKeys){
                const value = ctx.data[key];
                pairs.push({
                    key: {
                        status: "valid",
                        value: key
                    },
                    value: catchall._parse(new $508449958c1d885a$var$ParseInputLazyPath(ctx, value, ctx.path, key) //, ctx.child(key), value, getParsedType(value)
                    ),
                    alwaysSet: key in ctx.data
                });
            }
        }
        if (ctx.common.async) return Promise.resolve().then(async ()=>{
            const syncPairs = [];
            for (const pair of pairs){
                const key = await pair.key;
                const value = await pair.value;
                syncPairs.push({
                    key: key,
                    value: value,
                    alwaysSet: pair.alwaysSet
                });
            }
            return syncPairs;
        }).then((syncPairs)=>{
            return $508449958c1d885a$export$5b20a5c3d05c1f6f.mergeObjectSync(status, syncPairs);
        });
        else return $508449958c1d885a$export$5b20a5c3d05c1f6f.mergeObjectSync(status, pairs);
    }
    get shape() {
        return this._def.shape();
    }
    strict(message) {
        $508449958c1d885a$var$errorUtil.errToObj;
        return new $508449958c1d885a$export$736315c5b55efbad({
            ...this._def,
            unknownKeys: "strict",
            ...message !== undefined ? {
                errorMap: (issue, ctx)=>{
                    var _a, _b, _c, _d;
                    const defaultError = (_c = (_b = (_a = this._def).errorMap) === null || _b === void 0 ? void 0 : _b.call(_a, issue, ctx).message) !== null && _c !== void 0 ? _c : ctx.defaultError;
                    if (issue.code === "unrecognized_keys") return {
                        message: (_d = $508449958c1d885a$var$errorUtil.errToObj(message).message) !== null && _d !== void 0 ? _d : defaultError
                    };
                    return {
                        message: defaultError
                    };
                }
            } : {}
        });
    }
    strip() {
        return new $508449958c1d885a$export$736315c5b55efbad({
            ...this._def,
            unknownKeys: "strip"
        });
    }
    passthrough() {
        return new $508449958c1d885a$export$736315c5b55efbad({
            ...this._def,
            unknownKeys: "passthrough"
        });
    }
    // const AugmentFactory =
    //   <Def extends ZodObjectDef>(def: Def) =>
    //   <Augmentation extends ZodRawShape>(
    //     augmentation: Augmentation
    //   ): ZodObject<
    //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
    //     Def["unknownKeys"],
    //     Def["catchall"]
    //   > => {
    //     return new ZodObject({
    //       ...def,
    //       shape: () => ({
    //         ...def.shape(),
    //         ...augmentation,
    //       }),
    //     }) as any;
    //   };
    extend(augmentation) {
        return new $508449958c1d885a$export$736315c5b55efbad({
            ...this._def,
            shape: ()=>({
                    ...this._def.shape(),
                    ...augmentation
                })
        });
    }
    /**
     * Prior to zod@1.0.12 there was a bug in the
     * inferred type of merged objects. Please
     * upgrade if you are experiencing issues.
     */ merge(merging) {
        const merged = new $508449958c1d885a$export$736315c5b55efbad({
            unknownKeys: merging._def.unknownKeys,
            catchall: merging._def.catchall,
            shape: ()=>({
                    ...this._def.shape(),
                    ...merging._def.shape()
                }),
            typeName: $508449958c1d885a$export$558106ce543bd011.ZodObject
        });
        return merged;
    }
    // merge<
    //   Incoming extends AnyZodObject,
    //   Augmentation extends Incoming["shape"],
    //   NewOutput extends {
    //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
    //       ? Augmentation[k]["_output"]
    //       : k extends keyof Output
    //       ? Output[k]
    //       : never;
    //   },
    //   NewInput extends {
    //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
    //       ? Augmentation[k]["_input"]
    //       : k extends keyof Input
    //       ? Input[k]
    //       : never;
    //   }
    // >(
    //   merging: Incoming
    // ): ZodObject<
    //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
    //   Incoming["_def"]["unknownKeys"],
    //   Incoming["_def"]["catchall"],
    //   NewOutput,
    //   NewInput
    // > {
    //   const merged: any = new ZodObject({
    //     unknownKeys: merging._def.unknownKeys,
    //     catchall: merging._def.catchall,
    //     shape: () =>
    //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
    //     typeName: ZodFirstPartyTypeKind.ZodObject,
    //   }) as any;
    //   return merged;
    // }
    setKey(key, schema) {
        return this.augment({
            [key]: schema
        });
    }
    // merge<Incoming extends AnyZodObject>(
    //   merging: Incoming
    // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
    // ZodObject<
    //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
    //   Incoming["_def"]["unknownKeys"],
    //   Incoming["_def"]["catchall"]
    // > {
    //   // const mergedShape = objectUtil.mergeShapes(
    //   //   this._def.shape(),
    //   //   merging._def.shape()
    //   // );
    //   const merged: any = new ZodObject({
    //     unknownKeys: merging._def.unknownKeys,
    //     catchall: merging._def.catchall,
    //     shape: () =>
    //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
    //     typeName: ZodFirstPartyTypeKind.ZodObject,
    //   }) as any;
    //   return merged;
    // }
    catchall(index) {
        return new $508449958c1d885a$export$736315c5b55efbad({
            ...this._def,
            catchall: index
        });
    }
    pick(mask) {
        const shape = {};
        $508449958c1d885a$export$7debb50ef11d5e0b.objectKeys(mask).forEach((key)=>{
            if (mask[key] && this.shape[key]) shape[key] = this.shape[key];
        });
        return new $508449958c1d885a$export$736315c5b55efbad({
            ...this._def,
            shape: ()=>shape
        });
    }
    omit(mask) {
        const shape = {};
        $508449958c1d885a$export$7debb50ef11d5e0b.objectKeys(this.shape).forEach((key)=>{
            if (!mask[key]) shape[key] = this.shape[key];
        });
        return new $508449958c1d885a$export$736315c5b55efbad({
            ...this._def,
            shape: ()=>shape
        });
    }
    /**
     * @deprecated
     */ deepPartial() {
        return $508449958c1d885a$var$deepPartialify(this);
    }
    partial(mask) {
        const newShape = {};
        $508449958c1d885a$export$7debb50ef11d5e0b.objectKeys(this.shape).forEach((key)=>{
            const fieldSchema = this.shape[key];
            if (mask && !mask[key]) newShape[key] = fieldSchema;
            else newShape[key] = fieldSchema.optional();
        });
        return new $508449958c1d885a$export$736315c5b55efbad({
            ...this._def,
            shape: ()=>newShape
        });
    }
    required(mask) {
        const newShape = {};
        $508449958c1d885a$export$7debb50ef11d5e0b.objectKeys(this.shape).forEach((key)=>{
            if (mask && !mask[key]) newShape[key] = this.shape[key];
            else {
                const fieldSchema = this.shape[key];
                let newField = fieldSchema;
                while(newField instanceof $508449958c1d885a$export$aa56fec1e9d629b8)newField = newField._def.innerType;
                newShape[key] = newField;
            }
        });
        return new $508449958c1d885a$export$736315c5b55efbad({
            ...this._def,
            shape: ()=>newShape
        });
    }
    keyof() {
        return $508449958c1d885a$var$createZodEnum($508449958c1d885a$export$7debb50ef11d5e0b.objectKeys(this.shape));
    }
}
$508449958c1d885a$export$736315c5b55efbad.create = (shape, params)=>{
    return new $508449958c1d885a$export$736315c5b55efbad({
        shape: ()=>shape,
        unknownKeys: "strip",
        catchall: $508449958c1d885a$export$1e576a20c3ce9fb5.create(),
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodObject,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
};
$508449958c1d885a$export$736315c5b55efbad.strictCreate = (shape, params)=>{
    return new $508449958c1d885a$export$736315c5b55efbad({
        shape: ()=>shape,
        unknownKeys: "strict",
        catchall: $508449958c1d885a$export$1e576a20c3ce9fb5.create(),
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodObject,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
};
$508449958c1d885a$export$736315c5b55efbad.lazycreate = (shape, params)=>{
    return new $508449958c1d885a$export$736315c5b55efbad({
        shape: shape,
        unknownKeys: "strip",
        catchall: $508449958c1d885a$export$1e576a20c3ce9fb5.create(),
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodObject,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
};
class $508449958c1d885a$export$a8b236cb5070a311 extends $508449958c1d885a$export$19342e026b58ebb7 {
    _parse(input) {
        const { ctx: ctx } = this._processInputParams(input);
        const options = this._def.options;
        function handleResults(results) {
            // return first issue-free validation if it exists
            for (const result of results){
                if (result.result.status === "valid") return result.result;
            }
            for (const result of results)if (result.result.status === "dirty") {
                // add issues from dirty option
                ctx.common.issues.push(...result.ctx.common.issues);
                return result.result;
            }
            // return invalid
            const unionErrors = results.map((result)=>new $508449958c1d885a$export$f98dac4b251ab333(result.ctx.common.issues));
            $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                code: $508449958c1d885a$export$5ba560653e4a1035.invalid_union,
                unionErrors: unionErrors
            });
            return $508449958c1d885a$export$9a105a556e65c2c0;
        }
        if (ctx.common.async) return Promise.all(options.map(async (option)=>{
            const childCtx = {
                ...ctx,
                common: {
                    ...ctx.common,
                    issues: []
                },
                parent: null
            };
            return {
                result: await option._parseAsync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: childCtx
                }),
                ctx: childCtx
            };
        })).then(handleResults);
        else {
            let dirty = undefined;
            const issues = [];
            for (const option of options){
                const childCtx = {
                    ...ctx,
                    common: {
                        ...ctx.common,
                        issues: []
                    },
                    parent: null
                };
                const result = option._parseSync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: childCtx
                });
                if (result.status === "valid") return result;
                else if (result.status === "dirty" && !dirty) dirty = {
                    result: result,
                    ctx: childCtx
                };
                if (childCtx.common.issues.length) issues.push(childCtx.common.issues);
            }
            if (dirty) {
                ctx.common.issues.push(...dirty.ctx.common.issues);
                return dirty.result;
            }
            const unionErrors = issues.map((issues)=>new $508449958c1d885a$export$f98dac4b251ab333(issues));
            $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                code: $508449958c1d885a$export$5ba560653e4a1035.invalid_union,
                unionErrors: unionErrors
            });
            return $508449958c1d885a$export$9a105a556e65c2c0;
        }
    }
    get options() {
        return this._def.options;
    }
}
$508449958c1d885a$export$a8b236cb5070a311.create = (types, params)=>{
    return new $508449958c1d885a$export$a8b236cb5070a311({
        options: types,
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodUnion,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
};
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
//////////                                 //////////
//////////      ZodDiscriminatedUnion      //////////
//////////                                 //////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
const $508449958c1d885a$var$getDiscriminator = (type)=>{
    if (type instanceof $508449958c1d885a$export$378d0cfce37406e6) return $508449958c1d885a$var$getDiscriminator(type.schema);
    else if (type instanceof $508449958c1d885a$export$a60af00cc0ce2582) return $508449958c1d885a$var$getDiscriminator(type.innerType());
    else if (type instanceof $508449958c1d885a$export$7e44096782a165d3) return [
        type.value
    ];
    else if (type instanceof $508449958c1d885a$export$d325d1f0e1c20179) return type.options;
    else if (type instanceof $508449958c1d885a$export$370b2e8d6d6f5c56) // eslint-disable-next-line ban/ban
    return $508449958c1d885a$export$7debb50ef11d5e0b.objectValues(type.enum);
    else if (type instanceof $508449958c1d885a$export$bb19b37874861e7e) return $508449958c1d885a$var$getDiscriminator(type._def.innerType);
    else if (type instanceof $508449958c1d885a$export$4e780e961c30340d) return [
        undefined
    ];
    else if (type instanceof $508449958c1d885a$export$a96281f914484f2d) return [
        null
    ];
    else if (type instanceof $508449958c1d885a$export$aa56fec1e9d629b8) return [
        undefined,
        ...$508449958c1d885a$var$getDiscriminator(type.unwrap())
    ];
    else if (type instanceof $508449958c1d885a$export$aaac0b8b429cef5) return [
        null,
        ...$508449958c1d885a$var$getDiscriminator(type.unwrap())
    ];
    else if (type instanceof $508449958c1d885a$export$66b0c798a395271f) return $508449958c1d885a$var$getDiscriminator(type.unwrap());
    else if (type instanceof $508449958c1d885a$export$5d1f7ef05c4e493a) return $508449958c1d885a$var$getDiscriminator(type.unwrap());
    else if (type instanceof $508449958c1d885a$export$75a44ec6249ac76b) return $508449958c1d885a$var$getDiscriminator(type._def.innerType);
    else return [];
};
class $508449958c1d885a$export$5ef2424805ac76a3 extends $508449958c1d885a$export$19342e026b58ebb7 {
    _parse(input) {
        const { ctx: ctx } = this._processInputParams(input);
        if (ctx.parsedType !== $508449958c1d885a$export$5716da67bfaa244d.object) {
            $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                code: $508449958c1d885a$export$5ba560653e4a1035.invalid_type,
                expected: $508449958c1d885a$export$5716da67bfaa244d.object,
                received: ctx.parsedType
            });
            return $508449958c1d885a$export$9a105a556e65c2c0;
        }
        const discriminator = this.discriminator;
        const discriminatorValue = ctx.data[discriminator];
        const option = this.optionsMap.get(discriminatorValue);
        if (!option) {
            $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                code: $508449958c1d885a$export$5ba560653e4a1035.invalid_union_discriminator,
                options: Array.from(this.optionsMap.keys()),
                path: [
                    discriminator
                ]
            });
            return $508449958c1d885a$export$9a105a556e65c2c0;
        }
        if (ctx.common.async) return option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
        });
        else return option._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
        });
    }
    get discriminator() {
        return this._def.discriminator;
    }
    get options() {
        return this._def.options;
    }
    get optionsMap() {
        return this._def.optionsMap;
    }
    /**
     * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
     * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
     * have a different value for each object in the union.
     * @param discriminator the name of the discriminator property
     * @param types an array of object schemas
     * @param params
     */ static create(discriminator, options, params) {
        // Get all the valid discriminator values
        const optionsMap = new Map();
        // try {
        for (const type of options){
            const discriminatorValues = $508449958c1d885a$var$getDiscriminator(type.shape[discriminator]);
            if (!discriminatorValues.length) throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
            for (const value of discriminatorValues){
                if (optionsMap.has(value)) throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
                optionsMap.set(value, type);
            }
        }
        return new $508449958c1d885a$export$5ef2424805ac76a3({
            typeName: $508449958c1d885a$export$558106ce543bd011.ZodDiscriminatedUnion,
            discriminator: discriminator,
            options: options,
            optionsMap: optionsMap,
            ...$508449958c1d885a$var$processCreateParams(params)
        });
    }
}
function $508449958c1d885a$var$mergeValues(a, b) {
    const aType = $508449958c1d885a$export$3e9057828ebd5c7a(a);
    const bType = $508449958c1d885a$export$3e9057828ebd5c7a(b);
    if (a === b) return {
        valid: true,
        data: a
    };
    else if (aType === $508449958c1d885a$export$5716da67bfaa244d.object && bType === $508449958c1d885a$export$5716da67bfaa244d.object) {
        const bKeys = $508449958c1d885a$export$7debb50ef11d5e0b.objectKeys(b);
        const sharedKeys = $508449958c1d885a$export$7debb50ef11d5e0b.objectKeys(a).filter((key)=>bKeys.indexOf(key) !== -1);
        const newObj = {
            ...a,
            ...b
        };
        for (const key of sharedKeys){
            const sharedValue = $508449958c1d885a$var$mergeValues(a[key], b[key]);
            if (!sharedValue.valid) return {
                valid: false
            };
            newObj[key] = sharedValue.data;
        }
        return {
            valid: true,
            data: newObj
        };
    } else if (aType === $508449958c1d885a$export$5716da67bfaa244d.array && bType === $508449958c1d885a$export$5716da67bfaa244d.array) {
        if (a.length !== b.length) return {
            valid: false
        };
        const newArray = [];
        for(let index = 0; index < a.length; index++){
            const itemA = a[index];
            const itemB = b[index];
            const sharedValue = $508449958c1d885a$var$mergeValues(itemA, itemB);
            if (!sharedValue.valid) return {
                valid: false
            };
            newArray.push(sharedValue.data);
        }
        return {
            valid: true,
            data: newArray
        };
    } else if (aType === $508449958c1d885a$export$5716da67bfaa244d.date && bType === $508449958c1d885a$export$5716da67bfaa244d.date && +a === +b) return {
        valid: true,
        data: a
    };
    else return {
        valid: false
    };
}
class $508449958c1d885a$export$c02deaf0bb5203d4 extends $508449958c1d885a$export$19342e026b58ebb7 {
    _parse(input) {
        const { status: status, ctx: ctx } = this._processInputParams(input);
        const handleParsed = (parsedLeft, parsedRight)=>{
            if ($508449958c1d885a$export$afa861e3c5730743(parsedLeft) || $508449958c1d885a$export$afa861e3c5730743(parsedRight)) return $508449958c1d885a$export$9a105a556e65c2c0;
            const merged = $508449958c1d885a$var$mergeValues(parsedLeft.value, parsedRight.value);
            if (!merged.valid) {
                $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                    code: $508449958c1d885a$export$5ba560653e4a1035.invalid_intersection_types
                });
                return $508449958c1d885a$export$9a105a556e65c2c0;
            }
            if ($508449958c1d885a$export$910b6cdd390341b3(parsedLeft) || $508449958c1d885a$export$910b6cdd390341b3(parsedRight)) status.dirty();
            return {
                status: status.value,
                value: merged.data
            };
        };
        if (ctx.common.async) return Promise.all([
            this._def.left._parseAsync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx
            }),
            this._def.right._parseAsync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx
            })
        ]).then(([left, right])=>handleParsed(left, right));
        else return handleParsed(this._def.left._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
        }), this._def.right._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
        }));
    }
}
$508449958c1d885a$export$c02deaf0bb5203d4.create = (left, right, params)=>{
    return new $508449958c1d885a$export$c02deaf0bb5203d4({
        left: left,
        right: right,
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodIntersection,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
};
class $508449958c1d885a$export$e2a18bb771d8e6a3 extends $508449958c1d885a$export$19342e026b58ebb7 {
    _parse(input) {
        const { status: status, ctx: ctx } = this._processInputParams(input);
        if (ctx.parsedType !== $508449958c1d885a$export$5716da67bfaa244d.array) {
            $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                code: $508449958c1d885a$export$5ba560653e4a1035.invalid_type,
                expected: $508449958c1d885a$export$5716da67bfaa244d.array,
                received: ctx.parsedType
            });
            return $508449958c1d885a$export$9a105a556e65c2c0;
        }
        if (ctx.data.length < this._def.items.length) {
            $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                code: $508449958c1d885a$export$5ba560653e4a1035.too_small,
                minimum: this._def.items.length,
                inclusive: true,
                exact: false,
                type: "array"
            });
            return $508449958c1d885a$export$9a105a556e65c2c0;
        }
        const rest = this._def.rest;
        if (!rest && ctx.data.length > this._def.items.length) {
            $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                code: $508449958c1d885a$export$5ba560653e4a1035.too_big,
                maximum: this._def.items.length,
                inclusive: true,
                exact: false,
                type: "array"
            });
            status.dirty();
        }
        const items = [
            ...ctx.data
        ].map((item, itemIndex)=>{
            const schema = this._def.items[itemIndex] || this._def.rest;
            if (!schema) return null;
            return schema._parse(new $508449958c1d885a$var$ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
        }).filter((x)=>!!x); // filter nulls
        if (ctx.common.async) return Promise.all(items).then((results)=>{
            return $508449958c1d885a$export$5b20a5c3d05c1f6f.mergeArray(status, results);
        });
        else return $508449958c1d885a$export$5b20a5c3d05c1f6f.mergeArray(status, items);
    }
    get items() {
        return this._def.items;
    }
    rest(rest) {
        return new $508449958c1d885a$export$e2a18bb771d8e6a3({
            ...this._def,
            rest: rest
        });
    }
}
$508449958c1d885a$export$e2a18bb771d8e6a3.create = (schemas, params)=>{
    if (!Array.isArray(schemas)) throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
    return new $508449958c1d885a$export$e2a18bb771d8e6a3({
        items: schemas,
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodTuple,
        rest: null,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
};
class $508449958c1d885a$export$a2acc09968cb4b7f extends $508449958c1d885a$export$19342e026b58ebb7 {
    get keySchema() {
        return this._def.keyType;
    }
    get valueSchema() {
        return this._def.valueType;
    }
    _parse(input) {
        const { status: status, ctx: ctx } = this._processInputParams(input);
        if (ctx.parsedType !== $508449958c1d885a$export$5716da67bfaa244d.object) {
            $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                code: $508449958c1d885a$export$5ba560653e4a1035.invalid_type,
                expected: $508449958c1d885a$export$5716da67bfaa244d.object,
                received: ctx.parsedType
            });
            return $508449958c1d885a$export$9a105a556e65c2c0;
        }
        const pairs = [];
        const keyType = this._def.keyType;
        const valueType = this._def.valueType;
        for(const key in ctx.data)pairs.push({
            key: keyType._parse(new $508449958c1d885a$var$ParseInputLazyPath(ctx, key, ctx.path, key)),
            value: valueType._parse(new $508449958c1d885a$var$ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
            alwaysSet: key in ctx.data
        });
        if (ctx.common.async) return $508449958c1d885a$export$5b20a5c3d05c1f6f.mergeObjectAsync(status, pairs);
        else return $508449958c1d885a$export$5b20a5c3d05c1f6f.mergeObjectSync(status, pairs);
    }
    get element() {
        return this._def.valueType;
    }
    static create(first, second, third) {
        if (second instanceof $508449958c1d885a$export$19342e026b58ebb7) return new $508449958c1d885a$export$a2acc09968cb4b7f({
            keyType: first,
            valueType: second,
            typeName: $508449958c1d885a$export$558106ce543bd011.ZodRecord,
            ...$508449958c1d885a$var$processCreateParams(third)
        });
        return new $508449958c1d885a$export$a2acc09968cb4b7f({
            keyType: $508449958c1d885a$export$1230eb29b8d3b502.create(),
            valueType: first,
            typeName: $508449958c1d885a$export$558106ce543bd011.ZodRecord,
            ...$508449958c1d885a$var$processCreateParams(second)
        });
    }
}
class $508449958c1d885a$export$163b6a2b712d9542 extends $508449958c1d885a$export$19342e026b58ebb7 {
    get keySchema() {
        return this._def.keyType;
    }
    get valueSchema() {
        return this._def.valueType;
    }
    _parse(input) {
        const { status: status, ctx: ctx } = this._processInputParams(input);
        if (ctx.parsedType !== $508449958c1d885a$export$5716da67bfaa244d.map) {
            $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                code: $508449958c1d885a$export$5ba560653e4a1035.invalid_type,
                expected: $508449958c1d885a$export$5716da67bfaa244d.map,
                received: ctx.parsedType
            });
            return $508449958c1d885a$export$9a105a556e65c2c0;
        }
        const keyType = this._def.keyType;
        const valueType = this._def.valueType;
        const pairs = [
            ...ctx.data.entries()
        ].map(([key, value], index)=>{
            return {
                key: keyType._parse(new $508449958c1d885a$var$ParseInputLazyPath(ctx, key, ctx.path, [
                    index,
                    "key"
                ])),
                value: valueType._parse(new $508449958c1d885a$var$ParseInputLazyPath(ctx, value, ctx.path, [
                    index,
                    "value"
                ]))
            };
        });
        if (ctx.common.async) {
            const finalMap = new Map();
            return Promise.resolve().then(async ()=>{
                for (const pair of pairs){
                    const key = await pair.key;
                    const value = await pair.value;
                    if (key.status === "aborted" || value.status === "aborted") return $508449958c1d885a$export$9a105a556e65c2c0;
                    if (key.status === "dirty" || value.status === "dirty") status.dirty();
                    finalMap.set(key.value, value.value);
                }
                return {
                    status: status.value,
                    value: finalMap
                };
            });
        } else {
            const finalMap = new Map();
            for (const pair of pairs){
                const key = pair.key;
                const value = pair.value;
                if (key.status === "aborted" || value.status === "aborted") return $508449958c1d885a$export$9a105a556e65c2c0;
                if (key.status === "dirty" || value.status === "dirty") status.dirty();
                finalMap.set(key.value, value.value);
            }
            return {
                status: status.value,
                value: finalMap
            };
        }
    }
}
$508449958c1d885a$export$163b6a2b712d9542.create = (keyType, valueType, params)=>{
    return new $508449958c1d885a$export$163b6a2b712d9542({
        valueType: valueType,
        keyType: keyType,
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodMap,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
};
class $508449958c1d885a$export$977057706f816712 extends $508449958c1d885a$export$19342e026b58ebb7 {
    _parse(input) {
        const { status: status, ctx: ctx } = this._processInputParams(input);
        if (ctx.parsedType !== $508449958c1d885a$export$5716da67bfaa244d.set) {
            $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                code: $508449958c1d885a$export$5ba560653e4a1035.invalid_type,
                expected: $508449958c1d885a$export$5716da67bfaa244d.set,
                received: ctx.parsedType
            });
            return $508449958c1d885a$export$9a105a556e65c2c0;
        }
        const def = this._def;
        if (def.minSize !== null) {
            if (ctx.data.size < def.minSize.value) {
                $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                    code: $508449958c1d885a$export$5ba560653e4a1035.too_small,
                    minimum: def.minSize.value,
                    type: "set",
                    inclusive: true,
                    exact: false,
                    message: def.minSize.message
                });
                status.dirty();
            }
        }
        if (def.maxSize !== null) {
            if (ctx.data.size > def.maxSize.value) {
                $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                    code: $508449958c1d885a$export$5ba560653e4a1035.too_big,
                    maximum: def.maxSize.value,
                    type: "set",
                    inclusive: true,
                    exact: false,
                    message: def.maxSize.message
                });
                status.dirty();
            }
        }
        const valueType = this._def.valueType;
        function finalizeSet(elements) {
            const parsedSet = new Set();
            for (const element of elements){
                if (element.status === "aborted") return $508449958c1d885a$export$9a105a556e65c2c0;
                if (element.status === "dirty") status.dirty();
                parsedSet.add(element.value);
            }
            return {
                status: status.value,
                value: parsedSet
            };
        }
        const elements = [
            ...ctx.data.values()
        ].map((item, i)=>valueType._parse(new $508449958c1d885a$var$ParseInputLazyPath(ctx, item, ctx.path, i)));
        if (ctx.common.async) return Promise.all(elements).then((elements)=>finalizeSet(elements));
        else return finalizeSet(elements);
    }
    min(minSize, message) {
        return new $508449958c1d885a$export$977057706f816712({
            ...this._def,
            minSize: {
                value: minSize,
                message: $508449958c1d885a$var$errorUtil.toString(message)
            }
        });
    }
    max(maxSize, message) {
        return new $508449958c1d885a$export$977057706f816712({
            ...this._def,
            maxSize: {
                value: maxSize,
                message: $508449958c1d885a$var$errorUtil.toString(message)
            }
        });
    }
    size(size, message) {
        return this.min(size, message).max(size, message);
    }
    nonempty(message) {
        return this.min(1, message);
    }
}
$508449958c1d885a$export$977057706f816712.create = (valueType, params)=>{
    return new $508449958c1d885a$export$977057706f816712({
        valueType: valueType,
        minSize: null,
        maxSize: null,
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodSet,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
};
class $508449958c1d885a$export$d4602ba55673f53c extends $508449958c1d885a$export$19342e026b58ebb7 {
    constructor(){
        super(...arguments);
        this.validate = this.implement;
    }
    _parse(input) {
        const { ctx: ctx } = this._processInputParams(input);
        if (ctx.parsedType !== $508449958c1d885a$export$5716da67bfaa244d.function) {
            $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                code: $508449958c1d885a$export$5ba560653e4a1035.invalid_type,
                expected: $508449958c1d885a$export$5716da67bfaa244d.function,
                received: ctx.parsedType
            });
            return $508449958c1d885a$export$9a105a556e65c2c0;
        }
        function makeArgsIssue(args, error) {
            return $508449958c1d885a$export$244a85fde9c419ed({
                data: args,
                path: ctx.path,
                errorMaps: [
                    ctx.common.contextualErrorMap,
                    ctx.schemaErrorMap,
                    $508449958c1d885a$export$32f27c719778d4c4(),
                    $508449958c1d885a$export$341b0b6e0a6f5099
                ].filter((x)=>!!x),
                issueData: {
                    code: $508449958c1d885a$export$5ba560653e4a1035.invalid_arguments,
                    argumentsError: error
                }
            });
        }
        function makeReturnsIssue(returns, error) {
            return $508449958c1d885a$export$244a85fde9c419ed({
                data: returns,
                path: ctx.path,
                errorMaps: [
                    ctx.common.contextualErrorMap,
                    ctx.schemaErrorMap,
                    $508449958c1d885a$export$32f27c719778d4c4(),
                    $508449958c1d885a$export$341b0b6e0a6f5099
                ].filter((x)=>!!x),
                issueData: {
                    code: $508449958c1d885a$export$5ba560653e4a1035.invalid_return_type,
                    returnTypeError: error
                }
            });
        }
        const params = {
            errorMap: ctx.common.contextualErrorMap
        };
        const fn = ctx.data;
        if (this._def.returns instanceof $508449958c1d885a$export$3f196b0127d6e50a) {
            // Would love a way to avoid disabling this rule, but we need
            // an alias (using an arrow function was what caused 2651).
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const me = this;
            return $508449958c1d885a$export$c6813a8d51f77eaf(async function(...args) {
                const error = new $508449958c1d885a$export$f98dac4b251ab333([]);
                const parsedArgs = await me._def.args.parseAsync(args, params).catch((e)=>{
                    error.addIssue(makeArgsIssue(args, e));
                    throw error;
                });
                const result = await Reflect.apply(fn, this, parsedArgs);
                const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e)=>{
                    error.addIssue(makeReturnsIssue(result, e));
                    throw error;
                });
                return parsedReturns;
            });
        } else {
            // Would love a way to avoid disabling this rule, but we need
            // an alias (using an arrow function was what caused 2651).
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const me = this;
            return $508449958c1d885a$export$c6813a8d51f77eaf(function(...args) {
                const parsedArgs = me._def.args.safeParse(args, params);
                if (!parsedArgs.success) throw new $508449958c1d885a$export$f98dac4b251ab333([
                    makeArgsIssue(args, parsedArgs.error)
                ]);
                const result = Reflect.apply(fn, this, parsedArgs.data);
                const parsedReturns = me._def.returns.safeParse(result, params);
                if (!parsedReturns.success) throw new $508449958c1d885a$export$f98dac4b251ab333([
                    makeReturnsIssue(result, parsedReturns.error)
                ]);
                return parsedReturns.data;
            });
        }
    }
    parameters() {
        return this._def.args;
    }
    returnType() {
        return this._def.returns;
    }
    args(...items) {
        return new $508449958c1d885a$export$d4602ba55673f53c({
            ...this._def,
            args: $508449958c1d885a$export$e2a18bb771d8e6a3.create(items).rest($508449958c1d885a$export$ef3b1bb1630977ae.create())
        });
    }
    returns(returnType) {
        return new $508449958c1d885a$export$d4602ba55673f53c({
            ...this._def,
            returns: returnType
        });
    }
    implement(func) {
        const validatedFunc = this.parse(func);
        return validatedFunc;
    }
    strictImplement(func) {
        const validatedFunc = this.parse(func);
        return validatedFunc;
    }
    static create(args, returns, params) {
        return new $508449958c1d885a$export$d4602ba55673f53c({
            args: args ? args : $508449958c1d885a$export$e2a18bb771d8e6a3.create([]).rest($508449958c1d885a$export$ef3b1bb1630977ae.create()),
            returns: returns || $508449958c1d885a$export$ef3b1bb1630977ae.create(),
            typeName: $508449958c1d885a$export$558106ce543bd011.ZodFunction,
            ...$508449958c1d885a$var$processCreateParams(params)
        });
    }
}
class $508449958c1d885a$export$378d0cfce37406e6 extends $508449958c1d885a$export$19342e026b58ebb7 {
    get schema() {
        return this._def.getter();
    }
    _parse(input) {
        const { ctx: ctx } = this._processInputParams(input);
        const lazySchema = this._def.getter();
        return lazySchema._parse({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
        });
    }
}
$508449958c1d885a$export$378d0cfce37406e6.create = (getter, params)=>{
    return new $508449958c1d885a$export$378d0cfce37406e6({
        getter: getter,
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodLazy,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
};
class $508449958c1d885a$export$7e44096782a165d3 extends $508449958c1d885a$export$19342e026b58ebb7 {
    _parse(input) {
        if (input.data !== this._def.value) {
            const ctx = this._getOrReturnCtx(input);
            $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                received: ctx.data,
                code: $508449958c1d885a$export$5ba560653e4a1035.invalid_literal,
                expected: this._def.value
            });
            return $508449958c1d885a$export$9a105a556e65c2c0;
        }
        return {
            status: "valid",
            value: input.data
        };
    }
    get value() {
        return this._def.value;
    }
}
$508449958c1d885a$export$7e44096782a165d3.create = (value, params)=>{
    return new $508449958c1d885a$export$7e44096782a165d3({
        value: value,
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodLiteral,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
};
function $508449958c1d885a$var$createZodEnum(values, params) {
    return new $508449958c1d885a$export$d325d1f0e1c20179({
        values: values,
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodEnum,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
}
class $508449958c1d885a$export$d325d1f0e1c20179 extends $508449958c1d885a$export$19342e026b58ebb7 {
    constructor(){
        super(...arguments);
        $508449958c1d885a$var$_ZodEnum_cache.set(this, void 0);
    }
    _parse(input) {
        if (typeof input.data !== "string") {
            const ctx = this._getOrReturnCtx(input);
            const expectedValues = this._def.values;
            $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                expected: $508449958c1d885a$export$7debb50ef11d5e0b.joinValues(expectedValues),
                received: ctx.parsedType,
                code: $508449958c1d885a$export$5ba560653e4a1035.invalid_type
            });
            return $508449958c1d885a$export$9a105a556e65c2c0;
        }
        if (!$508449958c1d885a$var$__classPrivateFieldGet(this, $508449958c1d885a$var$_ZodEnum_cache, "f")) $508449958c1d885a$var$__classPrivateFieldSet(this, $508449958c1d885a$var$_ZodEnum_cache, new Set(this._def.values), "f");
        if (!$508449958c1d885a$var$__classPrivateFieldGet(this, $508449958c1d885a$var$_ZodEnum_cache, "f").has(input.data)) {
            const ctx = this._getOrReturnCtx(input);
            const expectedValues = this._def.values;
            $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                received: ctx.data,
                code: $508449958c1d885a$export$5ba560653e4a1035.invalid_enum_value,
                options: expectedValues
            });
            return $508449958c1d885a$export$9a105a556e65c2c0;
        }
        return $508449958c1d885a$export$c6813a8d51f77eaf(input.data);
    }
    get options() {
        return this._def.values;
    }
    get enum() {
        const enumValues = {};
        for (const val of this._def.values)enumValues[val] = val;
        return enumValues;
    }
    get Values() {
        const enumValues = {};
        for (const val of this._def.values)enumValues[val] = val;
        return enumValues;
    }
    get Enum() {
        const enumValues = {};
        for (const val of this._def.values)enumValues[val] = val;
        return enumValues;
    }
    extract(values, newDef = this._def) {
        return $508449958c1d885a$export$d325d1f0e1c20179.create(values, {
            ...this._def,
            ...newDef
        });
    }
    exclude(values, newDef = this._def) {
        return $508449958c1d885a$export$d325d1f0e1c20179.create(this.options.filter((opt)=>!values.includes(opt)), {
            ...this._def,
            ...newDef
        });
    }
}
$508449958c1d885a$var$_ZodEnum_cache = new WeakMap();
$508449958c1d885a$export$d325d1f0e1c20179.create = $508449958c1d885a$var$createZodEnum;
class $508449958c1d885a$export$370b2e8d6d6f5c56 extends $508449958c1d885a$export$19342e026b58ebb7 {
    constructor(){
        super(...arguments);
        $508449958c1d885a$var$_ZodNativeEnum_cache.set(this, void 0);
    }
    _parse(input) {
        const nativeEnumValues = $508449958c1d885a$export$7debb50ef11d5e0b.getValidEnumValues(this._def.values);
        const ctx = this._getOrReturnCtx(input);
        if (ctx.parsedType !== $508449958c1d885a$export$5716da67bfaa244d.string && ctx.parsedType !== $508449958c1d885a$export$5716da67bfaa244d.number) {
            const expectedValues = $508449958c1d885a$export$7debb50ef11d5e0b.objectValues(nativeEnumValues);
            $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                expected: $508449958c1d885a$export$7debb50ef11d5e0b.joinValues(expectedValues),
                received: ctx.parsedType,
                code: $508449958c1d885a$export$5ba560653e4a1035.invalid_type
            });
            return $508449958c1d885a$export$9a105a556e65c2c0;
        }
        if (!$508449958c1d885a$var$__classPrivateFieldGet(this, $508449958c1d885a$var$_ZodNativeEnum_cache, "f")) $508449958c1d885a$var$__classPrivateFieldSet(this, $508449958c1d885a$var$_ZodNativeEnum_cache, new Set($508449958c1d885a$export$7debb50ef11d5e0b.getValidEnumValues(this._def.values)), "f");
        if (!$508449958c1d885a$var$__classPrivateFieldGet(this, $508449958c1d885a$var$_ZodNativeEnum_cache, "f").has(input.data)) {
            const expectedValues = $508449958c1d885a$export$7debb50ef11d5e0b.objectValues(nativeEnumValues);
            $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                received: ctx.data,
                code: $508449958c1d885a$export$5ba560653e4a1035.invalid_enum_value,
                options: expectedValues
            });
            return $508449958c1d885a$export$9a105a556e65c2c0;
        }
        return $508449958c1d885a$export$c6813a8d51f77eaf(input.data);
    }
    get enum() {
        return this._def.values;
    }
}
$508449958c1d885a$var$_ZodNativeEnum_cache = new WeakMap();
$508449958c1d885a$export$370b2e8d6d6f5c56.create = (values, params)=>{
    return new $508449958c1d885a$export$370b2e8d6d6f5c56({
        values: values,
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodNativeEnum,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
};
class $508449958c1d885a$export$3f196b0127d6e50a extends $508449958c1d885a$export$19342e026b58ebb7 {
    unwrap() {
        return this._def.type;
    }
    _parse(input) {
        const { ctx: ctx } = this._processInputParams(input);
        if (ctx.parsedType !== $508449958c1d885a$export$5716da67bfaa244d.promise && ctx.common.async === false) {
            $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                code: $508449958c1d885a$export$5ba560653e4a1035.invalid_type,
                expected: $508449958c1d885a$export$5716da67bfaa244d.promise,
                received: ctx.parsedType
            });
            return $508449958c1d885a$export$9a105a556e65c2c0;
        }
        const promisified = ctx.parsedType === $508449958c1d885a$export$5716da67bfaa244d.promise ? ctx.data : Promise.resolve(ctx.data);
        return $508449958c1d885a$export$c6813a8d51f77eaf(promisified.then((data)=>{
            return this._def.type.parseAsync(data, {
                path: ctx.path,
                errorMap: ctx.common.contextualErrorMap
            });
        }));
    }
}
$508449958c1d885a$export$3f196b0127d6e50a.create = (schema, params)=>{
    return new $508449958c1d885a$export$3f196b0127d6e50a({
        type: schema,
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodPromise,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
};
class $508449958c1d885a$export$a60af00cc0ce2582 extends $508449958c1d885a$export$19342e026b58ebb7 {
    innerType() {
        return this._def.schema;
    }
    sourceType() {
        return this._def.schema._def.typeName === $508449958c1d885a$export$558106ce543bd011.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
    }
    _parse(input) {
        const { status: status, ctx: ctx } = this._processInputParams(input);
        const effect = this._def.effect || null;
        const checkCtx = {
            addIssue: (arg)=>{
                $508449958c1d885a$export$db7caee60e5d514d(ctx, arg);
                if (arg.fatal) status.abort();
                else status.dirty();
            },
            get path () {
                return ctx.path;
            }
        };
        checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
        if (effect.type === "preprocess") {
            const processed = effect.transform(ctx.data, checkCtx);
            if (ctx.common.async) return Promise.resolve(processed).then(async (processed)=>{
                if (status.value === "aborted") return $508449958c1d885a$export$9a105a556e65c2c0;
                const result = await this._def.schema._parseAsync({
                    data: processed,
                    path: ctx.path,
                    parent: ctx
                });
                if (result.status === "aborted") return $508449958c1d885a$export$9a105a556e65c2c0;
                if (result.status === "dirty") return $508449958c1d885a$export$325a211da9693fcf(result.value);
                if (status.value === "dirty") return $508449958c1d885a$export$325a211da9693fcf(result.value);
                return result;
            });
            else {
                if (status.value === "aborted") return $508449958c1d885a$export$9a105a556e65c2c0;
                const result = this._def.schema._parseSync({
                    data: processed,
                    path: ctx.path,
                    parent: ctx
                });
                if (result.status === "aborted") return $508449958c1d885a$export$9a105a556e65c2c0;
                if (result.status === "dirty") return $508449958c1d885a$export$325a211da9693fcf(result.value);
                if (status.value === "dirty") return $508449958c1d885a$export$325a211da9693fcf(result.value);
                return result;
            }
        }
        if (effect.type === "refinement") {
            const executeRefinement = (acc)=>{
                const result = effect.refinement(acc, checkCtx);
                if (ctx.common.async) return Promise.resolve(result);
                if (result instanceof Promise) throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
                return acc;
            };
            if (ctx.common.async === false) {
                const inner = this._def.schema._parseSync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx
                });
                if (inner.status === "aborted") return $508449958c1d885a$export$9a105a556e65c2c0;
                if (inner.status === "dirty") status.dirty();
                // return value is ignored
                executeRefinement(inner.value);
                return {
                    status: status.value,
                    value: inner.value
                };
            } else return this._def.schema._parseAsync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx
            }).then((inner)=>{
                if (inner.status === "aborted") return $508449958c1d885a$export$9a105a556e65c2c0;
                if (inner.status === "dirty") status.dirty();
                return executeRefinement(inner.value).then(()=>{
                    return {
                        status: status.value,
                        value: inner.value
                    };
                });
            });
        }
        if (effect.type === "transform") {
            if (ctx.common.async === false) {
                const base = this._def.schema._parseSync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx
                });
                if (!$508449958c1d885a$export$1ea939691cdc45b8(base)) return base;
                const result = effect.transform(base.value, checkCtx);
                if (result instanceof Promise) throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
                return {
                    status: status.value,
                    value: result
                };
            } else return this._def.schema._parseAsync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx
            }).then((base)=>{
                if (!$508449958c1d885a$export$1ea939691cdc45b8(base)) return base;
                return Promise.resolve(effect.transform(base.value, checkCtx)).then((result)=>({
                        status: status.value,
                        value: result
                    }));
            });
        }
        $508449958c1d885a$export$7debb50ef11d5e0b.assertNever(effect);
    }
}
$508449958c1d885a$export$a60af00cc0ce2582.create = (schema, effect, params)=>{
    return new $508449958c1d885a$export$a60af00cc0ce2582({
        schema: schema,
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodEffects,
        effect: effect,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
};
$508449958c1d885a$export$a60af00cc0ce2582.createWithPreprocess = (preprocess, schema, params)=>{
    return new $508449958c1d885a$export$a60af00cc0ce2582({
        schema: schema,
        effect: {
            type: "preprocess",
            transform: preprocess
        },
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodEffects,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
};
class $508449958c1d885a$export$aa56fec1e9d629b8 extends $508449958c1d885a$export$19342e026b58ebb7 {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType === $508449958c1d885a$export$5716da67bfaa244d.undefined) return $508449958c1d885a$export$c6813a8d51f77eaf(undefined);
        return this._def.innerType._parse(input);
    }
    unwrap() {
        return this._def.innerType;
    }
}
$508449958c1d885a$export$aa56fec1e9d629b8.create = (type, params)=>{
    return new $508449958c1d885a$export$aa56fec1e9d629b8({
        innerType: type,
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodOptional,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
};
class $508449958c1d885a$export$aaac0b8b429cef5 extends $508449958c1d885a$export$19342e026b58ebb7 {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType === $508449958c1d885a$export$5716da67bfaa244d.null) return $508449958c1d885a$export$c6813a8d51f77eaf(null);
        return this._def.innerType._parse(input);
    }
    unwrap() {
        return this._def.innerType;
    }
}
$508449958c1d885a$export$aaac0b8b429cef5.create = (type, params)=>{
    return new $508449958c1d885a$export$aaac0b8b429cef5({
        innerType: type,
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodNullable,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
};
class $508449958c1d885a$export$bb19b37874861e7e extends $508449958c1d885a$export$19342e026b58ebb7 {
    _parse(input) {
        const { ctx: ctx } = this._processInputParams(input);
        let data = ctx.data;
        if (ctx.parsedType === $508449958c1d885a$export$5716da67bfaa244d.undefined) data = this._def.defaultValue();
        return this._def.innerType._parse({
            data: data,
            path: ctx.path,
            parent: ctx
        });
    }
    removeDefault() {
        return this._def.innerType;
    }
}
$508449958c1d885a$export$bb19b37874861e7e.create = (type, params)=>{
    return new $508449958c1d885a$export$bb19b37874861e7e({
        innerType: type,
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodDefault,
        defaultValue: typeof params.default === "function" ? params.default : ()=>params.default,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
};
class $508449958c1d885a$export$75a44ec6249ac76b extends $508449958c1d885a$export$19342e026b58ebb7 {
    _parse(input) {
        const { ctx: ctx } = this._processInputParams(input);
        // newCtx is used to not collect issues from inner types in ctx
        const newCtx = {
            ...ctx,
            common: {
                ...ctx.common,
                issues: []
            }
        };
        const result = this._def.innerType._parse({
            data: newCtx.data,
            path: newCtx.path,
            parent: {
                ...newCtx
            }
        });
        if ($508449958c1d885a$export$aefee5ebe1dcfd9e(result)) return result.then((result)=>{
            return {
                status: "valid",
                value: result.status === "valid" ? result.value : this._def.catchValue({
                    get error () {
                        return new $508449958c1d885a$export$f98dac4b251ab333(newCtx.common.issues);
                    },
                    input: newCtx.data
                })
            };
        });
        else return {
            status: "valid",
            value: result.status === "valid" ? result.value : this._def.catchValue({
                get error () {
                    return new $508449958c1d885a$export$f98dac4b251ab333(newCtx.common.issues);
                },
                input: newCtx.data
            })
        };
    }
    removeCatch() {
        return this._def.innerType;
    }
}
$508449958c1d885a$export$75a44ec6249ac76b.create = (type, params)=>{
    return new $508449958c1d885a$export$75a44ec6249ac76b({
        innerType: type,
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodCatch,
        catchValue: typeof params.catch === "function" ? params.catch : ()=>params.catch,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
};
class $508449958c1d885a$export$26ccfa0145e8511f extends $508449958c1d885a$export$19342e026b58ebb7 {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== $508449958c1d885a$export$5716da67bfaa244d.nan) {
            const ctx = this._getOrReturnCtx(input);
            $508449958c1d885a$export$db7caee60e5d514d(ctx, {
                code: $508449958c1d885a$export$5ba560653e4a1035.invalid_type,
                expected: $508449958c1d885a$export$5716da67bfaa244d.nan,
                received: ctx.parsedType
            });
            return $508449958c1d885a$export$9a105a556e65c2c0;
        }
        return {
            status: "valid",
            value: input.data
        };
    }
}
$508449958c1d885a$export$26ccfa0145e8511f.create = (params)=>{
    return new $508449958c1d885a$export$26ccfa0145e8511f({
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodNaN,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
};
const $508449958c1d885a$export$cf2deea74cde46b4 = Symbol("zod_brand");
class $508449958c1d885a$export$66b0c798a395271f extends $508449958c1d885a$export$19342e026b58ebb7 {
    _parse(input) {
        const { ctx: ctx } = this._processInputParams(input);
        const data = ctx.data;
        return this._def.type._parse({
            data: data,
            path: ctx.path,
            parent: ctx
        });
    }
    unwrap() {
        return this._def.type;
    }
}
class $508449958c1d885a$export$a3c3ef8a0e95c6da extends $508449958c1d885a$export$19342e026b58ebb7 {
    _parse(input) {
        const { status: status, ctx: ctx } = this._processInputParams(input);
        if (ctx.common.async) {
            const handleAsync = async ()=>{
                const inResult = await this._def.in._parseAsync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx
                });
                if (inResult.status === "aborted") return $508449958c1d885a$export$9a105a556e65c2c0;
                if (inResult.status === "dirty") {
                    status.dirty();
                    return $508449958c1d885a$export$325a211da9693fcf(inResult.value);
                } else return this._def.out._parseAsync({
                    data: inResult.value,
                    path: ctx.path,
                    parent: ctx
                });
            };
            return handleAsync();
        } else {
            const inResult = this._def.in._parseSync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx
            });
            if (inResult.status === "aborted") return $508449958c1d885a$export$9a105a556e65c2c0;
            if (inResult.status === "dirty") {
                status.dirty();
                return {
                    status: "dirty",
                    value: inResult.value
                };
            } else return this._def.out._parseSync({
                data: inResult.value,
                path: ctx.path,
                parent: ctx
            });
        }
    }
    static create(a, b) {
        return new $508449958c1d885a$export$a3c3ef8a0e95c6da({
            in: a,
            out: b,
            typeName: $508449958c1d885a$export$558106ce543bd011.ZodPipeline
        });
    }
}
class $508449958c1d885a$export$5d1f7ef05c4e493a extends $508449958c1d885a$export$19342e026b58ebb7 {
    _parse(input) {
        const result = this._def.innerType._parse(input);
        if ($508449958c1d885a$export$1ea939691cdc45b8(result)) result.value = Object.freeze(result.value);
        return result;
    }
    unwrap() {
        return this._def.innerType;
    }
}
$508449958c1d885a$export$5d1f7ef05c4e493a.create = (type, params)=>{
    return new $508449958c1d885a$export$5d1f7ef05c4e493a({
        innerType: type,
        typeName: $508449958c1d885a$export$558106ce543bd011.ZodReadonly,
        ...$508449958c1d885a$var$processCreateParams(params)
    });
};
function $508449958c1d885a$export$4c00f665f0d4b443(check, params = {}, /**
 * @deprecated
 *
 * Pass `fatal` into the params object instead:
 *
 * ```ts
 * z.string().custom((val) => val.length > 5, { fatal: false })
 * ```
 *
 */ fatal) {
    if (check) return $508449958c1d885a$export$b9d1edb536b4e4eb.create().superRefine((data, ctx)=>{
        var _a, _b;
        if (!check(data)) {
            const p = typeof params === "function" ? params(data) : typeof params === "string" ? {
                message: params
            } : params;
            const _fatal = (_b = (_a = p.fatal) !== null && _a !== void 0 ? _a : fatal) !== null && _b !== void 0 ? _b : true;
            const p2 = typeof p === "string" ? {
                message: p
            } : p;
            ctx.addIssue({
                code: "custom",
                ...p2,
                fatal: _fatal
            });
        }
    });
    return $508449958c1d885a$export$b9d1edb536b4e4eb.create();
}
const $508449958c1d885a$export$1ee8ee30835eab8b = {
    object: $508449958c1d885a$export$736315c5b55efbad.lazycreate
};
var $508449958c1d885a$export$558106ce543bd011;
(function(ZodFirstPartyTypeKind) {
    ZodFirstPartyTypeKind["ZodString"] = "ZodString";
    ZodFirstPartyTypeKind["ZodNumber"] = "ZodNumber";
    ZodFirstPartyTypeKind["ZodNaN"] = "ZodNaN";
    ZodFirstPartyTypeKind["ZodBigInt"] = "ZodBigInt";
    ZodFirstPartyTypeKind["ZodBoolean"] = "ZodBoolean";
    ZodFirstPartyTypeKind["ZodDate"] = "ZodDate";
    ZodFirstPartyTypeKind["ZodSymbol"] = "ZodSymbol";
    ZodFirstPartyTypeKind["ZodUndefined"] = "ZodUndefined";
    ZodFirstPartyTypeKind["ZodNull"] = "ZodNull";
    ZodFirstPartyTypeKind["ZodAny"] = "ZodAny";
    ZodFirstPartyTypeKind["ZodUnknown"] = "ZodUnknown";
    ZodFirstPartyTypeKind["ZodNever"] = "ZodNever";
    ZodFirstPartyTypeKind["ZodVoid"] = "ZodVoid";
    ZodFirstPartyTypeKind["ZodArray"] = "ZodArray";
    ZodFirstPartyTypeKind["ZodObject"] = "ZodObject";
    ZodFirstPartyTypeKind["ZodUnion"] = "ZodUnion";
    ZodFirstPartyTypeKind["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
    ZodFirstPartyTypeKind["ZodIntersection"] = "ZodIntersection";
    ZodFirstPartyTypeKind["ZodTuple"] = "ZodTuple";
    ZodFirstPartyTypeKind["ZodRecord"] = "ZodRecord";
    ZodFirstPartyTypeKind["ZodMap"] = "ZodMap";
    ZodFirstPartyTypeKind["ZodSet"] = "ZodSet";
    ZodFirstPartyTypeKind["ZodFunction"] = "ZodFunction";
    ZodFirstPartyTypeKind["ZodLazy"] = "ZodLazy";
    ZodFirstPartyTypeKind["ZodLiteral"] = "ZodLiteral";
    ZodFirstPartyTypeKind["ZodEnum"] = "ZodEnum";
    ZodFirstPartyTypeKind["ZodEffects"] = "ZodEffects";
    ZodFirstPartyTypeKind["ZodNativeEnum"] = "ZodNativeEnum";
    ZodFirstPartyTypeKind["ZodOptional"] = "ZodOptional";
    ZodFirstPartyTypeKind["ZodNullable"] = "ZodNullable";
    ZodFirstPartyTypeKind["ZodDefault"] = "ZodDefault";
    ZodFirstPartyTypeKind["ZodCatch"] = "ZodCatch";
    ZodFirstPartyTypeKind["ZodPromise"] = "ZodPromise";
    ZodFirstPartyTypeKind["ZodBranded"] = "ZodBranded";
    ZodFirstPartyTypeKind["ZodPipeline"] = "ZodPipeline";
    ZodFirstPartyTypeKind["ZodReadonly"] = "ZodReadonly";
})($508449958c1d885a$export$558106ce543bd011 || ($508449958c1d885a$export$558106ce543bd011 = {}));
const $508449958c1d885a$export$3d916e7c22dbd8b5 = (// const instanceOfType = <T extends new (...args: any[]) => any>(
cls, params = {
    message: `Input not instance of ${cls.name}`
})=>$508449958c1d885a$export$4c00f665f0d4b443((data)=>data instanceof cls, params);
const $508449958c1d885a$export$22b082955e083ec3 = $508449958c1d885a$export$1230eb29b8d3b502.create;
const $508449958c1d885a$export$98e628dec113755e = $508449958c1d885a$export$5b070a55c0c43e09.create;
const $508449958c1d885a$export$9e06de0973666692 = $508449958c1d885a$export$26ccfa0145e8511f.create;
const $508449958c1d885a$export$a0f65b52274bcc00 = $508449958c1d885a$export$67d741fd70ff98f4.create;
const $508449958c1d885a$export$4a21f16c33752377 = $508449958c1d885a$export$723d146f80596191.create;
const $508449958c1d885a$export$324d90190a8b822a = $508449958c1d885a$export$e974be33bdc55521.create;
const $508449958c1d885a$export$8f701197936bc2a6 = $508449958c1d885a$export$bcc3b40f6b638044.create;
const $508449958c1d885a$export$1db45310990710a5 = $508449958c1d885a$export$4e780e961c30340d.create;
const $508449958c1d885a$export$7b1b591b262c240 = $508449958c1d885a$export$a96281f914484f2d.create;
const $508449958c1d885a$export$4154a199d7d90455 = $508449958c1d885a$export$b9d1edb536b4e4eb.create;
const $508449958c1d885a$export$19282c40b967aec6 = $508449958c1d885a$export$ef3b1bb1630977ae.create;
const $508449958c1d885a$export$b3e22bcfd64c1022 = $508449958c1d885a$export$1e576a20c3ce9fb5.create;
const $508449958c1d885a$export$490e536ee7389aeb = $508449958c1d885a$export$7d39f5df85f21031.create;
const $508449958c1d885a$export$2f23118c22fb2630 = $508449958c1d885a$export$7acfc3e64785411.create;
const $508449958c1d885a$export$be5493f9613cbbe = $508449958c1d885a$export$736315c5b55efbad.create;
const $508449958c1d885a$export$8fb0df5f40d0b477 = $508449958c1d885a$export$736315c5b55efbad.strictCreate;
const $508449958c1d885a$export$971dd5b0dfd021b6 = $508449958c1d885a$export$a8b236cb5070a311.create;
const $508449958c1d885a$export$4b888e40c4ee26dd = $508449958c1d885a$export$5ef2424805ac76a3.create;
const $508449958c1d885a$export$bc86dfbf7795668c = $508449958c1d885a$export$c02deaf0bb5203d4.create;
const $508449958c1d885a$export$65e3907585753458 = $508449958c1d885a$export$e2a18bb771d8e6a3.create;
const $508449958c1d885a$export$e5185e241753e543 = $508449958c1d885a$export$a2acc09968cb4b7f.create;
const $508449958c1d885a$export$871de8747c9eaa88 = $508449958c1d885a$export$163b6a2b712d9542.create;
const $508449958c1d885a$export$adaa4cf7ef1b65be = $508449958c1d885a$export$977057706f816712.create;
const $508449958c1d885a$export$44e51c8aac7c2deb = $508449958c1d885a$export$d4602ba55673f53c.create;
const $508449958c1d885a$export$488013bae63b21da = $508449958c1d885a$export$378d0cfce37406e6.create;
const $508449958c1d885a$export$c8ec6e1ec9fefcb0 = $508449958c1d885a$export$7e44096782a165d3.create;
const $508449958c1d885a$export$78a99c8d44d72635 = $508449958c1d885a$export$d325d1f0e1c20179.create;
const $508449958c1d885a$export$6fe7eca19ebe5199 = $508449958c1d885a$export$370b2e8d6d6f5c56.create;
const $508449958c1d885a$export$c957ef27a0ebfd4 = $508449958c1d885a$export$3f196b0127d6e50a.create;
const $508449958c1d885a$export$dc573d8a6576cdb3 = $508449958c1d885a$export$a60af00cc0ce2582.create;
const $508449958c1d885a$export$516e28dec6a4b6d4 = $508449958c1d885a$export$aa56fec1e9d629b8.create;
const $508449958c1d885a$export$133fc36489ac9add = $508449958c1d885a$export$aaac0b8b429cef5.create;
const $508449958c1d885a$export$fc37fe19dfda43ee = $508449958c1d885a$export$a60af00cc0ce2582.createWithPreprocess;
const $508449958c1d885a$export$43f28b24e1eb8181 = $508449958c1d885a$export$a3c3ef8a0e95c6da.create;
const $508449958c1d885a$export$3b3d07727c5b702c = ()=>$508449958c1d885a$export$22b082955e083ec3().optional();
const $508449958c1d885a$export$eb150471a61fced6 = ()=>$508449958c1d885a$export$98e628dec113755e().optional();
const $508449958c1d885a$export$269251733cdcbbf1 = ()=>$508449958c1d885a$export$4a21f16c33752377().optional();
const $508449958c1d885a$export$8c14e57e778d3873 = {
    string: (arg)=>$508449958c1d885a$export$1230eb29b8d3b502.create({
            ...arg,
            coerce: true
        }),
    number: (arg)=>$508449958c1d885a$export$5b070a55c0c43e09.create({
            ...arg,
            coerce: true
        }),
    boolean: (arg)=>$508449958c1d885a$export$723d146f80596191.create({
            ...arg,
            coerce: true
        }),
    bigint: (arg)=>$508449958c1d885a$export$67d741fd70ff98f4.create({
            ...arg,
            coerce: true
        }),
    date: (arg)=>$508449958c1d885a$export$e974be33bdc55521.create({
            ...arg,
            coerce: true
        })
};
const $508449958c1d885a$export$96c94437c95d7862 = $508449958c1d885a$export$9a105a556e65c2c0;
var $508449958c1d885a$export$2e2bcd8739ae039 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    defaultErrorMap: $508449958c1d885a$export$341b0b6e0a6f5099,
    setErrorMap: $508449958c1d885a$export$1097a8289cfd22d7,
    getErrorMap: $508449958c1d885a$export$32f27c719778d4c4,
    makeIssue: $508449958c1d885a$export$244a85fde9c419ed,
    EMPTY_PATH: $508449958c1d885a$export$1526d2e05f74572,
    addIssueToContext: $508449958c1d885a$export$db7caee60e5d514d,
    ParseStatus: $508449958c1d885a$export$5b20a5c3d05c1f6f,
    INVALID: $508449958c1d885a$export$9a105a556e65c2c0,
    DIRTY: $508449958c1d885a$export$325a211da9693fcf,
    OK: $508449958c1d885a$export$c6813a8d51f77eaf,
    isAborted: $508449958c1d885a$export$afa861e3c5730743,
    isDirty: $508449958c1d885a$export$910b6cdd390341b3,
    isValid: $508449958c1d885a$export$1ea939691cdc45b8,
    isAsync: $508449958c1d885a$export$aefee5ebe1dcfd9e,
    get util () {
        return $508449958c1d885a$export$7debb50ef11d5e0b;
    },
    get objectUtil () {
        return $508449958c1d885a$export$4aa2142c225fd5c7;
    },
    ZodParsedType: $508449958c1d885a$export$5716da67bfaa244d,
    getParsedType: $508449958c1d885a$export$3e9057828ebd5c7a,
    ZodType: $508449958c1d885a$export$19342e026b58ebb7,
    datetimeRegex: $508449958c1d885a$export$a4b563879add27a,
    ZodString: $508449958c1d885a$export$1230eb29b8d3b502,
    ZodNumber: $508449958c1d885a$export$5b070a55c0c43e09,
    ZodBigInt: $508449958c1d885a$export$67d741fd70ff98f4,
    ZodBoolean: $508449958c1d885a$export$723d146f80596191,
    ZodDate: $508449958c1d885a$export$e974be33bdc55521,
    ZodSymbol: $508449958c1d885a$export$bcc3b40f6b638044,
    ZodUndefined: $508449958c1d885a$export$4e780e961c30340d,
    ZodNull: $508449958c1d885a$export$a96281f914484f2d,
    ZodAny: $508449958c1d885a$export$b9d1edb536b4e4eb,
    ZodUnknown: $508449958c1d885a$export$ef3b1bb1630977ae,
    ZodNever: $508449958c1d885a$export$1e576a20c3ce9fb5,
    ZodVoid: $508449958c1d885a$export$7d39f5df85f21031,
    ZodArray: $508449958c1d885a$export$7acfc3e64785411,
    ZodObject: $508449958c1d885a$export$736315c5b55efbad,
    ZodUnion: $508449958c1d885a$export$a8b236cb5070a311,
    ZodDiscriminatedUnion: $508449958c1d885a$export$5ef2424805ac76a3,
    ZodIntersection: $508449958c1d885a$export$c02deaf0bb5203d4,
    ZodTuple: $508449958c1d885a$export$e2a18bb771d8e6a3,
    ZodRecord: $508449958c1d885a$export$a2acc09968cb4b7f,
    ZodMap: $508449958c1d885a$export$163b6a2b712d9542,
    ZodSet: $508449958c1d885a$export$977057706f816712,
    ZodFunction: $508449958c1d885a$export$d4602ba55673f53c,
    ZodLazy: $508449958c1d885a$export$378d0cfce37406e6,
    ZodLiteral: $508449958c1d885a$export$7e44096782a165d3,
    ZodEnum: $508449958c1d885a$export$d325d1f0e1c20179,
    ZodNativeEnum: $508449958c1d885a$export$370b2e8d6d6f5c56,
    ZodPromise: $508449958c1d885a$export$3f196b0127d6e50a,
    ZodEffects: $508449958c1d885a$export$a60af00cc0ce2582,
    ZodTransformer: $508449958c1d885a$export$a60af00cc0ce2582,
    ZodOptional: $508449958c1d885a$export$aa56fec1e9d629b8,
    ZodNullable: $508449958c1d885a$export$aaac0b8b429cef5,
    ZodDefault: $508449958c1d885a$export$bb19b37874861e7e,
    ZodCatch: $508449958c1d885a$export$75a44ec6249ac76b,
    ZodNaN: $508449958c1d885a$export$26ccfa0145e8511f,
    BRAND: $508449958c1d885a$export$cf2deea74cde46b4,
    ZodBranded: $508449958c1d885a$export$66b0c798a395271f,
    ZodPipeline: $508449958c1d885a$export$a3c3ef8a0e95c6da,
    ZodReadonly: $508449958c1d885a$export$5d1f7ef05c4e493a,
    custom: $508449958c1d885a$export$4c00f665f0d4b443,
    Schema: $508449958c1d885a$export$19342e026b58ebb7,
    ZodSchema: $508449958c1d885a$export$19342e026b58ebb7,
    late: $508449958c1d885a$export$1ee8ee30835eab8b,
    get ZodFirstPartyTypeKind () {
        return $508449958c1d885a$export$558106ce543bd011;
    },
    coerce: $508449958c1d885a$export$8c14e57e778d3873,
    any: $508449958c1d885a$export$4154a199d7d90455,
    array: $508449958c1d885a$export$2f23118c22fb2630,
    bigint: $508449958c1d885a$export$a0f65b52274bcc00,
    boolean: $508449958c1d885a$export$4a21f16c33752377,
    date: $508449958c1d885a$export$324d90190a8b822a,
    discriminatedUnion: $508449958c1d885a$export$4b888e40c4ee26dd,
    effect: $508449958c1d885a$export$dc573d8a6576cdb3,
    "enum": $508449958c1d885a$export$78a99c8d44d72635,
    "function": $508449958c1d885a$export$44e51c8aac7c2deb,
    "instanceof": $508449958c1d885a$export$3d916e7c22dbd8b5,
    intersection: $508449958c1d885a$export$bc86dfbf7795668c,
    lazy: $508449958c1d885a$export$488013bae63b21da,
    literal: $508449958c1d885a$export$c8ec6e1ec9fefcb0,
    map: $508449958c1d885a$export$871de8747c9eaa88,
    nan: $508449958c1d885a$export$9e06de0973666692,
    nativeEnum: $508449958c1d885a$export$6fe7eca19ebe5199,
    never: $508449958c1d885a$export$b3e22bcfd64c1022,
    "null": $508449958c1d885a$export$7b1b591b262c240,
    nullable: $508449958c1d885a$export$133fc36489ac9add,
    number: $508449958c1d885a$export$98e628dec113755e,
    object: $508449958c1d885a$export$be5493f9613cbbe,
    oboolean: $508449958c1d885a$export$269251733cdcbbf1,
    onumber: $508449958c1d885a$export$eb150471a61fced6,
    optional: $508449958c1d885a$export$516e28dec6a4b6d4,
    ostring: $508449958c1d885a$export$3b3d07727c5b702c,
    pipeline: $508449958c1d885a$export$43f28b24e1eb8181,
    preprocess: $508449958c1d885a$export$fc37fe19dfda43ee,
    promise: $508449958c1d885a$export$c957ef27a0ebfd4,
    record: $508449958c1d885a$export$e5185e241753e543,
    set: $508449958c1d885a$export$adaa4cf7ef1b65be,
    strictObject: $508449958c1d885a$export$8fb0df5f40d0b477,
    string: $508449958c1d885a$export$22b082955e083ec3,
    symbol: $508449958c1d885a$export$8f701197936bc2a6,
    transformer: $508449958c1d885a$export$dc573d8a6576cdb3,
    tuple: $508449958c1d885a$export$65e3907585753458,
    "undefined": $508449958c1d885a$export$1db45310990710a5,
    union: $508449958c1d885a$export$971dd5b0dfd021b6,
    unknown: $508449958c1d885a$export$19282c40b967aec6,
    "void": $508449958c1d885a$export$490e536ee7389aeb,
    NEVER: $508449958c1d885a$export$96c94437c95d7862,
    ZodIssueCode: $508449958c1d885a$export$5ba560653e4a1035,
    quotelessJson: $508449958c1d885a$export$913eddeaf297cfea,
    ZodError: $508449958c1d885a$export$f98dac4b251ab333
});




var $d5eeb9bff661e905$export$5edeffb658f039f4 = {
    exports: {}
};


(function(module) {
    var bigInt = function(undefined$1) {
        var BASE = 1e7, LOG_BASE = 7, MAX_INT = 9007199254740992, MAX_INT_ARR = smallToArray(MAX_INT), DEFAULT_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
        var supportsNativeBigInt = typeof BigInt === "function";
        function Integer(v, radix, alphabet, caseSensitive) {
            if (typeof v === "undefined") return Integer[0];
            if (typeof radix !== "undefined") return +radix === 10 && !alphabet ? parseValue(v) : parseBase(v, radix, alphabet, caseSensitive);
            return parseValue(v);
        }
        function BigInteger(value, sign) {
            this.value = value;
            this.sign = sign;
            this.isSmall = false;
        }
        BigInteger.prototype = Object.create(Integer.prototype);
        function SmallInteger(value) {
            this.value = value;
            this.sign = value < 0;
            this.isSmall = true;
        }
        SmallInteger.prototype = Object.create(Integer.prototype);
        function NativeBigInt(value) {
            this.value = value;
        }
        NativeBigInt.prototype = Object.create(Integer.prototype);
        function isPrecise(n) {
            return -MAX_INT < n && n < MAX_INT;
        }
        function smallToArray(n) {
            if (n < 1e7) return [
                n
            ];
            if (n < 1e14) return [
                n % 1e7,
                Math.floor(n / 1e7)
            ];
            return [
                n % 1e7,
                Math.floor(n / 1e7) % 1e7,
                Math.floor(n / 1e14)
            ];
        }
        function arrayToSmall(arr) {
            trim(arr);
            var length = arr.length;
            if (length < 4 && compareAbs(arr, MAX_INT_ARR) < 0) switch(length){
                case 0:
                    return 0;
                case 1:
                    return arr[0];
                case 2:
                    return arr[0] + arr[1] * BASE;
                default:
                    return arr[0] + (arr[1] + arr[2] * BASE) * BASE;
            }
            return arr;
        }
        function trim(v) {
            var i = v.length;
            while(v[--i] === 0);
            v.length = i + 1;
        }
        function createArray(length) {
            var x = new Array(length);
            var i = -1;
            while(++i < length)x[i] = 0;
            return x;
        }
        function truncate(n) {
            if (n > 0) return Math.floor(n);
            return Math.ceil(n);
        }
        function add(a, b) {
            var l_a = a.length, l_b = b.length, r = new Array(l_a), carry = 0, base = BASE, sum, i;
            for(i = 0; i < l_b; i++){
                sum = a[i] + b[i] + carry;
                carry = sum >= base ? 1 : 0;
                r[i] = sum - carry * base;
            }
            while(i < l_a){
                sum = a[i] + carry;
                carry = sum === base ? 1 : 0;
                r[i++] = sum - carry * base;
            }
            if (carry > 0) r.push(carry);
            return r;
        }
        function addAny(a, b) {
            if (a.length >= b.length) return add(a, b);
            return add(b, a);
        }
        function addSmall(a, carry) {
            var l = a.length, r = new Array(l), base = BASE, sum, i;
            for(i = 0; i < l; i++){
                sum = a[i] - base + carry;
                carry = Math.floor(sum / base);
                r[i] = sum - carry * base;
                carry += 1;
            }
            while(carry > 0){
                r[i++] = carry % base;
                carry = Math.floor(carry / base);
            }
            return r;
        }
        BigInteger.prototype.add = function(v) {
            var n = parseValue(v);
            if (this.sign !== n.sign) return this.subtract(n.negate());
            var a = this.value, b = n.value;
            if (n.isSmall) return new BigInteger(addSmall(a, Math.abs(b)), this.sign);
            return new BigInteger(addAny(a, b), this.sign);
        };
        BigInteger.prototype.plus = BigInteger.prototype.add;
        SmallInteger.prototype.add = function(v) {
            var n = parseValue(v);
            var a = this.value;
            if (a < 0 !== n.sign) return this.subtract(n.negate());
            var b = n.value;
            if (n.isSmall) {
                if (isPrecise(a + b)) return new SmallInteger(a + b);
                b = smallToArray(Math.abs(b));
            }
            return new BigInteger(addSmall(b, Math.abs(a)), a < 0);
        };
        SmallInteger.prototype.plus = SmallInteger.prototype.add;
        NativeBigInt.prototype.add = function(v) {
            return new NativeBigInt(this.value + parseValue(v).value);
        };
        NativeBigInt.prototype.plus = NativeBigInt.prototype.add;
        function subtract(a, b) {
            var a_l = a.length, b_l = b.length, r = new Array(a_l), borrow = 0, base = BASE, i, difference;
            for(i = 0; i < b_l; i++){
                difference = a[i] - borrow - b[i];
                if (difference < 0) {
                    difference += base;
                    borrow = 1;
                } else borrow = 0;
                r[i] = difference;
            }
            for(i = b_l; i < a_l; i++){
                difference = a[i] - borrow;
                if (difference < 0) difference += base;
                else {
                    r[i++] = difference;
                    break;
                }
                r[i] = difference;
            }
            for(; i < a_l; i++)r[i] = a[i];
            trim(r);
            return r;
        }
        function subtractAny(a, b, sign) {
            var value;
            if (compareAbs(a, b) >= 0) value = subtract(a, b);
            else {
                value = subtract(b, a);
                sign = !sign;
            }
            value = arrayToSmall(value);
            if (typeof value === "number") {
                if (sign) value = -value;
                return new SmallInteger(value);
            }
            return new BigInteger(value, sign);
        }
        function subtractSmall(a, b, sign) {
            var l = a.length, r = new Array(l), carry = -b, base = BASE, i, difference;
            for(i = 0; i < l; i++){
                difference = a[i] + carry;
                carry = Math.floor(difference / base);
                difference %= base;
                r[i] = difference < 0 ? difference + base : difference;
            }
            r = arrayToSmall(r);
            if (typeof r === "number") {
                if (sign) r = -r;
                return new SmallInteger(r);
            }
            return new BigInteger(r, sign);
        }
        BigInteger.prototype.subtract = function(v) {
            var n = parseValue(v);
            if (this.sign !== n.sign) return this.add(n.negate());
            var a = this.value, b = n.value;
            if (n.isSmall) return subtractSmall(a, Math.abs(b), this.sign);
            return subtractAny(a, b, this.sign);
        };
        BigInteger.prototype.minus = BigInteger.prototype.subtract;
        SmallInteger.prototype.subtract = function(v) {
            var n = parseValue(v);
            var a = this.value;
            if (a < 0 !== n.sign) return this.add(n.negate());
            var b = n.value;
            if (n.isSmall) return new SmallInteger(a - b);
            return subtractSmall(b, Math.abs(a), a >= 0);
        };
        SmallInteger.prototype.minus = SmallInteger.prototype.subtract;
        NativeBigInt.prototype.subtract = function(v) {
            return new NativeBigInt(this.value - parseValue(v).value);
        };
        NativeBigInt.prototype.minus = NativeBigInt.prototype.subtract;
        BigInteger.prototype.negate = function() {
            return new BigInteger(this.value, !this.sign);
        };
        SmallInteger.prototype.negate = function() {
            var sign = this.sign;
            var small = new SmallInteger(-this.value);
            small.sign = !sign;
            return small;
        };
        NativeBigInt.prototype.negate = function() {
            return new NativeBigInt(-this.value);
        };
        BigInteger.prototype.abs = function() {
            return new BigInteger(this.value, false);
        };
        SmallInteger.prototype.abs = function() {
            return new SmallInteger(Math.abs(this.value));
        };
        NativeBigInt.prototype.abs = function() {
            return new NativeBigInt(this.value >= 0 ? this.value : -this.value);
        };
        function multiplyLong(a, b) {
            var a_l = a.length, b_l = b.length, l = a_l + b_l, r = createArray(l), base = BASE, product, carry, i, a_i, b_j;
            for(i = 0; i < a_l; ++i){
                a_i = a[i];
                for(var j = 0; j < b_l; ++j){
                    b_j = b[j];
                    product = a_i * b_j + r[i + j];
                    carry = Math.floor(product / base);
                    r[i + j] = product - carry * base;
                    r[i + j + 1] += carry;
                }
            }
            trim(r);
            return r;
        }
        function multiplySmall(a, b) {
            var l = a.length, r = new Array(l), base = BASE, carry = 0, product, i;
            for(i = 0; i < l; i++){
                product = a[i] * b + carry;
                carry = Math.floor(product / base);
                r[i] = product - carry * base;
            }
            while(carry > 0){
                r[i++] = carry % base;
                carry = Math.floor(carry / base);
            }
            return r;
        }
        function shiftLeft(x, n) {
            var r = [];
            while(n-- > 0)r.push(0);
            return r.concat(x);
        }
        function multiplyKaratsuba(x, y) {
            var n = Math.max(x.length, y.length);
            if (n <= 30) return multiplyLong(x, y);
            n = Math.ceil(n / 2);
            var b = x.slice(n), a = x.slice(0, n), d = y.slice(n), c = y.slice(0, n);
            var ac = multiplyKaratsuba(a, c), bd = multiplyKaratsuba(b, d), abcd = multiplyKaratsuba(addAny(a, b), addAny(c, d));
            var product = addAny(addAny(ac, shiftLeft(subtract(subtract(abcd, ac), bd), n)), shiftLeft(bd, 2 * n));
            trim(product);
            return product;
        }
        // The following function is derived from a surface fit of a graph plotting the performance difference
        // between long multiplication and karatsuba multiplication versus the lengths of the two arrays.
        function useKaratsuba(l1, l2) {
            return -0.012 * l1 - 0.012 * l2 + 0.000015 * l1 * l2 > 0;
        }
        BigInteger.prototype.multiply = function(v) {
            var n = parseValue(v), a = this.value, b = n.value, sign = this.sign !== n.sign, abs;
            if (n.isSmall) {
                if (b === 0) return Integer[0];
                if (b === 1) return this;
                if (b === -1) return this.negate();
                abs = Math.abs(b);
                if (abs < BASE) return new BigInteger(multiplySmall(a, abs), sign);
                b = smallToArray(abs);
            }
            if (useKaratsuba(a.length, b.length)) return new BigInteger(multiplyKaratsuba(a, b), sign);
            return new BigInteger(multiplyLong(a, b), sign);
        };
        BigInteger.prototype.times = BigInteger.prototype.multiply;
        function multiplySmallAndArray(a, b, sign) {
            if (a < BASE) return new BigInteger(multiplySmall(b, a), sign);
            return new BigInteger(multiplyLong(b, smallToArray(a)), sign);
        }
        SmallInteger.prototype._multiplyBySmall = function(a) {
            if (isPrecise(a.value * this.value)) return new SmallInteger(a.value * this.value);
            return multiplySmallAndArray(Math.abs(a.value), smallToArray(Math.abs(this.value)), this.sign !== a.sign);
        };
        BigInteger.prototype._multiplyBySmall = function(a) {
            if (a.value === 0) return Integer[0];
            if (a.value === 1) return this;
            if (a.value === -1) return this.negate();
            return multiplySmallAndArray(Math.abs(a.value), this.value, this.sign !== a.sign);
        };
        SmallInteger.prototype.multiply = function(v) {
            return parseValue(v)._multiplyBySmall(this);
        };
        SmallInteger.prototype.times = SmallInteger.prototype.multiply;
        NativeBigInt.prototype.multiply = function(v) {
            return new NativeBigInt(this.value * parseValue(v).value);
        };
        NativeBigInt.prototype.times = NativeBigInt.prototype.multiply;
        function square(a) {
            //console.assert(2 * BASE * BASE < MAX_INT);
            var l = a.length, r = createArray(l + l), base = BASE, product, carry, i, a_i, a_j;
            for(i = 0; i < l; i++){
                a_i = a[i];
                carry = 0 - a_i * a_i;
                for(var j = i; j < l; j++){
                    a_j = a[j];
                    product = 2 * (a_i * a_j) + r[i + j] + carry;
                    carry = Math.floor(product / base);
                    r[i + j] = product - carry * base;
                }
                r[i + l] = carry;
            }
            trim(r);
            return r;
        }
        BigInteger.prototype.square = function() {
            return new BigInteger(square(this.value), false);
        };
        SmallInteger.prototype.square = function() {
            var value = this.value * this.value;
            if (isPrecise(value)) return new SmallInteger(value);
            return new BigInteger(square(smallToArray(Math.abs(this.value))), false);
        };
        NativeBigInt.prototype.square = function(v) {
            return new NativeBigInt(this.value * this.value);
        };
        function divMod1(a, b) {
            var a_l = a.length, b_l = b.length, base = BASE, result = createArray(b.length), divisorMostSignificantDigit = b[b_l - 1], // normalization
            lambda = Math.ceil(base / (2 * divisorMostSignificantDigit)), remainder = multiplySmall(a, lambda), divisor = multiplySmall(b, lambda), quotientDigit, shift, carry, borrow, i, l, q;
            if (remainder.length <= a_l) remainder.push(0);
            divisor.push(0);
            divisorMostSignificantDigit = divisor[b_l - 1];
            for(shift = a_l - b_l; shift >= 0; shift--){
                quotientDigit = base - 1;
                if (remainder[shift + b_l] !== divisorMostSignificantDigit) quotientDigit = Math.floor((remainder[shift + b_l] * base + remainder[shift + b_l - 1]) / divisorMostSignificantDigit);
                // quotientDigit <= base - 1
                carry = 0;
                borrow = 0;
                l = divisor.length;
                for(i = 0; i < l; i++){
                    carry += quotientDigit * divisor[i];
                    q = Math.floor(carry / base);
                    borrow += remainder[shift + i] - (carry - q * base);
                    carry = q;
                    if (borrow < 0) {
                        remainder[shift + i] = borrow + base;
                        borrow = -1;
                    } else {
                        remainder[shift + i] = borrow;
                        borrow = 0;
                    }
                }
                while(borrow !== 0){
                    quotientDigit -= 1;
                    carry = 0;
                    for(i = 0; i < l; i++){
                        carry += remainder[shift + i] - base + divisor[i];
                        if (carry < 0) {
                            remainder[shift + i] = carry + base;
                            carry = 0;
                        } else {
                            remainder[shift + i] = carry;
                            carry = 1;
                        }
                    }
                    borrow += carry;
                }
                result[shift] = quotientDigit;
            }
            // denormalization
            remainder = divModSmall(remainder, lambda)[0];
            return [
                arrayToSmall(result),
                arrayToSmall(remainder)
            ];
        }
        function divMod2(a, b) {
            // Performs faster than divMod1 on larger input sizes.
            var a_l = a.length, b_l = b.length, result = [], part = [], base = BASE, guess, xlen, highx, highy, check;
            while(a_l){
                part.unshift(a[--a_l]);
                trim(part);
                if (compareAbs(part, b) < 0) {
                    result.push(0);
                    continue;
                }
                xlen = part.length;
                highx = part[xlen - 1] * base + part[xlen - 2];
                highy = b[b_l - 1] * base + b[b_l - 2];
                if (xlen > b_l) highx = (highx + 1) * base;
                guess = Math.ceil(highx / highy);
                do {
                    check = multiplySmall(b, guess);
                    if (compareAbs(check, part) <= 0) break;
                    guess--;
                }while (guess);
                result.push(guess);
                part = subtract(part, check);
            }
            result.reverse();
            return [
                arrayToSmall(result),
                arrayToSmall(part)
            ];
        }
        function divModSmall(value, lambda) {
            var length = value.length, quotient = createArray(length), base = BASE, i, q, remainder, divisor;
            remainder = 0;
            for(i = length - 1; i >= 0; --i){
                divisor = remainder * base + value[i];
                q = truncate(divisor / lambda);
                remainder = divisor - q * lambda;
                quotient[i] = q | 0;
            }
            return [
                quotient,
                remainder | 0
            ];
        }
        function divModAny(self, v) {
            var value, n = parseValue(v);
            if (supportsNativeBigInt) return [
                new NativeBigInt(self.value / n.value),
                new NativeBigInt(self.value % n.value)
            ];
            var a = self.value, b = n.value;
            var quotient;
            if (b === 0) throw new Error("Cannot divide by zero");
            if (self.isSmall) {
                if (n.isSmall) return [
                    new SmallInteger(truncate(a / b)),
                    new SmallInteger(a % b)
                ];
                return [
                    Integer[0],
                    self
                ];
            }
            if (n.isSmall) {
                if (b === 1) return [
                    self,
                    Integer[0]
                ];
                if (b == -1) return [
                    self.negate(),
                    Integer[0]
                ];
                var abs = Math.abs(b);
                if (abs < BASE) {
                    value = divModSmall(a, abs);
                    quotient = arrayToSmall(value[0]);
                    var remainder = value[1];
                    if (self.sign) remainder = -remainder;
                    if (typeof quotient === "number") {
                        if (self.sign !== n.sign) quotient = -quotient;
                        return [
                            new SmallInteger(quotient),
                            new SmallInteger(remainder)
                        ];
                    }
                    return [
                        new BigInteger(quotient, self.sign !== n.sign),
                        new SmallInteger(remainder)
                    ];
                }
                b = smallToArray(abs);
            }
            var comparison = compareAbs(a, b);
            if (comparison === -1) return [
                Integer[0],
                self
            ];
            if (comparison === 0) return [
                Integer[self.sign === n.sign ? 1 : -1],
                Integer[0]
            ];
            // divMod1 is faster on smaller input sizes
            if (a.length + b.length <= 200) value = divMod1(a, b);
            else value = divMod2(a, b);
            quotient = value[0];
            var qSign = self.sign !== n.sign, mod = value[1], mSign = self.sign;
            if (typeof quotient === "number") {
                if (qSign) quotient = -quotient;
                quotient = new SmallInteger(quotient);
            } else quotient = new BigInteger(quotient, qSign);
            if (typeof mod === "number") {
                if (mSign) mod = -mod;
                mod = new SmallInteger(mod);
            } else mod = new BigInteger(mod, mSign);
            return [
                quotient,
                mod
            ];
        }
        BigInteger.prototype.divmod = function(v) {
            var result = divModAny(this, v);
            return {
                quotient: result[0],
                remainder: result[1]
            };
        };
        NativeBigInt.prototype.divmod = SmallInteger.prototype.divmod = BigInteger.prototype.divmod;
        BigInteger.prototype.divide = function(v) {
            return divModAny(this, v)[0];
        };
        NativeBigInt.prototype.over = NativeBigInt.prototype.divide = function(v) {
            return new NativeBigInt(this.value / parseValue(v).value);
        };
        SmallInteger.prototype.over = SmallInteger.prototype.divide = BigInteger.prototype.over = BigInteger.prototype.divide;
        BigInteger.prototype.mod = function(v) {
            return divModAny(this, v)[1];
        };
        NativeBigInt.prototype.mod = NativeBigInt.prototype.remainder = function(v) {
            return new NativeBigInt(this.value % parseValue(v).value);
        };
        SmallInteger.prototype.remainder = SmallInteger.prototype.mod = BigInteger.prototype.remainder = BigInteger.prototype.mod;
        BigInteger.prototype.pow = function(v) {
            var n = parseValue(v), a = this.value, b = n.value, value, x, y;
            if (b === 0) return Integer[1];
            if (a === 0) return Integer[0];
            if (a === 1) return Integer[1];
            if (a === -1) return n.isEven() ? Integer[1] : Integer[-1];
            if (n.sign) return Integer[0];
            if (!n.isSmall) throw new Error("The exponent " + n.toString() + " is too large.");
            if (this.isSmall) {
                if (isPrecise(value = Math.pow(a, b))) return new SmallInteger(truncate(value));
            }
            x = this;
            y = Integer[1];
            while(true){
                if (b & true) {
                    y = y.times(x);
                    --b;
                }
                if (b === 0) break;
                b /= 2;
                x = x.square();
            }
            return y;
        };
        SmallInteger.prototype.pow = BigInteger.prototype.pow;
        NativeBigInt.prototype.pow = function(v) {
            var n = parseValue(v);
            var a = this.value, b = n.value;
            var _0 = BigInt(0), _1 = BigInt(1), _2 = BigInt(2);
            if (b === _0) return Integer[1];
            if (a === _0) return Integer[0];
            if (a === _1) return Integer[1];
            if (a === BigInt(-1)) return n.isEven() ? Integer[1] : Integer[-1];
            if (n.isNegative()) return new NativeBigInt(_0);
            var x = this;
            var y = Integer[1];
            while(true){
                if ((b & _1) === _1) {
                    y = y.times(x);
                    --b;
                }
                if (b === _0) break;
                b /= _2;
                x = x.square();
            }
            return y;
        };
        BigInteger.prototype.modPow = function(exp, mod) {
            exp = parseValue(exp);
            mod = parseValue(mod);
            if (mod.isZero()) throw new Error("Cannot take modPow with modulus 0");
            var r = Integer[1], base = this.mod(mod);
            if (exp.isNegative()) {
                exp = exp.multiply(Integer[-1]);
                base = base.modInv(mod);
            }
            while(exp.isPositive()){
                if (base.isZero()) return Integer[0];
                if (exp.isOdd()) r = r.multiply(base).mod(mod);
                exp = exp.divide(2);
                base = base.square().mod(mod);
            }
            return r;
        };
        NativeBigInt.prototype.modPow = SmallInteger.prototype.modPow = BigInteger.prototype.modPow;
        function compareAbs(a, b) {
            if (a.length !== b.length) return a.length > b.length ? 1 : -1;
            for(var i = a.length - 1; i >= 0; i--){
                if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1;
            }
            return 0;
        }
        BigInteger.prototype.compareAbs = function(v) {
            var n = parseValue(v), a = this.value, b = n.value;
            if (n.isSmall) return 1;
            return compareAbs(a, b);
        };
        SmallInteger.prototype.compareAbs = function(v) {
            var n = parseValue(v), a = Math.abs(this.value), b = n.value;
            if (n.isSmall) {
                b = Math.abs(b);
                return a === b ? 0 : a > b ? 1 : -1;
            }
            return -1;
        };
        NativeBigInt.prototype.compareAbs = function(v) {
            var a = this.value;
            var b = parseValue(v).value;
            a = a >= 0 ? a : -a;
            b = b >= 0 ? b : -b;
            return a === b ? 0 : a > b ? 1 : -1;
        };
        BigInteger.prototype.compare = function(v) {
            // See discussion about comparison with Infinity:
            // https://github.com/peterolson/BigInteger.js/issues/61
            if (v === Infinity) return -1;
            if (v === -Infinity) return 1;
            var n = parseValue(v), a = this.value, b = n.value;
            if (this.sign !== n.sign) return n.sign ? 1 : -1;
            if (n.isSmall) return this.sign ? -1 : 1;
            return compareAbs(a, b) * (this.sign ? -1 : 1);
        };
        BigInteger.prototype.compareTo = BigInteger.prototype.compare;
        SmallInteger.prototype.compare = function(v) {
            if (v === Infinity) return -1;
            if (v === -Infinity) return 1;
            var n = parseValue(v), a = this.value, b = n.value;
            if (n.isSmall) return a == b ? 0 : a > b ? 1 : -1;
            if (a < 0 !== n.sign) return a < 0 ? -1 : 1;
            return a < 0 ? 1 : -1;
        };
        SmallInteger.prototype.compareTo = SmallInteger.prototype.compare;
        NativeBigInt.prototype.compare = function(v) {
            if (v === Infinity) return -1;
            if (v === -Infinity) return 1;
            var a = this.value;
            var b = parseValue(v).value;
            return a === b ? 0 : a > b ? 1 : -1;
        };
        NativeBigInt.prototype.compareTo = NativeBigInt.prototype.compare;
        BigInteger.prototype.equals = function(v) {
            return this.compare(v) === 0;
        };
        NativeBigInt.prototype.eq = NativeBigInt.prototype.equals = SmallInteger.prototype.eq = SmallInteger.prototype.equals = BigInteger.prototype.eq = BigInteger.prototype.equals;
        BigInteger.prototype.notEquals = function(v) {
            return this.compare(v) !== 0;
        };
        NativeBigInt.prototype.neq = NativeBigInt.prototype.notEquals = SmallInteger.prototype.neq = SmallInteger.prototype.notEquals = BigInteger.prototype.neq = BigInteger.prototype.notEquals;
        BigInteger.prototype.greater = function(v) {
            return this.compare(v) > 0;
        };
        NativeBigInt.prototype.gt = NativeBigInt.prototype.greater = SmallInteger.prototype.gt = SmallInteger.prototype.greater = BigInteger.prototype.gt = BigInteger.prototype.greater;
        BigInteger.prototype.lesser = function(v) {
            return this.compare(v) < 0;
        };
        NativeBigInt.prototype.lt = NativeBigInt.prototype.lesser = SmallInteger.prototype.lt = SmallInteger.prototype.lesser = BigInteger.prototype.lt = BigInteger.prototype.lesser;
        BigInteger.prototype.greaterOrEquals = function(v) {
            return this.compare(v) >= 0;
        };
        NativeBigInt.prototype.geq = NativeBigInt.prototype.greaterOrEquals = SmallInteger.prototype.geq = SmallInteger.prototype.greaterOrEquals = BigInteger.prototype.geq = BigInteger.prototype.greaterOrEquals;
        BigInteger.prototype.lesserOrEquals = function(v) {
            return this.compare(v) <= 0;
        };
        NativeBigInt.prototype.leq = NativeBigInt.prototype.lesserOrEquals = SmallInteger.prototype.leq = SmallInteger.prototype.lesserOrEquals = BigInteger.prototype.leq = BigInteger.prototype.lesserOrEquals;
        BigInteger.prototype.isEven = function() {
            return (this.value[0] & 1) === 0;
        };
        SmallInteger.prototype.isEven = function() {
            return (this.value & 1) === 0;
        };
        NativeBigInt.prototype.isEven = function() {
            return (this.value & BigInt(1)) === BigInt(0);
        };
        BigInteger.prototype.isOdd = function() {
            return (this.value[0] & 1) === 1;
        };
        SmallInteger.prototype.isOdd = function() {
            return (this.value & 1) === 1;
        };
        NativeBigInt.prototype.isOdd = function() {
            return (this.value & BigInt(1)) === BigInt(1);
        };
        BigInteger.prototype.isPositive = function() {
            return !this.sign;
        };
        SmallInteger.prototype.isPositive = function() {
            return this.value > 0;
        };
        NativeBigInt.prototype.isPositive = SmallInteger.prototype.isPositive;
        BigInteger.prototype.isNegative = function() {
            return this.sign;
        };
        SmallInteger.prototype.isNegative = function() {
            return this.value < 0;
        };
        NativeBigInt.prototype.isNegative = SmallInteger.prototype.isNegative;
        BigInteger.prototype.isUnit = function() {
            return false;
        };
        SmallInteger.prototype.isUnit = function() {
            return Math.abs(this.value) === 1;
        };
        NativeBigInt.prototype.isUnit = function() {
            return this.abs().value === BigInt(1);
        };
        BigInteger.prototype.isZero = function() {
            return false;
        };
        SmallInteger.prototype.isZero = function() {
            return this.value === 0;
        };
        NativeBigInt.prototype.isZero = function() {
            return this.value === BigInt(0);
        };
        BigInteger.prototype.isDivisibleBy = function(v) {
            var n = parseValue(v);
            if (n.isZero()) return false;
            if (n.isUnit()) return true;
            if (n.compareAbs(2) === 0) return this.isEven();
            return this.mod(n).isZero();
        };
        NativeBigInt.prototype.isDivisibleBy = SmallInteger.prototype.isDivisibleBy = BigInteger.prototype.isDivisibleBy;
        function isBasicPrime(v) {
            var n = v.abs();
            if (n.isUnit()) return false;
            if (n.equals(2) || n.equals(3) || n.equals(5)) return true;
            if (n.isEven() || n.isDivisibleBy(3) || n.isDivisibleBy(5)) return false;
            if (n.lesser(49)) return true;
        // we don't know if it's prime: let the other functions figure it out
        }
        function millerRabinTest(n, a) {
            var nPrev = n.prev(), b = nPrev, r = 0, d, i, x;
            while(b.isEven())b = b.divide(2), r++;
            next: for(i = 0; i < a.length; i++){
                if (n.lesser(a[i])) continue;
                x = bigInt(a[i]).modPow(b, n);
                if (x.isUnit() || x.equals(nPrev)) continue;
                for(d = r - 1; d != 0; d--){
                    x = x.square().mod(n);
                    if (x.isUnit()) return false;
                    if (x.equals(nPrev)) continue next;
                }
                return false;
            }
            return true;
        }
        // Set "strict" to true to force GRH-supported lower bound of 2*log(N)^2
        BigInteger.prototype.isPrime = function(strict) {
            var isPrime = isBasicPrime(this);
            if (isPrime !== undefined$1) return isPrime;
            var n = this.abs();
            var bits = n.bitLength();
            if (bits <= 64) return millerRabinTest(n, [
                2,
                3,
                5,
                7,
                11,
                13,
                17,
                19,
                23,
                29,
                31,
                37
            ]);
            var logN = Math.log(2) * bits.toJSNumber();
            var t = Math.ceil(strict === true ? 2 * Math.pow(logN, 2) : logN);
            for(var a = [], i = 0; i < t; i++)a.push(bigInt(i + 2));
            return millerRabinTest(n, a);
        };
        NativeBigInt.prototype.isPrime = SmallInteger.prototype.isPrime = BigInteger.prototype.isPrime;
        BigInteger.prototype.isProbablePrime = function(iterations, rng) {
            var isPrime = isBasicPrime(this);
            if (isPrime !== undefined$1) return isPrime;
            var n = this.abs();
            var t = iterations === undefined$1 ? 5 : iterations;
            for(var a = [], i = 0; i < t; i++)a.push(bigInt.randBetween(2, n.minus(2), rng));
            return millerRabinTest(n, a);
        };
        NativeBigInt.prototype.isProbablePrime = SmallInteger.prototype.isProbablePrime = BigInteger.prototype.isProbablePrime;
        BigInteger.prototype.modInv = function(n) {
            var t = bigInt.zero, newT = bigInt.one, r = parseValue(n), newR = this.abs(), q, lastT, lastR;
            while(!newR.isZero()){
                q = r.divide(newR);
                lastT = t;
                lastR = r;
                t = newT;
                r = newR;
                newT = lastT.subtract(q.multiply(newT));
                newR = lastR.subtract(q.multiply(newR));
            }
            if (!r.isUnit()) throw new Error(this.toString() + " and " + n.toString() + " are not co-prime");
            if (t.compare(0) === -1) t = t.add(n);
            if (this.isNegative()) return t.negate();
            return t;
        };
        NativeBigInt.prototype.modInv = SmallInteger.prototype.modInv = BigInteger.prototype.modInv;
        BigInteger.prototype.next = function() {
            var value = this.value;
            if (this.sign) return subtractSmall(value, 1, this.sign);
            return new BigInteger(addSmall(value, 1), this.sign);
        };
        SmallInteger.prototype.next = function() {
            var value = this.value;
            if (value + 1 < MAX_INT) return new SmallInteger(value + 1);
            return new BigInteger(MAX_INT_ARR, false);
        };
        NativeBigInt.prototype.next = function() {
            return new NativeBigInt(this.value + BigInt(1));
        };
        BigInteger.prototype.prev = function() {
            var value = this.value;
            if (this.sign) return new BigInteger(addSmall(value, 1), true);
            return subtractSmall(value, 1, this.sign);
        };
        SmallInteger.prototype.prev = function() {
            var value = this.value;
            if (value - 1 > -MAX_INT) return new SmallInteger(value - 1);
            return new BigInteger(MAX_INT_ARR, true);
        };
        NativeBigInt.prototype.prev = function() {
            return new NativeBigInt(this.value - BigInt(1));
        };
        var powersOfTwo = [
            1
        ];
        while(2 * powersOfTwo[powersOfTwo.length - 1] <= BASE)powersOfTwo.push(2 * powersOfTwo[powersOfTwo.length - 1]);
        var powers2Length = powersOfTwo.length, highestPower2 = powersOfTwo[powers2Length - 1];
        function shift_isSmall(n) {
            return Math.abs(n) <= BASE;
        }
        BigInteger.prototype.shiftLeft = function(v) {
            var n = parseValue(v).toJSNumber();
            if (!shift_isSmall(n)) throw new Error(String(n) + " is too large for shifting.");
            if (n < 0) return this.shiftRight(-n);
            var result = this;
            if (result.isZero()) return result;
            while(n >= powers2Length){
                result = result.multiply(highestPower2);
                n -= powers2Length - 1;
            }
            return result.multiply(powersOfTwo[n]);
        };
        NativeBigInt.prototype.shiftLeft = SmallInteger.prototype.shiftLeft = BigInteger.prototype.shiftLeft;
        BigInteger.prototype.shiftRight = function(v) {
            var remQuo;
            var n = parseValue(v).toJSNumber();
            if (!shift_isSmall(n)) throw new Error(String(n) + " is too large for shifting.");
            if (n < 0) return this.shiftLeft(-n);
            var result = this;
            while(n >= powers2Length){
                if (result.isZero() || result.isNegative() && result.isUnit()) return result;
                remQuo = divModAny(result, highestPower2);
                result = remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
                n -= powers2Length - 1;
            }
            remQuo = divModAny(result, powersOfTwo[n]);
            return remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
        };
        NativeBigInt.prototype.shiftRight = SmallInteger.prototype.shiftRight = BigInteger.prototype.shiftRight;
        function bitwise(x, y, fn) {
            y = parseValue(y);
            var xSign = x.isNegative(), ySign = y.isNegative();
            var xRem = xSign ? x.not() : x, yRem = ySign ? y.not() : y;
            var xDigit = 0, yDigit = 0;
            var xDivMod = null, yDivMod = null;
            var result = [];
            while(!xRem.isZero() || !yRem.isZero()){
                xDivMod = divModAny(xRem, highestPower2);
                xDigit = xDivMod[1].toJSNumber();
                if (xSign) xDigit = highestPower2 - 1 - xDigit; // two's complement for negative numbers
                yDivMod = divModAny(yRem, highestPower2);
                yDigit = yDivMod[1].toJSNumber();
                if (ySign) yDigit = highestPower2 - 1 - yDigit; // two's complement for negative numbers
                xRem = xDivMod[0];
                yRem = yDivMod[0];
                result.push(fn(xDigit, yDigit));
            }
            var sum = fn(xSign ? 1 : 0, ySign ? 1 : 0) !== 0 ? bigInt(-1) : bigInt(0);
            for(var i = result.length - 1; i >= 0; i -= 1)sum = sum.multiply(highestPower2).add(bigInt(result[i]));
            return sum;
        }
        BigInteger.prototype.not = function() {
            return this.negate().prev();
        };
        NativeBigInt.prototype.not = SmallInteger.prototype.not = BigInteger.prototype.not;
        BigInteger.prototype.and = function(n) {
            return bitwise(this, n, function(a, b) {
                return a & b;
            });
        };
        NativeBigInt.prototype.and = SmallInteger.prototype.and = BigInteger.prototype.and;
        BigInteger.prototype.or = function(n) {
            return bitwise(this, n, function(a, b) {
                return a | b;
            });
        };
        NativeBigInt.prototype.or = SmallInteger.prototype.or = BigInteger.prototype.or;
        BigInteger.prototype.xor = function(n) {
            return bitwise(this, n, function(a, b) {
                return a ^ b;
            });
        };
        NativeBigInt.prototype.xor = SmallInteger.prototype.xor = BigInteger.prototype.xor;
        var LOBMASK_I = 1073741824, LOBMASK_BI = (BASE & -BASE) * (BASE & -BASE) | LOBMASK_I;
        function roughLOB(n) {
            // SmallInteger: return Min(lowestOneBit(n), 1 << 30)
            // BigInteger: return Min(lowestOneBit(n), 1 << 14) [BASE=1e7]
            var v = n.value, x = typeof v === "number" ? v | LOBMASK_I : typeof v === "bigint" ? v | BigInt(LOBMASK_I) : v[0] + v[1] * BASE | LOBMASK_BI;
            return x & -x;
        }
        function integerLogarithm(value, base) {
            if (base.compareTo(value) <= 0) {
                var tmp = integerLogarithm(value, base.square(base));
                var p = tmp.p;
                var e = tmp.e;
                var t = p.multiply(base);
                return t.compareTo(value) <= 0 ? {
                    p: t,
                    e: e * 2 + 1
                } : {
                    p: p,
                    e: e * 2
                };
            }
            return {
                p: bigInt(1),
                e: 0
            };
        }
        BigInteger.prototype.bitLength = function() {
            var n = this;
            if (n.compareTo(bigInt(0)) < 0) n = n.negate().subtract(bigInt(1));
            if (n.compareTo(bigInt(0)) === 0) return bigInt(0);
            return bigInt(integerLogarithm(n, bigInt(2)).e).add(bigInt(1));
        };
        NativeBigInt.prototype.bitLength = SmallInteger.prototype.bitLength = BigInteger.prototype.bitLength;
        function max(a, b) {
            a = parseValue(a);
            b = parseValue(b);
            return a.greater(b) ? a : b;
        }
        function min(a, b) {
            a = parseValue(a);
            b = parseValue(b);
            return a.lesser(b) ? a : b;
        }
        function gcd(a, b) {
            a = parseValue(a).abs();
            b = parseValue(b).abs();
            if (a.equals(b)) return a;
            if (a.isZero()) return b;
            if (b.isZero()) return a;
            var c = Integer[1], d, t;
            while(a.isEven() && b.isEven()){
                d = min(roughLOB(a), roughLOB(b));
                a = a.divide(d);
                b = b.divide(d);
                c = c.multiply(d);
            }
            while(a.isEven())a = a.divide(roughLOB(a));
            do {
                while(b.isEven())b = b.divide(roughLOB(b));
                if (a.greater(b)) {
                    t = b;
                    b = a;
                    a = t;
                }
                b = b.subtract(a);
            }while (!b.isZero());
            return c.isUnit() ? a : a.multiply(c);
        }
        function lcm(a, b) {
            a = parseValue(a).abs();
            b = parseValue(b).abs();
            return a.divide(gcd(a, b)).multiply(b);
        }
        function randBetween(a, b, rng) {
            a = parseValue(a);
            b = parseValue(b);
            var usedRNG = rng || Math.random;
            var low = min(a, b), high = max(a, b);
            var range = high.subtract(low).add(1);
            if (range.isSmall) return low.add(Math.floor(usedRNG() * range));
            var digits = toBase(range, BASE).value;
            var result = [], restricted = true;
            for(var i = 0; i < digits.length; i++){
                var top = restricted ? digits[i] + (i + 1 < digits.length ? digits[i + 1] / BASE : 0) : BASE;
                var digit = truncate(usedRNG() * top);
                result.push(digit);
                if (digit < digits[i]) restricted = false;
            }
            return low.add(Integer.fromArray(result, BASE, false));
        }
        var parseBase = function(text, base, alphabet, caseSensitive) {
            alphabet = alphabet || DEFAULT_ALPHABET;
            text = String(text);
            if (!caseSensitive) {
                text = text.toLowerCase();
                alphabet = alphabet.toLowerCase();
            }
            var length = text.length;
            var i;
            var absBase = Math.abs(base);
            var alphabetValues = {};
            for(i = 0; i < alphabet.length; i++)alphabetValues[alphabet[i]] = i;
            for(i = 0; i < length; i++){
                var c = text[i];
                if (c === "-") continue;
                if (c in alphabetValues) {
                    if (alphabetValues[c] >= absBase) {
                        if (c === "1" && absBase === 1) continue;
                        throw new Error(c + " is not a valid digit in base " + base + ".");
                    }
                }
            }
            base = parseValue(base);
            var digits = [];
            var isNegative = text[0] === "-";
            for(i = isNegative ? 1 : 0; i < text.length; i++){
                var c = text[i];
                if (c in alphabetValues) digits.push(parseValue(alphabetValues[c]));
                else if (c === "<") {
                    var start = i;
                    do i++;
                    while (text[i] !== ">" && i < text.length);
                    digits.push(parseValue(text.slice(start + 1, i)));
                } else throw new Error(c + " is not a valid character");
            }
            return parseBaseFromArray(digits, base, isNegative);
        };
        function parseBaseFromArray(digits, base, isNegative) {
            var val = Integer[0], pow = Integer[1], i;
            for(i = digits.length - 1; i >= 0; i--){
                val = val.add(digits[i].times(pow));
                pow = pow.times(base);
            }
            return isNegative ? val.negate() : val;
        }
        function stringify(digit, alphabet) {
            alphabet = alphabet || DEFAULT_ALPHABET;
            if (digit < alphabet.length) return alphabet[digit];
            return "<" + digit + ">";
        }
        function toBase(n, base) {
            base = bigInt(base);
            if (base.isZero()) {
                if (n.isZero()) return {
                    value: [
                        0
                    ],
                    isNegative: false
                };
                throw new Error("Cannot convert nonzero numbers to base 0.");
            }
            if (base.equals(-1)) {
                if (n.isZero()) return {
                    value: [
                        0
                    ],
                    isNegative: false
                };
                if (n.isNegative()) return {
                    value: [].concat.apply([], Array.apply(null, Array(-n.toJSNumber())).map(Array.prototype.valueOf, [
                        1,
                        0
                    ])),
                    isNegative: false
                };
                var arr = Array.apply(null, Array(n.toJSNumber() - 1)).map(Array.prototype.valueOf, [
                    0,
                    1
                ]);
                arr.unshift([
                    1
                ]);
                return {
                    value: [].concat.apply([], arr),
                    isNegative: false
                };
            }
            var neg = false;
            if (n.isNegative() && base.isPositive()) {
                neg = true;
                n = n.abs();
            }
            if (base.isUnit()) {
                if (n.isZero()) return {
                    value: [
                        0
                    ],
                    isNegative: false
                };
                return {
                    value: Array.apply(null, Array(n.toJSNumber())).map(Number.prototype.valueOf, 1),
                    isNegative: neg
                };
            }
            var out = [];
            var left = n, divmod;
            while(left.isNegative() || left.compareAbs(base) >= 0){
                divmod = left.divmod(base);
                left = divmod.quotient;
                var digit = divmod.remainder;
                if (digit.isNegative()) {
                    digit = base.minus(digit).abs();
                    left = left.next();
                }
                out.push(digit.toJSNumber());
            }
            out.push(left.toJSNumber());
            return {
                value: out.reverse(),
                isNegative: neg
            };
        }
        function toBaseString(n, base, alphabet) {
            var arr = toBase(n, base);
            return (arr.isNegative ? "-" : "") + arr.value.map(function(x) {
                return stringify(x, alphabet);
            }).join("");
        }
        BigInteger.prototype.toArray = function(radix) {
            return toBase(this, radix);
        };
        SmallInteger.prototype.toArray = function(radix) {
            return toBase(this, radix);
        };
        NativeBigInt.prototype.toArray = function(radix) {
            return toBase(this, radix);
        };
        BigInteger.prototype.toString = function(radix, alphabet) {
            if (radix === undefined$1) radix = 10;
            if (radix !== 10 || alphabet) return toBaseString(this, radix, alphabet);
            var v = this.value, l = v.length, str = String(v[--l]), zeros = "0000000", digit;
            while(--l >= 0){
                digit = String(v[l]);
                str += zeros.slice(digit.length) + digit;
            }
            var sign = this.sign ? "-" : "";
            return sign + str;
        };
        SmallInteger.prototype.toString = function(radix, alphabet) {
            if (radix === undefined$1) radix = 10;
            if (radix != 10 || alphabet) return toBaseString(this, radix, alphabet);
            return String(this.value);
        };
        NativeBigInt.prototype.toString = SmallInteger.prototype.toString;
        NativeBigInt.prototype.toJSON = BigInteger.prototype.toJSON = SmallInteger.prototype.toJSON = function() {
            return this.toString();
        };
        BigInteger.prototype.valueOf = function() {
            return parseInt(this.toString(), 10);
        };
        BigInteger.prototype.toJSNumber = BigInteger.prototype.valueOf;
        SmallInteger.prototype.valueOf = function() {
            return this.value;
        };
        SmallInteger.prototype.toJSNumber = SmallInteger.prototype.valueOf;
        NativeBigInt.prototype.valueOf = NativeBigInt.prototype.toJSNumber = function() {
            return parseInt(this.toString(), 10);
        };
        function parseStringValue(v) {
            if (isPrecise(+v)) {
                var x = +v;
                if (x === truncate(x)) return supportsNativeBigInt ? new NativeBigInt(BigInt(x)) : new SmallInteger(x);
                throw new Error("Invalid integer: " + v);
            }
            var sign = v[0] === "-";
            if (sign) v = v.slice(1);
            var split = v.split(/e/i);
            if (split.length > 2) throw new Error("Invalid integer: " + split.join("e"));
            if (split.length === 2) {
                var exp = split[1];
                if (exp[0] === "+") exp = exp.slice(1);
                exp = +exp;
                if (exp !== truncate(exp) || !isPrecise(exp)) throw new Error("Invalid integer: " + exp + " is not a valid exponent.");
                var text = split[0];
                var decimalPlace = text.indexOf(".");
                if (decimalPlace >= 0) {
                    exp -= text.length - decimalPlace - 1;
                    text = text.slice(0, decimalPlace) + text.slice(decimalPlace + 1);
                }
                if (exp < 0) throw new Error("Cannot include negative exponent part for integers");
                text += new Array(exp + 1).join("0");
                v = text;
            }
            var isValid = /^([0-9][0-9]*)$/.test(v);
            if (!isValid) throw new Error("Invalid integer: " + v);
            if (supportsNativeBigInt) return new NativeBigInt(BigInt(sign ? "-" + v : v));
            var r = [], max = v.length, l = LOG_BASE, min = max - l;
            while(max > 0){
                r.push(+v.slice(min, max));
                min -= l;
                if (min < 0) min = 0;
                max -= l;
            }
            trim(r);
            return new BigInteger(r, sign);
        }
        function parseNumberValue(v) {
            if (supportsNativeBigInt) return new NativeBigInt(BigInt(v));
            if (isPrecise(v)) {
                if (v !== truncate(v)) throw new Error(v + " is not an integer.");
                return new SmallInteger(v);
            }
            return parseStringValue(v.toString());
        }
        function parseValue(v) {
            if (typeof v === "number") return parseNumberValue(v);
            if (typeof v === "string") return parseStringValue(v);
            if (typeof v === "bigint") return new NativeBigInt(v);
            return v;
        }
        // Pre-define numbers in range [-999,999]
        for(var i = 0; i < 1000; i++){
            Integer[i] = parseValue(i);
            if (i > 0) Integer[-i] = parseValue(-i);
        }
        // Backwards compatibility
        Integer.one = Integer[1];
        Integer.zero = Integer[0];
        Integer.minusOne = Integer[-1];
        Integer.max = max;
        Integer.min = min;
        Integer.gcd = gcd;
        Integer.lcm = lcm;
        Integer.isInstance = function(x) {
            return x instanceof BigInteger || x instanceof SmallInteger || x instanceof NativeBigInt;
        };
        Integer.randBetween = randBetween;
        Integer.fromArray = function(digits, base, isNegative) {
            return parseBaseFromArray(digits.map(parseValue), parseValue(base || 10), isNegative);
        };
        return Integer;
    }();
    // Node.js check
    if (module.hasOwnProperty("exports")) module.exports = bigInt;
})((0, $d5eeb9bff661e905$export$5edeffb658f039f4));
var $37ac08ad601c671a$var$BigIntegerExports = (0, $d5eeb9bff661e905$export$5edeffb658f039f4).exports;
var $37ac08ad601c671a$export$2e2bcd8739ae039 = /*@__PURE__*/ (0, $b07963189a833f03$export$22b09f878622677a)($37ac08ad601c671a$var$BigIntegerExports);


/**
 * Context: Due to Discord supporting more than 32 permissions, permission calculation has become more complicated than naive
 * bit operations on `number`s. To support this generically, we have created BigFlagUtils to work with bit-flags greater
 * than 32-bits in size.
 *
 * Ideally, we would like to use BigInt, which is pretty efficient, but some JavaScript engines do not support it.
 *
 * This file is intended to be a set of lower-level operators that act directly on "BigFlags".
 *
 * If you're working with permissions, in most cases you can probably use PermissionUtils.
 */ const $eb9554ea197019e4$var$MAX_BIG_INT = 64;
const $eb9554ea197019e4$var$SMALL_INT = 16;
const $eb9554ea197019e4$var$PARTS = $eb9554ea197019e4$var$MAX_BIG_INT / $eb9554ea197019e4$var$SMALL_INT;
function $eb9554ea197019e4$var$checkBrowserSupportsBigInt() {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        BigInt;
        return true;
    } catch (e) {
        return false;
    }
}
/**
 * Takes the sliced output of `toHexReverseArray` and converts hex to decimal.
 */ function $eb9554ea197019e4$var$fromHexReverseArray(hexValues, start, size) {
    let value = 0;
    for(let i = 0; i < size; i++){
        const byte = hexValues[start + i];
        if (byte === undefined) break;
        value += byte * 16 ** i;
    }
    return value;
}
/**
 * Converts a number string to array of hex bytes based on the implementation found at
 * https://stackoverflow.com/questions/18626844/convert-a-large-integer-to-a-hex-string-in-javascript
 *
 * To avoid extra allocations it returns the values in reverse.
 */ function $eb9554ea197019e4$var$toHexReverseArray(value) {
    const sum = [];
    for(let i = 0; i < value.length; i++){
        let s = Number(value[i]);
        for(let j = 0; s || j < sum.length; j++){
            s += (sum[j] || 0) * 10;
            sum[j] = s % 16;
            s = (s - sum[j]) / 16;
        }
    }
    return sum;
}
/**
 * Splits a big integers into array of small integers to perform fast bitwise operations.
 */ function $eb9554ea197019e4$var$splitBigInt(value) {
    const sum = $eb9554ea197019e4$var$toHexReverseArray(value);
    const parts = Array($eb9554ea197019e4$var$PARTS);
    for(let i = 0; i < $eb9554ea197019e4$var$PARTS; i++)// Highest bits to lowest bits.
    parts[$eb9554ea197019e4$var$PARTS - 1 - i] = $eb9554ea197019e4$var$fromHexReverseArray(sum, i * $eb9554ea197019e4$var$PARTS, $eb9554ea197019e4$var$PARTS);
    return parts;
}
class $eb9554ea197019e4$var$HighLow {
    static fromString(value) {
        return new $eb9554ea197019e4$var$HighLow($eb9554ea197019e4$var$splitBigInt(value), value);
    }
    static fromBit(index) {
        const parts = Array($eb9554ea197019e4$var$PARTS);
        const offset = Math.floor(index / $eb9554ea197019e4$var$SMALL_INT);
        for(let i = 0; i < $eb9554ea197019e4$var$PARTS; i++)// Highest bits to lowest bits.
        parts[$eb9554ea197019e4$var$PARTS - 1 - i] = i === offset ? 1 << index - offset * $eb9554ea197019e4$var$SMALL_INT : 0;
        return new $eb9554ea197019e4$var$HighLow(parts);
    }
    constructor(parts, str){
        this.parts = parts;
        this.str = str;
    }
    and({ parts: parts }) {
        return new $eb9554ea197019e4$var$HighLow(this.parts.map((v, i)=>v & parts[i]));
    }
    or({ parts: parts }) {
        return new $eb9554ea197019e4$var$HighLow(this.parts.map((v, i)=>v | parts[i]));
    }
    xor({ parts: parts }) {
        return new $eb9554ea197019e4$var$HighLow(this.parts.map((v, i)=>v ^ parts[i]));
    }
    not() {
        return new $eb9554ea197019e4$var$HighLow(this.parts.map((v)=>~v));
    }
    equals({ parts: parts }) {
        return this.parts.every((v, i)=>v === parts[i]);
    }
    /**
     * For the average case the string representation is provided, but
     * when we need to convert high and low to string we just let the
     * slower big-integer library do it.
     */ toString() {
        if (this.str != null) return this.str;
        const array = new Array($eb9554ea197019e4$var$MAX_BIG_INT / 4);
        this.parts.forEach((value, offset)=>{
            const hex = $eb9554ea197019e4$var$toHexReverseArray(value.toString());
            for(let i = 0; i < 4; i++)array[i + offset * 4] = hex[3 - i] || 0;
        });
        return this.str = (0, $37ac08ad601c671a$export$2e2bcd8739ae039).fromArray(array, 16).toString();
    }
    toJSON() {
        return this.toString();
    }
}
const $eb9554ea197019e4$var$SUPPORTS_BIGINT = $eb9554ea197019e4$var$checkBrowserSupportsBigInt();
// Polyfill toJSON on BigInt if necessary.
if ($eb9554ea197019e4$var$SUPPORTS_BIGINT && BigInt.prototype.toJSON == null) BigInt.prototype.toJSON = function() {
    return this.toString();
};
const $eb9554ea197019e4$var$HIGH_LOW_CACHE = {};
const $eb9554ea197019e4$var$convertToBigFlag = $eb9554ea197019e4$var$SUPPORTS_BIGINT ? function convertToBigFlagBigInt(value) {
    return BigInt(value);
} : function convertToBigFlagHighLow(value) {
    if (value instanceof $eb9554ea197019e4$var$HighLow) return value;
    if (typeof value === "number") value = value.toString();
    // These type assertions are ugly, but there doesn't seem to be a
    // runtime costless way to do a type assertion above.
    if ($eb9554ea197019e4$var$HIGH_LOW_CACHE[value] != null) return $eb9554ea197019e4$var$HIGH_LOW_CACHE[value];
    $eb9554ea197019e4$var$HIGH_LOW_CACHE[value] = $eb9554ea197019e4$var$HighLow.fromString(value);
    return $eb9554ea197019e4$var$HIGH_LOW_CACHE[value];
};
const $eb9554ea197019e4$var$EMPTY_FLAG = $eb9554ea197019e4$var$convertToBigFlag(0);
const $eb9554ea197019e4$var$flagAnd = $eb9554ea197019e4$var$SUPPORTS_BIGINT ? function flagAndBigInt(first = $eb9554ea197019e4$var$EMPTY_FLAG, second = $eb9554ea197019e4$var$EMPTY_FLAG) {
    return first & second;
} : function flagAndHighLow(first = $eb9554ea197019e4$var$EMPTY_FLAG, second = $eb9554ea197019e4$var$EMPTY_FLAG) {
    return first.and(second);
};
const $eb9554ea197019e4$var$flagOr = $eb9554ea197019e4$var$SUPPORTS_BIGINT ? function flagOrBigInt(first = $eb9554ea197019e4$var$EMPTY_FLAG, second = $eb9554ea197019e4$var$EMPTY_FLAG) {
    return first | second;
} : function flagOrHighLow(first = $eb9554ea197019e4$var$EMPTY_FLAG, second = $eb9554ea197019e4$var$EMPTY_FLAG) {
    return first.or(second);
};
const $eb9554ea197019e4$var$flagXor = $eb9554ea197019e4$var$SUPPORTS_BIGINT ? function flagXorBigInt(first = $eb9554ea197019e4$var$EMPTY_FLAG, second = $eb9554ea197019e4$var$EMPTY_FLAG) {
    return first ^ second;
} : function flagXorHighLow(first = $eb9554ea197019e4$var$EMPTY_FLAG, second = $eb9554ea197019e4$var$EMPTY_FLAG) {
    return first.xor(second);
};
const $eb9554ea197019e4$var$flagNot = $eb9554ea197019e4$var$SUPPORTS_BIGINT ? function flagNotBigInt(first = $eb9554ea197019e4$var$EMPTY_FLAG) {
    return ~first;
} : function flagNotHighLow(first = $eb9554ea197019e4$var$EMPTY_FLAG) {
    return first.not();
};
const $eb9554ea197019e4$var$flagEquals = $eb9554ea197019e4$var$SUPPORTS_BIGINT ? function flagEqualsBigInt(first, second) {
    return first === second;
} : function flagEqualsHighLow(first, second) {
    if (first == null || second == null) // eslint-disable-next-line eqeqeq
    return first == second;
    return first.equals(second);
};
function $eb9554ea197019e4$var$flagOrMultiple(...flags) {
    let result = flags[0];
    for(let i = 1; i < flags.length; i++)result = $eb9554ea197019e4$var$flagOr(result, flags[i]);
    return result;
}
function $eb9554ea197019e4$var$flagHas(base, flag) {
    return $eb9554ea197019e4$var$flagEquals($eb9554ea197019e4$var$flagAnd(base, flag), flag);
}
function $eb9554ea197019e4$var$flagHasAny(base, flag) {
    return !$eb9554ea197019e4$var$flagEquals($eb9554ea197019e4$var$flagAnd(base, flag), $eb9554ea197019e4$var$EMPTY_FLAG);
}
function $eb9554ea197019e4$var$flagAdd(base, flag) {
    return flag === $eb9554ea197019e4$var$EMPTY_FLAG ? base : $eb9554ea197019e4$var$flagOr(base, flag);
}
function $eb9554ea197019e4$var$flagRemove(base, flag) {
    return flag === $eb9554ea197019e4$var$EMPTY_FLAG ? base : $eb9554ea197019e4$var$flagXor(base, $eb9554ea197019e4$var$flagAnd(base, flag));
}
const $eb9554ea197019e4$var$getFlag = $eb9554ea197019e4$var$SUPPORTS_BIGINT ? function getFlagBigInt(index) {
    return BigInt(1) << BigInt(index);
} : function getFlagHighLow(index) {
    return $eb9554ea197019e4$var$HighLow.fromBit(index);
};
var $eb9554ea197019e4$export$2e2bcd8739ae039 = {
    combine: $eb9554ea197019e4$var$flagOrMultiple,
    add: $eb9554ea197019e4$var$flagAdd,
    remove: $eb9554ea197019e4$var$flagRemove,
    filter: $eb9554ea197019e4$var$flagAnd,
    invert: $eb9554ea197019e4$var$flagNot,
    has: $eb9554ea197019e4$var$flagHas,
    hasAny: $eb9554ea197019e4$var$flagHasAny,
    equals: $eb9554ea197019e4$var$flagEquals,
    deserialize: $eb9554ea197019e4$var$convertToBigFlag,
    getFlag: $eb9554ea197019e4$var$getFlag
};


var $a1ac51d0d1873cf0$export$b87f1ea3076d6f58;
(function(RPCCloseCodes) {
    RPCCloseCodes[RPCCloseCodes["CLOSE_NORMAL"] = 1000] = "CLOSE_NORMAL";
    RPCCloseCodes[RPCCloseCodes["CLOSE_UNSUPPORTED"] = 1003] = "CLOSE_UNSUPPORTED";
    RPCCloseCodes[RPCCloseCodes["CLOSE_ABNORMAL"] = 1006] = "CLOSE_ABNORMAL";
    RPCCloseCodes[RPCCloseCodes["INVALID_CLIENTID"] = 4000] = "INVALID_CLIENTID";
    RPCCloseCodes[RPCCloseCodes["INVALID_ORIGIN"] = 4001] = "INVALID_ORIGIN";
    RPCCloseCodes[RPCCloseCodes["RATELIMITED"] = 4002] = "RATELIMITED";
    RPCCloseCodes[RPCCloseCodes["TOKEN_REVOKED"] = 4003] = "TOKEN_REVOKED";
    RPCCloseCodes[RPCCloseCodes["INVALID_VERSION"] = 4004] = "INVALID_VERSION";
    RPCCloseCodes[RPCCloseCodes["INVALID_ENCODING"] = 4005] = "INVALID_ENCODING";
})($a1ac51d0d1873cf0$export$b87f1ea3076d6f58 || ($a1ac51d0d1873cf0$export$b87f1ea3076d6f58 = {}));
var $a1ac51d0d1873cf0$export$9ebb08d40ecbafd9;
(function(RPCErrorCodes) {
    RPCErrorCodes[RPCErrorCodes["INVALID_PAYLOAD"] = 4000] = "INVALID_PAYLOAD";
    RPCErrorCodes[RPCErrorCodes["INVALID_COMMAND"] = 4002] = "INVALID_COMMAND";
    RPCErrorCodes[RPCErrorCodes["INVALID_EVENT"] = 4004] = "INVALID_EVENT";
    RPCErrorCodes[RPCErrorCodes["INVALID_PERMISSIONS"] = 4006] = "INVALID_PERMISSIONS";
})($a1ac51d0d1873cf0$export$9ebb08d40ecbafd9 || ($a1ac51d0d1873cf0$export$9ebb08d40ecbafd9 = {}));
/**
 * @deprecated use OrientationTypeObject instead
 */ var $a1ac51d0d1873cf0$export$df54d73aa0ec5e82;
(function(Orientation) {
    Orientation["LANDSCAPE"] = "landscape";
    Orientation["PORTRAIT"] = "portrait";
})($a1ac51d0d1873cf0$export$df54d73aa0ec5e82 || ($a1ac51d0d1873cf0$export$df54d73aa0ec5e82 = {}));
var $a1ac51d0d1873cf0$export$2dffd0b5373a4389;
(function(Platform) {
    Platform["MOBILE"] = "mobile";
    Platform["DESKTOP"] = "desktop";
})($a1ac51d0d1873cf0$export$2dffd0b5373a4389 || ($a1ac51d0d1873cf0$export$2dffd0b5373a4389 = {}));
const $a1ac51d0d1873cf0$export$2d41982586bbb6be = Object.freeze({
    CREATE_INSTANT_INVITE: (0, $eb9554ea197019e4$export$2e2bcd8739ae039).getFlag(0),
    ADMINISTRATOR: (0, $eb9554ea197019e4$export$2e2bcd8739ae039).getFlag(3)
});




/**
 * This is a helper function which coerces an unsupported arg value to the key/value UNHANDLED: -1
 * This is necessary to handle a scenario where a new enum value is added in the Discord Client,
 * so that the sdk will not throw an error when given a (newly) valid enum value.
 *
 * To remove the requirement for consumers of this sdk to import an enum when parsing data,
 * we instead use an object cast as const (readonly). This maintains parity with the previous
 * schema (which used zod.enum), and behaves more like a union type, i.e. 'foo' | 'bar' | -1
 *
 * @param inputObject This object must include the key/value pair UNHANDLED = -1
 */ function $349b88e1f39306ed$export$5989705faed03747(inputObject) {
    return (0, $508449958c1d885a$export$fc37fe19dfda43ee)((arg)=>{
        var _a;
        const [objectKey] = (_a = Object.entries(inputObject).find(([, value])=>value === arg)) !== null && _a !== void 0 ? _a : [];
        if (arg != null && objectKey === undefined) return inputObject.UNHANDLED;
        return arg;
    }, (0, $508449958c1d885a$export$22b082955e083ec3)().or((0, $508449958c1d885a$export$98e628dec113755e)()));
}
/**
 * Fallback to the default zod value if parsing fails.
 */ function $349b88e1f39306ed$export$b70693e61e1d03ea(schema) {
    const transform = (0, $508449958c1d885a$export$4c00f665f0d4b443)().transform((data)=>{
        const res = schema.safeParse(data);
        if (res.success) return res.data;
        return schema._def.defaultValue();
    });
    // Must set this inner schema so inspection works correctly
    transform.overlayType = schema;
    // transform._def.schema = schema;
    return transform;
}




/**
 * This file is generated.
 * Run "pnpm sync" to regenerate file.
 * @generated
 */ // INITIATE_IMAGE_UPLOAD
const $d41e74f629425b9d$export$599108c66632c238 = (0, $508449958c1d885a$export$2e2bcd8739ae039).object({
    image_url: (0, $508449958c1d885a$export$2e2bcd8739ae039).string()
});
// OPEN_SHARE_MOMENT_DIALOG
const $d41e74f629425b9d$export$b7048850f4d41d23 = (0, $508449958c1d885a$export$2e2bcd8739ae039).object({
    mediaUrl: (0, $508449958c1d885a$export$2e2bcd8739ae039).string().max(1024)
});
// AUTHENTICATE
const $d41e74f629425b9d$export$21449d5881a7a118 = (0, $508449958c1d885a$export$2e2bcd8739ae039).object({
    access_token: (0, $508449958c1d885a$export$2e2bcd8739ae039).union([
        (0, $508449958c1d885a$export$2e2bcd8739ae039).string(),
        (0, $508449958c1d885a$export$2e2bcd8739ae039).null()
    ]).optional()
});
const $d41e74f629425b9d$export$abba1635e36ab43f = (0, $508449958c1d885a$export$2e2bcd8739ae039).object({
    access_token: (0, $508449958c1d885a$export$2e2bcd8739ae039).string(),
    user: (0, $508449958c1d885a$export$2e2bcd8739ae039).object({
        username: (0, $508449958c1d885a$export$2e2bcd8739ae039).string(),
        discriminator: (0, $508449958c1d885a$export$2e2bcd8739ae039).string(),
        id: (0, $508449958c1d885a$export$2e2bcd8739ae039).string(),
        avatar: (0, $508449958c1d885a$export$2e2bcd8739ae039).union([
            (0, $508449958c1d885a$export$2e2bcd8739ae039).string(),
            (0, $508449958c1d885a$export$2e2bcd8739ae039).null()
        ]).optional(),
        public_flags: (0, $508449958c1d885a$export$2e2bcd8739ae039).number(),
        global_name: (0, $508449958c1d885a$export$2e2bcd8739ae039).union([
            (0, $508449958c1d885a$export$2e2bcd8739ae039).string(),
            (0, $508449958c1d885a$export$2e2bcd8739ae039).null()
        ]).optional()
    }),
    scopes: (0, $508449958c1d885a$export$2e2bcd8739ae039).array((0, $349b88e1f39306ed$export$b70693e61e1d03ea)((0, $508449958c1d885a$export$2e2bcd8739ae039).enum([
        "identify",
        "email",
        "connections",
        "guilds",
        "guilds.join",
        "guilds.members.read",
        "gdm.join",
        "bot",
        "rpc",
        "rpc.notifications.read",
        "rpc.voice.read",
        "rpc.voice.write",
        "rpc.video.read",
        "rpc.video.write",
        "rpc.screenshare.read",
        "rpc.screenshare.write",
        "rpc.activities.write",
        "webhook.incoming",
        "messages.read",
        "applications.builds.upload",
        "applications.builds.read",
        "applications.commands",
        "applications.commands.permissions.update",
        "applications.commands.update",
        "applications.store.update",
        "applications.entitlements",
        "activities.read",
        "activities.write",
        "relationships.read",
        "relationships.write",
        "voice",
        "dm_channels.read",
        "role_connections.write",
        "presences.read",
        "presences.write",
        "openid",
        "dm_channels.messages.read",
        "dm_channels.messages.write",
        "gateway.connect",
        "account.global_name.update",
        "payment_sources.country_code"
    ]).or((0, $508449958c1d885a$export$2e2bcd8739ae039).literal(-1)).default(-1))),
    expires: (0, $508449958c1d885a$export$2e2bcd8739ae039).string(),
    application: (0, $508449958c1d885a$export$2e2bcd8739ae039).object({
        description: (0, $508449958c1d885a$export$2e2bcd8739ae039).string(),
        icon: (0, $508449958c1d885a$export$2e2bcd8739ae039).union([
            (0, $508449958c1d885a$export$2e2bcd8739ae039).string(),
            (0, $508449958c1d885a$export$2e2bcd8739ae039).null()
        ]).optional(),
        id: (0, $508449958c1d885a$export$2e2bcd8739ae039).string(),
        rpc_origins: (0, $508449958c1d885a$export$2e2bcd8739ae039).array((0, $508449958c1d885a$export$2e2bcd8739ae039).string()).optional(),
        name: (0, $508449958c1d885a$export$2e2bcd8739ae039).string()
    })
});
// GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS
const $d41e74f629425b9d$export$55c4c3c25fd5c28e = (0, $508449958c1d885a$export$2e2bcd8739ae039).object({
    participants: (0, $508449958c1d885a$export$2e2bcd8739ae039).array((0, $508449958c1d885a$export$2e2bcd8739ae039).object({
        id: (0, $508449958c1d885a$export$2e2bcd8739ae039).string(),
        username: (0, $508449958c1d885a$export$2e2bcd8739ae039).string(),
        global_name: (0, $508449958c1d885a$export$2e2bcd8739ae039).union([
            (0, $508449958c1d885a$export$2e2bcd8739ae039).string(),
            (0, $508449958c1d885a$export$2e2bcd8739ae039).null()
        ]).optional(),
        discriminator: (0, $508449958c1d885a$export$2e2bcd8739ae039).string(),
        avatar: (0, $508449958c1d885a$export$2e2bcd8739ae039).union([
            (0, $508449958c1d885a$export$2e2bcd8739ae039).string(),
            (0, $508449958c1d885a$export$2e2bcd8739ae039).null()
        ]).optional(),
        flags: (0, $508449958c1d885a$export$2e2bcd8739ae039).number(),
        bot: (0, $508449958c1d885a$export$2e2bcd8739ae039).boolean(),
        avatar_decoration_data: (0, $508449958c1d885a$export$2e2bcd8739ae039).union([
            (0, $508449958c1d885a$export$2e2bcd8739ae039).object({
                asset: (0, $508449958c1d885a$export$2e2bcd8739ae039).string(),
                skuId: (0, $508449958c1d885a$export$2e2bcd8739ae039).string().optional()
            }),
            (0, $508449958c1d885a$export$2e2bcd8739ae039).null()
        ]).optional(),
        premium_type: (0, $508449958c1d885a$export$2e2bcd8739ae039).union([
            (0, $508449958c1d885a$export$2e2bcd8739ae039).number(),
            (0, $508449958c1d885a$export$2e2bcd8739ae039).null()
        ]).optional(),
        nickname: (0, $508449958c1d885a$export$2e2bcd8739ae039).string().optional()
    }))
});
/**
 * RPC Commands which support schemas.
 */ var $d41e74f629425b9d$export$cc7e12c76513e857;
(function(Command) {
    Command["INITIATE_IMAGE_UPLOAD"] = "INITIATE_IMAGE_UPLOAD";
    Command["OPEN_SHARE_MOMENT_DIALOG"] = "OPEN_SHARE_MOMENT_DIALOG";
    Command["AUTHENTICATE"] = "AUTHENTICATE";
    Command["GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS"] = "GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS";
})($d41e74f629425b9d$export$cc7e12c76513e857 || ($d41e74f629425b9d$export$cc7e12c76513e857 = {}));
const $d41e74f629425b9d$var$emptyResponseSchema = (0, $508449958c1d885a$export$2e2bcd8739ae039).object({}).optional().nullable();
const $d41e74f629425b9d$var$emptyRequestSchema = (0, $508449958c1d885a$export$2e2bcd8739ae039).void();
/**
 * Request & Response schemas for each supported RPC Command.
 */ const $d41e74f629425b9d$export$e49b768f28ad1b60 = {
    [$d41e74f629425b9d$export$cc7e12c76513e857.INITIATE_IMAGE_UPLOAD]: {
        request: $d41e74f629425b9d$var$emptyRequestSchema,
        response: $d41e74f629425b9d$export$599108c66632c238
    },
    [$d41e74f629425b9d$export$cc7e12c76513e857.OPEN_SHARE_MOMENT_DIALOG]: {
        request: $d41e74f629425b9d$export$b7048850f4d41d23,
        response: $d41e74f629425b9d$var$emptyResponseSchema
    },
    [$d41e74f629425b9d$export$cc7e12c76513e857.AUTHENTICATE]: {
        request: $d41e74f629425b9d$export$21449d5881a7a118,
        response: $d41e74f629425b9d$export$abba1635e36ab43f
    },
    [$d41e74f629425b9d$export$cc7e12c76513e857.GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS]: {
        request: $d41e74f629425b9d$var$emptyRequestSchema,
        response: $d41e74f629425b9d$export$55c4c3c25fd5c28e
    }
};


// DISPATCH is sent as cmd but is a special case, so is excluded from Commands enum
const $e15d24d280bad751$export$efd7770b5da84f9e = "DISPATCH";
var $e15d24d280bad751$export$ba30f7724cb0e54e;
(function(Commands) {
    Commands["AUTHORIZE"] = "AUTHORIZE";
    Commands["AUTHENTICATE"] = "AUTHENTICATE";
    Commands["GET_GUILDS"] = "GET_GUILDS";
    Commands["GET_GUILD"] = "GET_GUILD";
    Commands["GET_CHANNEL"] = "GET_CHANNEL";
    Commands["GET_CHANNELS"] = "GET_CHANNELS";
    Commands["SELECT_VOICE_CHANNEL"] = "SELECT_VOICE_CHANNEL";
    Commands["SELECT_TEXT_CHANNEL"] = "SELECT_TEXT_CHANNEL";
    Commands["SUBSCRIBE"] = "SUBSCRIBE";
    Commands["UNSUBSCRIBE"] = "UNSUBSCRIBE";
    Commands["CAPTURE_SHORTCUT"] = "CAPTURE_SHORTCUT";
    Commands["SET_CERTIFIED_DEVICES"] = "SET_CERTIFIED_DEVICES";
    Commands["SET_ACTIVITY"] = "SET_ACTIVITY";
    Commands["GET_SKUS"] = "GET_SKUS";
    Commands["GET_ENTITLEMENTS"] = "GET_ENTITLEMENTS";
    Commands["GET_SKUS_EMBEDDED"] = "GET_SKUS_EMBEDDED";
    Commands["GET_ENTITLEMENTS_EMBEDDED"] = "GET_ENTITLEMENTS_EMBEDDED";
    Commands["START_PURCHASE"] = "START_PURCHASE";
    Commands["SET_CONFIG"] = "SET_CONFIG";
    Commands["SEND_ANALYTICS_EVENT"] = "SEND_ANALYTICS_EVENT";
    Commands["USER_SETTINGS_GET_LOCALE"] = "USER_SETTINGS_GET_LOCALE";
    Commands["OPEN_EXTERNAL_LINK"] = "OPEN_EXTERNAL_LINK";
    Commands["ENCOURAGE_HW_ACCELERATION"] = "ENCOURAGE_HW_ACCELERATION";
    Commands["CAPTURE_LOG"] = "CAPTURE_LOG";
    Commands["SET_ORIENTATION_LOCK_STATE"] = "SET_ORIENTATION_LOCK_STATE";
    Commands["OPEN_INVITE_DIALOG"] = "OPEN_INVITE_DIALOG";
    Commands["GET_PLATFORM_BEHAVIORS"] = "GET_PLATFORM_BEHAVIORS";
    Commands["GET_CHANNEL_PERMISSIONS"] = "GET_CHANNEL_PERMISSIONS";
    Commands["OPEN_SHARE_MOMENT_DIALOG"] = "OPEN_SHARE_MOMENT_DIALOG";
    Commands["INITIATE_IMAGE_UPLOAD"] = "INITIATE_IMAGE_UPLOAD";
    Commands["GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS"] = "GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS";
})($e15d24d280bad751$export$ba30f7724cb0e54e || ($e15d24d280bad751$export$ba30f7724cb0e54e = {}));
const $e15d24d280bad751$export$7a3470becaa040fa = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    cmd: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    data: (0, $508449958c1d885a$export$19282c40b967aec6)(),
    evt: (0, $508449958c1d885a$export$7b1b591b262c240)(),
    nonce: (0, $508449958c1d885a$export$22b082955e083ec3)()
}).passthrough();
// TODO afgiel -- next breaking change release
// remove Scopes and ScopesObject in favor of Types.OAuthScopes
const $e15d24d280bad751$export$75435f4e5bc6ddd7 = Object.assign(Object.assign({}, (0, $d41e74f629425b9d$export$abba1635e36ab43f).shape.scopes.element.overlayType._def.innerType.options[0].Values), {
    UNHANDLED: -1
});
const $e15d24d280bad751$export$8546186883d6ff3e = (0, $349b88e1f39306ed$export$5989705faed03747)($e15d24d280bad751$export$75435f4e5bc6ddd7);
const $e15d24d280bad751$export$1f44aaf2ec115b54 = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    id: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    username: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    discriminator: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    global_name: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    avatar: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    avatar_decoration_data: (0, $508449958c1d885a$export$be5493f9613cbbe)({
        asset: (0, $508449958c1d885a$export$22b082955e083ec3)(),
        sku_id: (0, $508449958c1d885a$export$22b082955e083ec3)().optional()
    }).nullable(),
    bot: (0, $508449958c1d885a$export$4a21f16c33752377)(),
    flags: (0, $508449958c1d885a$export$98e628dec113755e)().optional().nullable(),
    premium_type: (0, $508449958c1d885a$export$98e628dec113755e)().optional().nullable()
});
const $e15d24d280bad751$export$6ba76af5c834ff81 = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    user: $e15d24d280bad751$export$1f44aaf2ec115b54,
    nick: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    roles: (0, $508449958c1d885a$export$2f23118c22fb2630)((0, $508449958c1d885a$export$22b082955e083ec3)()),
    joined_at: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    deaf: (0, $508449958c1d885a$export$4a21f16c33752377)(),
    mute: (0, $508449958c1d885a$export$4a21f16c33752377)()
});
const $e15d24d280bad751$export$8fbf13c8b5cc978c = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    user_id: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    nick: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    guild_id: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    avatar: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    avatar_decoration_data: (0, $508449958c1d885a$export$be5493f9613cbbe)({
        asset: (0, $508449958c1d885a$export$22b082955e083ec3)(),
        sku_id: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable()
    }).optional().nullable(),
    color_string: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable()
});
const $e15d24d280bad751$export$56cc48506ff790a = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    id: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    name: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    roles: (0, $508449958c1d885a$export$2f23118c22fb2630)((0, $508449958c1d885a$export$22b082955e083ec3)()).optional().nullable(),
    user: $e15d24d280bad751$export$1f44aaf2ec115b54.optional().nullable(),
    require_colons: (0, $508449958c1d885a$export$4a21f16c33752377)().optional().nullable(),
    managed: (0, $508449958c1d885a$export$4a21f16c33752377)().optional().nullable(),
    animated: (0, $508449958c1d885a$export$4a21f16c33752377)().optional().nullable(),
    available: (0, $508449958c1d885a$export$4a21f16c33752377)().optional().nullable()
});
const $e15d24d280bad751$export$e40a3aa7b507330e = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    mute: (0, $508449958c1d885a$export$4a21f16c33752377)(),
    deaf: (0, $508449958c1d885a$export$4a21f16c33752377)(),
    self_mute: (0, $508449958c1d885a$export$4a21f16c33752377)(),
    self_deaf: (0, $508449958c1d885a$export$4a21f16c33752377)(),
    suppress: (0, $508449958c1d885a$export$4a21f16c33752377)()
});
const $e15d24d280bad751$export$4b86a4e430ccb511 = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    mute: (0, $508449958c1d885a$export$4a21f16c33752377)(),
    nick: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    user: $e15d24d280bad751$export$1f44aaf2ec115b54,
    voice_state: $e15d24d280bad751$export$e40a3aa7b507330e,
    volume: (0, $508449958c1d885a$export$98e628dec113755e)()
});
const $e15d24d280bad751$export$39054e8696850518 = {
    UNHANDLED: -1,
    IDLE: "idle",
    DND: "dnd",
    ONLINE: "online",
    OFFLINE: "offline"
};
const $e15d24d280bad751$export$96e9906d6d93a972 = (0, $349b88e1f39306ed$export$5989705faed03747)($e15d24d280bad751$export$39054e8696850518);
const $e15d24d280bad751$export$9c16c1426311996d = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    name: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    type: (0, $508449958c1d885a$export$98e628dec113755e)(),
    url: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    created_at: (0, $508449958c1d885a$export$98e628dec113755e)().optional().nullable(),
    timestamps: (0, $508449958c1d885a$export$be5493f9613cbbe)({
        start: (0, $508449958c1d885a$export$98e628dec113755e)(),
        end: (0, $508449958c1d885a$export$98e628dec113755e)()
    }).partial().optional().nullable(),
    application_id: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    details: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    state: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    emoji: $e15d24d280bad751$export$56cc48506ff790a.optional().nullable(),
    party: (0, $508449958c1d885a$export$be5493f9613cbbe)({
        id: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
        size: (0, $508449958c1d885a$export$2f23118c22fb2630)((0, $508449958c1d885a$export$98e628dec113755e)()).optional().nullable()
    }).optional().nullable(),
    assets: (0, $508449958c1d885a$export$be5493f9613cbbe)({
        large_image: (0, $508449958c1d885a$export$22b082955e083ec3)().nullable(),
        large_text: (0, $508449958c1d885a$export$22b082955e083ec3)().nullable(),
        small_image: (0, $508449958c1d885a$export$22b082955e083ec3)().nullable(),
        small_text: (0, $508449958c1d885a$export$22b082955e083ec3)().nullable()
    }).partial().optional().nullable(),
    secrets: (0, $508449958c1d885a$export$be5493f9613cbbe)({
        join: (0, $508449958c1d885a$export$22b082955e083ec3)(),
        match: (0, $508449958c1d885a$export$22b082955e083ec3)()
    }).partial().optional().nullable(),
    instance: (0, $508449958c1d885a$export$4a21f16c33752377)().optional().nullable(),
    flags: (0, $508449958c1d885a$export$98e628dec113755e)().optional().nullable()
});
const $e15d24d280bad751$export$fab33d7660c6e6d6 = {
    UNHANDLED: -1,
    ROLE: 0,
    MEMBER: 1
};
const $e15d24d280bad751$export$3700bd144328e1a6 = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    id: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    type: (0, $349b88e1f39306ed$export$5989705faed03747)($e15d24d280bad751$export$fab33d7660c6e6d6),
    allow: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    deny: (0, $508449958c1d885a$export$22b082955e083ec3)()
});
const $e15d24d280bad751$export$2f4cb441f3eded01 = {
    UNHANDLED: -1,
    DM: 1,
    GROUP_DM: 3,
    GUILD_TEXT: 0,
    GUILD_VOICE: 2,
    GUILD_CATEGORY: 4,
    GUILD_ANNOUNCEMENT: 5,
    GUILD_STORE: 6,
    ANNOUNCEMENT_THREAD: 10,
    PUBLIC_THREAD: 11,
    PRIVATE_THREAD: 12,
    GUILD_STAGE_VOICE: 13,
    GUILD_DIRECTORY: 14,
    GUILD_FORUM: 15
};
const $e15d24d280bad751$export$cfdacaa37f9b4dd7 = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    id: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    type: (0, $349b88e1f39306ed$export$5989705faed03747)($e15d24d280bad751$export$2f4cb441f3eded01),
    guild_id: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    position: (0, $508449958c1d885a$export$98e628dec113755e)().optional().nullable(),
    permission_overwrites: (0, $508449958c1d885a$export$2f23118c22fb2630)($e15d24d280bad751$export$3700bd144328e1a6).optional().nullable(),
    name: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    topic: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    nsfw: (0, $508449958c1d885a$export$4a21f16c33752377)().optional().nullable(),
    last_message_id: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    bitrate: (0, $508449958c1d885a$export$98e628dec113755e)().optional().nullable(),
    user_limit: (0, $508449958c1d885a$export$98e628dec113755e)().optional().nullable(),
    rate_limit_per_user: (0, $508449958c1d885a$export$98e628dec113755e)().optional().nullable(),
    recipients: (0, $508449958c1d885a$export$2f23118c22fb2630)($e15d24d280bad751$export$1f44aaf2ec115b54).optional().nullable(),
    icon: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    owner_id: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    application_id: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    parent_id: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    last_pin_timestamp: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable()
});
const $e15d24d280bad751$export$24da275c271e8208 = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    user: $e15d24d280bad751$export$1f44aaf2ec115b54,
    guild_id: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    status: $e15d24d280bad751$export$96e9906d6d93a972,
    activities: (0, $508449958c1d885a$export$2f23118c22fb2630)($e15d24d280bad751$export$9c16c1426311996d),
    client_status: (0, $508449958c1d885a$export$be5493f9613cbbe)({
        desktop: $e15d24d280bad751$export$96e9906d6d93a972,
        mobile: $e15d24d280bad751$export$96e9906d6d93a972,
        web: $e15d24d280bad751$export$96e9906d6d93a972
    }).partial()
});
const $e15d24d280bad751$export$46919bad18fb2f76 = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    id: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    name: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    color: (0, $508449958c1d885a$export$98e628dec113755e)(),
    hoist: (0, $508449958c1d885a$export$4a21f16c33752377)(),
    position: (0, $508449958c1d885a$export$98e628dec113755e)(),
    permissions: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    managed: (0, $508449958c1d885a$export$4a21f16c33752377)(),
    mentionable: (0, $508449958c1d885a$export$4a21f16c33752377)()
});
const $e15d24d280bad751$export$85e439e10eca0e6b = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    id: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    name: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    owner_id: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    icon: (0, $508449958c1d885a$export$22b082955e083ec3)().nullable(),
    icon_hash: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    splash: (0, $508449958c1d885a$export$22b082955e083ec3)().nullable(),
    discovery_splash: (0, $508449958c1d885a$export$22b082955e083ec3)().nullable(),
    owner: (0, $508449958c1d885a$export$4a21f16c33752377)().optional().nullable(),
    permissions: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    region: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    afk_channel_id: (0, $508449958c1d885a$export$22b082955e083ec3)().nullable(),
    afk_timeout: (0, $508449958c1d885a$export$98e628dec113755e)(),
    widget_enabled: (0, $508449958c1d885a$export$4a21f16c33752377)().optional().nullable(),
    widget_channel_id: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    verification_level: (0, $508449958c1d885a$export$98e628dec113755e)(),
    default_message_notifications: (0, $508449958c1d885a$export$98e628dec113755e)(),
    explicit_content_filter: (0, $508449958c1d885a$export$98e628dec113755e)(),
    roles: (0, $508449958c1d885a$export$2f23118c22fb2630)($e15d24d280bad751$export$46919bad18fb2f76),
    emojis: (0, $508449958c1d885a$export$2f23118c22fb2630)($e15d24d280bad751$export$56cc48506ff790a),
    features: (0, $508449958c1d885a$export$2f23118c22fb2630)((0, $508449958c1d885a$export$22b082955e083ec3)()),
    mfa_level: (0, $508449958c1d885a$export$98e628dec113755e)(),
    application_id: (0, $508449958c1d885a$export$22b082955e083ec3)().nullable(),
    system_channel_id: (0, $508449958c1d885a$export$22b082955e083ec3)().nullable(),
    system_channel_flags: (0, $508449958c1d885a$export$98e628dec113755e)(),
    rules_channel_id: (0, $508449958c1d885a$export$22b082955e083ec3)().nullable(),
    joined_at: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    large: (0, $508449958c1d885a$export$4a21f16c33752377)().optional().nullable(),
    unavailable: (0, $508449958c1d885a$export$4a21f16c33752377)().optional().nullable(),
    member_count: (0, $508449958c1d885a$export$98e628dec113755e)().optional().nullable(),
    voice_states: (0, $508449958c1d885a$export$2f23118c22fb2630)($e15d24d280bad751$export$e40a3aa7b507330e).optional().nullable(),
    members: (0, $508449958c1d885a$export$2f23118c22fb2630)($e15d24d280bad751$export$6ba76af5c834ff81).optional().nullable(),
    channels: (0, $508449958c1d885a$export$2f23118c22fb2630)($e15d24d280bad751$export$cfdacaa37f9b4dd7).optional().nullable(),
    presences: (0, $508449958c1d885a$export$2f23118c22fb2630)($e15d24d280bad751$export$24da275c271e8208).optional().nullable(),
    max_presences: (0, $508449958c1d885a$export$98e628dec113755e)().optional().nullable(),
    max_members: (0, $508449958c1d885a$export$98e628dec113755e)().optional().nullable(),
    vanity_url_code: (0, $508449958c1d885a$export$22b082955e083ec3)().nullable(),
    description: (0, $508449958c1d885a$export$22b082955e083ec3)().nullable(),
    banner: (0, $508449958c1d885a$export$22b082955e083ec3)().nullable(),
    premium_tier: (0, $508449958c1d885a$export$98e628dec113755e)(),
    premium_subscription_count: (0, $508449958c1d885a$export$98e628dec113755e)().optional().nullable(),
    preferred_locale: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    public_updates_channel_id: (0, $508449958c1d885a$export$22b082955e083ec3)().nullable(),
    max_video_channel_users: (0, $508449958c1d885a$export$98e628dec113755e)().optional().nullable(),
    approximate_member_count: (0, $508449958c1d885a$export$98e628dec113755e)().optional().nullable(),
    approximate_presence_count: (0, $508449958c1d885a$export$98e628dec113755e)().optional().nullable()
});
const $e15d24d280bad751$export$8ce7ab97167fc310 = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    id: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    guild_id: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    type: (0, $508449958c1d885a$export$98e628dec113755e)(),
    name: (0, $508449958c1d885a$export$22b082955e083ec3)()
});
const $e15d24d280bad751$export$71e4db985cfcf9e3 = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    id: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    filename: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    size: (0, $508449958c1d885a$export$98e628dec113755e)(),
    url: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    proxy_url: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    height: (0, $508449958c1d885a$export$98e628dec113755e)().optional().nullable(),
    width: (0, $508449958c1d885a$export$98e628dec113755e)().optional().nullable()
});
const $e15d24d280bad751$export$8c9fffced316d89b = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    text: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    icon_url: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    proxy_icon_url: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable()
});
const $e15d24d280bad751$export$3e431a229df88919 = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    url: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    proxy_url: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    height: (0, $508449958c1d885a$export$98e628dec113755e)().optional().nullable(),
    width: (0, $508449958c1d885a$export$98e628dec113755e)().optional().nullable()
});
const $e15d24d280bad751$export$ae01dedf5c052bb = $e15d24d280bad751$export$3e431a229df88919.omit({
    proxy_url: true
});
const $e15d24d280bad751$export$e4790b418e6d5a4d = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    name: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    url: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable()
});
const $e15d24d280bad751$export$632a034bda2c67e4 = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    name: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    url: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    icon_url: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    proxy_icon_url: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable()
});
const $e15d24d280bad751$export$8f305b092204e542 = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    name: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    value: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    inline: (0, $508449958c1d885a$export$4a21f16c33752377)()
});
const $e15d24d280bad751$export$a84540bc8b694b2d = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    title: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    type: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    description: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    url: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    timestamp: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    color: (0, $508449958c1d885a$export$98e628dec113755e)().optional().nullable(),
    footer: $e15d24d280bad751$export$8c9fffced316d89b.optional().nullable(),
    image: $e15d24d280bad751$export$3e431a229df88919.optional().nullable(),
    thumbnail: $e15d24d280bad751$export$3e431a229df88919.optional().nullable(),
    video: $e15d24d280bad751$export$ae01dedf5c052bb.optional().nullable(),
    provider: $e15d24d280bad751$export$e4790b418e6d5a4d.optional().nullable(),
    author: $e15d24d280bad751$export$632a034bda2c67e4.optional().nullable(),
    fields: (0, $508449958c1d885a$export$2f23118c22fb2630)($e15d24d280bad751$export$8f305b092204e542).optional().nullable()
});
const $e15d24d280bad751$export$d2ae4167a30cf6bb = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    count: (0, $508449958c1d885a$export$98e628dec113755e)(),
    me: (0, $508449958c1d885a$export$4a21f16c33752377)(),
    emoji: $e15d24d280bad751$export$56cc48506ff790a
});
const $e15d24d280bad751$export$465ad97f4d04cf9a = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    type: (0, $508449958c1d885a$export$98e628dec113755e)(),
    party_id: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable()
});
const $e15d24d280bad751$export$56f5e744391a955c = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    id: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    cover_image: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    description: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    icon: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    name: (0, $508449958c1d885a$export$22b082955e083ec3)()
});
const $e15d24d280bad751$export$bcebdc029e694ee6 = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    message_id: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    channel_id: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    guild_id: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable()
});
const $e15d24d280bad751$export$f69c19e57285b83a = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    id: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    channel_id: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    guild_id: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    author: $e15d24d280bad751$export$1f44aaf2ec115b54.optional().nullable(),
    member: $e15d24d280bad751$export$6ba76af5c834ff81.optional().nullable(),
    content: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    timestamp: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    edited_timestamp: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    tts: (0, $508449958c1d885a$export$4a21f16c33752377)(),
    mention_everyone: (0, $508449958c1d885a$export$4a21f16c33752377)(),
    mentions: (0, $508449958c1d885a$export$2f23118c22fb2630)($e15d24d280bad751$export$1f44aaf2ec115b54),
    mention_roles: (0, $508449958c1d885a$export$2f23118c22fb2630)((0, $508449958c1d885a$export$22b082955e083ec3)()),
    mention_channels: (0, $508449958c1d885a$export$2f23118c22fb2630)($e15d24d280bad751$export$8ce7ab97167fc310),
    attachments: (0, $508449958c1d885a$export$2f23118c22fb2630)($e15d24d280bad751$export$71e4db985cfcf9e3),
    embeds: (0, $508449958c1d885a$export$2f23118c22fb2630)($e15d24d280bad751$export$a84540bc8b694b2d),
    reactions: (0, $508449958c1d885a$export$2f23118c22fb2630)($e15d24d280bad751$export$d2ae4167a30cf6bb).optional().nullable(),
    nonce: (0, $508449958c1d885a$export$971dd5b0dfd021b6)([
        (0, $508449958c1d885a$export$22b082955e083ec3)(),
        (0, $508449958c1d885a$export$98e628dec113755e)()
    ]).optional().nullable(),
    pinned: (0, $508449958c1d885a$export$4a21f16c33752377)(),
    webhook_id: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    type: (0, $508449958c1d885a$export$98e628dec113755e)(),
    activity: $e15d24d280bad751$export$465ad97f4d04cf9a.optional().nullable(),
    application: $e15d24d280bad751$export$56f5e744391a955c.optional().nullable(),
    message_reference: $e15d24d280bad751$export$bcebdc029e694ee6.optional().nullable(),
    flags: (0, $508449958c1d885a$export$98e628dec113755e)().optional().nullable(),
    stickers: (0, $508449958c1d885a$export$2f23118c22fb2630)((0, $508449958c1d885a$export$19282c40b967aec6)()).optional().nullable(),
    // Cannot self reference, but this is possibly a Message
    referenced_message: (0, $508449958c1d885a$export$19282c40b967aec6)().optional().nullable()
});
const $e15d24d280bad751$export$624aa0dd60bb35db = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    id: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    name: (0, $508449958c1d885a$export$22b082955e083ec3)()
});
const $e15d24d280bad751$export$2ede097136cc13e4 = {
    UNHANDLED: -1,
    KEYBOARD_KEY: 0,
    MOUSE_BUTTON: 1,
    KEYBOARD_MODIFIER_KEY: 2,
    GAMEPAD_BUTTON: 3
};
const $e15d24d280bad751$export$f20a7ed0751474c1 = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    type: (0, $349b88e1f39306ed$export$5989705faed03747)($e15d24d280bad751$export$2ede097136cc13e4),
    code: (0, $508449958c1d885a$export$98e628dec113755e)(),
    name: (0, $508449958c1d885a$export$22b082955e083ec3)()
});
const $e15d24d280bad751$export$9d6f8c8df913ee9d = {
    UNHANDLED: -1,
    PUSH_TO_TALK: "PUSH_TO_TALK",
    VOICE_ACTIVITY: "VOICE_ACTIVITY"
};
const $e15d24d280bad751$export$c99e7704e60373e9 = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    type: (0, $349b88e1f39306ed$export$5989705faed03747)($e15d24d280bad751$export$9d6f8c8df913ee9d),
    auto_threshold: (0, $508449958c1d885a$export$4a21f16c33752377)(),
    threshold: (0, $508449958c1d885a$export$98e628dec113755e)(),
    shortcut: (0, $508449958c1d885a$export$2f23118c22fb2630)($e15d24d280bad751$export$f20a7ed0751474c1),
    delay: (0, $508449958c1d885a$export$98e628dec113755e)()
});
const $e15d24d280bad751$export$cb1d6465ddfebcf0 = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    device_id: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    volume: (0, $508449958c1d885a$export$98e628dec113755e)(),
    available_devices: (0, $508449958c1d885a$export$2f23118c22fb2630)($e15d24d280bad751$export$624aa0dd60bb35db)
});
const $e15d24d280bad751$export$8320da8c452e87fc = {
    UNHANDLED: -1,
    AUDIO_INPUT: "AUDIO_INPUT",
    AUDIO_OUTPUT: "AUDIO_OUTPUT",
    VIDEO_INPUT: "VIDEO_INPUT"
};
const $e15d24d280bad751$export$4f2f4bd3c787de21 = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    type: (0, $349b88e1f39306ed$export$5989705faed03747)($e15d24d280bad751$export$8320da8c452e87fc),
    id: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    vendor: (0, $508449958c1d885a$export$be5493f9613cbbe)({
        name: (0, $508449958c1d885a$export$22b082955e083ec3)(),
        url: (0, $508449958c1d885a$export$22b082955e083ec3)()
    }),
    model: (0, $508449958c1d885a$export$be5493f9613cbbe)({
        name: (0, $508449958c1d885a$export$22b082955e083ec3)(),
        url: (0, $508449958c1d885a$export$22b082955e083ec3)()
    }),
    related: (0, $508449958c1d885a$export$2f23118c22fb2630)((0, $508449958c1d885a$export$22b082955e083ec3)()),
    echo_cancellation: (0, $508449958c1d885a$export$4a21f16c33752377)().optional().nullable(),
    noise_suppression: (0, $508449958c1d885a$export$4a21f16c33752377)().optional().nullable(),
    automatic_gain_control: (0, $508449958c1d885a$export$4a21f16c33752377)().optional().nullable(),
    hardware_mute: (0, $508449958c1d885a$export$4a21f16c33752377)().optional().nullable()
});
const $e15d24d280bad751$export$439ecd4335b15be4 = {
    UNHANDLED: -1,
    APPLICATION: 1,
    DLC: 2,
    CONSUMABLE: 3,
    BUNDLE: 4,
    SUBSCRIPTION: 5
};
const $e15d24d280bad751$export$ccf658062b0f9f7a = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    id: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    name: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    type: (0, $349b88e1f39306ed$export$5989705faed03747)($e15d24d280bad751$export$439ecd4335b15be4),
    price: (0, $508449958c1d885a$export$be5493f9613cbbe)({
        amount: (0, $508449958c1d885a$export$98e628dec113755e)(),
        currency: (0, $508449958c1d885a$export$22b082955e083ec3)()
    }),
    application_id: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    flags: (0, $508449958c1d885a$export$98e628dec113755e)(),
    release_date: (0, $508449958c1d885a$export$22b082955e083ec3)().nullable()
});
const $e15d24d280bad751$export$6259f37857107b12 = {
    UNHANDLED: -1,
    PURCHASE: 1,
    PREMIUM_SUBSCRIPTION: 2,
    DEVELOPER_GIFT: 3,
    TEST_MODE_PURCHASE: 4,
    FREE_PURCHASE: 5,
    USER_GIFT: 6,
    PREMIUM_PURCHASE: 7
};
const $e15d24d280bad751$export$7b20d168ba04011b = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    id: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    sku_id: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    application_id: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    user_id: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    gift_code_flags: (0, $508449958c1d885a$export$98e628dec113755e)(),
    type: (0, $349b88e1f39306ed$export$5989705faed03747)($e15d24d280bad751$export$6259f37857107b12),
    gifter_user_id: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    branches: (0, $508449958c1d885a$export$2f23118c22fb2630)((0, $508449958c1d885a$export$22b082955e083ec3)()).optional().nullable(),
    starts_at: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    ends_at: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    parent_id: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    consumed: (0, $508449958c1d885a$export$4a21f16c33752377)().optional().nullable(),
    deleted: (0, $508449958c1d885a$export$4a21f16c33752377)().optional().nullable(),
    gift_code_batch_id: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable()
});
const $e15d24d280bad751$export$7e8bb741497f2d3 = {
    UNHANDLED: -1,
    UNLOCKED: 1,
    PORTRAIT: 2,
    LANDSCAPE: 3
};
const $e15d24d280bad751$export$76765004a89b60c4 = (0, $349b88e1f39306ed$export$5989705faed03747)($e15d24d280bad751$export$7e8bb741497f2d3);
const $e15d24d280bad751$export$6b5ef5fbc271f145 = {
    UNHANDLED: -1,
    NOMINAL: 0,
    FAIR: 1,
    SERIOUS: 2,
    CRITICAL: 3
};
const $e15d24d280bad751$export$8065eea9d621a18 = (0, $349b88e1f39306ed$export$5989705faed03747)($e15d24d280bad751$export$6b5ef5fbc271f145);
const $e15d24d280bad751$export$6998f50a089a6f29 = {
    UNHANDLED: -1,
    PORTRAIT: 0,
    LANDSCAPE: 1
};
const $e15d24d280bad751$export$df54d73aa0ec5e82 = (0, $349b88e1f39306ed$export$5989705faed03747)($e15d24d280bad751$export$6998f50a089a6f29);
const $e15d24d280bad751$export$94c8fa8df0efcb28 = {
    UNHANDLED: -1,
    FOCUSED: 0,
    PIP: 1,
    GRID: 2
};
const $e15d24d280bad751$export$8f9fafd62f4ed4cc = (0, $349b88e1f39306ed$export$5989705faed03747)($e15d24d280bad751$export$94c8fa8df0efcb28);




// ERROR is sent as evt but is a special case, so is excluded from Events enum
const $2d2422041748fbeb$export$103bedf43ba882db = "ERROR";
var $2d2422041748fbeb$export$ada873a34909da65;
(function(Events) {
    Events["READY"] = "READY";
    Events["VOICE_STATE_UPDATE"] = "VOICE_STATE_UPDATE";
    Events["SPEAKING_START"] = "SPEAKING_START";
    Events["SPEAKING_STOP"] = "SPEAKING_STOP";
    Events["ACTIVITY_LAYOUT_MODE_UPDATE"] = "ACTIVITY_LAYOUT_MODE_UPDATE";
    Events["ORIENTATION_UPDATE"] = "ORIENTATION_UPDATE";
    Events["CURRENT_USER_UPDATE"] = "CURRENT_USER_UPDATE";
    Events["CURRENT_GUILD_MEMBER_UPDATE"] = "CURRENT_GUILD_MEMBER_UPDATE";
    Events["ENTITLEMENT_CREATE"] = "ENTITLEMENT_CREATE";
    Events["THERMAL_STATE_UPDATE"] = "THERMAL_STATE_UPDATE";
    Events["ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE"] = "ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE";
})($2d2422041748fbeb$export$ada873a34909da65 || ($2d2422041748fbeb$export$ada873a34909da65 = {}));
const $2d2422041748fbeb$export$326fa0fd43fb9e9c = (0, $e15d24d280bad751$export$7a3470becaa040fa).extend({
    evt: (0, $508449958c1d885a$export$6fe7eca19ebe5199)($2d2422041748fbeb$export$ada873a34909da65),
    nonce: (0, $508449958c1d885a$export$22b082955e083ec3)().nullable(),
    cmd: (0, $508449958c1d885a$export$c8ec6e1ec9fefcb0)((0, $e15d24d280bad751$export$efd7770b5da84f9e)),
    data: (0, $508449958c1d885a$export$be5493f9613cbbe)({}).passthrough()
});
const $2d2422041748fbeb$export$4c6f5e6e10fb9fd0 = (0, $e15d24d280bad751$export$7a3470becaa040fa).extend({
    evt: (0, $508449958c1d885a$export$c8ec6e1ec9fefcb0)($2d2422041748fbeb$export$103bedf43ba882db),
    data: (0, $508449958c1d885a$export$be5493f9613cbbe)({
        code: (0, $508449958c1d885a$export$98e628dec113755e)(),
        message: (0, $508449958c1d885a$export$22b082955e083ec3)().optional()
    }).passthrough(),
    cmd: (0, $508449958c1d885a$export$6fe7eca19ebe5199)((0, $e15d24d280bad751$export$ba30f7724cb0e54e)),
    nonce: (0, $508449958c1d885a$export$22b082955e083ec3)().nullable()
});
const $2d2422041748fbeb$export$a242e5821d539c8e = $2d2422041748fbeb$export$326fa0fd43fb9e9c.extend({
    evt: (0, $508449958c1d885a$export$22b082955e083ec3)()
});
const $2d2422041748fbeb$export$f344a15bf52574b2 = (0, $508449958c1d885a$export$971dd5b0dfd021b6)([
    $2d2422041748fbeb$export$326fa0fd43fb9e9c,
    $2d2422041748fbeb$export$a242e5821d539c8e,
    $2d2422041748fbeb$export$4c6f5e6e10fb9fd0
]);
function $2d2422041748fbeb$export$a46bc76e895063f4(data) {
    const event = data.evt;
    if (!(event in $2d2422041748fbeb$export$ada873a34909da65)) throw new Error(`Unrecognized event type ${data.evt}`);
    const eventSchema = $2d2422041748fbeb$export$769a4ec051ed522c[event];
    return eventSchema.payload.parse(data);
}
const $2d2422041748fbeb$export$769a4ec051ed522c = {
    /**
     * @description
     * The READY event is emitted by Discord's RPC server in reply to a client
     * initiating the RPC handshake. The event includes information about
     * - the rpc server version
     * - the discord client configuration
     * - the (basic) user object
     *
     * Unlike other events, READY will only be omitted once, immediately after the
     * Embedded App SDK is initialized
     *
     * # Supported Platforms
     * | Web | iOS | Android |
     * |-----|-----|---------|
     * | ✅  | ✅  | ✅      |
     *
     * Required scopes: []
     *
     */ [$2d2422041748fbeb$export$ada873a34909da65.READY]: {
        payload: $2d2422041748fbeb$export$326fa0fd43fb9e9c.extend({
            evt: (0, $508449958c1d885a$export$c8ec6e1ec9fefcb0)($2d2422041748fbeb$export$ada873a34909da65.READY),
            data: (0, $508449958c1d885a$export$be5493f9613cbbe)({
                v: (0, $508449958c1d885a$export$98e628dec113755e)(),
                config: (0, $508449958c1d885a$export$be5493f9613cbbe)({
                    cdn_host: (0, $508449958c1d885a$export$22b082955e083ec3)().optional(),
                    api_endpoint: (0, $508449958c1d885a$export$22b082955e083ec3)(),
                    environment: (0, $508449958c1d885a$export$22b082955e083ec3)()
                }),
                user: (0, $508449958c1d885a$export$be5493f9613cbbe)({
                    id: (0, $508449958c1d885a$export$22b082955e083ec3)(),
                    username: (0, $508449958c1d885a$export$22b082955e083ec3)(),
                    discriminator: (0, $508449958c1d885a$export$22b082955e083ec3)(),
                    avatar: (0, $508449958c1d885a$export$22b082955e083ec3)().optional()
                }).optional()
            })
        })
    },
    [$2d2422041748fbeb$export$ada873a34909da65.VOICE_STATE_UPDATE]: {
        payload: $2d2422041748fbeb$export$326fa0fd43fb9e9c.extend({
            evt: (0, $508449958c1d885a$export$c8ec6e1ec9fefcb0)($2d2422041748fbeb$export$ada873a34909da65.VOICE_STATE_UPDATE),
            data: (0, $e15d24d280bad751$export$4b86a4e430ccb511)
        }),
        subscribeArgs: (0, $508449958c1d885a$export$be5493f9613cbbe)({
            channel_id: (0, $508449958c1d885a$export$22b082955e083ec3)()
        })
    },
    [$2d2422041748fbeb$export$ada873a34909da65.SPEAKING_START]: {
        payload: $2d2422041748fbeb$export$326fa0fd43fb9e9c.extend({
            evt: (0, $508449958c1d885a$export$c8ec6e1ec9fefcb0)($2d2422041748fbeb$export$ada873a34909da65.SPEAKING_START),
            data: (0, $508449958c1d885a$export$be5493f9613cbbe)({
                lobby_id: (0, $508449958c1d885a$export$22b082955e083ec3)().optional(),
                channel_id: (0, $508449958c1d885a$export$22b082955e083ec3)().optional(),
                user_id: (0, $508449958c1d885a$export$22b082955e083ec3)()
            })
        }),
        subscribeArgs: (0, $508449958c1d885a$export$be5493f9613cbbe)({
            lobby_id: (0, $508449958c1d885a$export$22b082955e083ec3)().nullable().optional(),
            channel_id: (0, $508449958c1d885a$export$22b082955e083ec3)().nullable().optional()
        })
    },
    [$2d2422041748fbeb$export$ada873a34909da65.SPEAKING_STOP]: {
        payload: $2d2422041748fbeb$export$326fa0fd43fb9e9c.extend({
            evt: (0, $508449958c1d885a$export$c8ec6e1ec9fefcb0)($2d2422041748fbeb$export$ada873a34909da65.SPEAKING_STOP),
            data: (0, $508449958c1d885a$export$be5493f9613cbbe)({
                lobby_id: (0, $508449958c1d885a$export$22b082955e083ec3)().optional(),
                channel_id: (0, $508449958c1d885a$export$22b082955e083ec3)().optional(),
                user_id: (0, $508449958c1d885a$export$22b082955e083ec3)()
            })
        }),
        subscribeArgs: (0, $508449958c1d885a$export$be5493f9613cbbe)({
            lobby_id: (0, $508449958c1d885a$export$22b082955e083ec3)().nullable().optional(),
            channel_id: (0, $508449958c1d885a$export$22b082955e083ec3)().nullable().optional()
        })
    },
    [$2d2422041748fbeb$export$ada873a34909da65.ACTIVITY_LAYOUT_MODE_UPDATE]: {
        payload: $2d2422041748fbeb$export$326fa0fd43fb9e9c.extend({
            evt: (0, $508449958c1d885a$export$c8ec6e1ec9fefcb0)($2d2422041748fbeb$export$ada873a34909da65.ACTIVITY_LAYOUT_MODE_UPDATE),
            data: (0, $508449958c1d885a$export$be5493f9613cbbe)({
                layout_mode: (0, $349b88e1f39306ed$export$5989705faed03747)((0, $e15d24d280bad751$export$94c8fa8df0efcb28))
            })
        })
    },
    [$2d2422041748fbeb$export$ada873a34909da65.ORIENTATION_UPDATE]: {
        payload: $2d2422041748fbeb$export$326fa0fd43fb9e9c.extend({
            evt: (0, $508449958c1d885a$export$c8ec6e1ec9fefcb0)($2d2422041748fbeb$export$ada873a34909da65.ORIENTATION_UPDATE),
            data: (0, $508449958c1d885a$export$be5493f9613cbbe)({
                screen_orientation: (0, $349b88e1f39306ed$export$5989705faed03747)((0, $e15d24d280bad751$export$6998f50a089a6f29)),
                /**
                 * @deprecated use screen_orientation instead
                 */ orientation: (0, $508449958c1d885a$export$6fe7eca19ebe5199)((0, $a1ac51d0d1873cf0$export$df54d73aa0ec5e82))
            })
        })
    },
    [$2d2422041748fbeb$export$ada873a34909da65.CURRENT_USER_UPDATE]: {
        payload: $2d2422041748fbeb$export$326fa0fd43fb9e9c.extend({
            evt: (0, $508449958c1d885a$export$c8ec6e1ec9fefcb0)($2d2422041748fbeb$export$ada873a34909da65.CURRENT_USER_UPDATE),
            data: (0, $e15d24d280bad751$export$1f44aaf2ec115b54)
        })
    },
    [$2d2422041748fbeb$export$ada873a34909da65.CURRENT_GUILD_MEMBER_UPDATE]: {
        payload: $2d2422041748fbeb$export$326fa0fd43fb9e9c.extend({
            evt: (0, $508449958c1d885a$export$c8ec6e1ec9fefcb0)($2d2422041748fbeb$export$ada873a34909da65.CURRENT_GUILD_MEMBER_UPDATE),
            data: (0, $e15d24d280bad751$export$8fbf13c8b5cc978c)
        }),
        subscribeArgs: (0, $508449958c1d885a$export$be5493f9613cbbe)({
            guild_id: (0, $508449958c1d885a$export$22b082955e083ec3)()
        })
    },
    [$2d2422041748fbeb$export$ada873a34909da65.ENTITLEMENT_CREATE]: {
        payload: $2d2422041748fbeb$export$326fa0fd43fb9e9c.extend({
            evt: (0, $508449958c1d885a$export$c8ec6e1ec9fefcb0)($2d2422041748fbeb$export$ada873a34909da65.ENTITLEMENT_CREATE),
            data: (0, $508449958c1d885a$export$be5493f9613cbbe)({
                entitlement: (0, $e15d24d280bad751$export$7b20d168ba04011b)
            })
        })
    },
    [$2d2422041748fbeb$export$ada873a34909da65.THERMAL_STATE_UPDATE]: {
        payload: $2d2422041748fbeb$export$326fa0fd43fb9e9c.extend({
            evt: (0, $508449958c1d885a$export$c8ec6e1ec9fefcb0)($2d2422041748fbeb$export$ada873a34909da65.THERMAL_STATE_UPDATE),
            data: (0, $508449958c1d885a$export$be5493f9613cbbe)({
                thermal_state: (0, $e15d24d280bad751$export$8065eea9d621a18)
            })
        })
    },
    [$2d2422041748fbeb$export$ada873a34909da65.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE]: {
        payload: $2d2422041748fbeb$export$326fa0fd43fb9e9c.extend({
            evt: (0, $508449958c1d885a$export$c8ec6e1ec9fefcb0)($2d2422041748fbeb$export$ada873a34909da65.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE),
            data: (0, $508449958c1d885a$export$be5493f9613cbbe)({
                participants: (0, $d41e74f629425b9d$export$55c4c3c25fd5c28e).shape.participants
            })
        })
    }
};






/**
 * Assets x is statically unreachable at build-time,
 * and throws at runtime if data is dynamic.
 */ function $2d2f24b666879631$export$2e2bcd8739ae039(_x, runtimeError) {
    throw runtimeError;
}


const $c37b37e375c11d33$export$2663ce359599a39a = (0, $508449958c1d885a$export$be5493f9613cbbe)({}).nullable();
const $c37b37e375c11d33$export$a20dff0010f153a4 = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    code: (0, $508449958c1d885a$export$22b082955e083ec3)()
});
const $c37b37e375c11d33$export$c72c401de381626f = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    guilds: (0, $508449958c1d885a$export$2f23118c22fb2630)((0, $508449958c1d885a$export$be5493f9613cbbe)({
        id: (0, $508449958c1d885a$export$22b082955e083ec3)(),
        name: (0, $508449958c1d885a$export$22b082955e083ec3)()
    }))
});
const $c37b37e375c11d33$export$5845be03a3ebb99a = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    id: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    name: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    icon_url: (0, $508449958c1d885a$export$22b082955e083ec3)().optional(),
    members: (0, $508449958c1d885a$export$2f23118c22fb2630)((0, $e15d24d280bad751$export$6ba76af5c834ff81))
});
const $c37b37e375c11d33$export$116d844d40ad5f3c = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    id: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    type: (0, $349b88e1f39306ed$export$5989705faed03747)((0, $e15d24d280bad751$export$2f4cb441f3eded01)),
    guild_id: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    name: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    topic: (0, $508449958c1d885a$export$22b082955e083ec3)().optional().nullable(),
    bitrate: (0, $508449958c1d885a$export$98e628dec113755e)().optional().nullable(),
    user_limit: (0, $508449958c1d885a$export$98e628dec113755e)().optional().nullable(),
    position: (0, $508449958c1d885a$export$98e628dec113755e)().optional().nullable(),
    voice_states: (0, $508449958c1d885a$export$2f23118c22fb2630)((0, $e15d24d280bad751$export$4b86a4e430ccb511)),
    messages: (0, $508449958c1d885a$export$2f23118c22fb2630)((0, $e15d24d280bad751$export$f69c19e57285b83a))
});
const $c37b37e375c11d33$export$1f3b23c28c30c42c = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    channels: (0, $508449958c1d885a$export$2f23118c22fb2630)((0, $e15d24d280bad751$export$cfdacaa37f9b4dd7))
});
const $c37b37e375c11d33$export$8ff9fe3ffde6290d = $c37b37e375c11d33$export$116d844d40ad5f3c.nullable();
const $c37b37e375c11d33$export$c74d4aa0f66fc05e = $c37b37e375c11d33$export$116d844d40ad5f3c.nullable();
const $c37b37e375c11d33$export$e114312640cd43d8 = $c37b37e375c11d33$export$116d844d40ad5f3c.nullable();
const $c37b37e375c11d33$export$f3dffed82766df8f = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    input: (0, $e15d24d280bad751$export$cb1d6465ddfebcf0),
    output: (0, $e15d24d280bad751$export$cb1d6465ddfebcf0),
    mode: (0, $e15d24d280bad751$export$c99e7704e60373e9),
    automatic_gain_control: (0, $508449958c1d885a$export$4a21f16c33752377)(),
    echo_cancellation: (0, $508449958c1d885a$export$4a21f16c33752377)(),
    noise_suppression: (0, $508449958c1d885a$export$4a21f16c33752377)(),
    qos: (0, $508449958c1d885a$export$4a21f16c33752377)(),
    silence_warning: (0, $508449958c1d885a$export$4a21f16c33752377)(),
    deaf: (0, $508449958c1d885a$export$4a21f16c33752377)(),
    mute: (0, $508449958c1d885a$export$4a21f16c33752377)()
});
const $c37b37e375c11d33$export$89425a92d6d4fba3 = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    evt: (0, $508449958c1d885a$export$22b082955e083ec3)()
});
const $c37b37e375c11d33$export$49ab8a39ea910965 = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    shortcut: (0, $e15d24d280bad751$export$f20a7ed0751474c1)
});
const $c37b37e375c11d33$export$6441b328b684708a = (0, $e15d24d280bad751$export$9c16c1426311996d);
const $c37b37e375c11d33$export$c5585ad29c8f7bd0 = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    skus: (0, $508449958c1d885a$export$2f23118c22fb2630)((0, $e15d24d280bad751$export$ccf658062b0f9f7a))
});
const $c37b37e375c11d33$export$4232197b78e8b524 = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    entitlements: (0, $508449958c1d885a$export$2f23118c22fb2630)((0, $e15d24d280bad751$export$7b20d168ba04011b))
});
const $c37b37e375c11d33$export$17177c7243ab05e = (0, $508449958c1d885a$export$2f23118c22fb2630)((0, $e15d24d280bad751$export$7b20d168ba04011b)).nullable();
const $c37b37e375c11d33$export$d92a181530f7d8d5 = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    use_interactive_pip: (0, $508449958c1d885a$export$4a21f16c33752377)()
});
const $c37b37e375c11d33$export$b462b396db5f92a0 = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    locale: (0, $508449958c1d885a$export$22b082955e083ec3)()
});
const $c37b37e375c11d33$export$15549cbd10945eeb = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    enabled: (0, $508449958c1d885a$export$4a21f16c33752377)()
});
const $c37b37e375c11d33$export$67379dca9f34c2b9 = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    permissions: (0, $508449958c1d885a$export$a0f65b52274bcc00)().or((0, $508449958c1d885a$export$22b082955e083ec3)())
});
/**
 * Because of the nature of Platform Behavior changes
 * every key/value is optional and may eventually be removed
 */ const $c37b37e375c11d33$export$ea78864ca3ab3f3c = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    iosKeyboardResizesView: (0, $508449958c1d885a$export$516e28dec6a4b6d4)((0, $508449958c1d885a$export$4a21f16c33752377)())
});
const $c37b37e375c11d33$export$8ffc8c4280411e44 = (0, $e15d24d280bad751$export$7a3470becaa040fa).extend({
    cmd: (0, $508449958c1d885a$export$6fe7eca19ebe5199)((0, $e15d24d280bad751$export$ba30f7724cb0e54e)),
    evt: (0, $508449958c1d885a$export$7b1b591b262c240)()
});
function $c37b37e375c11d33$var$parseResponseData({ cmd: cmd, data: data }) {
    switch(cmd){
        case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).AUTHORIZE:
            return $c37b37e375c11d33$export$a20dff0010f153a4.parse(data);
        case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).CAPTURE_SHORTCUT:
            return $c37b37e375c11d33$export$49ab8a39ea910965.parse(data);
        case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).ENCOURAGE_HW_ACCELERATION:
            return $c37b37e375c11d33$export$15549cbd10945eeb.parse(data);
        case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).GET_CHANNEL:
            return $c37b37e375c11d33$export$116d844d40ad5f3c.parse(data);
        case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).GET_CHANNELS:
            return $c37b37e375c11d33$export$1f3b23c28c30c42c.parse(data);
        case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).GET_CHANNEL_PERMISSIONS:
            return $c37b37e375c11d33$export$67379dca9f34c2b9.parse(data);
        case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).GET_GUILD:
            return $c37b37e375c11d33$export$5845be03a3ebb99a.parse(data);
        case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).GET_GUILDS:
            return $c37b37e375c11d33$export$c72c401de381626f.parse(data);
        case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).GET_PLATFORM_BEHAVIORS:
            return $c37b37e375c11d33$export$ea78864ca3ab3f3c.parse(data);
        case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).GET_CHANNEL:
            return $c37b37e375c11d33$export$116d844d40ad5f3c.parse(data);
        case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).SELECT_TEXT_CHANNEL:
            return $c37b37e375c11d33$export$e114312640cd43d8.parse(data);
        case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).SELECT_VOICE_CHANNEL:
            return $c37b37e375c11d33$export$c74d4aa0f66fc05e.parse(data);
        case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).SET_ACTIVITY:
            return $c37b37e375c11d33$export$6441b328b684708a.parse(data);
        case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).GET_SKUS_EMBEDDED:
            return $c37b37e375c11d33$export$c5585ad29c8f7bd0.parse(data);
        case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).GET_ENTITLEMENTS_EMBEDDED:
            return $c37b37e375c11d33$export$4232197b78e8b524.parse(data);
        case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).SET_CONFIG:
            return $c37b37e375c11d33$export$d92a181530f7d8d5.parse(data);
        case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).START_PURCHASE:
            return $c37b37e375c11d33$export$17177c7243ab05e.parse(data);
        case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).SUBSCRIBE:
        case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).UNSUBSCRIBE:
            return $c37b37e375c11d33$export$89425a92d6d4fba3.parse(data);
        case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).USER_SETTINGS_GET_LOCALE:
            return $c37b37e375c11d33$export$b462b396db5f92a0.parse(data);
        // Empty Responses
        case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).OPEN_EXTERNAL_LINK:
        case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).SET_ORIENTATION_LOCK_STATE:
        case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).SET_CERTIFIED_DEVICES:
        case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).SEND_ANALYTICS_EVENT:
        case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).OPEN_INVITE_DIALOG:
        case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).CAPTURE_LOG:
        case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).GET_SKUS:
        case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).GET_ENTITLEMENTS:
            return $c37b37e375c11d33$export$2663ce359599a39a.parse(data);
        // Generated Responses
        case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).AUTHENTICATE:
        case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).INITIATE_IMAGE_UPLOAD:
        case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).OPEN_SHARE_MOMENT_DIALOG:
        case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS:
            const { response: response } = (0, $d41e74f629425b9d$export$e49b768f28ad1b60)[cmd];
            return response.parse(data);
        default:
            (0, $2d2f24b666879631$export$2e2bcd8739ae039)(cmd, new Error(`Unrecognized command ${cmd}`));
    }
}
function $c37b37e375c11d33$export$4890fc55aa463c4c(payload) {
    return Object.assign(Object.assign({}, payload), {
        data: $c37b37e375c11d33$var$parseResponseData(payload)
    });
}




(0, $508449958c1d885a$export$be5493f9613cbbe)({
    frame_id: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    platform: (0, $508449958c1d885a$export$6fe7eca19ebe5199)((0, $a1ac51d0d1873cf0$export$2dffd0b5373a4389)).optional().nullable()
});
(0, $508449958c1d885a$export$be5493f9613cbbe)({
    v: (0, $508449958c1d885a$export$c8ec6e1ec9fefcb0)(1),
    encoding: (0, $508449958c1d885a$export$c8ec6e1ec9fefcb0)("json").optional(),
    client_id: (0, $508449958c1d885a$export$22b082955e083ec3)(),
    frame_id: (0, $508449958c1d885a$export$22b082955e083ec3)()
});
const $e87fd120de7ab3b6$export$46b1619f8b73becb = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    code: (0, $508449958c1d885a$export$98e628dec113755e)(),
    message: (0, $508449958c1d885a$export$22b082955e083ec3)().optional()
});
const $e87fd120de7ab3b6$export$d3f475fe77824935 = (0, $508449958c1d885a$export$be5493f9613cbbe)({
    evt: (0, $508449958c1d885a$export$22b082955e083ec3)().nullable(),
    nonce: (0, $508449958c1d885a$export$22b082955e083ec3)().nullable(),
    data: (0, $508449958c1d885a$export$19282c40b967aec6)().nullable(),
    cmd: (0, $508449958c1d885a$export$22b082955e083ec3)()
}).passthrough();
function $e87fd120de7ab3b6$export$97b1c66ab98393bd(payload) {
    const incoming = $e87fd120de7ab3b6$export$d3f475fe77824935.parse(payload);
    if (incoming.evt != null) {
        if (incoming.evt === (0, $2d2422041748fbeb$export$103bedf43ba882db)) return (0, $2d2422041748fbeb$export$4c6f5e6e10fb9fd0).parse(incoming);
        return (0, $2d2422041748fbeb$export$a46bc76e895063f4)((0, $2d2422041748fbeb$export$f344a15bf52574b2).parse(incoming));
    } else return (0, $c37b37e375c11d33$export$4890fc55aa463c4c)((0, $c37b37e375c11d33$export$8ffc8c4280411e44).passthrough().parse(incoming));
}







function $b9dc466d8ec201cf$export$df09d935d625c3d3(sendCommand, cmd, response, transferTransform = ()=>undefined) {
    const payload = (0, $e15d24d280bad751$export$7a3470becaa040fa).extend({
        cmd: (0, $508449958c1d885a$export$c8ec6e1ec9fefcb0)(cmd),
        data: response
    });
    return async (args)=>{
        const reply = await sendCommand({
            cmd: cmd,
            args: args,
            transfer: transferTransform(args)
        });
        const parsed = payload.parse(reply);
        return parsed.data;
    };
}
function $b9dc466d8ec201cf$export$3c2dac6e8a4c05f8(cmd, transferTransform = ()=>undefined) {
    const response = (0, $d41e74f629425b9d$export$e49b768f28ad1b60)[cmd].response;
    const payload = (0, $e15d24d280bad751$export$7a3470becaa040fa).extend({
        cmd: (0, $508449958c1d885a$export$c8ec6e1ec9fefcb0)(cmd),
        data: response
    });
    return (sendCommand)=>async (args)=>{
            const reply = await sendCommand({
                // @ts-expect-error - Merge commands
                cmd: cmd,
                args: args,
                transfer: transferTransform(args)
            });
            const parsed = payload.parse(reply);
            return parsed.data;
        };
}


/**
 * Authenticate Activity
 */ const $4deb50e78f4a9b8e$export$61bb00ddedae72e4 = (0, $b9dc466d8ec201cf$export$3c2dac6e8a4c05f8)((0, $d41e74f629425b9d$export$cc7e12c76513e857).AUTHENTICATE);





/**
 * Should be called directly after a `ready` payload is received from the
 * Discord client. It includes a list of all scopes that your activity would
 * like to be authorized to use. If the user does not yet have a valid token
 * for all scopes requested, this command will open an OAuth modal. Once an
 * authorized token is available, it will be returned in the command response.
 */ const $0c156493981001c4$export$be1f35f80d3e29cc = (sendCommand)=>(0, $b9dc466d8ec201cf$export$df09d935d625c3d3)(sendCommand, (0, $e15d24d280bad751$export$ba30f7724cb0e54e).AUTHORIZE, (0, $c37b37e375c11d33$export$a20dff0010f153a4));





/**
 *
 */ const $6ce70d88cdf26a76$export$bd13a7db1bc707cf = (sendCommand)=>(0, $b9dc466d8ec201cf$export$df09d935d625c3d3)(sendCommand, (0, $e15d24d280bad751$export$ba30f7724cb0e54e).CAPTURE_LOG, (0, $c37b37e375c11d33$export$2663ce359599a39a));





/**
 *
 */ const $c0bdbfc52c1fe6e9$export$18896ba25f701706 = (sendCommand)=>(0, $b9dc466d8ec201cf$export$df09d935d625c3d3)(sendCommand, (0, $e15d24d280bad751$export$ba30f7724cb0e54e).ENCOURAGE_HW_ACCELERATION, (0, $c37b37e375c11d33$export$15549cbd10945eeb));





/**
 *
 */ const $983bc98e1db776bc$export$6fb7719f7ba7d022 = (sendCommand)=>(0, $b9dc466d8ec201cf$export$df09d935d625c3d3)(sendCommand, (0, $e15d24d280bad751$export$ba30f7724cb0e54e).GET_ENTITLEMENTS_EMBEDDED, (0, $c37b37e375c11d33$export$4232197b78e8b524));





/*
 *
 */ const $c2bf4c9b79dcffe7$export$dcbcde0b5cdb27ed = (sendCommand)=>(0, $b9dc466d8ec201cf$export$df09d935d625c3d3)(sendCommand, (0, $e15d24d280bad751$export$ba30f7724cb0e54e).GET_SKUS_EMBEDDED, (0, $c37b37e375c11d33$export$c5585ad29c8f7bd0));





/**
 * Returns a bigint representing Permissions for the current user in the currently connected channel. Use PermissionsUtils to calculate if a user has a particular permission.
 * Always returns `0n` (no valid permissions) in a (G)DM context, so is unnecessary to call when discordSdk.guildId == null.
 */ const $49f1d87fd0b66111$export$e660ed046f465777 = (sendCommand)=>(0, $b9dc466d8ec201cf$export$df09d935d625c3d3)(sendCommand, (0, $e15d24d280bad751$export$ba30f7724cb0e54e).GET_CHANNEL_PERMISSIONS, (0, $c37b37e375c11d33$export$67379dca9f34c2b9));





/**
 * Returns an object with information about platform behaviors
 * This command can be utilized to inform and react to a breaking change in platform behavior
 *
 * @returns {GetPlatformBehaviorsPayload} payload - The command return value
 * @returns {boolean} payload.data.iosKeyboardResizesView - If on iOS the webview is resized when the keyboard is opened
 */ const $fdc341e40e1d0dbe$export$efbfaabbffdc43d1 = (sendCommand)=>(0, $b9dc466d8ec201cf$export$df09d935d625c3d3)(sendCommand, (0, $e15d24d280bad751$export$ba30f7724cb0e54e).GET_PLATFORM_BEHAVIORS, (0, $c37b37e375c11d33$export$ea78864ca3ab3f3c));





/**
 *
 */ const $36df64b0db0dda49$export$ade3ab3891e57f44 = (sendCommand)=>(0, $b9dc466d8ec201cf$export$df09d935d625c3d3)(sendCommand, (0, $e15d24d280bad751$export$ba30f7724cb0e54e).OPEN_EXTERNAL_LINK, (0, $c37b37e375c11d33$export$2663ce359599a39a));





/**
 * Opens the invite dialog within the discord client, allowing users to share invite links to friends.
 * Does not work in (G)DM contexts (throws RPCError.INVALID_CHANNEL), so should not be called if discordSdk.guildId == null
 * Similarly, if the user does not have Permissions.CREATE_INSTANT_INVITE this command throws RPCErrors.INVALID_PERMISSIONS, so checking the user's permissions via getChannelPermissions is highly recommended.
 */ const $63e4491c50e3b922$export$d02b38bee2b2489b = (sendCommand)=>(0, $b9dc466d8ec201cf$export$df09d935d625c3d3)(sendCommand, (0, $e15d24d280bad751$export$ba30f7724cb0e54e).OPEN_INVITE_DIALOG, (0, $c37b37e375c11d33$export$2663ce359599a39a));




/**
 * Opens the Share Moment Dialog in the user's client, allowing them to share the media at mediaUrl as a message.
 *
 * @param {string} mediaUrl - a Discord CDN URL for the piece of media to be shared.
 * @returns {Promise<void>}
 */ const $0fca2ea8b376db26$export$de3eb37c8ceccf16 = (0, $b9dc466d8ec201cf$export$3c2dac6e8a4c05f8)((0, $d41e74f629425b9d$export$cc7e12c76513e857).OPEN_SHARE_MOMENT_DIALOG);





(0, $e15d24d280bad751$export$9c16c1426311996d).pick({
    state: true,
    details: true,
    timestamps: true,
    assets: true,
    party: true,
    secrets: true,
    instance: true,
    type: true
}).extend({
    type: (0, $e15d24d280bad751$export$9c16c1426311996d).shape.type.optional(),
    instance: (0, $e15d24d280bad751$export$9c16c1426311996d).shape.instance.optional()
}).nullable();
/**
 *
 * @description
 * RPC documentation here: https://discord.com/developers/docs/topics/rpc#setactivity
 * Calling setActivity allows modifying how your activity's rich presence is displayed in the Discord App
 *
 * Supported Platforms
 * | Web | iOS | Android |
 * |-----|-----|---------|
 * | ✅  | ✅  | ✅      |
 *
 * Required scopes: [rpc.activities.write]
 *
 * @example
 * await discordSdk.commands.setActivity({
 *   activity: {
 *     type: 0,
 *     details: 'Details',
 *     state: 'Playing',
 *   },
 * });
 */ const $47381efbd50af9d7$export$5e61ed4454e4dc1b = (sendCommand)=>(0, $b9dc466d8ec201cf$export$df09d935d625c3d3)(sendCommand, (0, $e15d24d280bad751$export$ba30f7724cb0e54e).SET_ACTIVITY, (0, $c37b37e375c11d33$export$6441b328b684708a));





/**
 *
 */ const $fe4402427974fac9$export$940a7873bb071df8 = (sendCommand)=>(0, $b9dc466d8ec201cf$export$df09d935d625c3d3)(sendCommand, (0, $e15d24d280bad751$export$ba30f7724cb0e54e).SET_CONFIG, (0, $c37b37e375c11d33$export$d92a181530f7d8d5));







/**
 * @args - the primary args to send with the command.
 * @fallbackArgs - the args to try the command with in the case where an old Discord
 *  client doesn't support one of the new args.
 */ function $fc5197e6779e2f86$export$2e2bcd8739ae039({ sendCommand: sendCommand, cmd: cmd, response: response, fallbackTransform: fallbackTransform, transferTransform: transferTransform = ()=>undefined }) {
    const payload = (0, $e15d24d280bad751$export$7a3470becaa040fa).extend({
        cmd: (0, $508449958c1d885a$export$c8ec6e1ec9fefcb0)(cmd),
        data: response
    });
    return async (args)=>{
        try {
            const reply = await sendCommand({
                cmd: cmd,
                args: args,
                transfer: transferTransform(args)
            });
            const parsed = payload.parse(reply);
            return parsed.data;
        } catch (error) {
            if (error.code === (0, $a1ac51d0d1873cf0$export$9ebb08d40ecbafd9).INVALID_PAYLOAD) {
                const fallbackArgs = fallbackTransform(args);
                const reply = await sendCommand({
                    cmd: cmd,
                    args: fallbackArgs,
                    transfer: transferTransform(fallbackArgs)
                });
                const parsed = payload.parse(reply);
                return parsed.data;
            } else throw error;
        }
    };
}


const $bcee32c3b3ea03cb$var$fallbackTransform = (args)=>{
    return {
        lock_state: args.lock_state,
        picture_in_picture_lock_state: args.picture_in_picture_lock_state
    };
};
const $bcee32c3b3ea03cb$export$970bc058b4f43d8a = (sendCommand)=>(0, $fc5197e6779e2f86$export$2e2bcd8739ae039)({
        sendCommand: sendCommand,
        cmd: (0, $e15d24d280bad751$export$ba30f7724cb0e54e).SET_ORIENTATION_LOCK_STATE,
        response: (0, $c37b37e375c11d33$export$2663ce359599a39a),
        fallbackTransform: $bcee32c3b3ea03cb$var$fallbackTransform
    });





/**
 *
 */ const $aacb3d79ca6c3f9d$export$fb512c02b6232086 = (sendCommand)=>(0, $b9dc466d8ec201cf$export$df09d935d625c3d3)(sendCommand, (0, $e15d24d280bad751$export$ba30f7724cb0e54e).START_PURCHASE, (0, $c37b37e375c11d33$export$17177c7243ab05e));





/**
 *
 */ const $9fa9133ed83118df$export$8358d3ac583ae3cc = (sendCommand)=>(0, $b9dc466d8ec201cf$export$df09d935d625c3d3)(sendCommand, (0, $e15d24d280bad751$export$ba30f7724cb0e54e).USER_SETTINGS_GET_LOCALE, (0, $c37b37e375c11d33$export$b462b396db5f92a0));




/**
 * Triggers the file upload flow in the Discord app. The user will be prompted to select a valid image file
 * and then it will be uploaded on the app side to the Discord CDN.
 *
 * NOTE: The URL provided by the API is an ephemeral attachment URL, so the image will not be permanently
 * accessible at the link provided.
 *
 * @returns {Promise<{image_url: string}>}
 */ const $de382a0d99c0b2f2$export$1870764d8cf96241 = (0, $b9dc466d8ec201cf$export$3c2dac6e8a4c05f8)((0, $d41e74f629425b9d$export$cc7e12c76513e857).INITIATE_IMAGE_UPLOAD);





/**
 *
 * @description
 * RPC documentation here: https://discord.com/developers/docs/topics/rpc#getchannel
 * Calling getChannel gets info about the requested channel such as the channel name.
 *
 * Supported Platforms
 * | Web | iOS | Android |
 * |-----|-----|---------|
 * | ✅  | ✅  | ✅      |
 *
 * Required scopes:
 * - [guilds] for guild channels
 * - [guilds, dm_channels.read] for GDM channels. dm_channels.read requires approval from Discord.
 *
 * @example
 * await discordSdk.commands.getActivity({
 *   channel_id: discordSdk.channelId,
 * });
 */ const $4679f85b8cc5199d$export$98c37618398a9832 = (sendCommand)=>(0, $b9dc466d8ec201cf$export$df09d935d625c3d3)(sendCommand, (0, $e15d24d280bad751$export$ba30f7724cb0e54e).GET_CHANNEL, (0, $c37b37e375c11d33$export$116d844d40ad5f3c));




/**
 * Gets all participants connected to the instance
 */ const $0c483750034efd8f$export$7f68e5d0d751af12 = (0, $b9dc466d8ec201cf$export$3c2dac6e8a4c05f8)((0, $d41e74f629425b9d$export$cc7e12c76513e857).GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS);


function $45d970010f419926$export$2e2bcd8739ae039(sendCommand) {
    return {
        authenticate: (0, $4deb50e78f4a9b8e$export$61bb00ddedae72e4)(sendCommand),
        authorize: (0, $0c156493981001c4$export$be1f35f80d3e29cc)(sendCommand),
        captureLog: (0, $6ce70d88cdf26a76$export$bd13a7db1bc707cf)(sendCommand),
        encourageHardwareAcceleration: (0, $c0bdbfc52c1fe6e9$export$18896ba25f701706)(sendCommand),
        getChannel: (0, $4679f85b8cc5199d$export$98c37618398a9832)(sendCommand),
        getChannelPermissions: (0, $49f1d87fd0b66111$export$e660ed046f465777)(sendCommand),
        getEntitlements: (0, $983bc98e1db776bc$export$6fb7719f7ba7d022)(sendCommand),
        getPlatformBehaviors: (0, $fdc341e40e1d0dbe$export$efbfaabbffdc43d1)(sendCommand),
        getSkus: (0, $c2bf4c9b79dcffe7$export$dcbcde0b5cdb27ed)(sendCommand),
        openExternalLink: (0, $36df64b0db0dda49$export$ade3ab3891e57f44)(sendCommand),
        openInviteDialog: (0, $63e4491c50e3b922$export$d02b38bee2b2489b)(sendCommand),
        openShareMomentDialog: (0, $0fca2ea8b376db26$export$de3eb37c8ceccf16)(sendCommand),
        setActivity: (0, $47381efbd50af9d7$export$5e61ed4454e4dc1b)(sendCommand),
        setConfig: (0, $fe4402427974fac9$export$940a7873bb071df8)(sendCommand),
        setOrientationLockState: (0, $bcee32c3b3ea03cb$export$970bc058b4f43d8a)(sendCommand),
        startPurchase: (0, $aacb3d79ca6c3f9d$export$fb512c02b6232086)(sendCommand),
        userSettingsGetLocale: (0, $9fa9133ed83118df$export$8358d3ac583ae3cc)(sendCommand),
        initiateImageUpload: (0, $de382a0d99c0b2f2$export$1870764d8cf96241)(sendCommand),
        getInstanceConnectedParticipants: (0, $0c483750034efd8f$export$7f68e5d0d751af12)(sendCommand)
    };
}


class $6a7b5acf646564f6$export$e1d52e4f0c7557a1 extends Error {
    constructor(code, message = ""){
        super(message);
        this.code = code;
        this.message = message;
        this.name = "Discord SDK Error";
    }
}




function $55f998db72cbe8ea$export$2e2bcd8739ae039() {
    return {
        disableConsoleLogOverride: false
    };
}


const $387e391b4217a6b2$export$a3647e951d1937a9 = [
    "log",
    "warn",
    "debug",
    "info",
    "error"
];
function $387e391b4217a6b2$export$46a03bf5755ffc4c(console, level, callback) {
    const _consoleMethod = console[level];
    const _console = console;
    if (!_consoleMethod) return;
    console[level] = function() {
        const args = [].slice.call(arguments);
        const message = "" + args.join(" ");
        callback(level, message);
        _consoleMethod.apply(_console, args);
    };
}



var $020cbd99f54eb1f5$var$randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var $020cbd99f54eb1f5$export$2e2bcd8739ae039 = {
    randomUUID: $020cbd99f54eb1f5$var$randomUUID
};


// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var $2ec582480926ab4a$var$getRandomValues;
var $2ec582480926ab4a$var$rnds8 = new Uint8Array(16);
function $2ec582480926ab4a$export$2e2bcd8739ae039() {
    // lazy load so that environments that need to polyfill have a chance to do so
    if (!$2ec582480926ab4a$var$getRandomValues) {
        // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
        $2ec582480926ab4a$var$getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
        if (!$2ec582480926ab4a$var$getRandomValues) throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
    return $2ec582480926ab4a$var$getRandomValues($2ec582480926ab4a$var$rnds8);
}


/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */ var $b121348fc5aa62c2$var$byteToHex = [];
for(var $b121348fc5aa62c2$var$i = 0; $b121348fc5aa62c2$var$i < 256; ++$b121348fc5aa62c2$var$i)$b121348fc5aa62c2$var$byteToHex.push(($b121348fc5aa62c2$var$i + 0x100).toString(16).slice(1));
function $b121348fc5aa62c2$export$8fb373d660548968(arr, offset = 0) {
    // Note: Be careful editing this code!  It's been tuned for performance
    // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
    //
    // Note to future-self: No, you can't remove the `toLowerCase()` call.
    // REF: https://github.com/uuidjs/uuid/pull/677#issuecomment-1757351351
    return ($b121348fc5aa62c2$var$byteToHex[arr[offset + 0]] + $b121348fc5aa62c2$var$byteToHex[arr[offset + 1]] + $b121348fc5aa62c2$var$byteToHex[arr[offset + 2]] + $b121348fc5aa62c2$var$byteToHex[arr[offset + 3]] + "-" + $b121348fc5aa62c2$var$byteToHex[arr[offset + 4]] + $b121348fc5aa62c2$var$byteToHex[arr[offset + 5]] + "-" + $b121348fc5aa62c2$var$byteToHex[arr[offset + 6]] + $b121348fc5aa62c2$var$byteToHex[arr[offset + 7]] + "-" + $b121348fc5aa62c2$var$byteToHex[arr[offset + 8]] + $b121348fc5aa62c2$var$byteToHex[arr[offset + 9]] + "-" + $b121348fc5aa62c2$var$byteToHex[arr[offset + 10]] + $b121348fc5aa62c2$var$byteToHex[arr[offset + 11]] + $b121348fc5aa62c2$var$byteToHex[arr[offset + 12]] + $b121348fc5aa62c2$var$byteToHex[arr[offset + 13]] + $b121348fc5aa62c2$var$byteToHex[arr[offset + 14]] + $b121348fc5aa62c2$var$byteToHex[arr[offset + 15]]).toLowerCase();
}


function $9da6723662087718$export$2e2bcd8739ae039(options, buf, offset) {
    if ((0, $020cbd99f54eb1f5$export$2e2bcd8739ae039).randomUUID && !buf && !options) return (0, $020cbd99f54eb1f5$export$2e2bcd8739ae039).randomUUID();
    options = options || {};
    var rnds = options.random || (options.rng || (0, $2ec582480926ab4a$export$2e2bcd8739ae039))();
    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = rnds[6] & 0x0f | 0x40;
    rnds[8] = rnds[8] & 0x3f | 0x80;
    // Copy bytes to buffer, if provided
    if (buf) {
        offset = offset || 0;
        for(var i = 0; i < 16; ++i)buf[offset + i] = rnds[i];
        return buf;
    }
    return (0, $b121348fc5aa62c2$export$8fb373d660548968)(rnds);
}


var $1d41627539c55da9$export$6354ae5022ad3977;
(function(Opcodes) {
    Opcodes[Opcodes["HANDSHAKE"] = 0] = "HANDSHAKE";
    Opcodes[Opcodes["FRAME"] = 1] = "FRAME";
    Opcodes[Opcodes["CLOSE"] = 2] = "CLOSE";
    Opcodes[Opcodes["HELLO"] = 3] = "HELLO";
})($1d41627539c55da9$export$6354ae5022ad3977 || ($1d41627539c55da9$export$6354ae5022ad3977 = {}));
const $1d41627539c55da9$var$ALLOWED_ORIGINS = new Set($1d41627539c55da9$var$getAllowedOrigins());
function $1d41627539c55da9$var$getAllowedOrigins() {
    if (typeof window === "undefined") return [];
    return [
        window.location.origin,
        "https://discord.com",
        "https://discordapp.com",
        "https://ptb.discord.com",
        "https://ptb.discordapp.com",
        "https://canary.discord.com",
        "https://canary.discordapp.com",
        "https://staging.discord.co",
        "http://localhost:3333",
        "https://pax.discord.com",
        "null"
    ];
}
/**
 * The embedded application is running in an IFrame either within the main Discord client window or in a popout. The RPC server is always running in the main Discord client window. In either case, the referrer is the correct origin.
 */ function $1d41627539c55da9$var$getRPCServerSource() {
    var _a;
    return [
        (_a = window.parent.opener) !== null && _a !== void 0 ? _a : window.parent,
        !!document.referrer ? document.referrer : "*"
    ];
}
class $1d41627539c55da9$export$7cb9b6936cca2046 {
    getTransfer(payload) {
        var _a;
        switch(payload.cmd){
            case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).SUBSCRIBE:
            case (0, $e15d24d280bad751$export$ba30f7724cb0e54e).UNSUBSCRIBE:
                return undefined;
            default:
                return (_a = payload.transfer) !== null && _a !== void 0 ? _a : undefined;
        }
    }
    constructor(clientId, configuration){
        this.source = null;
        this.sourceOrigin = "";
        this.eventBus = new (0, $602d255db586a79f$export$2e2bcd8739ae039)();
        this.pendingCommands = new Map();
        this.sendCommand = (payload)=>{
            var _a;
            if (this.source == null) throw new Error("Attempting to send message before initialization");
            const nonce = (0, $9da6723662087718$export$2e2bcd8739ae039)();
            (_a = this.source) === null || _a === void 0 || _a.postMessage([
                $1d41627539c55da9$export$6354ae5022ad3977.FRAME,
                Object.assign(Object.assign({}, payload), {
                    nonce: nonce
                })
            ], this.sourceOrigin, this.getTransfer(payload));
            const promise = new Promise((resolve, reject)=>{
                this.pendingCommands.set(nonce, {
                    resolve: resolve,
                    reject: reject
                });
            });
            return promise;
        };
        this.commands = (0, $45d970010f419926$export$2e2bcd8739ae039)(this.sendCommand);
        /**
         * WARNING - All "console" logs are emitted as messages to the Discord client
         *  If you write "console.log" anywhere in handleMessage or subsequent message handling
         * there is a good chance you will cause an infinite loop where you receive a message
         * which causes "console.log" which sends a message, which causes the discord client to
         * send a reply which causes handleMessage to fire again, and again to inifinity
         *
         * If you need to log within handleMessage, consider setting
         * config.disableConsoleLogOverride to true when initializing the SDK
         */ this.handleMessage = (event)=>{
            if (!$1d41627539c55da9$var$ALLOWED_ORIGINS.has(event.origin)) return;
            const tuple = event.data;
            if (!Array.isArray(tuple)) return;
            const [opcode, data] = tuple;
            switch(opcode){
                case $1d41627539c55da9$export$6354ae5022ad3977.HELLO:
                    // backwards compat; the Discord client will still send HELLOs for old applications.
                    //
                    // TODO: figure out compatibility approach; it would be easier to maintain compatibility at the SDK level, not the underlying RPC protocol level...
                    return;
                case $1d41627539c55da9$export$6354ae5022ad3977.CLOSE:
                    return this.handleClose(data);
                case $1d41627539c55da9$export$6354ae5022ad3977.HANDSHAKE:
                    return this.handleHandshake();
                case $1d41627539c55da9$export$6354ae5022ad3977.FRAME:
                    return this.handleFrame(data);
                default:
                    throw new Error("Invalid message format");
            }
        };
        this.isReady = false;
        this.clientId = clientId;
        this.configuration = configuration !== null && configuration !== void 0 ? configuration : (0, $55f998db72cbe8ea$export$2e2bcd8739ae039)();
        if (typeof window !== "undefined") window.addEventListener("message", this.handleMessage);
        if (typeof window === "undefined") {
            this.frameId = "";
            this.instanceId = "";
            this.platform = (0, $a1ac51d0d1873cf0$export$2dffd0b5373a4389).DESKTOP;
            this.guildId = null;
            this.channelId = null;
            return;
        }
        // START Capture URL Query Params
        const urlParams = new URLSearchParams(this._getSearch());
        const frameId = urlParams.get("frame_id");
        if (!frameId) throw new Error("frame_id query param is not defined");
        this.frameId = frameId;
        const instanceId = urlParams.get("instance_id");
        if (!instanceId) throw new Error("instance_id query param is not defined");
        this.instanceId = instanceId;
        const platform = urlParams.get("platform");
        if (!platform) throw new Error("platform query param is not defined");
        else if (platform !== (0, $a1ac51d0d1873cf0$export$2dffd0b5373a4389).DESKTOP && platform !== (0, $a1ac51d0d1873cf0$export$2dffd0b5373a4389).MOBILE) throw new Error(`Invalid query param "platform" of "${platform}". Valid values are "${(0, $a1ac51d0d1873cf0$export$2dffd0b5373a4389).DESKTOP}" or "${(0, $a1ac51d0d1873cf0$export$2dffd0b5373a4389).MOBILE}"`);
        this.platform = platform;
        this.guildId = urlParams.get("guild_id");
        this.channelId = urlParams.get("channel_id");
        // END Capture URL Query Params
        [this.source, this.sourceOrigin] = $1d41627539c55da9$var$getRPCServerSource();
        this.addOnReadyListener();
        this.handshake();
    }
    close(code, message) {
        var _a;
        window.removeEventListener("message", this.handleMessage);
        const nonce = (0, $9da6723662087718$export$2e2bcd8739ae039)();
        (_a = this.source) === null || _a === void 0 || _a.postMessage([
            $1d41627539c55da9$export$6354ae5022ad3977.CLOSE,
            {
                code: code,
                message: message,
                nonce: nonce
            }
        ], this.sourceOrigin);
    }
    async subscribe(event, listener, ...rest) {
        const [subscribeArgs] = rest;
        const listenerCount = this.eventBus.listenerCount(event);
        const emitter = this.eventBus.on(event, listener);
        // If first subscription, subscribe via RPC
        if (Object.values((0, $2d2422041748fbeb$export$ada873a34909da65)).includes(event) && event !== (0, $2d2422041748fbeb$export$ada873a34909da65).READY && listenerCount === 0) await this.sendCommand({
            cmd: (0, $e15d24d280bad751$export$ba30f7724cb0e54e).SUBSCRIBE,
            args: subscribeArgs,
            evt: event
        });
        return emitter;
    }
    async unsubscribe(event, listener, ...rest) {
        const [unsubscribeArgs] = rest;
        if (event !== (0, $2d2422041748fbeb$export$ada873a34909da65).READY && this.eventBus.listenerCount(event) === 1) await this.sendCommand({
            cmd: (0, $e15d24d280bad751$export$ba30f7724cb0e54e).UNSUBSCRIBE,
            evt: event,
            args: unsubscribeArgs
        });
        return this.eventBus.off(event, listener);
    }
    async ready() {
        if (this.isReady) return;
        else await new Promise((resolve)=>{
            this.eventBus.once((0, $2d2422041748fbeb$export$ada873a34909da65).READY, resolve);
        });
    }
    handshake() {
        var _a;
        (_a = this.source) === null || _a === void 0 || _a.postMessage([
            $1d41627539c55da9$export$6354ae5022ad3977.HANDSHAKE,
            {
                v: 1,
                encoding: "json",
                client_id: this.clientId,
                frame_id: this.frameId
            }
        ], this.sourceOrigin);
    }
    addOnReadyListener() {
        this.eventBus.once((0, $2d2422041748fbeb$export$ada873a34909da65).READY, ()=>{
            this.overrideConsoleLogging();
            this.isReady = true;
        });
    }
    overrideConsoleLogging() {
        if (this.configuration.disableConsoleLogOverride) return;
        const sendCaptureLogCommand = (level, message)=>{
            this.commands.captureLog({
                level: level,
                message: message
            });
        };
        (0, $387e391b4217a6b2$export$a3647e951d1937a9).forEach((level)=>{
            (0, $387e391b4217a6b2$export$46a03bf5755ffc4c)(console, level, sendCaptureLogCommand);
        });
    }
    handleClose(data) {
        (0, $e87fd120de7ab3b6$export$46b1619f8b73becb).parse(data);
    }
    handleHandshake() {}
    handleFrame(payload) {
        var _a, _b;
        let parsed;
        try {
            parsed = (0, $e87fd120de7ab3b6$export$97b1c66ab98393bd)(payload);
        } catch (e) {
            console.error("Failed to parse", payload);
            console.error(e);
            return;
        }
        if (parsed.cmd === "DISPATCH") this.eventBus.emit(parsed.evt, parsed.data);
        else {
            if (parsed.evt === (0, $2d2422041748fbeb$export$103bedf43ba882db)) {
                // In response to a command
                if (parsed.nonce != null) {
                    (_a = this.pendingCommands.get(parsed.nonce)) === null || _a === void 0 || _a.reject(parsed.data);
                    this.pendingCommands.delete(parsed.nonce);
                    return;
                }
                // General error
                this.eventBus.emit("error", new (0, $6a7b5acf646564f6$export$e1d52e4f0c7557a1)(parsed.data.code, parsed.data.message));
            }
            if (parsed.nonce == null) {
                console.error("Missing nonce", payload);
                return;
            }
            (_b = this.pendingCommands.get(parsed.nonce)) === null || _b === void 0 || _b.resolve(parsed);
            this.pendingCommands.delete(parsed.nonce);
        }
    }
    _getSearch() {
        return typeof window === "undefined" ? "" : window.location.search;
    }
}


export {$1d41627539c55da9$export$6354ae5022ad3977 as Opcodes, $1d41627539c55da9$export$7cb9b6936cca2046 as DiscordSDK};
