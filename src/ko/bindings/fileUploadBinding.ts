import { BaseBinding } from "./../core/baseBinding";

export class FileUploadBinding extends BaseBinding {
	init(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor?: KnockoutAllBindingsAccessor, viewModel?: any, bindingContext?: KnockoutBindingContext) {
		var callbackDone = valueAccessor();
		var allBindings = allBindingsAccessor();
		var uploading = allBindings.uploading;
		var options: any = allBindings.options || {};
		options.dataType = "json";
		options.done = (e, data) => {
			if (uploading) {
				uploading(false);
			}
			callbackDone(data && data.result);
		},

			(<any>$(element)).fileupload(options).on("change", () => {
				if (uploading) {
					uploading(true);
				}
			});
	}
}

BaseBinding.register("fileupload", FileUploadBinding);