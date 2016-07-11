import {BaseBinding} from "./../core/baseBinding"

export class AliasBinding extends BaseBinding {
	update(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor?: KnockoutAllBindingsAccessor, viewModel?: any, bindingContext?: any) {
		var aliases = valueAccessor();
		if (!$.isArray(aliases)) {
			aliases = [aliases];
		}
		for (var alias of aliases) {
			if (alias.name == null || alias.name.length === 0) {
				throw "Alias name is not specified.";
			}
			if (alias.data == null) {
				throw "Data is not specified for the '" + alias.name + "' alias.";
			}
			bindingContext[alias.name] = alias.data;
		}
	}
}

BaseBinding.register("alias", AliasBinding, true);
