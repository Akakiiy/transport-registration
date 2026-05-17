import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CCC',
  },
  indicatorActive: {
    backgroundColor: '#4CAF50',
  },
  requirementText: {
    fontSize: 14,
    color: '#666',
  },
  requirementTextActive: {
    color: '#4CAF50',
    fontWeight: '500',
  },
});
