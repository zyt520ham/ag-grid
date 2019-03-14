import {Injectable, NgZone} from "@angular/core";
import {IFrameworkOverrides} from "ag-grid-community";

@Injectable()
export class AngularOverrides implements IFrameworkOverrides {
    constructor(private _ngZone: NgZone) {
    }

    public setTimeout(action: any, timeout?: any): void {
        this._ngZone.runOutsideAngular(() => {
            window.setTimeout(() => {
                action();
            }, timeout);
        });
    }

    public processEventListenerFunc(event: string, addListenerFunc: () => void): void {
        this._ngZone.runOutsideAngular(() => {
            addListenerFunc();
        });
    }
}
