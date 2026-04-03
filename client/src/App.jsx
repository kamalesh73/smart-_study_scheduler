import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import SubjectsPage from "./pages/SubjectsPage";
import PlannerPage from "./pages/PlannerPage";
import InsightsPage from "./pages/InsightsPage";

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="subjects" element={<SubjectsPage />} />
          <Route path="planner" element={<PlannerPage />} />
          <Route path="insights" element={<InsightsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
