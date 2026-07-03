import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import LandingPage from "./LandingPage";
import AuthPage from "./AuthPage";
import GenderSelect from "./GenderSelect";
import MainApp from "./Camerino";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gender, setGender] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) return null;

  if (!user) {
    if (showAuth) return <AuthPage onBack={() => setShowAuth(false)} />;
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }

  if (!gender) return <GenderSelect onSelect={setGender} user={user} />;

  return <MainApp gender={gender} user={user} onChangeGender={() => setGender(null)} />;
}