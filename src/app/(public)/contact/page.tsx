import ContactSection from "@/components/ContactSection";
import WrapContent from "@/components/WrapContent";
import Faq from "@/components/Faq";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-slate-950 pt-24">
            {/* Hero Section */}
            <section className="pt-24">
                <WrapContent>
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            Contact Us
                        </h1>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                            Have questions? read our FAQ or send us a message and we&apos;ll respond as soon as possible.
                        </p>
                    </div>
                </WrapContent>
            </section>

            {/* Contact Section */}
            <ContactSection />

            {/* FAQ Section */}
            <Faq showLink={false} />
        </main>
    );
}
