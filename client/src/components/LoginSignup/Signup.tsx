import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/store/AuthContext"

export default function Signup() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [localError, setLocalError] = useState("")
  const navigate = useNavigate()
  const { signup, isLoading, error, clearError, token } = useAuth()

  // If user is already authenticated, redirect to chat
  useEffect(() => {
    if (token && !isLoading) {
      console.log('User already authenticated, redirecting to chat');
      navigate("/chat", { replace: true })
    }
  }, [token, isLoading, navigate])

  const isFormValid = () => {
    return (
      username.trim().length >= 3 &&
      email.trim().length > 0 &&
      password.length >= 6 &&
      confirmPassword.length >= 6 &&
      password === confirmPassword
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")
    clearError()

    // Validation
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setLocalError("Please fill in all fields")
      return
    }

    if (username.trim().length < 3) {
      setLocalError("Username must be at least 3 characters")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setLocalError("Please enter a valid email address")
      return
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters")
      return
    }

    try {
      console.log('Starting signup for:', email)
      await signup(username, email, password)
      console.log('Signup successful, navigating to chat')
      navigate("/chat")
    } catch (err) {
      console.error('Signup error:', err)
      setLocalError(error || "Signup failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-2 pb-4">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              ✨
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Join GPT Clone and start chatting
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            {(localError || error) && (
              <div className="animate-pulse p-4 bg-red-50 border-l-4 border-red-500 rounded text-sm text-red-700 flex items-start gap-2">
                <span className="text-lg">⚠️</span>
                <div>{localError || error}</div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value.trim())}
                disabled={isLoading}
                className="h-10 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                required
              />
              {username && username.length < 3 && (
                <p className="text-xs text-orange-600 flex items-center gap-1">
                  ℹ️ Minimum 3 characters
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                disabled={isLoading}
                className="h-10 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-10 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                required
              />
              {password && password.length < 6 && (
                <p className="text-xs text-orange-600 flex items-center gap-1">
                  ℹ️ Minimum 6 characters
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className="h-10 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                required
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  ❌ Passwords do not match
                </p>
              )}
              {confirmPassword && password === confirmPassword && password.length >= 6 && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  ✅ Passwords match
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-10 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              disabled={isLoading || !isFormValid()}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="font-semibold text-purple-600 hover:text-purple-700 transition"
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
