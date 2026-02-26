import { ChevronRight, Gamepad2 } from 'lucide-react';
import { useEffect, useState, useContext } from "react";
import { Link } from 'react-router';
import api from '../Api';
import { AuthContext } from "./AuthContext";

type GameType = {
  id: string;
  name: string;
  status: string;
  image: string;
  quotes: string[];
};

const defaultChaosQuotes = [
  "Guraggag Gareggog",
  "Sakaratil Cuak",
  "SUNSETTTT!!",
];

function Home() {
    const auth = useContext(AuthContext);
    const { user } = auth || {};

    const [games, setGames] = useState<GameType[]>([]);
    const [activeGames, setActiveGames] = useState<GameType[]>([]);
    const [currentQuote, setCurrentQuote] = useState(
        defaultChaosQuotes[Math.floor(Math.random() * defaultChaosQuotes.length)]
    );

    // 🔥 Helper untuk generate quote
    const generateQuote = (gamesList: GameType[]) => {
        if (!gamesList.length) {
            return defaultChaosQuotes[Math.floor(Math.random() * defaultChaosQuotes.length)];
        }

        const firstGame = gamesList[0];

        if (!firstGame.quotes?.length) {
            return defaultChaosQuotes[Math.floor(Math.random() * defaultChaosQuotes.length)];
        }

        return firstGame.quotes[
            Math.floor(Math.random() * firstGame.quotes.length)
        ];
    };

    // 🔥 Fetch games + quotes
    useEffect(() => {
        const fetchData = async () => {
            try {
                const gamesRes = await api.get("/games");

                let quotesData: any[] = [];
                try {
                    const quotesRes = await api.get("/quotes");
                    quotesData = quotesRes.data;
                } catch {
                    console.warn("Quotes fetch failed, fallback to default quotes");
                }

                const gamesWithQuotes: GameType[] = gamesRes.data.map((game: any) => ({
                    ...game,
                    quotes: quotesData
                        .filter((q: any) => q.game_id === game.id)
                        .map((q: any) => q.content)
                }));

                setGames(gamesWithQuotes);
                setActiveGames(gamesWithQuotes.slice(0, 3));

            } catch (err) {
                console.error("Failed to fetch data", err);
            }
        };

        fetchData();
    }, []);

    // 🔥 Set quote pertama langsung saat activeGames berubah
    useEffect(() => {
        if (!activeGames.length) return;
        setCurrentQuote(generateQuote(activeGames));
    }, [activeGames]);

    // 🔥 Interval update tiap 10 detik
    useEffect(() => {
        if (!activeGames.length) return;

        const interval = setInterval(() => {
            setCurrentQuote(generateQuote(activeGames));
        }, 10000);

        return () => clearInterval(interval);
    }, [activeGames]);

    // 🔥 Handler pilih active game
    const handleSelectActiveGame = (game: GameType) => {
        setActiveGames((prev) => {
            if (prev.find(g => g.id === game.id)) return prev;
            return [...prev, game].slice(-3);
        });
    };

    return (
        <div className="space-y-12 max-w-6xl mx-auto">
            {/* Header */}
            <section className="text-center py-12 space-y-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <img src='./logo.png' className='w-16 h-16 text-pink-500 animate-pulse'/>
                </div>
                <h1 className="text-4xl md:text-6xl text-pink-500 tracking-tight mb-4 metal-slug-title">
                    DANK MEME
                </h1>
                <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
                    Private Gaming Community Hub
                </p>
            </section>

            {/* Chaos Quote */}
            <section className="relative">
                <div className="border-4 border-orange-500 bg-gradient-to-br from-pink-500/5 to-orange-500/5 rounded-lg p-8 backdrop-blur-sm retro-border relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none scanline-effect"></div>
                    <div className="flex items-start gap-4 relative z-10">
                        <div className="text-6xl text-orange-400/50">"</div>
                        <div className="flex-1 pt-4">
                            <p className="text-lg md:text-xl text-gray-300 italic min-h-[3rem] transition-all duration-500">
                                {currentQuote}
                            </p>
                            <p className="text-sm text-orange-400 mt-4 metal-slug-title text-xs">
                                - Quote of the day
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Active Games */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="flex gap-2 items-center text-2xl text-pink-400">
                        <Gamepad2 /> Game yang Lagi Aktif
                    </h2>
                    <Link
                        to="/games"
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-pink-400 transition-colors"
                    >
                        View All
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {activeGames.map((game) => (
                        <Link
                            key={game.id}
                            to={`/games/${game.id}`}
                            className="overflow-hidden border border-pink-900/30 bg-gradient-to-br from-pink-950/10 to-purple-950/10 rounded-lg p-6 hover:shadow-lg hover:border-pink-900 hover:bg-gradient-to-br hover:from-pink-950/50 hover:to-purple-950/50 transition-all group relative"
                        >
                            <img
                                src={game.image}
                                alt={game.name}
                                className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/90 group-hover:bg-black/70 transition"></div>
                            <div className="relative z-10">
                                <h3 className="text-xl text-yellow-400 group-hover:text-yellow-300 mb-2 text-base">
                                    {game.name}
                                </h3>
                                <p className="text-sm text-gray-400 mb-1 font-mono">
                                    {game.status}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Game Hall Selection (Admin Only) */}
            {user?.role === "admin" && (
                <section>
                    <h2 className="text-xl text-pink-400 mb-4">
                        Pilih Active Game dari Game Hall
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {games.map((game) => (
                            <button
                                key={game.id}
                                onClick={() => handleSelectActiveGame(game)}
                                className="border border-pink-900/30 rounded-lg p-2 text-sm text-gray-300 hover:bg-pink-950/20 hover:border-pink-500 transition"
                            >
                                {game.name}
                            </button>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default Home;