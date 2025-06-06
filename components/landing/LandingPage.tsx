"use client";

import { useState } from "react";
import Header from "./Header";
import Hero from "./Hero";
import Features from "./Features";
import Footer from "./Footer";
import AuthModal from "./AuthModal";
import AccountIdGenerator from "../account/AccountIdGenerator";

const LandingPage = () => {
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30">
      {/* Silent component that generates account IDs without changing UI */}
      <AccountIdGenerator />
      
      <Header onOpenAuth={setAuthModal} />
      <Hero onOpenAuth={setAuthModal} />
      <Features />
      <Footer />
      
      <AuthModal 
        type={authModal} 
        onClose={() => setAuthModal(null)} 
        onSwitchType={(type) => setAuthModal(type)}
      />
    </div>
  );
};

export default LandingPage;
