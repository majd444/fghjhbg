"use client";

import { 
  Bot, 
  BrainCircuit, 
  Code, 
  BarChart3, 
  MessageSquare, 
  Search,
  Settings, 
  Globe
} from "lucide-react";

const features = [
  {
    icon: <Bot className="h-6 w-6 text-blue-500" />,
    title: "No-Code AI Agent Builder",
    description: "Create intelligent AI agents through our intuitive drag-and-drop interface. No coding required."
  },
  {
    icon: <BrainCircuit className="h-6 w-6 text-purple-500" />,
    title: "Advanced Natural Language Processing",
    description: "Our agents understand context, sentiment, and can maintain engaging conversations with your customers."
  },
  {
    icon: <Settings className="h-6 w-6 text-blue-500" />,
    title: "Customizable Workflows",
    description: "Design complex decision trees and customize how your agents respond in different scenarios."
  },
  {
    icon: <Code className="h-6 w-6 text-purple-500" />,
    title: "API Integration",
    description: "Connect your agents to existing systems and services with our pre-built integrations and API tools."
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-blue-500" />,
    title: "Advanced Analytics",
    description: "Track conversation metrics, user satisfaction, and agent performance with our detailed analytics dashboard."
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-purple-500" />,
    title: "Multi-Channel Support",
    description: "Deploy your agents across websites, mobile apps, messaging platforms, and more from a single interface."
  },
  {
    icon: <Search className="h-6 w-6 text-blue-500" />,
    title: "Knowledge Base Integration",
    description: "Connect your agents to your documentation, FAQs, and knowledge bases to provide accurate information."
  },
  {
    icon: <Globe className="h-6 w-6 text-purple-500" />,
    title: "Multilingual Support",
    description: "Serve customers globally with agents that can communicate in over 50 languages."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
            Powerful Features to Build <span className="text-blue-600">Intelligent</span> AI Agents
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to create, deploy, and manage AI agents that understand your business and delight your customers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
            >
              <div className="bg-blue-50 rounded-lg p-3 inline-block mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Background decorations */}
      <div className="absolute top-20 right-0 w-64 h-64 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-purple-100 rounded-full opacity-20 blur-3xl"></div>
    </section>
  );
};

export default Features;
