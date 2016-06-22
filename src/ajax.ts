import * as $ from "jquery";

export class AjaxService {
	constructor(private config: any) {
		this.loading = false;
	}

	execute() {
		this.loading = true;

		var options = {
			url: this.config.url,
			type: "POST",
			data: this.config.data,
			contentType: <string>null,
			dataType: <string>null,
			headers: { RequestVerificationToken: <string>null }
		};
		if (this.config.json) {
			options.contentType = "application/json";
			options.data = JSON.stringify(this.config.data);
			options.dataType = "json";
		}
		this.jqxhr = $.ajax(options).done($.proxy(this.success, this)).fail($.proxy(this.failure, this));
	}

	runCallback(data: any, textStatus: any, jqxhr: any) {
		if (this.config.callback) {
			var scope = this.config.scope || this;
			this.config.callback.apply(scope, arguments);
		}
		this.loading = false;
	}

	success(data: any, textStatus: any, jqxhr: any) {
		if (data.redirect && !this.config.ignoreRedirect) {
			window.location = data.redirect;
			return;
		}
		this.runCallback(data, textStatus, jqxhr);
	}

	failure(jqxhr: any, textStatus: any) {
		this.runCallback(null, textStatus, jqxhr);
	}

	abort() {
		if (!this.loading) return;

		try {
			this.jqxhr.abort();
		}
		catch (e) { }
	}

	loading: boolean;
	jqxhr: any;
}

export function ajax(config: any) {
	var service = new AjaxService(config);
	service.execute();
	return service;
}

export class AjaxServices {
	constructor(serviceEndpoints: string[]) {
		var target = <any>this;
		for (var endpointName in serviceEndpoints) {
			target[endpointName] = createServiceMethod(serviceEndpoints[endpointName]);
		}
	}
}

function createServiceMethod(endpoint: string) {
	return (parameters: any, callback: any, context: any) => {
		if (context != null) {
			callback = callback.bind(context);
		}
		return ajax({ url: endpoint, json: true, data: parameters, callback: callback });
	};
}