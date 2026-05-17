import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    position: 'relative',
  },
  cell: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderColor: '#E0E0E0',
    borderRadius: 8,
    borderWidth: 1,
    height: 56,
    justifyContent: 'center',
    width: 48,
  },
  cellActive: {
    borderColor: '#00BFA5',
    borderWidth: 2,
  },
  cellError: {
    borderColor: '#F44336',
  },
  cellText: {
    color: '#333',
    fontSize: 24,
    fontWeight: '600',
  },
  hiddenInput: {
    height: 1,
    opacity: 0,
    position: 'absolute',
    width: 1,
  },
});
