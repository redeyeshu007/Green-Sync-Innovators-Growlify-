import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Heart,
  MessageCircle,
  Share2,
  Trash2,
  Plus,
  Play,
  Pause
} from "lucide-react";
import "./Community.css";

/* ---------------- CONFIG ---------------- */
const API_BASE = "http://localhost:5000/api"; // backend optional

/* ---------------- DUMMY DATA (fallback) ---------------- */
const SAMPLE_POSTS = [
  {
    id: "p1",
    user: "GreenSoul",
    text: "My basil plant finally survived the heat 🌿",
    likes: 4
  },
  {
    id: "p2",
    user: "UrbanGardener",
    text: "Anyone tried compost tea?",
    likes: 2
  }
];

const SAMPLE_REELS = [
  {
    id: "r1",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    caption: "Morning garden routine"
  },
  {
    id: "r2",
    video: "https://www.w3schools.com/html/movie.mp4",
    caption: "Repotting a money plant"
  }
];

/* ================= MAIN COMPONENT ================= */
export default function Community() {
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newPost, setNewPost] = useState("");
  const [likes, setLikes] = useState({});

  /* -------- Load posts & reels -------- */
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      // Posts
      try {
        const res = await axios.get(`${API_BASE}/posts`, { timeout: 2500 });
        const formatted = res.data.map(p => ({ ...p, id: p._id }));
        setPosts(formatted);
      } catch {
        // backend not available → demo mode
        setPosts(SAMPLE_POSTS);
      }

      // Reels
      try {
        const res = await axios.get(`${API_BASE}/reels`, { timeout: 2500 });
        setReels(res.data);
      } catch {
        setReels(SAMPLE_REELS);
      }

      setLoading(false);
    };

    loadData();
  }, []);

  /* -------- Post actions -------- */
  const submitPost = () => {
    if (!newPost.trim()) return;

    const tempPost = {
      id: Date.now().toString(),
      user: "You",
      text: newPost,
      likes: 0
    };

    setPosts(prev => [tempPost, ...prev]);
    setNewPost("");

    // Try syncing with backend (optional)
    axios.post(`${API_BASE}/posts`, { text: newPost }).catch(() => {});
  };

  const toggleLike = (postId) => {
    setLikes(prev => ({ ...prev, [postId]: !prev[postId] }));
    axios.post(`${API_BASE}/posts/${postId}/like`).catch(() => {});
  };

  const removePost = (postId) => {
    if (!window.confirm("Delete this post?")) return;
    setPosts(prev => prev.filter(p => p.id !== postId));
    axios.delete(`${API_BASE}/posts/${postId}`).catch(() => {});
  };

  /* ================= RENDER ================= */
  return (
    <div className="community-page">
      <h2>🌱 Community</h2>

      {/* -------- Create Post -------- */}
      <div className="create-post">
        <textarea
          placeholder="Share something about your plants..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button onClick={submitPost}>
          <Plus size={16} /> Post
        </button>
      </div>

      {/* -------- Reels Section -------- */}
      <section className="reels-section">
        <h3>Shorts</h3>
        <div className="reels-row">
          {reels.map(r => (
            <ReelCard key={r.id} reel={r} />
          ))}
        </div>
      </section>

      {/* -------- Feed -------- */}
      <section className="posts-section">
        <h3>Posts</h3>

        {loading && <p>Loading community...</p>}

        {!loading && posts.length === 0 && (
          <p>No posts yet. Be the first!</p>
        )}

        {posts.map(post => (
          <div key={post.id} className="post-card">
            <strong>{post.user}</strong>
            <p>{post.text}</p>

            <div className="post-actions">
              <button onClick={() => toggleLike(post.id)}>
                <Heart
                  size={18}
                  fill={likes[post.id] ? "red" : "none"}
                />
                {post.likes + (likes[post.id] ? 1 : 0)}
              </button>

              <button>
                <MessageCircle size={18} />
              </button>

              <button>
                <Share2 size={18} />
              </button>

              {post.user === "You" && (
                <button onClick={() => removePost(post.id)}>
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

/* ================= REEL COMPONENT ================= */
function ReelCard({ reel }) {
  const videoRef = useRef(null);
  const [paused, setPaused] = useState(true);
  const [liked, setLiked] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setPaused(false);
    } else {
      videoRef.current.pause();
      setPaused(true);
    }
  };

  const likeReel = () => {
    if (liked) return;
    setLiked(true);
  };

  return (
    <div className="reel-card">
      <video
        ref={videoRef}
        src={reel.video}
        loop
        onClick={togglePlay}
      />

      <div className="reel-overlay">
        <button onClick={togglePlay}>
          {paused ? <Play /> : <Pause />}
        </button>

        <button onClick={likeReel}>
          <Heart fill={liked ? "red" : "none"} />
        </button>
      </div>

      <p className="reel-caption">{reel.caption}</p>
    </div>
  );
}
