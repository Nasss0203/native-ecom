import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { saveSession } from '../../common/storage/authStorage';
import { useAuth } from '../../hooks/auth/useAuth';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { LoginFormValues, loginSchema } from '../../validation/auth';

type Props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

export default function SignInScreen({ navigation }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: 'nguyenanhnam23@gmail.com',
      password: '1234567890',
    },
    resolver: zodResolver(loginSchema),
  });

  const { login } = useAuth();

  const onSubmit = (values: LoginFormValues) => {
    login.mutate(values, {
      onSuccess: async data => {
        await saveSession(data);
        navigation.replace('Home');
      },
      onError: (err: any) => {
        // TODO: show toast, set error message
        console.log('Login error', err?.response?.data || err.message);
      },
    });
  };

  const loading = login.isPending;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Login to your account</Text>
      <Text style={styles.subtitle}>It&apos;s great to see you again.</Text>

      {/* Email */}
      <Text style={styles.label}>Email / Username</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { value, onChange, onBlur } }) => (
          <>
            <TextInput
              style={[styles.input, errors.email && { borderColor: '#dc2626' }]}
              placeholder="you@example.com"
              value={value}
              onChangeText={onChange}
              placeholderTextColor={'#111'}
              onBlur={onBlur}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}
          </>
        )}
      />

      {/* Password */}
      <Text style={styles.label}>Password</Text>
      <Controller
        control={control}
        name="password"
        render={({ field: { value, onChange, onBlur } }) => (
          <>
            <TextInput
              style={[
                styles.input,
                errors.password && { borderColor: '#dc2626' },
              ]}
              placeholder="Password"
              secureTextEntry
              placeholderTextColor={'#111'}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}
          </>
        )}
      />

      {/* Nút Login */}
      <TouchableOpacity
        style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryText}>Login</Text>
        )}
      </TouchableOpacity>

      <Text style={{ textAlign: 'center', marginVertical: 12 }}>Or</Text>

      <TouchableOpacity style={styles.socialBtn}>
        <Text>Login with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialBtn}>
        <Text>Login with Facebook</Text>
      </TouchableOpacity>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 16,
        }}
      >
        <Text>Don&apos;t have an account? </Text>
        <Text
          style={{ color: '#2563eb' }}
          onPress={() => navigation.navigate('SignUp' as never)}
        >
          Sign Up
        </Text>
      </View>

      {/* Lỗi API nếu có */}
      {login.isError && (
        <Text style={[styles.errorText, { textAlign: 'center', marginTop: 8 }]}>
          {(login.error as any)?.response?.data?.message ||
            'Đăng nhập thất bại, vui lòng thử lại.'}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: '#555', marginBottom: 24 },
  label: { marginTop: 12, marginBottom: 4, fontWeight: '500' },
  input: {
    borderWidth: 1,
    color: '#111',
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  primaryBtn: {
    marginTop: 20,
    borderRadius: 24,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '700' },
  socialBtn: {
    marginVertical: 4,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 12,
    alignItems: 'center',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 4,
  },
});
