import { useState } from "react";
import { aptos } from "../config/movement";
import { MOVEMENT_CONTRACT_ADDRESS } from "../config/constants";
import { addressesEqual } from "../utils/helper";
import toast from "react-hot-toast";

export const useEscrows = () => {
  const [escrows, setEscrows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllEscrows = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get the EscrowStore resource to find next_id
      const resource = await aptos.getAccountResource({
        accountAddress: MOVEMENT_CONTRACT_ADDRESS,
        resourceType: `${MOVEMENT_CONTRACT_ADDRESS}::propachain::EscrowStore`,
      });

      const { next_id } = resource;
      const totalEscrows = parseInt(next_id) - 1;

      console.log(`Total escrows to fetch: ${totalEscrows}`);

      if (totalEscrows === 0) {
        setEscrows([]);
        return [];
      }

      // Fetch all escrows in batches
      const allEscrows = [];
      const batchSize = 10;

      for (let i = 1; i <= totalEscrows; i += batchSize) {
        const batch = [];
        for (let j = i; j < i + batchSize && j <= totalEscrows; j++) {
          batch.push(
            aptos
              .view({
                payload: {
                  function: `${MOVEMENT_CONTRACT_ADDRESS}::propachain::get_escrow`,
                  functionArguments: [MOVEMENT_CONTRACT_ADDRESS, j],
                  typeArguments: [],
                },
              })
              .catch((err) => {
                console.warn(`Failed to fetch escrow ${j}:`, err);
                return null;
              })
          );
        }

        const batchResults = await Promise.all(batch);
        batchResults.forEach((result, index) => {
          if (result && result[0]) {
            allEscrows.push({
              id: i + index,
              ...result[0],
            });
          }
        });
      }

      console.log(`Successfully fetched ${allEscrows.length} escrows`);
      setEscrows(allEscrows);
      return allEscrows;
    } catch (err) {
      const errorMessage = err?.message || "Failed to fetch escrows";
      setError(errorMessage);
      console.error("Error fetching escrows:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchUserEscrows = async (userAddress) => {
    try {
      const allEscrows = await fetchAllEscrows();

      // Filter escrows where user is buyer_renter or seller_landlord
      const userEscrows = allEscrows.filter(
        (escrow) =>
          addressesEqual(escrow.buyer_renter, userAddress) ||
          addressesEqual(escrow.seller_landlord, userAddress)
      );

      console.log(`Found ${userEscrows.length} escrows for user`);
      return userEscrows;
    } catch (err) {
      const errorMessage = "Failed to fetch user escrows";
      console.error(errorMessage, err);
      toast.error(errorMessage);
      return [];
    }
  };

  const fetchEscrowById = async (escrowId) => {
    try {
      const escrow = await aptos.view({
        payload: {
          function: `${MOVEMENT_CONTRACT_ADDRESS}::propachain::get_escrow`,
          functionArguments: [MOVEMENT_CONTRACT_ADDRESS, escrowId],
          typeArguments: [],
        },
      });

      if (escrow && escrow[0]) {
        return {
          id: escrowId,
          ...escrow[0],
        };
      }
      return null;
    } catch (err) {
      console.error(`Failed to fetch escrow ${escrowId}:`, err);
      throw err;
    }
  };

  return {
    escrows,
    loading,
    error,
    fetchAllEscrows,
    fetchUserEscrows,
    fetchEscrowById,
  };
};
