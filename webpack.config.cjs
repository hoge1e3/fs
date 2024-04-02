const path=require('path');

module.exports = [
    {
        entry: './src/index.js',
        output: {
            library: "FS",
            libraryTarget: 'umd',
            path: path.resolve(__dirname, "dist"),
            filename: 'FS.js',
        },
    },
    {
        entry: './src/index.js',
        output: {
            libraryTarget: 'amd',
            path: path.resolve(__dirname, "dist"),
            filename: 'FS_amd.js',
        },
    },

];