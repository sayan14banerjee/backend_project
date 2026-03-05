const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

async function request(path, { method = "GET", body, isForm = false } = {}) {
  const options = {
    method,
    credentials: "include",
    headers: isForm ? {} : { "Content-Type": "application/json" },
  };

  if (body) {
    options.body = isForm ? body : JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${path}`, options);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.message || "Request failed");
  }

  return payload;
}

export const api = {
  login: (body) => request("/users/login", { method: "POST", body }),
  register: (formData) => request("/users/register", { method: "POST", body: formData, isForm: true }),
  logout: () => request("/users/logout", { method: "POST" }),
  currentUser: () => request("/users/current-user"),
  channelProfile: (userId) => request(`/users/channel-profile/${userId}`),

  uploadVideo: (formData) => request("/videos/upload", { method: "POST", body: formData, isForm: true }),
  myVideos: () => request("/videos/my-videos"),
  getVideo: (id) => request(`/videos/get-video/${id}`),
  updateVideo: (id, body) => request(`/videos/update-video-details/${id}`, { method: "PATCH", body }),
  deleteVideo: (id) => request(`/videos/${id}`, { method: "DELETE" }),
  toggleVideoLike: (id) => request(`/likes/toggle/v/${id}`, { method: "POST" }),
  toggleSubscribe: (channelId) => request(`/subscriptions/c/${channelId}`, { method: "POST" }),

  videoComments: (videoId) => request(`/comments/${videoId}`),
  addVideoComment: (videoId, body) => request(`/comments/${videoId}`, { method: "POST", body }),

  createPlaylist: (body) => request("/playlists", { method: "POST", body }),
  myPlaylists: (userId) => request(`/playlists/user/${userId}`),
  addToPlaylist: (videoId, playlistId) => request(`/playlists/add/${videoId}/${playlistId}`, { method: "PATCH" }),

  createTweet: (body) => request("/tweets", { method: "POST", body }),
  userTweets: (userId) => request(`/tweets/user/${userId}`),
  updateTweet: (tweetId, body) => request(`/tweets/${tweetId}`, { method: "PATCH", body }),
  deleteTweet: (tweetId) => request(`/tweets/${tweetId}`, { method: "DELETE" }),
  toggleTweetLike: (tweetId) => request(`/likes/toggle/t/${tweetId}`, { method: "POST" }),
};

export { API_BASE };
