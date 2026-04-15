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

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [localError, setLocalError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const navigate = useNavigate()
  const { login, isLoading, error, clearError, token } = useAuth()

  // Redirect if already logged in
  useEffect(() => {
    if (token && !isLoading) {
      navigate("/chat", { replace: true })
    }
  }, [token, isLoading, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isSubmitting || isLoading) return

    setLocalError("")
    clearError()

    if (!email.trim() || !password) {
      setLocalError("Please fill in all fields")
      return
    }

    try {
      setIsSubmitting(true)
      await login(email, password)
      navigate("/chat")
    } catch (err) {
      setLocalError("Login failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
    }
  }

  // Show spinner when checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-12 h-12 text-gray-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-2 pb-4">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              🤖
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your GPT Clone account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {(localError || error) && (
              <div className="animate-pulse p-4 bg-red-50 border-l-4 border-red-500 rounded text-sm text-red-700 flex items-start gap-2">
                <span className="text-lg">⚠️</span>
                <div>{localError || error}</div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                onKeyDown={handleKeyDown}
                disabled={isLoading || isSubmitting}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading || isSubmitting}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-10 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              disabled={
                isLoading || isSubmitting || !email.trim() || !password
              }
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Spinner className="w-4 h-4" />
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Signup Redirect */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsRedirecting(true)
                    setTimeout(() => {
                       navigate("/signup")
                    }, 1000);
                   
                  }}
                  className="font-semibold text-blue-600 hover:text-blue-700 transition"
                  disabled={isRedirecting}
                >
                  {isRedirecting ? (
                    <span className="inline-flex items-center gap-2">
                      <Spinner className="w-4 h-4" />
                      
                    </span>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}