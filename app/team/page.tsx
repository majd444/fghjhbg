"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, User, XCircle } from "lucide-react";
import { toast } from "sonner";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "pending";
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Fetch team members on page load
    fetchTeamMembers();
  }, []);
  
  const fetchTeamMembers = async () => {
    try {
      // Fetch active team members
      const response = await fetch('/api/team/members');
      
      if (!response.ok) {
        throw new Error('Failed to fetch team members');
      }
      
      const data = await response.json();
      
      // Also fetch pending invites
      const invitesResponse = await fetch('/api/team/invite');
      
      if (!invitesResponse.ok) {
        throw new Error('Failed to fetch team invites');
      }
      
      const invitesData = await invitesResponse.json();
      
      // Combine active members and pending invites
      const activeMembers = data.members || [];
      const pendingInvites = invitesData.invites || [];
      
      // Transform pending invites to the TeamMember format
      const pendingMembers = pendingInvites.map((invite: any) => ({
        id: invite.id,
        name: 'Pending User',
        email: invite.email,
        role: 'Member',
        status: 'pending' as const
      }));
      
      // If no active members yet, add a mock "you" user
      const allMembers = [
        // Only add mock user if no real data
        ...(activeMembers.length === 0 ? [
          { 
            id: "1", 
            name: "You", 
            email: "you@example.com", 
            role: "Owner", 
            status: "active" as const
          }
        ] : activeMembers),
        ...pendingMembers
      ];
      
      setMembers(allMembers);
    } catch (error) {
      console.error("Failed to fetch team members:", error);
      toast.error("Failed to load team members");
      
      // Fallback to mock data on error
      setMembers([
        { 
          id: "1", 
          name: "You", 
          email: "you@example.com", 
          role: "Owner", 
          status: "active" 
        }
      ]);
    }
  };
  
  const handleSendInvite = async () => {
    if (!inviteEmail || !inviteEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    try {
      // Call the API to send an invite
      const response = await fetch('/api/team/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: inviteEmail }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send invite');
      }
      
      const data = await response.json();
      
      // Add the invited user to the list with pending status
      setMembers([
        ...members,
        {
          id: data.invite.id,
          name: "Pending User",
          email: inviteEmail,
          role: "Member",
          status: "pending"
        }
      ]);
      
      setInviteEmail("");
      toast.success(`Invite sent to ${inviteEmail}`);
    } catch (error: any) {
      console.error("Failed to send invite:", error);
      toast.error(error.message || "Failed to send invite");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancelInvite = async (memberId: string) => {
    try {
      // Call API to cancel the invite
      const response = await fetch(`/api/team/invite?id=${memberId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to cancel invite');
      }
      
      // Remove the member from the list
      setMembers(members.filter(member => member.id !== memberId));
      toast.success("Invite cancelled");
    } catch (error: any) {
      console.error("Failed to cancel invite:", error);
      toast.error(error.message || "Failed to cancel invite");
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Team Management</h1>
        <p className="text-muted-foreground">Manage your team members and send invites</p>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Send Invite</CardTitle>
          <CardDescription>Invite new team members to collaborate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              type="email"
              placeholder="colleague@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleSendInvite} 
              disabled={isLoading}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Send Invite
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage your team members and pending invites</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No team members found
              </div>
            ) : (
              members.map((member) => (
                <div 
                  key={member.id} 
                  className="flex items-center justify-between p-4 border rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-muted p-2 rounded-full">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">{member.role}</span>
                    {member.status === "pending" ? (
                      <div className="flex items-center">
                        <span className="text-sm text-amber-500 flex items-center mr-2">
                          <span className="bg-amber-100 text-amber-500 px-2 py-1 rounded-full text-xs">
                            Pending
                          </span>
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleCancelInvite(member.id)}
                        >
                          <XCircle className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ) : (
                      <span className="bg-green-100 text-green-500 px-2 py-1 rounded-full text-xs">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
