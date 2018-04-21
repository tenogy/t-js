export const win = window;
export const doc = document;
export type DomElement = Element;
export type DomNode = Node;

export const perf =
	'performance' in window && 'now' in performance
		? performance
		: {
				offset: Date.now(),
				now: function() {
					return Date.now() - this.offset;
				}
		  };

export const now = Date.now;

export const userAgent = window.navigator.userAgent.toLowerCase();

const osLookup = [
	{ name: 'winphone', value: 'Windows Phone' },
	{ name: 'win', value: 'Win' },
	{ name: 'iphone', value: 'iPhone' },
	{ name: 'ipad', value: 'iPad' },
	{ name: 'kindle', value: 'Silk' },
	{ name: 'android', value: 'Android' },
	{ name: 'blackberry', value: 'BlackBerry' },
	{ name: 'macintosh', value: 'Mac' },
	{ name: 'linux', value: 'Linux' }
];

const detectOs = () => {
	let i, regex, match;

	for (i = 0; i < osLookup.length; i += 1) {
		regex = new RegExp(osLookup[i].value, 'i');
		match = regex.test(userAgent);
		if (match) {
			return osLookup[i].name;
		}
	}
	return 'unknown';
};

export const os = detectOs(),
	isIos = os === 'ipad' || os === 'iphone',
	isAndroid = os === 'android',
	isWinPhone = os === 'winphone';

function is(search) {
	return userAgent.indexOf(search) > -1;
}

export const isFirefox = is('firefox'),
	isEdge = is('edge'),
	isIE = is('trident'),
	isWebkit = is('AppleWebKit') && !isEdge,
	isIOS7 = is('iPhone OS 7') || is('iPad OS 7');

export function location() {
	return win.location.pathname;
}

export function isDomElement(o) {
	return typeof HTMLElement === 'object'
		? o instanceof HTMLElement //DOM2
		: o &&
				typeof o === 'object' &&
				o !== null &&
				o.nodeType === 1 &&
				typeof o.nodeName === 'string';
}

let rootScriptPath = null;
export function getRootScriptPath() {
	if (rootScriptPath) {
		return rootScriptPath;
	}

	const scripts = doc.getElementsByTagName('script');
	for (let i = 0; i < scripts.length; i++) {
		const script = scripts[i];
		const scriptSrc = script.getAttribute('src');
		if (!scriptSrc) {
			continue;
		}

		const scriptPath = scriptSrc.split('?')[0],
			scriptName = scriptPath
				.split('/')
				.slice(-1)[0]
				.toLowerCase();

		if (
			scriptName === 'common.js' ||
			(scriptName.indexOf('common') === 0 && scriptName.indexOf('.js') === scriptName.length - 3)
		) {
			rootScriptPath = scriptPath
				.split('/')
				.slice(0, -1)
				.join('/');
			return rootScriptPath;
		}
	}

	return null;
}

export function domEval(value) {
	const script = doc.createElement('script');

	script.type = 'text/javascript';
	script.text = value;

	doc.head.appendChild(script).parentNode.removeChild(script);
}

const shim = () => {
	const vendors = ['ms', 'moz', 'webkit', 'o'],
		af = 'AnimationFrame';
	let lastTime = 0;

	for (let vendor of vendors) {
		win.requestAnimationFrame = win[`${vendor}Request${af}`];
		win.cancelAnimationFrame = win[`${vendor}Cancel${af}`] || win[`${vendor}CancelRequest${af}`];
	}

	if (!win.requestAnimationFrame) {
		win.requestAnimationFrame = callback => {
			const currTime = perf.now(),
				timeToCall = Math.max(0, 16 - (currTime - lastTime));

			lastTime = currTime + timeToCall;
			const id = win.setTimeout(() => callback(lastTime), timeToCall);
			return id;
		};
	}

	if (!win.cancelAnimationFrame) {
		win.cancelAnimationFrame = id => clearTimeout(id);
	}
};

if (!win.requestAnimationFrame) {
	shim();
}

const requestAnimationFrame = f => win.requestAnimationFrame(f),
	cancelAnimationFrame = f => win.cancelAnimationFrame(f);
export { requestAnimationFrame, cancelAnimationFrame };

export function requestTimeout(fn, delay) {
	var start = new Date().getTime(),
		handle: any = {};

	function loop() {
		var current = new Date().getTime(),
			delta = current - start;

		delta >= delay ? fn.call() : (handle.value = requestAnimationFrame(loop));
	}

	handle.value = requestAnimationFrame(loop);
	return handle;
}

export function clearRequestTimeout(handle) {
	handle && handle.value && cancelAnimationFrame(handle.value);
}

export function nextRequest(handler, nextCount = 1) {
	let count = nextCount;
	const final = () => {
		if (count < 1) {
			setTimeout(handler, 0);
			return;
		}
		count--;
		requestAnimationFrame(final);
	};
	final();
}

export function ready(fn: () => void) {
	document.addEventListener('DOMContentLoaded', fn);
}

export function createReadyFn(fn) {
	return (...args) => {
		ready(() => {
			fn.apply(args);
		});
	};
}
