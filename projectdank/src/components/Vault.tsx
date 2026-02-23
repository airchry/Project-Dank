import { useState, useEffect } from "react"
import { Play, Image as ImageIcon, Filter, Upload, X } from "lucide-react"
import UploadClipModal from "./UploadClipModal"
import api from "../Api"

type VideoProps = {
  id: string
  title: string
  type: "image" | "video"
  game: string
  tags: string[]
  date: string
  views: number
  source: "local" | "youtube"
  uploader?: string
  videoUrl?: string
  youtubeId?: string
  thumbnail?: string
}


function Vault() {
  const [filter, setFilter] = useState<"all" | "image" | "video">("all")
  const [selectedGame, setSelectedGame] = useState("all")
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [videos, setVideos] = useState<VideoProps[]>([])
  const [activeVideo, setActiveVideo] = useState<VideoProps | null>(null)

  const games = ["all", ...Array.from(new Set(videos.map(v => v.game)))]

  const filteredVideos = videos.filter(video => {
    const typeMatch = filter === "all" || video.type === filter
    const gameMatch = selectedGame === "all" || video.game === selectedGame
    return typeMatch && gameMatch
  })

  const handleUploadClip = async (data: FormData) => {
    await api.post("/upload/upload", data)
    fetchVault()
  }

  const fetchVault = async () => {
    const res = await api.get("/vault/vault")


    const mapped: VideoProps[] = res.data.map((item: any) => ({
      id: `${item.source}-${item.id}`,
      title: item.title,
      type: item.type,
      game: item.game ?? "Unknown",
      tags: Array.isArray(item.tags) ? item.tags : [],
      date: new Date(item.createdAt).toISOString().split("T")[0],
      views: item.views ?? 0,
      source: item.source,
      uploader: item.uploader ?? "Unknown",
      videoUrl: item.videoUrl,
      youtubeId: item.youtubeId,
      thumbnail: item.thumbnail,
    }))


    setVideos(mapped)
  }

  useEffect(() => {
    fetchVault()
  }, [])

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl text-pink-500">Dank Meme Vault</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Arsip meme, epic fails, dan scream compilation terbaik dari sesi gaming kita.
          Kenangan chaos yang abadi.
        </p>

        <div className="pt-2">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 text-sm"
          >
            <Upload className="w-5 h-5" />
            Upload Clip
          </button>
        </div>

        <UploadClipModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onSubmit={handleUploadClip}
        />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Total Memes" value={videos.length} />
        <Stat label="Videos" value={videos.filter(v => v.type === "video").length} />
        <Stat label="Images" value={videos.filter(v => v.type === "image").length} />
        <Stat label="Total Views" value={videos.reduce((s, v) => s + v.views, 0)} />
      </div>

      {/* FILTER */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border border-pink-900/30 bg-black/20 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-pink-400" />
          <span className="text-sm text-gray-400">Filter:</span>
        </div>

        <div className="flex gap-2">
          {["all", "video", "image"].map(t => (
            <button
              key={t}
              onClick={() => setFilter(t as any)}
              className={`px-3 py-1 rounded text-sm ${
                filter === t
                  ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                  : "bg-pink-950/10 text-gray-400 border border-pink-900/30"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <select
          value={selectedGame}
          onChange={e => setSelectedGame(e.target.value)}
          className="bg-pink-950/10 border border-pink-900/30 text-gray-300 rounded px-3 py-1 text-sm"
        >
          {games.map(g => (
            <option key={g} value={g} className="bg-black">
              {g === "all" ? "All Games" : g}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map(video => (
          <div
            key={video.id}
            onClick={() => setActiveVideo(video)}
            className="border border-pink-900/30 bg-gradient-to-br from-pink-950/10 to-purple-950/5 rounded-lg overflow-hidden hover:border-pink-500/50 transition-all group cursor-pointer"
          >
            <div className="aspect-video relative overflow-hidden">
                {video.thumbnail ? (
                    <img
                    src={video.thumbnail}
                    className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                    <Play className="w-16 h-16 text-pink-400/50" />
                    </div>
                )}

                {video.type === "video" && (
                    <Play className="absolute inset-0 m-auto w-16 h-16 text-white/80 pointer-events-none" />
                )}

              {video.type === "video" ? (
                <>
                  <Play className="w-16 h-16 text-pink-400/50 group-hover:text-pink-400" />
                  <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-pink-400">
                    VIDEO
                  </div>
                </>
              ) : (
                <>
                  <ImageIcon className="w-16 h-16 text-pink-400/50" />
                  <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-pink-400">
                    IMAGE
                  </div>
                </>
              )}
            </div>

            <div className="p-4">
              <h3 className="text-pink-400 mb-2">{video.title}</h3>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{video.game}</span>
                <span>{video.views} views</span>
              </div>

              <div className="text-xs text-gray-400 mb-3">
                Uploaded by <span className="text-pink-400">{video.uploader}</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {video.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-pink-500/10 text-pink-400/70 px-2 py-0.5 rounded text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {activeVideo && (
        <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </div>
  )
}

/* ================= MODAL ================= */

function VideoModal({
  video,
  onClose,
}: {
  video: VideoProps
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative w-full max-w-5xl
          border border-pink-500/40
          bg-gradient-to-br from-black via-pink-950/10 to-purple-950/20
          rounded-xl
          overflow-hidden
        "
      >
        {/* HEADER */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-pink-900/30">
          <div>
            <h2 className="text-lg text-pink-400 font-semibold">
              {video.title}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {video.game} • {video.views} views • Uploaded by {video.uploader}
            </p>

          </div>

          <button
            onClick={onClose}
            className="
              text-pink-400 hover:text-white
              transition
              bg-pink-500/10 hover:bg-pink-500/30
              rounded-full p-1
            "
          >
            <X />
          </button>
        </div>

        {/* VIDEO FRAME */}
        <div className="relative aspect-video bg-black">
          {video.type === "image" ? (
            <img
              src={video.videoUrl || video.thumbnail}
              className="w-full h-full object-contain"
            />
          ) : video.source === "youtube" ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <video
              src={video.videoUrl}
              controls
              autoPlay
              className="w-full h-full"
            />
          )}

          {/* Neon frame overlay */}
          <div className="pointer-events-none absolute inset-0 border border-pink-500/30 rounded-none" />
        </div>

        {/* FOOTER */}
        {video.tags.length > 0 && (
          <div className="px-5 py-3 border-t border-pink-900/30 flex flex-wrap gap-2">
            {video.tags.map(tag => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded bg-pink-500/10 text-pink-400/80"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-pink-900/30 bg-pink-950/10 rounded-lg p-4 text-center">
      <div className="text-2xl text-pink-500 mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  )
}

export default Vault
