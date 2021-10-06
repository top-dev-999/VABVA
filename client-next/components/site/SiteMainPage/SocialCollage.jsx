import React, { memo, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { useMediaQuery } from '../../ui/utils';

const SocialCollageInner = (props) => {
    const nodeRef = useRef(null);
    const [style, setStyle] = useState({});

    const isMobile = useMediaQuery('(max-width: 768px)');

    useEffect(() => {
        const roCallback = (entries) => {
            const entry = entries[0];

            if (entry) {
                setStyle(() => {
                    // Hardcoded ratio because we can't calculate it upfront
                    return { height: entry.contentRect.width * 0.96 };
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
        <div className="social-collage" ref={nodeRef} style={{ ...style }}>
            <div className="social-collage__item social-collage__item--p1">
                <Image
                    src="/images/social-slide-1.png"
                    alt="Social slide 1"
                    width={320}
                    height={320}
                    quality={50}
                />
            </div>
            <div className="social-collage__item social-collage__item--p2">
                <Image
                    src="/images/social-slide-2.png"
                    alt="Social slide 2"
                    width={320}
                    height={320}
                    quality={50}
                />
            </div>
            <div className="social-collage__item social-collage__item--p3">
                <Image
                    src="/images/social-slide-3.png"
                    alt="Social slide 3"
                    width={245}
                    height={180}
                    quality={50}
                />
            </div>
            <div className="social-collage__item social-collage__item--p4">
                <Image
                    src="/images/social-slide-4.png"
                    alt="Social slide 4"
                    width={245}
                    height={180}
                    quality={50}
                />
            </div>
        </div>
    );
};

export const SocialCollage = memo(SocialCollageInner);
