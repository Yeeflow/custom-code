const path = require('path');

const ROOT_PATH = path.resolve(__dirname);
const BUILD_PATH = path.resolve(ROOT_PATH, 'dist');

module.exports = {
    mode: "production", //"production", "development"
    entry: {
        codeInSample: './src/codeInSample.tsx',
        codeInExecute: './src/codeInExecute.tsx',
        dropdownSample: "./src/dropdownSample.tsx",
        loadThird3D: "./src/loadThird3D.tsx",
        loadThirdVideo: "./src/loadThirdVideo.tsx",
        requestSample: "./src/requestSample.tsx",
        passwordInput: "./src/passwordInput.tsx",
        qrCodeSample: "./src/qrCodeSample.tsx",
        formatList: "./src/formatList.tsx",
        displayUsers: "./src/displayUsers.tsx",
        filterSample: "./src/filterSample.tsx",
        addSeqNoToSubList: "./src/addSeqNoToSubList.tsx",
        modalDialogIframe: "./src/modalDialogIframe.tsx",
        chatGPT: "./src/chatgpt.tsx",
        deleteListRow: "./src/deleteListRow.tsx",
        unsetFieldsInSublist: "./src/unsetFieldInSublist.tsx",
        initByQueryString: "./src/initByQueryString.tsx",
        fileUpload: "./src/fileUpload.tsx",
        reload: "./src/reload.ts",
        readImgExt: "./src/readImgExt.tsx",
        googleMapPos: "./src/googleMapPos.tsx",
        googleMap: "./src/googleMap.tsx"
    },
    devtool: "none",
    output: {
        library: 'codeInModules',
        libraryTarget: 'assign',
        path: BUILD_PATH,
        filename: '[name].js',
        chunkFilename: '[name].js'
    },
    module: {
        rules: [{
            test: /\.tsx|\.ts$/,
            exclude: /^node_modules$/,
            use: 'ts-loader'
        }, {
            test: /\.jsx|\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            query: {
                presets: ['env', 'react']
            }
        }]
    },
    resolve: {
        extensions: [
            '.js', '.jsx', '.ts', '.tsx'
        ],
        alias: {}
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    },
};