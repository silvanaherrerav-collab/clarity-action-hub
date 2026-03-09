import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import LeaderWelcome from "./pages/LeaderWelcome";
import LeaderContext from "./pages/LeaderContext";
import TeamSetup from "./pages/TeamSetup";
import LeaderTransition from "./pages/LeaderTransition";
import ProcessSelection from "./pages/ProcessSelection";
import ProcessIntake from "./pages/ProcessIntake";
import DiagnosticProcessing from "./pages/DiagnosticProcessing";
import PlanReview from "./pages/PlanReview";
import LeaderSurvey from "./pages/LeaderSurvey";
import LeaderDashboard from "./pages/LeaderDashboard";
import CulturalDiagnosisPage from "./pages/CulturalDiagnosisPage";
import LeaderActions from "./pages/LeaderActions";
import LeaderInvite from "./pages/LeaderInvite";
import DiagnosticGate from "./pages/DiagnosticGate";
import DiagnosticResult from "./pages/DiagnosticResult";
import ClarityFirst from "./pages/ClarityFirst";
import CollaboratorWelcome from "./pages/CollaboratorWelcome";
import CollaboratorSurvey from "./pages/CollaboratorSurvey";
import CollaboratorThanks from "./pages/CollaboratorThanks";
import CollaboratorDashboard from "./pages/CollaboratorDashboard";
import CollaboratorPulse from "./pages/CollaboratorPulse";
import CollaboratorWeek from "./pages/CollaboratorWeek";
import CollaboratorTaskReview from "./pages/CollaboratorTaskReview";
import CompanySetup from "./pages/CompanySetup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* Leader flow */}
          <Route path="/leader/welcome" element={<LeaderWelcome />} />
          <Route path="/leader/context" element={<LeaderContext />} />
          <Route path="/leader/team-setup" element={<TeamSetup />} />
          <Route path="/leader/transition" element={<LeaderTransition />} />
          <Route path="/leader/process-selection" element={<ProcessSelection />} />
          <Route path="/leader/process-intake" element={<ProcessIntake />} />
          <Route path="/leader/diagnostic-processing" element={<DiagnosticProcessing />} />
          <Route path="/leader/plan-review" element={<PlanReview />} />
          {/* Cultural diagnosis — standalone module from dashboard */}
          <Route path="/leader/cultural-diagnosis" element={<CulturalDiagnosisPage />} />
          <Route path="/leader/survey" element={<LeaderSurvey />} />
          <Route path="/leader/clarity-first" element={<ClarityFirst />} />
          <Route path="/leader/diagnostic-gate" element={<DiagnosticGate />} />
          <Route path="/leader/invite" element={<LeaderInvite />} />
          <Route path="/leader/diagnostic-result" element={<DiagnosticResult />} />
          <Route path="/leader/company-setup" element={<CompanySetup />} />
          <Route path="/leader/actions" element={<LeaderActions />} />
          <Route path="/leader" element={<LeaderDashboard />} />
          <Route path="/leader/*" element={<LeaderDashboard />} />
          {/* Collaborator flow */}
          <Route path="/collaborator/welcome" element={<CollaboratorWelcome />} />
          <Route path="/collaborator/survey" element={<CollaboratorSurvey />} />
          <Route path="/collaborator/pulse" element={<CollaboratorPulse />} />
          <Route path="/collaborator/week" element={<CollaboratorWeek />} />
          <Route path="/collaborator/thanks" element={<CollaboratorThanks />} />
          <Route path="/collaborator" element={<CollaboratorDashboard />} />
          <Route path="/collaborator/*" element={<CollaboratorDashboard />} />
          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
