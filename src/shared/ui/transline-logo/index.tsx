import { View } from 'react-native';
import { styles } from './styles';

export const TranslineLogo = () => {
  return (
    <View style={styles.container}>
      <View style={styles.stripe} />
      <View style={styles.stripe} />
      <View style={styles.stripe} />
    </View>
  );
};
