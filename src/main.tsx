import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ContentProvider } from "./context/ContentContext.jsx";

// ✅ IMPORT AOS
import AOS from 'aos';
import 'aos/dist/aos.css'; // ← THIS WAS MISSING!

// ✅ Initialize AOS with settings
AOS.init({
  duration: 1200,
  easing: 'ease-in-out',
  once: true,
  offset: 120,
  delay: 50,
});

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <ContentProvider>
        <App />
      </ContentProvider>
    </AuthProvider>
  </BrowserRouter>
);
