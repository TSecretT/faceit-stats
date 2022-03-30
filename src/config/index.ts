const DEV: boolean = window.location.host === "faceit.tips"? false : true;

const config: any = {
    DEV,
    VERSION: "0.0.3",
    WELCOME_MESSAGE: "Welcome to Faceit Tips! This app is currently in Beta version, meaning some features might not work as they should, or they might be added and removed in the future. Enjoy!",
    BASE_URL: DEV ? "http://localhost:8000" : "https://api.faceit.tips"
}

export default config;