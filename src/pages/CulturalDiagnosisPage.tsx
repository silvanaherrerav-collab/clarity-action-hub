import { useNavigate } from "react-router-dom";
import CulturalDiagnosisModule from "@/components/CulturalDiagnosisModule";
import { Sidebar } from "@/components/layout/Sidebar";

const CulturalDiagnosisPage = () => {
  const navigate = useNavigate();
  const handleLogout = () => navigate("/");

  return (
    <div className="flex min-h-screen">
      <Sidebar userRole="leader" userName="Alex Thompson" onLogout={handleLogout} />
      <div className="flex-1 ml-64 min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <CulturalDiagnosisModule
            onComplete={() => {}}
            onCancel={() => navigate("/leader")}
          />
        </div>
      </div>
    </div>
  );
};

export default CulturalDiagnosisPage;
