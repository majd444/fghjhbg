import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, X } from "lucide-react";

export type UserInfoField = {
  id: string;
  label: string;
  type: "text" | "email" | "tel" | "select";
  required: boolean;
  placeholder?: string;
  validation?: {
    pattern: string;
    helpText: string;
  };
  options?: string[];
};

export interface UserInfoFieldsConfigProps {
  fields: UserInfoField[];
  onChange: (fields: UserInfoField[]) => void;
}

export function UserInfoFieldsConfig({ fields, onChange }: UserInfoFieldsConfigProps) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">Add Field Templates</h4>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              onChange([
                ...fields,
                {
                  id: "name",
                  label: "Your Name",
                  type: "text",
                  required: true,
                  placeholder: "John Doe"
                }
              ]);
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Name Field
          </Button>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              onChange([
                ...fields,
                {
                  id: "email",
                  label: "Email Address",
                  type: "email",
                  required: true,
                  validation: {
                    pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$",
                    helpText: "Please enter a valid email address"
                  }
                }
              ]);
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Email Field
          </Button>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              onChange([
                ...fields,
                {
                  id: "inquiry",
                  label: "How can I help you?",
                  type: "select",
                  required: true,
                  options: ["General Question", "Technical Support", "Feature Request", "Other"]
                }
              ]);
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Inquiry Dropdown
          </Button>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              onChange([
                ...fields,
                {
                  id: `field_${fields.length + 1}`,
                  label: "Custom Field",
                  type: "text",
                  required: false
                }
              ]);
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Custom Field
          </Button>
        </div>
      </div>
      
      <div className="space-y-4 mt-2">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium">Active Fields</h4>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={fields.length === 0}
            onClick={() => onChange([])}
          >
            Clear All
          </Button>
        </div>
        
        {fields.length === 0 ? (
          <div className="text-center p-4 border border-dashed rounded-md text-gray-500">
            No fields added. Use the templates above to add fields.
          </div>
        ) : (
          fields.map((field, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{field.label}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    const newFields = [...fields];
                    newFields.splice(index, 1);
                    onChange(newFields);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Field ID</label>
                  <Input
                    value={field.id}
                    onChange={(e) => {
                      const newFields = [...fields];
                      newFields[index] = { ...newFields[index], id: e.target.value };
                      onChange(newFields);
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Type</label>
                  <Select
                    value={field.type}
                    onValueChange={(value) => {
                      const newFields = [...fields];
                      newFields[index] = { 
                        ...newFields[index], 
                        type: value as "text" | "email" | "tel" | "select" 
                      };
                      onChange(newFields);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="tel">Phone</SelectItem>
                      <SelectItem value="select">Dropdown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mb-2">
                <label className="text-xs text-gray-500 mb-1 block">Label</label>
                <Input
                  value={field.label}
                  onChange={(e) => {
                    const newFields = [...fields];
                    newFields[index] = { ...newFields[index], label: e.target.value };
                    onChange(newFields);
                  }}
                />
              </div>
              
              {field.type === "select" && (
                <div className="mb-2">
                  <label className="text-xs text-gray-500 mb-1 block">Options (comma separated)</label>
                  <Input
                    value={field.options?.join(", ") || ""}
                    onChange={(e) => {
                      const newFields = [...fields];
                      newFields[index] = { 
                        ...newFields[index], 
                        options: e.target.value.split(",").map(opt => opt.trim())
                      };
                      onChange(newFields);
                    }}
                  />
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id={`required-${index}`} 
                  checked={field.required} 
                  onCheckedChange={(checked) => {
                    const newFields = [...fields];
                    newFields[index] = { ...newFields[index], required: checked };
                    onChange(newFields);
                  }}
                />
                <label
                  htmlFor={`required-${index}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Required
                </label>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
