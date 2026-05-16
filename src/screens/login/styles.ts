import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#f4f4f4',
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    color: '#111827',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 1,
    lineHeight: 38,
    textTransform: 'uppercase',
  },
  description: {
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 14,
  },
  divider: {
    backgroundColor: '#d1d5db',
    height: 1,
    marginVertical: 18,
  },
  form: {
    gap: 14,
  },
  linksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    justifyContent: 'center',
    marginTop: 14,
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
  forgotLink: {
    color: '#00a0b0',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 32,
  },
  footerText: {
    color: '#6b7280',
    fontSize: 13,
  },
  supportText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
});
