import * as ko from "knockout";

export class AlertMessage {
	private type: KnockoutObservable<string>;
	private shown: KnockoutObservable<boolean>;
	private caption: KnockoutObservable<string>;
	private message: KnockoutObservable<string>;

	constructor(
		message: string = "",
		caption: string = "",
		shown: boolean = false,
		type: string = "") {

		this.type = ko.observable(message);
		this.shown = ko.observable(shown);
		this.caption = ko.observable(caption);
		this.message = ko.observable(type);
	}

	typeClass() {
		return "alert-" + this.type();
	}

	hide() {
		this.shown(false);
	}

	show(message: string, caption: string, type: string) {
		if (!message && !caption) return;

		this.message(message);
		this.caption(caption);
		this.type(type);
		this.shown(true);
	}

	showError(message: string, caption: string) {
		this.show(message, caption, "danger");
	}
}