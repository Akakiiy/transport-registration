import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  buttonPrimary: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  buttonSecondary: {
    backgroundColor: '#ffffff',
    borderColor: '#bfdbfe',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  titlePrimary: {
    color: '#ffffff',
  },
  titleSecondary: {
    color: '#2563eb',
  },
});
