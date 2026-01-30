import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, MessageCircle, Share2, Bookmark,
  Plus, MoreHorizontal, Leaf,
  TrendingUp, Award, Image as ImageIcon,
  X, ChevronRight, Play, ArrowLeft
} from 'lucide-react';
import './Community.css';
import Confetti from 'react-confetti';
import axios from 'axios';

// --- CONFIG & DUMMY DATA ---
const API_BASE = "http://localhost:5002/api";

const DUMMY_REELS = [
  {
    id: 'r1',
    user: 'botanist_jane',
    avatar: 'https://i.pravatar.cc/150?u=jane',
    video: 'https://commons.wikimedia.org/wiki/Special:FilePath/Monstera_Deliciosa_Leaf_Bloom.webm',
    poster: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=400',
    caption: 'My Monstera Deliciosa unfurling a new leaf! 🌿 #monstera #timelapse',
    likes: 120,
    isPlant: true
  },
  {
    id: 'r2',
    user: 'green_thumb_mike',
    avatar: 'https://i.pravatar.cc/150?u=mike',
    video: 'https://commons.wikimedia.org/wiki/Special:FilePath/Venus_Flytrap_(time_lapse).webm',
    poster: 'https://images.unsplash.com/photo-1554631221-f9603e6808ba?auto=format&fit=crop&q=80&w=400',
    caption: 'Venus Flytrap in action! 🦟 Beware pests! #carnivorousplants',
    likes: 85,
    isPlant: true
  },
  {
    id: 'r3',
    user: 'urban_jungle',
    avatar: 'https://i.pravatar.cc/150?u=urban',
    video: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lima_Bean_Time_Lapse.webm',
    poster: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?auto=format&fit=crop&q=80&w=400',
    caption: 'Lima Bean growth speedrun 🏃‍♂️🌱 #growth #nature',
    likes: 210,
    isPlant: true
  },
  {
    id: 'r4',
    user: 'succulent_sam',
    avatar: 'https://i.pravatar.cc/150?u=sam',
    video: 'https://commons.wikimedia.org/wiki/Special:FilePath/Strawberry_growth_(Video).webm',
    poster: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&q=80&w=400',
    caption: 'From flower to strawberry 🍓 Amazing process! #fruit #garden',
    likes: 95,
    isPlant: true
  },
  {
    id: 'r5',
    user: 'clover_fan',
    avatar: 'https://i.pravatar.cc/150?u=clover',
    video: 'https://commons.wikimedia.org/wiki/Special:FilePath/Time_lapse_clover.webm',
    poster: 'https://images.unsplash.com/photo-1595855739818-45d2f70d22c5?auto=format&fit=crop&q=80&w=400',
    caption: 'Watching these clovers dance is mesmerizing 🍀 #clover #timelapse',
    likes: 150,
    isPlant: true
  },
];

const DUMMY_POSTS = [
  {
    id: 'p1',
    user: { name: 'Sarah Green', avatar: 'https://i.pravatar.cc/150?u=sarah', handle: '@sarah_g' },
    image: 'https://images.unsplash.com/photo-1459156212016-c812468e2115?auto=format&fit=crop&q=80&w=800',
    caption: 'My Monstera finally put out a fenestrated leaf! 🌿 Only took 6 months of patience and a lot of humidity.',
    likes: 42,
    comments: 8,
    isPlant: true,
    time: '2 hours ago',
    tags: ['monstera', 'growth', 'victory']
  },
  {
    id: 'p2',
    user: { name: 'David Chen', avatar: 'https://i.pravatar.cc/150?u=david', handle: '@d_chen' },
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=800',
    caption: 'Anyone know what\'s wrong with my tomato leaves? They are turning yellow at the bottom. 🍅 #help',
    likes: 12,
    comments: 15,
    isPlant: true,
    time: '5 hours ago',
    tags: ['help', 'tomatoes', 'diagnosis']
  },
  {
    id: 'p3',
    user: { name: 'Emily Rose', avatar: 'https://i.pravatar.cc/150?u=emily', handle: '@rose_garden' },
    image: 'https://images.unsplash.com/photo-1446071103084-c257b5f70672?auto=format&fit=crop&q=80&w=800',
    caption: 'Behold the beauty of my new Succulent arrangement! 🌵 Spent all weekend potting these babies. Do they look crowded?',
    likes: 89,
    comments: 23,
    isPlant: true,
    time: '1 day ago',
    tags: ['succulents', 'arrangements', 'diy']
  },
  {
    id: 'p4',
    user: { name: 'Jungle Jim', avatar: 'https://i.pravatar.cc/150?u=jim', handle: '@urban_jungle_jim' },
    image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=800',
    caption: 'Living room goals. 🛋️🌿 I think I might have an addiction, but at least the air is clean!',
    likes: 342,
    comments: 45,
    isPlant: true,
    time: '2 days ago',
    tags: ['interiordesign', 'indoorplants', 'airpurifying']
  },
  {
    id: 'p5',
    user: { name: 'Growlify Team', avatar: 'https://i.pravatar.cc/150?u=growlify', handle: '@growlify_official' },
    image: '/challenge.png',
    caption: '🌿 SHOW US YOUR GREEN SPACE! | Join the #GreenThumbChallenge 📸 Take a beautiful photo of your plant and tell us your favorite plant care tip to win 500 Growlify Points!',
    likes: 240,
    comments: 56,
    isPlant: false,
    time: 'Just now',
    tags: ['GreenThumbChallenge', 'community', 'Growlify', 'challenge']
  }
];

const REWARDS_DATA = [
  { id: 'rem1', name: 'Starter Succulent Seeds', points: 300, icon: '🌱' },
  { id: 'rem2', name: 'Organic Fertilizer Pro', points: 500, icon: '🍃' },
  { id: 'rem3', name: 'Premium Ceramic Pot', points: 1200, icon: '🏺' },
  { id: 'rem4', name: 'Growlify Shop 20% OFF', points: 2000, icon: '🏷️' },
];

// --- COMPONENTS ---

const HeroSection = () => {
  const [greeting, setGreeting] = useState('Welcome Back');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  return (
    <div className="hero-section">
      <div className="hero-header">
        <div className="greeting-box">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p style={{ margin: 0, color: 'var(--c-text-tertiary)', fontWeight: 600 }}>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <h1>{greeting}, Gardener 🌿</h1>
          </motion.div>
        </div>

        <div className="community-pulse">
          <motion.div className="pulse-badge" whileHover={{ scale: 1.05 }}>
            <div className="pulse-dot"></div>
            <span>1.2k Active Now</span>
          </motion.div>
          <motion.div className="pulse-badge" whileHover={{ scale: 1.05 }}>
            <TrendingUp size={16} color="var(--c-accent-primary)" />
            <span>Trending: #MonsteraMonday</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const CommentDrawer = ({ isOpen, onClose, reelId, comments = [], onAddComment }) => {
  const [text, setText] = useState('');

  if (!isOpen) return null;

  return (
    <div className="shorts-comments-drawer" onClick={e => e.stopPropagation()}>
      <div className="drawer-header">
        <span>Comments ({comments.length})</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>
      <div className="drawer-body">
        {comments.map((c, i) => (
          <div key={i} className="comment-item">
            <div className="comment-avatar" style={{ background: '#eee' }}></div> {/* Placeholder avatar */}
            <div className="comment-content">
              <div className="comment-username">{c.user}</div>
              <div className="comment-text">{c.text}</div>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>No comments yet.</div>
        )}
      </div>
      <div className="drawer-footer">
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#ccc', flexShrink: 0 }}></div>
          <input
            type="text"
            className="comment-inline-input"
            style={{ margin: 0, flex: 1 }}
            placeholder="Add a comment..."
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && text.trim()) {
                onAddComment(text);
                setText('');
              }
            }}
          />
          <button
            style={{ background: 'none', border: 'none', color: text.trim() ? 'var(--c-accent-primary)' : '#ccc', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => {
              if (text.trim()) {
                onAddComment(text);
                setText('');
              }
            }}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

const ShortsViewer = ({ initialReelId, shorts, onClose }) => {
  // Find index of initial reel
  const initialIndex = shorts.findIndex(r => r.id === initialReelId);
  const scrollRef = useRef(null);
  const [playingId, setPlayingId] = useState(initialReelId);

  useEffect(() => {
    // Scroll to initial reel
    if (scrollRef.current && initialIndex !== -1) {
      const el = scrollRef.current.children[initialIndex];
      // Timeout to ensure DOM is ready and layout is stable
      setTimeout(() => el.scrollIntoView(), 50);
    }
  }, [initialIndex]);

  // Observer to track which video is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.dataset.id;
            if (id) setPlayingId(id);
          }
        });
      },
      { threshold: 0.6 }
    );

    const children = scrollRef.current?.children;
    if (children) {
      Array.from(children).forEach(child => observer.observe(child));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="shorts-modal-overlay">
      {/* Back Button (Top Left) */}
      <button
        className="back-button"
        style={{
          position: 'fixed',
          top: 20,
          left: 20,
          zIndex: 10002, /* Higher than drawers and overlays */
          background: 'rgba(0,0,0,0.5)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: 44,
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}
        onClick={onClose}
      >
        <ArrowLeft size={24} strokeWidth={2.5} />
      </button>

      {/* Close Button (Top Right - Keep purely for desktop/habit, or remove if redundant. Keeping as backup) */}
      <button className="shorts-close-btn" onClick={onClose}>
        <X size={24} />
      </button>

      <div className="shorts-container" ref={scrollRef}>
        {shorts.map(reel => (
          <ShortsSlide key={reel.id} reel={reel} isPlaying={playingId === reel.id} />
        ))}
      </div>
    </div>
  );
};

const ShortsSlide = ({ reel, isPlaying }) => {
  const videoRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comments, setComments] = useState([
    { user: 'PlantLover', text: 'Amazing growth! 🌱' },
    { user: 'GreenThumb', text: 'How often do you water?' }
  ]);

  useEffect(() => {
    if (isPlaying && !isPaused) {
      videoRef.current?.play().catch(() => { });
    } else {
      videoRef.current?.pause();
      if (!isPlaying) videoRef.current.currentTime = 0;
    }
  }, [isPlaying, isPaused]);

  // Double tap gesture
  const lastTapRef = useRef(0);
  const handleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap detected
      handleLike();
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 1000);
    } else {
      // Single tap - toggle play/pause
      togglePlay();
    }
    lastTapRef.current = now;
  };

  const togglePlay = async () => {
    if (!videoRef.current) return;

    try {
      if (videoRef.current.paused) {
        await videoRef.current.play();
        setIsPaused(false);
      } else {
        videoRef.current.pause();
        setIsPaused(true);
      }
    } catch (e) {
      console.warn("Playback error:", e);
      // Optional: set UI state to show error
    }
  };

  const handleLike = async () => {
    const previousLiked = liked;
    setLiked(!previousLiked);

    if (!previousLiked) {
      try {
        if (reel.id && reel.id.length > 5) {
          await axios.post(API_BASE + '/posts/' + reel.id + '/like');
        }
      } catch (e) {
        console.error("Like failed", e);
        setLiked(previousLiked);
      }
    }
  };

  const handleShare = () => {
    const shareData = {
      title: 'Growlify Shorts',
      text: 'Check out this amazing plant video by ' + reel.user + '!',
      url: window.location.href
    };
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert("Link copied! 📋");
    }
  };

  const addComment = async (text) => {
    // Optimistic update for local view
    const newComment = { user: 'You', text };
    setComments([...comments, newComment]);

    try {
      if (reel.id && reel.id.length > 5) {
        await axios.post(API_BASE + '/posts/' + reel.id + '/comment', {
          user: 'You',
          text
        });
      }
    } catch (e) {
      console.error("Comment failed", e);
      // Optional: show error to user
    }
  };

  return (
    <div className="short-slide" data-id={reel.id}>
      <video
        ref={videoRef}
        src={reel.video}
        className="short-video"
        loop
        playsInline
        onClick={handleTap}
        poster={reel.poster}
        onError={(e) => {
          console.error("Video error:", e.nativeEvent);
          e.target.style.display = 'none'; // Fallback to poster
        }}
      />

      {/* Double Tap Heart Animation */}
      {showHeartAnim && (
        <div className="double-tap-heart">
          <Heart size={100} fill="rgba(255, 255, 255, 0.9)" color="transparent" />
        </div>
      )}

      <div className={'play-pause-indicator ' + (isPaused ? 'paused' : '')}>
        <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: 20 }}>
          <Play size={40} fill="white" color="white" />
        </div>
      </div>

      <div className="short-overlay-ui">
        <div className="short-content-info">
          <div className="short-user-row">
            <img src={reel.avatar} alt={reel.user} className="short-avatar" />
            <span className="short-username">{reel.user}</span>
            <button className="short-follow-btn">Follow</button>
          </div>
          <div className="short-caption">{reel.caption}</div>
        </div>

        <div className="short-actions-sidebar">
          <button className="short-action-btn" onClick={handleLike}>
            <div className="short-action-icon-wrap">
              <Heart size={28} fill={liked ? '#D64045' : 'none'} color={liked ? '#D64045' : 'white'} />
            </div>
            <span className="short-action-label">{reel.likes + (liked ? 1 : 0)}</span>
          </button>

          <button className="short-action-btn" onClick={() => setIsCommentsOpen(true)}>
            <div className="short-action-icon-wrap">
              <MessageCircle size={28} color="white" />
            </div>
            <span className="short-action-label">{comments.length}</span>
          </button>

          <button className="short-action-btn" onClick={handleShare}>
            <div className="short-action-icon-wrap">
              <Share2 size={28} color="white" />
            </div>
            <span className="short-action-label">Share</span>
          </button>

          <button className="short-action-btn">
            <div className="short-action-icon-wrap">
              <MoreHorizontal size={28} color="white" />
            </div>
          </button>

          <div style={{
            width: 40, height: 40, borderRadius: 6, border: '2px solid white',
            overflow: 'hidden', marginTop: 10
          }}>
            <img src={reel.poster} alt="Reel thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isCommentsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 10009 }}
            onClick={() => setIsCommentsOpen(false)}
          >
            <CommentDrawer
              isOpen={isCommentsOpen}
              onClose={() => setIsCommentsOpen(false)}
              comments={comments}
              onAddComment={addComment}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ReelsRail = ({ shorts = [], onOpenShorts }) => {
  return (
    <div className="reels-rail">
      <div className="rail-header">
        <h3>Grow-Shorts</h3>
        <span
          style={{ fontSize: '0.9rem', color: 'var(--c-accent-primary)', cursor: 'pointer', fontWeight: 600 }}
          onClick={() => {
            if (shorts.length > 0) onOpenShorts(shorts[0].id);
          }}
        >
          View All
        </span>
      </div>
      <div className="rail-scroll-area">
        {shorts.map((reel) => (
          <div
            key={reel.id}
            className="reel-card"
            style={{
              backgroundImage: 'url(' + reel.poster + ')',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            onMouseEnter={async (e) => {
              const video = e.currentTarget.querySelector('video');
              try {
                await video.play();
              } catch (err) {
                // Silently fail if autoplay blocked
              }
            }}
            onMouseLeave={(e) => {
              const video = e.currentTarget.querySelector('video');
              video.pause();
              video.currentTime = 0;
            }}
            onClick={() => onOpenShorts(reel.id)}
          >
            <video
              className="reel-bg-video"
              loop
              muted
              playsInline
              poster={reel.poster}
            >
              <source src={reel.video} type="video/mp4" />
            </video>

            <div className="reel-overlay">
              <div className="reel-user">
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', marginRight: 6 }}></div>
                {reel.user}
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>{reel.caption.substring(0, 30)}...</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RedeemModal = ({ isOpen, onClose, reward, onRedeem, userPoints }) => {
  if (!isOpen || !reward) return null;
  const canAfford = userPoints >= reward.points;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="modal-header">
          Redeem Reward
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>{reward.icon}</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>{reward.name}</h3>
          <p style={{ color: 'var(--c-text-secondary)', marginTop: 8, fontSize: '0.95rem' }}>
            Cost: <strong style={{ color: 'var(--c-accent-primary)' }}>{reward.points} points</strong>
          </p>
          <div style={{
            marginTop: 20,
            padding: 16,
            background: canAfford ? 'var(--c-accent-soft)' : 'rgba(214, 64, 69, 0.1)',
            borderRadius: 12,
            fontSize: '0.95rem',
            fontWeight: 600,
            border: '2px solid ' + (canAfford ? 'var(--c-accent-primary)' : 'var(--c-danger)'),
            color: canAfford ? 'var(--c-accent-primary)' : 'var(--c-danger)'
          }}>
            Your Balance: <strong>{userPoints} points</strong>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
            <button
              className="tab-pill"
              style={{
                flex: 1,
                border: '2px solid #e0e0e0',
                background: 'white',
                padding: '12px 24px',
                fontWeight: 600
              }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="tab-pill active"
              style={{
                flex: 1,
                opacity: canAfford ? 1 : 0.5,
                cursor: canAfford ? 'pointer' : 'not-allowed',
                border: 'none',
                padding: '12px 24px',
                fontWeight: 600
              }}
              disabled={!canAfford}
              onClick={() => onRedeem(reward)}
            >
              Confirm
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const CreatePostModal = ({ isOpen, onClose, onPost }) => {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (!text.trim() && !imageFile) return;
    setIsSubmitting(true);

    const newPost = {
      id: 'p-new-' + Date.now(),
      user: { name: 'You', avatar: 'https://i.pravatar.cc/150?u=me', handle: '@you' },
      image: imagePreview || 'https://picsum.photos/seed/' + Date.now() + '/800/800',
      caption: text,
      likes: 0,
      comments: 0,
      isPlant: true,
      time: 'Just Now',
      tags: ['community']
    };

    onPost(newPost);
    setText('');
    setImageFile(null);
    setImagePreview(null);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        style={{ maxWidth: '550px', background: 'white' }}
      >
        <div className="create-post-header" style={{ background: 'white' }}>
          <h2>Create New Post</h2>
          <button onClick={onClose} className="btn-ghost" style={{ padding: 8 }}>
            <X size={24} />
          </button>
        </div>

        <div className="create-post-body">
          <div className="user-preview-row">
            <img src="https://i.pravatar.cc/150?u=me" alt="You" className="author-avatar" />
            <span className="author-name">You</span>
          </div>

          <textarea
            className="caption-input"
            placeholder="What's growing in your garden today?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
          />

          {!imagePreview ? (
            <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
              <div className="upload-icon-circle">
                <ImageIcon size={24} color="var(--c-accent-primary)" />
              </div>
              <span className="upload-text">Add Photo or Video</span>
              <span style={{ fontSize: '0.8rem', color: '#aaa', marginTop: 4 }}>Drag & drop or click to upload</span>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*,video/*"
                style={{ display: 'none' }}
              />
            </div>
          ) : (
            <div className="image-preview-container">
              <img src={imagePreview} alt="Preview" />
              <button className="remove-image-btn" onClick={removeImage}>
                <X size={18} />
              </button>
            </div>
          )}

          <div className="modal-footer-actions">
            <button className="btn-ghost" onClick={onClose}>Cancel</button>
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={(!text.trim() && !imageFile) || isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Feed = ({ posts, onCommentAdded, onPostDeleted }) => {
  const [expandedComments, setExpandedComments] = useState({});
  const [bookmarks, setBookmarks] = useState({});
  const [filter, setFilter] = useState('all');
  const [likes, setLikes] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null); // New state for menu

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        // Check if it's a real MongoDB ID (24 hex characters)
        const isRealId = /^[0-9a-fA-F]{24}$/.test(id);

        if (isRealId) {
          await axios.delete(`${API_BASE}/posts/${id}`);
        } else {
          console.log("Removing dummy post locally:", id);
        }

        if (onPostDeleted) onPostDeleted(id);

      } catch (e) {
        console.error("Delete failed", e);
        // If error is 404, it means post is already gone, so we should remove it locally anyway
        if (e.response && e.response.status === 404) {
          alert("Post was already deleted or not found. Removing from view.");
          if (onPostDeleted) onPostDeleted(id);
          setOpenMenuId(null);
          return;
        }

        const errorMsg = e.response?.data?.message || e.message;
        alert(`Failed to delete post: ${errorMsg}`);
      }
    }
    setOpenMenuId(null);
  };


  const handleLike = async (id) => {
    setLikes(prev => ({ ...prev, [id]: !prev[id] }));
    try {
      await axios.post(API_BASE + '/posts/' + id + '/like');
    } catch (e) {
      console.warn("Like sync failed", e);
    }
  };

  const toggleComments = (id) => {
    setExpandedComments(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = (post) => {
    const url = window.location.origin + '/post/' + post.id;
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copied to clipboard! 📋");
    });
  };

  const toggleBookmark = (id) => {
    setBookmarks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredPosts = posts.filter(p => {
    if (filter === 'plants') return p.isPlant;
    if (filter === 'challenge') return p.tags.includes('challenge');
    return true;
  });

  return (
    <div className="feed-section">
      <div className="feed-tabs">
        {['all', 'plants', 'challenge', 'tips'].map(f => (
          <button
            key={f}
            className={'tab-pill ' + (filter === f ? 'active' : '')}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filter === 'challenge' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="challenge-banner"
          style={{
            background: 'linear-gradient(135deg, var(--c-accent-primary) 0%, #2D5A27 100%)',
            color: 'white',
            padding: '24px',
            borderRadius: '20px',
            marginBottom: '24px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 25px rgba(45, 90, 39, 0.25)'
          }}
        >
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Award size={20} color="#FFD700" />
              <span style={{ fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Challenge</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 12 }}>#GreenThumbChallenge 🌿</h2>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '1rem', lineHeight: 1.5, maxWidth: '80%' }}>
              Show off your plants and win <strong>500 points</strong>! The Growlify Team is looking for the most vibrant setups.
            </p>
          </div>
          <Leaf style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.15, transform: 'rotate(-15deg)' }} size={160} />
        </motion.div>
      )}

      <AnimatePresence>
        {filteredPosts.map((post) => (
          <motion.div
            key={post.id}
            className="post-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="post-header">
              <div className="post-author-info">
                <img src={post.user.avatar} className="author-avatar" alt="avatar" />
                <div>
                  <div className="author-name">{post.user.name}</div>
                  <div className="post-time">{post.time}</div>
                </div>
              </div>
              <div style={{ position: 'relative' }}>
                <button className="action-btn" onClick={() => setOpenMenuId(openMenuId === post.id ? null : post.id)}>
                  <MoreHorizontal size={20} />
                </button>
                {openMenuId === post.id && (
                  <div className="post-menu-dropdown">
                    <button onClick={() => handleDelete(post.id || post._id)} className="menu-item delete">
                      Delete Post
                    </button>
                  </div>
                )}
              </div>
            </div>

            <img src={post.image} className="post-media" alt="Post content" loading="lazy" />

            <div className="post-content-wrap">
              <div className="action-bar">
                <div className="action-group">
                  <button className="action-btn" onClick={() => handleLike(post.id)}>
                    <Heart
                      size={26}
                      fill={likes[post.id] ? "#D64045" : "none"}
                      color={likes[post.id] ? "#D64045" : "currentColor"}
                      style={{ transition: 'all 0.2s', transform: likes[post.id] ? 'scale(1.1)' : 'scale(1)' }}
                    />
                  </button>
                  <button className="action-btn" onClick={() => toggleComments(post.id)}>
                    <MessageCircle size={26} />
                  </button>
                  <button className="action-btn" onClick={() => handleShare(post)}>
                    <Share2 size={26} />
                  </button>
                </div>
                <button className="action-btn" onClick={() => toggleBookmark(post.id)}>
                  <Bookmark
                    size={26}
                    fill={bookmarks[post.id] ? "currentColor" : "none"}
                  />
                </button>
              </div>

              <div className="like-count">
                {post.likes + (likes[post.id] ? 1 : 0)} likes
              </div>

              <div className="caption-area">
                <span className="caption-author">{post.user.handle}</span>
                {post.caption}
              </div>

              {post.tags && (
                <div className="tags-area">
                  {post.tags.map(t => (
                    <span key={t} className="plant-tag">#{t}</span>
                  ))}
                </div>
              )}

              <AnimatePresence>
                {expandedComments[post.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden', marginTop: 12, paddingTop: 12, borderTop: '1px solid #eee' }}
                  >
                    <div className="comments-list" style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: 12 }}>
                      {Array.isArray(post.comments) && post.comments.length > 0 ? (
                        post.comments.map((c, idx) => (
                          <div key={idx} style={{ fontSize: '0.9rem', color: '#555', marginBottom: 8 }}>
                            <strong>{c.user}</strong> {c.text}
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize: '0.85rem', color: '#999', marginBottom: 8 }}>No comments yet. Be the first!</div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        className="comment-inline-input"
                        onKeyDown={async (e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            const val = e.target.value;
                            e.target.value = '';
                            const targetId = post._id || post.id;
                            const isDummy = post.id && post.id.startsWith('p') && !post._id;

                            try {
                              const res = await axios.post(API_BASE + '/posts/' + targetId + '/comment', {
                                user: 'You',
                                text: val
                              });
                              if (res.status === 201) {
                                if (onCommentAdded) {
                                  onCommentAdded(targetId, res.data.comments);
                                }
                              }
                            } catch (err) {
                              console.error("Failed to add comment to backend", err);
                              if (isDummy) {
                                // For dummy posts, just update local state so user sees it
                                const newComment = { user: 'You', text: val, createdAt: new Date() };
                                const existingComments = Array.isArray(post.comments) ? post.comments : [];
                                const updatedComments = [...existingComments, newComment];
                                onCommentAdded(targetId, updatedComments);
                                alert("Note: This is a demo post, your comment is only visible locally. Create a real post to persist comments! 🌿");
                              } else {
                                alert("Failed to add comment. Please try again.");
                              }
                            }
                          }
                        }}
                      />
                    </div >
                  </motion.div >
                )}
              </AnimatePresence >
            </div >
          </motion.div >
        ))}
      </AnimatePresence >
    </div >
  );
};

const Sidebar = ({ userPoints, onOpenRewards }) => {

  return (
    <div className="sticky-sidebar">
      <div className="sidebar-card">
        <div className="sidebar-title">Your Garden Stats</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="stat-box">
            <div className="stat-val">14</div>
            <div className="stat-label">Day Streak</div>
          </div>
          <div className="stat-box">
            <div className="stat-val">{userPoints}</div>
            <div className="stat-label">Points</div>
          </div>
        </div>
        <button
          className="tab-pill active"
          style={{ width: '100%', marginTop: 20, border: 'none' }}
          onClick={onOpenRewards}
        >
          Redeem Rewards
        </button>
      </div>

      <div className="sidebar-card">
        <div className="sidebar-title">Top Gardeners</div>
        <div className="leaderboard-list">
          {['akash', 'green_queen', 'soil_master'].map((u, i) => (
            <div key={u} className="leader-item">
              <div className="leader-rank">{i + 1}</div>
              <div style={{ flex: 1, fontWeight: 600 }}>{u}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--c-accent-secondary)' }}>{1200 - (i * 200)} pts</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function Community() {
  const [posts, setPosts] = useState([]); // Start empty, fetch from backend
  const [shorts, setShorts] = useState([]); // Real shorts data
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const [userPoints, setUserPoints] = useState(1250);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [redemptionSuccess, setRedemptionSuccess] = useState(false);

  // Shorts Viewer State
  const [selectedReelId, setSelectedReelId] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(API_BASE + '/posts', {
          timeout: 3000, // 3 second timeout
        });
        let displayPosts = [...DUMMY_POSTS]; // Always start with dummies

        if (res.data && res.data.length > 0) {
          // Normalize IDs: ensure every post has an 'id' property
          const fetchedPosts = res.data.map(p => ({ ...p, id: p._id }));

          // Combine: Real posts first (newest), then Dummy posts
          // Remove potential duplicates if a real post happens to match a dummy ID (unlikely)
          displayPosts = [...fetchedPosts, ...displayPosts];
        }
        setPosts(displayPosts);
      } catch (err) {
        // Silently fall back to dummy data if backend is unavailable
        setPosts(DUMMY_POSTS);
      } finally {
        setLoading(false);
      }
    };

    // Fetch Shorts
    const fetchShorts = async () => {
      try {
        const res = await axios.get(API_BASE + '/posts/shorts', {
          timeout: 3000, // 3 second timeout
        });
        if (res.data && res.data.length > 0) {
          const fetchedShorts = res.data.map(s => ({ ...s, id: s._id }));
          setShorts(fetchedShorts);
        } else {
          // Seed dummy reels if empty (Auto-seed for demo)
          // In a real app, this would be an admin function or manual upload
          // We'll just use DUMMY_REELS for display if API returns nothing, or logic to post them?
          // For now, let's just fall back to DUMMY_REELS for display if DB is empty to keep UI working
          // OR better: Seed them silently one by one

          // For this demo: using DUMMY_REELS purely as fallback visual
          setShorts(DUMMY_REELS);
        }
      } catch (err) {
        // Silently fall back to dummy reels if backend is unavailable
        setShorts(DUMMY_REELS); // Fallback
      }
    };

    fetchPosts();
    fetchShorts();
  }, []);

  const handleNewPost = async (postData) => {
    setPosts([postData, ...posts]);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);

    try {
      const res = await axios.post(API_BASE + '/posts', {
        user: postData.user,
        image: postData.image,
        caption: postData.caption,
        isPlant: postData.isPlant,
        tags: postData.tags
      });
      // Replace the temporary post with the one from server (has real ID)
      if (res.data) {
        setPosts(prev => [{ ...res.data, id: res.data._id }, ...prev.filter(p => p.id !== postData.id)]);
      }
      setUserPoints(prev => prev + 50);
    } catch (err) {
      console.error("Failed to save post", err);
    }
  };

  const handleRedeem = async (reward) => {
    // Optimistic UI update
    setUserPoints(prev => prev - reward.points);
    setRedemptionSuccess(true);
    setShowConfetti(true);

    try {
      const userInfoStr = localStorage.getItem('userInfo');
      let token = null;
      if (userInfoStr) {
        try {
          token = JSON.parse(userInfoStr).token;
        } catch (e) {
          console.error("Error parsing user info", e);
        }
      }

      if (token) {
        await axios.post(API_BASE + '/rewards/redeem',
          {
            rewardName: reward.name,
            pointsCost: reward.points
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        console.log("Redemption email request sent successfully.");
      } else {
        console.warn("No auth token found. Skipping email notification.");
      }
    } catch (err) {
      console.error("Failed to send reward email:", err);
      // We don't roll back the UI points here to keep the experience smooth for the user
      // unless it's a critical financial transaction, but for this gamification it's okay.
    }

    setTimeout(() => {
      setShowConfetti(false);
      setRedemptionSuccess(false);
      setIsRewardsOpen(false);
      setSelectedReward(null);
    }, 2500);
  };

  return (
    <div className="community-wrapper">
      {/* Shorts Viewer Overlay */}
      <AnimatePresence>
        {selectedReelId && (
          <ShortsViewer
            initialReelId={selectedReelId}
            shorts={shorts}
            onClose={() => setSelectedReelId(null)}
          />
        )}
      </AnimatePresence>

      {showConfetti && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
          <Confetti recycle={false} numberOfPieces={300} gravity={0.3} width={window.innerWidth} height={window.innerHeight} />
        </div>
      )}

      <div className="community-container">

        <HeroSection />

        <ReelsRail shorts={shorts} onOpenShorts={setSelectedReelId} />

        <div className="create-post-container">
          <div className="create-post-trigger" onClick={() => setIsModalOpen(true)}>
            <img src="https://i.pravatar.cc/150?u=me" className="trigger-avatar" alt="Me" />
            <div className="trigger-input">Share something with the community...</div>
            <Plus size={24} color="var(--c-accent-primary)" />
          </div>
        </div>

        <div className="main-grid">
          <div className="feed-column">
            {loading ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--c-text-tertiary)' }}>
                Loading community...
              </div>
            ) : (
              <Feed
                posts={posts}
                onPostDeleted={(deletedId) => {
                  setPosts(prev => prev.filter(p => (p._id !== deletedId && p.id !== deletedId)));
                }}
                onCommentAdded={(postId, newComments) => {
                  setPosts(prev => prev.map(p =>
                    (p._id === postId || p.id === postId) ? { ...p, comments: newComments } : p
                  ));
                }}
              />
            )}
          </div>

          <div className="sidebar-column">
            <Sidebar userPoints={userPoints} onOpenRewards={() => setIsRewardsOpen(true)} />
          </div>
        </div>
      </div>

      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onPost={handleNewPost} />

      {isRewardsOpen && !selectedReward && (
        <div className="modal-overlay" onClick={() => setIsRewardsOpen(false)}>
          <motion.div className="modal-content" onClick={e => e.stopPropagation()} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="modal-header">
              Available Rewards
              <button onClick={() => setIsRewardsOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body" style={{ padding: '20px 24px' }}>
              <div className="reward-list-container">
                {REWARDS_DATA.map(reward => (
                  <div key={reward.id} className="reward-item" onClick={() => setSelectedReward(reward)}>
                    <span style={{ fontSize: '2rem' }}>{reward.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{reward.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--c-accent-primary)', fontWeight: 600 }}>{reward.points} Points</div>
                    </div>
                    <ChevronRight size={20} color="var(--c-accent-secondary)" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <RedeemModal isOpen={!!selectedReward} onClose={() => setSelectedReward(null)} reward={selectedReward} userPoints={userPoints} onRedeem={handleRedeem} />

      {redemptionSuccess && (
        <div className="toast-success">Success! Reward redeemed. Check your email. 🌿</div>
      )}
    </div>
  );
}
