import {IFrameworkOverrides} from "./interfaces/IFrameworkOverrides";

/** The base frameworks, eg React & Angular 2, override this bean with implementations specific to their requirement. */
export class BaseFrameworkOverrides implements IFrameworkOverrides {
    public setTimeout(action: any, timeout?: any): void {
        window.setTimeout(action, timeout);
    }

    public processEventListenerFunc(event: string, addListenerFunc: () => void): void {
        addListenerFunc();
    }
}
