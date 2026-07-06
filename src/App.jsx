import { Routes, Route } from 'react-router';
import { CartProvider } from './context/CartContext.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import CashierPage from './pages/CashierPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import InvoicePage from './pages/InvoicePage.jsx';

/**
 * App — Root component with routing and layout
 * 
 * Layout structure:
 * ┌─────────┬──────────────────────────────┐
 * │ Sidebar │       Page Content           │
 * │  (nav)  │                              │
 * │         │                              │
 * └─────────┴──────────────────────────────┘
 */
export default function App() {
  return (
    <CartProvider>
      <div className="flex h-screen overflow-hidden">
        {/* Navigation sidebar */}
        <Sidebar />

        {/* Main content area */}
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<CashierPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/invoice/:id" element={<InvoicePage />} />
          </Routes>
        </main>
      </div>

      {/* Bottom padding for mobile nav bar */}
      <div className="lg:hidden h-16" />
    </CartProvider>
  );
}
