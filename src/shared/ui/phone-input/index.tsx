import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { styles } from './styles';

type CountryOption = {
  code: string;
  name: string;
  callingCode: string;
  flag: string;
};

type PhoneInputProps = {
  label?: string;
  value?: string;
  onChangeText?: (value: string) => void;
  countryCode: string;
  onChangeCountry?: (countryCode: string) => void;
  countries: CountryOption[];
  placeholder?: string;
  error?: string;
};

const formatRuKzPhone = (rawValue: string): string => {
  const numbers = rawValue.replace(/\D/g, '').slice(0, 10);
  const p1 = numbers.slice(0, 3);
  const p2 = numbers.slice(3, 6);
  const p3 = numbers.slice(6, 8);
  const p4 = numbers.slice(8, 10);

  if (!p1) {
    return '';
  }

  let formatted = `(${p1}`;

  if (p1.length === 3) {
    formatted += ')';
  }

  if (p2) {
    formatted += ` ${p2}`;
  }

  if (p3) {
    formatted += `-${p3}`;
  }

  if (p4) {
    formatted += `-${p4}`;
  }

  return formatted;
};

export const PhoneInput = ({
  label,
  value,
  onChangeText,
  countryCode,
  onChangeCountry,
  countries,
  placeholder,
  error,
}: PhoneInputProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const selectedCountry = useMemo(() => {
    return (
      countries.find((country) => country.code === countryCode) ?? countries[0]
    );
  }, [countries, countryCode]);

  const isRuKz = selectedCountry.code === 'KZ' || selectedCountry.code === 'RU';
  const computedPlaceholder = isRuKz ? '(000) 000-00-00' : placeholder;

  const handleChange = (nextValue: string) => {
    if (!onChangeText) {
      return;
    }

    if (isRuKz) {
      onChangeText(formatRuKzPhone(nextValue));
      return;
    }

    const normalized = nextValue.replace(/[^\d\s()-]/g, '').slice(0, 20);
    onChangeText(normalized);
  };

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.row, error ? styles.rowError : null]}>
        <Pressable
          onPress={() => setIsModalVisible(true)}
          style={styles.selector}
        >
          <Text style={styles.selectorText}>
            {selectedCountry.flag} {selectedCountry.callingCode}
          </Text>
          <Text style={styles.arrow}>v</Text>
        </Pressable>
        <TextInput
          keyboardType="phone-pad"
          onChangeText={handleChange}
          placeholder={computedPlaceholder}
          style={styles.input}
          value={value}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Modal
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
        transparent
        visible={isModalVisible}
      >
        <Pressable
          onPress={() => setIsModalVisible(false)}
          style={styles.modalOverlay}
        >
          <Pressable style={styles.modalContent}>
            <ScrollView>
              {countries.map((country) => (
                <Pressable
                  key={country.code}
                  onPress={() => {
                    onChangeCountry?.(country.code);
                    setIsModalVisible(false);
                  }}
                  style={styles.countryRow}
                >
                  <Text style={styles.countryText}>
                    {country.flag} {country.name} ({country.callingCode})
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};
