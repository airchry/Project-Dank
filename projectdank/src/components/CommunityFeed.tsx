import { useEffect, useState } from "react";
import Feed from "./Feed";

export type FeedPost = {
  id: string;
  author: string;
  avatar: string;
  content: string;
  likes: number;
  comments: number;
  type: "status" | "achievement" | "meme" | "announcement";
  createdAt: string;
};

function CommunityFeed() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);

  // GET all statuses
  useEffect(() => {
    fetch("http://localhost:3000/api/feedupdate")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .finally(() => setLoading(false));
  }, []);

  // POST new status
  async function handlePost(content: string) {
    const res = await fetch("http://localhost:3000/api/feedupdate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: content }),
    });

    if (!res.ok) return;

    const newPost = await res.json();
    setPosts((prev) => [newPost, ...prev]);
  }

  if (loading) {
    return <p className="text-center text-gray-500">Loading feed...</p>;
  }

  return <Feed posts={posts} onPost={handlePost} />;
}

export default CommunityFeed;
