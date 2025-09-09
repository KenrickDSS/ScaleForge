export class ObjectId {
  private data: Buffer;

  constructor(type: number, timestamp: number) {
    /**
     * insert your code here
     */
  }

  static generate(type?: number): ObjectId {
    return new ObjectId(type ?? 0, Date.now());
  }
  
  toString(encoding?: 'hex' | 'base64'): string {
    return this.data.toString(encoding ?? 'hex');
  }
}