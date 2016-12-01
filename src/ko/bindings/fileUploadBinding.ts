import { BaseBinding } from "./../core/baseBinding";

export class FileUploadBinding extends BaseBinding {
	init(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor?: KnockoutAllBindingsAccessor, viewModel?: any, bindingContext?: KnockoutBindingContext) {
		var callbackDone = valueAccessor();
		var allBindings = allBindingsAccessor();
		var uploading = allBindings.uploading;
		var options: any = allBindings.options || {};
		options.dataType = options.dataType || "json";
		options.always = options.always || ((e, data) => {
			if (uploading) {
				uploading(false);
			}
			callbackDone(data && data.result);
		});
		options.start = options.start || (() => {
			if (uploading) {
				uploading(true);
			}
		});
		($(element) as any).fileupload(options);
	}
}

BaseBinding.register("fileupload", FileUploadBinding);