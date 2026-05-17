import { useCallback, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { styles } from './styles';

export type SelectOption = {
  label: string;
  value: string;
};

type SelectFieldProps = {
  label: string;
  value: string;
  error?: string;
  placeholder?: string;
  options: SelectOption[];
  onChange: (value: string) => void;
};

export const SelectField = ({
  label,
  value,
  error,
  placeholder,
  options,
  onChange,
}: SelectFieldProps) => {
  const pickerRef = useRef<Picker<string> | null>(null);

  const handlePress = useCallback(() => {
    const picker = pickerRef.current;
    if (picker && typeof picker.focus === 'function') {
      picker.focus();
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={[styles.input, error ? styles.inputError : undefined]}
        onPress={handlePress}
      >
        <View pointerEvents="none" style={styles.pickerContainer}>
          <Picker
            ref={pickerRef}
            selectedValue={value}
            onValueChange={onChange}
            style={styles.picker}
          >
          <Picker.Item label={placeholder || ''} value="" enabled={false} />
          {options.map(option => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
          </Picker>
        </View>
      </Pressable>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};
