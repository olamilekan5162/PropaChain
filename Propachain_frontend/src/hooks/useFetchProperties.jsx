import { useState, useEffect } from "react";
import { aptos } from "../config/movement";
import { MOVEMENT_CONTRACT_ADDRESS } from "../config/constants";
import toast from "react-hot-toast";

export const useFetchProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const allProperties = [];

      // First, get the number of properties by querying the next_id
      // We'll try fetching properties one by one until we get an error
      // This is a workaround since the contract doesn't expose a get_all_properties function

      // Start from property ID 1 (assuming IDs start at 1)
      let propertyId = 1;
      let foundProperties = 0;
      const maxAttempts = 1000; // Safety limit

      while (foundProperties < maxAttempts) {
        try {
          // Call the view function to get property details
          const property = await aptos.view({
            payload: {
              function: `${MOVEMENT_CONTRACT_ADDRESS}::propachain::get_property`,
              functionArguments: [MOVEMENT_CONTRACT_ADDRESS, propertyId],
              typeArguments: [],
            },
          });

          if (property && property[0]) {
            // Property exists
            allProperties.push({
              id: propertyId,
              ...property[0],
            });
            propertyId++;
          } else {
            // Property doesn't exist, stop searching
            break;
          }
        } catch (err) {
          // This property ID doesn't exist, try moving forward
          // Or we've reached the end
          if (allProperties.length === 0) {
            // No properties found at all
            break;
          }
          // We might have found all properties
          break;
        }
      }
      console.log(allProperties);

      setProperties(allProperties);
      return allProperties;
    } catch (err) {
      const errorMessage = err?.message || "Failed to fetch properties";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error fetching properties:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchPropertyById = async (propertyId) => {
    try {
      const property = await aptos.view({
        payload: {
          function: `${MOVEMENT_CONTRACT_ADDRESS}::propachain::get_property`,
          functionArguments: [MOVEMENT_CONTRACT_ADDRESS, propertyId],
          typeArguments: [],
        },
      });

      return property[0];
    } catch (err) {
      const errorMessage = `Failed to fetch property ${propertyId}`;
      console.error(errorMessage, err);
      throw err;
    }
  };

  const fetchPropertiesByOwner = async (ownerAddress) => {
    try {
      const allProperties = await fetchAllProperties();
      const ownerProperties = allProperties.filter(
        (prop) => prop.owner === ownerAddress
      );
      return ownerProperties;
    } catch (err) {
      const errorMessage = "Failed to fetch owner properties";
      console.error(errorMessage, err);
      throw err;
    }
  };

  const fetchAvailableProperties = async () => {
    try {
      const allProperties = await fetchAllProperties();
      // Filter properties with status = STATUS_AVAILABLE (1)
      const availableProperties = allProperties.filter(
        (prop) => prop.status === 1
      );
      return availableProperties;
    } catch (err) {
      const errorMessage = "Failed to fetch available properties";
      console.error(errorMessage, err);
      throw err;
    }
  };

  return {
    properties,
    loading,
    error,
    fetchAllProperties,
    fetchPropertyById,
    fetchPropertiesByOwner,
    fetchAvailableProperties,
  };
};
