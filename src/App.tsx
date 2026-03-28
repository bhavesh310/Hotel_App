import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { CustomCursor } from "@/components/CustomCursor";
import { GrainOverlay } from "@/components/GrainOverlay";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import Settings from './pages/Settings';
import HotelDetail from "./pages/HotelDetail";
import Booking from "./pages/Booking";
import GroupBooking from "./pages/GroupBooking";
import Stay from "./pages/Stay";
import Concierge from "./pages/Concierge";
import Rewards from "./pages/Rewards";
import Corporate from "./pages/Corporate";
import Social from "./pages/Social";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CustomCursor />
        <GrainOverlay />
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/hotel/:id" element={<HotelDetail />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/group/:id" element={<GroupBooking />} />
            <Route path="/stay" element={<Stay />} />
            <Route path="/concierge" element={<Concierge />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/corporate" element={<Corporate />} />
            <Route path="/social" element={<Social />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
