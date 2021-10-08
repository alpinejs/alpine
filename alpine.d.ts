declare module Alpine {
  function store<T = any>(name: string, value?: undefined): T;
  function store<T = any>(name: string, value: T): void;

  function data<T = any>(name: string, callback: () => T): void;
}
