import { Toaster } from 'react-hot-toast'
import TodoPage from './pages/TodoPage'

function App() {
  return (
    <>
      <TodoPage />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: {
            borderRadius: '12px',
            background: '#0f172a',
            color: '#fff',
            fontSize: '14px',
          },
        }}
      />
    </>
  )
}

export default App