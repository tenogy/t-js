import { domEval, createReadyFn } from './platform';
import { isFunction, isObject } from './utils';

export function loadCss(cssPath) {
	const head = document.head,
		link = document.createElement('link');

	link.type = 'text/css';
	link.rel = 'stylesheet';
	link.href = cssPath;

	head.appendChild(link);
}

export const loadCssDelayed = createReadyFn(loadCss);

/**
 * Load script file and eval it.
 * @param path relative path
 * @param success success callback
 * @param error error callback
 * @param sync true for sync script loading(!NOT RECOMMENDED!)
 */
export function getScript(path, success?, error?, sync?) {
	ajaxEx(path, success, error, sync, domEval);
}

export const getScriptDelayed = createReadyFn(getScript);

/**
 * Load JSON as text and parse it.
 * @param path relative path
 * @param success success callback
 * @param error error callback
 * @param sync true for sync script loading(!NOT RECOMMENDED!)
 */
export function getJson(path, success?, error?, sync?) {
	ajaxEx(path, success, error, sync, JSON.parse);
}

/**
 * Load text as is.
 * @param path relative path
 * @param success success callback
 * @param error error callback
 * @param sync true for sync script loading(!NOT RECOMMENDED!)
 */
export function getText(path, success?, error?, sync?) {
	ajaxEx(path, success, error, sync, v => v);
}

function ajaxEx(path, success?, error?, sync?, parser?) {
	ajax(path, {
		success: xhr => {
			let responseText = xhr.responseText;
			if (responseText) {
				try {
					responseText = parser(responseText);
				} catch (e) {
					error &&
						error({
							path,
							data: responseText,
							status: xhr.status,
							state: 'parsererror',
							error: e
						});
				}
			}
			success && success({ path, status: xhr.status, data: responseText });
		},
		error: xhr => {
			error && error({ path, status: xhr.status });
		},
		async: !sync
	});
}

function ajax(url, options) {
	let req = new XMLHttpRequest(),
		opt = options || {},
		postData = opt.data,
		callback = opt.success,
		error = opt.error,
		async = opt.async !== false;

	if (req) {
		if (isFunction(postData)) {
			callback = postData;
			postData = null;
		} else if (isObject(postData)) {
			const pd = [];
			for (let key in postData) {
				if (postData.hasOwnProperty(key)) {
					pd.push(encodeURIComponent(key) + '=' + encodeURIComponent(postData[key]));
				}
			}

			postData = pd.join('&');
		}

		req.open(postData ? 'POST' : 'GET', url, async);
		if (postData) {
			req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			req.setRequestHeader('Api-Key', 'foobar');
		}

		req.onreadystatechange = function() {
			if (req.readyState !== 4) {
				return;
			}

			const status = req.status,
				isSuccess = (status >= 200 && status < 300) || status === 304;

			if (callback && isSuccess) {
				callback(req);
			}

			if (error && !isSuccess) {
				return error(req);
			}
		};

		if (req.readyState === 4) {
			return req;
		}

		req.send(postData);
		return req;
	}
}
