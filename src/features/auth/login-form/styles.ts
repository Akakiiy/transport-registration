import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  linksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    justifyContent: 'center',
  },
  noAccountText: {
    color: '#4b5563',
    fontSize: 14,
  },
  registerLink: {
    color: '#00a0b0',
    fontSize: 14,
    fontWeight: '700',
  },
  policyError: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: -4,
  },
  submitError: {
    color: '#ef4444',
    fontSize: 13,
  },
});
