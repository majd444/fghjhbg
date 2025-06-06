import { Metadata } from "next";
import IntegrationsSection from "@/components/settings/integrations-section";

export const metadata: Metadata = {
  title: "Settings | Integration Settings",
  description: "Configure chatbot integration settings for various platforms",
};

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Integration Settings</h2>
          <p className="text-gray-600 mb-6">
            Connect your chatbot to these platforms for seamless integration.
          </p>
          
          <IntegrationsSection />
        </section>
      </div>
    </div>
  );
}
