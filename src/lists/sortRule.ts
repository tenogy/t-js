import { SortDirection } from "./sort";
import { def, debounce } from "./../utils";

export class SortRule {
	constructor(type?: any, direction?: SortDirection) {
		this.type = ko.observable(def(type) ? type : null);
		this.direction = ko.observable(direction || SortDirection.asc);
	}

	subscribe(handler: any, context?: any) {
		const handle = debounce(() => handler.call(context || this), 10);

		this.type.subscribe(handle);
		this.direction.subscribe(handle);
	}

	toModel(options: any) {
		var type = this.type();
		var direction = this.direction();
		return {
			Type: type == null ? options.defaultType : type,
			Direction: direction == null ? options.defaultDirection : direction
		};
	}

	type: KnockoutObservable<any>;
	direction: KnockoutObservable<SortDirection>;
}
