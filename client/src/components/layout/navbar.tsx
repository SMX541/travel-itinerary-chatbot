import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { Menu, PlaneTakeoff } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const NAV_ITEMS = [
    { name: "Home", path: "/" },
    { name: "Try Demo", path: "/chat" },
    { name: "Features", path: "/#features" },
    { name: "How It Works", path: "/#how-it-works" }
  ];
  
  const isActive = (path: string) => {
    if (path.includes('#')) {
      return location === '/';
    }
    return location === path;
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex-shrink-0 flex items-center">
                <PlaneTakeoff className="h-6 w-6 text-primary mr-2" />
                <span className="font-bold text-xl text-primary-600">TravelPal</span>
              </a>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {NAV_ITEMS.map((item) => (
              <Link key={item.name} href={item.path}>
                <a className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium",
                  isActive(item.path)
                    ? "text-primary-600"
                    : "text-gray-700 hover:text-primary-600"
                )}>
                  {item.name}
                </a>
              </Link>
            ))}
            
            <Link href="/chat">
              <a>
                <Button className="ml-2">
                  Start Planning
                </Button>
              </a>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  {NAV_ITEMS.map((item) => (
                    <SheetClose key={item.name} asChild>
                      <Link href={item.path}>
                        <a className={cn(
                          "px-3 py-2 rounded-md text-base font-medium",
                          isActive(item.path)
                            ? "text-primary-600"
                            : "text-gray-700 hover:text-primary-600"
                        )}>
                          {item.name}
                        </a>
                      </Link>
                    </SheetClose>
                  ))}
                  
                  <SheetClose asChild>
                    <Link href="/chat">
                      <a>
                        <Button className="w-full mt-4">
                          Start Planning
                        </Button>
                      </a>
                    </Link>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
