import { useEffect, useState } from "react";
import { useUserProfile } from "../hooks/useUserProfile";
import { useMovementWallet } from "../hooks/useMovementWallet";
import { RegistrationModal } from "./features/RegistrationModal";
import { Loader2 } from "lucide-react";

export const RegistrationGuard = ({ children }) => {
  const { isConnected, walletAddress, disconnectWallet } = useMovementWallet();
  const { isRegistered, checking, registerUser, loading } = useUserProfile();
  const [showModal, setShowModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Reset dismissed state when wallet disconnects
    if (!isConnected) {
      setDismissed(false);
    }
  }, [isConnected]);

  useEffect(() => {
    // Show registration modal if user is connected, not registered, and hasn't dismissed it
    if (isConnected && !checking && !isRegistered && !dismissed) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [isConnected, checking, isRegistered, walletAddress, dismissed]);

  const handleRegister = async (userData) => {
    const success = await registerUser(userData);
    if (success) {
      setShowModal(false);
    }
    return success;
  };

  const handleClose = async () => {
    // Just close the modal and mark as dismissed so it doesn't pop up again this session
    setDismissed(true);
    setShowModal(false);
  };

  // Show loading while checking registration
  if (isConnected && checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Loader2
              className="h-8 w-8 text-teal-700 animate-spin"
              strokeWidth={2.5}
            />
          </div>
          <p className="text-zinc-900 font-semibold text-lg">
            Checking your profile...
          </p>
          <p className="text-zinc-600 text-sm mt-1">Please wait a moment</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      <RegistrationModal
        isOpen={showModal}
        onClose={handleClose}
        onRegister={handleRegister}
        loading={loading}
      />
    </>
  );
};
