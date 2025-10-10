import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Analytics } from "@vercel/analytics/react";
import ErrorBoundary from "./components/ErrorBoundary";
import { useTheme } from "./hooks/useTheme";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Blog from "./pages/Blog";
import BlogDetail from "./components/BlogDetail";
import CreateArticle from "./pages/CreateArticle";
import EditArticle from "./pages/EditArticle";
import AdminGallery from "./pages/AdminGallery";
import AdminAspirasi from "./pages/AdminAspirasi";
import AdminKalenderPage from "./pages/AdminKalenderPage";
import Dokumentasi from "./pages/Dokumentasi";
import NotFound from "./pages/NotFound";
import Registration from "./pages/Registration";
import AspirasiPage from "./pages/AspirasiPage";
import KalenderPage from "./pages/KalenderPage";
import ProfilPage from "./pages/ProfilPage";
import ColorSettingsPage from "./pages/ColorSettingsPage";

const queryClient = new QueryClient();

const App = () => {
  // Initialize global theme
  useTheme();

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin-gallery" element={<AdminGallery />} />
                <Route path="/admin-aspirasi" element={<AdminAspirasi />} />
                <Route path="/admin-kalender" element={<AdminKalenderPage />} />
                <Route path="/create-article" element={<CreateArticle />} />
                <Route path="/edit-article/:slug" element={<EditArticle />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/dokumentasi" element={<Dokumentasi />} />
                <Route path="/dokumentasi/:slug" element={<BlogDetail />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/aspirasi" element={<AspirasiPage />} />
                <Route path="/kalender" element={<KalenderPage />} />
                <Route path="/profil" element={<ProfilPage />} />
                <Route path="/pengaturan-warna" element={<ColorSettingsPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            {/* Analytics component untuk melacak pengunjung dan page views */}
            <Analytics />
          </TooltipProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
