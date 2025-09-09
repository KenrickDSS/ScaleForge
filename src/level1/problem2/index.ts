import { randomBytes } from 'crypto';

const PROCESS_RANDOM = randomBytes(4);
let counter = Math.floor(Math.random() * 0xffffff);

export class ObjectId {
  private data: Buffer;

  constructor(type: number, timestamp: number) {
    if (type < 0 || type > 255) {
      throw new Error('Type must be a 1-byte value (0–255)');
    }

    const buffer = Buffer.alloc(14);

    buffer[0] = type;

    for (let i = 0; i < 6; i++) {
      buffer[1 + i] = (timestamp >> ((5 - i) * 8)) & 0xff;
    }

    PROCESS_RANDOM.copy(buffer, 7);

    counter = (counter + 1) & 0xffffff;
    buffer[11] = (counter >> 16) & 0xff;
    buffer[12] = (counter >> 8) & 0xff;
    buffer[13] = counter & 0xff;

    this.data = buffer;
  }

  static generate(type?: number): ObjectId {
    return new ObjectId(type ?? 0, Date.now());
  }

  toString(encoding?: 'hex' | 'base64'): string {
    return this.data.toString(encoding ?? 'hex');
  }
}