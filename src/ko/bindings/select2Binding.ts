import { BaseBinding } from "./../core/baseBinding"

export class Select2Binding extends BaseBinding {
	private selectedValue: any;
	private config: any;

	constructor() {
		super();

		this.selectedValue = null;
		this.config = {};
	}

	init(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor?: KnockoutAllBindingsAccessor) {
		const $element = $(element);

		let selectedValue = valueAccessor();
		this.proccessAllBindings($element, allBindingsAccessor() || {});

		ko.utils.domNodeDisposal.addDisposeCallback(element, () => { $element.select2("destroy"); });

		$element.on("change", () => this.updateValue($element, selectedValue));

		const autocomplete = this.config.autocomplete || false;

		if (!autocomplete) {
			$element.addClass("disable-autocomplete");
		}

		const select2Options = {
			data: this.config.data,
			allowClear: this.config.allowClear,
			placeholder: this.config.placeholder,
			autocomplete: autocomplete,
			tags: this.config.tags,
			theme: this.config.theme,
			language: this.config.lang ? this.config.lang : "en",
			width: this.config.width,
			dropdownAutoWidth: true,
			sorter: this.sort.bind(this, $element)
		} as Select2Options;
		const select2 = $element.select2(select2Options).data("select2");

		resolveKeyPressIssue(select2);
	}

	update(element: HTMLElement, valueAccessor: () => any) {
		const $element = $(element);
		const value = this.unwrap(valueAccessor());
		if (this.config.multiple) {
			this.updateMultipleElementValue($element, value);
			return;
		}
		this.updateSingleElementValue($element, value);
	}

	updateValue($element: JQuery, selectedValue: any) {
		if (this.config.multiple) {
			return this.updateMultipleValue($element, selectedValue);
		}
		this.updateSingleValue($element, selectedValue);
	}

	updateSingleValue($element: JQuery, selectedValue: any) {
		const val = $element.val();
		if (val === this.selectedValue) return;

		let value = $element.select2("data");
		if (!value) {
			selectedValue(null);
			return;
		} else if (value.length && value.length > 0) {
			value = value[0];
		}
		selectedValue(value.val);
	}

	updateMultipleValue($element: JQuery, selectedValue: any) {
		const val = $element.val();
		if (val == null && selectedValue != null) {
			selectedValue(null);
			return;
		}
		if (val == null || val.join() == this.selectedValue) return;

		const value = $element.select2("data");
		selectedValue(value.map(v => v.val));
	}

	updateSingleElementValue($element: JQuery, value: any) {
		const selectedValue = getValue(value, this.config.optionsValue);
		const selected = selectedValue == "undefined" ? null : selectedValue;
		const val = $element.val();
		this.selectedValue = selected;

		if (selected === val) return;

		$element.val(selected).trigger("change");
	}

	updateMultipleElementValue($element: JQuery, value: any) {
		const val = $element.val();
		if (!value) {
			this.selectedValue = null;

			if (val == null) return;
			$element.val(null).trigger("change");
			return;
		}
		var optionsValue = this.config.optionsValue;
		const values = value.map(o => getValue(o, optionsValue));
		this.selectedValue = values.join();

		if (val != null && val.join() == this.selectedValue) return;
		$element.val(values).trigger("change");
	}

	getData(value: any, optionsText: string, optionsValue: string) {
		if (!value) return [];

		return value.map(o => ({ text: getText(o, optionsText), id: getValue(o, optionsValue), val: o }));
	}

	proccessAllBindings($element: JQuery, allBindings: any) {
		var config: any = this.config = {};
		const options = this.unwrap(allBindings.selections);
		config.allowClear = this.unwrap(allBindings.allowClear) || false;
		config.placeholder = this.unwrap(allBindings.placeholder) || "";
		config.optionsText = this.unwrap(allBindings.selectionsText) || "text";
		config.optionsValue = this.unwrap(allBindings.selectionsValue) || "id";
		config.data = getData(options, config.optionsText, config.optionsValue);
		config.allowClear = this.unwrap(allBindings.allowClear) || false;
		config.autocomplete = this.unwrap(allBindings.autocomplete) || false;
		config.multiple = config.tags = this.unwrap(allBindings.multiple) || false;
		config.width = this.unwrap(allBindings.width) || "resolve";
		config.theme = (this.unwrap(allBindings.theme) || "app") + (!config.autocomplete ? " disable-autocomplete" : "");

		if (ko.isObservable(allBindings.placeholder)) {
			allBindings.placeholder.subscribe(value => {
				config.placeholder = value || "";
				$element.attr("data-placeholder", config.placeholder);
			});
		}

		if (ko.isObservable(allBindings.selections)) {
			allBindings.selections.subscribe(value => {
				//todo: not documented way. should be rewritr when document will appear.
				config.data = getData(value, config.optionsText, config.optionsValue);
				const select2 = $element.html("")
					.select2({
						data: config.data,
						allowClear: config.allowClear,
						placeholder: config.placeholder,
						tags: config.tags,
						width: config.width,
						dropdownAutoWidth: true,
						theme: config.theme,
						language: config.lang ? config.lang : "en",
						sorter: this.sort.bind(this, $element)
					})
					.data("select2");
				$element.val(null).trigger("change");

				resolveKeyPressIssue(select2);
			});
		}
	}

	sort($element: JQuery, data: any) {
		const select2 = $element.data("select2");
		var searchInput = select2.$dropdown.find(".select2-search__field").val() || "";
		if (!searchInput) return data;

		searchInput = searchInput.toLowerCase();
		data.sort((a, b) => {
			const aa = a.text.toLowerCase();
			const bb = b.text.toLowerCase();

			const aStartsWith = aa.indexOf(searchInput) === 0;
			const bStartsWith = bb.indexOf(searchInput) === 0;

			if (aa == bb) return 0;

			if ((aStartsWith && !bStartsWith) || (aa < bb && bStartsWith === aStartsWith)) {
				return -1;
			}
			return 1;
		});
		return data;
	}
}

function getData(value: any, optionsText: string, optionsValue: string) {
	return value.map(o => ({ text: getText(o, optionsText), id: getValue(o, optionsValue), val: o }));
}

function getValue(item: any, valueProperty: string): any {
	if (item == null || item == "undefined") return item;

	let value = item[valueProperty || "id"];
	value = (ko.isObservable(value)) ? value() : value;
	return value == null ? -1001 : value;
}

function getText(item: any, textProperty: string): string {
	const text = item[textProperty || "text"];
	return (ko.isObservable(text)) ? text() : text;
}

function resolveKeyPressIssue(select2: any) {
	select2.selection.on("keypress",
		evt => {
			const key = evt.which;

			if (evt.altKey || (key !== 40 && key !== 38)) return;

			if (!select2.isOpen()) {
				select2.open();
				evt.preventDefault();
			}
		});
}

BaseBinding.registerStateful("select2", Select2Binding);