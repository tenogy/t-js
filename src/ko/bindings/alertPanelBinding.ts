import * as ko from "knockout";
import {BaseBinding} from "./../core/baseBinding"

export class AlertPanelBinding extends BaseBinding {
	init(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor?: KnockoutAllBindingsAccessor, viewModel?: any, bindingContext?: KnockoutBindingContext) {
		element.innerHTML = "<div class=\"alert\" data-bind=\"visible: shown, css: typeClass()\">" +
			"<button type=\"button\" class=\"close\" data-bind=\"click: hide\"><span>&times;</span></button>" +
			"<strong data-bind=\"text: caption\"></strong> " +
			"<span data-bind=\"text: message\"></span>" +
			"</div>";

		var alertMessage = super.unwrap(valueAccessor());
		ko.applyBindingsToDescendants(alertMessage, element);
		return { controlsDescendantBindings: true };
	}
}

BaseBinding.register("alertPanel", AlertPanelBinding);