import { View, ActivityIndicator, StyleSheet } from 'react-native';

const Loader = () => {
   return (
      <View style={styles.container}>
         <ActivityIndicator />
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
   },
});

export default Loader;
