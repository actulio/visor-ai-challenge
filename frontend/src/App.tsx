import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import RoutesWithAnimation from './components/RoutesWithAnimation';
import AppContextProvider from './context/AppContext';

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <AppContextProvider>
        <RoutesWithAnimation />
      </AppContextProvider>
    </BrowserRouter>
  );
}

export default App;
