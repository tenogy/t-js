import { now } from './platform';

const FUNC_ERROR_TEXT = 'Expected a function';

const hasOwnProperty = Object.prototype.hasOwnProperty,
	nativeMax = Math.max,
	nativeMin = Math.min;

export function has(obj, property) {
	return hasOwnProperty.call(obj, property);
}

export function contains(obj, property) {
	if (!obj.indexOf) {
		return has(obj, property);
	}
	return obj.indexOf(property) > -1;
}

/**
 * Enumerates keys of plain object.
 * @param obj
 * @param f
 */
export function eachKey(obj, f: (string) => void) {
	for (let k in obj) f(k);
}

/**
 * Extends plain mutable object.
 * @param dest
 * @param src
 */
export function extend(dest, src) {
	for (let k in src) dest[k] = src[k];
	return dest;
}

/**
 * Extends plain mutable object restricted by scope.
 * @param dest
 * @param src
 */
export function extendScoped(dest, src, scope) {
	if (!scope) return extend(dest, src);

	for (let k in src) {
		if (hasOwnProperty.call(scope, k)) dest[k] = src[k];
	}
	return dest;
}
/**
 * Convert array to plain object.
 * @param array
 */
export function plainArray(array: string[]) {
	const r = {};
	for (let i = 0; i < array.length; i++) {
		r[array[i]] = undefined;
	}
	return r;
}

export function isString(s) {
	return typeof s === 'string';
}

export function isObject(obj) {
	return obj && typeof obj === 'object';
}

export function isFunction(obj) {
	return !!(obj && obj.constructor && obj.call && obj.apply);
}

export function undef(value) {
	return value === undefined;
}

export function def(value) {
	return value !== undefined;
}

export function isNull(value) {
	return value === null;
}

export function isUndefinedOrNull(value) {
	return value === undefined || value === null;
}

export function debounce(func, wait, options?) {
	var lastArgs,
		lastThis,
		maxWait,
		result,
		timerId,
		lastCallTime,
		lastInvokeTime = 0,
		leading = false,
		maxing = false,
		trailing = true;

	if (typeof func != 'function') {
		throw new TypeError(FUNC_ERROR_TEXT);
	}
	wait = wait || 0;
	if (isObject(options)) {
		leading = !!options.leading;
		maxing = 'maxWait' in options;
		maxWait = maxing ? nativeMax(options.maxWait || 0, wait) : maxWait;
		trailing = 'trailing' in options ? !!options.trailing : trailing;
	}

	function invokeFunc(time) {
		var args = lastArgs,
			thisArg = lastThis;

		lastArgs = lastThis = undefined;
		lastInvokeTime = time;
		result = func.apply(thisArg, args);
		return result;
	}

	function leadingEdge(time) {
		// Reset any `maxWait` timer.
		lastInvokeTime = time;
		// Start the timer for the trailing edge.
		timerId = setTimeout(timerExpired, wait);
		// Invoke the leading edge.
		return leading ? invokeFunc(time) : result;
	}

	function remainingWait(time) {
		var timeSinceLastCall = time - lastCallTime,
			timeSinceLastInvoke = time - lastInvokeTime,
			result = wait - timeSinceLastCall;

		return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
	}

	function shouldInvoke(time) {
		var timeSinceLastCall = time - lastCallTime,
			timeSinceLastInvoke = time - lastInvokeTime;

		// Either this is the first call, activity has stopped and we're at the
		// trailing edge, the system time has gone backwards and we're treating
		// it as the trailing edge, or we've hit the `maxWait` limit.
		return (
			lastCallTime === undefined ||
			timeSinceLastCall >= wait ||
			timeSinceLastCall < 0 ||
			(maxing && timeSinceLastInvoke >= maxWait)
		);
	}

	function timerExpired() {
		var time = now();
		if (shouldInvoke(time)) {
			return trailingEdge(time);
		}
		// Restart the timer.
		timerId = setTimeout(timerExpired, remainingWait(time));
	}

	function trailingEdge(time) {
		timerId = undefined;

		// Only invoke if we have `lastArgs` which means `func` has been
		// debounced at least once.
		if (trailing && lastArgs) {
			return invokeFunc(time);
		}
		lastArgs = lastThis = undefined;
		return result;
	}

	function cancel() {
		if (timerId !== undefined) {
			clearTimeout(timerId);
		}
		lastInvokeTime = 0;
		lastArgs = lastCallTime = lastThis = timerId = undefined;
	}

	function flush() {
		return timerId === undefined ? result : trailingEdge(now());
	}

	function debounced() {
		var time = now(),
			isInvoking = shouldInvoke(time);

		lastArgs = arguments;
		lastThis = this;
		lastCallTime = time;

		if (isInvoking) {
			if (timerId === undefined) {
				return leadingEdge(lastCallTime);
			}
			if (maxing) {
				// Handle invocations in a tight loop.
				timerId = setTimeout(timerExpired, wait);
				return invokeFunc(lastCallTime);
			}
		}
		if (timerId === undefined) {
			timerId = setTimeout(timerExpired, wait);
		}
		return result;
	}
	(debounced as any).cancel = cancel;
	(debounced as any).flush = flush;
	return debounced;
}
