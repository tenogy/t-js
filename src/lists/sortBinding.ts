import {BaseBinding} from "./../ko/core/baseBinding";
import {SortDirection} from "./sort";

export class SortBinding extends BaseBinding {
	init(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor?: KnockoutAllBindingsAccessor, viewModel?: any, bindingContext?: KnockoutBindingContext) {
		var $element = $(element);
		var $controller = $element;

		var options = allBindingsAccessor();

		var sortType = options.sortType;

		var controllerElementSelector = options.parentController;
		if (controllerElementSelector != null) {
			$controller = $element.parent(controllerElementSelector);
		}

		var sortRule = super.unwrap(valueAccessor());
		var vm = ko.observable(sortRule);
		ko.utils.domData.set(element, "vm", vm);

		$controller.addClass("sort");

		function sortRuleChanged() {
			var sr = vm();
			$controller.removeClass("sort-none sort-asc sort-desc");
			var direction = sr.direction();
			var newClass: string;
			if (sr.type() === sortType)
				newClass = direction === SortDirection.asc ? "sort-asc" : (direction === SortDirection.desc ? "sort-desc" : "sort-none");
			else
				newClass = "sort-none";
			$controller.addClass(newClass);
		}

		function clickHandler() {
			var sr = vm();
			var direction = sr.direction();
			var newDirection: SortDirection;
			if (sr.type() === sortType) {
				newDirection = direction === SortDirection.asc ? SortDirection.desc : SortDirection.asc;
			}
			else {
				newDirection = SortDirection.asc;
				sr.type(sortType);
			}
			sr.direction(newDirection);
		}

		function viewModelChanged(sr: any) {
			if (sr == null) return;
			sr.subscribe(sortRuleChanged);
			$controller.unbind("click", clickHandler);
			$controller.click(clickHandler);
		}

		sortRule.subscribe(sortRuleChanged);
		vm.subscribe(viewModelChanged);

		$element.html("<div class=\"arrow-desc\"></div><div class=\"arrow-asc\"></div>");

		ko.applyBindingsToDescendants(vm, element);

		viewModelChanged(sortRule);
		sortRuleChanged();

		return { controlsDescendantBindings: true };
	}

	update(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor?: KnockoutAllBindingsAccessor, viewModel?: any, bindingContext?: KnockoutBindingContext) {
		var sortRule = super.unwrap(valueAccessor());
		var vm = ko.utils.domData.get(element, "vm");
		if (vm) {
			vm(sortRule);
		}
	}
}

BaseBinding.register("sort", SortBinding);