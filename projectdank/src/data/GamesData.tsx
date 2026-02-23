import lethalcompany from "../../public/gamepictures/lethalcompany.jpg"
import backrooms from "../../public/gamepictures/backrooms.jpg"
import zort from "../../public/gamepictures/zort.jpg"
import mimesis from "../../public/gamepictures/mimesis.jpg"
import valorant from "../../public/gamepictures/valorant.jpg"
import contentwarning from "../../public/gamepictures/contentwarning.jpg"

type GamesDataProps = {
  id: string
  name: string
  status: string
  description: string
  image: string
  funFact: string
  quotes: string[]
  memes: {
    title: string
    description: string
  }[]
  notes: string[]
}

export const GamesData: GamesDataProps[] =
  [
    {
        id: 'lethal-company',
        name: 'Lethal Company',
        status: 'Co-op',
        description: 'Game survival horror co-op yang bikin kita ketawa sambil panik. Misi: ambil barang, jual, survive. Reality: mati konyol terus.',
        image: lethalcompany,
        funFact: 'Record kematian tercepat: 12 detik setelah landing',
        quotes: [
            '"GUE KEJAR SAMA BRACKET BENDERA!!!"',
            '"Siapa yang ninggalin pintu kapal terbuka?!"',
            '"Kenapa monster masuk ke kapal sih anjir!"',
            '"Quota belum tercapai guys, yuk satu run lagi" *dies immediately*',
            '"Jangan ambil apparatus! JANGAN AMBIL APPARATUS!" *someone takes it anyway*',
        ],
        memes: [
        {
            title: 'The Great Ship Door Incident',
            description: 'Saat semua lupa tutup pintu dan bracket masuk ke kapal',
        },
        {
            title: 'Quota Panic Compilation',
            description: 'Video 10 menit pure panic last day quota',
        },
        {
            title: '"It\'s Just a Coil Head"',
            description: 'Famous last words before team wipe',
        },
        {
            title: 'Walkie Talkie Chaos',
            description: 'Semua teriak bareng sampai ga kedengeran apa-apa',
        },
        ],
        notes: [
            'Selalu ada yang lupa matiin walkie talkie',
            'Rush apparatus = 90% chance team wipe',
            'Ship horn = emergency panic button',
            'Jangan trust lampu hijau, itu jebakan',
        ],
    },
    {
        id: 'backrooms',
        name: 'The Backrooms',
        status: 'Co-op',
        description: 'Exploration horror di dimensi liminal space yang endless. Vibes: creepy, confusing, dan bikin parno.',
        image: backrooms,
        funFact: 'Pernah tersesat 45 menit di Level 0 terus muter-muter doang',
        quotes: [
            '"Gue denger footsteps... GUE DENGER FOOTSTEPS!"',
            '"Kita udah lewat sini belom ya? Kok kayak familiar..."',
            '"Guys jangan pisah! GUYS JANGAN PISAH!!!"',
            '"Level ini aman ga sih? LEVEL INI AMAN GA?!"',
            '"Kenapa lampunya kedip-kedip anjir jangan kedip dong"',
        ],
        memes: [
        {
            title: 'Lost in Level 0 Supercut',
            description: '20 menit footage kita muter-muter ga jelas',
        },
        {
            title: 'The Screaming Incident',
            description: 'Saat ada yang ketemu entity dan semuanya ikutan teriak',
        },
        {
            title: 'Noclip Fails',
            description: 'Compilation gagal noclip dan malah stuck di wall',
        },
        ],
        notes: [
            'Jangan lari kalau denger suara aneh',
            'Mark every turn or we get lost',
            'Kalau lampu flicker = RUN',
            'Level fun BUKAN fun sama sekali',
        ],
    },
    {
        id: 'zort',
        name: 'Zort',
        status: 'Co-op',
        description: 'Co-op game dengan mekanik unik dan chaos maksimal. Perfect untuk squad yang suka laugh-scream gaming.',
        image: zort,
        funFact: 'Pernah 5x restart karena semua mati di tutorial',
        quotes: [
            '"Gimana sih cara main ini?!"',
            '"Ok gue paham sekarang" *immediately dies*',
            '"Siapa yang pencet tombol itu?! SIAPA?!"',
            '"Restart aja deh guys ini udah chaos banget"',
        ],
        memes: [
        {
            title: 'Tutorial Wipeout',
            description: 'Mati berjamaah di tutorial level',
        },
        {
            title: 'Accidental Button Press',
            description: 'Compilation button press yang bikin game over',
        },
        ],
        notes: [
            'Tutorial is harder than the actual game',
            'Communication = key (but we still chaos)',
            'If confused, just run',
        ],
    },
    {
        id: 'valorant',
        name: 'valorant',
        status: 'Tactical Shooter',
        description: 'Valorant adalah FPS taktis 5v5 di mana pemain memilih Agent dengan kemampuan unik untuk menanam atau menjinakkan Spike sambil mengandalkan strategi dan tembakan presisi.',
        image: valorant,
        funFact: 'Tenang, ada gw',
        quotes: [
            '"Dia bilang apa? DIA BILANG APA?!"',
            '"Banyak di sini"',
            '"Gw jago gw jago"',
            '"Gk mungkin kita kalah"',
        ],
        memes: [
        {
            title: 'Cursed Equipment Moments',
            description: 'Saat semua equipment nge-bug dan kita bingung',
        },
        {
            title: 'Hide and Seek (but with ghosts)',
            description: 'Compilation momen hunt yang epic',
        },
        ],
        notes: [
            'Jangan bilang nama hantu 3x (we learned the hard way)',
            'Crucifix placement is an art',
            'Pro player = yang bisa stay calm during hunt',
        ],
    },
    {
        id: 'content-warning',
        name: 'Content Warning',
        status: 'Co-op',
        description: 'Bikin konten video di tempat berbahaya buat views. Meta gaming at its finest.',
        image: contentwarning,
        funFact: 'Video dengan views terbanyak: pure screaming 2 menit',
        quotes: [
            '"RECORD GUYS RECORD INI KONTEN BAGUS!"',
            '"Mati gapapa yang penting dapet footage"',
            '"Ini viral ga ya?"',
            '"Monetize this! MONETIZE THIS!"',
        ],
        memes: [
        {
            title: 'Viral Scream Compilation',
            description: 'Our best screaming moments (professionally recorded)',
        },
        {
            title: 'Failed Stunts',
            description: 'Trying too hard for content',
        },
        ],
        notes: [
            'Content > Survival',
            'Best content = unplanned chaos',
            'Camera man never dies (except when they do)',
        ],
    },
    {
        id: 'mimesis',
        name: 'Mimesis',
        status: 'Co-op',
        description: 'Mimesis adalah game horor survival kooperatif untuk 4 pemain di mana hujan terkutuk mengubah orang menjadi makhluk yang bisa meniru suara, tindakan, dan bahkan ingatan temanmu, sehingga kamu dan tim harus mengumpulkan sumber daya dan menjaga tram agar tetap berjalan sambil bertahan hidup dan terus meragukan siapa yang bisa dipercaya.',
        image: mimesis,
        funFact: 'Belum pernah berhasil selesaiin ritual tanpa ada yang mati',
        quotes: [
            '"SIAPA YANG PEGANG GOAT?!"',
            '"Anna is hunting! ANNA IS HUNTING!"',
            '"Kita butuh berapa goat lagi?!"',
            '"Ritual spot dimana? DIMANA?!"',
        ],
        memes: [
        {
            title: 'Goat Juggling Fails',
            description: 'Koordinasi goat yang berantakan',
        },
        {
            title: 'Anna Chase Moments',
            description: 'Pure panic moments',
        },
        ],
        notes: [
            'Goat management is harder than it looks',
            'Never split up (but we always do)',
            'Flashlight = your best friend',
        ],
    },
  ];

export function getGameById(id: string): GamesDataProps | undefined {
  return GamesData.find(game => game.id === id);
}