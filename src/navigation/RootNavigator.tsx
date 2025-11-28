// src/navigation/RootNavigator.tsx
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import HomeHeader from '../components/layout/HomeHeader';
import ScreenLayout from '../components/layout/ScreenLayout';
import { DetailProduct, HomeScreen, SignInScreen } from '../screens';
import SignUpScreen from '../screens/auth/SignUpScreen';
import CartScreen from '../screens/cart/CartScreen';
import CheckoutScreen from '../screens/checkout/CheckoutScreen';
import ProfileScreen from '../screens/profiles/Profile';

export type RootStackParamList = {
  Home: undefined;
  Profile: { userId?: string } | undefined;
  SignIn: undefined;
  SignUp: undefined;
  DetailProduct: { productId: string };
  Cart: undefined;
  Checkout: { checkoutId: string };
  // Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer theme={DefaultTheme}>
      <Stack.Navigator
        screenOptions={{
          statusBarStyle: 'dark', // icon đen (nền sáng)
          statusBarTranslucent: true,
          statusBarBackgroundColor: 'transparent', // nền trong suốt trên Android
          // headerStyle: { backgroundColor: 'white' }, // nếu dùng header mặc định
        }}
      >
        <Stack.Screen
          name="Home"
          options={{
            header: p => <HomeHeader {...p} />,
          }}
        >
          {props => (
            <ScreenLayout>
              <HomeScreen {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>

        <Stack.Screen
          name="Profile"
          options={{ title: 'Tài khoản' /*, headerShown:false*/ }}
        >
          {props => (
            <ScreenLayout>
              <ProfileScreen {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>

        <Stack.Screen
          name="SignIn"
          options={{ title: 'Đăng nhập tài khoản' /*, headerShown:false*/ }}
        >
          {props => (
            <ScreenLayout>
              <SignInScreen {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>

        <Stack.Screen
          name="SignUp"
          options={{ title: 'Đăng ký tài khoản' /*, headerShown:false*/ }}
        >
          {props => (
            <ScreenLayout>
              <SignUpScreen {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>

        <Stack.Screen
          name="DetailProduct"
          options={{ title: 'Chi tiết sản phẩm' /*, headerShown:false*/ }}
        >
          {props => (
            <ScreenLayout>
              <DetailProduct {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>

        <Stack.Screen
          name="Cart"
          options={{ title: 'Giỏ hàng' /*, headerShown:false*/ }}
        >
          {props => (
            <ScreenLayout>
              <CartScreen {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>
        <Stack.Screen
          name="Checkout"
          options={{ title: 'Thanh toán' /*, headerShown:false*/ }}
        >
          {props => (
            <ScreenLayout>
              <CheckoutScreen {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>
        {/* <Stack.Screen name="Settings">...</Stack.Screen> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
