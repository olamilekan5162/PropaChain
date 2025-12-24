import { useState } from "react";
import { aptos } from "../config/movement";
import { MOVEMENT_CONTRACT_ADDRESS } from "../config/constants";

export const usePropertyOperations = () => {
  const [loading, setLoading] = useState(false);

  const getPropertyById = async (propertyId) => {
    try {
      setLoading(true);
      const property = await aptos.view({
        payload: {
          function: `${MOVEMENT_CONTRACT_ADDRESS}::propachain::get_property`,
          functionArguments: [MOVEMENT_CONTRACT_ADDRESS, propertyId.toString()],
          typeArguments: [],
        },
      });

      return property[0];
    } catch (err) {
      console.error(`Error fetching property ${propertyId}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPropertyStatus = async (propertyId) => {
    try {
      const status = await aptos.view({
        payload: {
          function: `${MOVEMENT_CONTRACT_ADDRESS}::propachain::get_property_status`,
          functionArguments: [MOVEMENT_CONTRACT_ADDRESS, propertyId.toString()],
          typeArguments: [],
        },
      });

      return status[0];
    } catch (err) {
      console.error(`Error fetching property status:`, err);
      throw err;
    }
  };

  const getPropertyOwner = async (propertyId) => {
    try {
      const owner = await aptos.view({
        payload: {
          function: `${MOVEMENT_CONTRACT_ADDRESS}::propachain::get_property_owner`,
          functionArguments: [MOVEMENT_CONTRACT_ADDRESS, propertyId.toString()],
          typeArguments: [],
        },
      });

      return owner[0];
    } catch (err) {
      console.error(`Error fetching property owner:`, err);
      throw err;
    }
  };

  const getPropertyPrice = async (propertyId) => {
    try {
      const price = await aptos.view({
        payload: {
          function: `${MOVEMENT_CONTRACT_ADDRESS}::propachain::get_property_price`,
          functionArguments: [MOVEMENT_CONTRACT_ADDRESS, propertyId.toString()],
          typeArguments: [],
        },
      });

      return price[0];
    } catch (err) {
      console.error(`Error fetching property price:`, err);
      throw err;
    }
  };

  return {
    loading,
    getPropertyById,
    getPropertyStatus,
    getPropertyOwner,
    getPropertyPrice,
  };
};
