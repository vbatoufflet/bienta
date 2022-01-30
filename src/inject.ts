import {inject} from "vue";

import {Bienta} from "~src";

export const injectKey = "bienta";

export function useBienta(): Bienta {
    const bienta = inject<Bienta>(injectKey);
    if (!bienta) {
        throw new Error("cannot inject Bienta");
    }

    return bienta;
}
