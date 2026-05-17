import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 48,
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
    gap: 20,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  dotEmpty: {
    backgroundColor: '#d1d5db',
  },
  dotFilled: {
    backgroundColor: '#3b82f6',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  keypad: {
    width: '100%',
    maxWidth: 320,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  keypadButton: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    borderRadius: 40,
    backgroundColor: '#f3f4f6',
  },
  keypadButtonPressed: {
    backgroundColor: '#e5e7eb',
  },
  keypadButtonText: {
    fontSize: 28,
    fontWeight: '500',
    color: '#1f2937',
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ef4444',
  },
  deleteButtonText: {
    fontSize: 28,
    fontWeight: '400',
    color: '#6b7280',
  },
  forgotButton: {
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  forgotButtonText: {
    fontSize: 14,
    color: '#3b82f6',
    textDecorationLine: 'underline',
  },
});
