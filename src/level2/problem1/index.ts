export class ExecutionCache<TInputs extends Array<unknown>, TOutput> {
  constructor(private readonly handler: (...args: TInputs) => Promise<TOutput>) {}
  
  async fire(key: string, ...args: TInputs): Promise<TOutput> {
   const store = (this as any).__store ??= new Map<string, Promise<TOutput>>();

    if (!store.has(key)) {
      store.set(key, this.handler(...args));
    }

    return store.get(key)!;
  }
}
