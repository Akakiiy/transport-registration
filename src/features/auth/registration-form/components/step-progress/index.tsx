import { View } from 'react-native';
import { styles } from './styles';

type StepProgressProps = {
  currentStep: number;
  totalSteps: number;
};

export const StepProgress = ({ currentStep, totalSteps }: StepProgressProps) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.segment,
            index < currentStep ? styles.segmentActive : styles.segmentInactive,
          ]}
        />
      ))}
    </View>
  );
};
