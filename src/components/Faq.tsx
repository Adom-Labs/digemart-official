"use client";

import React, { useState, useMemo, JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import faqData, { FaqItem } from "@/lib/faq-data";
import { ROUTES } from "@/lib/routes";

function Faq({ showLink = true }: { showLink?: boolean }): JSX.Element {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  // const [helpfulFaqs, setHelpfulFaqs] = useState<Set<string>>(new Set());
  // Get unique categories from FAQ data
  const categories = useMemo(() => {
    const cats = new Set(faqData.map((faq: FaqItem) => faq.category));
    return ["all", ...Array.from(cats)];
  }, []);

  // Filter FAQs based on search and category
  const filteredFaqs = useMemo(() => {
    return faqData.filter((faq) => {
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || faq.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Handle feedback
  // const handleFeedback = (faqId: string, isHelpful: boolean) => {
  //   setHelpfulFaqs((prev) => {
  //     const newSet = new Set(prev);
  //     if (isHelpful) {
  //       newSet.add(faqId);
  //     } else {
  //       newSet.delete(faqId);
  //     }
  //     return newSet;
  //   });
  // };

  return (
    <section className="relative w-full py-16 bg-linear-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-12"
        >
          {/* <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
            <HelpCircle className="w-4 h-4" />
            <span>Support Center</span>
          </div> */}
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find quick answers to common questions about our services and
            features
          </p>
        </motion.div>

        {/* Search and Categories */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search FAQs..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg border border-gray-100"
          layout
        >
          <Accordion
            type="single"
            collapsible
            className="divide-y divide-gray-200"
          >
            <AnimatePresence>
              {filteredFaqs.map((faq, idx) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <AccordionItem
                    value={`item-${idx}`}
                    className="px-6 py-1 first:rounded-t-2xl last:rounded-b-2xl hover:bg-gray-50/50 transition-colors"
                  >
                    <AccordionTrigger className="py-4 text-left">
                      <div className="flex items-start gap-4">
                        <span className="text-lg font-semibold text-gray-900">
                          {faq.question}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pb-6 leading-relaxed">
                      <div className="space-y-4">
                        <p>{faq.answer}</p>
                        {/* <div className="flex items-center gap-4 pt-4 border-t border-gray-100 justify-end">
                          <span className="text-sm text-gray-500">
                            Was this helpful?
                          </span>
                          <button
                            onClick={() => handleFeedback(faq.id, true)}
                            className={`p-2 rounded-full transition-colors ${
                              helpfulFaqs.has(faq.id)
                                ? "bg-green-100 text-green-600"
                                : "hover:bg-gray-100 text-gray-400"
                            }`}
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleFeedback(faq.id, false)}
                            className={`p-2 rounded-full transition-colors ${
                              !helpfulFaqs.has(faq.id)
                                ? "bg-red-100 text-red-600"
                                : "hover:bg-gray-100 text-gray-400"
                            }`}
                          >
                            <ThumbsDown className="w-4 h-4" />
                          </button>
                        </div> */}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </AnimatePresence>
          </Accordion>
        </motion.div>

        {/* No results message */}
        {filteredFaqs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-500"
          >
            No FAQs found matching your search criteria
          </motion.div>
        )}

        {/* CTA Section */}
        {showLink && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-600 mb-4">
              Still have questions? We&apos;re here to help.
            </p>
            <a
              href={ROUTES.CONTACT}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-white hover:bg-blue-700 transition-colors font-medium"
            >
              Contact Support
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default Faq;
