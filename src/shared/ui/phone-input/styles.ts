import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    gap: 6,
    width: '100%',
  },
  label: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  row: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 50,
  },
  rowError: {
    borderColor: '#ef4444',
  },
  selector: {
    alignItems: 'center',
    borderRightColor: '#e5e7eb',
    borderRightWidth: 1,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  selectorText: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '600',
  },
  arrow: {
    color: '#6b7280',
    fontSize: 10,
  },
  input: {
    color: '#111827',
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  error: {
    color: '#ef4444',
    fontSize: 12,
  },
  modalOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '55%',
    paddingBottom: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  countryRow: {
    alignItems: 'center',
    borderBottomColor: '#f3f4f6',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 12,
  },
  countryText: {
    color: '#111827',
    fontSize: 14,
  },
});
