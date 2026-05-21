import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Resources = () => (
  <>
    <Helmet>
      <title>Resources — I Am Talento</title>
      <meta name="description" content="Guides, whitepapers, and industry insights to advance your career." />
    </Helmet>
    <Layout>
      <section className="pt-32 pb-20 md:pt-44 md:pb-32">
        <div className="container text-center max-w-2xl mx-auto">
          <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">Resources</h1>
          <p className="text-lg text-muted-foreground mb-8">Guides, whitepapers, and industry insights. Coming soon.</p>
          <Link to="/"><Button size="lg" className="bg-[hsl(33,100%,50%)] text-white hover:bg-[hsl(33,100%,45%)] border-0 gap-2">Back to Home <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
      </section>
    </Layout>
  </>
);

export default Resources;
