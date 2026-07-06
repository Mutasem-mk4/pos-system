import { NavLink } from 'react-router';
import { 
  Monitor, 
  Settings, 
  ClipboardList, 
  ReceiptText
} from 'lucide-react';

/**
 * Navigation items for the sidebar
 * Each item maps to a route in the app
 */
const NAV_ITEMS = [
  { path: '/', icon: Monitor, label: 'نقطة البيع' },
  { path: '/admin', icon: Settings, label: 'إدارة المنتجات' },
  { path: '/history', icon: ClipboardList, label: 'سجل الفواتير' },
];

/**
 * Sidebar — Main navigation for the POS system
 * Displays as a narrow icon-based sidebar on desktop,
 * or a bottom bar on mobile/tablet
 */
export default function Sidebar() {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-20 bg-slate-800 border-e border-slate-700 py-6 items-center gap-2 shrink-0">
        {/* App logo/icon */}
        <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center mb-6">
          <ReceiptText size={24} className="text-white" />
        </div>

        {/* Navigation links */}
        <nav className="flex flex-col gap-2 flex-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 group cursor-pointer ${
                  isActive
                    ? 'bg-teal-600/20 text-teal-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`
              }
            >
              <item.icon size={22} />
              <span className="text-[10px] font-medium leading-tight text-center">
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile/Tablet bottom navigation bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-800 border-t border-slate-700 flex items-center justify-around px-2 py-2 safe-area-pb">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 rounded-xl transition-all min-w-[64px] cursor-pointer ${
                isActive
                  ? 'text-teal-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
