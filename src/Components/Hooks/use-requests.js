import { useCallback, useState } from "react";

function useRequests(baseURL) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const sendRequest = useCallback(
    async (config, processData) => {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch(baseURL + config.url, {
          method: config.method ? config.method : "GET",
          body: config.body ? config.body : null,
          headers: config.headers ? config.headers : {},
        });

        if (!response.ok) throw new Error("Request Failed");

        const data = await response.json();
        processData(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      }
      setIsLoading(false);
    },
    [baseURL]
  );
  return [sendRequest, isLoading, error];
}

export default useRequests;
