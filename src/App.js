import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Routing from './routing/Routing';
function App() {
  return (
    <BrowserRouter>
      <ToastContainer autoClose={4000} />
      <Routing />
    </BrowserRouter>
  );
}

export default App;
