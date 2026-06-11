export const meta = {
  name: "expand-catalog",
  description: "Research & web-verify real hardware models per category; write per-category JSON files",
  phases: [{ title: "Research" }],
};

// existing model names per category, passed in via args (to avoid duplicates)
const existing = (args && args.existing) || {};

const OUT_DIR = "C:\\\\Users\\\\בן\\\\Desktop\\\\mod\\\\scripts";

// field schema + target per category
const CFG = {
  cpu: { en: "Processor (CPU)", target: 24, fields: "cores(int), threads(int), baseClock(GHz decimal), boostClock(GHz decimal), l3Cache(MB int), tdp(W int), process(nm int), socket(text e.g. AM5/AM4/LGA1700/LGA1851/LGA1200), memorySupport(text e.g. 'DDR5-5600' or 'DDR4-3200, DDR5-5200'), igpu(text e.g. 'Radeon Graphics'/'Intel UHD 770'/'None'), unlocked(boolean)", srcHint: "Wikipedia 'List of AMD Ryzen processors' and 'List of Intel Core processors' have authoritative spec tables." },
  gpu: { en: "Graphics Card (GPU)", target: 16, fields: "vram(GB int), memoryType(text GDDR7/GDDR6X/GDDR6/GDDR5/HBM2), architecture(text e.g. 'Ada Lovelace'/'RDNA 3'/'Ampere'/'Turing'), boostClock(MHz int), cores(int — CUDA for NVIDIA / Stream Processors for AMD / Shading units for Intel), rtCores(int, 0 if none), tensorCores(int, 0 if none), upscaling(text 'DLSS 4'/'DLSS 3'/'FSR 3'/'XeSS'/'None'), memoryBus(bit int), bandwidth(GB/s int), tdp(W int), process(nm int), pcie(text '5.0'/'4.0'/'3.0'), recommendedPsu(W int)", srcHint: "Wikipedia 'List of Nvidia graphics processing units', 'List of AMD graphics processing units', and Intel Arc pages have authoritative tables." },
  ram: { en: "Memory kit (RAM)", target: 18, fields: "capacity(GB total int), type(text DDR5/DDR4), speed(MT/s int), casLatency(int), kit(text e.g. '2x16GB'), voltage(V decimal), profile(text 'XMP 3.0'/'EXPO'/'XMP/EXPO'), rgb(boolean)", srcHint: "Manufacturer product pages (Corsair, G.Skill, Kingston, Crucial, TeamGroup, ADATA)." },
  ssd: { en: "SSD", target: 18, fields: "capacity(GB int — 1TB=1000, 2TB=2000), interface(text 'PCIe 5.0 x4'/'PCIe 4.0 x4'/'SATA III'), formFactor(text 'M.2 2280'/'2.5-inch'), seqRead(MB/s int), seqWrite(MB/s int), randomRead(IOPS int), randomWrite(IOPS int), tbw(TB int), dram(boolean), nandType(text 'TLC'/'QLC')", srcHint: "Manufacturer spec pages (Samsung, WD, Crucial, Kingston, Seagate, SK Hynix, Sabrent)." },
  hdd: { en: "Hard Drive (HDD)", target: 14, fields: "capacity(TB int), rpm(int 7200/5400), cache(MB int), seqRead(MB/s int), interface(text 'SATA 6Gb/s'), formFactor(text '3.5-inch'/'2.5-inch'), recordingTech(text 'CMR'/'SMR'), usage(text 'Desktop'/'NAS'/'Surveillance'/'Enterprise'), workloadRate(TB/year int), warranty(years int)", srcHint: "Manufacturer datasheets (WD, Seagate, Toshiba)." },
  usb: { en: "USB / portable drive", target: 16, fields: "capacity(GB int), interface(text 'USB 3.2 Gen 2'/'USB 3.2 Gen 2x2'/'USB 3.2 Gen 1'/'USB4'), connector(text 'USB-A'/'USB-C'/'USB-A + USB-C'), seqRead(MB/s int), seqWrite(MB/s int), driveType(text 'Flash'/'External SSD'/'External HDD'), encryption(text 'None'/'AES 256-bit hardware'), warranty(years int)", srcHint: "Manufacturer pages (Samsung, SanDisk, Kingston, Crucial, WD, Seagate, Corsair)." },
  psu: { en: "Power Supply (PSU)", target: 30, fields: "wattage(W int), efficiency(text '80+ Bronze'/'80+ Gold'/'80+ Platinum'/'80+ Titanium'), modular(text 'Full'/'Semi'/'Non'), formFactor(text 'ATX'/'SFX'/'SFX-L'), atx3(boolean — ATX 3.0/3.1 with 12VHPWR/12V-2x6), fanSize(mm int 120/135/140), warranty(years int), zeroRpm(boolean)", srcHint: "Manufacturer pages (Corsair, Seasonic, be quiet!, EVGA, Cooler Master, MSI, Thermaltake, NZXT, Super Flower)." },
  mobo: { en: "Motherboard", target: 35, fields: "socket(text 'AM5'/'AM4'/'LGA1700'/'LGA1851'), chipset(text 'X670E'/'B650'/'X870E'/'B850'/'Z790'/'B760'/'Z890'/'B860'), formFactor(text 'ATX'/'Micro-ATX'/'Mini-ITX'/'E-ATX'), memoryType(text 'DDR5'/'DDR4'), memorySlots(int), maxMemory(GB int), m2Slots(int), pcieVersion(text 'PCIe 5.0'/'PCIe 4.0'), wifi(text 'Wi-Fi 7'/'Wi-Fi 6E'/'Wi-Fi 6'/'None'), lan(text '2.5GbE'/'1GbE'/'5GbE')", srcHint: "Manufacturer pages (ASUS, MSI, Gigabyte, ASRock)." },
  case: { en: "PC Case", target: 26, fields: "type(text 'Mid Tower'/'Full Tower'/'Mini Tower'/'Mini-ITX'), motherboardSupport(text e.g. 'ATX, Micro-ATX, Mini-ITX'), maxGpuLength(mm int), maxCoolerHeight(mm int), maxRadiator(mm int), psuFormFactor(text 'ATX'/'SFX'), fans(int — included), driveBays(text e.g. '2x3.5-inch, 2x2.5-inch'), frontIo(text e.g. 'USB-C, 2x USB-A, Audio')", srcHint: "Manufacturer pages (Fractal Design, NZXT, Lian Li, Corsair, be quiet!, Cooler Master, Phanteks, HYTE, Montech)." },
  cooler: { en: "CPU Cooler", target: 28, fields: "type(text 'Air'/'AIO Liquid'), socketSupport(text e.g. 'AM5, AM4, LGA1700, LGA1851'), tdpRating(W int — cooling capacity), height(mm int — air cooler height; 0 for AIO), radiatorSize(mm int — AIO 240/280/360/420; 0 for air), fanSize(mm int), noiseLevel(dB decimal), rgb(boolean)", srcHint: "Manufacturer pages (Noctua, be quiet!, Arctic, DeepCool, Thermalright, Cooler Master, Corsair, NZXT, Lian Li)." },
};

function buildPrompt(cat, c) {
  const ex = (existing[cat] || []);
  return [
    `You are a hardware-spec researcher. Add REAL, well-known **${c.en}** models to a Hebrew hardware-comparison site (category key "${cat}").`,
    ``,
    `CRITICAL — accuracy over quantity:`,
    `- Use WebFetch and WebSearch to VERIFY every spec against an authoritative source. If those tools are not directly available, first call ToolSearch with query "select:WebFetch,WebSearch" to load them. You may also use Bash with \`curl -sk\` (dangerouslyDisableSandbox: true) to fetch pages.`,
    `- ${c.srcHint}`,
    `- Include a model ONLY if you verified its specs from a real source. DO NOT fabricate, guess, or approximate. Fewer accurate entries is much better than many uncertain ones.`,
    `- Return up to ${c.target} models. It is fine to return fewer.`,
    ``,
    `Do NOT include any of these models that ALREADY EXIST (skip duplicates and close variants already present):`,
    ex.length ? ex.map((n) => `  - ${n}`).join("\n") : "  (none yet)",
    ``,
    `For each model, fill EXACTLY these spec keys with correct, verified values (respect units, integers where noted):`,
    `  ${c.fields}`,
    ``,
    `Each object must have: "id" (kebab-case of the name: lowercase, hyphens, no quotes/special chars), "name" (official model name, English), "brand", "category": "${cat}", "year" (release year, integer), "score" (integer 0-100 reflecting relative performance/quality vs current ${c.en} market — current flagships ~90-100, strong mid-range ~70-85, budget/old lower), "blurb" (ONE short sentence in HEBREW), "source" (the URL you verified specs from), and "specs" (object with exactly the keys above).`,
    ``,
    `Example shape (values illustrative):`,
    `{"id":"example-model-x","name":"Example Model X","brand":"BrandCo","category":"${cat}","year":2024,"score":85,"blurb":"תיאור קצר בעברית.","source":"https://en.wikipedia.org/wiki/...","specs":{ /* the keys listed above */ }}`,
    ``,
    `OUTPUT: Use the Write tool to save a JSON ARRAY of your verified objects to this exact path:`,
    `  ${OUT_DIR}\\_new_${cat}.json`,
    `Write ONLY valid JSON (an array). Then reply with one line: the category and how many models you wrote, e.g. "${cat}: 23 written".`,
  ].join("\n");
}

phase("Research");
const cats = Object.keys(CFG);
const results = await parallel(
  cats.map((cat) => () => agent(buildPrompt(cat, CFG[cat]), { label: `research:${cat}`, phase: "Research" })),
);

return cats.map((cat, i) => ({ cat, summary: results[i] }));
