let ENDPOINT;
if(process.env.NODE_ENV === 'production'){
  ENDPOINT = "https://booknest-1-hiti.onrender.com";
} else {
  ENDPOINT = "http://localhost:5001";
}

export { ENDPOINT };
