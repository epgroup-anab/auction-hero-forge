import { Bell, Search, User, Plus, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  // Check if user is in supplier mode
  const isSupplierMode = location.pathname.startsWith('/supplier');

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Show sign in button if user is not authenticated
  if (!user) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div 
              className="bg-gradient-primary bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/')}
            >
              <h1 className="text-2xl font-bold">AUCTION HERO</h1>
            </div>
          </div>

          {/* Right Actions - Sign In */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <div 
            className="bg-gradient-primary bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate(isSupplierMode ? '/supplier/dashboard' : '/')}
          >
            <h1 className="text-2xl font-bold">AUCTION HERO</h1>
          </div>
          
          {/* Navigation Tabs */}
          {isSupplierMode ? (
            <nav className="flex items-center space-x-6 ml-8">
              <Button 
                variant={location.pathname.includes('/supplier/dashboard') ? 'default' : 'ghost'}
                onClick={() => navigate('/supplier/dashboard')}
              >
                Events
              </Button>
            </nav>
          ) : (
            <nav className="flex items-center space-x-6 ml-8">
              <Button 
                variant={location.pathname === '/' ? 'default' : 'ghost'}
                onClick={() => navigate('/')}
              >
                Dashboard
              </Button>
              <Button 
                variant={location.pathname === '/my-events' ? 'default' : 'ghost'}
                onClick={() => navigate('/my-events')}
              >
                My Events
              </Button>
            </nav>
          )}
        </div>

        {/* Search Bar - Only show for hosts */}
        {!isSupplierMode && (
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search events, participants, or documents..." 
                className="pl-10 bg-muted/50 border-0 focus:bg-background transition-colors"
              />
            </div>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          {/* Show different actions based on mode */}
          {!isSupplierMode && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="accent" size="default" className="font-semibold">
                  <Plus className="h-4 w-4" />
                  New Event
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate('/create-event')}>
                  <span>🏛️ Government Auction</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/create-event')}>
                  <span>📋 RFQ Event</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/create-event')}>
                  <span>⚡ Quick Auction</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/create-event')}>
                  <span>📊 Tender Process</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/suppliers')}>
                  <span>👥 Manage Suppliers</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;