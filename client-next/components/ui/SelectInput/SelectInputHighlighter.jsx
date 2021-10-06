import React from 'react';
import PropTypes from 'prop-types';
import Highlighter from 'react-highlight-words';

const SelectInputHighlighter = (props) => {
    const { text = '', query = '' } = props;

    const reg = `^${query}`;

    return (
        <Highlighter
            autoEscape={false}
            searchWords={[reg]}
            textToHighlight={text}
            highlightClassName="select-input__highlight-text"
            unhighlightClassName="select-input__unhighlight-text"
        />
    );
};

SelectInputHighlighter.propTypes = {
    text: PropTypes.string.isRequired,
    query: PropTypes.string.isRequired
};

export { SelectInputHighlighter };
