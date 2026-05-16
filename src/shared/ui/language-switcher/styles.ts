import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    color: '#4b5563',
    fontSize: 12,
    fontWeight: '500',
  },
  button: {
    borderColor: '#d1d5db',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  buttonActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#dbeafe',
  },
  text: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '600',
  },
});
