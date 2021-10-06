module.exports = {
    env: {
        es6: true,
        browser: true,
        node: true
    },
    extends: ['airbnb', 'prettier'],
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 12,
        sourceType: 'module'
    },
    plugins: ['react-hooks'],
    rules: {
        'no-param-reassign': [
            'error',
            { props: true, ignorePropertyModificationsFor: ['draft', 'ref', 'maps'] }
        ],
        'no-console': 'off',
        'no-debugger': 'off',
        'no-unused-vars': 'off',
        'prefer-arrow-callback': 'off',
        'no-prototype-builtins': 'off',
        'no-underscore-dangle': 'off',
        'no-template-curly-in-string': 'off', //  For Formik error message template
        'no-useless-escape': 'off',
        'arrow-body-style': 'off',
        'no-restricted-syntax': 'off',

        'import/prefer-default-export': 'off',

        'jsx-a11y/anchor-is-valid': 'off',
        'jsx-a11y/label-has-for': 'off',
        'jsx-a11y/label-has-associated-control': 'off',
        'jsx-a11y/tabindex-no-positive': 'off',
        'jsx-a11y/no-noninteractive-tabindex': 'off',
        'prefer-destructuring': 'off',

        'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'react/no-danger': 'off',
        'react/prop-types': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/no-unknown-property': 'off',
        'react/require-default-props': 'off',
        'react/forbid-prop-types': 'off',
        'react/jsx-fragments': 'off',
        'react/button-has-type': 'off',
        'react/no-find-dom-node': 'off',
        'react/no-array-index-key': 'off',
        'react/destructuring-assignment': 'off',
        'react/self-closing-comp': 'off'
    }
};
