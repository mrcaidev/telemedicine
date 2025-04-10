export function devLog(...args: Parameters<typeof console.log>) {
  if (!__DEV__) {
    return;
  }

  console.log(`[${new Date().toLocaleTimeString()}]`, ...args);
}

export async function devSleep(ms: number, successRate = 1) {
  if (!__DEV__) {
    return;
  }

  return await new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < successRate) {
        resolve();
      } else {
        reject(new Error());
      }
    }, ms);
  });
}
