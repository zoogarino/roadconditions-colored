import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WebPostView from "./pages/WebPostView";
import RoadConditionsSite from "./pages/web/RoadConditionsSite";
import WebPostDetail from "./pages/web/WebPostDetail";
import WebCreatePost from "./pages/web/WebCreatePost";
import WhatsAppPreview from "./pages/previews/WhatsAppPreview";
import FacebookPreview from "./pages/previews/FacebookPreview";
import OGImagePreview from "./pages/previews/OGImagePreview";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/road-conditions" element={<RoadConditionsSite />} />
          <Route path="/road-conditions/empty" element={<RoadConditionsSite empty />} />

          <Route path="/road-conditions/post/:slug" element={<WebPostDetail />} />
          {/* Web Fallback View (unchanged shared-post landing page for non-app users) */}
          <Route path="/share/road-conditions/post/:id" element={<WebPostView />} />

          <Route path="/previews/whatsapp" element={<WhatsAppPreview />} />
          <Route path="/previews/facebook" element={<FacebookPreview />} />
          <Route path="/previews/og-image" element={<OGImagePreview />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
