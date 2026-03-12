import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onClick }) => (
  <div className="border border-border rounded-lg overflow-hidden">
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
    >
      <span className="font-medium pr-4">{question}</span>
      <ChevronDown className={`h-5 w-5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    {isOpen && (
      <div className="p-4 pt-0 text-muted-foreground leading-relaxed">
        {answer}
      </div>
    )}
  </div>
);

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How does NewsScope detect fake news?",
      answer: "NewsScope uses advanced AI algorithms to analyze news articles by checking linguistic patterns, cross-referencing multiple trusted sources, and evaluating factual consistency. Our system provides a confidence score based on these factors."
    },
    {
      question: "Is NewsScope free to use?",
      answer: "NewsScope offers both free and premium plans. Free users get a limited number of analyses per day, while premium users enjoy unlimited access, detailed reports, and API access for developers."
    },
    {
      question: "How accurate is the detection?",
      answer: "NewsScope maintains a 99.2% accuracy rate based on extensive testing with known authentic and fake news articles. However, we always recommend using our tool as a supplement to your own critical thinking."
    },
    {
      question: "What sources does NewsScope check against?",
      answer: "We cross-reference content against 7+ trusted news sources and fact-checking organizations including major news outlets, academic databases, and established fact-checking platforms."
    },
    {
      question: "Can I use NewsScope for my website or app?",
      answer: "Yes! We offer API access for developers and businesses. Contact us for API documentation and integration options."
    },
    {
      question: "How do credits work?",
      answer: "Each news analysis consumes 1 credit. Free users receive daily credits, while premium users can purchase credit packages. Credits reset monthly for subscribed users."
    },
    {
      question: "Is my data safe with NewsScope?",
      answer: "Absolutely. We take privacy seriously. Your submitted content is only used for analysis purposes and is not stored permanently. We follow strict data protection protocols and never share your information with third parties."
    },
    {
      question: "What languages does NewsScope support?",
      answer: "Currently, NewsScope primarily supports English. We're working on expanding support to other major languages including Spanish, French, and Hindi."
    },
    {
      question: "How can I report incorrect results?",
      answer: "If you believe our analysis was incorrect, please use the feedback option after each analysis or contact us directly through our contact page with details about the article and why you disagree with our assessment."
    },
    {
      question: "Do you offer refunds for premium plans?",
      answer: "Yes, we offer a 7-day money-back guarantee for all premium plans. If you're not satisfied, contact us within 7 days for a full refund."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Find answers to common questions about NewsScope.
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </main>

    </div>
  );
};

export default FAQ;
