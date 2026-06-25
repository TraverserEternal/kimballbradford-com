import { Router, Route } from "preact-iso";
import { useEffect } from "preact/hooks";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Work } from "./pages/Work";
import { LiveProjects } from "./pages/LiveProjects";
import { NotFound } from "./pages/NotFound";

const BASE = import.meta.env.VITE_BASE_PATH || "/";

function HardRedirect() {
  useEffect(() => {
    window.location.href = window.location.pathname + window.location.search + window.location.hash;
  }, []);
  return null;
}

export function App() {
  return (
    <Layout>
      <Router>
        <Route path={`${BASE}`} component={Home} />
        <Route path={`${BASE}work`} component={Work} />
        <Route path={`${BASE}live-projects`} component={LiveProjects} />
        <Route path={`${BASE}live-projects/:subproject*`} component={HardRedirect} />
        <Route default component={NotFound} />
      </Router>
    </Layout>
  );
}
