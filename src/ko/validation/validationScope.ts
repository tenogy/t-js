import { computed, registerComputed } from "./../ko-utils";

@registerComputed
export class ValidationScope {
	validatables: KnockoutObservableArray<any>;
	errors: KnockoutObservableArray<any>;

	constructor(observables) {
		this.validatables = ko.observableArray([]);

		ko.utils.arrayForEach(observables, observable => {
			this.add(observable);
		});
		this.errors = ko.observableArray([]);
	}

	add(observable) {
		if (observable && !observable.nodeType) {
			if (!observable.isValid) {
				observable.extend({ validatable: true });
			}
			this.validatables.push(observable);
		};
	}

	@computed
	isValid() {
		var errors = [];
		ko.utils.arrayForEach(this.validatables(), observable => {
			if (!observable.isValid()) {
				errors.push(observable.error);
			}
		});
		this.errors(errors);
		return errors.length === 0;
	}

	showErrors() {
		ko.utils.arrayForEach(this.validatables(), observable => {
			observable.isModified(true);
		});
	}

	hideErrors() {
		ko.utils.arrayForEach(this.validatables(), observable => {
			observable.isModified(false);
		});
	}

	validate(showErrors) {
		var isValid = this.isValid();
		if (showErrors && !isValid) {
			this.showErrors();
		}
		return isValid;
	}
}