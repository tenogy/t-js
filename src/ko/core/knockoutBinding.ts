import {BaseBinding} from "./baseBinding"

export abstract class KnockoutBinding extends BaseBinding {
	constructor(bindingHandlerName: string) {
		super();
		this.bindingHandler = ko.bindingHandlers[bindingHandlerName];
	}

	init(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor?: KnockoutAllBindingsAccessor, viewModel?: any, bindingContext?: KnockoutBindingContext) {
		if (this.bindingHandler.init) {
			this.bindingHandler.init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
		}
	}

	update(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor?: KnockoutAllBindingsAccessor, viewModel?: any, bindingContext?: KnockoutBindingContext) {
		if (this.bindingHandler.update) {
			this.bindingHandler.update(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
		}
	}

	bindingHandler: KnockoutBindingHandler;
}