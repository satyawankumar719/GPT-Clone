import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import DashBoard from "./components/Dashboard/DashBoard"
import DashboardContainer from "./components/DashBoardContainer/DashBoardContainer"
import Header from "./components/Header/Header"

function App() {
  return (
    <>
      {/* 🔥 Fixed Header */}
   <div className="fixed top-0 left-0 w-full z-50 h-16">
  <Header />
</div>

      {/* 🔥 Main Content */}
   <div className="pt-16 h-screen overflow-hidden">
  <Router>
    <Routes>
      <Route element={<DashBoard />}>
        <Route path="/" element={<DashboardContainer />} />
      </Route>
    </Routes>
  </Router>
</div>
    </>
  )
}

export default App