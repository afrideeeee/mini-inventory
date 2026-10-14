import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import PageFooter from "./PageFooter";

export default function AppLayout() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="content">
          <main className="page">
            <Outlet />
          </main>
          <PageFooter />
        </div>
      </div>
    </div>
  );
}
