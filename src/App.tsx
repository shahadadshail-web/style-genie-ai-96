import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AddItem from "./pages/AddItem";
import GenerateOutfit from "./pages/GenerateOutfit";
import OutfitResults from "./pages/OutfitResults";
import OutfitComposer from "./pages/OutfitComposer";
import MyLooks from "./pages/MyLooks";
import Lookbook from "./pages/Lookbook";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/add" element={<ProtectedRoute><AddItem /></ProtectedRoute>} />
            <Route path="/generate" element={<ProtectedRoute><GenerateOutfit /></ProtectedRoute>} />
            <Route path="/outfit-results" element={<ProtectedRoute><OutfitResults /></ProtectedRoute>} />
            <Route path="/composer" element={<ProtectedRoute><OutfitComposer /></ProtectedRoute>} />
            <Route path="/my-looks" element={<ProtectedRoute><MyLooks /></ProtectedRoute>} />
            <Route path="/lookbook" element={<ProtectedRoute><Lookbook /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
