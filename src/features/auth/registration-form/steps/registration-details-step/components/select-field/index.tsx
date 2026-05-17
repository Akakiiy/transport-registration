import { Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { styles } from './styles';

type SelectOption = {
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
  disablePlaceholder?: boolean;
};

export const SelectField = ({
  label,
  value,
  error,
  placeholder,
  options,
  onChange,
  disablePlaceholder = true,
}: SelectFieldProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.input, error ? styles.inputError : undefined]}>
        <Picker
          selectedValue={value}
          onValueChange={onChange}
          style={styles.picker}
        >
          <Picker.Item
            label={placeholder || ''}
            value=""
            enabled={!disablePlaceholder}
          />
          {options.map(option => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};
