import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Crown, Zap } from "lucide-react";
import api from "../Api";
import { AuthContext } from "./AuthContext";

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

function Crew() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [crewData, setCrewData] = useState<CrewProps[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch crew members dari DB
  useEffect(() => {
    const fetchCrew = async () => {
      try {
        const res = await api.get("/crew");
        setCrewData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCrew();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin mau hapus member ini?")) return;
    try {
      await api.delete(`/crew/${id}`);
      setCrewData(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error(err);
      alert("Gagal hapus member");
    }
  };

  if (loading) return <p>Loading...</p>;

  const avgPanic = Math.round(
    crewData.reduce((sum, m) => sum + m.panic_level, 0) / crewData.length
  );
  const totalDeaths = crewData.reduce((sum, m) => sum + m.deaths, 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl text-pink-500">The Crew</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Meet the meme makers. Squad yang udah kayak keluarga, complete dengan
          inside jokes.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="border border-pink-900/30 bg-pink-950/10 rounded-lg p-4 text-center">
          <div className="text-2xl text-pink-500 mb-1">{crewData.length}</div>
          <div className="text-sm text-gray-400">Active Members</div>
        </div>
        <div className="border border-pink-900/30 bg-pink-950/10 rounded-lg p-4 text-center">
          <div className="text-2xl text-pink-500 mb-1">{avgPanic}</div>
          <div className="text-sm text-gray-400">Avg Panic Level</div>
        </div>
        <div className="border border-pink-900/30 bg-pink-950/10 rounded-lg p-4 text-center col-span-2 md:col-span-1">
          <div className="text-2xl text-pink-500 mb-1">{totalDeaths.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Combined Deaths</div>
        </div>
      </div>

      {/* Admin Add Member Button */}
      {user?.role === "admin" && (
        <div className="flex justify-end">
          <button
            onClick={() => navigate("/crew/create")}
            className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded"
          >
            + Tambah Member
          </button>
        </div>
      )}

      {/* Crew Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crewData.map(member => (
          <div
            key={member.id}
            className="border border-pink-900/30 bg-pink-950/10 rounded-lg overflow-hidden hover:border-pink-500/50 hover:shadow-lg transition-all relative"
          >
            {/* Admin Edit/Delete */}
            {user?.role === "admin" && (
              <>
                <button
                  onClick={() => navigate(`/crew/edit/${member.id}`)}
                  className="absolute top-2 right-2 px-2 py-1 bg-yellow-500 text-xs rounded z-10"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="absolute top-2 left-2 px-2 py-1 bg-red-600 text-xs rounded z-10"
                >
                  Delete
                </button>
              </>
            )}

            {/* Header */}
            <div
              className="relative bg-pink-950/40 p-6 text-center bg-cover bg-center"
              style={{
                backgroundImage: `url(${member.avatar})`,
              }}
            >
              
              <div className="absolute inset-0 bg-black/90" />

              <div className="relative z-10">
                <h3 className="text-xl text-pink-400 mb-1">
                  {member.nickname}
                </h3>
                <p className="text-sm text-gray-300 mb-3">
                  {member.name}
                </p>
                <div className="inline-block bg-pink-500/20 border border-pink-500/30 px-3 py-1 rounded text-xs text-pink-300">
                  {member.role}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="p-6 space-y-4">
              {/* Panic Level */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">Panic Level</span>
                  <span className="text-pink-400">{member.panic_level}/10</span>
                </div>
                <div className="w-full bg-pink-950/30 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-pink-500 h-full transition-all"
                    style={{ width: `${member.panic_level * 10}%` }}
                  />
                </div>
              </div>

              {/* Specialty */}
              <div>
                <div className="flex items-center gap-2 text-xs text-pink-400/70 mb-1">
                  <Zap className="w-3 h-3" />
                  <span>Specialty</span>
                </div>
                <p className="text-sm text-gray-300">{member.specialty}</p>
              </div>

              {/* Famous For */}
              <div>
                <div className="flex items-center gap-2 text-xs text-pink-400/70 mb-1">
                  <Crown className="w-3 h-3" />
                  <span>Famous For</span>
                </div>
                <p className="text-sm text-gray-300">{member.famous_for}</p>
              </div>

              {/* Fun Facts */}
              <div>
                <div className="text-xs text-pink-400/70 mb-2">Fun Facts:</div>
                <ul className="space-y-1">
                  {(member.fun_facts || []).map((fact, i) => (
                    <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                      <span className="text-pink-500 mt-0.5">•</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>


              {/* Games & Deaths */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-pink-900/20">
                <div>
                  <div className="text-lg text-pink-500">{member.games_played}</div>
                  <div className="text-xs text-gray-500">Games Played</div>
                </div>
                <div>
                  <div className="text-lg text-pink-500">{member.deaths}</div>
                  <div className="text-xs text-gray-500">Deaths</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Crew;
