import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { styles } from './styles';

type PasswordInputProps = {
  label?: string;
  value?: string;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  error?: string;
};

export const PasswordInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
}: PasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputRow, error ? styles.inputRowError : null]}>
        <TextInput
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={!isVisible}
          style={styles.input}
          value={value}
        />
        <Pressable onPress={() => setIsVisible((prev) => !prev)}>
          <Text style={styles.toggleText}>{isVisible ? 'HIDE' : 'SHOW'}</Text>
        </Pressable>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </>
  );
};
