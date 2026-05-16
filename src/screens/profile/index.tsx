import { View } from 'react-native';
import { ScreenLayout } from '../../shared/ui/screen-layout';
import { styles } from './styles';

type ProfileScreenProps = {};

export const ProfileScreen = ({}: ProfileScreenProps) => {
  return (
    <ScreenLayout title="Profile">
      <View style={styles.content} />
    </ScreenLayout>
  );
};
