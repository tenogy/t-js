import {SortDirection} from "./sort";

export class SortRule {
	constructor(type?: any, direction?: SortDirection) {
		this.type = ko.observable(type || null);
		this.direction = ko.observable(direction || SortDirection.asc);
	}

	subscribe(handler: any, context: any) {
		var components = [this.type, this.direction];
		var changes = Rx.Observable.create(observer => {
			for (var component of components) {
				component.subscribe((v) => { observer.onNext(v); }, null, null);
			}
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
