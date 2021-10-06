import Head from 'next/head';
import React from 'react';

import '../scss/index.scss';

function ClientNextApp(props) {
    const { Component, pageProps } = props;

    return (
        <React.Fragment>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <Component {...pageProps} />
        </React.Fragment>
    );
}

export default ClientNextApp;
