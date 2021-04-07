// Checks that $watch can only be used on properties of the type
type $Watch<T> = (property: keyof T, callback: (value: any) => void) => void;

// Copied from alpine-typescript and modified to retype $watch and to remove $event and $dispatch,
// since they are not accessible as properties on this.
export type AlpineBase<T> = {
    readonly $el: HTMLElement;
    readonly $refs: { [name: string]: HTMLElement };
    readonly $nextTick: (callback: (_: any) => void) => void;
    readonly $watch: $Watch<T>
};

// The type of an Alpine component, where T is the type provided to x-data
export type AlpineComponent<T> = AlpineBase<T> & T;

// $Dispatch type is parameterized over the event type -- a detail argument can be forbidden,
// required or optional, and a specific type can be provided for it
export interface SimpleEvent extends Omit<CustomEvent, "detail"> {}
type EventWithRequiredDetail = {detail: any};
type EventWithOptionalDetail = {detail?: any};

type DispatchSignatureForDetailRequiredEvent<T extends Partial<CustomEvent>> = ((type: T["type"], detail: T["detail"]) => void);
type DispatchSignatureForDetailOptionalEvent<T extends Partial<CustomEvent>> = (type: T["type"], detail?: T["detail"]) => void;
type DispatchSignatureForSimpleEvent<T extends CustomEvent | SimpleEvent> = (name: T["type"]) => void;

export type $Dispatch<T extends CustomEvent | SimpleEvent = SimpleEvent & { detail?: any }> =
    T extends EventWithRequiredDetail ? DispatchSignatureForDetailRequiredEvent<T>
    : T extends EventWithOptionalDetail ? DispatchSignatureForDetailOptionalEvent<T>
        : DispatchSignatureForSimpleEvent<T>;
