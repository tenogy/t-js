import {BaseBinding} from "./../core/baseBinding"
import {Utils} from "./../../utils"

export class FileUploadBinding extends BaseBinding {
	init(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor?: KnockoutAllBindingsAccessor, viewModel?: any, bindingContext?: KnockoutBindingContext) {
		var callbackDone = valueAccessor();
		var allBindings = allBindingsAccessor();
		var uploading = allBindings.uploading;
		var options: any = {};
		options.url = allBindings.url || "ru";
		options.maxFileSize = allBindings.maxFileSize || 5;
		options.acceptFileTypes = allBindings.acceptFileTypes || "";
		options.done = (e, data) => {
				if (uploading) {
					uploading(false);
				}
				callbackDone(data);
			},

			(<any>$(element)).fileupload(options).on("change", () => {
				if (uploading) {
					uploading(true);
				}
			});
	}
}

BaseBinding.register("fileupload", FileUploadBinding);