import * as ko from "knockout";
const markTemplate = "$ko$computed";

export function computed(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
	var method = target[propertyKey];
	var mark = { name: propertyKey, read: method };
	method[markTemplate] = mark;
	return method;
}

export function registerComputed(target: any) {
	var original = target;
	var constructor: any = function (...args: any[]) {
		registerComputedMethods(this);
		return original.apply(this, args);
	}

	constructor.prototype = original.prototype;
	return constructor;
}


function registerComputedMethods(target: any) {
	var dependentObservables = <any>{};
	for (var memberName in target) {
		var member = target[memberName];
		if (!(member instanceof Function)) continue;

		var computedMember = member[markTemplate];
		if (computedMember == undefined) continue;

		if (computedMember.name == null) computedMember.name = memberName;

		var registeredDependentObservable = dependentObservables[computedMember.name];
		if (registeredDependentObservable == null) {
			dependentObservables[computedMember.name] = computedMember;
		} else {
			if (computedMember.read != null) {
				registeredDependentObservable.read = computedMember.read;
			}
			if (computedMember.write != null) {
				registeredDependentObservable.write = computedMember.write;
			}
		}
	}
	var orderedDependentObservables = <any>[];
	for (var name in dependentObservables) {
		orderedDependentObservables.push(dependentObservables[name]);
	}
	orderedDependentObservables.sort((x: any, y: any) => (x.orderIndex - y.orderIndex));
	for (var i = 0; i < orderedDependentObservables.length; ++i) {
		var dependentObservable = orderedDependentObservables[i];
		if (dependentObservable.read == null) {
			throw "Computed observable '" + dependentObservable.name + "' is incorrectly defined.";
		}
		target[dependentObservable.name] = ko.pureComputed(dependentObservable.read, target);
		if (dependentObservable.extenders) {
			target[dependentObservable.name].extend(dependentObservable.extenders);
		}
	}
}
