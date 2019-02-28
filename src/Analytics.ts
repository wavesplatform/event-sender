///<reference path="../interface.d.ts"/>
import { Bus, WindowAdapter } from '@waves/waves-browser-bus';


class Analytics {

    private events: Array<AnalyticsTypes.IEventData> = [];
    private apiList: Array<AnalyticsTypes.IApiData> = [];
    private createBusPromise: Promise<Bus<AnalyticsTypes.IEvents>> | undefined = void 0;


    constructor() {
        if (Analytics.instance) {
            return Analytics.instance;
        }
        Analytics.instance = this;
    }

    public activate(url: string): void {
        if (this.createBusPromise) {
            return void 0;
        }

        this.createBusPromise = this._createBus(url);
        this.createBusPromise.then(bus => {
            this.apiList.forEach(adapter => {
                bus.dispatchEvent('add-adapter', adapter);
            });
            this.apiList = [];
            this.events.forEach(event => {
                bus.dispatchEvent('event', event);
            });
            this.events = [];
        });
    }

    public addApi(data: AnalyticsTypes.IApiData): void {
        if (this.createBusPromise) {
            this.createBusPromise.then(Analytics.dispatch('add-adapter', data));
        } else {
            this.apiList.push(data);
        }
    }

    public send(data: AnalyticsTypes.IEventData): void {
        if (this.createBusPromise) {
            this.createBusPromise.then(Analytics.dispatch('event', data));
        } else {
            this.events.push(data);
        }
    }

    private static dispatch<K extends keyof AnalyticsTypes.IEvents>(event: K, data: AnalyticsTypes.IEvents[K]): (bus: Bus<AnalyticsTypes.IEvents>) => void {
        return bus => bus.dispatchEvent(event, data);
    }

    private _createBus(url: string): Promise<Bus<AnalyticsTypes.IEvents>> {

        const iframe = document.createElement('iframe');
        const promise = WindowAdapter.createSimpleWindowAdapter(iframe)
            .then(adapter => new Bus(adapter));

        iframe.src = url;
        iframe.classList.add('analytics-sandbox-iframe');
        Analytics.addStyles(iframe, {
            width: '10px',
            height: '10px',
            position: 'fixed',
            left: '0',
            top: '0',
            transform: 'translate(-110%, -110%)'
        });
        document.body.appendChild(iframe);

        return promise;
    }


    private static addStyles(element: HTMLElement, styles: Partial<TCSSStyleDeclarationProps>): void {
        this.entries(styles).forEach(([name, value]) => {
            if (value) {
                element.style[name] = value;
            }
        });
    }

    private static entries<T extends Record<keyof any, any>>(item: T): Array<[keyof T, T[keyof T]]> {
        return Object.entries(item) as Array<[keyof T, T[keyof T]]>;
    }

    private static instance: Analytics | undefined;

}

type TIfEquals<A, B, TRUE = A, FALSE = never> =
    (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? TRUE : FALSE;
type TReadonlyKeys<T> = {
    [P in keyof T]-?: TIfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, never, P>
}[keyof T];
type TWithout<P, K extends keyof P> = Pick<P, Exclude<keyof P, K>>;
type TNumberKeys<T extends Record<keyof any, any>> = { [K in keyof T]: K extends number ? K : never }[keyof T]
type TMethods<T extends Record<keyof any, any>> = { [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never }[keyof T]
type TCSSStyleDeclarationProps = TWithout<CSSStyleDeclaration, TNumberKeys<CSSStyleDeclaration> | TMethods<CSSStyleDeclaration> | TReadonlyKeys<CSSStyleDeclaration>>


export = new Analytics();

