import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

import { useMountedRef } from '../../ui/utils';
import { Container } from '../../layouts';
import { ArrowRight14Svg } from '../../../assets/svg';
import { Button } from '../../ui/Button';
import { getNews } from '../../../services/api';

import { config } from '../../../config';

import { News } from '../../News';

export const NewsSection = () => {
    const [data, setData] = useState([]);
    const isMountedRef = useMountedRef();

    const fetchNews = useCallback(async () => {
        try {
            const response = await getNews(6);

            if (isMountedRef.current) {
                setData(response);
            }
        } catch (e) {
            console.error(e);
        }
    }, [isMountedRef]);

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    const shouldDisplaySection = data.length > 0;

    if (!shouldDisplaySection) {
        return null;
    }

    return (
        <section className="filled-section main-page__filled-section filled-section--primary">
            <Container>
                <section className="main-page__news">
                    <header className="main-page__news-header">
                        <h6 className="main-page__subtitle">News</h6>
                        <h4 className="main-page__title">Waste & I: A Waste management guide</h4>
                    </header>
                    <div className="main-page__news-list">
                        <News data={data} />
                    </div>
                    <div className="d-flex flex-row justify-content-center">
                        <Link href={config.urls.news()} passHref>
                            <Button
                                link
                                variant="secondary"
                                size="lg"
                                iconRight={<ArrowRight14Svg />}
                                className="main-page__news-all-btn"
                            >
                                Learn more
                            </Button>
                        </Link>
                    </div>
                </section>
            </Container>
        </section>
    );
};
