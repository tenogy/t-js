/// <reference path="../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../node_modules/@types/knockout/index.d.ts" />
/// <reference path="../node_modules/@types/rx/index.d.ts" />
/// <reference path="../node_modules/@types/spin/index.d.ts" />
declare module "src/utils" {
    export class Utils {
        static uuid(): string;
        static pluralize(count: number, word: string): string;
        static store(namespace: string, data?: string): any;
        static extend(...objs: any[]): any;
    }
}
declare module "src/ajax" {
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
declare module "src/dateUtils" {
    export function dateFromModel(dateModel: any): Date;
    export function dateTimeFromModel(dateModel: any): Date;
    export function dateToModel(date: any): {
        Year: any;
        Month: any;
        Day: any;
    };
    export function dateTimeToModel(date: any): {
        Year: any;
        Month: any;
        Day: any;
        Hour: any;
        Minute: any;
        Second: any;
        Millisecond: any;
    };
    export function formatDate(date: any): any;
    export function formatDateTime(date: any): string;
    export function padZeros(num: any, size: any): string;
}
declare module "src/ko/ko-utils" {
    export function computed(target: any, propertyKey: string, descriptor: PropertyDescriptor): any;
    export function registerComputed(target: any): any;
}
declare module "src/ko/core/baseBinding" {
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
declare module "src/ko/bindings/aliasBinding" {
    import { BaseBinding } from "src/ko/core/baseBinding";
    export class AliasBinding extends BaseBinding {
        update(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor?: KnockoutAllBindingsAccessor, viewModel?: any, bindingContext?: any): void;
    }
}
declare module "src/ko/bindings/enterBinding" {
    import { BaseBinding } from "src/ko/core/baseBinding";
    export class EnterBinding extends BaseBinding {
        init(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor?: KnockoutAllBindingsAccessor, viewModel?: any, bindingContext?: KnockoutBindingContext): void;
    }
}
declare module "src/ko/bindings/alertPanelBinding" {
    import { BaseBinding } from "src/ko/core/baseBinding";
    export class AlertPanelBinding extends BaseBinding {
        init(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor?: KnockoutAllBindingsAccessor, viewModel?: any, bindingContext?: KnockoutBindingContext): {
            controlsDescendantBindings: boolean;
        };
    }
}
declare module "src/ko/bindings/spinBinding" {
    import { BaseBinding } from "src/ko/core/baseBinding";
    export class SpinBinding extends BaseBinding {
        update(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor?: KnockoutAllBindingsAccessor, viewModel?: any, bindingContext?: KnockoutBindingContext): void;
    }
}
declare module "src/ko/alert" {
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
declare module "src/ko/loadingProgress" {
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
declare module "src/lists/sort" {
    export enum SortDirection {
        asc = 1,
        desc = 2,
    }
}
declare module "src/lists/sortBinding" {
    import { BaseBinding } from "src/ko/core/baseBinding";
    export class SortBinding extends BaseBinding {
        init(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor?: KnockoutAllBindingsAccessor, viewModel?: any, bindingContext?: KnockoutBindingContext): {
            controlsDescendantBindings: boolean;
        };
        update(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor?: KnockoutAllBindingsAccessor, viewModel?: any, bindingContext?: KnockoutBindingContext): void;
    }
}
declare module "src/lists/sortRule" {
    import { SortDirection } from "src/lists/sort";
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
declare module "src/lists/listPaging" {
    export class ListPaging {
        constructor(paging: any, gotoPageHandler: any);
        needShow(): boolean;
        gotoPage(page: any): void;
        paging: any;
        gotoPageHandler: any;
    }
}
declare module "src/lists/listWithServerHtml" {
    export class ListWithServerHtml {
        constructor(items?: any, html?: string, paging?: any, options?: any);
        items: KnockoutObservable<any>;
        itemsHtml: KnockoutObservable<string>;
        paging: KnockoutObservable<any>;
        gotoPageHandler: any;
    }
}
declare module "src/tenogy" {
    export * from "src/utils";
    export * from "src/ajax";
    export * from "src/dateUtils";
    export * from "src/ko/ko-utils";
    export * from "src/ko/core/baseBinding";
    export * from "src/ko/bindings/aliasBinding";
    export * from "src/ko/bindings/enterBinding";
    export * from "src/ko/bindings/alertPanelBinding";
    export * from "src/ko/bindings/spinBinding";
    export * from "src/ko/alert";
    export * from "src/ko/loadingProgress";
    export * from "src/lists/sort";
    export * from "src/lists/sortBinding";
    export * from "src/lists/sortRule";
    export * from "src/lists/listPaging";
    export * from "src/lists/listWithServerHtml";
}
