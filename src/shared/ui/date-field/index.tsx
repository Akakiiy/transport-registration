import { useMemo, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { styles } from './styles';

type DateFieldProps = {
  label: string;
  value: string;
  error?: string;
  placeholder?: string;
  maximumDate?: Date;
  minimumDate?: Date;
  onChange: (value: string) => void;
};

const pad = (value: number): string => String(value).padStart(2, '0');

const formatDateValue = (date: Date): string => {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());

  return `${year}-${month}-${day}`;
};

const parseDateValue = (value: string): Date | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [yearString, monthString, dayString] = value.split('-');
  const year = Number(yearString);
  const month = Number(monthString);
  const day = Number(dayString);

  const parsed = new Date(year, month - 1, day);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
};

export const DateField = ({
  label,
  value,
  error,
  placeholder,
  maximumDate,
  minimumDate,
  onChange,
}: DateFieldProps) => {
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const pickerDate = useMemo(() => parseDateValue(value) ?? new Date(), [value]);

  const handleChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setIsPickerVisible(false);
    }

    if (!selectedDate) {
      return;
    }

    onChange(formatDateValue(selectedDate));

    if (Platform.OS === 'ios') {
      setIsPickerVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => setIsPickerVisible(true)}
        style={[styles.input, error ? styles.inputError : undefined]}
      >
        <Text style={value ? styles.valueText : styles.placeholderText}>
          {value || placeholder || ''}
        </Text>
      </Pressable>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {isPickerVisible ? (
        <DateTimePicker
          value={pickerDate}
          mode="date"
          display="default"
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          onChange={handleChange}
        />
      ) : null}
    </View>
  );
};
