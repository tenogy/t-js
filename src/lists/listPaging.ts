import * as ko from "knockout";
import {computed, registerComputed} from "./../ko/ko-utils";

@registerComputed
export class ListPaging {
	constructor(paging: any, gotoPageHandler: any) {
		this.paging = ko.isObservable(paging) ?
			ko.computed(function () { return normalizePaging.call(this, paging() || []); }, this) :
			normalizePaging.call(this, paging || []);

		if (!ko.isObservable(this.paging)) this.paging = ko.observable(this.paging);

		this.gotoPageHandler = gotoPageHandler;
	}

	@computed
	needShow() {
		return this.paging().length > 1;
	}

	gotoPage(page: any) {
		if (page.active) return;
		if (this.gotoPageHandler == null) {
			throw "gotoPageHandler is not specified for the paging.";
		}
		this.gotoPageHandler(page.index);
	}

	paging: any;
	gotoPageHandler: any;
}

function normalizePaging(pagingItems: any) {
	return pagingItems.map((page: any) => ({
		index: page.index || page.Index,
		caption: page.caption || page.Caption,
		active: page.active || page.Active
	}));
};


if (!ko.components.isRegistered("list-paging")) {
	ko.components.register(
		"list-paging",
		{
			viewModel: { createViewModel(params) { return new ListPaging(params.paging, params.gotoPageHandler); } },
			template: "<div class=\"list-paging\" data-bind=\"visible: needShow, foreach: paging\">\r\n\t<a href=\"#\" class=\"btn\" data-bind=\"text: caption, click: $parent.gotoPage.bind($parent, $data), css: {'btn-primary': active, 'btn-default': !active}\"></a>\r\n</div>\r\n"
		}
	);
}
