import {QueryClient, QueryClientProvider} from 'react-query';
import {Provider as PaperProvider} from 'react-native-paper';

import {AuthProvider} from './src/shared/auth/contexts/auth.context';
import {FriendsProvider} from './src/shared/friends/contexts/friends.context';
import Screens from './src/screens';

function App(): JSX.Element {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>
        <FriendsProvider>
          <PaperProvider>
            <Screens />
          </PaperProvider>
        </FriendsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
