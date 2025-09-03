import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { SakuraProvider } from '../Home/context/context.jsx'
import { Provider } from 'react-redux'
import store from '../store/Store.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <SakuraProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SakuraProvider>
  </Provider>
)
