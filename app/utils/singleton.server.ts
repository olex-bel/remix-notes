const SINGLETONS_KEY = Symbol.for('__singletons__');

function getOrInitializeGlobalSingletons<Value>(): Record<string, Value> {
    const globalObject = globalThis as typeof globalThis & {
        [SINGLETONS_KEY]?: Record<string, Value>;
    };

    globalObject[SINGLETONS_KEY] ??= {};
    return globalObject[SINGLETONS_KEY]!;
}

export function singleton<Value>(name: string, valueFactory: () => Value): Value {
    const singletons = getOrInitializeGlobalSingletons<Value>();

    if (!(name in singletons)) {
        singletons[name] = valueFactory();
    }
    
    return singletons[name];
}

export async function asyncSingleton<Value>(name: string, valueFactory: () => Promise<Value>): Promise<Value> {
    const singletons = getOrInitializeGlobalSingletons<Value>();

    if (!(name in singletons)) {
        singletons[name] = await valueFactory();
    }
    
    return singletons[name];
}
