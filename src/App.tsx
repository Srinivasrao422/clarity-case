import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Auth from "./pages/Auth.tsx";
import Portal from "./pages/Portal.tsx";

import { CitizenLayout } from "./components/layouts/CitizenLayout.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Raise from "./pages/Raise.tsx";
import Track from "./pages/Track.tsx";
import Assistant from "./pages/Assistant.tsx";
import Profile from "./pages/citizen/Profile.tsx";

import { AdminLayout } from "./components/layouts/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import Complaints from "./pages/admin/Complaints.tsx";
import Escalations from "./pages/admin/Escalations.tsx";
import UsersPage from "./pages/admin/UsersPage.tsx";
import Reports from "./pages/admin/Reports.tsx";
import AdminSettings from "./pages/admin/AdminSettings.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/portal" element={<Portal />} />

          {/* Citizen Portal */}
          <Route path="/citizen" element={<CitizenLayout />}>
            <Route index element={<Navigate to="/citizen/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="raise" element={<Raise />} />
            <Route path="track" element={<Track />} />
            <Route path="assistant" element={<Assistant />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Admin Portal */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="complaints" element={<Complaints />} />
            <Route path="escalations" element={<Escalations />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Legacy redirects */}
          <Route path="/dashboard" element={<Navigate to="/citizen/dashboard" replace />} />
          <Route path="/raise" element={<Navigate to="/citizen/raise" replace />} />
          <Route path="/track" element={<Navigate to="/citizen/track" replace />} />
          <Route path="/assistant" element={<Navigate to="/citizen/assistant" replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
