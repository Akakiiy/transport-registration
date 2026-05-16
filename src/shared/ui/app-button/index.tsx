import { Pressable, Text } from 'react-native';
import { styles } from './styles';

type AppButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export const AppButton = ({ title, onPress, disabled }: AppButtonProps) => {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.buttonDisabled,
        pressed && !disabled && { opacity: 0.8 },
      ]}
    >
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
};
