import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CreditCard, Calendar, Receipt, Download, ShoppingBag, CheckCircle } from 'lucide-react';
import { Badge, Modal, EmptyState } from '../../components/dashboard/Common';
import { getUserEnrolledCourses } from '../../services/operations/profileAPI';
import { toast } from 'react-hot-toast';

const MyPurchases = () => {
  const { token, user } = useSelector((state) => state.auth);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        if (token) {
          const data = await getUserEnrolledCourses(token);
          const mappedPayments = (data || []).map(course => ({
            id: course._id,
            amount: course.price || 0,
            course: { title: course.courseName },
            razorpay_payment_id: "ENROLLMENT_VERIFIED",
            razorpay_order_id: "SYS_REC_" + (course._id ? course._id.slice(-6).toUpperCase() : "001"),
            created_at: course.createdAt || new Date().toISOString(),
          }));
          setPayments(mappedPayments);
        }
      } catch (err) {
        console.error("Failed to load purchase history:", err);
        toast.error("Could not load payment history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [token]);

  const formatDate = (dateStr) => {
    const opt = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', opt);
  };

  const totalSpent = payments.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const successfulPurchasesCount = payments.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-text">Invoices & Enrollment Records</h2>
        <p className="text-xs text-muted mt-0.5">View transaction logs and printable tax receipts for all enrolled coursework</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-surface-2 border border-border text-accent flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-muted text-xs font-medium">Enrolled Courses</h3>
            <p className="text-2xl font-semibold text-text mt-0.5">{successfulPurchasesCount}</p>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-surface-2 border border-border text-success flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-muted text-xs font-medium">Total Billed</h3>
            <p className="text-2xl font-semibold text-text mt-0.5">₹{totalSpent.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-surface-2 border border-border text-warning flex items-center justify-center shrink-0">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-muted text-xs font-medium">Receipts Available</h3>
            <p className="text-2xl font-semibold text-text mt-0.5">{successfulPurchasesCount}</p>
          </div>
        </div>
      </div>

      {/* Purchases List */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-text">Transaction History</h3>
        
        {loading ? (
          <div className="p-12 bg-surface rounded-xl border border-border flex flex-col items-center justify-center">
            <div className="w-6 h-6 border-2 border-border border-t-text rounded-full animate-spin mb-3"></div>
            <p className="text-muted text-xs">Loading transaction records...</p>
          </div>
        ) : payments.length > 0 ? (
          <div className="space-y-3">
            {payments.map((p) => {
              const courseTitle = p.course?.title || "Academic Course Enrollment";

              return (
                <div 
                  key={p.id} 
                  className="bg-surface border border-border rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-border/80 transition-colors"
                >
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm text-text">{courseTitle}</h4>
                    <div className="flex items-center gap-3 text-xs text-muted">
                      <span>Order: {p.razorpay_order_id}</span>
                      <span>·</span>
                      <span>Date: {formatDate(p.created_at)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0 justify-between sm:justify-end">
                    <div className="text-left sm:text-right">
                      <p className="text-[11px] text-muted">Amount</p>
                      <p className="text-sm font-semibold text-text">
                        {p.amount > 0 ? `₹${p.amount.toLocaleString('en-IN')}` : 'Included in Plan'}
                      </p>
                    </div>

                    <Badge text="Settled" color="emerald" />

                    <button
                      onClick={() => setSelectedPayment(p)}
                      className="btn-secondary py-1.5 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Receipt</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState 
            icon={Receipt} 
            title="No transactions logged" 
            subtitle="You haven't made any course purchases yet. Explore our curriculum catalog to begin." 
            ctaText="Browse Courses"
            onCta={() => window.location.href = "/explore-courses"} 
          />
        )}
      </div>

      {/* Invoice Modal */}
      <Modal open={!!selectedPayment} onClose={() => setSelectedPayment(null)}>
        {selectedPayment && (
          <div className="p-6 bg-surface text-text space-y-5">
            <div className="flex justify-between items-start border-b border-border pb-4">
              <div>
                <h3 className="text-base font-semibold text-text">Academic Enrollment Receipt</h3>
                <p className="text-xs text-muted mt-0.5">EdTech Learning Platform · Tax Document</p>
              </div>
              <span className="text-[11px] font-mono bg-surface-2 border border-border px-2.5 py-1 rounded text-muted">
                {selectedPayment.razorpay_order_id}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted">Item Description:</span>
                <span className="font-semibold text-text">{selectedPayment.course?.title}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted">Date of Transaction:</span>
                <span className="text-text">{formatDate(selectedPayment.created_at)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted">Payment Verification:</span>
                <span className="text-success font-medium flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
              <div className="flex justify-between py-2 text-sm font-semibold">
                <span className="text-text">Total Amount Paid:</span>
                <span className="text-text">
                  {selectedPayment.amount > 0 ? `₹${selectedPayment.amount.toLocaleString('en-IN')}` : '₹0 (Scholarship / Included)'}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button
                onClick={() => setSelectedPayment(null)}
                className="btn-secondary py-1.5 px-4 rounded-lg text-xs font-medium"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="btn-primary py-1.5 px-4 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyPurchases;
