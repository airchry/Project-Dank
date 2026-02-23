import { useState, useEffect, useContext } from "react"
import { useNavigate, Link } from 'react-router'
import { ChevronRight, Skull } from 'lucide-react'
import { AuthContext } from "./AuthContext"
import api from "../Api"

function GamesHall() {
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)
    const [games, setGames] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const res = await api.get("/games")
                setGames(res.data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchGames()
    }, [])

    const handleDelete = async (id: string) => {
        const confirmDelete = confirm("Yakin mau hapus game ini?")
        if (!confirmDelete) return

        try {
            await api.delete(`/games/${id}`)
            setGames(games.filter(g => g.id !== id))
            alert("Game berhasil dihapus!")
        } catch (err) {
            console.error(err)
            alert("Gagal hapus game")
        }
    }

    if (loading) return <p>Loading...</p>

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="text-center space-y-4">
                <h1 className="text-4xl text-pink-500">Games Hall</h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Koleksi game co-op yang kita mainin bareng.
                </p>
            </div>

            <div className="grid grid-cols gap-4">
                <div className="border border-pink-900/30 bg-pink-950/10 rounded-lg p-4 text-center">
                    <div className="text-2xl text-pink-500 mb-1">{games.length}</div>
                    <div className="text-sm text-gray-400">Total Games</div>
                </div>
            </div>

            {user?.role === "admin" && (
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => navigate("/games/create")}
                        className="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded text-sm"
                    >
                        + Tambah Game
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map(game => (
                    <Link
                        key={game.id}
                        to={`/games/${game.id}`}
                        className="overflow-hidden border border-pink-900/30 bg-gradient-to-br from-pink-950/10 to-purple-950/10 rounded-lg hover:shadow-lg hover:border-pink-900 hover:bg-gradient-to-br hover:from-pink-950/50 hover:to-purple-950/50 transition-all group relative"
                    >
                        {user?.role === "admin" && (
                            <button
                                onClick={(e) => { e.preventDefault(); handleDelete(game.id) }}
                                className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-xs px-2 py-1 rounded z-20"
                            >
                                Delete
                            </button>
                        )}

                        <img
                            src={game.image}
                            className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-500"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black bg-black/90 group-hover:bg-black/70 transition"></div>
                        <div className="relative z-10">

                            {/* Game Header */}
                            <div className="p-6 border-b border-pink-900/20">
                                <div className="flex items-start justify-end mb-3">
                                    <div className="text-xs">
                                        {game.status}
                                    </div>
                                </div>

                                <h3 className="text-xl text-yellow-400 group-hover:text-yellow-300 transition-colors mb-2 text-base">
                                    {game.name}
                                </h3>
                                <p className="text-sm text-gray-400 line-clamp-2">
                                    {game.description}
                                </p>
                            </div>

                            {/* Game Stats */}
                            <div className="p-6 bg-black/20">

                                {/* Fun Fact */}
                                <div className="bg-pink-500/5 border border-pink-900/30 rounded p-3 mb-4">
                                    <div className="text-xs text-pink-400/70 mb-1">Fun Fact:</div>
                                    <div className="text-xs text-gray-400">{game.fun_fact}</div>
                                </div>

                                {/* View Details */}
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">{game.quotes?.length || 0} quotes</span>
                                    <div className="flex items-center gap-1 text-yellow-400 group-hover:gap-2 transition-all">
                                        View details
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Bottom Note */}
            <div className="text-center py-8">
                <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
                    <Skull className="w-4 h-4" />
                    <p>Game baru? Suggest di Discord!</p>
                </div>
            </div>
        </div>
    )
}

export default GamesHall
