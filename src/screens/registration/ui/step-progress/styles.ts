import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  segment: {
    borderRadius: 2,
    flex: 1,
    height: 4,
  },
  segmentActive: {
    backgroundColor: '#3b82f6',
  },
  segmentInactive: {
    backgroundColor: '#E0E0E0',
  },
});
