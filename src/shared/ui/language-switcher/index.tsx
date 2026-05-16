import { Pressable, Text, View } from 'react-native';
import { styles } from './styles';

type LanguageSwitcherProps = {};

export const LanguageSwitcher = ({}: LanguageSwitcherProps) => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.button}>
        <Text style={styles.text}>RU</Text>
      </Pressable>
      <Pressable style={styles.button}>
        <Text style={styles.text}>EN</Text>
      </Pressable>
    </View>
  );
};
