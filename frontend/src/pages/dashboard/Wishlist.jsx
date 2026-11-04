import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingCart,
  Star,
  Clock,
  BookOpen,
  Trash2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { removeFromWishlist } from '../../services/operations/wishlistAPI';
import { addToCart } from '../../slices/cartSlice';

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { wishlist: wishlistItems } = useSelector((state) => state.wishlist);

  const stats = {
    total: wishlistItems.length,
    totalValue: wishlistItems.reduce((sum, item) => sum + Number(item.price || 0), 0),
    avgRating: wishlistItems.length 
      ? (wishlistItems.reduce((sum, item) => sum + Number(item.rating || 0), 0) / wishlistItems.length).toFixed(1)
      : 0,
  };

  const handleRemoveFromWishlist = (itemId) => {
    dispatch(removeFromWishlist(itemId, token));
  };

  const handleAddToCart = (course) => {
    dispatch(addToCart(course));
  };

  const handleEnrollNow = (item) => {
    navigate(`/courses/${item.id || item._id}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-border">
        <div>
          <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-1">
            Student Wishlist
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-text tracking-tight">
            Saved Courses
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
            Curated list of courses and specializations you have bookmarked for future enrollment.
          </p>
        </div>
        <div className="text-xs text-muted">
          <span className="font-semibold text-text">{stats.total}</span> courses saved
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-surface border border-border shadow-sm">
          <span className="text-[11px] font-medium text-muted uppercase tracking-wider">Total Saved</span>
          <p className="text-2xl font-bold text-text mt-1">{stats.total}</p>
        </div>
        <div className="p-4 rounded-xl bg-surface border border-border shadow-sm">
          <span className="text-[11px] font-medium text-muted uppercase tracking-wider">Total Value</span>
          <p className="text-2xl font-bold text-text mt-1">₹{stats.totalValue.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-xl bg-surface border border-border shadow-sm col-span-2 sm:col-span-1">
          <span className="text-[11px] font-medium text-muted uppercase tracking-wider">Average Rating</span>
          <p className="text-2xl font-bold text-warning mt-1 flex items-center gap-1.5">
            <Star className="w-5 h-5 fill-current" />
            <span>{stats.avgRating}</span>
          </p>
        </div>
      </div>

      {/* Course Grid */}
      {wishlistItems.length === 0 ? (
        <div className="bg-surface border border-dashed border-border rounded-xl p-16 text-center">
          <div className="w-12 h-12 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-muted mx-auto mb-3">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-text mb-1">Your Wishlist is Empty</h3>
          <p className="text-xs text-muted max-w-sm mx-auto mb-6 leading-relaxed">
            Explore our comprehensive curriculum and bookmark tracks to save them for later.
          </p>
          <Link to="/explore-courses">
            <button className="btn-primary py-2 px-5 text-xs font-semibold">
              Explore Course Catalog
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {wishlistItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm hover:border-border/80 transition-colors flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-surface-2 border-b border-border overflow-hidden">
                    {item.thumbnail || item.thumbnail_url || item.custom_thumbnail_url ? (
                      <img 
                        src={item.thumbnail || item.thumbnail_url || item.custom_thumbnail_url} 
                        alt="thumbnail" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted">
                        <BookOpen className="w-8 h-8 opacity-40" />
                      </div>
                    )}
                    <button
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      title="Remove from wishlist"
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-surface/90 border border-border text-danger hover:bg-danger hover:text-white transition-colors shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Course Details */}
                  <div className="p-5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent block mb-1">
                      {item.category || 'Computer Science'}
                    </span>
                    <h3 className="text-base font-semibold text-text line-clamp-1 mb-1">
                      {item.title || item.course_name}
                    </h3>
                    <p className="text-xs text-muted line-clamp-2 leading-relaxed mb-3">
                      {item.description || item.course_description || 'Structured modular curriculum with real-world problem sets.'}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted pt-2 border-t border-border">
                      <span className="flex items-center gap-1 text-warning">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-text font-semibold">{item.rating || 4.8}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{item.duration || 'Self-Paced'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-5 pt-0 border-t border-border flex items-center justify-between gap-3 mt-auto">
                  <div className="pt-3">
                    <span className="text-base font-bold text-text">
                      {item.price > 0 ? `₹${Number(item.price).toLocaleString()}` : <span className="text-success">FREE</span>}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-3">
                    <button
                      onClick={() => {
                        const course = { ...item };
                        if (!course._id) course._id = course.id;
                        handleAddToCart(course);
                      }}
                      title="Add to cart"
                      className="btn-secondary p-2 text-xs"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleEnrollNow(item)}
                      className="btn-primary py-1.5 px-3 text-xs font-semibold"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
