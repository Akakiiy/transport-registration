import { View } from 'react-native';
import TranslineLogoSvg from './assets/transline-logo.svg';
import { styles } from './styles';

export const TranslineLogo = () => {
  return (
    <View style={styles.container}>
      <TranslineLogoSvg height={72} width={72} />
    </View>
  );
};
