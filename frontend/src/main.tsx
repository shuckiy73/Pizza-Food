import ReactDOM from 'react-dom/client'
//import App from './routes/app'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './redux/store'
import { ToastContainer } from 'react-toastify'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { lazy, Suspense } from 'react'

const App = lazy(() => import('./routes/app'))

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Suspense fallback={null}>
            <App />
          </Suspense>
          <ToastContainer />
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  </BrowserRouter>,
)
