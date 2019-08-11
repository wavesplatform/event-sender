///<reference path="../interface.d.ts"/>

import { Bus, WindowAdapter } from '@bancoin/bancoin-browser-bus';
import { loadScript, hasScript, runByPath } from './utils';


WindowAdapter.createSimpleWindowAdapter().then(adapter => {
    const bus = new Bus<AnalyticsTypes.IEvents>(adapter);
    const adapters: Array<AnalyticsTypes.IAdapter> = [];
    let promise: Promise<any> | null = null;

    bus.on('has-referrer', (referrer: string) => {
        Object.defineProperty(Document.prototype, 'referrer', {
            get: () => referrer
        });
    });

    bus.on('add-adapter', data => {

        if (hasScript(data.libraryUrl)) {
            return void 0;
        }

        const load = loadScript(data.libraryUrl)
            .then(() => {
                runByPath(data.initializeMethod, [data.apiToken]);
                adapters.push({
                    type: data.type,
                    send(name: string, params: any): any {
                        runByPath(data.sendMethod, [name, params]);
                    }
                });
            });

        promise = promise ? promise.then(() => load) : load;

        promise.finally(() => {
            promise = null;
        });

        return load;
    });

    bus.on('event', data => {
        if (!data.name) {
            throw new Error('Wrong format, has no event name!');
        }
        const type = data.target || 'all';
        const apply = () => {
            adapters
                .filter(item => type === 'all' ? true : item.type === type)
                .forEach(item => item.send(data.name, data.params));
        };

        if (promise) {
            promise.then(apply);
        } else {
            apply();
        }
    });
});


