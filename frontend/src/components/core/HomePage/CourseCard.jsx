import React, { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaSignal, FaStar, FaPlay, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import RatingStars from '../../common/RatingStars';
import { getYoutubeThumbnail } from '../../../utils/youtubeUtils';
import { addToWishlist, removeFromWishlist } from '../../../services/operations/wishlistAPI';

const CourseCard = React.memo(function CourseCard({ course }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);
  
  const {
    id,
    thumbnail,
    thumbnail_url,
    custom_thumbnail_url,
    final_thumbnail_url,
    youtube_thumbnail_url,
    youtube_video_url,
    preview_video_url,
    title,
    description,
    rating,
    duration,
    level,
    price,
    isFree,
  } = course;

  const youtubeUrl = preview_video_url || youtube_video_url || null;
  const dbThumb = final_thumbnail_url || youtube_thumbnail_url || null;
  const resolvedThumbnail = useMemo(() => 
    dbThumb || getYoutubeThumbnail(youtubeUrl) || custom_thumbnail_url || thumbnail_url || thumbnail || null,
    [dbThumb, youtubeUrl, custom_thumbnail_url, thumbnail_url, thumbnail]
  );

  const handleImgError = useCallback((e) => {
    const src = e.target.src;
    if (youtubeUrl && src.includes('maxresdefault')) {
      const hq = getYoutubeThumbnail(youtubeUrl, 'hq');
      if (hq && hq !== src) { e.target.src = hq; return; }
    }
    const fallback = custom_thumbnail_url || thumbnail_url || thumbnail;
    if (fallback && src !== fallback) { e.target.src = fallback; return; }
    e.target.style.display = 'none';
  }, [youtubeUrl, custom_thumbnail_url, thumbnail_url, thumbnail]);

  const handleNavigate = useCallback(() => {
    navigate(`/courses/${id}`);
  }, [navigate, id]);

  const isWishlisted = useMemo(() => 
    wishlist.some((item) => item.id === id),
    [wishlist, id]
  );

  const handleWishlistClick = useCallback((e) => {
    e.stopPropagation();
    if (!token) {
      toast.error('Please log in to add to wishlist');
      return;
    }
    if (isWishlisted) {
      dispatch(removeFromWishlist(id, token));
    } else {
      dispatch(addToWishlist(id, course, token));
    }
  }, [token, isWishlisted, dispatch, id, course]);

  const handleButtonClick = useCallback((e) => {
    e.stopPropagation();
    handleNavigate();
  }, [handleNavigate]);

  return (
    <div
      onClick={handleNavigate}
      className="bg-surface rounded-xl border border-border hover:border-border/80 transition-colors overflow-hidden flex flex-col h-full group cursor-pointer relative shadow-sm"
    >
      {/* Top Image */}
      <div className="relative overflow-hidden aspect-video bg-surface-2 border-b border-border">
        {resolvedThumbnail ? (
          <img
            src={resolvedThumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImgError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted">
            <FaPlay className="text-2xl opacity-40" />
          </div>
        )}
        {isFree && (
          <div className="absolute top-3 left-3 bg-success/20 border border-success/40 text-success text-[11px] font-semibold px-2.5 py-0.5 rounded-full z-10">
            Free Course
          </div>
        )}
        
        {/* Wishlist Button Overlay — only for logged-in students */}
        {token && user?.accountType === "Student" && (
          <button
            onClick={handleWishlistClick}
            className={`absolute top-3 right-3 z-20 p-2 rounded-lg border text-xs transition-colors ${
              isWishlisted 
                ? 'bg-danger/20 border-danger text-danger' 
                : 'bg-surface/80 border-border text-muted hover:text-danger'
            }`}
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <FaHeart className={isWishlisted ? "text-danger" : ""} />
          </button>
        )}
      </div>

      {/* Course Info */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-base font-semibold text-text mb-1.5 group-hover:text-accent transition-colors line-clamp-1">
          {title}
        </h3>
        <p className="text-muted text-xs mb-3 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <RatingStars Review_Count={rating} Star_Size={14} />
          <span className="text-xs font-semibold text-text">({rating})</span>
        </div>

        {/* Meta Details */}
        <div className="flex items-center justify-between py-3 border-t border-border mb-4">
          <div className="flex items-center gap-1.5 text-muted text-xs">
            <FaClock className="text-muted text-[11px]" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted text-xs">
            <FaSignal className="text-muted text-[11px]" />
            <span>{level}</span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-muted tracking-wider">Tuition</span>
            <span className={`text-base font-semibold ${isFree ? 'text-success' : 'text-text'}`}>
              {isFree ? 'FREE' : `₹${price}`}
            </span>
          </div>
          <button 
            onClick={handleButtonClick}
            className="btn-primary py-1.5 px-3.5 rounded-lg text-xs font-semibold"
          >
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
});

export default CourseCard;

