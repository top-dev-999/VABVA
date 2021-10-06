export function getTouchPosition(ev, touchIdRef) {
    const touchEvent = ev;
    const changedTouches = touchEvent.changedTouches;

    if (touchIdRef && touchIdRef.current !== undefined && changedTouches) {
        for (let i = 0; i <= changedTouches.length; i += 1) {
            const touchItem = changedTouches[i];

            if (touchItem && touchIdRef.current === touchItem.identifier) {
                return {
                    x: touchItem.clientX,
                    y: touchItem.clientY
                };
            }
        }

        return null;
    }

    const mouseEvent = ev;

    return {
        x: mouseEvent.clientX,
        y: mouseEvent.clientY
    };
}
