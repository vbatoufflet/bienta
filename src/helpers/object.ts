import {DeepPartial} from "~types";

export function isObject(obj: unknown): boolean {
    return typeof obj === "object" && !Array.isArray(obj);
}

export function mergeObjects<T>(obj: T, ...sources: (DeepPartial<T> | undefined)[]): T {
    if (sources.length === 0) {
        return obj;
    }

    while (sources.length > 0) {
        const dst = obj as Record<string, unknown>;
        const src = sources.shift();

        for (const key in src) {
            if (isObject(src[key])) {
                if (!dst[key]) {
                    dst[key] = {};
                }
                mergeObjects(dst[key], src[key]);
            } else {
                dst[key] = src[key];
            }
        }
    }

    return obj;
}
