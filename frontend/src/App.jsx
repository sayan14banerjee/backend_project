import { useEffect, useMemo, useState } from "react";
import { api, API_BASE } from "./api/client";

const initialRegister = {
  username: "",
  email: "",
  fullName: "",
  password: "",
  avatar: null,
  coverImage: null,
};

export default function App() {
  const [activeTab, setActiveTab] = useState("videos");
  const [authMode, setAuthMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState(initialRegister);

  const [myVideos, setMyVideos] = useState([]);
  const [uploadForm, setUploadForm] = useState({ title: "", description: "", video: null, thumbnail: null });
  const [videoLookupId, setVideoLookupId] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoComment, setVideoComment] = useState("");

  const [playlists, setPlaylists] = useState([]);
  const [playlistForm, setPlaylistForm] = useState({ name: "", description: "" });

  const [tweets, setTweets] = useState([]);
  const [tweetInput, setTweetInput] = useState("");

  const loggedIn = useMemo(() => Boolean(user?._id), [user]);

  const safeData = (res) => res?.data ?? res;

  const notify = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 2500);
  };

  const refreshSession = async () => {
    try {
      const me = await api.currentUser();
      setUser(safeData(me));
    } catch {
      setUser(null);
    }
  };

  const loadOwnedData = async () => {
    if (!loggedIn) return;
    try {
      const [videosRes, playlistsRes, tweetsRes] = await Promise.all([
        api.myVideos(),
        api.myPlaylists(user._id),
        api.userTweets(user._id),
      ]);
      setMyVideos(safeData(videosRes) || []);
      setPlaylists(safeData(playlistsRes) || []);
      setTweets(safeData(tweetsRes) || []);
    } catch (err) {
      notify(err.message);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  useEffect(() => {
    loadOwnedData();
  }, [loggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.login(loginForm);
      await refreshSession();
      await loadOwnedData();
      notify("Logged in successfully");
    } catch (err) {
      notify(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(registerForm).forEach(([key, value]) => {
        if (value) fd.append(key, value);
      });
      await api.register(fd);
      setAuthMode("login");
      setRegisterForm(initialRegister);
      notify("Registered successfully. Please login.");
    } catch (err) {
      notify(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      setUser(null);
      setMyVideos([]);
      setTweets([]);
      setPlaylists([]);
      notify("Logged out");
    } catch (err) {
      notify(err.message);
    }
  };

  const handleVideoUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", uploadForm.title);
      fd.append("description", uploadForm.description);
      fd.append("video", uploadForm.video);
      fd.append("thumbnail", uploadForm.thumbnail);
      await api.uploadVideo(fd);
      setUploadForm({ title: "", description: "", video: null, thumbnail: null });
      await loadOwnedData();
      notify("Video uploaded");
    } catch (err) {
      notify(err.message);
    } finally {
      setLoading(false);
    }
  };

  const findVideo = async () => {
    if (!videoLookupId) return;
    setLoading(true);
    try {
      const videoRes = await api.getVideo(videoLookupId);
      const video = safeData(videoRes);
      setSelectedVideo(video);
      const commentsRes = await api.videoComments(videoLookupId).catch(() => ({ data: [] }));
      setSelectedVideo((prev) => ({ ...prev, comments: safeData(commentsRes) || [] }));
      notify("Video loaded");
    } catch (err) {
      notify(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoLike = async () => {
    if (!selectedVideo?._id) return;
    try {
      await api.toggleVideoLike(selectedVideo._id);
      notify("Video like toggled");
    } catch (err) {
      notify(err.message);
    }
  };

  const handleSubscribe = async () => {
    if (!selectedVideo?.owner?._id) return;
    try {
      await api.toggleSubscribe(selectedVideo.owner._id);
      notify("Subscription updated");
    } catch (err) {
      notify(err.message);
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!selectedVideo?._id || !videoComment.trim()) return;
    try {
      await api.addVideoComment(selectedVideo._id, { content: videoComment });
      setVideoComment("");
      await findVideo();
      notify("Comment posted");
    } catch (err) {
      notify(err.message);
    }
  };

  const createPlaylist = async (e) => {
    e.preventDefault();
    try {
      await api.createPlaylist(playlistForm);
      setPlaylistForm({ name: "", description: "" });
      await loadOwnedData();
      notify("Playlist created");
    } catch (err) {
      notify(err.message);
    }
  };

  const saveInPlaylist = async (playlistId, videoId) => {
    try {
      await api.addToPlaylist(videoId, playlistId);
      notify("Video saved in playlist");
    } catch (err) {
      notify(err.message);
    }
  };

  const postTweet = async (e) => {
    e.preventDefault();
    if (!tweetInput.trim()) return;
    try {
      await api.createTweet({ content: tweetInput });
      setTweetInput("");
      await loadOwnedData();
      notify("Tweet posted");
    } catch (err) {
      notify(err.message);
    }
  };

  const likeTweet = async (tweetId) => {
    try {
      await api.toggleTweetLike(tweetId);
      notify("Tweet like toggled");
    } catch (err) {
      notify(err.message);
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>VideoHub Creator Studio</h1>
          <p className="muted">API: {API_BASE}</p>
        </div>
        <div className="auth-chip">
          {loggedIn ? (
            <>
              <span>👋 {user?.username}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <span>Guest mode</span>
          )}
        </div>
      </header>

      {message && <div className="toast">{message}</div>}

      {!loggedIn && (
        <section className="panel">
          <div className="split-head">
            <h2>{authMode === "login" ? "Login" : "Create account"}</h2>
            <button onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}>{authMode === "login" ? "Need account?" : "Have account?"}</button>
          </div>

          {authMode === "login" ? (
            <form className="grid-form" onSubmit={handleLogin}>
              <input placeholder="Email" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} />
              <input type="password" placeholder="Password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
              <button disabled={loading}>{loading ? "Loading..." : "Login"}</button>
            </form>
          ) : (
            <form className="grid-form" onSubmit={handleRegister}>
              <input placeholder="Username" value={registerForm.username} onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })} />
              <input placeholder="Full name" value={registerForm.fullName} onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })} />
              <input placeholder="Email" value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} />
              <input type="password" placeholder="Password" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} />
              <label>Avatar <input type="file" onChange={(e) => setRegisterForm({ ...registerForm, avatar: e.target.files?.[0] })} /></label>
              <label>Cover image <input type="file" onChange={(e) => setRegisterForm({ ...registerForm, coverImage: e.target.files?.[0] })} /></label>
              <button disabled={loading}>{loading ? "Loading..." : "Register"}</button>
            </form>
          )}
        </section>
      )}

      {loggedIn && (
        <>
          <nav className="tabs">
            {[
              ["videos", "Videos"],
              ["community", "Community"],
              ["playlists", "Playlists"],
              ["tweets", "Tweets"],
            ].map(([key, label]) => (
              <button key={key} onClick={() => setActiveTab(key)} className={activeTab === key ? "active" : ""}>{label}</button>
            ))}
          </nav>

          {activeTab === "videos" && (
            <section className="panel">
              <h2>Upload & Manage Videos</h2>
              <form className="grid-form" onSubmit={handleVideoUpload}>
                <input placeholder="Video title" value={uploadForm.title} onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })} />
                <textarea placeholder="Description" value={uploadForm.description} onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })} />
                <label>Video File <input type="file" onChange={(e) => setUploadForm({ ...uploadForm, video: e.target.files?.[0] })} /></label>
                <label>Thumbnail <input type="file" onChange={(e) => setUploadForm({ ...uploadForm, thumbnail: e.target.files?.[0] })} /></label>
                <button disabled={loading}>{loading ? "Uploading..." : "Upload"}</button>
              </form>
              <div className="card-grid">
                {myVideos.map((v) => (
                  <article className="card" key={v._id}>
                    <img src={v.thumbnail} alt={v.title} />
                    <h3>{v.title}</h3>
                    <p>{v.description}</p>
                    <small>{v.views || 0} views</small>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeTab === "community" && (
            <section className="panel">
              <h2>Watch, Like, Comment, Subscribe</h2>
              <div className="inline-row">
                <input placeholder="Enter video id" value={videoLookupId} onChange={(e) => setVideoLookupId(e.target.value)} />
                <button onClick={findVideo}>Load Video</button>
              </div>

              {selectedVideo && (
                <article className="detail-card">
                  <img src={selectedVideo.thumbnail} alt={selectedVideo.title} />
                  <div>
                    <h3>{selectedVideo.title}</h3>
                    <p>{selectedVideo.description}</p>
                    <p>By: {selectedVideo.owner?.username || "Unknown"}</p>
                    <div className="inline-row">
                      <button onClick={handleVideoLike}>Like / Unlike</button>
                      <button onClick={handleSubscribe}>Subscribe / Unsubscribe</button>
                    </div>
                  </div>
                </article>
              )}

              <form className="inline-row" onSubmit={submitComment}>
                <input placeholder="Comment on this video" value={videoComment} onChange={(e) => setVideoComment(e.target.value)} />
                <button>Post Comment</button>
              </form>

              <ul className="list">
                {(selectedVideo?.comments || []).map((c) => (
                  <li key={c._id}>{c.content}</li>
                ))}
              </ul>
            </section>
          )}

          {activeTab === "playlists" && (
            <section className="panel">
              <h2>Your Playlists</h2>
              <form className="grid-form" onSubmit={createPlaylist}>
                <input placeholder="Playlist name" value={playlistForm.name} onChange={(e) => setPlaylistForm({ ...playlistForm, name: e.target.value })} />
                <textarea placeholder="Playlist description" value={playlistForm.description} onChange={(e) => setPlaylistForm({ ...playlistForm, description: e.target.value })} />
                <button>Create playlist</button>
              </form>

              {playlists.map((p) => (
                <article className="card" key={p._id}>
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <small>{p.videos?.length || 0} videos</small>
                  {selectedVideo?._id && <button onClick={() => saveInPlaylist(p._id, selectedVideo._id)}>Save selected video</button>}
                </article>
              ))}
            </section>
          )}

          {activeTab === "tweets" && (
            <section className="panel">
              <h2>Mini Tweets</h2>
              <form className="inline-row" onSubmit={postTweet}>
                <input placeholder="Share an update" value={tweetInput} onChange={(e) => setTweetInput(e.target.value)} />
                <button>Post</button>
              </form>
              <p className="muted">Tweet comments are not exposed by current backend APIs, so this screen supports post/edit/delete + likes.</p>
              <ul className="list">
                {tweets.map((tweet) => (
                  <li key={tweet._id}>
                    <span>{tweet.content}</span>
                    <div className="inline-row">
                      <button onClick={() => likeTweet(tweet._id)}>Like</button>
                      <button onClick={() => api.deleteTweet(tweet._id).then(loadOwnedData)}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
