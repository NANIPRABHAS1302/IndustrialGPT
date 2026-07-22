import { AppProviders } from '@/components/providers/AppProviders';
import { AppRoutes } from '@/routes';
import { AuthProvider } from '@/contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </AuthProvider>
  );
}

export default App;
