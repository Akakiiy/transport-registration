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
  inputRow: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  inputRowError: {
    borderColor: '#ef4444',
  },
  input: {
    color: '#111827',
    flex: 1,
    fontSize: 16,
    minHeight: 48,
  },
  toggleText: {
    color: '#00a0b0',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 4,
  },
  error: {
    color: '#ef4444',
    fontSize: 12,
  },
});
