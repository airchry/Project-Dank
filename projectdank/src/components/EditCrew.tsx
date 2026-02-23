import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import api from "../Api";

type CrewProps = {
  id: string;
  name: string;
  nickname: string;
  avatar: string;
  role: string;
  panic_level: number;
  specialty: string;
  famous_for: string;
  fun_facts: string[];
  games_played: number;
  deaths: number;
};

export default function EditCrew() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};

  if (!user || user.role !== "admin") return <p>Forbidden</p>;

  const [form, setForm] = useState<CrewProps>({
    id: "",
    name: "",
    nickname: "",
    avatar: "",
    role: "",
    panic_level: 0,
    specialty: "",
    famous_for: "",
    fun_facts: [],
    games_played: 0,
    deaths: 0,
  });

  const [loading, setLoading] = useState(true);

  // FETCH MEMBER
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await api.get(`/crew/${id}`);

        setForm({
          id: res.data.id,
          name: res.data.name,
          nickname: res.data.nickname,
          avatar: res.data.avatar,
          role: res.data.role,
          panic_level: res.data.panic_level,
          specialty: res.data.specialty,
          famous_for: res.data.famous_for,
          fun_facts: res.data.fun_facts || [],
          games_played: res.data.games_played,
          deaths: res.data.deaths,
        });
      } catch (err) {
        console.error(err);
        alert("Gagal ambil data member");
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  // HANDLE INPUT CHANGE
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Convert number fields
    if (
      name === "panic_level" ||
      name === "games_played" ||
      name === "deaths"
    ) {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // FUN FACTS
  const handleArrayChange = (index: number, value: string) => {
    const arr = [...form.fun_facts];
    arr[index] = value;
    setForm((prev) => ({ ...prev, fun_facts: arr }));
  };

  const addFunFact = () =>
    setForm((prev) => ({
      ...prev,
      fun_facts: [...prev.fun_facts, ""],
    }));

  const removeFunFact = (index: number) =>
    setForm((prev) => ({
      ...prev,
      fun_facts: prev.fun_facts.filter((_, i) => i !== index),
    }));

  // SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.put(`/crew/${id}`, form);
      alert("Member updated!");
      navigate("/crew");
    } catch (err) {
      console.error(err);
      alert("Gagal update member");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      <h1 className="text-3xl text-pink-400">Edit Crew Member</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 rounded border border-pink-900/30 bg-black mt-1"
          />
        </div>

        <div>
          <label>Nickname</label>
          <input
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
            className="w-full p-2 rounded border border-pink-900/30 bg-black mt-1"
          />
        </div>

        <div>
          <label>Avatar (URL / emoji)</label>
          <input
            name="avatar"
            value={form.avatar}
            onChange={handleChange}
            className="w-full p-2 rounded border border-pink-900/30 bg-black mt-1"
          />
        </div>

        <div>
          <label>Role</label>
          <input
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-2 rounded border border-pink-900/30 bg-black mt-1"
          />
        </div>

        <div>
          <label>Panic Level (0-10)</label>
          <input
            type="number"
            name="panic_level"
            min={0}
            max={10}
            value={form.panic_level}
            onChange={handleChange}
            className="w-full p-2 rounded border border-pink-900/30 bg-black mt-1"
          />
        </div>

        <div>
          <label>Specialty</label>
          <input
            name="specialty"
            value={form.specialty}
            onChange={handleChange}
            className="w-full p-2 rounded border border-pink-900/30 bg-black mt-1"
          />
        </div>

        <div>
          <label>Famous For</label>
          <input
            name="famous_for"
            value={form.famous_for}
            onChange={handleChange}
            className="w-full p-2 rounded border border-pink-900/30 bg-black mt-1"
          />
        </div>

        {/* FUN FACTS */}
        <div>
          <label>Fun Facts</label>

          {form.fun_facts.map((fact, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                value={fact}
                onChange={(e) => handleArrayChange(i, e.target.value)}
                className="flex-1 border p-2 rounded bg-black"
              />
              <button
                type="button"
                onClick={() => removeFunFact(i)}
                className="px-2 bg-red-500 text-white rounded"
              >
                X
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addFunFact}
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            + Add Fun Fact
          </button>
        </div>

        <div>
          <label>Games Played</label>
          <input
            type="number"
            name="games_played"
            value={form.games_played}
            onChange={handleChange}
            className="w-full p-2 rounded border border-pink-900/30 bg-black mt-1"
          />
        </div>

        <div>
          <label>Deaths</label>
          <input
            type="number"
            name="deaths"
            value={form.deaths}
            onChange={handleChange}
            className="w-full p-2 rounded border border-pink-900/30 bg-black mt-1"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded"
        >
          Update Member
        </button>
      </form>
    </div>
  );
}