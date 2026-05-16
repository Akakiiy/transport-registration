import { Pressable, Text, View } from 'react-native';
import { styles } from './styles';

type CheckboxProps = {
  checked: boolean;
  onPress?: () => void;
  labelPrefix: string;
  labelLink: string;
};

export const Checkbox = ({
  checked,
  onPress,
  labelPrefix,
  labelLink,
}: CheckboxProps) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={[styles.square, checked ? styles.squareChecked : null]}>
        {checked ? <Text style={styles.check}>✓</Text> : null}
      </View>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{labelPrefix} </Text>
        <Text style={styles.link}>{labelLink}</Text>
      </View>
    </Pressable>
  );
};
