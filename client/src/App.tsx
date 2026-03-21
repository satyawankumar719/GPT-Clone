import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import DashBoard from "./components/Dashboard/DashBoard"

import ChatContainer from "./components/ChatContainer/ChatContainer"
import { HistoryProvider } from "./store/HistoryContext"
import Login from "./components/LoginSignup/Login"
function App() {
  return (
    <HistoryProvider>
      <>
        {/* 🔥 Fixed Header */}
    

        {/* 🔥 Main Content */}
     <div className=" h-screen overflow-hidden">
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route element={<DashBoard />}>
          <Route path="/" element={<ChatContainer />} />
        </Route>
      </Routes>
    </Router>
  </div>
      </>
    </HistoryProvider>
  )
}

export default App