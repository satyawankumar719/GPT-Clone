import { useState } from 'react'
import apiClient from '@/api/apiClient';
import { API_CONFIG } from '@/api/apiConfig';
function Login() {
  const [username, setusername] = useState<string>("")
  const [password, setpassword] = useState<string>("")

  function handleLogin() {


console.log("Username:", username);
console.log("Password:", password);
const res = apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
  username,
  password,
})
res.then((res) => {
  console.log("Login successful:", res.data);
})
res.catch((err) => {
  console.error("Login failed:", err.response?.data || err.message);
}); 
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      
      <div className="flex flex-col w-[500px] p-10 gap-5 bg-white rounded-3xl shadow-xl 
                      border border-gray-200
                      transition-all duration-300 
                      hover:shadow-2xl hover:scale-105">

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          Login to Your Account
        </h2>

        <input
          type="text"
          placeholder="Username"
          className="p-2 mb-4 w-full border border-gray-300 rounded-xl
                     focus:outline-none focus:ring-2 focus:ring-blue-400
                     transition-all duration-200"
          onChange={(e) => setusername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="p-2 mb-4 w-full border border-gray-300 rounded-xl
                     focus:outline-none focus:ring-2 focus:ring-blue-400
                     transition-all duration-200"
          onChange={(e) => setpassword(e.target.value)}
        />

        <button
          className="bg-blue-500 text-white py-3 rounded-xl w-full font-semibold
                     shadow-md transition-all duration-300
                     hover:bg-blue-600 hover:shadow-lg hover:-translate-y-1
                     active:scale-95"
          onClick={handleLogin}
        >
          Login
        </button>

      </div>
    </div>
  )
}

export default Login