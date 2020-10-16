module.exports = {
    extends: [require.resolve('@umijs/fabric/dist/eslint')],
    rules: {
        'eqeqeq': ["warn", "smart"],
        'no-param-reassign': ["warn", { "props": true }],
        'no-plusplus': 0,
        'jsx-a11y/label-has-associated-control': 0,
        "no-restricted-globals": ["error", "event", "fdescribe"]
    },
    globals: {
        ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
        page: true,
        REACT_APP_ENV: true,
    },
};
