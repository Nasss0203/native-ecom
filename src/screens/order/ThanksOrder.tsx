import { IconOutline } from '@ant-design/icons-react-native';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type OrderSuccessProps = {
  route: {
    params?: {
      total?: number;
      image?: string;
    };
  };
  navigation: any;
};

const OrderThankScreen: React.FC<OrderSuccessProps> = ({
  route,
  navigation,
}) => {
  const total = route.params?.total ?? 39; // demo
  const image = route.params?.image;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Icon check */}
        <View style={styles.iconWrapper}>
          <IconOutline name="check" size={40} color="#ffff" />
        </View>

        {/* Text */}
        <Text style={styles.title}>Thank you</Text>
        <Text style={styles.subtitle}>Order successfully placed</Text>

        {/* Button */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Back
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={[styles.buttonText, styles.primaryButtonText]}>
              Go to Home
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OrderThankScreen;

const PRIMARY = '#24C46F';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#1E88E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkIcon: {
    fontSize: 48,
    color: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 32,
  },

  buttonRow: {
    flexDirection: 'row',
    marginTop: 32,
    width: '100%',
    justifyContent: 'space-between',
    columnGap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#1E88E5',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#333333',
  },
});
