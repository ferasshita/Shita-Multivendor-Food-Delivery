export default function getEnv(env: "DEV" | "STAGE" | "PROD") {
  switch (env) {
    case "DEV":
      return {
        SERVER_URL:
          "https://v1-api-shita-multivendor-develop.up.railway.app/",
        WS_SERVER_URL:
          "wss://v1-api-shita-multivendor-develop.up.railway.app/",
      };
    case "STAGE":
      return {
        SERVER_URL: "https://v1-api-shita-multivendor-stage.up.railway.app/",
        WS_SERVER_URL: "wss://v1-api-shita-multivendor-stage.up.railway.app/",
      };
    case "PROD":
      return {
        SERVER_URL: "https://shita-multivendor.up.railway.app/",
        WS_SERVER_URL: "wss://shita-multivendor.up.railway.app/",
      };
    default:
      return {
        SERVER_URL: "https://shita-multivendor.up.railway.app/",
        WS_SERVER_URL: "wss://shita-multivendor.up.railway.app/",

        // SERVER_URL: "http://localhost:8001/",
        // WS_SERVER_URL: "ws://localhost:8001/",
      };
  }
}
