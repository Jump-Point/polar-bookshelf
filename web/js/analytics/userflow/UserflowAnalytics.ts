import {IAnalytics, IEventArgs, TraitsMap, IPageEvent, IAnalyticsUser} from "../IAnalytics";
import userflow from 'userflow.js'
import { AppRuntime } from "polar-shared/src/util/AppRuntime";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";

if (! AppRuntime.isNode()) {
    userflow.init('ct_kyip2xj7ufhz7a2v7ejnwxaaxa');
}

// https://getuserflow.com/docs/userflow-js#track

let identified: boolean = false;

export class UserflowAnalytics implements IAnalytics {

    public event(event: IEventArgs): void {

        if (! identified) {
            return;
        }

        const eventName = event.category + '_' + event.action;

        try {
            userflow.track(eventName);
        } catch (e) {
            console.warn("Unable to track userflow event: " + eventName);
        }

    }

    public event2(event: string, data?: any): void {

        if (! identified) {
            return;
        }

        try {

            function toAttributes() {
                if (typeof data === 'object') {
                    // events don't support objects so we have to filter or flatten them.
                    return Dictionaries.filter<string>(data, (key, value) => typeof value === 'string');
                } else {
                    return {};
                }
            }

            const attributes = toAttributes();
            userflow.track(event, attributes);

        } catch (e) {
            console.warn("Unable to track userflow event: " + event);
        }

    }

    public identify(user: IAnalyticsUser): void {
        userflow.identify(user.uid);
        identified = true;
    }

    public page(event: IPageEvent): void {
        // noop
    }

    public traits(traits: TraitsMap): void {

        if (! identified) {
            return;
        }

        userflow.updateUser(traits);

    }

    public version(version: string) {
        // noop
    }

    public heartbeat(): void {
        // noop
    }

    public logout(): void {
        // noop
    }

}


