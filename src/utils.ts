const hasOwnProperty = Object.prototype.hasOwnProperty;

export function has(obj, property) {
	return hasOwnProperty.call(obj, property);
};

export function contains(obj, property) {
	if (!obj.indexOf) {
		return has(obj, property);
	}
	return obj.indexOf(property) > -1;
};


export function eachKey(obj, f: (string) => void) {
	for (let k in obj) if (has(obj, k)) f(k);
}

export function extend(dest, src) {
	for (let k in src) {
		if (src.hasOwnProperty(k)) {
			dest[k] = src[k];
		}
	}
	return dest;
}

export function isString(s) {
	return typeof s === 'string';
}

export function isObject(obj) {
	return obj && typeof obj === 'object';
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
