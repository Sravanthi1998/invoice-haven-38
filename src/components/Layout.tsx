
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  PackageOpen,
  ShoppingCart,
  HardDrive,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title, subtitle }) => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: BarChart3 },
    { name: 'Purchase Records', path: '/purchases', icon: ShoppingCart },
    { name: 'Stock Management', path: '/stock', icon: HardDrive }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      {/* Header */}
      <header className="glass sticky top-0 z-50 h-16 flex items-center px-6 md:px-8 shadow-sm">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <PackageOpen className="h-7 w-7 text-accent mr-2" />
            <h1 className="text-xl font-medium">Invoice Haven</h1>
          </div>
        </div>
      </header>

      <div className="flex flex-grow">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-white/80 backdrop-blur-sm hidden lg:block">
          <nav className="px-4 py-6">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path !== '/' && location.pathname.startsWith(item.path));
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center h-10 px-3 py-2 rounded-md text-sm transition-colors",
                        isActive 
                          ? "bg-accent text-white"
                          : "text-foreground hover:bg-secondary"
                      )}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="px-6 md:px-8 py-8 max-w-6xl mx-auto">
            <div className="mb-8 fade-in">
              {/* Breadcrumb */}
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                <Link to="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
                {location.pathname !== '/' && (
                  <>
                    <ChevronRight className="h-3 w-3" />
                    <span>{navItems.find(item => 
                      item.path !== '/' && location.pathname.startsWith(item.path))?.name || 'Page'}
                    </span>
                  </>
                )}
              </div>
              
              <h1 className="text-3xl font-medium">{title}</h1>
              {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
            </div>
            
            <div className="slide-up">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
