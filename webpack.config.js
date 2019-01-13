const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        jxg_poc: 'jxg_poc.js'
    },
    module: {
        rules: [
            {
                test: /\.tsx$|\.spec\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    }
};
