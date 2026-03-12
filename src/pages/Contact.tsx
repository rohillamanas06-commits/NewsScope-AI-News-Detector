import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Github, Linkedin, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';

const Contact: React.FC = () => {
  const { toast } = useToast();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getThemeColor = () => {
    switch (theme) {
      case 'brown':
        return '#c78f52';
      case 'green':
        return '#10b981';
      case 'purple':
        return '#8b5cf6';
      default:
        return '#c78f52';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: getThemeColor() }}>Contact Us</h1>
            <p className="text-muted-foreground text-lg">
              Have a question, found a bug, or want to give feedback? We'd love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info - Left Side */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-6">Get in touch</h2>
              
              <div className="space-y-4">
                <a 
                  href="mailto:rohillamanas06@gmail.com" 
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="h-5 w-5 text-[#c78f52]" />
                  <span>rohillamanas06@gmail.com</span>
                </a>
                
                <a 
                  href="https://github.com/rohillamanas06-commits" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-5 w-5 text-[#c78f52]" />
                  <span>github.com/rohillamanas06-commits</span>
                </a>
                
                <a 
                  href="https://www.linkedin.com/in/manas-rohilla-b73415338/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Linkedin className="h-5 w-5 text-[#c78f52]" />
                  <span>linkedin.com/in/manas-rohilla-b73415338</span>
                </a>
              </div>
            </div>

            {/* Contact Form - Right Side */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-transparent border-border/50 focus:border-[var(--theme-color)]"
                      style={{ '--theme-color': getThemeColor() } as React.CSSProperties}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="bg-transparent border-border/50 focus:border-[var(--theme-color)]"
                      style={{ '--theme-color': getThemeColor() } as React.CSSProperties}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="bg-transparent border-border/50 focus:border-[var(--theme-color)]"
                    style={{ '--theme-color': getThemeColor() } as React.CSSProperties}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    placeholder="Tell us more..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="bg-transparent border-border/50 focus:border-[var(--theme-color)] resize-none"
                    style={{ '--theme-color': getThemeColor() } as React.CSSProperties}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full text-white" 
                  style={{ backgroundColor: getThemeColor() }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Contact;
