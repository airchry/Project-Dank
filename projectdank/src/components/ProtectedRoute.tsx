import type { ReactNode } from "react"
import { Navigate } from "react-router-dom";

type Props = { isLoggedIn: boolean; children: ReactNode };

export default function ProtectedRoute({ isLoggedIn, children }: Props) {
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
}