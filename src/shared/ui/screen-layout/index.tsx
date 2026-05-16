import type { PropsWithChildren } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { LanguageSwitcher } from '../language-switcher';
import { styles } from './styles';

type ScreenLayoutProps = PropsWithChildren & {
  title: string;
};

export const ScreenLayout = ({ title, children }: ScreenLayoutProps) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <LanguageSwitcher />
        <Text style={styles.title}>{title}</Text>
        <View style={styles.content}>{children}</View>
      </View>
    </SafeAreaView>
  );
};
