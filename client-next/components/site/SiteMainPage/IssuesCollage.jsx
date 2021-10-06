import React, { memo, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { useMediaQuery } from '../../ui/utils';

const IssuesCollageInner = (props) => {
    const nodeRef = useRef(null);
    const [style, setStyle] = useState({});

    const isMobile = useMediaQuery('(max-width: 768px)');

    useEffect(() => {
        const roCallback = (entries) => {
            const entry = entries[0];

            if (entry) {
                setStyle(() => {
                    // Hardcoded ratio because we can't calculate it upfront
                    return { height: entry.contentRect.width * 0.76 };
                });
            }
        };

        if (isMobile && nodeRef.current && window.ResizeObserver) {
            const ro = new ResizeObserver(roCallback);

            ro.observe(nodeRef.current);

            return () => {
                setStyle({ height: null });
                ro.disconnect();
            };
        }

        return undefined;
    }, [isMobile]);

    return (
        <div className="issues-collage" ref={nodeRef} style={{ ...style }}>
            <div className="issues-collage__item issues-collage__item--p1">
                <Image
                    src="/images/why-vabva-slide-1.png"
                    alt="Issues slide 1"
                    width={134}
                    height={420}
                    quality={50}
                />
            </div>
            <div className="issues-collage__item issues-collage__item--p2">
                <Image
                    src="/images/why-vabva-slide-2.png"
                    alt="Issues slide 2"
                    width={134}
                    height={420}
                    quality={50}
                />
            </div>
            <div className="issues-collage__item issues-collage__item--p3">
                <Image
                    src="/images/why-vabva-slide-3.png"
                    alt="Issues slide 3"
                    width={134}
                    height={420}
                    quality={50}
                />
            </div>
            <div className="issues-collage__item issues-collage__item--p4">
                <Image
                    src="/images/why-vabva-slide-4.png"
                    alt="Issues slide 4"
                    width={134}
                    height={420}
                    quality={50}
                />
            </div>
        </div>
    );
};

export const IssuesCollage = memo(IssuesCollageInner);
