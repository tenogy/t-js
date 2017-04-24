import { BaseBinding } from "./../core/baseBinding";
import * as u from "./../../utils";

export class BootstrapModal {
	shown: KnockoutObservable<boolean>;

	constructor() {
		this.shown = ko.observable(false);
	}

	show(model) {
		if (!model.$modal) {
			model.$modal = { close: () => this.close() }
		}
		this.shown(model as boolean);
	}

	close() {
		this.shown(false);
	}
};

export class BootstrapModalBinding extends BaseBinding {
	init(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor?: KnockoutAllBindingsAccessor, viewModel?: any, bindingContext?: KnockoutBindingContext) {
		var $element:any = $(element);
		var config = super.unwrap(valueAccessor());
		var controller = config.controller;
		var options:any = { show: false, backdrop: false, keyboard: false };
		if (controller) {
		
			options = { ...options, ...config.options};
		}
		else {
			controller = config;
		}

		if (options.zindex) {
			$element.css("z-index", parseInt(options.zindex) + 1);
		}

		if (config.html) {
			$element.html(config.html);
		}
		$element.modal(options);

		var context = {
			isBound: false,
			viewModel: ko.observable(null)
		};

		controller.shown.subscribe(value => {
			$element.modal(value ? "show" : "hide");
			if (value) {
				if (options.zindex) {
					$(".modal-backdrop").last().css("z-index", options.zindex);
				}

				context.viewModel(value);
				if (!context.isBound) {
					var bindingContextExtension = {
						$modal: {
							close() { controller.shown(null); }
						}
					};
					var bindingContext = new (ko as any).bindingContext(context.viewModel, null, null, ctx => { ko.utils.extend(ctx, bindingContextExtension); });
					ko.applyBindingsToDescendants(bindingContext, element);
					context.isBound = true;
				}
			}
		});

		$(element).on('hidden.bs.modal', () => {
			controller.shown(null);
		});

		return { controlsDescendantBindings: true };
	}
}

BaseBinding.register("bootstrapModal", BootstrapModalBinding, true);
