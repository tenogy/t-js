import {KnockoutBinding} from "./../core/knockoutBinding"

export class HtmlStatefulBindings extends KnockoutBinding {
	constructor() { super("html"); }
}

KnockoutBinding.registerStateful("htmlStateful", HtmlStatefulBindings);
