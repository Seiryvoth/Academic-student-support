// SVG Visual Diagrams for Grade 7 Mathematics

// Helper to encode SVG string to data URI
export function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// 1. Number Line for Integers (Lesson 1)
export const SVG_NUMBER_LINE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 140" width="100%" height="100%">
  <rect width="600" height="140" fill="#f8fafc" rx="16"/>
  <line x1="40" y1="70" x2="560" y2="70" stroke="#334155" stroke-width="3" stroke-linecap="round"/>
  <polygon points="560,70 545,63 545,77" fill="#334155"/>
  <polygon points="40,70 55,63 55,77" fill="#334155"/>
  <!-- Ticks and labels -->
  <!-- -5 to +5 -->
  <line x1="90" y1="60" x2="90" y2="80" stroke="#64748b" stroke-width="2"/>
  <text x="90" y="105" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#475569">-5</text>
  <line x1="132" y1="62" x2="132" y2="78" stroke="#64748b" stroke-width="2"/>
  <text x="132" y="105" font-family="sans-serif" font-size="14" text-anchor="middle" fill="#475569">-4</text>
  <line x1="174" y1="60" x2="174" y2="80" stroke="#e11d48" stroke-width="2.5"/>
  <circle cx="174" cy="70" r="5" fill="#e11d48"/>
  <text x="174" y="105" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#e11d48">-3 (A)</text>
  <line x1="216" y1="62" x2="216" y2="78" stroke="#64748b" stroke-width="2"/>
  <text x="216" y="105" font-family="sans-serif" font-size="14" text-anchor="middle" fill="#475569">-2</text>
  <line x1="258" y1="62" x2="258" y2="78" stroke="#64748b" stroke-width="2"/>
  <text x="258" y="105" font-family="sans-serif" font-size="14" text-anchor="middle" fill="#475569">-1</text>
  <!-- 0 Center -->
  <line x1="300" y1="52" x2="300" y2="88" stroke="#2563eb" stroke-width="3"/>
  <circle cx="300" cy="70" r="6" fill="#2563eb"/>
  <text x="300" y="110" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="#2563eb">0 (O)</text>
  <line x1="342" y1="62" x2="342" y2="78" stroke="#64748b" stroke-width="2"/>
  <text x="342" y="105" font-family="sans-serif" font-size="14" text-anchor="middle" fill="#475569">+1</text>
  <line x1="384" y1="60" x2="384" y2="80" stroke="#059669" stroke-width="2.5"/>
  <circle cx="384" cy="70" r="5" fill="#059669"/>
  <text x="384" y="105" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#059669">+2 (B)</text>
  <line x1="426" y1="62" x2="426" y2="78" stroke="#64748b" stroke-width="2"/>
  <text x="426" y="105" font-family="sans-serif" font-size="14" text-anchor="middle" fill="#475569">+3</text>
  <line x1="468" y1="60" x2="468" y2="80" stroke="#d97706" stroke-width="2.5"/>
  <circle cx="468" cy="70" r="5" fill="#d97706"/>
  <text x="468" y="105" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#d97706">+4 (C)</text>
  <line x1="510" y1="62" x2="510" y2="78" stroke="#64748b" stroke-width="2"/>
  <text x="510" y="105" font-family="sans-serif" font-size="14" text-anchor="middle" fill="#475569">+5</text>
  <!-- Legend title -->
  <text x="300" y="32" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">បន្ទាត់ចំនួនគត់រ៉ឺឡាទីប (Relative Integers Number Line)</text>
</svg>
`);

// 2. Prime Factors Venn Diagram (Lesson 2: GCD & LCM of 24 & 36)
export const SVG_PRIME_VENN = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 240" width="100%" height="100%">
  <rect width="500" height="240" fill="#f8fafc" rx="16"/>
  <text x="250" y="30" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#1e293b">ដ្យាក្រាមវ៉ែននៃកត្តាបឋម (Prime Factors Venn Diagram: 24 &amp; 36)</text>
  <!-- Circle A: 24 -->
  <circle cx="190" cy="130" r="85" fill="#3b82f6" fill-opacity="0.2" stroke="#2563eb" stroke-width="3"/>
  <!-- Circle B: 36 -->
  <circle cx="310" cy="130" r="85" fill="#ec4899" fill-opacity="0.2" stroke="#db2777" stroke-width="3"/>
  <!-- Labels -->
  <text x="140" y="80" font-family="sans-serif" font-size="16" font-weight="bold" fill="#1d4ed8">24</text>
  <text x="360" y="80" font-family="sans-serif" font-size="16" font-weight="bold" fill="#be185d">36</text>
  <!-- Only 24: prime factor 2 -->
  <text x="145" y="135" font-family="sans-serif" font-size="18" font-weight="bold" fill="#1e40af">2</text>
  <!-- Intersection: 2, 2, 3 -->
  <text x="250" y="105" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="#4338ca">2</text>
  <text x="250" y="135" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="#4338ca">2</text>
  <text x="250" y="165" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="#4338ca">3</text>
  <!-- Only 36: prime factor 3 -->
  <text x="355" y="135" font-family="sans-serif" font-size="18" font-weight="bold" fill="#9d174d">3</text>
  <!-- Footer formula -->
  <text x="250" y="225" font-family="sans-serif" font-size="13" font-weight="semibold" text-anchor="middle" fill="#334155">GCD = 2 x 2 x 3 = 12 | LCM = 2 x (12) x 3 = 72</text>
</svg>
`);

// 3. Perfect Square Grid 5x5 = 25 (Lesson 3)
export const SVG_SQUARE_GRID = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 260" width="100%" height="100%">
  <rect width="380" height="260" fill="#f8fafc" rx="16"/>
  <text x="190" y="30" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#1e293b">គំរូធរណីមាត្រនៃការេ (Geometric Square: a = 5)</text>
  <g transform="translate(115, 50)">
    <!-- 5x5 grid cells -->
    <rect x="0" y="0" width="150" height="150" fill="#dbeafe" stroke="#2563eb" stroke-width="3"/>
    <path d="M30 0v150 M60 0v150 M90 0v150 M120 0v150 M0 30h150 M0 60h150 M0 90h150 M0 120h150" stroke="#3b82f6" stroke-width="1.5" stroke-opacity="0.6"/>
  </g>
  <!-- Side Labels -->
  <text x="190" y="225" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#2563eb">ជ្រុង a = 5 ឯកតា</text>
  <text x="85" y="130" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#2563eb" transform="rotate(-90 85 130)">a = 5</text>
  <!-- Inside Area text -->
  <text x="190" y="132" font-family="sans-serif" font-size="18" font-weight="extrabold" text-anchor="middle" fill="#1e40af">25 ក្រឡា</text>
  <text x="190" y="248" font-family="sans-serif" font-size="13" font-weight="semibold" text-anchor="middle" fill="#475569">S = 5² = 25 ឯកតាផ្ទៃ ⟺ √25 = 5</text>
</svg>
`);

// 4. Ratio & Percentage Bar (Lesson 4)
export const SVG_RATIO_BAR = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 180" width="100%" height="100%">
  <rect width="500" height="180" fill="#f8fafc" rx="16"/>
  <text x="250" y="30" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#1e293b">របារសមាមាត្រ និងភាគរយ (Ratio: 3 : 2 = 60% : 40%)</text>
  <!-- Full Bar: 400px width divided into 5 units (80px each), 3 blue, 2 amber -->
  <g transform="translate(50, 60)">
    <rect x="0" y="0" width="240" height="50" fill="#3b82f6" rx="8" stroke="#2563eb" stroke-width="2"/>
    <rect x="240" y="0" width="160" height="50" fill="#f59e0b" rx="8" stroke="#d97706" stroke-width="2"/>
    <!-- Dividers -->
    <line x1="80" y1="0" x2="80" y2="50" stroke="#ffffff" stroke-width="2"/>
    <line x1="160" y1="0" x2="160" y2="50" stroke="#ffffff" stroke-width="2"/>
    <line x1="320" y1="0" x2="320" y2="50" stroke="#ffffff" stroke-width="2"/>
    <!-- Texts inside -->
    <text x="120" y="32" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">ផ្នែក A (3 ភាគ = 60%)</text>
    <text x="320" y="32" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">ផ្នែក B (2 ភាគ = 40%)</text>
  </g>
  <!-- Bottom Total -->
  <text x="250" y="150" font-family="sans-serif" font-size="14" font-weight="semibold" text-anchor="middle" fill="#334155">សរុប = 5 ភាគស្មើគ្នា = 100% (ផលធៀប 3:2)</text>
</svg>
`);

// 5. Discount Price Tag Diagram (Lesson 5)
export const SVG_DISCOUNT_TAG = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 200" width="100%" height="100%">
  <rect width="420" height="200" fill="#f8fafc" rx="16"/>
  <text x="210" y="30" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#1e293b">ការបញ្ចុះតម្លៃ ២០% លើទំនិញ (20% Discount)</text>
  <!-- Price Tag -->
  <g transform="translate(60, 55)">
    <rect x="0" y="0" width="300" height="85" fill="#fef2f2" stroke="#ef4444" stroke-width="2.5" rx="14"/>
    <text x="30" y="36" font-family="sans-serif" font-size="15" font-weight="bold" fill="#64748b" text-decoration="line-through">តម្លៃដើម: $100</text>
    <rect x="200" y="12" width="85" height="30" fill="#ef4444" rx="8"/>
    <text x="242" y="32" font-family="sans-serif" font-size="14" font-weight="extrabold" fill="#ffffff" text-anchor="middle">- 20%</text>
    <text x="30" y="70" font-family="sans-serif" font-size="18" font-weight="extrabold" fill="#b91c1c">តម្លៃលក់: $80</text>
    <text x="200" y="70" font-family="sans-serif" font-size="13" font-weight="semibold" fill="#047857">ចំណេញបាន: $20</text>
  </g>
  <text x="210" y="175" font-family="sans-serif" font-size="13" font-weight="semibold" text-anchor="middle" fill="#334155">រូបមន្ត: តម្លៃលក់ = តម្លៃដើម x (1 - 20%) = 100 x 0.8 = $80</text>
</svg>
`);

// 6. Geometry Angles with Transversal (Lesson 7)
export const SVG_PARALLEL_LINES = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 220" width="100%" height="100%">
  <rect width="460" height="220" fill="#f8fafc" rx="16"/>
  <text x="230" y="28" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#1e293b">បន្ទាត់ស្របកាត់ដោយខ្នាត់ (Parallel Lines &amp; Transversal)</text>
  <!-- Parallel Lines (d1) and (d2) -->
  <line x1="40" y1="80" x2="420" y2="80" stroke="#2563eb" stroke-width="3"/>
  <text x="430" y="85" font-family="sans-serif" font-size="14" font-weight="bold" fill="#2563eb">(d₁)</text>
  <line x1="40" y1="160" x2="420" y2="160" stroke="#2563eb" stroke-width="3"/>
  <text x="430" y="165" font-family="sans-serif" font-size="14" font-weight="bold" fill="#2563eb">(d₂)</text>
  <!-- Transversal Line (t) -->
  <line x1="120" y1="40" x2="340" y2="200" stroke="#dc2626" stroke-width="3"/>
  <text x="350" y="205" font-family="sans-serif" font-size="14" font-weight="bold" fill="#dc2626">(Δ)</text>
  <!-- Angle arcs -->
  <!-- Upper angle at (175, 80) -->
  <path d="M205 80 A30 30 0 0 1 190 95" fill="none" stroke="#d97706" stroke-width="2.5"/>
  <text x="215" y="105" font-family="sans-serif" font-size="14" font-weight="bold" fill="#b45309">∠A₁ = 65°</text>
  <!-- Alternate Interior angle at (285, 160) -->
  <path d="M255 160 A30 30 0 0 1 270 145" fill="none" stroke="#d97706" stroke-width="2.5"/>
  <text x="220" y="150" font-family="sans-serif" font-size="14" font-weight="bold" fill="#b45309">∠B₂ = ?</text>
  <text x="230" y="205" font-family="sans-serif" font-size="13" font-weight="semibold" text-anchor="middle" fill="#334155">មុំឆ្លាស់ក្នុងស្មើគ្នា: ∠B₂ = ∠A₁ = 65° (បើ d₁ // d₂)</text>
</svg>
`);

// 7. Circle with Radius & Diameter (Lesson 8)
export const SVG_CIRCLE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 250" width="100%" height="100%">
  <rect width="420" height="250" fill="#f8fafc" rx="16"/>
  <text x="210" y="28" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#1e293b">រង្វង់ផ្ចិត O និងកាំ r = 7 cm (Circle C)</text>
  <g transform="translate(210, 125)">
    <!-- Circle -->
    <circle cx="0" cy="0" r="70" fill="#eff6ff" stroke="#2563eb" stroke-width="3"/>
    <!-- Center Dot -->
    <circle cx="0" cy="0" r="4" fill="#1e40af"/>
    <text x="-14" y="-8" font-family="sans-serif" font-size="15" font-weight="bold" fill="#1e40af">O</text>
    <!-- Radius line -->
    <line x1="0" y1="0" x2="70" y2="0" stroke="#dc2626" stroke-width="2.5"/>
    <text x="32" y="-8" font-family="sans-serif" font-size="14" font-weight="bold" fill="#dc2626">r = 7 cm</text>
    <!-- Diameter dashed line -->
    <line x1="-70" y1="0" x2="0" y2="0" stroke="#64748b" stroke-dasharray="4" stroke-width="2"/>
    <text x="-48" y="-8" font-family="sans-serif" font-size="12" fill="#64748b">r = 7 cm</text>
  </g>
  <text x="210" y="222" font-family="sans-serif" font-size="13" font-weight="semibold" text-anchor="middle" fill="#334155">C = 2πr = 2 x 3.14 x 7 = 43.96 cm | S = πr² = 3.14 x 49 = 153.86 cm²</text>
</svg>
`);

// 8. 3D Rectangular Prism / Cuboid (Lesson 9)
export const SVG_3D_CUBOID = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 240" width="100%" height="100%">
  <rect width="440" height="240" fill="#f8fafc" rx="16"/>
  <text x="220" y="28" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#1e293b">ប្រលេពីប៉ែតកែង (Rectangular Prism: L=6, W=4, H=5)</text>
  <g transform="translate(100, 50)">
    <!-- Front face -->
    <rect x="30" y="40" width="150" height="100" fill="#93c5fd" fill-opacity="0.6" stroke="#1d4ed8" stroke-width="2.5"/>
    <!-- Top face -->
    <polygon points="30,40 90,10 240,10 180,40" fill="#bfdbfe" fill-opacity="0.8" stroke="#1d4ed8" stroke-width="2.5"/>
    <!-- Right face -->
    <polygon points="180,40 240,10 240,110 180,140" fill="#60a5fa" fill-opacity="0.7" stroke="#1d4ed8" stroke-width="2.5"/>
    <!-- Dimensions -->
    <text x="105" y="162" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e3a8a">បណ្តោយ L = 6 cm</text>
    <text x="218" y="135" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e3a8a" transform="rotate(-30 218 135)">ទទឹង W = 4 cm</text>
    <text x="8" y="95" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e3a8a">កម្ពស់ H = 5 cm</text>
  </g>
  <text x="220" y="222" font-family="sans-serif" font-size="13" font-weight="semibold" text-anchor="middle" fill="#334155">មាឌ V = L x W x H = 6 x 4 x 5 = 120 cm³</text>
</svg>
`);

// 9. Reflection across Line Symmetry (Lesson 10)
export const SVG_REFLECTION = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 220" width="100%" height="100%">
  <rect width="460" height="220" fill="#f8fafc" rx="16"/>
  <text x="230" y="28" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#1e293b">ភាពឆ្លុះក្នុងប្លង់ធៀបនឹងបន្ទាត់ (Reflection across Line d)</text>
  <!-- Axis of reflection d -->
  <line x1="230" y1="40" x2="230" y2="190" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="6"/>
  <text x="238" y="55" font-family="sans-serif" font-size="14" font-weight="bold" fill="#dc2626">អ័ក្សឆ្លុះ (d)</text>
  <!-- Triangle 1 (Left) -->
  <polygon points="120,70 70,160 170,160" fill="#93c5fd" fill-opacity="0.6" stroke="#2563eb" stroke-width="2.5"/>
  <text x="120" y="60" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e40af" text-anchor="middle">A</text>
  <text x="60" y="175" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e40af">B</text>
  <text x="175" y="175" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e40af">C</text>
  <!-- Triangle 2 (Reflected Right) -->
  <polygon points="340,70 390,160 290,160" fill="#fbcfe8" fill-opacity="0.6" stroke="#db2777" stroke-width="2.5"/>
  <text x="340" y="60" font-family="sans-serif" font-size="14" font-weight="bold" fill="#9d174d" text-anchor="middle">A'</text>
  <text x="395" y="175" font-family="sans-serif" font-size="14" font-weight="bold" fill="#9d174d">B'</text>
  <text x="275" y="175" font-family="sans-serif" font-size="14" font-weight="bold" fill="#9d174d">C'</text>
  <!-- Distance connectors -->
  <line x1="120" y1="70" x2="340" y2="70" stroke="#64748b" stroke-dasharray="3" stroke-width="1.5"/>
  <line x1="170" y1="160" x2="290" y2="160" stroke="#64748b" stroke-dasharray="3" stroke-width="1.5"/>
  <text x="230" y="210" font-family="sans-serif" font-size="13" font-weight="semibold" text-anchor="middle" fill="#334155">ΔABC ≅ ΔA'B'C' (រូបទាំងពីរមានរាង និងទំហំប៉ុនគ្នាទាំងស្រុង)</text>
</svg>
`);

// 10. Statistical Bar Chart (Lesson 11)
export const SVG_BAR_CHART = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 230" width="100%" height="100%">
  <rect width="460" height="230" fill="#f8fafc" rx="16"/>
  <text x="230" y="28" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#1e293b">ក្រាបបង្គោល៖ លទ្ធផលពិន្ទុតេស្តសិស្ស (Student Grade Distribution)</text>
  <!-- Axes -->
  <line x1="60" y1="45" x2="60" y2="175" stroke="#475569" stroke-width="2.5"/>
  <line x1="60" y1="175" x2="420" y2="175" stroke="#475569" stroke-width="2.5"/>
  <!-- Y Ticks -->
  <text x="45" y="180" font-family="sans-serif" font-size="12" fill="#64748b">0</text>
  <text x="40" y="135" font-family="sans-serif" font-size="12" fill="#64748b">10</text>
  <text x="40" y="90" font-family="sans-serif" font-size="12" fill="#64748b">20</text>
  <text x="40" y="50" font-family="sans-serif" font-size="12" fill="#64748b">30</text>
  <!-- Bars -->
  <!-- Grade A: 12 students (height = 54) -->
  <rect x="90" y="121" width="45" height="54" fill="#3b82f6" rx="4"/>
  <text x="112" y="113" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1d4ed8" text-anchor="middle">12</text>
  <text x="112" y="195" font-family="sans-serif" font-size="14" font-weight="bold" fill="#334155" text-anchor="middle">និទ្ទេស A</text>
  <!-- Grade B: 24 students (height = 108) -->
  <rect x="165" y="67" width="45" height="108" fill="#10b981" rx="4"/>
  <text x="187" y="59" font-family="sans-serif" font-size="13" font-weight="bold" fill="#047857" text-anchor="middle">24</text>
  <text x="187" y="195" font-family="sans-serif" font-size="14" font-weight="bold" fill="#334155" text-anchor="middle">និទ្ទេស B</text>
  <!-- Grade C: 18 students (height = 81) -->
  <rect x="240" y="94" width="45" height="81" fill="#f59e0b" rx="4"/>
  <text x="262" y="86" font-family="sans-serif" font-size="13" font-weight="bold" fill="#b45309" text-anchor="middle">18</text>
  <text x="262" y="195" font-family="sans-serif" font-size="14" font-weight="bold" fill="#334155" text-anchor="middle">និទ្ទេស C</text>
  <!-- Grade D: 6 students (height = 27) -->
  <rect x="315" y="148" width="45" height="27" fill="#ef4444" rx="4"/>
  <text x="337" y="140" font-family="sans-serif" font-size="13" font-weight="bold" fill="#b91c1c" text-anchor="middle">6</text>
  <text x="337" y="195" font-family="sans-serif" font-size="14" font-weight="bold" fill="#334155" text-anchor="middle">និទ្ទេស D</text>
  <text x="230" y="222" font-family="sans-serif" font-size="13" font-weight="semibold" text-anchor="middle" fill="#334155">ចំនួនសិស្សសរុប = 12 + 24 + 18 + 6 = 60 នាក់</text>
</svg>
`);

// 11. 4-Color Probability Spinner (Lesson 12)
export const SVG_SPINNER = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 250" width="100%" height="100%">
  <rect width="380" height="250" fill="#f8fafc" rx="16"/>
  <text x="190" y="28" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#1e293b">កង់វិលប្រូបាប ៤ ពណ៌ស្មើគ្នា (4-Color Probability Spinner)</text>
  <g transform="translate(190, 125)">
    <!-- 4 Sectors (90 deg each) -->
    <!-- Top-Right: Red (0 to 90) -->
    <path d="M0,0 L75,0 A75,75 0 0,1 0,75 Z" fill="#ef4444"/>
    <text x="32" y="42" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff">ក្រហម</text>
    <!-- Bottom-Right: Blue (90 to 180) -->
    <path d="M0,0 L0,75 A75,75 0 0,1 -75,0 Z" fill="#3b82f6"/>
    <text x="-48" y="42" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff">ខៀវ</text>
    <!-- Bottom-Left: Green (180 to 270) -->
    <path d="M0,0 L-75,0 A75,75 0 0,1 0,-75 Z" fill="#10b981"/>
    <text x="-52" y="-30" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff">បៃតង</text>
    <!-- Top-Left: Yellow (270 to 360) -->
    <path d="M0,0 L0,-75 A75,75 0 0,1 75,0 Z" fill="#f59e0b"/>
    <text x="24" y="-30" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff">លឿង</text>
    <!-- Center needle pointing up -->
    <polygon points="0,-60 -8,5 8,5" fill="#1e293b"/>
    <circle cx="0" cy="0" r="7" fill="#0f172a"/>
  </g>
  <text x="190" y="230" font-family="sans-serif" font-size="13" font-weight="semibold" text-anchor="middle" fill="#334155">ប្រូបាបឈប់លើពណ៌នីមួយៗ: P = 1/4 = 25%</text>
</svg>
`);

// 12. Equation Balance Scale: 2x + 3 = 11 (Lesson 9)
export const SVG_EQUATION_BALANCE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 220" width="100%" height="100%">
  <rect width="440" height="220" fill="#f8fafc" rx="16"/>
  <text x="220" y="28" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#1e293b">ជញ្ជីងលំនឹងសមីការ (Equation Balance: 2x + 3 = 11)</text>
  <!-- Central Fulcrum & Base -->
  <polygon points="220,110 200,165 240,165" fill="#475569"/>
  <rect x="170" y="165" width="100" height="15" rx="4" fill="#334155"/>
  <!-- Horizontal Beam -->
  <line x1="80" y1="110" x2="360" y2="110" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/>
  <!-- Left Pan -->
  <line x1="80" y1="110" x2="50" y2="145" stroke="#64748b" stroke-width="2"/>
  <line x1="80" y1="110" x2="110" y2="145" stroke="#64748b" stroke-width="2"/>
  <path d="M40,145 Q80,160 120,145 Z" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
  <rect x="55" y="125" width="22" height="20" fill="#2563eb" rx="4"/>
  <text x="66" y="139" font-family="sans-serif" font-size="12" font-weight="bold" fill="#fff" text-anchor="middle">x</text>
  <rect x="80" y="125" width="22" height="20" fill="#2563eb" rx="4"/>
  <text x="91" y="139" font-family="sans-serif" font-size="12" font-weight="bold" fill="#fff" text-anchor="middle">x</text>
  <circle cx="106" cy="135" r="7" fill="#d97706"/>
  <text x="106" y="139" font-family="sans-serif" font-size="11" font-weight="bold" fill="#fff" text-anchor="middle">3</text>
  <!-- Right Pan -->
  <line x1="360" y1="110" x2="330" y2="145" stroke="#64748b" stroke-width="2"/>
  <line x1="360" y1="110" x2="390" y2="145" stroke="#64748b" stroke-width="2"/>
  <path d="M320,145 Q360,160 400,145 Z" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
  <circle cx="360" cy="133" r="13" fill="#059669"/>
  <text x="360" y="138" font-family="sans-serif" font-size="13" font-weight="extrabold" fill="#fff" text-anchor="middle">11</text>
  <!-- Bottom Status -->
  <text x="220" y="202" font-family="sans-serif" font-size="13" font-weight="semibold" text-anchor="middle" fill="#334155">2x + 3 = 11 ⟹ 2x = 8 ⟹ x = 4</text>
</svg>
`);

// 13. Basic Geometry Concepts: Point, Line, Segment, Ray, Midpoint (Lesson 12)
export const SVG_BASIC_GEOMETRY = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 220" width="100%" height="100%">
  <rect width="540" height="220" fill="#f8fafc" rx="16"/>
  <text x="270" y="28" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#1e293b">សញ្ញាណដំបូងនៃរូបធរណីមាត្រ (Points, Lines, Rays, Segments)</text>
  
  <!-- Straight Line (d) -->
  <g transform="translate(40, 50)">
    <line x1="10" y1="20" x2="210" y2="20" stroke="#2563eb" stroke-width="2.5"/>
    <polygon points="215,20 205,16 205,24" fill="#2563eb"/>
    <polygon points="5,20 15,16 15,24" fill="#2563eb"/>
    <text x="110" y="42" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1d4ed8" text-anchor="middle">បន្ទាត់ត្រង់ (d)</text>
  </g>

  <!-- Line Segment [AB] with Midpoint M -->
  <g transform="translate(280, 50)">
    <line x1="20" y1="20" x2="200" y2="20" stroke="#059669" stroke-width="3"/>
    <circle cx="20" cy="20" r="4.5" fill="#047857"/>
    <text x="20" y="12" font-family="sans-serif" font-size="13" font-weight="bold" fill="#047857" text-anchor="middle">A</text>
    <circle cx="110" cy="20" r="4.5" fill="#dc2626"/>
    <text x="110" y="12" font-family="sans-serif" font-size="13" font-weight="bold" fill="#dc2626" text-anchor="middle">M</text>
    <circle cx="200" cy="20" r="4.5" fill="#047857"/>
    <text x="200" y="12" font-family="sans-serif" font-size="13" font-weight="bold" fill="#047857" text-anchor="middle">B</text>
    <text x="110" y="42" font-family="sans-serif" font-size="13" font-weight="bold" fill="#065f46" text-anchor="middle">អង្កត់ [AB] និងចំណុចកណ្តាល M (AM = MB)</text>
  </g>

  <!-- Ray [Ox) -->
  <g transform="translate(40, 120)">
    <line x1="20" y1="30" x2="200" y2="30" stroke="#d97706" stroke-width="2.5"/>
    <circle cx="20" cy="30" r="4.5" fill="#b45309"/>
    <text x="20" y="20" font-family="sans-serif" font-size="13" font-weight="bold" fill="#b45309" text-anchor="middle">O</text>
    <polygon points="205,30 195,26 195,34" fill="#d97706"/>
    <text x="210" y="34" font-family="sans-serif" font-size="13" font-weight="bold" fill="#b45309">x</text>
    <text x="110" y="55" font-family="sans-serif" font-size="13" font-weight="bold" fill="#92400e" text-anchor="middle">កន្លះបន្ទាត់ [Ox)</text>
  </g>

  <!-- Intersecting Lines & Vertical Angles -->
  <g transform="translate(280, 120)">
    <line x1="30" y1="10" x2="190" y2="50" stroke="#7c3aed" stroke-width="2"/>
    <line x1="30" y1="50" x2="190" y2="10" stroke="#7c3aed" stroke-width="2"/>
    <circle cx="110" cy="30" r="4" fill="#6d28d9"/>
    <text x="110" y="22" font-family="sans-serif" font-size="12" font-weight="bold" fill="#6d28d9" text-anchor="middle">O</text>
    <text x="110" y="65" font-family="sans-serif" font-size="12" font-weight="bold" fill="#5b21b6" text-anchor="middle">មុំទល់កំពូលស្មើគ្នា (Vertically Opposite)</text>
  </g>
</svg>
`);

// 14. Angles: Acute, Right, Obtuse, Supplementary (Lesson 13)
export const SVG_ANGLES = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 230" width="100%" height="100%">
  <rect width="520" height="230" fill="#f8fafc" rx="16"/>
  <text x="260" y="28" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#1e293b">ប្រភេទមុំ និងលក្ខណៈមុំ (Types of Angles &amp; Properties)</text>

  <!-- Acute Angle (45 deg) -->
  <g transform="translate(20, 60)">
    <line x1="10" y1="80" x2="90" y2="80" stroke="#2563eb" stroke-width="2.5"/>
    <line x1="10" y1="80" x2="65" y2="25" stroke="#2563eb" stroke-width="2.5"/>
    <path d="M40,80 A30,30 0 0,0 32,58" fill="none" stroke="#dc2626" stroke-width="2"/>
    <text x="50" y="70" font-family="sans-serif" font-size="12" font-weight="bold" fill="#dc2626">45°</text>
    <text x="50" y="105" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1d4ed8" text-anchor="middle">មុំស្រួច (&lt;90°)</text>
  </g>

  <!-- Right Angle (90 deg) -->
  <g transform="translate(145, 60)">
    <line x1="15" y1="80" x2="95" y2="80" stroke="#059669" stroke-width="2.5"/>
    <line x1="15" y1="80" x2="15" y2="10" stroke="#059669" stroke-width="2.5"/>
    <rect x="15" y="65" width="15" height="15" fill="none" stroke="#047857" stroke-width="2"/>
    <text x="40" y="55" font-family="sans-serif" font-size="12" font-weight="bold" fill="#047857">90°</text>
    <text x="55" y="105" font-family="sans-serif" font-size="12" font-weight="bold" fill="#065f46" text-anchor="middle">មុំកែង (=90°)</text>
  </g>

  <!-- Obtuse Angle (135 deg) -->
  <g transform="translate(265, 60)">
    <line x1="55" y1="80" x2="115" y2="80" stroke="#d97706" stroke-width="2.5"/>
    <line x1="55" y1="80" x2="15" y2="35" stroke="#d97706" stroke-width="2.5"/>
    <path d="M85,80 A30,30 0 0,0 27,50" fill="none" stroke="#b45309" stroke-width="2"/>
    <text x="65" y="60" font-family="sans-serif" font-size="12" font-weight="bold" fill="#b45309">135°</text>
    <text x="65" y="105" font-family="sans-serif" font-size="12" font-weight="bold" fill="#92400e" text-anchor="middle">មុំទាល (&gt;90°)</text>
  </g>

  <!-- Supplementary Angles (180 deg) -->
  <g transform="translate(390, 60)">
    <line x1="10" y1="80" x2="120" y2="80" stroke="#7c3aed" stroke-width="2.5"/>
    <line x1="65" y1="80" x2="100" y2="25" stroke="#7c3aed" stroke-width="2.5"/>
    <path d="M90,80 A25,25 0 0,0 80,55" fill="none" stroke="#6d28d9" stroke-width="2"/>
    <path d="M50,55 A25,25 0 0,0 40,80" fill="none" stroke="#ec4899" stroke-width="2"/>
    <text x="65" y="105" font-family="sans-serif" font-size="12" font-weight="bold" fill="#5b21b6" text-anchor="middle">មុំបន្ថែម (∠1+∠2=180°)</text>
  </g>

  <text x="260" y="210" font-family="sans-serif" font-size="13" font-weight="semibold" text-anchor="middle" fill="#334155">មុំបំពេញគ្នាមានផលបូក 90° | មុំបន្ថែមគ្នាមានផលបូក 180° | មុំរាប = 180°</text>
</svg>
`);

// 15. Two-Dimensional Figures: Triangles & Quadrilaterals (Lesson 15)
export const SVG_2D_FIGURES = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 230" width="100%" height="100%">
  <rect width="520" height="230" fill="#f8fafc" rx="16"/>
  <text x="260" y="28" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#1e293b">រូបធរណីមាត្រមានវិមាត្រពីរ (2D Geometric Shapes)</text>

  <!-- Equilateral Triangle -->
  <g transform="translate(30, 50)">
    <polygon points="50,15 10,85 90,85" fill="#dbeafe" stroke="#2563eb" stroke-width="2.5"/>
    <text x="50" y="105" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1d4ed8" text-anchor="middle">ត្រីកោណសម័ង្ស</text>
    <text x="50" y="122" font-family="sans-serif" font-size="11" fill="#475569" text-anchor="middle">មុំនីមួយៗ = 60°</text>
  </g>

  <!-- Right Triangle -->
  <g transform="translate(150, 50)">
    <polygon points="15,15 15,85 85,85" fill="#d1fae5" stroke="#059669" stroke-width="2.5"/>
    <rect x="15" y="73" width="12" height="12" fill="none" stroke="#047857" stroke-width="1.8"/>
    <text x="50" y="105" font-family="sans-serif" font-size="12" font-weight="bold" fill="#047857" text-anchor="middle">ត្រីកោណកែង</text>
    <text x="50" y="122" font-family="sans-serif" font-size="11" fill="#475569" text-anchor="middle">a² + b² = c²</text>
  </g>

  <!-- Rectangle -->
  <g transform="translate(265, 50)">
    <rect x="10" y="25" width="90" height="60" fill="#fef3c7" stroke="#d97706" stroke-width="2.5" rx="4"/>
    <text x="55" y="105" font-family="sans-serif" font-size="12" font-weight="bold" fill="#b45309" text-anchor="middle">ចតុកោណកែង</text>
    <text x="55" y="122" font-family="sans-serif" font-size="11" fill="#475569" text-anchor="middle">មុំកែងទាំង៤, S=LxW</text>
  </g>

  <!-- Parallelogram -->
  <g transform="translate(385, 50)">
    <polygon points="25,25 105,25 85,85 5,85" fill="#fce7f3" stroke="#db2777" stroke-width="2.5"/>
    <text x="55" y="105" font-family="sans-serif" font-size="12" font-weight="bold" fill="#be185d" text-anchor="middle">ប្រលេឡូក្រាម</text>
    <text x="55" y="122" font-family="sans-serif" font-size="11" fill="#475569" text-anchor="middle">ជ្រុងឈមស្របនិងស្មើគ្នា</text>
  </g>

  <text x="260" y="205" font-family="sans-serif" font-size="13" font-weight="semibold" text-anchor="middle" fill="#334155">ផលបូកមុំក្នុងត្រីកោណ = 180° | ផលបូកមុំក្នុងចតុកោណ = 360°</text>
</svg>
`);

// 16. Perimeter & Area of Polygons (Lesson 16)
export const SVG_POLYGONS_PERIMETER_AREA = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 230" width="100%" height="100%">
  <rect width="500" height="230" fill="#f8fafc" rx="16"/>
  <text x="250" y="28" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#1e293b">រូបមន្តបរិមាត្រ និងផ្ទៃក្រឡាពហុកោណ (Perimeter &amp; Area)</text>

  <!-- Triangle: base b, height h -->
  <g transform="translate(35, 50)">
    <polygon points="50,15 10,85 100,85" fill="#e0e7ff" stroke="#4338ca" stroke-width="2.5"/>
    <line x1="50" y1="15" x2="50" y2="85" stroke="#dc2626" stroke-width="2" stroke-dasharray="4"/>
    <text x="58" y="55" font-family="sans-serif" font-size="12" font-weight="bold" fill="#dc2626">h</text>
    <text x="55" y="102" font-family="sans-serif" font-size="12" font-weight="bold" fill="#312e81" text-anchor="middle">បាត b</text>
    <text x="55" y="125" font-family="sans-serif" font-size="12" font-weight="extrabold" fill="#4338ca" text-anchor="middle">S = (b × h) / 2</text>
  </g>

  <!-- Trapezoid: top a, bottom b, height h -->
  <g transform="translate(180, 50)">
    <polygon points="35,25 95,25 120,85 10,85" fill="#fef9c3" stroke="#ca8a04" stroke-width="2.5"/>
    <line x1="35" y1="25" x2="35" y2="85" stroke="#dc2626" stroke-width="2" stroke-dasharray="4"/>
    <text x="42" y="58" font-family="sans-serif" font-size="12" font-weight="bold" fill="#dc2626">h</text>
    <text x="65" y="18" font-family="sans-serif" font-size="12" font-weight="bold" fill="#854d0e" text-anchor="middle">បាតតូច a</text>
    <text x="65" y="102" font-family="sans-serif" font-size="12" font-weight="bold" fill="#854d0e" text-anchor="middle">បាតធំ b</text>
    <text x="65" y="125" font-family="sans-serif" font-size="12" font-weight="extrabold" fill="#a16207" text-anchor="middle">S = ((a + b) × h) / 2</text>
  </g>

  <!-- Rhombus: diagonals d1, d2 -->
  <g transform="translate(345, 50)">
    <polygon points="60,15 110,50 60,85 10,50" fill="#ccfbf1" stroke="#0d9488" stroke-width="2.5"/>
    <line x1="10" y1="50" x2="110" y2="50" stroke="#0f766e" stroke-width="1.8" stroke-dasharray="3"/>
    <line x1="60" y1="15" x2="60" y2="85" stroke="#0f766e" stroke-width="1.8" stroke-dasharray="3"/>
    <text x="60" y="102" font-family="sans-serif" font-size="12" font-weight="bold" fill="#115e59" text-anchor="middle">ចតុកោណស្មើ (Rhombus)</text>
    <text x="60" y="125" font-family="sans-serif" font-size="12" font-weight="extrabold" fill="#0f766e" text-anchor="middle">S = (d₁ × d₂) / 2</text>
  </g>

  <text x="250" y="205" font-family="sans-serif" font-size="13" font-weight="semibold" text-anchor="middle" fill="#334155">បរិមាត្រ P = ផលបូកប្រវែងជ្រុងទាំងអស់ជុំវិញពហុកោណ</text>
</svg>
`);

// 17. Pie Chart: Student Preferences (Lesson 22)
export const SVG_PIE_CHART = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 240" width="100%" height="100%">
  <rect width="480" height="240" fill="#f8fafc" rx="16"/>
  <text x="240" y="28" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#1e293b">ក្រាបផ្លិត៖ ចំណូលចិត្តមុខវិជ្ជាសិស្ស (Pie Chart: 360° = 100%)</text>

  <!-- Pie Circle center (150, 130), radius 75 -->
  <g transform="translate(150, 130)">
    <!-- Math: 40% (144 deg: 0 to 144) -->
    <path d="M0,0 L75,0 A75,75 0 0,1 -60.67,44.08 Z" fill="#3b82f6"/>
    <!-- Khmer Literature: 30% (108 deg: 144 to 252) -->
    <path d="M0,0 L-60.67,44.08 A75,75 0 0,1 -23.18,-71.34 Z" fill="#10b981"/>
    <!-- Science: 20% (72 deg: 252 to 324) -->
    <path d="M0,0 L-23.18,-71.34 A75,75 0 0,1 60.67,-44.08 Z" fill="#f59e0b"/>
    <!-- English: 10% (36 deg: 324 to 360) -->
    <path d="M0,0 L60.67,-44.08 A75,75 0 0,1 75,0 Z" fill="#ec4899"/>
    <!-- Center Point -->
    <circle cx="0" cy="0" r="4" fill="#ffffff"/>
  </g>

  <!-- Legend -->
  <g transform="translate(265, 65)">
    <rect x="0" y="0" width="18" height="18" rx="4" fill="#3b82f6"/>
    <text x="28" y="14" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e40af">គណិតវិទ្យា: 40% (144°)</text>

    <rect x="0" y="32" width="18" height="18" rx="4" fill="#10b981"/>
    <text x="28" y="46" font-family="sans-serif" font-size="13" font-weight="bold" fill="#065f46">ភាសាខ្មែរ: 30% (108°)</text>

    <rect x="0" y="64" width="18" height="18" rx="4" fill="#f59e0b"/>
    <text x="28" y="78" font-family="sans-serif" font-size="13" font-weight="bold" fill="#92400e">វិទ្យាសាស្ត្រ: 20% (72°)</text>

    <rect x="0" y="96" width="18" height="18" rx="4" fill="#ec4899"/>
    <text x="28" y="110" font-family="sans-serif" font-size="13" font-weight="bold" fill="#9d174d">ភាសាអង់គ្លេស: 10% (36°)</text>
  </g>

  <text x="240" y="222" font-family="sans-serif" font-size="13" font-weight="semibold" text-anchor="middle" fill="#334155">មុំផ្លិត = (ភាគរយ ÷ 100) × 360° (ឧ. 40% × 360° = 144°)</text>
</svg>
`);

// 18. Fractions Visual Pizza/Circle: 3/4 & 1/2 (Lesson 4)
export const SVG_FRACTIONS_VISUAL = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 210" width="100%" height="100%">
  <rect width="460" height="210" fill="#f8fafc" rx="16"/>
  <text x="230" y="28" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#1e293b">សញ្ញាណប្រភាគ និងប្រភាគស្មើគ្នា (Fraction Models)</text>

  <!-- Circle 1: 3/4 -->
  <g transform="translate(130, 110)">
    <circle cx="0" cy="0" r="55" fill="#e2e8f0"/>
    <path d="M0,0 L55,0 A55,55 0 0,1 0,55 Z" fill="#3b82f6"/>
    <path d="M0,0 L0,55 A55,55 0 0,1 -55,0 Z" fill="#3b82f6"/>
    <path d="M0,0 L-55,0 A55,55 0 0,1 0,-55 Z" fill="#3b82f6"/>
    <line x1="-55" y1="0" x2="55" y2="0" stroke="#ffffff" stroke-width="2"/>
    <line x1="0" y1="-55" x2="0" y2="55" stroke="#ffffff" stroke-width="2"/>
    <circle cx="0" cy="0" r="55" fill="none" stroke="#2563eb" stroke-width="2.5"/>
    <text x="0" y="80" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1d4ed8" text-anchor="middle">3/4 = 75%</text>
  </g>

  <!-- Circle 2: 2/4 = 1/2 -->
  <g transform="translate(330, 110)">
    <circle cx="0" cy="0" r="55" fill="#e2e8f0"/>
    <path d="M0,0 L55,0 A55,55 0 0,1 0,55 Z" fill="#10b981"/>
    <path d="M0,0 L0,55 A55,55 0 0,1 -55,0 Z" fill="#10b981"/>
    <line x1="-55" y1="0" x2="55" y2="0" stroke="#ffffff" stroke-width="2"/>
    <line x1="0" y1="-55" x2="0" y2="55" stroke="#ffffff" stroke-width="2"/>
    <circle cx="0" cy="0" r="55" fill="none" stroke="#059669" stroke-width="2.5"/>
    <text x="0" y="80" font-family="sans-serif" font-size="14" font-weight="bold" fill="#047857" text-anchor="middle">2/4 = 1/2 = 50%</text>
  </g>

  <text x="230" y="198" font-family="sans-serif" font-size="13" font-weight="semibold" text-anchor="middle" fill="#334155">ប្រភាគស្មើគ្នា: 2/4 = 1/2 | សម្រួលដោយចែកភាគយកនិងភាគបែងនឹង 2</text>
</svg>
`);

// 19. Inequalities on Number Line: x > 2 & x <= -1 (Lesson 10)
export const SVG_INEQUALITIES = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 200" width="100%" height="100%">
  <rect width="500" height="200" fill="#f8fafc" rx="16"/>
  <text x="250" y="28" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#1e293b">ការតាងវិសមភាពលើបន្ទាត់ចំនួន (Inequalities on Number Line)</text>

  <!-- Number line 1: x > 2 -->
  <g transform="translate(50, 70)">
    <line x1="0" y1="20" x2="400" y2="20" stroke="#94a3b8" stroke-width="2"/>
    <!-- Ticks: -2, -1, 0, 1, 2, 3, 4 (step 50px, center 0 at 150) -->
    <line x1="50" y1="15" x2="50" y2="25" stroke="#64748b" stroke-width="1.5"/><text x="50" y="40" font-size="11" fill="#64748b" text-anchor="middle">-2</text>
    <line x1="150" y1="15" x2="150" y2="25" stroke="#64748b" stroke-width="1.5"/><text x="150" y="40" font-size="11" fill="#64748b" text-anchor="middle">0</text>
    <line x1="250" y1="15" x2="250" y2="25" stroke="#64748b" stroke-width="1.5"/><text x="250" y="40" font-size="11" fill="#64748b" text-anchor="middle">2</text>
    <!-- Ray for x > 2 -->
    <line x1="250" y1="20" x2="390" y2="20" stroke="#2563eb" stroke-width="4.5"/>
    <polygon points="395,20 385,16 385,24" fill="#2563eb"/>
    <!-- Hollow circle at 2 (strict inequality >) -->
    <circle cx="250" cy="20" r="5" fill="#ffffff" stroke="#2563eb" stroke-width="2.5"/>
    <text x="320" y="10" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1d4ed8">x &gt; 2 (រង្វង់ប្រហោង)</text>
  </g>

  <!-- Number line 2: x <= -1 -->
  <g transform="translate(50, 130)">
    <line x1="0" y1="20" x2="400" y2="20" stroke="#94a3b8" stroke-width="2"/>
    <line x1="100" y1="15" x2="100" y2="25" stroke="#64748b" stroke-width="1.5"/><text x="100" y="40" font-size="11" fill="#64748b" text-anchor="middle">-1</text>
    <line x1="150" y1="15" x2="150" y2="25" stroke="#64748b" stroke-width="1.5"/><text x="150" y="40" font-size="11" fill="#64748b" text-anchor="middle">0</text>
    <!-- Ray for x <= -1 -->
    <line x1="100" y1="20" x2="10" y2="20" stroke="#dc2626" stroke-width="4.5"/>
    <polygon points="5,20 15,16 15,24" fill="#dc2626"/>
    <!-- Solid circle at -1 (<=) -->
    <circle cx="100" cy="20" r="5.5" fill="#dc2626"/>
    <text x="30" y="10" font-family="sans-serif" font-size="13" font-weight="bold" fill="#b91c1c">x ≤ -1 (ចំណុចខ្មៅ)</text>
  </g>
</svg>
`);

