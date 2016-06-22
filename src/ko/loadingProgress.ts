import * as ko from "knockout";
import {computed, registerComputed} from "./ko-utils";

@registerComputed
export class LoadingProgress {
	constructor(private options?: { delay: number, noWaitMessage: string, waitMessage: string }) {
		this.loading = ko.observable(false);
		this.options = this.options || { delay: 800, noWaitMessage: null, waitMessage: null };
		var delay = this.options.delay;
		if (delay == null) delay = 800;
		this.loadingDelayed = ko.observable(false);
		
		ko.pureComputed(this.loading)
			.extend({ rateLimit: delay })
			.subscribe(() => {
				this.loadingDelayed(this.loading());
			},
			this);
	}

	@computed
	isVisible() {
		return this.loading() && this.loadingDelayed();
	}

	start() {
		this.loading(true);
	}

	stop() {
		this.loading(false);
	}

	@computed
	running() {
		return this.loading();
	}

	//@computed
	hasWaitMessage() {
		return !this.options.noWaitMessage;
	}

	@computed
	waitMessage() {
		return this.options.waitMessage;
	}

	loading: KnockoutObservable<boolean>;
	loadingDelayed: KnockoutObservable<boolean>;
}

if (!ko.components.isRegistered("loading-progress")) {
	ko.components.register(
		"loading-progress",
		{
			viewModel: {
				createViewModel(params) {
					return params.controller;
				}
			},
			template:
			"<div class=\"loading-progress\" data-bind=\"visible: isVisible\">\r\n\t<div class=\"spinner-container\" data-bind=\"spin: isVisible\"></div>\r\n\t<div class=\"message-container\" data-bind=\"visible: hasWaitMessage\">\r\n\t\t<div class=\"message\" data-bind=\"text: waitMessage\"></div>\r\n\t</div>\r\n</div>"
		}
	);
}
