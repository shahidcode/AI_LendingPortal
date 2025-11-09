import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { CssBaseline, Container, ThemeProvider, createTheme } from '@mui/material'
import store from './store/store'
import App from './App'

const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
})

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Container>
          <App />
        </Container>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
)
