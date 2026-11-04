import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHeadset, FaTicketAlt, FaQuestionCircle, FaEnvelope,
  FaPhoneAlt, FaChevronDown, FaChevronUp, FaPaperPlane,
  FaHistory, FaCheckCircle, FaClock, FaImage, FaTimesCircle,
  FaSearch, FaSpinner, FaInbox, FaShieldAlt, FaBolt,
  FaChartLine, FaUsers, FaVideo, FaMoneyBillWave,
  FaUpload, FaBook, FaFileVideo, FaFileInvoiceDollar,
  FaUserGraduate, FaUserCheck, FaCertificate, FaArrowRight,
  FaStar, FaFileAlt, FaFilter, FaSort, FaPlus,
  FaCommentDots, FaPaperclip, FaTimes
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { supabase } from '../../../config/supabaseClient';
import { useInstructorProfile } from '../../../hooks/useInstructorProfile';

// ─── Constants ────────────────────────────────────────────────────────────────

const SUPPORT_CATEGORIES = [
  { id: 'video-upload', label: 'Video Upload Issues', icon: FaFileVideo, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { id: 'course-publishing', label: 'Course Publishing', icon: FaCertificate, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { id: 'payouts', label: 'Payouts & Revenue', icon: FaMoneyBillWave, color: 'text-green-400', bg: 'bg-green-500/10' },
  { id: 'analytics', label: 'Analytics Problem', icon: FaChartLine, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'students', label: 'Student Issues', icon: FaUsers, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  { id: 'technical-bug', label: 'Technical Bug', icon: FaShieldAlt, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { id: 'verification', label: 'Verification', icon: FaUserCheck, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  { id: 'feature-requests', label: 'Feature Requests', icon: FaStar, color: 'text-purple-400', bg: 'bg-purple-500/10' },
];

const CATEGORY_OPTIONS = [
  'Course Publishing', 'Video Upload', 'Payments & Revenue', 'Student Issues',
  'Technical Support', 'Verification', 'Certificates', 'Analytics', 'Feature Request', 'Other'
];

const STATUS_CONFIG = {
  open:        { label: "Open",        cls: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
  in_progress: { label: "In Progress", cls: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
  resolved:    { label: "Resolved",    cls: "text-green-400 bg-green-500/10 border-green-500/30" },
  closed:      { label: "Closed",      cls: "text-slate-400 bg-slate-500/10 border-slate-500/30" },
};

const PRIORITY_CONFIG = {
  low:    { label: "Low",    cls: "text-slate-400 bg-slate-500/10 border-slate-500/30" },
  medium: { label: "Medium", cls: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
  high:   { label: "High",   cls: "text-orange-400 bg-orange-500/10 border-orange-500/30" },
  urgent: { label: "Urgent", cls: "text-red-400 bg-red-500/10 border-red-500/30" },
};

const INSTRUCTOR_FAQS = [
  { q: "How long does course review take?", a: "After submission our team reviews courses within 24–48 hours. You'll get an email notification once it's live." },
  { q: "Why is my payout delayed?", a: "Payouts are processed on the 1st and 15th of each month. Minimum payout threshold is ₹500. Check Payment Settings for your bank details." },
  { q: "Video upload issue?", a: "Videos must be MP4 format, under 2 GB. Check your internet connection and retry. If the issue persists, submit a ticket with your video file details." },
  { q: "Course rejected?", a: "Courses are rejected for quality reasons. Check your email for specific feedback and resubmit after making the required changes." },
  { q: "How to verify instructor account?", a: "Go to Profile → Verification. Upload your government ID and complete the verification form. Approval takes 24-48 hours." },
];

const ALLOWED_FILE_TYPES = [
  'image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf', 'video/mp4'
];

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

// ─── Reusable Functions ─────────────────────────────────────────────────────

const validateFile = (file) => {
  if (!file) return { valid: false, error: 'No file selected' };
  if (!ALLOWED_FILE_TYPES.includes(file.type)) return { valid: false, error: 'Invalid file type. Please upload PNG, JPG, WEBP, PDF, or MP4.' };
  if (file.size > MAX_FILE_SIZE) return { valid: false, error: 'File size must be less than 20MB' };
  return { valid: true, error: null };
};

// ─── Main Component ───────────────────────────────────────────────────────────

const InstructorSupport = () => {
  const { user } = useSelector(s => s.profile);
  const { profile: instructorProfile, loading: profileLoading, refetch: refetchProfile } = useInstructorProfile();

  // ─── State ─────────────────────────────────────────────────────────────────
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [courseName, setCourseName] = useState("");
  const [priority, setPriority] = useState("medium");
  const [description, setDescription] = useState("");
  const [attachment_url, setAttachment_url] = useState(null);
  
  const [attachment, setAttachment] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  
  // Modal state
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketReplies, setTicketReplies] = useState([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyAttachment, setReplyAttachment] = useState(null);
  const [sendingReply, setSendingReply] = useState(false);

  // ─── Fetch Tickets ──────────────────────────────────────────────────────────
  const fetchTickets = useCallback(async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        setTickets([]);
        setTicketsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("instructor_support_tickets")
        .select("*")
        .eq("instructor_id", authUser.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setTicketsLoading(false);
    }
  }, []);

  // ─── Fetch Ticket Replies ───────────────────────────────────────────────────
  const fetchTicketReplies = useCallback(async (ticketId) => {
    try {
      const { data, error } = await supabase
        .from("instructor_ticket_replies")
        .select("*")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error(error);
        return;
      }

      setTicketReplies(data);
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  }, []);

  // ─── Reset Form ─────────────────────────────────────────────────────────────
  const resetForm = useCallback(() => {
    setSubject("");
    setCategory("");
    setCourseName("");
    setPriority("medium");
    setDescription("");
    setAttachment_url(null);
    setAttachment(null);
    setAttachmentPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);



  // ─── Setup Realtime ─────────────────────────────────────────────────────────
  const setupRealtime = () => {
    const channel = supabase
      .channel("instructor_support_tickets_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "instructor_support_tickets",
        },
        (payload) => {
          console.log("Realtime ticket change:", payload);
          fetchTickets();
        }
      )
      .subscribe((status) => {
        console.log("Realtime Status:", status);
      });

    return channel;
  };

  useEffect(() => {
    let channel;
    let isMounted = true;

    const init = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser?.id || !isMounted) return;

      fetchTickets();
      channel = setupRealtime();
    };

    init();

    return () => {
      isMounted = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, [fetchTickets]);

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handleFileChange = async (e, isReply = false) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const validation = validateFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }
    
    if (isReply) {
      setReplyAttachment(file);
      return;
    }
    
    setAttachment(file);
    const reader = new FileReader();
    reader.onloadend = () => setAttachmentPreview(reader.result);
    reader.readAsDataURL(file);
    setUploading(true);
    
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        toast.error("User not logged in");
        return;
      }

      const fileName = `instructor/${authUser.id}/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('support-attachments')
        .upload(fileName, file);

      if (error) {
        console.error('Upload Error:', error);
        toast.error('File upload failed');
        return;
      }

      const { data: urlData } = supabase.storage
        .from('support-attachments')
        .getPublicUrl(data.path);

      setAttachment_url(urlData.publicUrl);
      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('File upload error:', error);
      toast.error('File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } };
      handleFileChange(fakeEvent);
    }
  };

  const removeAttachment = () => {
    setAttachment(null); 
    setAttachmentPreview(null); 
    setAttachment_url(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();

    try {
      console.log("Submitting ticket...");
      setSubmitting(true);

      const { data: { user: authUser } } = await supabase.auth.getUser();
      const user = authUser;
      console.log("USER:", user);
      console.log("INSTRUCTOR PROFILE:", instructorProfile);

      if (!user) {
        toast.error("User not logged in");
        return;
      }

      if (!subject.trim()) {
        toast.error('Subject is required');
        return;
      }
      if (!category) {
        toast.error('Category is required');
        return;
      }
      if (!description.trim()) {
        toast.error('Description is required');
        return;
      }
      if (uploading) {
        toast.error('Please wait for upload to finish');
        return;
      }

      const instructorName = instructorProfile?.name ||
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.user_metadata?.display_name ||
        user?.email?.split("@")[0] ||
        "Instructor";

      const { data, error } = await supabase
        .from("instructor_support_tickets")
        .insert([
          {
            instructor_id: user.id,
            instructor_name: instructorName,
            instructor_email: instructorProfile?.email || user.email,
            ticket_number: `TKT-${Date.now()}`,
            subject,
            category,
            priority,
            description,
            course_name: courseName,
            attachment_url: attachment_url || null,
          },
        ])
        .select();

      console.log("DATA:", data);
      console.log("ERROR:", error);

      if (error) throw error;

      toast.success("Ticket submitted successfully!");
      await fetchTickets();
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to submit ticket");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Reply Handlers ────────────────────────────────────────────────────────
  const handleSendReply = async () => {
    if (!replyMessage.trim() && !replyAttachment) {
      toast.error('Message or attachment is required');
      return;
    }

    setSendingReply(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser || !selectedTicket) return;

      let replyAttachmentUrl = null;
      if (replyAttachment) {
        const fileName = `instructor/${authUser.id}/replies/${Date.now()}-${replyAttachment.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('support-attachments')
          .upload(fileName, replyAttachment);

        if (uploadError) {
          console.error('Upload Error:', uploadError);
          toast.error('File upload failed');
        } else {
          const { data: urlData } = supabase.storage
            .from('support-attachments')
            .getPublicUrl(uploadData.path);
          replyAttachmentUrl = urlData.publicUrl;
        }
      }

      const { error } = await supabase
        .from("instructor_ticket_replies")
        .insert([
          {
            ticket_id: selectedTicket.id,
            author_id: authUser.id,
            author_type: 'instructor',
            message: replyMessage,
            attachment_url: replyAttachmentUrl,
          },
        ]);

      if (error) {
        console.error('Reply Error:', error);
        toast.error('Failed to send reply');
        return;
      }

      toast.success('Reply sent!');
      setReplyMessage("");
      setReplyAttachment(null);
      await fetchTicketReplies(selectedTicket.id);
    } catch (error) {
      console.error('Reply Error:', error);
      toast.error('Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  // ─── Filtered Tickets ───────────────────────────────────────────────────────
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = !search || 
      ticket.subject?.toLowerCase().includes(search.toLowerCase()) ||
      ticket.category?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !filterStatus || ticket.status === filterStatus;
    const matchesPriority = !filterPriority || ticket.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 text-text">
      <div className="space-y-6">
        {/* Ticket Details Modal */}
        <AnimatePresence>
          {selectedTicket && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4"
              onClick={() => setSelectedTicket(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-3xl bg-[#0F172A] border border-[#1E293B] rounded-3xl overflow-hidden max-h-[90vh] flex flex-col"
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-[#1E293B] flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedTicket.ticket_number || `Ticket #${selectedTicket.id?.slice(0, 8).toUpperCase()}`}</h2>
                    <p className="text-slate-400 text-sm mt-1">{selectedTicket.subject}</p>
                  </div>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Ticket Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-[#1E293B]">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Status</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_CONFIG[selectedTicket.status]?.cls || STATUS_CONFIG.open.cls}`}>
                        {STATUS_CONFIG[selectedTicket.status]?.label || 'Open'}
                      </span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-[#1E293B]">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Priority</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${PRIORITY_CONFIG[selectedTicket.priority]?.cls || PRIORITY_CONFIG.medium.cls}`}>
                        {PRIORITY_CONFIG[selectedTicket.priority]?.label || 'Medium'}
                      </span>
                    </div>
                  </div>

                  {/* Original Ticket Message */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-[#1E293B]">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                        <FaUserGraduate className="text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{selectedTicket.instructor_name || 'You'}</p>
                        <p className="text-slate-500 text-xs">{new Date(selectedTicket.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{selectedTicket.description}</p>
                    {selectedTicket.attachment_url && (
                      <a
                        href={selectedTicket.attachment_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-[#1E293B] text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <FaPaperclip /> View Attachment
                      </a>
                    )}
                  </div>

                  {/* Replies Timeline */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">Conversation</h3>
                    {ticketReplies.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <FaCommentDots className="text-3xl mx-auto mb-2 opacity-50" />
                        <p>No replies yet</p>
                      </div>
                    ) : (
                      ticketReplies.map((reply, idx) => (
                        <div key={idx} className={`p-4 rounded-2xl border ${reply.author_type === 'instructor' ? 'bg-cyan-500/5 border-cyan-500/20 ml-8' : 'bg-white/5 border-[#1E293B] mr-8'}`}>
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${reply.author_type === 'instructor' ? 'bg-cyan-500/20' : 'bg-violet-500/20'}`}>
                              {reply.author_type === 'instructor' ? <FaUserGraduate className="text-cyan-400 text-sm" /> : <FaShieldAlt className="text-violet-400 text-sm" />}
                            </div>
                            <div>
                              <p className="text-white font-semibold text-xs">{reply.author_type === 'instructor' ? 'You' : 'Admin'}</p>
                              <p className="text-slate-500 text-[10px]">{new Date(reply.created_at).toLocaleString()}</p>
                            </div>
                          </div>
                          <p className="text-slate-300 text-sm leading-relaxed">{reply.message}</p>
                          {reply.attachment_url && (
                            <a
                              href={reply.attachment_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-[#1E293B] text-slate-300 hover:text-white hover:bg-white/10 transition-colors text-xs"
                            >
                              <FaPaperclip /> View Attachment
                            </a>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Reply Input */}
                <div className="p-6 border-t border-[#1E293B]">
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Write your reply..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-[#1E293B] bg-white/5 text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition-all resize-none mb-4"
                  />
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          className="hidden"
                          accept={ALLOWED_FILE_TYPES.join(',')}
                          onChange={(e) => handleFileChange(e, true)}
                        />
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-[#1E293B] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                          <FaPaperclip />
                        </div>
                      </label>
                      {replyAttachment && (
                        <span className="text-xs text-slate-400 flex items-center gap-2">
                          {replyAttachment.name}
                          <button onClick={() => setReplyAttachment(null)} className="text-red-400 hover:text-red-300">
                            <FaTimes />
                          </button>
                        </span>
                      )}
                    </div>
                    <button
                      onClick={handleSendReply}
                      disabled={sendingReply}
                      className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {sendingReply ? (
                        <>
                          <FaSpinner className="animate-spin" /> Sending...
                        </>
                      ) : (
                        <>
                          Send Reply <FaPaperPlane />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT SECTION (2 columns) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* TOP HEADER */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4 mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Instructor Support Center
              </h1>
              <p className="text-slate-400 text-lg">
                Dedicated support for instructors and content creators.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <div className="px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl flex items-center gap-3">
                  <FaStar className="text-yellow-400" />
                  <span className="text-yellow-300 font-bold text-sm">Priority Support</span>
                </div>
                <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                  <FaClock className="text-cyan-400" />
                  <span className="text-white font-bold text-sm">Avg Response: 2 Hours</span>
                </div>
                <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                  <FaUsers className="text-green-400" />
                  <span className="text-white font-bold text-sm">Active Support Agents</span>
                </div>
              </div>
            </motion.div>

            {/* QUICK ACTION SUPPORT CARDS */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {SUPPORT_CATEGORIES.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <motion.button
                    key={cat.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 + idx * 0.03 }}
                    onClick={() => setCategory(cat.label)}
                    className={`bg-surface border rounded-xl p-4 text-left transition-colors ${
                      category === cat.label 
                        ? 'border-accent bg-surface-2' 
                        : 'border-border hover:border-border-muted'
                    }`}
                  >
                    <div className="w-8 h-8 bg-surface-2 rounded-lg flex items-center justify-center mb-2.5 border border-border">
                      <Icon className="text-base text-muted" />
                    </div>
                    <h3 className="text-text font-semibold text-xs">{cat.label}</h3>
                  </motion.button>
                );
              })}
            </motion.div>

            {/* CREATE SUPPORT TICKET SECTION */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="mb-6 space-y-4">
                {/* Instructor Profile Box */}
                <div className="p-4 rounded-xl bg-surface-2 border border-border">
                  <div className="flex items-center gap-4">
                    {profileLoading ? (
                      <>
                        <div className="w-14 h-14 rounded-xl bg-surface animate-pulse"></div>
                        <div className="space-y-1.5">
                          <div className="h-5 bg-surface rounded w-40 animate-pulse"></div>
                          <div className="h-3.5 bg-surface rounded w-28 animate-pulse"></div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="relative">
                          <img 
                            src={instructorProfile?.avatar || `https://api.dicebear.com/5.x/initials/svg?seed=Instructor`} 
                            alt="Instructor" 
                            className="w-14 h-14 rounded-xl object-cover border border-border"
                          />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-text">
                            {instructorProfile?.name || "Instructor"}
                          </h3>
                          <p className="text-muted text-xs">
                            {instructorProfile?.email || "instructor@example.com"}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Section Header */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
                    <FaTicketAlt className="text-yellow-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Create Support Ticket</h2>
                    <p className="text-slate-500 text-xs">Get priority assistance</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmitTicket} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-300 mb-2">
                      Subject <span className="text-red-400">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#1E293B] bg-white/5 text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition-all"
                      placeholder="Briefly describe your issue..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">
                      Category <span className="text-red-400">*</span>
                    </label>
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#1E293B] bg-[#020617] text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                    >
                      <option value="">Select category</option>
                      {CATEGORY_OPTIONS.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">
                      Course Name (Optional)
                    </label>
                    <input 
                      type="text" 
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#1E293B] bg-white/5 text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                      placeholder="e.g. Python for Beginners"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-3">
                    Priority
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {['low', 'medium', 'high', 'urgent'].map((p) => {
                      const config = PRIORITY_CONFIG[p];
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={`px-4 py-2.5 rounded-xl border-2 text-xs font-bold transition-all duration-300 ${
                            priority === p 
                              ? config.cls
                              : 'border-[#1E293B] text-slate-500 hover:border-white/20'
                          }`}
                        >
                          {config.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    maxLength={2000}
                    className="w-full px-4 py-3 rounded-xl border border-[#1E293B] bg-white/5 text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition-all resize-none"
                    placeholder="Provide as much detail as possible — error messages, steps to reproduce..."
                  />
                  <div className="flex justify-end mt-2">
                    <span className={`text-xs font-bold ${description.length > 1800 ? 'text-red-400' : 'text-slate-500'}`}>
                      {description.length}/2000
                    </span>
                  </div>
                </div>

                {/* Screenshot Uploader */}
                <div 
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
                    isDragOver 
                      ? 'border-cyan-500/50 bg-cyan-500/5' 
                      : 'border-[#1E293B] bg-white/5 hover:border-cyan-500/30'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    className="hidden" 
                    accept={ALLOWED_FILE_TYPES.join(',')}
                    onChange={handleFileChange}
                  />
                  
                  {attachmentPreview ? (
                    <div className="space-y-4">
                      <div className="relative inline-block">
                        {attachment?.type.startsWith('image/') ? (
                          <img 
                            src={attachmentPreview} 
                            alt="Preview" 
                            className="max-h-40 rounded-xl border border-[#1E293B]"
                          />
                        ) : (
                          <div className="w-32 h-32 bg-white/5 rounded-xl flex items-center justify-center border border-[#1E293B]">
                            <FaFileAlt className="text-4xl text-slate-400" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeAttachment();
                          }}
                          className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg"
                        >
                          <FaTimes />
                        </button>
                      </div>
                      <p className="text-slate-300 font-medium">{attachment?.name}</p>
                      <p className="text-slate-500 text-xs">{(attachment?.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
                        {uploading ? (
                          <FaSpinner className="text-3xl text-cyan-400 animate-spin" />
                        ) : (
                          <FaUpload className="text-3xl text-cyan-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-slate-300 font-medium">
                          {uploading ? 'Uploading...' : 'Click to upload attachment (Optional)'}
                        </p>
                        <p className="text-slate-500 text-xs mt-1">
                          PNG, JPG, WEBP, PDF, MP4 up to 20MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="w-full py-2.5 bg-hot hover:bg-[#e5482a] text-white font-semibold text-xs rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="animate-spin text-xs" />
                      <span>Submitting Ticket...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Support Ticket</span>
                      <FaArrowRight className="text-xs" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* FAQ SECTION */}
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
              <div className="p-5 border-b border-border">
                <h2 className="text-sm font-bold text-text flex items-center gap-2">
                  <FaQuestionCircle className="text-warning text-xs" />
                  Instructor FAQs
                </h2>
              </div>
              <div className="divide-y divide-border">
                {INSTRUCTOR_FAQS.map((faq, idx) => (
                  <div key={idx} className="p-4">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <span className="text-text font-medium text-xs">{faq.q}</span>
                      {expandedFAQ === idx ? (
                        <FaChevronUp className="text-muted text-xs" />
                      ) : (
                        <FaChevronDown className="text-muted text-xs" />
                      )}
                    </button>
                    <AnimatePresence>
                      {expandedFAQ === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="text-muted text-xs mt-2 leading-relaxed">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT SECTION (1 column) */}
          <div className="space-y-6">
            
            {/* MY TICKETS PANEL */}
            <div className="bg-surface border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-text flex items-center gap-2">
                  <FaInbox className="text-muted text-xs" />
                  My Tickets
                </h2>
                <span className="px-2 py-0.5 bg-surface-2 border border-border text-muted text-[11px] font-medium rounded">
                  {tickets.length} Active
                </span>
              </div>

              {/* Search & Filter */}
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Search tickets..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#1E293B] bg-white/5 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#1E293B] bg-[#020617] text-white text-xs focus:outline-none focus:border-cyan-500/50 transition-all"
                  >
                    <option value="">All Status</option>
                    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                  <select 
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#1E293B] bg-[#020617] text-white text-xs focus:outline-none focus:border-cyan-500/50 transition-all"
                  >
                    <option value="">All Priority</option>
                    {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tickets List */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {ticketsLoading ? (
                  Array(4).fill(0).map((_, i) => (
                    <div key={i} className="p-4 border border-[#1E293B] rounded-2xl bg-white/5 animate-pulse">
                      <div className="flex justify-between items-start mb-2">
                        <div className="h-4 bg-white/10 rounded w-24"></div>
                        <div className="h-6 bg-white/10 rounded-full w-20"></div>
                      </div>
                      <div className="h-3 bg-white/10 rounded w-full mb-2"></div>
                      <div className="h-3 bg-white/10 rounded w-32"></div>
                    </div>
                  ))
                ) : filteredTickets.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                      <FaTicketAlt className="text-2xl text-slate-500" />
                    </div>
                    <p className="text-slate-400 text-sm">No tickets yet</p>
                    <p className="text-slate-500 text-xs mt-1">Submit your first ticket above</p>
                  </div>
                ) : (
                  filteredTickets.map((ticket) => {
                    const statusConfig = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
                    const priorityConfig = PRIORITY_CONFIG[ticket.priority] || PRIORITY_CONFIG.medium;
                    return (
                      <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => {
                          setSelectedTicket(ticket);
                          fetchTicketReplies(ticket.id);
                        }}
                        className="p-4 border border-[#1E293B] rounded-2xl hover:bg-white/5 transition-all duration-300 cursor-pointer"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold text-slate-400">{ticket.ticket_number || `#${ticket.id?.slice(0, 8).toUpperCase()}`}</span>
                          <div className="flex gap-2">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusConfig.cls}`}>
                              {statusConfig.label}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${priorityConfig.cls}`}>
                              {priorityConfig.label}
                            </span>
                          </div>
                        </div>
                        <p className="text-white text-sm font-medium mb-2 line-clamp-2">
                          {ticket.subject}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <FaClock />
                            {new Date(ticket.created_at).toLocaleDateString()}
                          </span>
                          {ticket.attachment_url && (
                            <FaPaperclip className="text-slate-500 text-xs" />
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>

            {/* SLA / SUPPORT INFO CARD */}
            <div className="rounded-xl border border-border bg-surface p-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-surface-2 border border-border rounded-lg flex items-center justify-center">
                  <FaHeadset className="text-muted text-xs" />
                </div>
                <div>
                  <h3 className="text-text font-semibold text-xs">Instructor Support SLA</h3>
                  <p className="text-muted text-[11px]">Priority queue active</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-md bg-surface-2 border border-border">
                  <span className="text-muted">Target turnaround</span>
                  <span className="text-text font-medium flex items-center gap-1">
                    <FaBolt className="text-warning text-[10px]" /> Within 2 Hours
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-md bg-surface-2 border border-border">
                  <span className="text-muted">Queue tier</span>
                  <span className="text-text font-medium">Faculty Dedicated</span>
                </div>
              </div>
            </div>

            {/* Quick Help Links */}
            <div className="bg-surface border border-border rounded-xl p-5">
              <h3 className="text-text font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                <FaBook className="text-muted text-xs" />
                Quick Help
              </h3>
              <div className="space-y-1">
                {[
                  { icon: FaBook, label: 'Platform Documentation' },
                  { icon: FaFileInvoiceDollar, label: 'Payout Policies' },
                  { icon: FaFileVideo, label: 'Video Upload Specs' },
                  { icon: FaQuestionCircle, label: 'Instructor Verification FAQ' },
                ].map((link, idx) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={idx}
                      href="#"
                      className="flex items-center gap-2.5 p-2 rounded-md hover:bg-surface-2 transition-colors group"
                    >
                      <div className="w-6 h-6 rounded bg-surface-2 border border-border flex items-center justify-center text-muted group-hover:text-text">
                        <Icon className="text-xs" />
                      </div>
                      <span className="text-muted text-xs font-medium group-hover:text-text transition-colors">
                        {link.label}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorSupport;
