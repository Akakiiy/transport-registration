import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { styles } from './styles';

type PasswordInputProps = {
  label?: string;
  value?: string;
  onChangeText?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  showLabel: string;
  hideLabel: string;
};

export const PasswordInput = ({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  error,
  showLabel,
  hideLabel,
}: PasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputRow, error ? styles.inputRowError : null]}>
        <TextInput
          onBlur={onBlur}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={!isVisible}
          style={styles.input}
          value={value}
        />
        <Pressable onPress={() => setIsVisible((prev) => !prev)}>
          <Text style={styles.toggleText}>
            {isVisible ? hideLabel : showLabel}
          </Text>
        </Pressable>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </>
  );
};
