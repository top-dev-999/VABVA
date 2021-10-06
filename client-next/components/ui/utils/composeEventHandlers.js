export function composeEventHandlers(...handlers) {
    return (...args) => {
        handlers.forEach((handler) => {
            if (handler) {
                handler(...args);
            }
        });
    };
}
