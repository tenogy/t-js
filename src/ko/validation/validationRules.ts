const kov = ko["validation"],
	addRule = kov.addRule;

kov.addRule = function (observable, rule) {
	var ruleInitialize = rule.rule == null ? null : kov.rules[rule.rule].initialize;
	if (ruleInitialize) {
		ruleInitialize(observable, rule);
	}

	return addRule.call(this, observable, rule);
};

kov.rules["confirmPassword"] = {
	validator(val, params) {
		return val === kov.utils.getValue(params);
	},
	message: "Passwords do not match."
};

kov.rules["phone"] = {
	validator(phoneNumber, validate: boolean): boolean {
		if (typeof (phoneNumber) !== "string") { return false; }
		return validate && /^\d[\d -]*\d$/.test(phoneNumber);
	},
	message: "Please specify a valid phone number"
};

kov.registerExtenders();

export function registerValidationRule(name: string, options) {
	kov.rules[name] = options;

	kov.registerExtenders();
}


