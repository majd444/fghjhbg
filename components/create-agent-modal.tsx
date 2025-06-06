"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, RefreshCw, Upload, ExternalLink, Link2, FileText, Plus, Trash2, Globe, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatInterface } from "@/components/chat-interface"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { ColorPalette } from "@/components/ui/color-palette"

interface CreateAgentModalProps {
  onClose: () => void
}

export function CreateAgentModal({ onClose }: CreateAgentModalProps) {
  const [activeTab, setActiveTab] = useState("configuration")
  const [extractionUrl, setExtractionUrl] = useState("")
  const [extractedLinks, setExtractedLinks] = useState<string[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [isExtracting, setIsExtracting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  // Configuration state
  const [name, setName] = useState("AI Assistant")
  const [temperature, setTemperature] = useState(70)
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful AI assistant.")
  
  // Style state
  const [topColor, setTopColor] = useState("#1f2937")
  const [accentColor, setAccentColor] = useState("#3B82F6")
  const [backgroundColor, setBackgroundColor] = useState("#F3F4F6")
  const [outsideButtonUrl, setOutsideButtonUrl] = useState("")
  const [outsideButtonText, setOutsideButtonText] = useState("Chat with our AI assistant!")
  
  // File upload state
  const [fileUploadStatus, setFileUploadStatus] = useState<{
    uploading: boolean;
    error: string | null;
  }>({ uploading: false, error: null })
  const router = useRouter()

  const handleWorkflowClick = () => {
    router.push("/workflow/new")
  }
  
  // Get URL query parameters if available
  const [workflowId, setWorkflowId] = useState<number | null>(null)
  const [_workflowData, setWorkflowData] = useState<any>(null)
  const [conversationStarters, setConversationStarters] = useState<string[]>([])

  // Fetch workflow data if a workflowId is provided
  useEffect(() => {
    const fetchWorkflowData = async () => {
      try {
        const url = new URL(window.location.href)
        const id = url.searchParams.get("workflowId")
        
        if (id) {
          const parsedId = parseInt(id)
          setWorkflowId(parsedId)
          
          // Fetch workflow data
          const response = await fetch(`/api/workflows/${parsedId}`)
          
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`)
          }
          
          const data = await response.json()
          setWorkflowData(data.workflow)
          
          // Extract conversation starters from workflow data
          if (data.workflow && data.workflow.conversationTexts) {
            const starters = Object.values(data.workflow.conversationTexts)
              .filter((text: any) => typeof text === 'string' && text.trim() !== "")
            
            setConversationStarters(starters as string[])
            console.log('Conversation starters loaded:', starters)
          }
        }
      } catch (err) {
        console.error('Error fetching workflow data:', err)
      }
    }
    
    fetchWorkflowData()
  }, [])
  
  // Handle browser back button to keep users on this page
  useEffect(() => {
    // This function is called when the back button is clicked
    const interceptBackButton = () => {
      // Instead of navigating away, we replace the current history entry
      // This effectively cancels the back navigation
      window.history.replaceState({ modal: true }, document.title)
      
      // Then push a new state to ensure forward navigation works
      window.history.pushState({ modal: true }, document.title)
      
      // Optionally show some feedback that back navigation was intercepted
      console.log('Back navigation intercepted')
    }
    
    // When modal opens, add a history entry we can intercept
    if (typeof window !== 'undefined') {
      // Ensure there's a history entry to go back to (for first-time visitors)
      window.history.replaceState({ page: 'previous' }, document.title)
      
      // Create our modal entry
      window.history.pushState({ modal: true }, document.title)
      
      // Listen for back button clicks
      window.addEventListener('popstate', interceptBackButton)
    }
    
    // Cleanup when component unmounts
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('popstate', interceptBackButton)
      }
    }
  }, [])

  const saveAgent = async () => {
    try {
      setIsSaving(true)

      // First, create a simple workflow if none exists
      let currentWorkflowId = workflowId;
      if (!currentWorkflowId) {
        try {
          // Create a basic workflow first
          const workflowResponse = await fetch('/api/workflows', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: `${name} Workflow`,
              description: "Auto-created workflow for agent",
              components: [],
              connections: [],
              conversationTexts: {},
              selectedToolIds: {},
              userId: "default-user",
              // Include styling configuration
              chatbotName: name,
              systemPrompt: systemPrompt,
              topColor: topColor,
              accentColor: accentColor,
              backgroundColor: backgroundColor,
              // Fine tuning configuration
              temperature: temperature / 100,
              model: "llama-3.1",
              maxTokens: 2000
            }),
          });

          if (!workflowResponse.ok) {
            throw new Error(`Failed to create workflow: ${workflowResponse.status}`);
          }

          const workflowResult = await workflowResponse.json();
          currentWorkflowId = workflowResult.workflowId;
          console.log(`Created workflow with ID: ${currentWorkflowId}`);
        } catch (workflowError) {
          console.error('Error creating workflow:', workflowError);
          throw new Error('Failed to create workflow for agent');
        }
      }
      
      // Collect training data for fine-tuning
      const trainingData = {
        extractedLinks: extractedLinks,
        uploadedFiles: uploadedFiles
      }
      
      // Now prepare the agent data with all tabs, including the workflow
      const agentData = {
        // Basic info
        name: name,
        description: "Created with Chatbot Automation",
        workflowId: currentWorkflowId, // Use the workflow ID we created or already had
        userId: "default-user",
        
        // Configuration tab
        chatbotName: name,
        systemPrompt: systemPrompt,
        temperature: temperature / 100,
        model: "llama-3.1",
        maxTokens: 2000,
        
        // Style tab
        topColor: topColor,
        accentColor: accentColor,
        backgroundColor: backgroundColor,
        avatarUrl: "",
        outsideButtonText: outsideButtonText,
        outsideButtonUrl: outsideButtonUrl,
        
        // Fine-tuning data
        extraConfig: {
          conversationStarters: conversationStarters,
          trainingData: trainingData
        }
      }

      console.log('Saving agent with data:', agentData);
      
      // Save the agent to the database
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agentData),
      })
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error details:', errorData);
        throw new Error(`Error ${response.status}: ${errorData.error || 'Failed to save agent'}`)
      }
      
      const _result = await response.json()
      
      // Set success state
      setSaveSuccess(true)
      
      // Redirect to dashboard after a brief delay to show success message
      setTimeout(() => {
        router.push("/")
      }, 1500)
      
    } catch (error) {
      console.error("Error saving agent:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleExtractLinks = async () => {
    if (!extractionUrl) return

    setIsExtracting(true)
    setFileUploadStatus({ uploading: false, error: null })
    
    try {
      const response = await fetch('/api/extract-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: extractionUrl }),
      })
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
      const data = await response.json()
      if (data?.links?.length > 0) {
        // Extract just the URLs from the links array
        const extractedUrls = data.links.map((link: { href: string }) => link.href)
        setExtractedLinks(extractedUrls)
      } else {
        setExtractedLinks([])
      }
    } catch (error) {
      console.error('Error extracting links:', error)
      setFileUploadStatus({ 
        uploading: false, 
        error: 'Failed to extract links. Please try again.'
      })
    } finally {
      setIsExtracting(false)
    }
  } 

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    setFileUploadStatus({ uploading: true, error: null })
    
    try {
      // For now, just display the files locally without actual upload
      // In a real implementation, we would upload to a server endpoint
      const newFiles = Array.from(files).map((file) => file.name)
      
      // Check file types - only accept PDF, DOCX, TXT, CSV
      const validExtensions = ['.pdf', '.docx', '.txt', '.csv']
      const invalidFiles = newFiles.filter(name => {
        const extension = name.substring(name.lastIndexOf('.')).toLowerCase()
        return !validExtensions.includes(extension)
      })
      
      if (invalidFiles.length > 0) {
        setFileUploadStatus({ 
          uploading: false, 
          error: `Invalid file type(s): ${invalidFiles.join(', ')}. Only PDF, DOCX, TXT and CSV are supported.`
        })
        return
      }
      
      setUploadedFiles([...uploadedFiles, ...newFiles])
      setFileUploadStatus({ uploading: false, error: null })
      
    } catch (error) {
      console.error('Error uploading files:', error)
      setFileUploadStatus({ 
        uploading: false, 
        error: 'Failed to upload files. Please try again.'
      })
    }
  }

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles]
    newFiles.splice(index, 1)
    setUploadedFiles(newFiles)
  }

  const removeLink = (index: number) => {
    const newLinks = [...extractedLinks]
    newLinks.splice(index, 1)
    setExtractedLinks(newLinks)
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col h-screen w-screen">
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Create New Agent</h2>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="flex items-center" onClick={handleWorkflowClick}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Workflow
          </Button>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-2/3 overflow-y-auto p-6 border-r border-gray-200">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="configuration">Configuration</TabsTrigger>
              <TabsTrigger value="fine-tuning">Fine-tuning</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
            </TabsList>

            <TabsContent value="configuration" className="space-y-6">
              <div>
                <label htmlFor="agent-name" className="block text-sm font-medium mb-2">Name</label>
                <Input 
                  id="agent-name"
                  name="agent-name"
                  placeholder="AI Assistant" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>

              <div>
                <label htmlFor="language-model" className="block text-sm font-medium mb-2">Language Model</label>
                <div className="relative">
                  <select 
                    id="language-model" 
                    name="language-model"
                    className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-10"
                    aria-label="Select language model"
                  >
                    <option value="llama-3.1">Llama 3.1 Nemetron Nano 8B (Free)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none" aria-hidden="true">
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label htmlFor="temperature-slider" className="block text-sm font-medium">Temperature: {(temperature / 100).toFixed(1)}</label>
                  <span className="text-sm text-gray-500">Balanced</span>
                </div>
                <Slider 
                  id="temperature-slider"
                  name="temperature"
                  value={[temperature]} 
                  max={100} 
                  step={1} 
                  onValueChange={(value) => setTemperature(value[0])}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={temperature}
                  aria-valuetext={`Temperature ${(temperature / 100).toFixed(1)}`}
                />
              </div>

              <div>
                <label htmlFor="system-prompt" className="block text-sm font-medium mb-2">System Prompt</label>
                <Textarea 
                  id="system-prompt"
                  name="system-prompt"
                  placeholder="You are a helpful AI assistant." 
                  className="min-h-[150px]" 
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This prompt defines your assistant's personality and capabilities.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="fine-tuning" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Link Extraction Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Link2 className="h-5 w-5 mr-2 text-blue-500" />
                      Extract Links
                    </CardTitle>
                    <CardDescription>Extract links from websites to use as training data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex space-x-2">
                        <div className="flex-1">
                          <label htmlFor="extraction-url" className="sr-only">Enter URL to extract links</label>
                          <Input
                            id="extraction-url"
                            name="extraction-url"
                            placeholder="Enter URL to extract links"
                            value={extractionUrl}
                            onChange={(e) => setExtractionUrl(e.target.value)}
                            aria-label="URL for link extraction"
                          />
                        </div>
                        <Button
                          onClick={handleExtractLinks}
                          disabled={isExtracting || !extractionUrl}
                          className="whitespace-nowrap"
                          type="button"
                          aria-label={isExtracting ? "Extracting links" : "Extract links"}
                        >
                          {isExtracting ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Extracting...
                            </>
                          ) : (
                            <>
                              <Globe className="h-4 w-4 mr-2" />
                              Extract
                            </>
                          )}
                        </Button>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Extracted Links ({extractedLinks.length})</h4>
                        {extractedLinks.length > 0 ? (
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {extractedLinks.map((link, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                                <div className="flex items-center text-sm truncate">
                                  <Globe className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                                  <span className="truncate">{link}</span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeLink(index)}
                                  className="ml-2 flex-shrink-0"
                                >
                                  <Trash2 className="h-4 w-4 text-gray-500" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : fileUploadStatus.error && extractionUrl ? (
                          <div className="bg-red-50 text-red-700 p-2 rounded text-sm mb-2">
                            {fileUploadStatus.error}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-gray-500 text-sm">No links extracted yet</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* File Upload Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-blue-500" />
                      Upload Files
                    </CardTitle>
                    <CardDescription>Upload documents to train your AI assistant</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => document.getElementById("file-upload")?.click()}
                      >
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm font-medium">Drag and drop files here</p>
                        <p className="text-xs text-gray-500 mt-1">or click to browse</p>
                        <input type="file" id="file-upload" className="hidden" multiple onChange={handleFileUpload} />
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            PDF
                          </Badge>
                          <Badge variant="outline" className="text-xs ml-1">
                            DOCX
                          </Badge>
                          <Badge variant="outline" className="text-xs ml-1">
                            TXT
                          </Badge>
                          <Badge variant="outline" className="text-xs ml-1">
                            CSV
                          </Badge>
                        </div>
                      </div>
                      
                      {fileUploadStatus.uploading && (
                        <div className="bg-blue-50 text-blue-700 p-2 rounded text-sm flex items-center">
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Uploading files...
                        </div>
                      )}
                      
                      {fileUploadStatus.error && (
                        <div className="bg-red-50 text-red-700 p-2 rounded text-sm">
                          {fileUploadStatus.error}
                        </div>
                      )}

                      <div>
                        <h4 className="text-sm font-medium mb-2">Uploaded Files ({uploadedFiles.length})</h4>
                        {uploadedFiles.length > 0 ? (
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {uploadedFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                                <div className="flex items-center text-sm truncate">
                                  <File className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                                  <span className="truncate">{file}</span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(index)}
                                  className="ml-2 flex-shrink-0"
                                >
                                  <Trash2 className="h-4 w-4 text-gray-500" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-gray-500 text-sm">No files uploaded yet</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="text-lg font-medium mb-4">Training Data Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Links</span>
                      <Badge>{extractedLinks.length}</Badge>
                    </div>
                    <div className="text-2xl font-bold">{extractedLinks.length}</div>
                    <div className="text-sm text-gray-500">Web pages for training</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Files</span>
                      <Badge>{uploadedFiles.length}</Badge>
                    </div>
                    <div className="text-2xl font-bold">{uploadedFiles.length}</div>
                    <div className="text-sm text-gray-500">Documents for training</div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button className="w-full" disabled={extractedLinks.length === 0 && uploadedFiles.length === 0}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Training Data to Agent
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="style" className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg mb-4">
                <h3 className="text-lg font-medium">Chatbot Appearance</h3>
                <p className="text-sm text-blue-600">
                  Customize the appearance of your chatbot to match your brand or website design.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label id="top-color-label" className="block text-sm font-medium mb-2">Top Color</label>
                  <ColorPalette
                    aria-labelledby="top-color-label"
                    value={topColor}
                    onValueChange={setTopColor}
                    label="#FFFFFF"
                    aria-label="Header color value"
                  />
                </div>

                <div>
                  <label id="accent-color-label" className="block text-sm font-medium mb-2">Accent Color (Buttons/Icons)</label>
                  <ColorPalette
                    aria-labelledby="accent-color-label"
                    value={accentColor}
                    onValueChange={setAccentColor}
                    label="#FFFFFF"
                    aria-label="Accent color value"
                  />
                </div>

                <div>
                  <label id="background-color-label" className="block text-sm font-medium mb-2">Background Color</label>
                  <ColorPalette
                    aria-labelledby="background-color-label"
                    value={backgroundColor}
                    onValueChange={setBackgroundColor}
                    label="#FFFFFF"
                    aria-label="Background color value"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">Outside Button</label>
                <div className="space-y-4">
                  <Input
                    placeholder="Button text"
                    value={outsideButtonText}
                    onChange={(e) => setOutsideButtonText(e.target.value)}
                  />
                  <Input
                    placeholder="Button URL (optional)"
                    value={outsideButtonUrl}
                    onChange={(e) => setOutsideButtonUrl(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Chatbot Avatar</label>
                <div className="flex items-center">
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                    <span className="text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="18" height="12" x="3" y="6" rx="2" />
                        <circle cx="12" cy="12" r="2" />
                        <path d="M8 12h.01" />
                        <path d="M16 12h.01" />
                      </svg>
                    </span>
                  </div>
                  <Button variant="outline" className="flex items-center">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Recommended: Square image, max 2MB.</p>
              </div>

              <div>
                <label htmlFor="outside-button-url" className="block text-sm font-medium mb-2">Outside Button Image URL (optional)</label>
                <Input 
                  id="outside-button-url"
                  name="outside-button-url"
                  placeholder="https://example.com/image.png" 
                  value={outsideButtonUrl}
                  onChange={(e) => setOutsideButtonUrl(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to use the default chatbot icon</p>
              </div>

              <div>
                <label htmlFor="outside-button-text" className="block text-sm font-medium mb-2">Outside Button Text</label>
                <Input 
                  id="outside-button-text"
                  name="outside-button-text"
                  placeholder="Chat with our AI assistant!" 
                  value={outsideButtonText}
                  onChange={(e) => setOutsideButtonText(e.target.value)}
                />
              </div>
            </TabsContent>


          </Tabs>

          {saveSuccess && (
            <Alert className="mt-6 bg-green-50 border-green-200 text-green-800">
              <AlertDescription className="flex items-center">
                <span className="mr-2">✅</span>
                <div>
                  <p className="font-medium">Agent Saved Successfully</p>
                  <p>
                    Your agent has been saved and is now available in your agents list and active agents.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="p-4 pr-12 flex items-center justify-end" style={{ backgroundColor }}>
          <div className="w-[300px] h-[400px] overflow-hidden rounded-lg shadow-md">
            <ChatInterface 
              name={name}
              systemPrompt={systemPrompt}
              topColor={topColor}
              accentColor={accentColor}
              backgroundColor={backgroundColor}
              conversationStarters={conversationStarters}
              welcomeMessage={`👋 Hi, I'm ${name}! I can help with information, answer questions, or just chat.`}
              responseSpeed={{
                min: 1,
                max: 3,
                useRandom: true
              }}
              collectUserInfo={{
                enabled: true,
                fields: [
                  {
                    id: "name",
                    label: "Your Name",
                    type: "text",
                    required: true,
                    placeholder: "John Doe"
                  },
                  {
                    id: "email",
                    label: "Email Address",
                    type: "email",
                    required: true,
                    validation: {
                      pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$",
                      helpText: "Please enter a valid email address"
                    }
                  },
                  {
                    id: "inquiry",
                    label: "How can I help you?",
                    type: "select",
                    required: true,
                    options: ["General Question", "Technical Support", "Feature Request", "Other"]
                  }
                ]
              }}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 p-4 flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={saveAgent} disabled={isSaving}>
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : "Save Agent"}
        </Button>
      </div>
    </div>
  )
}

function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
