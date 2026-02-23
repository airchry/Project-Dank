import { useParams, Link } from 'react-router'
import { ArrowLeft, MessageSquare, FileText, TrendingUp } from 'lucide-react'
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "./AuthContext"
import { useNavigate } from "react-router"
import api from "../Api"

function GameDetail() {
    const { gameId } = useParams()
    const [game, setGame] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const auth = useContext(AuthContext)

    if (!auth) return null
    const { user } = auth

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const res = await api.get(`/games/${gameId}`)
                setGame(res.data)
            } catch (err) {
                console.error(err)
                setGame(null)
            } finally {
                setLoading(false)
            }
        }
        fetchGame()
    }, [gameId])

    if (loading) return <p className="text-center py-12 text-gray-400">Loading...</p>
    if (!game) return (
        <div className="text-center py-12">
            <p className="text-gray-400 mb-4">Game tidak ditemukan</p>
            <Link to="/games" className="text-pink-400 hover:text-pink-300">
                ← Kembali ke Games Hall
            </Link>
        </div>
    )

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Back Button */}
            <Link to="/games" className="inline-flex items-center gap-2 text-gray-400 hover:text-pink-400 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Games Hall
            </Link>

            {/* Game Header */}
            <div className="border border-pink-900/30 bg-gradient-to-br from-pink-950/10 to-purple-950/10 rounded-lg p-8">
                <div className="flex items-start gap-6 mb-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl text-pink-400">{game.name}</h1>
                            <div className="flex items-center gap-1 text-xs text-pink-400/70 bg-pink-500/10 px-3 py-1 rounded">
                                <TrendingUp className="w-3 h-3" />
                                {game.status}
                            </div>

                            {user?.role === "admin" && (
                                <button
                                    onClick={() => navigate(`/games/edit/${game.id}`)}
                                    className="ml-auto px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-xs rounded"
                                >
                                    Edit
                                </button>
                            )}

                        </div>
                        <p className="text-gray-400 mb-4">{game.description}</p>
                    </div>
                </div>

                {/* Fun Fact */}
                <div className="bg-pink-500/5 border border-pink-900/30 rounded-lg p-4">
                    <div className="text-sm text-pink-400/70 mb-1">Fun Fact</div>
                    <div className="text-gray-300">{game.fun_fact}</div>
                </div>
            </div>

            {/* Quotes Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="w-5 h-5 text-pink-400" />
                    <h2 className="text-2xl text-pink-400">Quotes Chaos</h2>
                </div>
                <div className="space-y-3">
                    {game.quotes?.map((quote: string, index: number) => (
                        <div key={index} className="border border-pink-900/30 bg-pink-950/5 rounded-lg p-4 hover:bg-pink-950/10 transition-colors">
                            <div className="flex items-start gap-3">
                                <div className="text-2xl text-pink-500/30">"</div>
                                <p className="text-gray-300 italic pt-1">{quote}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Notes Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-pink-400" />
                    <h2 className="text-2xl text-pink-400">Internal Notes</h2>
                </div>
                <div className="border border-pink-900/30 bg-black/20 rounded-lg p-6">
                    <ul className="space-y-3">
                        {game.notes?.map((note: string, index: number) => (
                            <li key={index} className="flex items-start gap-3 text-gray-300">
                                <span className="text-pink-500 mt-1">•</span>
                                <span>{note}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </div>
    )
}

export default GameDetail
