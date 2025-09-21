import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
    LayoutDashboard, 
    Zap, 
    MessageSquare, 
    Palette, 
    BarChart3, 
    FileText, 
    Cpu,
    LogOut,
    LogIn,
    Sparkles,
    Share2,
    Menu,
    X,
    Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/entities/User";

const navigationItems = [
    { title: "Features", url: createPageUrl("Dashboard")},
    { title: "Pricing", url: createPageUrl("CampaignBuilder")},
    { title: "Explainer", url: createPageUrl("AgentChat")},
    { title: "Compare", url: createPageUrl("CreativePlayground")},
];

export default function Layout({ children, currentPageName }) {
    const location = useLocation();
    const [user, setUser] = React.useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    React.useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await User.me();
                setUser(userData);
            } catch (error) {}
        };
        loadUser();
    }, []);

    const handleLogout = async () => {
        await User.logout();
    };

    const handleLogin = async () => {
        await User.login();
    };

    return (
        <div className="bg-[#181818] text-gray-200 min-h-screen font-sans">
            <style>{`
                body {
                    background-color: #181818;
                }
                .main-container::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 120%;
                    height: 70vh;
                    background: radial-gradient(ellipse at top, rgba(212, 127, 56, 0.25), transparent 70%);
                    z-index: 0;
                    pointer-events: none;
                }
                .btn-primary {
                    background-color: #fca92f;
                    color: #111;
                    font-weight: 600;
                    transition: background-color 0.2s ease-in-out;
                    border-radius: 8px;
                }
                .btn-primary:hover {
                    background-color: #ffc166;
                }
                .btn-secondary {
                    background-color: rgba(255, 255, 255, 0.08);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    color: white;
                    font-weight: 500;
                    transition: background-color 0.2s ease-in-out;
                    border-radius: 8px;
                }
                .btn-secondary:hover {
                    background-color: rgba(255, 255, 255, 0.15);
                }
                .header-nav-link {
                    color: #a0a0a0;
                    transition: color 0.2s;
                }
                .header-nav-link:hover {
                    color: #ffffff;
                }
                 .header-nav-link-active {
                    color: #ffffff;
                }
                .mobile-menu {
                    transform: translateX(-100%);
                    transition: transform 0.3s ease-in-out;
                }
                .mobile-menu.open {
                    transform: translateX(0);
                }
            `}</style>
            
            <header className="sticky top-0 z-50 bg-[#181818]/80 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <Link to={createPageUrl("Dashboard")} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-black" />
                        </div>
                        <span className="text-xl font-bold text-white">Rookus</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        {navigationItems.map(item => (
                            <Link 
                                key={item.title} 
                                to={item.url} 
                                className={`text-sm font-medium ${location.pathname === item.url ? 'header-nav-link-active' : 'header-nav-link'}`}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <>
                                <span className="text-sm text-gray-400">{user.email}</span>
                                <Button onClick={handleLogout} variant="ghost" className="text-gray-400 hover:text-white">Logout</Button>
                            </>
                        ) : (
                           <>
                                <Button onClick={handleLogin} variant="ghost" className="text-gray-300 hover:text-white">Login</Button>
                                <Button onClick={handleLogin} className="btn-secondary px-5">Get Started</Button>
                           </>
                        )}
                    </div>
                    
                    <div className="md:hidden">
                        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
                            <Menu className="w-6 h-6"/>
                        </Button>
                    </div>
                </div>
            </header>

             {/* Mobile Menu */}
             <div className={`fixed inset-0 z-[100] md:hidden ${mobileMenuOpen ? '' : 'pointer-events-none'}`}>
                <div className={`absolute inset-0 bg-black/60 transition-opacity ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setMobileMenuOpen(false)}></div>
                <div className={`mobile-menu absolute top-0 left-0 h-full w-72 bg-[#1f1f1f] shadow-2xl p-6 flex flex-col ${mobileMenuOpen ? 'open' : ''}`}>
                    <div className="flex justify-between items-center mb-10">
                        <Link to={createPageUrl("Dashboard")} className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-black" />
                            </div>
                            <span className="text-xl font-bold text-white">Rookus</span>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                            <X className="w-6 h-6" />
                        </Button>
                    </div>
                    <nav className="flex flex-col gap-6">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.title}
                                to={item.url}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`text-base font-medium ${location.pathname === item.url ? 'text-white' : 'text-gray-400'}`}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </nav>
                     <div className="mt-auto border-t border-white/10 pt-6 flex flex-col gap-4">
                        {user ? (
                             <Button onClick={handleLogout} className="w-full btn-secondary">Logout</Button>
                        ) : (
                           <>
                                <Button onClick={handleLogin} variant="ghost" className="w-full text-gray-300">Login</Button>
                                <Button onClick={handleLogin} className="w-full btn-secondary">Get Started</Button>
                           </>
                        )}
                    </div>
                </div>
            </div>
            
            <main className="relative main-container">
                 <div className="relative z-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
