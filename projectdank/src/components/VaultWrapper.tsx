import { useEffect, useState } from "react";
import ProtectedRoute from "./ProtectedRoute";
import Vault from "./Vault";
import api from "../Api";

export default function VaultWrapper() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await api.get("/auth/check", { withCredentials: true });
      setIsLoggedIn(res.data.loggedIn);
    } catch (err) {
      setIsLoggedIn(false);
    }
  };

  checkAuth();
}, []);


  if (isLoggedIn === null) return <div>Loading...</div>;

  return (
    <ProtectedRoute isLoggedIn={isLoggedIn}>
      <Vault />
    </ProtectedRoute>
  );
}
