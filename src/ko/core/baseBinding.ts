import * as ko from "knockout";

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
}