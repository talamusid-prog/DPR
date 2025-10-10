import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Analytics } from "@vercel/analytics/react";
import ErrorBoundary from "./components/ErrorBoundary";
import { useTheme } from "./hooks/useTheme";
import { useMobileOptimization } from "./lib/mobileOptimization";
import { useMobileImageOptimization } from "./lib/imageOptimizationMobile";

// Critical components - load immediately
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load non-critical components
const Blog = lazy(() => import("./pages/Blog"));
const Admin = lazy(() => import("./pages/Admin"));
const BlogDetail = lazy(() => import("./components/BlogDetail"));
const CreateArticle = lazy(() => import("./pages/CreateArticle"));
const EditArticle = lazy(() => import("./pages/EditArticle"));
const AdminGallery = lazy(() => import("./pages/AdminGallery"));
const AdminAspirasi = lazy(() => import("./pages/AdminAspirasi"));
const AdminKalenderPage = lazy(() => import("./pages/AdminKalenderPage"));
const Dokumentasi = lazy(() => import("./pages/Dokumentasi"));
const Registration = lazy(() => import("./pages/Registration"));
const AspirasiPage = lazy(() => import("./pages/AspirasiPage"));
const KalenderPage = lazy(() => import("./pages/KalenderPage"));
const ProfilPage = lazy(() => import("./pages/ProfilPage"));
const ColorSettingsPage = lazy(() => import("./pages/ColorSettingsPage"));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient();

const App = () => {
  // Initialize global theme
  useTheme();
  
  // Mobile optimization
  useMobileOptimization();
  useMobileImageOptimization();

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Suspense fallback={<LoadingSpinner />}>
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
              </Suspense>
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
