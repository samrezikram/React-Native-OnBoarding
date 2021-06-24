module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      "@babel/plugin-proposal-decorators",
      {
        "legacy": true
      }
    ],
    [
      "module-resolver",
      {
        "root": ["."],
        "alias": {
          "@actions": "./src/actions",
          "@assets": "./src/assets",
          "@components": "./src/components",
          "@config": "./src/config",
          "@enums": "./src/enums",
          "@error-handlers": "./src/error-handlers",
          "@hocs": "./src/hocs",
          "@interfaces": "./src/interfaces",
          "@i18n": "./src/internationalization/i18n.ts",
          "@models": "./src/models",
          "@navigation": "./src/navigation",
          "@overlays": "./src/overlays",
          "@providers": "./src/providers",
          "@reducers": "./src/reducers",
          "@sagas": "./src/sagas",
          "@screens": "./src/screens",
          "@services": "./src/services",
          "@store": "./src/store",
          "@themes": "./src/themes",
          "@utils": "./src/utils",
          "@validators": "./src/validators"
        }
      }
    ]
  ]
};
