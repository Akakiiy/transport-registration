import { View } from 'react-native';
import { styles } from './styles';

type StepProgressProps = {
  currentStep: number;
};

export const StepProgress = ({ currentStep }: StepProgressProps) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: 4 }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.segment,
            index <= currentStep ? styles.segmentActive : styles.segmentInactive,
          ]}
        />
      ))}
    </View>
  );
};
