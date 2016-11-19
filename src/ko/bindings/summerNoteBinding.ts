import {BaseBinding} from "./../core/baseBinding";

export class SummernoteBinding extends BaseBinding {
	init(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor?: KnockoutAllBindingsAccessor, viewModel?: any, bindingContext?: KnockoutBindingContext) {
		var value = valueAccessor();
		var missingPhrases = ["<p><br></p>", "<p>&nbsp;</p>"];
		var options = {
			height: super.unwrap(allBindingsAccessor.get("height")) || 100,
			callbacks: {
				onChange: content => {
					ko.utils.domData.set(element, "_updating", true);
					value(missingPhrases.indexOf(content) > -1 ? null : content);
					$(element).val(content);
					ko.utils.domData.set(element, "_updating", false);
				}
			}
		};
		(<any>$(element)).summernote(options);
	}
	update(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor?: KnockoutAllBindingsAccessor, viewModel?: any, bindingContext?: KnockoutBindingContext) {
		var value = super.unwrap(valueAccessor());
		var updating = ko.utils.domData.get(element, "_updating");
		if (value && !updating) {
			(<any>$(element)).summernote("code", value);
		}
	}
}

BaseBinding.register("summernote", SummernoteBinding);