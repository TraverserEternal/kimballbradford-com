import { Router, Route } from "preact-iso";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Work } from "./pages/Work";
import { Blog } from "./pages/Blog";
import { LiveProjects } from "./pages/LiveProjects";
import { NotFound } from "./pages/NotFound";

const BASE = import.meta.env.VITE_BASE_PATH || "/";

export function App() {
  return (
    <Layout>
      <Router>
        <Route path={`${BASE}`} component={Home} />
        <Route path={`${BASE}work`} component={Work} />
        <Route path={`${BASE}blog`} component={Blog} />
        <Route path={`${BASE}live-projects`} component={LiveProjects} />
        <Route default component={NotFound} />
      </Router>
    </Layout>
  );
}
