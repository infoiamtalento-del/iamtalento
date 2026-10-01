import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
  };

  return (
    <>
      <Helmet>
        <title>Contact — I Am Talento</title>
        <meta name="description" content="Get in touch with the I Am Talento team. We'd love to hear from you." />
      </Helmet>
      <Layout>
        <section className="pt-32 pb-24">
          <div className="container max-w-5xl">
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Contact</p>
              <h1 className="text-4xl md:text-5xl font-bold font-display leading-[1.15] mb-4">
                Start a Conversation With<br /><span className="text-primary">Our Team</span>
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
                Have a question, need support, or want to learn how I Am Talento can help you —<br className="hidden md:block" />
                we would love to hear from you.
              </p>
            </div>
            <div className="grid md:grid-cols-5 gap-12">
              <form onSubmit={handleSubmit} className="md:col-span-3 space-y-5 p-8 rounded-2xl bg-card border border-border/50">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" placeholder="Your name" required /></div>
                  <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="you@company.com" required /></div>
                </div>
                <div className="space-y-2"><Label htmlFor="subject">Subject</Label><Input id="subject" placeholder="How can we help?" required /></div>
                <div className="space-y-2"><Label htmlFor="message">Message</Label><Textarea id="message" rows={5} placeholder="Tell us more..." required /></div>
                <Button type="submit" className="w-full bg-[hsl(33,100%,50%)] text-white hover:bg-[hsl(33,100%,45%)] border-0">Send Message</Button>
              </form>
              <div className="md:col-span-2 space-y-6">
                {[
                  { icon: Mail, label: "Email", value: "hello@iamtalento.com" },
                  { icon: Phone, label: "Phone", value: "+1 (555) 000-0000" },
                  { icon: MapPin, label: "Office", value: "San Francisco, CA" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border/50">
                    <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{label}</p>
                      <p className="text-sm text-muted-foreground">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Contact;
