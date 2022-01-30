import {mergeObjects} from "~src/helpers";
import {detectTheme} from "~src/themes";
import {DeepRequired, Options} from "~types";

export function withDefaults(opts?: Options): DeepRequired<Options> {
    return Object.freeze(
        mergeObjects<DeepRequired<Options>>(
            {
                iconPack: "font-awesome",
                persistState: {
                    key: "bienta",
                    storage: window.localStorage,
                },
                shortcuts: true,
                theme: detectTheme(),
            },
            opts,
        ),
    );
}
