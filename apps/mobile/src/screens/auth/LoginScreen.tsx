import React, { useState } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator } from 'react-native';
import { useLogin } from '../../hooks/auth/useLogin';

const LoginScreen = () => {
  const { performLogin, isLoading, error } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await performLogin({ email, password });
    } catch (e) {
      // Error is already handled in the hook
    }
  };

  return (
    <View style={{ padding: 20, flex: 1, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>
      
      {error && <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>}

      <TextInput 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        autoCapitalize="none" 
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 }}
      />
      <TextInput 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20, borderRadius: 5 }}
      />
      
      {isLoading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
    </View>
  );
};

export default LoginScreen;
