import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    minWidth: 40,
    padding: 8,
  },
  backIcon: {
    color: '#333',
    fontSize: 24,
  },
  title: {
    color: '#333',
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  closeButton: {
    alignItems: 'flex-end',
    minWidth: 40,
    padding: 8,
  },
  closeIcon: {
    color: '#333',
    fontSize: 32,
    lineHeight: 32,
  },
});
