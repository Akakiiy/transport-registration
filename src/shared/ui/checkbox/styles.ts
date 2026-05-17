import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  square: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#9ca3af',
    borderRadius: 4,
    borderWidth: 1,
    height: 20,
    justifyContent: 'center',
    marginTop: 2,
    width: 20,
  },
  squareChecked: {
    backgroundColor: '#00b8c8',
    borderColor: '#00b8c8',
  },
  check: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  labelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    gap: 2,
  },
  label: {
    color: '#374151',
    fontSize: 13,
    lineHeight: 18,
  },
  link: {
    color: '#111827',
    fontSize: 13,
    lineHeight: 18,
    textDecorationLine: 'underline',
  },
});
