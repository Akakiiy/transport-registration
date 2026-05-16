import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { styles } from './styles';

type AppButtonProps = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
};

export const AppButton = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
}: AppButtonProps) => {
  const isDisabled = disabled || loading;
  const isSecondary = variant === 'secondary';

  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isSecondary ? styles.buttonSecondary : styles.buttonPrimary,
        isDisabled && styles.buttonDisabled,
        pressed && !isDisabled && styles.buttonPressed,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            color={isSecondary ? '#3b82f6' : '#ffffff'}
            size="small"
          />
        ) : null}
        <Text
          style={[
            styles.title,
            isSecondary ? styles.titleSecondary : styles.titlePrimary,
          ]}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
};
