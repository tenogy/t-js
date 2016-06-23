declare module "utils" {
    export class Utils {
        static uuid(): string;
        static pluralize(count: number, word: string): string;
        static store(namespace: string, data?: string): any;
        static extend(...objs: any[]): any;
    }
}
declare module "ajax" {
    export class AjaxService {
        private config;
        constructor(config: any);
        execute(): void;
        runCallback(data: any, textStatus: any, jqxhr: any): void;
        success(data: any, textStatus: any, jqxhr: any): void;
        failure(jqxhr: any, textStatus: any): void;
        abort(): void;
        loading: boolean;
        jqxhr: any;
    }
    export function ajax(config: any): AjaxService;
    export class AjaxServices {
        constructor(serviceEndpoints: string[]);
    }
}
declare module "ko/ko-utils" {
    export function computed(target: any, propertyKey: string, descriptor: PropertyDescriptor): any;
    export function registerComputed(target: any): any;
}
declare module "ko/core/baseBinding" {
    export abstract class BaseBinding {
        init(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor?: KnockoutAllBindingsAccessor, viewModel?: any, bindingContext?: KnockoutBindingContext): void;
        update(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor?: KnockoutAllBindingsAccessor, viewModel?: any, bindingContext?: KnockoutBindingContext): void;
        preprocess(value: string, name: string, addBindingCallback?: (name: string, value: string) => void): string;
        protected unwrap(value: any): any;
        static register<T extends BaseBinding>(bindingName: string, bindingType: {
            new (): T;
        }, supportsVirtualElements?: boolean): void;
    }
}
declare module "ko/bindings/aliasBinding" {
    import { BaseBinding } from "ko/core/baseBinding";
    export class AliasBinding extends BaseBinding {
        update(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor?: KnockoutAllBindingsAccessor, viewModel?: any, bindingContext?: any): void;
    }
}
declare module "ko/bindings/enterBinding" {
    import { BaseBinding } from "ko/core/baseBinding";
    export class EnterBinding extends BaseBinding {
        init(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor?: KnockoutAllBindingsAccessor, viewModel?: any, bindingContext?: KnockoutBindingContext): void;
    }
}
declare module "ko/bindings/alertPanelBinding" {
    import { BaseBinding } from "ko/core/baseBinding";
    export class AlertPanelBinding extends BaseBinding {
        init(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor?: KnockoutAllBindingsAccessor, viewModel?: any, bindingContext?: KnockoutBindingContext): {
            controlsDescendantBindings: boolean;
        };
    }
}
declare module "ko/bindings/spinBinding" {
    import { BaseBinding } from "ko/core/baseBinding";
    export class SpinBinding extends BaseBinding {
        update(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor?: KnockoutAllBindingsAccessor, viewModel?: any, bindingContext?: KnockoutBindingContext): void;
    }
}
declare module "ko/alert" {
    export class AlertMessage {
        private type;
        private shown;
        private caption;
        private message;
        constructor(message?: string, caption?: string, shown?: boolean, type?: string);
        typeClass(): string;
        hide(): void;
        show(message: string, caption: string, type: string): void;
        showError(message: string, caption: string): void;
    }
}
declare module "ko/loadingProgress" {
    export class LoadingProgress {
        private options;
        constructor(options?: {
            delay: number;
            noWaitMessage: string;
            waitMessage: string;
        });
        isVisible(): boolean;
        start(): void;
        stop(): void;
        running(): boolean;
        hasWaitMessage(): boolean;
        waitMessage(): string;
        loading: KnockoutObservable<boolean>;
        loadingDelayed: KnockoutObservable<boolean>;
    }
}
declare module "lists/sort" {
    export enum SortDirection {
        asc = 1,
        desc = 2,
    }
}
declare module "lists/sortBinding" {
    import { BaseBinding } from "ko/core/baseBinding";
    export class SortBinding extends BaseBinding {
        init(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor?: KnockoutAllBindingsAccessor, viewModel?: any, bindingContext?: KnockoutBindingContext): {
            controlsDescendantBindings: boolean;
        };
        update(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor?: KnockoutAllBindingsAccessor, viewModel?: any, bindingContext?: KnockoutBindingContext): void;
    }
}
declare module "lists/sortRule" {
    import { SortDirection } from "lists/sort";
    export class SortRule {
        constructor(type?: any, direction?: SortDirection);
        subscribe(handler: any, context: any): void;
        toModel(options: any): {
            Type: any;
            Direction: any;
        };
        type: KnockoutObservable<any>;
        direction: KnockoutObservable<SortDirection>;
    }
}
declare module "lists/listPaging" {
    export class ListPaging {
        constructor(paging: any, gotoPageHandler: any);
        needShow(): boolean;
        gotoPage(page: any): void;
        paging: any;
        gotoPageHandler: any;
    }
}
declare module "lists/listWithServerHtml" {
    export class ListWithServerHtml {
        constructor(items?: any, html?: string, paging?: any, options?: any);
        items: KnockoutObservable<any>;
        itemsHtml: KnockoutObservable<string>;
        paging: KnockoutObservable<any>;
        gotoPageHandler: any;
    }
}
declare module "tenogy" {
    export * from "utils";
    export * from "ajax";
    export * from "ko/ko-utils";
    export * from "ko/core/baseBinding";
    export * from "ko/bindings/aliasBinding";
    export * from "ko/bindings/enterBinding";
    export * from "ko/bindings/alertPanelBinding";
    export * from "ko/bindings/spinBinding";
    export * from "ko/alert";
    export * from "ko/loadingProgress";
    export * from "lists/sort";
    export * from "lists/sortBinding";
    export * from "lists/sortRule";
    export * from "lists/listPaging";
    export * from "lists/listWithServerHtml";
}
