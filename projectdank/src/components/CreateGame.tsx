import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "./AuthContext"
import api from "../Api"

export default function CreateGame() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext) || {}

  if (!user || user.role !== "admin") {
    return <p>Forbidden</p>
  }

  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "",
    fun_fact: "",
    image_url: "",
    quotes: [""],
    notes: [""],
  })

  // Input handler biasa
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Quotes / Notes dynamic
  const handleArrayChange = (type: "quotes" | "notes", index: number, value: string) => {
    const arr = [...form[type]]
    arr[index] = value
    setForm({ ...form, [type]: arr })
  }

  const addArrayItem = (type: "quotes" | "notes") => {
    setForm({ ...form, [type]: [...form[type], ""] })
  }

  const removeArrayItem = (type: "quotes" | "notes", index: number) => {
    const arr = form[type].filter((_, i) => i !== index)
    setForm({ ...form, [type]: arr })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await api.post("/games", form)
      alert("Game created!")
      navigate(`/games/${res.data.id}`)
    } catch (err) {
      console.error(err)
      alert("Failed to create game")
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      <h1 className="text-3xl text-pink-400">Tambah Game Baru</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full p-2 rounded border border-pink-900/30 bg-black mt-1" />
        </div>

        <div>
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full p-2 rounded border border-pink-900/30 bg-black mt-1" />
        </div>

        <div>
          <label>Status</label>
          <input name="status" value={form.status} onChange={handleChange} className="w-full p-2 rounded border border-pink-900/30 bg-black mt-1" />
        </div>

        <div>
          <label>Fun Fact</label>
          <textarea name="fun_fact" value={form.fun_fact} onChange={handleChange} className="w-full p-2 rounded border border-pink-900/30 bg-black mt-1" />
        </div>

        <div>
          <label>Image URL</label>
          <input name="image_url" value={form.image_url} onChange={handleChange} className="w-full p-2 rounded border border-pink-900/30 bg-black mt-1" />
        </div>

        {/* Quotes */}
        <div>
          <label>Quotes</label>
          {form.quotes.map((q, i) => (
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
          {form.notes.map((n, i) => (
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

        <button type="submit" className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded">
          Create Game
        </button>
      </form>
    </div>
  )
}
