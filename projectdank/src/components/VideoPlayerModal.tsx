import { useEffect } from "react"
import { X } from "lucide-react"

type Props = {
  video: any
  onClose: () => void
}

export default function VideoPlayerModal({ video, onClose }: Props) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleEsc)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleEsc)
    }
  }, [onClose])

  return (
    <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
        onClick={onClose}
    >
        {/* MODAL */}
        <div
        className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        >
        <button
            onClick={onClose}
            className="absolute top-3 right-3 z-50 bg-black/60 hover:bg-black text-white rounded-full p-2"
        >
            <X className="w-5 h-5" />
        </button>

        {video.source === "youtube" ? (
            <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            />
        ) : (
            <video
            className="w-full h-full"
            src={video.videoUrl}
            controls
            autoPlay
            />
        )}
        </div>
    </div>
    )
}
