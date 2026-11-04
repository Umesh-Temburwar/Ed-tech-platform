import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { submitGuestContact } from '../services/operations/supportAPI';
import { Mail, Phone, MapPin, CheckCircle2, Send, HelpCircle } from "lucide-react";

const Contact = () => {
  const { user } = useSelector((state) => state.profile);
  const isLoggedIn = !!user;

  const [formData, setFormData] = useState({
    name: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '',
    email: user?.email || '',
    subject: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await submitGuestContact({
        name:    formData.name,
        email:   formData.email,
        subject: formData.subject,
        message: formData.message,
      });
      if (result.success) {
        setTicketId(result.ticketId ? `#${String(result.ticketId).slice(0, 8).toUpperCase()}` : '');
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setIsSubmitted(false), 5000);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      label: 'Email Inquiries',
      value: 'edutechplatform3@gmail.com',
      sub: 'Response within 24 business hours'
    },
    {
      icon: Phone,
      label: 'Support Hotline',
      value: '+91 8856087984',
      sub: 'Monday to Friday, 9am - 6pm IST'
    },
    {
      icon: MapPin,
      label: 'Campus Headquarters',
      value: "M.B.E. Society's College of Engineering",
      sub: 'Ambajogai, Maharashtra 431517'
    }
  ];

  const faqs = [
    {
      q: "How do I enroll in a course?",
      a: "Browse the course catalog, select your course, and click 'Enroll Now'. Both free and paid courses are instantly credited to your dashboard."
    },
    {
      q: "Can I study at my own pace?",
      a: "Yes. All video lectures, problem sheets, and quiz sets have lifetime access with no forced expiration deadlines."
    },
    {
      q: "Are course certificates verified?",
      a: "Each course completion issues a cryptographically authenticated certificate suitable for LinkedIn and academic resumes."
    },
    {
      q: "What if I experience technical video player issues?",
      a: "Our video player supports progressive HD streaming. Reach out directly through the support ticket form above with browser details."
    }
  ];

  return (
    <div className="min-h-screen bg-canvas text-text py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Success Banner */}
        <AnimatePresence>
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-xl bg-success/10 border border-success/30 flex items-center gap-3 text-success text-xs font-medium"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-semibold text-text">Inquiry Dispatched Successfully</p>
                <p className="text-muted mt-0.5">
                  {ticketId ? `Your support reference ticket is ${ticketId}. Our academic coordinators will respond shortly.` : 'Thank you. Our team will get back to you shortly.'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="bg-surface border border-border rounded-xl p-8 md:p-10 text-center space-y-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-surface-2 border border-border text-muted uppercase tracking-wider">
            Help & Communication
          </span>
          <h1 className="text-2xl md:text-4xl font-bold text-text">Contact Technical Support & Admissions</h1>
          <p className="text-xs md:text-sm text-muted max-w-xl mx-auto leading-relaxed">
            Have questions about syllabus breakdowns, student enrollment, or enterprise academic partnerships? Get in touch with our team.
          </p>
        </div>

        {/* Contact Split Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Details */}
          <div className="space-y-4">
            {contactMethods.map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className="p-5 rounded-xl bg-surface border border-border space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-muted mb-2">
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-[10px] text-muted uppercase tracking-wider font-semibold">{c.label}</p>
                  <p className="text-xs font-bold text-text">{c.value}</p>
                  <p className="text-[11px] text-muted">{c.sub}</p>
                </div>
              );
            })}
          </div>

          {/* Right Form */}
          <div className="lg:col-span-2 bg-surface p-6 md:p-8 rounded-xl border border-border">
            <h2 className="text-base font-bold text-text mb-1">Submit an Inquiry</h2>
            <p className="text-xs text-muted mb-5">Please fill out all mandatory fields below.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text block">Full Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Aditi Sharma"
                    className="w-full px-3 py-2 text-xs rounded-md bg-surface-2 border border-border focus:border-accent outline-none text-text transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text block">Email Address <span className="text-danger">*</span></label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="student@example.com"
                    className="w-full px-3 py-2 text-xs rounded-md bg-surface-2 border border-border focus:border-accent outline-none text-text transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text block">Query Category <span className="text-danger">*</span></label>
                <select
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-xs rounded-md bg-surface-2 border border-border focus:border-accent outline-none text-text cursor-pointer"
                >
                  <option value="">Select query classification</option>
                  <option value="Course Curriculum & Syllabus">Course Curriculum & Syllabus</option>
                  <option value="Enrollment & Billing">Enrollment & Billing</option>
                  <option value="Technical Video Streaming">Technical Video Streaming</option>
                  <option value="Certificate Verification">Certificate Verification</option>
                  <option value="Instructor Partnership">Instructor Partnership</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text block">Detailed Message <span className="text-danger">*</span></label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Describe your inquiry or technical question in detail..."
                  className="w-full resize-none px-3 py-2 text-xs rounded-md bg-surface-2 border border-border focus:border-accent outline-none text-text transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-hot text-white rounded-md text-xs font-semibold hover:bg-[#e5482a] disabled:opacity-50 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? 'Dispatching...' : 'Submit Inquiry'}
              </button>
            </form>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-text">Frequently Asked Questions</h2>
            <p className="text-xs text-muted">Common questions regarding platform access and enrollments</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-surface border border-border space-y-2">
                <div className="flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-muted shrink-0 mt-0.5" />
                  <h3 className="text-xs font-semibold text-text">{faq.q}</h3>
                </div>
                <p className="text-xs text-muted leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
