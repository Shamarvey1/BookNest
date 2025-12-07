let ENDPOINT;

if (import.meta.env.MODE === "development") {
  ENDPOINT = import.meta.env.VITE_LOCAL_API;
} else {
  ENDPOINT = import.meta.env.VITE_PROD_API;
}

export { ENDPOINT };
