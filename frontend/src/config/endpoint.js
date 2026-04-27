const ENDPOINT =
	import.meta.env.DEV
		? (import.meta.env.VITE_LOCAL_API || import.meta.env.VITE_API_URL)
		: import.meta.env.VITE_API_URL;

export { ENDPOINT };
