import { useEffect, useState, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AuthContext } from "./AuthContext"
import api from "../Api"

type Game = {
  id: string
  name: string
  description: string
  status: string
  fun_fact: string
  image: string
  quotes: string[]
  notes: string[]
}

export default function EditGame() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext) || {}

  if (!user || user.role !== "admin") return <p>Forbidden</p>

  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await api.get(`/games/${gameId}`)
        setGame(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchGame()
  }, [gameId])

  if (loading) return <p>Loading...</p>
  if (!game) return <p>Game not found</p>

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setGame({ ...game, [e.target.name]: e.target.value })
  }

  const handleArrayChange = (type: "quotes" | "notes", index: number, value: string) => {
    if (!game) return
    const arr = [...game[type]]
    arr[index] = value
    setGame({ ...game, [type]: arr })
  }

  const addArrayItem = (type: "quotes" | "notes") => {
    if (!game) return
    setGame({ ...game, [type]: [...game[type], ""] })
  }

  const removeArrayItem = (type: "quotes" | "notes", index: number) => {
    if (!game) return
    setGame({ ...game, [type]: game[type].filter((_, i) => i !== index) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.put(`/games/${gameId}`, game)
      alert("Game updated successfully!")
      navigate(`/games/${gameId}`)
    } catch (err) {
      console.error("Update failed", err)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      <h1 className="text-3xl text-pink-400">Edit Game</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Name</label>
          <input name="name" value={game.name} onChange={handleChange} className="w-full p-2 rounded border border-pink-900/30 bg-black mt-1" />
        </div>

        <div>
          <label>Description</label>
          <textarea name="description" value={game.description} onChange={handleChange} className="w-full p-2 rounded border border-pink-900/30 bg-black mt-1" />
        </div>

        <div>
          <label>Status</label>
          <input name="status" value={game.status} onChange={handleChange} className="w-full p-2 rounded border border-pink-900/30 bg-black mt-1" />
        </div>

        <div>
          <label>Fun Fact</label>
          <textarea name="fun_fact" value={game.fun_fact} onChange={handleChange} className="w-full p-2 rounded border border-pink-900/30 bg-black mt-1" />
        </div>

        <div>
          <label>Image URL</label>
          <input name="image_url" value={game.image} onChange={handleChange} className="w-full p-2 rounded border border-pink-900/30 bg-black mt-1" />
        </div>

        {/* Quotes */}
        <div>
          <label>Quotes</label>
          {game.quotes.map((q, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                value={q}
                onChange={(e) => handleArrayChange("quotes", i, e.target.value)}
                className="flex-1 border p-2 rounded"
              />
              <button type="button" onClick={() => removeArrayItem("quotes", i)} className="px-2 bg-red-500 text-white rounded">X</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem("quotes")} className="px-3 py-1 bg-green-500 text-white rounded">+ Add Quote</button>
        </div>

        {/* Notes */}
        <div>
          <label>Internal Notes</label>
          {game.notes.map((n, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                value={n}
                onChange={(e) => handleArrayChange("notes", i, e.target.value)}
                className="flex-1 border p-2 rounded"
              />
              <button type="button" onClick={() => removeArrayItem("notes", i)} className="px-2 bg-red-500 text-white rounded">X</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem("notes")} className="px-3 py-1 bg-green-500 text-white rounded">+ Add Note</button>
        </div>

        <button type="submit" className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded">Save Changes</button>
      </form>
    </div>
  )
}
