export function shallowDiffers(prev, next) {
    for (const key in prev) {
        if (prev.hasOwnProperty(key) && !next.hasOwnProperty(key)) {
            return true;
        }
    }

    for (const key in next) {
        if (prev.hasOwnProperty(key) && next.hasOwnProperty(key) && prev[key] !== next[key]) {
            return true;
        }
    }

    return false;
}
