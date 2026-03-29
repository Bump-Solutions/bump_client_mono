import { AuthProvider } from './context/auth/AuthContext';
import { ToastProvider } from './context/notification/ToastContext';
import { RootNavigator } from './navigation/RootNavigator';

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ToastProvider>
  );
}
