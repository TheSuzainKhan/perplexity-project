import { RouterProvider } from "react-router"
import { router } from "./app.routes"
import { useAuth } from "../features/auth/hook/useAuth"
import { useEffect } from "react"
import ToastViewport from "./components/ToastViewport"


function App() {
  

  const auth = useAuth()

  useEffect(() => {
    auth.handleGetMe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <ToastViewport />
      <RouterProvider router={router} />
    </>
  )
}

export default App
