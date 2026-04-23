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
import { Spinner } from "../ui/spinner"

export default function Signup() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [localError, setLocalError] = useState("")
  const [isRedirecting, setIsRedirecting] = useState(false)

  const navigate = useNavigate()
  const { signup, isLoading, clearError, token } = useAuth()

  useEffect(() => {
    if (token && !isLoading) {
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

  // ✅ Retry wrapper (handles Gemini 503)
  const retrySignup = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await signup(
          username.trim(),
          email.trim(),
          password
        )
      } catch (err: any) {
        if (!err?.message?.includes("503") || i === retries - 1) {
          throw err
        }
        await new Promise((res) => setTimeout(res, 1000 * (i + 1)))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")
    clearError()

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      setLocalError("Please fill in all fields")
      return
    }

    if (username.trim().length < 3) {
      setLocalError("Username must be at least 3 characters")
      return
    }

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
      await retrySignup()
      navigate("/chat")
    } catch (err: any) {
      console.error("Signup error:", err)

      if (err?.message?.includes("503")) {
        setLocalError(
          "Server is busy right now. Please try again in a few seconds."
        )
        return
      }

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Signup failed. Please try again."

      setLocalError(message)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-12 h-12 text-gray-500" />
      </div>
    )
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
          <CardTitle className="text-2xl font-bold text-center">
            Create Account
          </CardTitle>
          <CardDescription className="text-center">
            Join GPT Clone and start chatting
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            {localError && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded text-sm text-red-700">
                ⚠️ {localError}
              </div>
            )}

            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)} // ✅ FIXED
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // ✅ FIXED
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !isFormValid()}
              className="w-full"
            >
              {isLoading ? "Creating..." : "Create Account"}
            </Button>

            <p className="text-center text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsRedirecting(true)
                  setTimeout(() => navigate("/"), 800)
                }}
                disabled={isRedirecting}
                className="text-purple-600 font-semibold"
              >
                {isRedirecting ? <Spinner/> : "Sign in"}
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}