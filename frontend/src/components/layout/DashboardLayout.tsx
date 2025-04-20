import { useState, ReactNode, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';
import { LogOut, Wallet, CreditCard, SendHorizontal, ArrowDownToLine, LayoutDashboard, Menu, X, History } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../../components/ui/sheet';

interface SidebarLinkProps {
  href: string;
  icon: ReactNode;
  label: string;
  active?: boolean;
}

const SidebarLink = ({ href, icon, label, active }: SidebarLinkProps) => (
  <Link to={href}>
    <div 
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
        active 
          ? "bg-sidebar-accent text-sidebar-accent-foreground" 
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
      )}
    >
      <div className="text-current">{icon}</div>
      <span className="font-medium">{label}</span>
      {active && (
        <motion.div
          className="absolute left-0 w-1 h-8 bg-sidebar-primary rounded-r-full"
          layoutId="activeIndicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </div>
  </Link>
);

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { authState, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate('/login');
    }
  }, [authState.isAuthenticated, navigate]);
  
  if (!authState.isAuthenticated) {
    return null;
  }

  const user: any = authState.user;
  
  const navigationItems = [
    { 
      href: '/dashboard', 
      icon: <LayoutDashboard size={20} />, 
      label: 'Dashboard',
      active: location.pathname === '/dashboard'
    },
    { 
      href: '/fund-wallet', 
      icon: <CreditCard size={20} />, 
      label: 'Fund Wallet',
      active: location.pathname === '/fund-wallet'
    },
    { 
      href: '/transfer', 
      icon: <SendHorizontal size={20} />, 
      label: 'Transfer',
      active: location.pathname === '/transfer'
    },
    { 
      href: '/withdraw', 
      icon: <ArrowDownToLine size={20} />, 
      label: 'Withdraw',
      active: location.pathname === '/withdraw'
    },
    { 
      href: '/transactions', 
      icon: <History size={20} />, 
      label: 'Transactions',
      active: location.pathname === '/transactions'
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 flex-col bg-sidebar h-screen fixed">
        <div className="flex items-center gap-2 px-6 py-6">
          <Wallet className="text-sidebar-primary w-7 h-7" />
          <span className="text-sidebar-foreground text-xl font-bold">FinWave</span>
        </div>
        
        <div className="px-3 py-4 flex-1 overflow-auto">
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <SidebarLink 
                key={item.href} 
                href={item.href} 
                icon={item.icon} 
                label={item.label}
                active={item.active}
              />
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-sidebar-border">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            onClick={logout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Log out
          </Button>
        </div>
      </div>
      
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 h-16 border-b border-border bg-background z-10 flex lg:hidden items-center px-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-sidebar">
            <div className="flex items-center justify-between px-6 py-6">
              <div className="flex items-center gap-2">
                <Wallet className="text-sidebar-primary w-7 h-7" />
                <span className="text-sidebar-foreground text-xl font-bold">FinWave</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-sidebar-foreground">
                <X />
              </Button>
            </div>
            
            <div className="px-3 py-4">
              <nav className="space-y-1">
                {navigationItems.map((item) => (
                  <div key={item.href} onClick={() => setOpen(false)}>
                    <SidebarLink 
                      href={item.href} 
                      icon={item.icon} 
                      label={item.label}
                      active={item.active}
                    />
                  </div>
                ))}
              </nav>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Log out
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex items-center mx-auto">
          <Wallet className="text-primary w-6 h-6 mr-2" />
          <span className="text-foreground text-lg font-bold">FinWave</span>
        </div>
        
      </div>
      
      {/* Desktop Header */}
      <div className="hidden lg:flex fixed top-0 left-64 right-0 h-16 border-b border-border bg-background z-10 items-center justify-between px-6">
        <h1 className="text-xl font-semibold">
          {navigationItems.find(item => item.active)?.label || 'Dashboard'}
        </h1>
        
        <div className="flex items-center gap-4">
          
          <div className="flex items-center gap-3">
            <div className="text-sm">
              <p className="font-medium">{user?.name}</p>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-64 mt-16 p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardLayout;
