export class ListWithServerHtml {
	constructor(items?: any, html?: string, paging?: any, options?: any) {
		options = options || {};
		this.items = ko.observable(items || []);
		this.itemsHtml = ko.observable(html || "");
		this.paging = ko.observable(paging || []);
		this.gotoPageHandler = options.gotoPageHandler;
	}

	items: KnockoutObservable<any>;
	itemsHtml: KnockoutObservable<string>;
	paging: KnockoutObservable<any>;
	gotoPageHandler: any;
}


if (!ko.components.isRegistered("list-with-server-html")) {
	ko.components.register(
		"list-with-server-html",
		{
			viewModel: {
				createViewModel(params) {
					return ko.isObservable(params.list) ?
						ko.pureComputed(() => (params.list() || new ListWithServerHtml()), null) :
						params.list || new ListWithServerHtml();
				}
			},
			template: "<!-- ko with: items -->\r\n<div class=\"list-items\" data-bind=\"htmlStateful: $parent.itemsHtml\"></div>\r\n<!-- /ko -->\r\n<list-paging params=\"paging: paging, gotoPageHandler: gotoPageHandler\"></list-paging>\r\n"
		}
	);
}
