/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path';

export function getJson<T>(fileName: string): T {
  const fullPath = path.join(process.cwd(), 'data', fileName);

  return require(fullPath) as T;
}
