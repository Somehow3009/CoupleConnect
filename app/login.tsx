import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth, useAlert } from '@/template';
import { useTheme } from '@/hooks/useTheme';
import { spacing, typography, borderRadius } from '@/constants/theme';

export default function LoginScreen() {
  const { sendOTP, verifyOTPAndLogin, signInWithPassword, operationLoading } = useAuth();
  const { showAlert } = useAlert();
  const { colors } = useTheme();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOTP = async () => {
    if (!email.trim()) {
      showAlert('Error', 'Please enter your email');
      return;
    }

    const { error } = await sendOTP(email.trim());
    if (error) {
      showAlert('Error', error);
      return;
    }

    setStep('otp');
    showAlert('Success', 'Verification code sent to your email');
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      showAlert('Error', 'Please enter the verification code');
      return;
    }

    if (mode === 'register') {
      if (!password.trim() || password.length < 6) {
        showAlert('Error', 'Password must be at least 6 characters');
        return;
      }
      if (password !== confirmPassword) {
        showAlert('Error', 'Passwords do not match');
        return;
      }

      const { error } = await verifyOTPAndLogin(email, otp, { password });
      if (error) {
        showAlert('Error', error);
        return;
      }
      // AuthRouter will handle navigation
    } else {
      const { error } = await verifyOTPAndLogin(email, otp);
      if (error) {
        showAlert('Error', error);
      }
    }
  };

  const handlePasswordLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showAlert('Error', 'Please enter email and password');
      return;
    }

    const { error } = await signInWithPassword(email, password);
    if (error) {
      showAlert('Error', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={[styles.logo, { backgroundColor: colors.primary }]}>
              <MaterialIcons name="favorite" size={48} color="#FFFFFF" />
            </View>
            <Text style={[styles.appName, { color: colors.textPrimary }]}>CoupleConnect</Text>
            <Text style={[styles.tagline, { color: colors.textSecondary }]}>
              Stay close, stay connected
            </Text>
          </View>

          {/* Mode Toggle */}
          <View style={styles.modeToggle}>
            <Pressable
              style={[
                styles.modeButton,
                { borderColor: colors.border },
                mode === 'login' && { backgroundColor: colors.primary },
              ]}
              onPress={() => {
                setMode('login');
                setStep('email');
                setOtp('');
              }}
            >
              <Text style={[
                styles.modeText,
                { color: mode === 'login' ? '#FFFFFF' : colors.textPrimary },
              ]}>
                Login
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.modeButton,
                { borderColor: colors.border },
                mode === 'register' && { backgroundColor: colors.primary },
              ]}
              onPress={() => {
                setMode('register');
                setStep('email');
                setOtp('');
              }}
            >
              <Text style={[
                styles.modeText,
                { color: mode === 'register' ? '#FFFFFF' : colors.textPrimary },
              ]}>
                Register
              </Text>
            </Pressable>
          </View>

          {/* Form */}
          <View style={[styles.form, { backgroundColor: colors.surface }]}>
            {step === 'email' ? (
              <>
                {/* Email Input */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surfaceElevated, color: colors.textPrimary, borderColor: colors.border }]}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.textSubtle}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>

                {mode === 'register' && (
                  <>
                    {/* Password Input */}
                    <View style={styles.inputGroup}>
                      <Text style={[styles.label, { color: colors.textSecondary }]}>Password</Text>
                      <TextInput
                        style={[styles.input, { backgroundColor: colors.surfaceElevated, color: colors.textPrimary, borderColor: colors.border }]}
                        placeholder="At least 6 characters"
                        placeholderTextColor={colors.textSubtle}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                      />
                    </View>

                    {/* Confirm Password */}
                    <View style={styles.inputGroup}>
                      <Text style={[styles.label, { color: colors.textSecondary }]}>Confirm Password</Text>
                      <TextInput
                        style={[styles.input, { backgroundColor: colors.surfaceElevated, color: colors.textPrimary, borderColor: colors.border }]}
                        placeholder="Re-enter password"
                        placeholderTextColor={colors.textSubtle}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        autoCapitalize="none"
                      />
                    </View>
                  </>
                )}

                {/* Send OTP Button */}
                <Pressable
                  style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                  onPress={handleSendOTP}
                  disabled={operationLoading}
                >
                  {operationLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <MaterialIcons name="mail" size={20} color="#FFFFFF" />
                      <Text style={styles.primaryButtonText}>
                        {mode === 'register' ? 'Send Verification Code' : 'Send Login Code'}
                      </Text>
                    </>
                  )}
                </Pressable>

                {/* Password Login (Login mode only) */}
                {mode === 'login' && (
                  <>
                    <View style={styles.divider}>
                      <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                      <Text style={[styles.dividerText, { color: colors.textSubtle }]}>OR</Text>
                      <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={[styles.label, { color: colors.textSecondary }]}>Password</Text>
                      <TextInput
                        style={[styles.input, { backgroundColor: colors.surfaceElevated, color: colors.textPrimary, borderColor: colors.border }]}
                        placeholder="Enter your password"
                        placeholderTextColor={colors.textSubtle}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                      />
                    </View>

                    <Pressable
                      style={[styles.secondaryButton, { borderColor: colors.border }]}
                      onPress={handlePasswordLogin}
                      disabled={operationLoading}
                    >
                      {operationLoading ? (
                        <ActivityIndicator color={colors.primary} />
                      ) : (
                        <>
                          <MaterialIcons name="lock" size={20} color={colors.primary} />
                          <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>
                            Login with Password
                          </Text>
                        </>
                      )}
                    </Pressable>
                  </>
                )}
              </>
            ) : (
              <>
                {/* OTP Input */}
                <Text style={[styles.otpInfo, { color: colors.textSecondary }]}>
                  Enter the 4-digit code sent to {email}
                </Text>

                <TextInput
                  style={[styles.otpInput, { backgroundColor: colors.surfaceElevated, color: colors.textPrimary, borderColor: colors.border }]}
                  placeholder="0000"
                  placeholderTextColor={colors.textSubtle}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={4}
                  autoFocus
                />

                <Pressable
                  style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                  onPress={handleVerifyOTP}
                  disabled={operationLoading}
                >
                  {operationLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.primaryButtonText}>
                      {mode === 'register' ? 'Create Account' : 'Login'}
                    </Text>
                  )}
                </Pressable>

                <Pressable
                  style={styles.backButton}
                  onPress={() => {
                    setStep('email');
                    setOtp('');
                  }}
                >
                  <Text style={[styles.backButtonText, { color: colors.textSecondary }]}>
                    Back to email
                  </Text>
                </Pressable>
              </>
            )}
          </View>

          <View style={{ height: spacing.xxxl }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: spacing.xxxl,
    marginBottom: spacing.xxl,
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  appName: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xs,
  },
  tagline: {
    fontSize: typography.sizes.md,
  },
  modeToggle: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  modeButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    alignItems: 'center',
  },
  modeText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
  form: {
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.sm,
  },
  input: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    fontSize: typography.sizes.md,
    borderWidth: 1,
  },
  otpInfo: {
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontSize: typography.sizes.sm,
  },
  otpInput: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    fontSize: 32,
    fontWeight: typography.weights.bold,
    textAlign: 'center',
    letterSpacing: 16,
    marginBottom: spacing.lg,
    borderWidth: 2,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    marginTop: spacing.md,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    marginTop: spacing.md,
  },
  secondaryButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    fontSize: typography.sizes.sm,
  },
  backButton: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  backButtonText: {
    fontSize: typography.sizes.sm,
  },
});
