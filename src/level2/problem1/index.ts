export class ExecutionCache<TInputs extends Array<unknown>, TOutput> {
  constructor(private readonly handler: (...args: TInputs) => Promise<TOutput>) {}
  
  async fire(key: string, ...args: TInputs): Promise<TOutput> {
    /**
     * insert your code here
     */
  
    return;
  }
}
