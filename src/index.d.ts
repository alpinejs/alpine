// Checks that $watch can only be used on properties of the type
type $Watch<T> = (property: keyof T, callback: (value: any) => void) => void;

// Copied from alpine-typescript and modified to retype $watch and to remove $event and $dispatch,
// since they are not accessible as properties on this.
type AlpineBase<T> = {
    readonly $el: HTMLElement;
    readonly $refs: { [name: string]: HTMLElement };
    readonly $nextTick: (callback: (_: any) => void) => void;
    readonly $watch: $Watch<T>
};

// The type of an Alpine component, where T is the type provided to x-data
export type AlpineComponent<T> = AlpineBase<T> & T;

// The type of an event without any details
export interface SimpleEvent extends Omit<CustomEvent, "detail"> {}

type DetailRequired = {detail: any};
type DetailOptional = {detail?: any};

type SignatureWithRequiredDetail<T extends Partial<CustomEvent>> = ((type: T["type"], detail: T["detail"]) => void);
type SignatureWithOptionalDetail<T extends Partial<CustomEvent>> = (type: T["type"], detail?: T["detail"]) => void;
type SignatureWithoutDetail<T extends CustomEvent | SimpleEvent> = (name: T["type"]) => void;

export type $Dispatch<T extends CustomEvent | SimpleEvent = SimpleEvent & { detail?: any }> =
    T extends DetailRequired ? SignatureWithRequiredDetail<T>
    : T extends DetailOptional ? SignatureWithOptionalDetail<T>
        : SignatureWithoutDetail<T>;

declare const Alpine: {
    _BASE: AlpineBase<any>
};
export default Alpine;
