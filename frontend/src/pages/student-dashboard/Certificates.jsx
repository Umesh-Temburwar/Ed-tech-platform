import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Award, Clock, BookOpen, Download, Share2, QrCode, CheckCircle2 } from 'lucide-react';
import { StatCard, ProgressBar, Modal } from '../../components/dashboard/Common';
import { CERTIFICATES_DATA } from '../../data/student-dashboard-data';

const CertificatesPage = () => {
  const { user } = useSelector((s) => s.profile);

  const fullName =
    user?.full_name?.trim() ||
    [user?.firstName?.trim(), user?.lastName?.trim()].filter(Boolean).join(' ') ||
    [user?.first_name?.trim(), user?.last_name?.trim()].filter(Boolean).join(' ') ||
    'Student';
  const fullNameUpper = fullName.toUpperCase();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);

  const openPreview = (cert) => {
    setSelectedCert(cert);
    setPreviewOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-text">Course Certificates & Credentials</h2>
          <p className="text-xs text-muted mt-0.5">Verified certificates awarded upon completing curriculum and assessments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Award} label="Earned Certificates" value="2" color="emerald" trend="Verified" />
        <StatCard icon={Clock} label="In Progress" value="3" color="amber" trend="Active courses" />
        <StatCard icon={BookOpen} label="Total Enrolled" value="5" color="indigo" trend="Curriculum" />
      </div>

      {/* Earned Certificates */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-text">Earned Academic Certificates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {CERTIFICATES_DATA.earned.map(cert => (
            <div 
              key={cert.id} 
              className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm hover:border-border/80 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="p-5 border-b border-border bg-surface-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center text-success">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold tracking-wider text-muted uppercase">Verified Certificate</span>
                      <h4 className="text-sm font-semibold text-text">{cert.course}</h4>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-muted bg-surface px-2 py-0.5 rounded border border-border">
                    {cert.certId}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="text-muted">Awarded to:</span>
                    <span className="font-semibold text-text">{fullName}</span>
                  </div>
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="text-muted">Issued date:</span>
                    <span className="font-medium text-text">{cert.date}</span>
                  </div>

                  <div className="flex gap-1.5 flex-wrap pt-1">
                    {cert.skills.map(s => (
                      <span key={s} className="text-[11px] px-2 py-0.5 rounded bg-surface-2 text-muted border border-border">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-3 border-t border-border flex gap-2">
                <button 
                  onClick={() => openPreview(cert)} 
                  className="flex-1 btn-primary py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>View & Download Certificate</span>
                </button>
                <button 
                  className="btn-secondary py-2 px-3 rounded-lg text-xs text-muted hover:text-text"
                  title="Share credential"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* In Progress Modules */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-text">Modules In Progress Towards Certification</h3>
        <div className="space-y-3">
          {CERTIFICATES_DATA.inProgress.map(p => (
            <div key={p.id} className="bg-surface border border-border rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-muted shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-text truncate mb-1">{p.course}</h4>
                  <div className="max-w-md">
                    <ProgressBar pct={p.progress} size="h-1.5" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-xs font-medium text-muted">{p.progress}% completed</span>
                <a 
                  href="/dashboard/enrolled-courses" 
                  className="btn-secondary py-1 px-3 rounded-md text-xs font-medium"
                >
                  Continue Course
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Preview */}
      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)}>
        <div className="p-8 bg-surface text-text">
          <div className="border-2 border-border p-8 rounded-lg text-center relative bg-canvas">
            <div className="w-12 h-12 rounded-full border border-border mx-auto mb-4 flex items-center justify-center bg-surface text-success">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-[11px] uppercase tracking-widest text-muted font-semibold mb-1">
              Certificate of Academic Completion
            </p>
            <p className="text-xs text-muted mb-4">This document certifies that</p>
            <h2 className="text-xl font-bold text-text tracking-wide mb-3">{fullNameUpper}</h2>
            <div className="w-16 h-0.5 bg-hot mx-auto mb-4" />
            <p className="text-xs text-muted mb-1">has successfully met all curriculum requirements for</p>
            <h3 className="text-base font-semibold text-text mb-6">{selectedCert?.course}</h3>

            <div className="grid grid-cols-2 gap-8 text-xs border-t border-border pt-4 mt-6">
              <div>
                <p className="text-muted font-medium">Faculty Examiner</p>
                <p className="text-text font-semibold mt-0.5">Academic Council</p>
              </div>
              <div>
                <p className="text-muted font-medium">Credential Verification</p>
                <p className="text-text font-mono font-semibold mt-0.5">{selectedCert?.certId}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={() => setPreviewOpen(false)}
              className="btn-secondary py-2 px-4 rounded-lg text-xs font-medium"
            >
              Close
            </button>
            <button
              onClick={() => window.print()}
              className="btn-primary py-2 px-4 rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CertificatesPage;
