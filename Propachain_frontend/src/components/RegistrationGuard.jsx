import { useEffect, useState } from "react";
import { useUserProfile } from "../hooks/useUserProfile";
import { useMovementWallet } from "../hooks/useMovementWallet";
import { RegistrationModal } from "./features/RegistrationModal";
import { Loader2 } from "lucide-react";

export const RegistrationGuard = ({ children }) => {
  const { isConnected } = useMovementWallet();
  const { isRegistered, checking, registerUser, loading } = useUserProfile();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Show registration modal if user is connected but not registered
    if (isConnected && !checking && !isRegistered) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [isConnected, checking, isRegistered]);

  const handleRegister = async (userData) => {
    const success = await registerUser(userData);
    if (success) {
      setShowModal(false);
    }
    return success;
  };

  // Show loading while checking registration
  if (isConnected && checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Checking your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      <RegistrationModal
        isOpen={showModal}
        onClose={() => {
          // Don't allow closing if not registered
          if (!isRegistered) {
            return;
          }
          setShowModal(false);
        }}
        onRegister={handleRegister}
        loading={loading}
      />
    </>
  );
};
