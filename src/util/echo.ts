//  GLOBAL COMMON / UTIL functions   //
// --------------------------------- //
//  DON'T ADD Common or UTIL HERE!   //
// --------------------------------- //
// ADD Common / util folder - module //
// Scoped for the functions folders  //
// --------------------------------- //

const isTest: boolean = process.env.NODE_ENV === 'test';
const isDev: boolean = process.env.NODE_ENV !== 'production';

export function echo(...params: any[]): void {
  if (isTest) {
    return;
  }

  if (isDev) {
    const e: Error = new Error('dummy');
    const callerName: string = e.stack.split('\n')[2].replace(/^\s+at\s+(.+?)\s.+/g, '$1');

    console.log(callerName, ...params);
  }
}
