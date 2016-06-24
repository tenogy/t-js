import {SortDirection} from "./sort";

export class SortRule {
	constructor(type?: any, direction?: SortDirection) {
		this.type = ko.observable(type || null);
		this.direction = ko.observable(direction || SortDirection.asc);
	}

	subscribe(handler: any, context: any) {
		var components = [this.type, this.direction];
		var changes = <any>Rx.Observable.create(function (observer) {
			(<any>components).foreach(function (component) {
				component.subscribe(() => { (<any>observer).onNext(); });
			});
		});
		changes.debounce(10).subscribe(handler, context);
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
