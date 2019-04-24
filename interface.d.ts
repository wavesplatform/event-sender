declare namespace AnalyticsTypes {

    type TTargetTypes = 'all' | 'ui' | 'logic';

    interface IEvents {
        event: IEventData;
        'has-referrer': string;
        'add-adapter': IApiData;
    }

    interface IEventData {
        name: string;
        params?: any;
        target?: TTargetTypes;
    }

    interface IApiData {
        apiToken?: string;
        libraryUrl: string;
        initializeMethod: string;
        sendMethod: string;
        type: TTargetTypes;
    }

    interface IAdapter {
        type: TTargetTypes;

        send(name: string, params: any): any;
    }
}
