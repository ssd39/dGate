export default {
    API: window.location.hostname.includes("vercel") ? "https://dgate.onrender.com" : "http://localhost:3001",
    URL: window.location.hostname.includes("vercel") ? "https://dgate.vercel.app" : "http://localhost:3000"
}