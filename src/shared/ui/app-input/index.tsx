import { Text, TextInput, type TextInputProps, View } from 'react-native';
import { styles } from './styles';

type AppInputProps = {
  label?: string;
  error?: string;
  value?: string;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  keyboardType?: TextInputProps['keyboardType'];
  editable?: boolean;
  maxLength?: number;
  secureTextEntry?: boolean;
};

export const AppInput = ({
  label,
  error,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  editable = true,
  maxLength,
  secureTextEntry,
}: AppInputProps) => {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        editable={editable}
        keyboardType={keyboardType}
        maxLength={maxLength}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        style={[
          styles.input,
          !editable && styles.inputDisabled,
          Boolean(error) && styles.inputError,
        ]}
        value={value}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};
