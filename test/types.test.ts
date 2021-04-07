import {AlpineComponent, $Dispatch, SimpleEvent, AlpineBase} from "../src";

interface TestEvent extends CustomEvent {
  type: 'test-event',
  detail: {
    value: number
  }
}

interface TestEventNoDetail extends SimpleEvent {
  type: 'test-event-no-detail'
}

type TestComponent = {
  testString: string,
  logTestString: () => void,
  handleSimpleEvent: (ev: SimpleEvent) => void,
  handleAnyEvent: (ev: CustomEvent) => void,
  dispatchAnyEvent: ($dispatch: $Dispatch) => void,
  dispatchEventWithDetail: ($dispatch: $Dispatch<TestEvent>) => void,
  dispatchEventWithNoDetail: ($dispatch: $Dispatch<TestEventNoDetail>) => void,
  dispatchMultipleEventTypes: ($dispatch: $Dispatch<TestEvent> & $Dispatch<TestEventNoDetail>) => void,
  typedEventFromGeneric: (ev: CustomEvent, $dispatch: $Dispatch<TestEvent>) => void,
  genericEventFromTyped: (ev: TestEventNoDetail, $dispatch: $Dispatch) => void,
}

function makeComponent(param: string): AlpineComponent<TestComponent> {
  return {
    ...({} as AlpineBase<TestComponent>),
    testString: param,
    logTestString() {
      console.log(this.testString);
      console.log(this.$el);
      console.log(this.$refs);
      this.$nextTick(() => {});
      this.$watch('testString', () => {});
      // @ts-expect-error
      console.log(this.notAProp);
      const testString = this.testString;
      // @ts-expect-error
      const undef: CanBeUndef<typeof testString>;
    },
    handleSimpleEvent(ev) {
      console.log(ev.type);
      // @ts-expect-error -- not present on simple event
      console.log(ev.detail);
      // @ts-expect-error
      console.log(ev.nonProp);
    },
    handleAnyEvent(ev) {
      console.log(ev.type);
      console.log(ev.detail);
      // @ts-expect-error
      console.log(ev.nonProp);
    },
    dispatchAnyEvent($dispatch: $Dispatch) {
      $dispatch('event');
      $dispatch('event-with-detail-obj', {value: 42});
      $dispatch('event-with-detail-value', "event detail");
      // @ts-expect-error  -- extra arg
      $dispatch('event-with-detail-value-and-more', "event detail", 42);
    },
    dispatchEventWithDetail($dispatch) {
      // @ts-expect-error  -- wrong name
      $dispatch('test-event-no-detail');
      // @ts-expect-error  -- missing detail
      $dispatch('test-event');
      $dispatch('test-event', {value: 42});
      // @ts-expect-error  -- wrong type for detail.value
      $dispatch('test-event', {value: "42"});
      // @ts-expect-error  -- wrong type for detail
      $dispatch('test-event', "event detail");
      // @ts-expect-error  -- extra arg
      $dispatch('test-event', "event detail", 42);
    },
    dispatchEventWithNoDetail($dispatch) {
      $dispatch('test-event-no-detail');
      // @ts-expect-error  -- wrong name
      $dispatch('test-event');
      // @ts-expect-error  -- detail not allowed
      $dispatch('test-event-no-detail', {value: 42});
      // @ts-expect-error  -- detail not allowed and wrong name
      $dispatch('test-event', {value: 42});
      // @ts-expect-error
      $dispatch('test-event-no-detail', "event detail", 42);
    },
    dispatchMultipleEventTypes($dispatch: $Dispatch<TestEvent> & $Dispatch<TestEventNoDetail>): void {
      $dispatch('test-event-no-detail');
      // @ts-expect-error
      $dispatch('test-event');
      $dispatch('test-event', {value: 42});
      // @ts-expect-error
      $dispatch('test-event-no-detail', {value: 42});
    },
    typedEventFromGeneric(ev, $dispatch) {
      // @ts-expect-error
      $dispatch('test-event-no-detail');
      // @ts-expect-error  -- missing detail
      $dispatch('test-event');
      $dispatch('test-event', {value: 42});
      // @ts-expect-error  -- wrong type for detail.value
      $dispatch('test-event', {value: "42"});
      // @ts-expect-error  -- wrong type for detail
      $dispatch('test-event', "event detail");
      // @ts-expect-error  -- extra arg
      $dispatch('test-event', {value: 42}, 42);
    },
    genericEventFromTyped(ev, $dispatch) {
      $dispatch('test-event-no-detail');
      $dispatch('test-event');
      $dispatch('new-event-name');
      $dispatch('test-event', {value: 42});
      $dispatch('test-event', {value: "42"});
      $dispatch('test-event', "event detail");
      // @ts-expect-error
      $dispatch('test-event', "event detail", 42);
    }
  }
}

const component = makeComponent("test");

let el: HTMLElement = component.$el;
let refs: { [name: string]: HTMLElement } = component.$refs;
let nextTick: (callback: (_: any) => void) => void = component.$nextTick;

component.$watch('testString', () => {});
component.$watch('logTestString', () => {});
// @ts-expect-error
component.$watch('testString');
// @ts-expect-error
component.$watch('testString', () => {}, "extra arg");
// @ts-expect-error
component.$watch('notAProp', () => {});
// @ts-expect-error
component.$watch('$el', () => {});
