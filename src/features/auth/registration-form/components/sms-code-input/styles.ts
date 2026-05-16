import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    position: 'relative',
  },
  cell: {
    width: 48,
    height: 56,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  cellActive: {
    borderColor: '#00BFA5',
    borderWidth: 2,
  },
  cellError: {
    borderColor: '#F44336',
  },
  cellText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
});
