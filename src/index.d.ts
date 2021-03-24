// Checks that $watch can only be used on properties of the type
type $Watch<T> = (property: keyof T, callback: (value: any) => void) => void;

// Modified from alpine-typescript to retype $watch and to remove $event and $dispatch,
// since they are not accessible as properties on this.
type AlpineBase<T> = {
    readonly $el: HTMLElement;
    readonly $refs: { [name: string]: HTMLElement };
    readonly $nextTick: (callback: (_: any) => void) => void;
    readonly $watch: $Watch<T>
};

// The type of an Alpine component, where T is the type provided to x-data
export type AlpineComponent<T> = AlpineBase<T> & T;

export interface AlpineEvent {
    name: string,
    detail?: any
}

export interface SimpleAlpineEvent extends Omit<AlpineEvent, "detail"> {}

export type $Dispatch<T extends AlpineEvent | SimpleAlpineEvent = AlpineEvent> = T extends {detail: any}
    ? ((name: T["name"], detail: T["detail"]) => void)
    : T extends {detail?: any}
        ? ((name: T["name"], detail?: T["detail"]) => void)
        : ((name: T["name"]) => void);

declare const Alpine: {
    _BASE: AlpineBase<any>
};
export default Alpine;
