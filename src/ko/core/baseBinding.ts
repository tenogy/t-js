export abstract class BaseBinding {

	init(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor?: KnockoutAllBindingsAccessor, viewModel?: any, bindingContext?: KnockoutBindingContext) {
		
	}

	update(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor?: KnockoutAllBindingsAccessor, viewModel?: any, bindingContext?: KnockoutBindingContext) {
		
	}

	preprocess(value: string, name: string, addBindingCallback?: (name: string, value: string) => void) : string {
		return value;
	}

	protected unwrap(value: any) {
		if (value == null) return null;
		return ko.utils.unwrapObservable(value);
	}

	static register<T extends BaseBinding>(bindingName: string, bindingType: { new (): T; }, supportsVirtualElements?: boolean) {
		// ReSharper disable once InconsistentNaming
		ko.bindingHandlers[bindingName] = new bindingType();
		if (supportsVirtualElements) {
			ko.virtualElements.allowedBindings[bindingName] = true;
		}
	}

	static registerStateful<T extends BaseBinding>(bindingName: string, bindingType: { new (): T; }, supportsVirtualElements?: boolean) {
		// ReSharper disable once InconsistentNaming
		var typeInstance = new bindingType();
		ko.bindingHandlers[bindingName] = {
			init: (element: HTMLElement, valueAccessor: () => any, allBindingsAccessor?: KnockoutAllBindingsAccessor, viewModel?: any, bindingContext?: KnockoutBindingContext) =>
				typeInstance.init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext),
			update: (element: HTMLElement, valueAccessor: () => any, allBindingsAccessor?: KnockoutAllBindingsAccessor, viewModel?: any, bindingContext?: KnockoutBindingContext) =>
				typeInstance.update(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext),
			preprocess: (value: string, name: string, addBindingCallback?: (name: string, value: string) => void) =>
				typeInstance.preprocess(value, name, addBindingCallback)
		};
		if (supportsVirtualElements) {
			ko.virtualElements.allowedBindings[bindingName] = true;
		}
	}
}