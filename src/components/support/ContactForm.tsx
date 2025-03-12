
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface ContactFormProps {
  title: string;
}

export function ContactForm({ title }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, subject: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Request submitted", {
      description: "We'll get back to you as soon as possible"
    });
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      description: ''
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="name" className="text-gray-300 mb-2">Name</Label>
          <Input 
            id="name" 
            type="text" 
            className="border-gray-700 bg-gray-900/50 text-white"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="email" className="text-gray-300 mb-2">Email</Label>
          <Input 
            id="email" 
            type="email" 
            className="border-gray-700 bg-gray-900/50 text-white"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="subject" className="text-gray-300 mb-2">Subject</Label>
          <Select onValueChange={handleSelectChange} value={formData.subject}>
            <SelectTrigger id="subject" className="border-gray-700 bg-gray-900/50 text-white">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="technical">Technical Support</SelectItem>
              <SelectItem value="account">Account Issues</SelectItem>
              <SelectItem value="billing">Billing Questions</SelectItem>
              <SelectItem value="feedback">Feedback</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="description" className="text-gray-300 mb-2">Description</Label>
          <Textarea 
            id="description" 
            rows={4} 
            className="border-gray-700 bg-gray-900/50 text-white"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-charcoal font-medium">
          Submit
        </Button>
      </form>
    </div>
  );
}
