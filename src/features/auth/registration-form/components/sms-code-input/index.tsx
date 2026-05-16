import { useRef, useState } from 'react';
import { TextInput, View, Pressable, Text } from 'react-native';
import { SMS_CODE_LENGTH } from '../../lib/constants';
import { styles } from './styles';

type SmsCodeInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  error?: boolean;
};

export const SmsCodeInput = ({ value, onChangeText, error }: SmsCodeInputProps) => {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handlePress = () => {
    inputRef.current?.focus();
  };

  const handleChangeText = (text: string) => {
    const digitsOnly = text.replace(/\D/g, '');
    const truncated = digitsOnly.slice(0, SMS_CODE_LENGTH);
    onChangeText(truncated);
  };

  const cells = Array.from({ length: SMS_CODE_LENGTH }).map((_, index) => {
    const char = value[index] || '';
    const isActive = isFocused && index === value.length;
    
    return (
      <View
        key={index}
        style={[
          styles.cell,
          isActive && styles.cellActive,
          error && styles.cellError,
        ]}
      >
        {char ? <Text style={styles.cellText}>{char}</Text> : null}
      </View>
    );
  });

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      {cells}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        keyboardType="number-pad"
        maxLength={SMS_CODE_LENGTH}
        style={styles.hiddenInput}
        autoFocus
      />
    </Pressable>
  );
};
