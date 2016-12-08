import {BaseBinding} from "./../core/baseBinding"

export class EnterBinding extends BaseBinding {
	init(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor?: KnockoutAllBindingsAccessor, viewModel?: any, bindingContext?: KnockoutBindingContext) {
		$(element).keypress((event: any) => {
			var code = event.keyCode || event.which;
			if (code !== 13) return;
			var handler = super.unwrap(valueAccessor());
			handler.call(viewModel);
			event.preventDefault();
		});
	}
}

BaseBinding.register("enter", EnterBinding, true);
