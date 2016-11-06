export * from "./utils";
export * from "./ajax";
export * from "./dateUtils";

export * from "./ko/ko-utils";
export * from "./ko/core/baseBinding";
export * from "./ko/core/knockoutBinding";
export * from "./ko/bindings/aliasBinding";
export * from "./ko/bindings/enterBinding";
export * from "./ko/bindings/alertPanelBinding";
export * from "./ko/bindings/spinBinding";
export * from "./ko/bindings/summerNoteBinding";
export * from "./ko/bindings/fileUploadBinding";
export * from "./ko/bindings/htmlStatefulBinding";
export * from "./ko/bindings/select2Binding";

export * from "./ko/alert";
export * from "./ko/loadingProgress";

export * from "./lists/sort";
export * from "./lists/sortBinding";
export * from "./lists/sortRule";
export * from "./lists/listPaging";
export * from "./lists/listWithServerHtml";

export * from "./ko/validation/validationScope";

export function i(moduleName: string, exports: (m)=>void) {
	document.addEventListener("DOMContentLoaded", () => {
		exports(window["_app_"][moduleName]);
	});
}

export function applyBindings(model, query: string) {
	ko.applyBindings(model, document.querySelector(query));
}
