import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle, Mail, MessageSquare, BookOpen, Paperclip, Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../config/supabaseClient';
import { uploadFile as uploadSupportFile, validateFile } from '../../services/storage/supportAttachments';
import { Badge } from '../../components/dashboard/Common';
import { FAQ_DATA } from '../../data/student-dashboard-data';

const SupportPage = () => {
  const { user } = useSelector((s) => s.profile);
  const [openIdx, setOpenIdx] = useState(null);
  const [formSent, setFormSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [subject, setSubject] = useState('Course Content Issue');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    user?.email?.split('@')[0] ||
    '';
  const userEmail = user?.email || '';

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setUserData(data);
    };

    fetchUser();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validation = validateFile(selectedFile);
      if (!validation.valid) {
        toast.error(validation.error);
        return;
      }
      setFile(selectedFile);
      if (selectedFile.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(selectedFile));
      } else {
        setFilePreview(null);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
  };

  const handleFileUpload = async () => {
    if (!file || !user) return null;
    return await uploadSupportFile(file, user, 'student');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      setLoading(true);

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        toast.error('User not logged in');
        return;
      }

      let attachmentUrl = null;
      if (file) {
        attachmentUrl = await handleFileUpload();
      }

      const { error } = await supabase.from('support_tickets').insert([
        {
          user_id: authUser.id,
          subject,
          message,
          attachment_url: attachmentUrl,
          status: 'open',
          priority: 'normal',
        },
      ]);

      if (error) throw error;

      toast.success('Support ticket submitted successfully');
      setFormSent(true);
      setMessage('');
      removeFile();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to submit ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-text">Academic Help Desk & Support</h2>
        <p className="text-xs text-muted mt-0.5">Submit technical or coursework inquiries directly to faculty assistants</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* FAQ Accordion */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-text mb-4">Frequently Asked Questions</h3>
          {FAQ_DATA.map((item, i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-lg overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full p-4 flex justify-between items-center text-left hover:bg-surface-2 transition-colors"
              >
                <span className="text-xs font-semibold text-text">{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-muted transition-transform duration-200 shrink-0 ml-2 ${
                    openIdx === i ? 'rotate-180 text-text' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIdx === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="p-4 pt-0 text-xs text-muted leading-relaxed border-t border-border">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Ticket Form */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          {formSent ? (
            <div className="py-12 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-success/10 border border-success/30 flex items-center justify-center mb-3">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-base font-semibold text-text">Ticket Dispatched</h3>
              <p className="text-xs text-muted mt-1 max-w-xs">
                Your support inquiry has been logged. Our academic team responds within 2-4 business hours.
              </p>
              <button
                onClick={() => setFormSent(false)}
                className="btn-secondary mt-5 py-2 px-4 rounded-lg text-xs font-medium"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-sm font-semibold text-text">Open Support Ticket</h3>
                <Badge text="Academic Response Desk" color="indigo" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-muted mb-1">Name</label>
                  <input
                    type="text"
                    value={displayName}
                    readOnly
                    className="input-field bg-surface-2 text-muted"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-muted mb-1">Email</label>
                  <input
                    type="email"
                    value={userEmail}
                    readOnly
                    className="input-field bg-surface-2 text-muted"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-muted mb-1">Issue Category</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="input-field"
                >
                  <option>Course Content Issue</option>
                  <option>Payment & Enrollment Problem</option>
                  <option>Lecture Player Technical Issue</option>
                  <option>Quiz Submission / Grade Review</option>
                  <option>Certificate Verification Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-muted mb-1">Detailed Description</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="input-field resize-none"
                  placeholder="Describe the issue encountered, including lesson title if relevant..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-muted mb-1">Attachment (Optional)</label>
                {!file ? (
                  <label className="flex flex-col items-center justify-center w-full p-4 border border-dashed border-border rounded-lg cursor-pointer bg-surface-2 hover:border-border/80 transition-colors">
                    <Upload className="w-5 h-5 text-muted mb-1" />
                    <span className="text-xs text-text font-medium">Click to select screenshot or log file</span>
                    <span className="text-[10px] text-muted">PNG, JPG, PDF up to 5MB</span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".png,.jpg,.jpeg,.webp,.pdf"
                      onChange={handleFileChange}
                    />
                  </label>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-surface-2 border border-border rounded-lg">
                    <div className="flex items-center gap-2.5">
                      <Paperclip className="w-4 h-4 text-muted" />
                      <div>
                        <p className="text-xs font-medium text-text">{file.name}</p>
                        <p className="text-[10px] text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-1 hover:bg-surface rounded text-muted hover:text-text transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Dispatched to Support...</span>
                  </>
                ) : (
                  <span>Submit Ticket</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Support Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-border p-4 rounded-xl shadow-sm text-center">
          <Mail className="w-5 h-5 text-accent mx-auto mb-2" />
          <h4 className="text-xs font-semibold text-text">Direct Inquiries</h4>
          <p className="text-[11px] text-muted mt-0.5">support@edtech-platform.edu</p>
        </div>
        <div className="bg-surface border border-border p-4 rounded-xl shadow-sm text-center">
          <MessageSquare className="w-5 h-5 text-success mx-auto mb-2" />
          <h4 className="text-xs font-semibold text-text">Faculty Office Hours</h4>
          <p className="text-[11px] text-muted mt-0.5">Mon–Fri: 10:00 – 17:00 IST</p>
        </div>
        <div className="bg-surface border border-border p-4 rounded-xl shadow-sm text-center">
          <BookOpen className="w-5 h-5 text-warning mx-auto mb-2" />
          <h4 className="text-xs font-semibold text-text">Documentation</h4>
          <p className="text-[11px] text-muted mt-0.5">Syllabus & platform guidebooks</p>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
