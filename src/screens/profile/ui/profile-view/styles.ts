import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  fieldsContainer: {
    gap: 16,
  },
  field: {
    backgroundColor: '#f9fafb',
    borderColor: '#e5e7eb',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  label: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  value: {
    color: '#1f2937',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonsContainer: {
    gap: 12,
    marginTop: 24,
  },
});
