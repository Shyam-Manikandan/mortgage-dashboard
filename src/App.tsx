import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LendersPage from "./pages/LendersPage";
import EmployeesPage from "./pages/EmployeesPage";

function App() {
  return (
    <Router>
      <div className="layout">
        {/* Sidebar */}
        <aside className="fixed top-0 left-0 h-screen w-60 bg-slate-800 text-white p-5 flex flex-col">
          <h2 className="text-xl font-bold mb-6">Dashboard</h2>
          <ul className="space-y-4">
            <li>
              <Link to="/" className="block py-2 px-3 rounded hover:bg-slate-700" >
                Lenders & Users
              </Link>
            </li>
            <li>
              <Link to="/employees" className="block py-2 px-3 rounded hover:bg-slate-700">
                Lenders & Employees
              </Link>
            </li>
          </ul>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6 bg-gray-100 overflow-auto sm:ml-60">
          <Routes>
            <Route path="/" element={<LendersPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
