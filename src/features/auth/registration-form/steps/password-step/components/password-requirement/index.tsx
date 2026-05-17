import { Text, View } from 'react-native';
import { styles } from './styles';

type PasswordRequirementProps = {
  met: boolean;
  text: string;
};

export const PasswordRequirement = ({ met, text }: PasswordRequirementProps) => (
  <View style={styles.requirement}>
    <View style={[styles.indicator, met && styles.indicatorActive]} />
    <Text style={[styles.requirementText, met && styles.requirementTextActive]}>
      {text}
    </Text>
  </View>
);
