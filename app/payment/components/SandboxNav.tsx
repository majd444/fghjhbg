"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Beaker, CreditCard } from 'lucide-react';

export default function SandboxNav() {
  const pathname = usePathname();
  
  return (
    <div className="w-full bg-yellow-100 border-b border-yellow-300 py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Beaker className="h-5 w-5 text-yellow-700 mr-2" />
          <span className="font-medium text-yellow-800">Subscription Testing Tools</span>
        </div>
        
        <div className="flex space-x-4">
          <Link href="/payment" passHref>
            <Button 
              variant={pathname === '/payment' ? "default" : "outline"}
              size="sm"
              className={pathname === '/payment' ? "bg-yellow-600 hover:bg-yellow-700" : "bg-white hover:bg-yellow-50"}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Payment Page
            </Button>
          </Link>
          
          <Link href="/sandbox" passHref>
            <Button 
              variant={pathname === '/sandbox' ? "default" : "outline"}
              size="sm"
              className={pathname === '/sandbox' ? "bg-yellow-600 hover:bg-yellow-700" : "bg-white hover:bg-yellow-50"}
            >
              <Beaker className="h-4 w-4 mr-2" />
              Sandbox
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
