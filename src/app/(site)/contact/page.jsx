"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react";

export default function ContactPage() {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContact() {
      try {
        const base =
          process.env.NEXT_PUBLIC_BASE_URL ||
          (typeof window !== "undefined" ? "" : "http://localhost:3000");
        const res = await fetch(`${base}/api/contact`, { cache: "no-store" });
        const data = await res.json();
        setContact(data);
      } catch (err) {
        console.error("Failed to load contact info:", err);
      } finally {
        setLoading(false);
      }
    }
    loadContact();
  }, []);

  if (loading) {
    return (
      <main className="bg-[#1b1a1f] text-white min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin"></div>
        <p className="text-white/70">Loading contact info...</p>
      </main>
    );
  }

  return (
    <main className="bg-[#1b1a1f] text-white min-h-screen">
      {/* Hero Header */}
      <section className="relative py-24 text-center bg-gradient-to-b from-[#ff4e50] via-[#2c2b30] to-[#1b1a1f]">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-xl"
        >
          Contact Us
        </motion.h1>
        <div className="w-1 h-12 bg-brand-primary mx-auto mt-4 rounded"></div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-200 mt-5 text-base md:text-lg max-w-2xl mx-auto"
        >
          Get in touch with <span className="text-brand-primary font-semibold">Koseli Colorado</span> — we’d love to hear from you.
        </motion.p>
      </section>

      {/* Contact Info Section */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {contact?.address && (
            <div className="bg-gray-900/60 rounded-xl p-6 shadow-md border border-gray-800 hover:border-brand-primary/40 transition-all">
              <MapPin className="w-8 h-8 text-brand-primary mb-3" />
              <h3 className="text-xl font-semibold mb-2">Address</h3>
              <p className="text-gray-300">{contact.address}</p>
            </div>
          )}
          {contact?.phone && (
            <div className="bg-gray-900/60 rounded-xl p-6 shadow-md border border-gray-800 hover:border-brand-primary/40 transition-all">
              <Phone className="w-8 h-8 text-brand-primary mb-3" />
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p className="text-gray-300">{contact.phone}</p>
            </div>
          )}
          {contact?.email && (
            <div className="bg-gray-900/60 rounded-xl p-6 shadow-md border border-gray-800 hover:border-brand-primary/40 transition-all">
              <Mail className="w-8 h-8 text-brand-primary mb-3" />
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-gray-300">{contact.email}</p>
            </div>
          )}
        </motion.div>

        {/* Social Media */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-8 mt-12 text-2xl"
        >
          {contact?.facebookUrl && (
            <a
              href={contact.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#1877F2] transition-all"
              aria-label="Facebook"
            >
              <Facebook className="w-7 h-7" />
            </a>
          )}
          {contact?.instagramUrl && (
            <a
              href={contact.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#E1306C] transition-all"
              aria-label="Instagram"
            >
              <Instagram className="w-7 h-7" />
            </a>
          )}
          {contact?.youtubeUrl && (
            <a
              href={contact.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#FF0000] transition-all"
              aria-label="YouTube"
            >
              <Youtube className="w-7 h-7" />
            </a>
          )}
        </motion.div>
      </section>

      {/* Map Section */}
      <section className="py-12 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-xl border border-gray-800"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2918.793783562558!2d-105.1217684243168!3d40.14581047208447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876bf98c6f91bdf5%3A0x94b7ba0678f6f117!2s1255%20Bistre%20St%2C%20Longmont%2C%20CO%2080501%2C%20USA!5e1!3m2!1sen!2snp!4v1761136898227!5m2!1sen!2snp"
            className="w-full h-[400px] md:h-[500px]"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>
      </section>
    </main>
  );
}
