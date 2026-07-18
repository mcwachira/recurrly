import { useAuth, useSignUp } from "@/lib/mock-auth";
import { Link, useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

export default function SignUp() {
  const { signUp } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signUp.password({
        emailAddress,
        password,
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        router.push("/(tabs)" as any);
      }
    } catch (err: any) {
      setError("Sign up failed");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = emailAddress && password && !isLoading;

  if (isSignedIn) {
    return null;
  }

  return (
    <View className="auth-safe-area">
      <ScrollView
        className="auth-scroll"
        contentContainerClassName="auth-content"
      >
        <View className="auth-brand-block">
          <View className="auth-logo-wrap">
            <View className="auth-logo-mark">
              <Text className="auth-logo-mark-text">R</Text>
            </View>
            <View>
              <Text className="auth-wordmark">Recurly</Text>
              <Text className="auth-wordmark-sub">SMART BILLING</Text>
            </View>
          </View>
        </View>

        <Text className="auth-title mt-6">Create account</Text>
        <Text className="auth-subtitle">
          Start managing your subscriptions today
        </Text>

        <View className="auth-card mt-6">
          <View className="auth-form">
            <View className="auth-field">
              <Text className="auth-label">Email</Text>
              <TextInput
                className="auth-input"
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                keyboardType="email-address"
              />
            </View>

            <View className="auth-field">
              <Text className="auth-label">Password</Text>
              <TextInput
                className="auth-input"
                value={password}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
              />
            </View>

            {error ? <Text className="auth-error">{error}</Text> : null}

            <Pressable
              className={`auth-button ${!isFormValid ? "auth-button-disabled" : ""}`}
              onPress={handleSubmit}
              disabled={!isFormValid}
            >
              <Text className="auth-button-text">Create account</Text>
            </Pressable>
          </View>
        </View>

        <View className="auth-link-row">
          <Text className="auth-link-copy">Already have an account? </Text>
          <Link href="/(auth)/sign-in">
            <Text className="auth-link">Sign in</Text>
          </Link>
        </View>
      </ScrollView>
    </View>
  );
}
