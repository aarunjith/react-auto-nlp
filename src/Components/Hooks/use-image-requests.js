import { useCallback, useState } from "react";

function useImageRequests(baseURL) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const sendRequest = useCallback(async (config) => {
    setIsLoading(true);
    setError("");
    try {
      const formData = new FormData();
      config.body && formData.append("img", config.body);
      const response = await fetch(baseURL + config.url, {
        method: config.method ? config.method : "GET",
        body: config.body ? formData : null,
        headers: config.headers ? config.headers : {},
      });

      if (!response.ok) throw new Error("Request Failed");

      const data = await response.blob();
      const imageObjectURL = URL.createObjectURL(data);
      setImageUrl(imageObjectURL);
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
    setIsLoading(false);
  }, []);
  return [sendRequest, imageUrl, isLoading, error];
}

export default useImageRequests;
