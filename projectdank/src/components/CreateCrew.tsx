import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import api from "../Api";

type CrewProps = {
  id?: string;
  name: string;
  nickname: string;
  avatar: string;
  role: string;
  panicLevel: number;
  specialty: string;
  famousFor: string;
  funFacts: string[];
  gamesPlayed: number;
  deaths: number;
};

export default function CreateEditCrew() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  if (!user || user.role !== "admin") {
    return <p>Forbidden</p>;
  }

  const [form, setForm] = useState<CrewProps>({
    name: "",
    nickname: "",
    avatar: "",
    role: "",
    panicLevel: 5,
    specialty: "",
    famousFor: "",
    funFacts: [""],
    gamesPlayed: 0,
    deaths: 0,
  });

  const [loading, setLoading] = useState(isEdit);

  // Fetch member data if edit
  useEffect(() => {
    if (isEdit) {
      const fetchMember = async () => {
        try {
          const res = await api.get(`/crew/${id}`);
          setForm(res.data);
        } catch (err) {
          console.error(err);
          alert("Failed to fetch member");
        } finally {
          setLoading(false);
        }
      };
      fetchMember();
    }
  }, [id, isEdit]);

  // Input handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // FunFacts dynamic
  const handleFunFactChange = (index: number, value: string) => {
    const arr = [...form.funFacts];
    arr[index] = value;
    setForm(prev => ({ ...prev, funFacts: arr }));
  };
  const addFunFact = () => setForm(prev => ({ ...prev, funFacts: [...prev.funFacts, ""] }));
  const removeFunFact = (index: number) =>
    setForm(prev => ({ ...prev, funFacts: prev.funFacts.filter((_, i) => i !== index) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await api.put(`/crew/${id}`, form);
        alert("Member updated!");
      } else {
        await api.post("/crew", form);
        alert("Member created!");
      }
      navigate("/crew");
    } catch (err) {
      console.error(err);
      alert("Failed to save member");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      <h1 className="text-3xl text-pink-400">{isEdit ? "Edit Crew Member" : "Tambah Crew Member"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label>Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 rounded border border-pink-900/30 bg-black mt-1"
            required
          />
        </div>

        <div>
          <label>Nickname</label>
          <input
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
            className="w-full p-2 rounded border border-pink-900/30 bg-black mt-1"
            required
          />
        </div>

        <div>
          <label>Avatar (emoji or image URL)</label>
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
          <label>Panic Level (1-10)</label>
          <input
            type="number"
            name="panicLevel"
            value={form.panicLevel}
            onChange={handleChange}
            min={1}
            max={10}
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
            name="famousFor"
            value={form.famousFor}
            onChange={handleChange}
            className="w-full p-2 rounded border border-pink-900/30 bg-black mt-1"
          />
        </div>

        {/* Fun Facts */}
        <div>
          <label>Fun Facts</label>
          {form.funFacts.map((fact, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                value={fact}
                onChange={e => handleFunFactChange(i, e.target.value)}
                className="flex-1 border p-2 rounded"
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
            name="gamesPlayed"
            value={form.gamesPlayed}
            onChange={handleChange}
            className="w-full p-2 rounded border border-pink-900/30 bg-black mt-1"
            min={0}
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
            min={0}
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded"
        >
          {isEdit ? "Update Member" : "Create Member"}
        </button>
      </form>
    </div>
  );
}
