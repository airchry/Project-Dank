import { createContext, useEffect, useState } from "react"
import type { ReactNode } from "react"
import api from "../Api"

type User = {
  id: string
  username: string
  role: "admin" | "member"
}

type AuthContextType = {
  user: User | null
  loading: boolean
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/auth/check", {
      withCredentials: true
    })
    .then(res => {
      if (res.data.loggedIn) {
        setUser(res.data.user)
      }
    })
    .finally(() => setLoading(false))
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
