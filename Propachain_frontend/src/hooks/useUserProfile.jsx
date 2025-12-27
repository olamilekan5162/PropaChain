import { useState, useEffect } from "react";
import { useMovementWallet } from "./useMovementWallet";
import { aptos, CONTRACT_ADDRESS } from "../config/movement";
import toast from "react-hot-toast";

export const useUserProfile = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [checking, setChecking] = useState(true);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { walletAddress, isConnected, signAndSubmitTransaction } =
    useMovementWallet();

  // Check registration status when wallet connects
  useEffect(() => {
    if (walletAddress && isConnected) {
      checkRegistration();
    } else {
      setIsRegistered(false);
      setProfile(null);
      setChecking(false);
    }
  }, [walletAddress, isConnected]);

  const checkRegistration = async () => {
    if (!walletAddress) {
      setChecking(false);
      return;
    }

    try {
      setChecking(true);

      // Check if user has profile
      const hasProfile = await aptos.view({
        payload: {
          function: `${CONTRACT_ADDRESS}::propachain::has_profile`,
          functionArguments: [CONTRACT_ADDRESS, walletAddress],
          typeArguments: [],
        },
      });

      console.log("Has profile:", hasProfile[0]);

      if (hasProfile[0]) {
        // Fetch full profile
        const userProfile = await aptos.view({
          payload: {
            function: `${CONTRACT_ADDRESS}::propachain::get_user_profile`,
            functionArguments: [CONTRACT_ADDRESS, walletAddress],
            typeArguments: [],
          },
        });

        setProfile(userProfile[0]);
        setIsRegistered(true);
      } else {
        setIsRegistered(false);
        setProfile(null);
      }
    } catch (error) {
      console.error("Error checking registration:", error);
      setIsRegistered(false);
      setProfile(null);
    } finally {
      setChecking(false);
    }
  };

  const registerUser = async (userData) => {
    if (!walletAddress) {
      toast.error("Please connect your wallet first");
      return false;
    }

    try {
      setLoading(true);
      const toastId = toast.loading("Registering your account...");

      const transaction = {
        data: {
          function: `${CONTRACT_ADDRESS}::propachain::register_user`,
          typeArguments: [],
          functionArguments: [
            CONTRACT_ADDRESS, // registry_addr
            userData.fullName,
            userData.idType,
            userData.idNumber,
            userData.phoneNumber,
            userData.email,
          ],
        },
      };

      const result = await signAndSubmitTransaction(transaction);

      toast.dismiss(toastId);
      toast.success("Registration successful! Welcome to PropaChain!");
      console.log("Registration successful:", result);

      // Recheck registration status
      await checkRegistration();
      return true;
    } catch (error) {
      const errorMessage = error?.message || "Registration failed";
      toast.error(`Registration failed: ${errorMessage}`);
      console.error("Registration error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    isRegistered,
    checking,
    profile,
    loading,
    registerUser,
    checkRegistration,
  };
};
