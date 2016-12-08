export const win = window;
export const doc = document;
export type DomElement = Element;
export type DomNode = Node;

export const perf = ("performance" in window && "now" in performance) ? performance : {
	offset: Date.now(),
	now: function () { return Date.now() - this.offset; }
};

export const now = Date.now;