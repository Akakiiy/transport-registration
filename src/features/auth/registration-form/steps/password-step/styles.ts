import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentSection: {
    gap: 20,
  },
  title: {
    color: '#333',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    color: '#666',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 8,
  },
  requirementsContainer: {
    gap: 4,
    paddingVertical: 8,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  errorText: {
    color: '#F44336',
    fontSize: 14,
    textAlign: 'center',
  },
  actionArea: {
    marginTop: 'auto',
    paddingBottom: 8,
  },
});
