module.exports = function (api) {
   api.cache(true);
   return {
      presets: ['babel-preset-expo'],
      plugins: [
         [
            'module-resolver',
            {
               root: ['./src'],
               extensions: ['.js', '.jsx', '.ts', '.tsx'],
               alias: {
                  
               },
            },
         ],
         '@babel/plugin-proposal-export-namespace-from',
         'react-native-reanimated/plugin',
      ],
   };
};
