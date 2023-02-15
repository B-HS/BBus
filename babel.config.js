module.exports = {
    plugins: [
        ["react-native-reanimated/plugin"],
        [
            "module:react-native-dotenv",
            {
                envName: "APP_ENV",
                moduleName: "@env",
                path: "key.env",
                safe: false,
                allowUndefined: false,
                verbose: false,
            },
        ],
    ],
    presets: ["module:metro-react-native-babel-preset"],
};
