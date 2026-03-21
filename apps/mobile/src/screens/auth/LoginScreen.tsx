import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { useAuth } from '../../context/auth/AuthContext';

const LoginScreen = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={() => login(email, password)} />
    </View>
  );
};

export default LoginScreen;