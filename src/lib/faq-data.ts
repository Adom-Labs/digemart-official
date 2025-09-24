export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FaqItem[] = [
  {
    id: "fees",
    question: "What are your platform fees and commission rates?",
    answer:
      "We charge a competitive 5% commission on each sale, with no monthly fees for basic seller accounts. Premium seller accounts are available for $29/month and include additional features like advanced analytics, priority support, and lower commission rates.",
    category: "pricing",
  },
  {
    id: "payment",
    question: "How do payments and payouts work?",
    answer:
      "We process payments through secure payment providers and trusted payment gateways. When a sale is made, the funds are held securely until the order is confirmed delivered. Sellers receive payouts automatically every 2 weeks, or can request a manual payout once their balance exceeds $100.",
    category: "payments",
  },
  {
    id: "start",
    question: "How do I start selling on your platform?",
    answer:
      "Getting started is easy! Simply create a seller account, verify your identity and payment details, then start listing your products. We provide step-by-step guides and seller support to help you set up your store successfully. You can also integrate existing e-commerce platforms like Shopify.",
    category: "getting-started",
  },
  {
    id: "shipping",
    question: "How is shipping handled?",
    answer:
      "Sellers can choose to handle shipping themselves or use our integrated shipping partners. We provide real-time shipping rate calculations, automated label generation, and tracking updates. Sellers can set their own shipping rates or use our calculated rates based on weight and destination.",
    category: "shipping",
  },
  {
    id: "support",
    question: "What kind of seller support do you provide?",
    answer:
      "We offer 24/7 email support, live chat during business hours, and a comprehensive knowledge base. Premium sellers get access to dedicated account managers and priority support. We also provide regular webinars and training sessions on topics like optimization and marketing.",
    category: "support",
  },
  {
    id: "returns",
    question: "How are returns and refunds handled?",
    answer:
      "We have a standardized return policy that sellers must follow. Buyers have 30 days to initiate returns for most items. Sellers can set their own return shipping policies. We help mediate any disputes and ensure both parties are treated fairly. Refunds are processed within 2-3 business days once returns are received.",
    category: "shipping",
  },
  {
    id: "security",
    question: "How do you ensure platform security?",
    answer:
      "We employ industry-leading security measures including SSL encryption, two-factor authentication, and regular security audits. All transactions are encrypted and we monitor for suspicious activity 24/7. We also maintain PCI DSS compliance for payment processing.",
    category: "security",
  },
  {
    id: "marketing",
    question: "What marketing tools are available to sellers?",
    answer:
      "Sellers have access to built-in SEO tools, social media integration, and promotional features. Premium accounts include advanced marketing analytics, email campaign tools, and the ability to run targeted promotions. We also feature top-performing sellers in our marketplace highlights.",
    category: "getting-started",
  },
  {
    id: "international",
    question: "Do you support international selling?",
    answer:
      "Yes! Sellers can list products internationally and we support multiple currencies and languages. Our platform automatically handles currency conversion and provides international shipping options. We also help with customs documentation and international tax compliance.",
    category: "shipping",
  },
];

// Helper function to get unique categories
export function getCategories(): string[] {
  const categories = new Set(faqData.map((faq) => faq.category));
  return Array.from(categories);
}

export default faqData;
