import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View, } from 'react-native';
import { MaskedTextInput } from 'react-native-mask-text';
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
  onBlur?: () => void;
  countryCode: string;
  onChangeCountry?: (countryCode: string) => void;
  countries: CountryOption[];
  placeholder?: string;
  error?: string;
};

export const PhoneInput = ({
  label,
  value,
  onChangeText,
  onBlur,
  countryCode,
  onChangeCountry,
  countries,
  placeholder,
  error,
}: PhoneInputProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const selectedCountry = useMemo(() => {
    return (
      countries.find(country => country.code === countryCode) ?? countries[0]
    );
  }, [countries, countryCode]);

  const isRuKz = selectedCountry.code === 'KZ' || selectedCountry.code === 'RU';
  const computedPlaceholder = isRuKz ? '(000) 000-00-00' : placeholder;
  const maxLength = isRuKz ? 10 : 15;

  const handleChange = (nextValue: string) => {
    if (!onChangeText) {
      return;
    }

    const normalizedDigits = nextValue.replace(/\D/g, '').slice(0, maxLength);
    onChangeText(normalizedDigits);
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
        {isRuKz ? (
          <MaskedTextInput
            keyboardType="phone-pad"
            mask="(999) 999-99-99"
            onBlur={onBlur}
            onChangeText={(_, rawText) => {
              onChangeText?.(rawText.slice(0, 10));
            }}
            placeholder={computedPlaceholder}
            style={styles.input}
            value={value}
          />
        ) : (
          <TextInput
            keyboardType="phone-pad"
            maxLength={maxLength}
            onBlur={onBlur}
            onChangeText={handleChange}
            placeholder={computedPlaceholder}
            style={styles.input}
            value={value}
          />
        )}
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
              {countries.map(country => (
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
