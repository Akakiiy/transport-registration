import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app/navigation/types';
import { ROUTES } from '@app/navigation/routes';
import { clearAllRegistrationData } from '@shared/lib/storage';
import { styles } from './styles';

const PIN_LENGTH = 4;
const TEST_PIN = '1111';

type AuthPinScreenProps = NativeStackScreenProps<RootStackParamList, 'AuthPin'>;

export const AuthPinScreen = ({ navigation }: AuthPinScreenProps) => {
  const { t } = useTranslation();
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyPin = async (pinToVerify: string) => {
    setIsVerifying(true);
    setError(null);

    // Simulate async verification
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 300));

    if (pinToVerify === TEST_PIN) {
      setIsVerifying(false);
      navigation.replace(ROUTES.Profile);
    } else {
      setError(t('authPin.invalidPin'));
      setPin('');
      setIsVerifying(false);
    }
  };

  const handleDigitPress = (digit: string) => {
    if (isVerifying || pin.length >= PIN_LENGTH) {
      return;
    }

    const nextPin = pin + digit;
    setPin(nextPin);
    setError(null);

    if (nextPin.length === PIN_LENGTH) {
      verifyPin(nextPin).catch((err) => {
        console.warn('[AuthPinScreen] PIN verification error', err);
      });
    }
  };

  const handleDelete = () => {
    if (isVerifying) {
      return;
    }
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  const handleLogout = async () => {
    try {
      await clearAllRegistrationData();
      navigation.replace(ROUTES.Login);
    } catch (err: unknown) {
      console.warn('[AuthPinScreen] Failed to clear data', err);
      navigation.replace(ROUTES.Login);
    }
  };

  const handleForgotPin = () => {
    Alert.alert(
      t('authPin.forgotTitle'),
      t('authPin.forgotMessage'),
      [{ text: t('common.cancel') }],
    );
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {Array.from({ length: PIN_LENGTH }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index < pin.length ? styles.dotFilled : styles.dotEmpty,
            ]}
          />
        ))}
      </View>
    );
  };

  const renderKeypadButton = (label: string, onPress: () => void) => {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.keypadButton,
          pressed && styles.keypadButtonPressed,
        ]}
        onPress={onPress}
        disabled={isVerifying}
      >
        <Text style={styles.keypadButtonText}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{t('authPin.title')}</Text>

          {renderDots()}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.keypad}>
            <View style={styles.keypadRow}>
              {renderKeypadButton('1', () => handleDigitPress('1'))}
              {renderKeypadButton('2', () => handleDigitPress('2'))}
              {renderKeypadButton('3', () => handleDigitPress('3'))}
            </View>
            <View style={styles.keypadRow}>
              {renderKeypadButton('4', () => handleDigitPress('4'))}
              {renderKeypadButton('5', () => handleDigitPress('5'))}
              {renderKeypadButton('6', () => handleDigitPress('6'))}
            </View>
            <View style={styles.keypadRow}>
              {renderKeypadButton('7', () => handleDigitPress('7'))}
              {renderKeypadButton('8', () => handleDigitPress('8'))}
              {renderKeypadButton('9', () => handleDigitPress('9'))}
            </View>
            <View style={styles.keypadRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.keypadButton,
                  pressed && styles.keypadButtonPressed,
                ]}
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}>
                  {t('authPin.logout')}
                </Text>
              </Pressable>
              {renderKeypadButton('0', () => handleDigitPress('0'))}
              <Pressable
                style={({ pressed }) => [
                  styles.keypadButton,
                  pressed && styles.keypadButtonPressed,
                ]}
                onPress={handleDelete}
                disabled={isVerifying}
              >
                <Text style={styles.deleteButtonText}>⌫</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <Pressable style={styles.forgotButton} onPress={handleForgotPin}>
          <Text style={styles.forgotButtonText}>{t('authPin.forgot')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};
