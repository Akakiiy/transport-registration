import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    gap: 6,
    width: '100%',
  },
  label: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
    width: '100%',
  },
  pickerContainer: {
    width: '100%',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  picker: {
    color: '#111827',
    width: '100%',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
  },
});
