import { Heart, MessageCircle } from 'lucide-react'
import api from '../Api'
import { useEffect, useState } from "react"

type CommentType = {
    id: string
    author: string
    content: string
    created_at: string
}

type StatusProps = {
    id: string
    author: string
    avatar: string | null
    content: string
    created_at: string
    likes: number
    comments: number
    liked?: boolean
    comment_list?: CommentType[]
    type: 'status' | 'achievement' | 'meme' | 'announcement'
}

function Feed() {
    const [text, setText] = useState("")
    const [statuses, setStatuses] = useState<StatusProps[]>([])
    const [offset, setOffset] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const LIMIT = 5

    // ================= FETCH POSTS =================
    const fetchPosts = async (newOffset: number) => {
        try {
            setError(null)
            if (newOffset === 0) setLoading(true)

            const res = await api.get(
                `/feedupdate?limit=${LIMIT}&offset=${newOffset}`
            )

            const data = (res.data || []).map((post: any) => ({
                ...post,
                likes: Number(post.likes) || 0,
                comments: Number(post.comments) || 0,
                liked: post.liked || false,
                comment_list: post.comment_list || []
            }))

            if (newOffset === 0) {
                setStatuses(data)
            } else {
                setStatuses(prev => [...prev, ...data])
            }

            if (data.length < LIMIT) setHasMore(false)
            setOffset(newOffset)

        } catch (err: any) {
            console.error("Fetch error:", err)
            setError("Failed to load feed")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPosts(0)
    }, [])

    // ================= SUBMIT POST =================
    const submitStatus = async (e: any) => {
        e.preventDefault()
        if (!text.trim()) return

        try {
            const res = await api.post("/feedupdate", { text })

            const newPost = {
                ...res.data,
                likes: 0,
                comments: 0,
                liked: false,
                comment_list: []
            }

            setStatuses(prev => [newPost, ...prev])
            setText("")
        } catch (err) {
            console.error(err)
        }
    }

    // ================= LOAD MORE =================
    const loadMore = async () => {
        setLoadingMore(true)
        await fetchPosts(offset + LIMIT)
        setLoadingMore(false)
    }

    // ================= LIKE =================
    const toggleLike = async (postId: string) => {
        try {
            const res = await api.post(`/feedupdate/${postId}/like`)

            setStatuses(prev =>
                prev.map(post =>
                    post.id === postId
                        ? {
                            ...post,
                            likes: Number(res.data.totalLikes),
                            liked: res.data.liked
                        }
                        : post
                )
            )
        } catch (err) {
            console.error(err)
        }
    }

    // ================= ADD COMMENT =================
    const addComment = async (postId: string, text: string) => {
        if (!text.trim()) return

        try {
            const res = await api.post(`/feedupdate/${postId}/comment`, {
                text
            })

            setStatuses(prev =>
                prev.map(post =>
                    post.id === postId
                        ? {
                            ...post,
                            comments: post.comments + 1,
                            comment_list: [...(post.comment_list || []), res.data]
                        }
                        : post
                )
            )
        } catch (err) {
            console.error(err)
        }
    }

    const formatTime = (date?: string) => {
        if (!date) return "Just now"
        const d = new Date(date)
        if (isNaN(d.getTime())) return "Just now"

        return d.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <div className="space-y-8 max-w-3xl mx-auto">

            <div className="text-center space-y-4">
                <h1 className="text-4xl text-pink-500">Community Feed</h1>
                <p className="text-gray-400">
                    Updates & chaos dari crew.
                </p>
            </div>

            {loading && (
                <div className="text-center text-gray-400">
                    Loading feed...
                </div>
            )}

            {error && (
                <div className="text-center text-red-400">
                    {error}
                </div>
            )}

            {!loading && statuses.length === 0 && !error && (
                <div className="text-center text-gray-500">
                    No posts yet.
                </div>
            )}

            {/* NEW POST */}
            {!loading && (
                <div className="border border-pink-900/30 bg-pink-950/5 rounded-lg p-4">
                    <form onSubmit={submitStatus}>
                        <textarea
                            placeholder="Share your chaos..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="
                                w-full 
                                bg-black/30 
                                border border-pink-900/30 
                                rounded-lg 
                                p-3 
                                text-gray-300
                                focus:outline-none
                                focus:border-pink-900
                                focus:ring-1
                                focus:ring-pink-900
                                transition
                            "
                            rows={3}
                        />
                        <div className="flex justify-end mt-2">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-pink-500/20 border border-pink-500/30 text-pink-400 rounded-lg"
                            >
                                Post
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* FEED */}
            <div className="space-y-4">
                {statuses.map((post) => (
                    <div key={post.id}
                        className="border border-pink-900/30 rounded-lg p-6">

                        <div className="flex justify-between mb-2">
                            <span className="text-pink-400">{post.author}</span>
                            <span className="text-xs text-gray-500">
                                {formatTime(post.created_at)}
                            </span>
                        </div>

                        <p className="text-gray-300 mb-4">{post.content}</p>

                        <div className="flex gap-6 border-t pt-3 border-pink-900/20">

                            <button
                                onClick={() => toggleLike(post.id)}
                                className="flex items-center gap-2"
                            >
                                <Heart
                                    className={`w-4 h-4 ${post.liked ? "text-pink-500 fill-pink-500" : "text-gray-400"}`}
                                />
                                <span className="text-sm">{post.likes}</span>
                            </button>

                            <div className="flex items-center gap-2 text-gray-400">
                                <MessageCircle className="w-4 h-4" />
                                <span className="text-sm">{post.comments}</span>
                            </div>
                        </div>

                        {/* COMMENTS */}
                        <div className="mt-4 space-y-2">
                            {post.comment_list?.map((c) => (
                                <div key={c.id} className="text-sm text-gray-300">
                                    <span className="font-semibold text-pink-400">
                                        {c.author}:
                                    </span>{" "}
                                    {c.content}
                                </div>
                            ))}

                            <CommentInput
                                onSubmit={(value) => addComment(post.id, value)}
                            />
                        </div>

                    </div>
                ))}
            </div>

            {hasMore && !loading && (
                <div className="text-center py-4">
                    <button
                        onClick={loadMore}
                        className="px-6 py-2 border border-pink-900/30 text-gray-400 rounded-lg"
                    >
                        {loadingMore ? "Loading..." : "Load more"}
                    </button>
                </div>
            )}
        </div>
    )
}

function CommentInput({ onSubmit }: { onSubmit: (value: string) => void }) {
    const [value, setValue] = useState("")

    const handleSubmit = (e: any) => {
        e.preventDefault()
        if (!value.trim()) return
        onSubmit(value)
        setValue("")
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 bg-black/30 border border-pink-900/30 rounded px-2 py-1 text-sm text-gray-300"
            />
            <button
                type="submit"
                className="text-xs px-3 py-1 bg-pink-500/20 border border-pink-500/30 text-pink-400 rounded"
            >
                Send
            </button>
        </form>
    )
}

export default Feed
