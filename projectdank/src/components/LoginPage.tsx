export default function LoginPage() {
  return (
    <div className="
      min-h-screen flex items-center justify-center
    ">
      <div
        className="
          w-full max-w-md
          border-4 border-pink-900/30
          bg-black/70 backdrop-blur
          rounded-2xl
          p-8
          text-center
        "
      >
        {/* TITLE */}
        <h1 className="text-4xl text-pink-500 mb-2">
          Dank Meme Confidential
        </h1>

        <p className="text-gray-400 text-sm mb-8">
          Login untuk membuka arsip meme terlarang 🗿
        </p>

        {/* DISCORD BUTTON */}
        <a href={import.meta.env.VITE_DISCORD_AUTH}>
          <button
            className="
              w-full py-3 rounded-lg
              bg-[#5865F2]
              text-white font-medium
              text-sm
              transition-all
              hover:bg-[#4752C4]
              hover:shadow-[0_0_20px_rgba(88,101,242,0.6)]
              active:scale-[0.98]
            "
          >
            Login with Discord
          </button>
        </a>

        {/* FOOTER */}
        <p className="text-xs text-gray-500 mt-6">
          Secure login via Discord OAuth
        </p>
      </div>
    </div>
  )
}
