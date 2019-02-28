const onLoad: Promise<Event> = new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));

export function loadScript(url: string): Promise<Event> {
    return onLoad.then(() => new Promise<Event>((resolve, reject) => {
        const script = document.createElement('script');
        script.addEventListener('load', resolve);
        script.addEventListener('error', reject);
        script.src = url;
        document.head.appendChild(script);
    }));
}

export function hasScript(url: string): boolean {
    return !!document.querySelector(`script[src="${url}"]`);
}

export function runByPath(path: string, args: Array<any>): any {
    let obj: any = window;
    const parts = path.split('.');

    if (parts.length === 1) {
        return obj[path](...args);
    }

    parts.slice(-1).forEach(part => {
        obj = obj[part];
    });

    obj[parts[parts.length - 1]](...args);
}
