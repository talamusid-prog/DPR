import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Analytics } from "@vercel/analytics/react";
import ErrorBoundary from "./components/ErrorBoundary";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Blog from "./pages/Blog";
import BlogDetail from "./components/BlogDetail";
import CreateArticle from "./pages/CreateArticle";
import EditArticle from "./pages/EditArticle";
import AdminPortfolio from "./pages/AdminPortfolio";
import AdminGallery from "./pages/AdminGallery";
import Portfolio from "./pages/Portfolio";
import PortfolioDetail from "./components/PortfolioDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
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
              <Route path="/admin-portfolio" element={<AdminPortfolio />} />
              <Route path="/admin-gallery" element={<AdminGallery />} />
              <Route path="/create-article" element={<CreateArticle />} />
              <Route path="/edit-article/:slug" element={<EditArticle />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/portfolio/:slug" element={<PortfolioDetail />} />
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

export default App;
