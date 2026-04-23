import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import DashBoard from "./components/Dashboard/DashBoard"
import ChatContainer from "./components/ChatContainer/ChatContainer"
import { HistoryProvider } from "./store/HistoryContext"
import { AuthProvider } from "./store/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"
import Login from "./components/LoginSignup/Login"
import Signup from "./components/LoginSignup/Signup"

function App() {
  return (
    <AuthProvider>
      <HistoryProvider>
        <div className="h-screen overflow-hidden">
          <Router>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                element={
                  <ProtectedRoute>
                    <DashBoard />
                  </ProtectedRoute>
                }
              >
                <Route path="/chat" element={<ChatContainer />} />
              </Route>
            </Routes>
          </Router>
        </div>
      </HistoryProvider>
    </AuthProvider>
  )
}

export default App