import { useState } from "react";
import { aptos } from "../config/movement";
import { MOVEMENT_CONTRACT_ADDRESS } from "../config/constants";
import { addressesEqual, formatPropertyData } from "../utils/helper";
import toast from "react-hot-toast";

export const useFetchProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      // Method 1: Get account resource to access the PropertyListingsStore
      const resource = await aptos.getAccountResource({
        accountAddress: MOVEMENT_CONTRACT_ADDRESS,
        resourceType: `${MOVEMENT_CONTRACT_ADDRESS}::propachain::PropertyListingsStore`,
      });

      // The resource contains the SimpleMap handle and next_id
      const { next_id } = resource;

      console.log(`Total properties to fetch: ${next_id - 1}`);

      // Method 2: Fetch properties in batches using Promise.all for better performance
      const allProperties = [];
      const batchSize = 10; // Fetch 10 properties at a time
      const totalProperties = parseInt(next_id) - 1;

      for (let i = 1; i <= totalProperties; i += batchSize) {
        const batch = [];
        for (let j = i; j < i + batchSize && j <= totalProperties; j++) {
          batch.push(
            aptos
              .view({
                payload: {
                  function: `${MOVEMENT_CONTRACT_ADDRESS}::propachain::get_property`,
                  functionArguments: [MOVEMENT_CONTRACT_ADDRESS, j],
                  typeArguments: [],
                },
              })
              .catch((err) => {
                console.warn(`Failed to fetch property ${j}:`, err);
                return null;
              })
          );
        }

        // Wait for batch to complete
        const batchResults = await Promise.all(batch);

        // Add valid properties to the list with formatting
        batchResults.forEach((result, index) => {
          if (result && result[0]) {
            const rawProperty = {
              id: i + index,
              ...result[0],
            };
            const formattedProperty = formatPropertyData(rawProperty);
            if (formattedProperty) {
              allProperties.push(formattedProperty);
            }
          }
        });
      }

      console.log(`Successfully fetched ${allProperties.length} properties`);
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

      if (property && property[0]) {
        const rawProperty = { id: propertyId, ...property[0] };
        return formatPropertyData(rawProperty);
      }
      return null;
    } catch (err) {
      const errorMessage = `Failed to fetch property ${propertyId}`;
      console.error(errorMessage, err);
      throw err;
    }
  };

  const fetchPropertiesByOwner = async (ownerAddress) => {
    try {
      const allProperties = await fetchAllProperties();
      const ownerProperties = allProperties.filter((prop) =>
        addressesEqual(prop.owner, ownerAddress)
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
