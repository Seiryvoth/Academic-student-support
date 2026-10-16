// SVG Visual Diagrams for Grade 9 Mathematics
// Clean, responsive, self-contained SVG Data URIs for geometric theorems, coordinate graphs, circles, statistics, and solids

export function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// 1. Irrational Numbers (Lesson 1)
export const SVG_IRRATIONAL_NUMBERS = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 220" width="100%" height="100%">
  <rect width="600" height="220" fill="#f8fafc" rx="16"/>
  <text x="300" y="26" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ចំនួនអសនិទានលើបន្ទាត់ចំនួន (Irrational Numbers on Number Line)</text>
  
  <!-- Right triangle constructing √2 -->
  <g transform="translate(180, 45)">
    <polygon points="0,70 70,70 70,0" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
    <line x1="0" y1="70" x2="70" y2="0" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="4,3"/>
    <text x="35" y="85" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e40af" text-anchor="middle">1</text>
    <text x="82" y="38" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e40af">1</text>
    <text x="25" y="30" font-family="sans-serif" font-size="12" font-weight="bold" fill="#dc2626">√2</text>
    <!-- Right angle mark -->
    <rect x="58" y="58" width="12" height="12" fill="none" stroke="#2563eb" stroke-width="1.5"/>
  </g>

  <!-- Number Line -->
  <line x1="40" y1="160" x2="560" y2="160" stroke="#334155" stroke-width="3" stroke-linecap="round"/>
  <polygon points="560,160 545,153 545,167" fill="#334155"/>
  <polygon points="40,160 55,153 55,167" fill="#334155"/>

  <!-- Ticks: 0, 1, √2, √3, 2, e, 3, π -->
  <!-- 0 -->
  <line x1="180" y1="150" x2="180" y2="170" stroke="#334155" stroke-width="2.5"/>
  <text x="180" y="190" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="#334155">0</text>
  <!-- 1 -->
  <line x1="250" y1="150" x2="250" y2="170" stroke="#334155" stroke-width="2.5"/>
  <text x="250" y="190" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="#334155">1</text>
  <!-- √2 ≈ 1.414 -->
  <circle cx="279" cy="160" r="5" fill="#dc2626"/>
  <text x="279" y="145" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#dc2626">√2 ≈ 1.414</text>
  <!-- √3 ≈ 1.732 -->
  <circle cx="301" cy="160" r="5" fill="#ea580c"/>
  <text x="301" y="125" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#ea580c">√3 ≈ 1.732</text>
  <!-- 2 -->
  <line x1="320" y1="150" x2="320" y2="170" stroke="#334155" stroke-width="2.5"/>
  <text x="320" y="190" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="#334155">2</text>
  <!-- 3 -->
  <line x1="390" y1="150" x2="390" y2="170" stroke="#334155" stroke-width="2.5"/>
  <text x="390" y="190" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="#334155">3</text>
  <!-- π ≈ 3.1416 -->
  <circle cx="400" cy="160" r="5" fill="#7c3aed"/>
  <text x="405" y="145" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#7c3aed">π ≈ 3.1416</text>
</svg>
`);

// 2. Proportions & Direct Variation (Lesson 2)
export const SVG_PROPORTIONS = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 210" width="100%" height="100%">
  <rect width="540" height="210" fill="#f8fafc" rx="16"/>
  <text x="270" y="26" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">សមាមាត្រផ្ទាល់ និងផលគុណខ្វែង (Proportions &amp; Cross Multiplication)</text>
  
  <!-- Graph on left -->
  <g transform="translate(60, 45)">
    <line x1="0" y1="120" x2="160" y2="120" stroke="#475569" stroke-width="2"/>
    <line x1="20" y1="130" x2="20" y2="10" stroke="#475569" stroke-width="2"/>
    <text x="165" y="125" font-family="sans-serif" font-size="11" fill="#475569">x</text>
    <text x="20" y="5" font-family="sans-serif" font-size="11" fill="#475569">y</text>
    <!-- Direct line y = kx -->
    <line x1="20" y1="120" x2="140" y2="20" stroke="#2563eb" stroke-width="3"/>
    <circle cx="60" cy="86.7" r="4" fill="#2563eb"/>
    <circle cx="100" cy="53.3" r="4" fill="#2563eb"/>
    <text x="80" y="25" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2563eb">y = k · x</text>
  </g>

  <!-- Cross-Multiplication Formula Box on right -->
  <g transform="translate(260, 50)">
    <rect width="240" height="120" rx="12" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
    <text x="120" y="32" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e40af" text-anchor="middle">រូបមន្តសមាមាត្រ (Proportion)</text>
    <text x="120" y="65" font-family="sans-serif" font-size="18" font-weight="bold" fill="#2563eb" text-anchor="middle">a / b = c / d</text>
    <line x1="40" y1="78" x2="200" y2="78" stroke="#bfdbfe" stroke-width="1.5"/>
    <text x="120" y="102" font-family="sans-serif" font-size="15" font-weight="bold" fill="#059669" text-anchor="middle">a · d = b · c</text>
  </g>
</svg>
`);

// 3. Algebraic Expressions & Identities (Lesson 3)
export const SVG_ALGEBRAIC_EXP = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 210" width="100%" height="100%">
  <rect width="540" height="210" fill="#f8fafc" rx="16"/>
  <text x="270" y="26" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">គំរូធរណីមាត្រនៃស្មើភាព (a + b)² = a² + 2ab + b²</text>
  
  <!-- Geometric Area Model -->
  <g transform="translate(70, 50)">
    <!-- a x a -->
    <rect x="0" y="0" width="80" height="80" fill="#3b82f6" fill-opacity="0.8" stroke="#1d4ed8" stroke-width="2"/>
    <text x="40" y="46" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">a²</text>
    
    <!-- a x b -->
    <rect x="80" y="0" width="40" height="80" fill="#10b981" fill-opacity="0.8" stroke="#047857" stroke-width="2"/>
    <text x="100" y="46" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">a·b</text>
    
    <!-- b x a -->
    <rect x="0" y="80" width="80" height="40" fill="#10b981" fill-opacity="0.8" stroke="#047857" stroke-width="2"/>
    <text x="40" y="105" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">a·b</text>
    
    <!-- b x b -->
    <rect x="80" y="80" width="40" height="40" fill="#f59e0b" fill-opacity="0.8" stroke="#b45309" stroke-width="2"/>
    <text x="100" y="105" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">b²</text>
    
    <!-- Side labels -->
    <text x="40" y="-8" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e293b" text-anchor="middle">a</text>
    <text x="100" y="-8" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e293b" text-anchor="middle">b</text>
    <text x="-12" y="45" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e293b">a</text>
    <text x="-12" y="105" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e293b">b</text>
  </g>

  <!-- Formula Callout -->
  <g transform="translate(240, 55)">
    <rect width="250" height="110" rx="12" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
    <text x="125" y="32" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e40af" text-anchor="middle">រូបមន្តស្មើភាពគួរចងចាំ</text>
    <text x="125" y="62" font-family="sans-serif" font-size="14" font-weight="bold" fill="#2563eb" text-anchor="middle">(a + b)² = a² + 2ab + b²</text>
    <line x1="25" y1="75" x2="225" y2="75" stroke="#bfdbfe" stroke-width="1.5"/>
    <text x="125" y="96" font-family="sans-serif" font-size="14" font-weight="bold" fill="#047857" text-anchor="middle">a² - b² = (a - b)(a + b)</text>
  </g>
</svg>
`);

// 4. First-Degree Linear Equations (Lesson 4)
export const SVG_LINEAR_EQUATION = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 200" width="100%" height="100%">
  <rect width="540" height="200" fill="#f8fafc" rx="16"/>
  <text x="270" y="26" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">លំនឹងសមីការដឺក្រេទី ១ (Linear Equation Balance: 2x + 4 = 10)</text>
  
  <!-- Balance Fulcrum -->
  <polygon points="270,140 250,175 290,175" fill="#475569"/>
  <!-- Balance Beam -->
  <line x1="100" y1="140" x2="440" y2="140" stroke="#1e293b" stroke-width="6" stroke-linecap="round"/>
  
  <!-- Left Pan -->
  <line x1="140" y1="140" x2="140" y2="165" stroke="#64748b" stroke-width="2"/>
  <rect x="90" y="165" width="100" height="8" rx="3" fill="#64748b"/>
  <!-- Left Weights: 2x + 4 -->
  <rect x="98" y="130" width="30" height="32" rx="4" fill="#3b82f6"/>
  <text x="113" y="151" font-family="sans-serif" font-size="12" font-weight="bold" fill="#fff" text-anchor="middle">x</text>
  <rect x="132" y="130" width="30" height="32" rx="4" fill="#3b82f6"/>
  <text x="147" y="151" font-family="sans-serif" font-size="12" font-weight="bold" fill="#fff" text-anchor="middle">x</text>
  <circle cx="175" cy="146" r="12" fill="#10b981"/>
  <text x="175" y="151" font-family="sans-serif" font-size="11" font-weight="bold" fill="#fff" text-anchor="middle">+4</text>

  <!-- Right Pan -->
  <line x1="400" y1="140" x2="400" y2="165" stroke="#64748b" stroke-width="2"/>
  <rect x="350" y="165" width="100" height="8" rx="3" fill="#64748b"/>
  <!-- Right Weight: 10 -->
  <circle cx="400" cy="144" r="18" fill="#f59e0b"/>
  <text x="400" y="149" font-family="sans-serif" font-size="13" font-weight="bold" fill="#fff" text-anchor="middle">10</text>

  <!-- Solution steps box -->
  <rect x="180" y="45" width="180" height="50" rx="8" fill="#eff6ff" stroke="#93c5fd" stroke-width="1.5"/>
  <text x="270" y="65" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e40af" text-anchor="middle">2x = 10 - 4 = 6</text>
  <text x="270" y="85" font-family="sans-serif" font-size="14" font-weight="bold" fill="#16a34a" text-anchor="middle">x = 6 / 2 = 3</text>
</svg>
`);

// 5. First-Degree Linear Inequalities (Lesson 5)
export const SVG_LINEAR_INEQUALITY = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 190" width="100%" height="100%">
  <rect width="560" height="190" fill="#f8fafc" rx="16"/>
  <text x="280" y="26" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ដំណោះស្រាយវិសមីការលើបន្ទាត់ចំនួន (Linear Inequality: 2x - 1 ≥ 5  ⇔  x ≥ 3)</text>
  
  <!-- Number line -->
  <line x1="40" y1="110" x2="520" y2="110" stroke="#334155" stroke-width="3" stroke-linecap="round"/>
  <polygon points="520,110 505,103 505,117" fill="#334155"/>
  <polygon points="40,110 55,103 55,117" fill="#334155"/>

  <!-- Ticks: 0, 1, 2, 3, 4, 5 -->
  <!-- 0 -->
  <line x1="120" y1="102" x2="120" y2="118" stroke="#64748b" stroke-width="2"/>
  <text x="120" y="138" font-family="sans-serif" font-size="13" font-weight="bold" fill="#475569" text-anchor="middle">0</text>
  <!-- 1 -->
  <line x1="180" y1="102" x2="180" y2="118" stroke="#64748b" stroke-width="2"/>
  <text x="180" y="138" font-family="sans-serif" font-size="13" font-weight="bold" fill="#475569" text-anchor="middle">1</text>
  <!-- 2 -->
  <line x1="240" y1="102" x2="240" y2="118" stroke="#64748b" stroke-width="2"/>
  <text x="240" y="138" font-family="sans-serif" font-size="13" font-weight="bold" fill="#475569" text-anchor="middle">2</text>
  <!-- 3 (Closed circle at x = 3) -->
  <line x1="300" y1="102" x2="300" y2="118" stroke="#64748b" stroke-width="2"/>
  <text x="300" y="138" font-family="sans-serif" font-size="14" font-weight="bold" fill="#dc2626" text-anchor="middle">3</text>
  <!-- 4 -->
  <line x1="360" y1="102" x2="360" y2="118" stroke="#64748b" stroke-width="2"/>
  <text x="360" y="138" font-family="sans-serif" font-size="13" font-weight="bold" fill="#475569" text-anchor="middle">4</text>
  <!-- 5 -->
  <line x1="420" y1="102" x2="420" y2="118" stroke="#64748b" stroke-width="2"/>
  <text x="420" y="138" font-family="sans-serif" font-size="13" font-weight="bold" fill="#475569" text-anchor="middle">5</text>

  <!-- Shaded Solution Ray x ≥ 3 -->
  <line x1="300" y1="110" x2="510" y2="110" stroke="#dc2626" stroke-width="7" stroke-linecap="round"/>
  <!-- Closed dot at 3 -->
  <circle cx="300" cy="110" r="7" fill="#dc2626" stroke="#ffffff" stroke-width="2"/>
  
  <text x="400" y="80" font-family="sans-serif" font-size="13" font-weight="bold" fill="#dc2626" text-anchor="middle">ចន្លោះ [3, +∞)</text>
</svg>
`);

// 6. Frequency Distribution Histogram (Lesson 6)
export const SVG_FREQUENCY_DISTRIBUTION = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 220" width="100%" height="100%">
  <rect width="540" height="220" fill="#f8fafc" rx="16"/>
  <text x="270" y="26" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">អ៊ីស្តូក្រាមបំណែងចែកប្រេកង់ (Frequency Distribution Histogram)</text>
  
  <!-- Y Axis -->
  <line x1="80" y1="170" x2="80" y2="45" stroke="#334155" stroke-width="2"/>
  <!-- X Axis -->
  <line x1="80" y1="170" x2="480" y2="170" stroke="#334155" stroke-width="2"/>
  
  <!-- Y-Axis labels (Frequency f) -->
  <text x="65" y="174" font-family="sans-serif" font-size="11" fill="#475569" text-anchor="end">0</text>
  <text x="65" y="140" font-family="sans-serif" font-size="11" fill="#475569" text-anchor="end">5</text>
  <text x="65" y="105" font-family="sans-serif" font-size="11" fill="#475569" text-anchor="end">10</text>
  <text x="65" y="70" font-family="sans-serif" font-size="11" fill="#475569" text-anchor="end">15</text>
  <text x="65" y="45" font-family="sans-serif" font-size="11" font-weight="bold" fill="#2563eb" text-anchor="end">f</text>

  <!-- Bars (Continuous Class Intervals): [10-20, 20-30, 30-40, 40-50, 50-60] -->
  <!-- 10-20: f = 6 -->
  <rect x="100" y="128" width="60" height="42" fill="#3b82f6" fill-opacity="0.85" stroke="#1d4ed8" stroke-width="1.5"/>
  <text x="130" y="120" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1d4ed8" text-anchor="middle">6</text>
  <!-- 20-30: f = 14 -->
  <rect x="160" y="72" width="60" height="98" fill="#3b82f6" fill-opacity="0.85" stroke="#1d4ed8" stroke-width="1.5"/>
  <text x="190" y="64" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1d4ed8" text-anchor="middle">14</text>
  <!-- 30-40: f = 11 -->
  <rect x="220" y="93" width="60" height="77" fill="#3b82f6" fill-opacity="0.85" stroke="#1d4ed8" stroke-width="1.5"/>
  <text x="250" y="85" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1d4ed8" text-anchor="middle">11</text>
  <!-- 40-50: f = 7 -->
  <rect x="280" y="121" width="60" height="49" fill="#3b82f6" fill-opacity="0.85" stroke="#1d4ed8" stroke-width="1.5"/>
  <text x="310" y="113" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1d4ed8" text-anchor="middle">7</text>
  <!-- 50-60: f = 2 -->
  <rect x="340" y="156" width="60" height="14" fill="#3b82f6" fill-opacity="0.85" stroke="#1d4ed8" stroke-width="1.5"/>
  <text x="370" y="150" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1d4ed8" text-anchor="middle">2</text>

  <!-- Class Interval Ticks on X Axis -->
  <text x="100" y="188" font-family="sans-serif" font-size="11" fill="#475569" text-anchor="middle">10</text>
  <text x="160" y="188" font-family="sans-serif" font-size="11" fill="#475569" text-anchor="middle">20</text>
  <text x="220" y="188" font-family="sans-serif" font-size="11" fill="#475569" text-anchor="middle">30</text>
  <text x="280" y="188" font-family="sans-serif" font-size="11" fill="#475569" text-anchor="middle">40</text>
  <text x="340" y="188" font-family="sans-serif" font-size="11" fill="#475569" text-anchor="middle">50</text>
  <text x="400" y="188" font-family="sans-serif" font-size="11" fill="#475569" text-anchor="middle">60</text>
  <text x="440" y="188" font-family="sans-serif" font-size="11" font-weight="bold" fill="#475569">ថ្នាក់ពិន្ទុ</text>
</svg>
`);

// 7. Statistical Mean & Central Tendency (Lesson 7)
export const SVG_STATISTICAL_MEAN = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 210" width="100%" height="100%">
  <rect width="540" height="210" fill="#f8fafc" rx="16"/>
  <text x="270" y="26" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ការគណនាមធ្យមស្ថិតិ (Arithmetic Mean: x̄ = Σ(f · x) / N)</text>
  
  <!-- Data representation balance beam -->
  <line x1="80" y1="130" x2="460" y2="130" stroke="#334155" stroke-width="4" stroke-linecap="round"/>
  
  <!-- Mean Center Fulcrum at x̄ = 14 -->
  <polygon points="270,130 255,165 285,165" fill="#dc2626"/>
  <text x="270" y="185" font-family="sans-serif" font-size="13" font-weight="bold" fill="#dc2626" text-anchor="middle">មធ្យមភាគ x̄ = 14</text>

  <!-- Data values on the scale -->
  <circle cx="130" cy="115" r="14" fill="#3b82f6"/>
  <text x="130" y="120" font-family="sans-serif" font-size="11" font-weight="bold" fill="#fff" text-anchor="middle">10</text>

  <circle cx="200" cy="115" r="14" fill="#3b82f6"/>
  <text x="200" y="120" font-family="sans-serif" font-size="11" font-weight="bold" fill="#fff" text-anchor="middle">12</text>

  <circle cx="340" cy="115" r="14" fill="#3b82f6"/>
  <text x="340" y="120" font-family="sans-serif" font-size="11" font-weight="bold" fill="#fff" text-anchor="middle">16</text>

  <circle cx="410" cy="115" r="14" fill="#3b82f6"/>
  <text x="410" y="120" font-family="sans-serif" font-size="11" font-weight="bold" fill="#fff" text-anchor="middle">18</text>

  <!-- Formula Card on top -->
  <rect x="150" y="42" width="240" height="42" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1.5"/>
  <text x="270" y="68" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e40af" text-anchor="middle">x̄ = (10 + 12 + 16 + 18) / 4 = 14</text>
</svg>
`);

// 8. Probability (Lesson 8)
export const SVG_PROBABILITY_G9 = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 210" width="100%" height="100%">
  <rect width="540" height="210" fill="#f8fafc" rx="16"/>
  <text x="270" y="26" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ប្រូបាប៊ីលីតេនៃព្រឹត្តិការណ៍ (Probability: P(A) = n(A) / n(S))</text>
  
  <!-- Marble Urn/Jar on Left -->
  <g transform="translate(90, 50)">
    <rect x="0" y="0" width="110" height="120" rx="14" fill="#f1f5f9" stroke="#64748b" stroke-width="3"/>
    <!-- Red marbles (3) -->
    <circle cx="30" cy="35" r="12" fill="#ef4444"/>
    <circle cx="65" cy="35" r="12" fill="#ef4444"/>
    <circle cx="45" cy="65" r="12" fill="#ef4444"/>
    <!-- Blue marbles (5) -->
    <circle cx="85" cy="65" r="12" fill="#3b82f6"/>
    <circle cx="25" cy="95" r="12" fill="#3b82f6"/>
    <circle cx="55" cy="95" r="12" fill="#3b82f6"/>
    <circle cx="85" cy="95" r="12" fill="#3b82f6"/>
    <text x="55" y="140" font-family="sans-serif" font-size="12" font-weight="bold" fill="#334155" text-anchor="middle">កែវឃ្លី (n(S) = 7)</text>
  </g>

  <!-- Calculations Card on Right -->
  <g transform="translate(240, 50)">
    <rect width="250" height="125" rx="12" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
    <text x="125" y="30" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e40af" text-anchor="middle">ប្រូបាបចាប់បានឃ្លីក្រហម (Red)</text>
    <text x="125" y="60" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626" text-anchor="middle">P(Red) = 3 / 7</text>
    <line x1="20" y1="75" x2="230" y2="75" stroke="#bfdbfe" stroke-width="1.5"/>
    <text x="125" y="98" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e40af" text-anchor="middle">ប្រូបាបនៃព្រឹត្តិការណ៍ផ្ទុយ (Complement)</text>
    <text x="125" y="118" font-family="sans-serif" font-size="13" font-weight="bold" fill="#047857" text-anchor="middle">P(Blue) = 1 - 3/7 = 4/7</text>
  </g>
</svg>
`);

// 9. Distance Between Two Points (Lesson 9)
export const SVG_DISTANCE_BETWEEN_POINTS = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 220" width="100%" height="100%">
  <rect width="540" height="220" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ចម្ងាយរវាងពីរចំណុចក្នុងប្លង់កូអរដោនេ (Distance: d = √((x₂-x₁)² + (y₂-y₁)²))</text>
  
  <!-- Coordinate Grid -->
  <g transform="translate(80, 45)">
    <!-- Grid lines -->
    <path d="M 0,0 L 220,0 M 0,30 L 220,30 M 0,60 L 220,60 M 0,90 L 220,90 M 0,120 L 220,120" stroke="#e2e8f0" stroke-width="1"/>
    <path d="M 0,0 L 0,120 M 30,0 L 30,120 M 60,0 L 60,120 M 90,0 L 90,120 M 120,0 L 120,120 M 150,0 L 150,120 M 180,0 L 180,120 M 210,0 L 210,120" stroke="#e2e8f0" stroke-width="1"/>
    
    <!-- Axes -->
    <line x1="0" y1="120" x2="230" y2="120" stroke="#334155" stroke-width="2"/>
    <line x1="20" y1="130" x2="20" y2="5" stroke="#334155" stroke-width="2"/>
    <text x="235" y="124" font-family="sans-serif" font-size="11" fill="#475569">x</text>
    <text x="20" y="0" font-family="sans-serif" font-size="11" fill="#475569">y</text>

    <!-- Point A(1, 1) and Point B(5, 4) in scaled grid (x*30, y*25 inverted) -->
    <!-- A = (20 + 1*30 = 50, 120 - 1*25 = 95) -->
    <!-- B = (20 + 5*30 = 170, 120 - 4*25 = 20) -->
    <!-- Right triangle legs: C = (170, 95) -->
    <line x1="50" y1="95" x2="170" y2="95" stroke="#64748b" stroke-width="2" stroke-dasharray="3,3"/>
    <line x1="170" y1="95" x2="170" y2="20" stroke="#64748b" stroke-width="2" stroke-dasharray="3,3"/>
    <text x="110" y="112" font-family="sans-serif" font-size="12" font-weight="bold" fill="#64748b" text-anchor="middle">Δx = 4</text>
    <text x="195" y="60" font-family="sans-serif" font-size="12" font-weight="bold" fill="#64748b">Δy = 3</text>

    <!-- Distance Segment AB -->
    <line x1="50" y1="95" x2="170" y2="20" stroke="#2563eb" stroke-width="3"/>
    <circle cx="50" cy="95" r="5" fill="#ef4444"/>
    <text x="40" y="112" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ef4444">A(1, 1)</text>
    <circle cx="170" cy="20" r="5" fill="#ef4444"/>
    <text x="180" y="18" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ef4444">B(5, 4)</text>
    <text x="95" y="50" font-family="sans-serif" font-size="13" font-weight="bold" fill="#2563eb">d = 5</text>
  </g>

  <!-- Distance Formula Card on Right -->
  <g transform="translate(320, 50)">
    <rect width="190" height="120" rx="10" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
    <text x="95" y="28" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e40af" text-anchor="middle">រូបមន្តគណនាចម្ងាយ</text>
    <text x="95" y="54" font-family="sans-serif" font-size="13" font-weight="bold" fill="#2563eb" text-anchor="middle">d = √(Δx² + Δy²)</text>
    <text x="95" y="80" font-family="sans-serif" font-size="13" font-weight="bold" fill="#16a34a" text-anchor="middle">d = √(4² + 3²) = √25</text>
    <text x="95" y="105" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626" text-anchor="middle">d = 5</text>
  </g>
</svg>
`);

// 10. Equation of a Line (Lesson 10)
export const SVG_EQUATION_OF_LINE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 220" width="100%" height="100%">
  <rect width="540" height="220" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">សមីការបន្ទាត់ទម្រង់ជម្រាល (Slope-Intercept Form: y = mx + b)</text>
  
  <!-- Coordinate Plane -->
  <g transform="translate(70, 45)">
    <!-- Axes -->
    <line x1="0" y1="120" x2="220" y2="120" stroke="#475569" stroke-width="2"/>
    <line x1="70" y1="140" x2="70" y2="10" stroke="#475569" stroke-width="2"/>
    <text x="225" y="124" font-family="sans-serif" font-size="11" fill="#475569">x</text>
    <text x="70" y="5" font-family="sans-serif" font-size="11" fill="#475569">y</text>

    <!-- Line y = 0.75x + 2: intercept at (0, 2) => (70, 75) -->
    <line x1="10" y1="120" x2="190" y2="30" stroke="#2563eb" stroke-width="3"/>
    
    <!-- Y-intercept (0, b) -->
    <circle cx="70" cy="75" r="5" fill="#dc2626"/>
    <text x="25" y="75" font-family="sans-serif" font-size="12" font-weight="bold" fill="#dc2626">(0, b)</text>
    
    <!-- Slope Triangle -->
    <line x1="70" y1="75" x2="150" y2="75" stroke="#10b981" stroke-width="2" stroke-dasharray="3,3"/>
    <line x1="150" y1="75" x2="150" y2="45" stroke="#10b981" stroke-width="2" stroke-dasharray="3,3"/>
    <text x="110" y="90" font-family="sans-serif" font-size="11" font-weight="bold" fill="#047857" text-anchor="middle">Δx</text>
    <text x="162" y="63" font-family="sans-serif" font-size="11" font-weight="bold" fill="#047857">Δy</text>
  </g>

  <!-- Formula Callout on Right -->
  <g transform="translate(310, 50)">
    <rect width="200" height="120" rx="10" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
    <text x="100" y="28" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e40af" text-anchor="middle">លក្ខណៈនៃបន្ទាត់</text>
    <text x="100" y="52" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb" text-anchor="middle">y = mx + b</text>
    <line x1="20" y1="65" x2="180" y2="65" stroke="#bfdbfe" stroke-width="1.5"/>
    <text x="100" y="85" font-family="sans-serif" font-size="12" font-weight="bold" fill="#047857" text-anchor="middle">មេគុណប្រាប់ទិស m = Δy / Δx</text>
    <text x="100" y="105" font-family="sans-serif" font-size="12" font-weight="bold" fill="#dc2626" text-anchor="middle">បន្ទាត់កែងគ្នា: m₁ · m₂ = -1</text>
  </g>
</svg>
`);

// 11. Systems of Linear Equations (Lesson 11)
export const SVG_SYSTEM_LINEAR_EQUATIONS = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 220" width="100%" height="100%">
  <rect width="540" height="220" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ប្រព័ន្ធសមីការដឺក្រេទី ១ មានពីរអញ្ញាត (Linear Systems: Graphical Solution)</text>
  
  <!-- Coordinate Plane -->
  <g transform="translate(70, 45)">
    <line x1="0" y1="120" x2="220" y2="120" stroke="#475569" stroke-width="2"/>
    <line x1="50" y1="140" x2="50" y2="10" stroke="#475569" stroke-width="2"/>
    <text x="225" y="124" font-family="sans-serif" font-size="11" fill="#475569">x</text>
    <text x="50" y="5" font-family="sans-serif" font-size="11" fill="#475569">y</text>

    <!-- Line 1: y = -x + 5 (Red) -->
    <line x1="20" y1="30" x2="180" y2="130" stroke="#dc2626" stroke-width="2.5"/>
    <text x="185" y="130" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">L₁: x + y = 5</text>

    <!-- Line 2: y = 2x - 1 (Blue) -->
    <line x1="30" y1="130" x2="160" y2="20" stroke="#2563eb" stroke-width="2.5"/>
    <text x="165" y="25" font-family="sans-serif" font-size="11" font-weight="bold" fill="#2563eb">L₂: 2x - y = 1</text>

    <!-- Intersection Point (2, 3) -->
    <circle cx="106" cy="65" r="6" fill="#16a34a" stroke="#fff" stroke-width="2"/>
    <text x="115" y="60" font-family="sans-serif" font-size="13" font-weight="bold" fill="#16a34a">P(2, 3)</text>
  </g>

  <!-- Solution Card on Right -->
  <g transform="translate(320, 50)">
    <rect width="190" height="120" rx="10" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="2"/>
    <text x="95" y="28" font-family="sans-serif" font-size="13" font-weight="bold" fill="#166534" text-anchor="middle">ដំណោះស្រាយនៃប្រព័ន្ធ</text>
    <text x="95" y="55" font-family="sans-serif" font-size="14" font-weight="bold" fill="#15803d" text-anchor="middle">{ x + y = 5</text>
    <text x="95" y="75" font-family="sans-serif" font-size="14" font-weight="bold" fill="#15803d" text-anchor="middle">{ 2x - y = 1</text>
    <line x1="20" y1="88" x2="170" y2="88" stroke="#bbf7d0" stroke-width="1.5"/>
    <text x="95" y="108" font-family="sans-serif" font-size="14" font-weight="bold" fill="#16a34a" text-anchor="middle">(x, y) = (2, 3)</text>
  </g>
</svg>
`);

// 12. Pythagorean Theorem (Lesson 12)
export const SVG_PYTHAGOREAN_THEOREM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 230" width="100%" height="100%">
  <rect width="540" height="230" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ទ្រឹស្តីបទពីតាគ័រ (Pythagorean Theorem: a² + b² = c²)</text>
  
  <!-- Right Triangle with Squares -->
  <g transform="translate(100, 60)">
    <!-- Right Triangle ABC: leg a=60 (horiz), leg b=80 (vert), hyp c=100 -->
    <polygon points="50,110 110,110 50,30" fill="#dbeafe" stroke="#1d4ed8" stroke-width="2.5"/>
    
    <!-- Right angle symbol at (50, 110) -->
    <rect x="50" y="98" width="12" height="12" fill="none" stroke="#1d4ed8" stroke-width="1.5"/>

    <!-- Square on leg a (bottom, 60x60) -->
    <rect x="50" y="110" width="60" height="60" fill="#93c5fd" fill-opacity="0.6" stroke="#2563eb" stroke-width="1.5"/>
    <text x="80" y="145" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e40af" text-anchor="middle">a² = 36</text>

    <!-- Square on leg b (left, 80x80) -->
    <rect x="-30" y="30" width="80" height="80" fill="#86efac" fill-opacity="0.6" stroke="#16a34a" stroke-width="1.5"/>
    <text x="10" y="75" font-family="sans-serif" font-size="12" font-weight="bold" fill="#166534" text-anchor="middle">b² = 64</text>

    <!-- Labels on Triangle Sides -->
    <text x="80" y="105" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e40af" text-anchor="middle">a = 6</text>
    <text x="58" y="70" font-family="sans-serif" font-size="12" font-weight="bold" fill="#166534">b = 8</text>
    <text x="92" y="65" font-family="sans-serif" font-size="13" font-weight="bold" fill="#dc2626">c = 10</text>
  </g>

  <!-- Formula Box on Right -->
  <g transform="translate(320, 50)">
    <rect width="190" height="135" rx="12" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
    <text x="95" y="30" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e40af" text-anchor="middle">រូបមន្តពីតាគ័រ</text>
    <text x="95" y="58" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb" text-anchor="middle">c² = a² + b²</text>
    <line x1="20" y1="72" x2="170" y2="72" stroke="#bfdbfe" stroke-width="1.5"/>
    <text x="95" y="94" font-family="sans-serif" font-size="13" font-weight="bold" fill="#047857" text-anchor="middle">10² = 6² + 8²</text>
    <text x="95" y="118" font-family="sans-serif" font-size="14" font-weight="bold" fill="#dc2626" text-anchor="middle">100 = 36 + 64 (ពិត)</text>
  </g>
</svg>
`);

// 13. Circles and Lines (Lesson 13)
export const SVG_CIRCLES_AND_LINES = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 220" width="100%" height="100%">
  <rect width="540" height="220" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ទីតាំងធៀបរវាងរង្វង់ និងបន្ទាត់ (Tangent, Secant, and Radius Perpendicularity)</text>
  
  <!-- Circle on Left -->
  <g transform="translate(140, 115)">
    <!-- Circle Center O, Radius r = 60 -->
    <circle cx="0" cy="0" r="60" fill="#eff6ff" stroke="#2563eb" stroke-width="2.5"/>
    <circle cx="0" cy="0" r="4" fill="#2563eb"/>
    <text x="-12" y="5" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e40af">O</text>

    <!-- Tangent Line (horizontal at bottom y = 60) -->
    <line x1="-100" y1="60" x2="120" y2="60" stroke="#dc2626" stroke-width="3"/>
    <circle cx="0" cy="60" r="4" fill="#dc2626"/>
    <text x="10" y="78" font-family="sans-serif" font-size="12" font-weight="bold" fill="#dc2626">ចំណុចប៉ះ P (Tangent Line)</text>

    <!-- Radius to Tangent OP (perpendicular) -->
    <line x1="0" y1="0" x2="0" y2="60" stroke="#16a34a" stroke-width="2.5"/>
    <rect x="-1" y="48" width="12" height="12" fill="none" stroke="#dc2626" stroke-width="1.5"/>
    <text x="8" y="35" font-family="sans-serif" font-size="12" font-weight="bold" fill="#16a34a">r ⊥ t (90°)</text>

    <!-- Secant Line (cuts through circle at top) -->
    <line x1="-80" y1="-30" x2="90" y2="-30" stroke="#64748b" stroke-width="2" stroke-dasharray="4,3"/>
    <text x="10" y="-38" font-family="sans-serif" font-size="11" font-weight="bold" fill="#64748b">បន្ទាត់កាត់ (Secant Line)</text>
  </g>

  <!-- Properties Card on Right -->
  <g transform="translate(310, 50)">
    <rect width="200" height="135" rx="12" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
    <text x="100" y="28" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e40af" text-anchor="middle">លក្ខណៈបន្ទាត់ប៉ះរង្វង់</text>
    <text x="100" y="54" font-family="sans-serif" font-size="13" font-weight="bold" fill="#dc2626" text-anchor="middle">កាំកែងនឹងបន្ទាត់ប៉ះ: r ⊥ t</text>
    <line x1="15" y1="68" x2="185" y2="68" stroke="#bfdbfe" stroke-width="1.5"/>
    <text x="100" y="90" font-family="sans-serif" font-size="12" font-weight="bold" fill="#047857" text-anchor="middle">ពីចំណុចក្រៅ P អាចគូស</text>
    <text x="100" y="110" font-family="sans-serif" font-size="12" font-weight="bold" fill="#047857" text-anchor="middle">បន្ទាត់ប៉ះពីរស្មើគ្នា (PA = PB)</text>
  </g>
</svg>
`);

// 14. Angle Properties of Circles (Lesson 14)
export const SVG_CIRCLE_ANGLE_PROPERTIES = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 220" width="100%" height="100%">
  <rect width="540" height="220" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">លក្ខណៈមុំនៃរង្វង់ (Central Angle &amp; Inscribed Angle)</text>
  
  <!-- Circle on Left -->
  <g transform="translate(140, 115)">
    <!-- Circle, radius R = 65 -->
    <circle cx="0" cy="0" r="65" fill="#eff6ff" stroke="#2563eb" stroke-width="2.5"/>
    
    <!-- Center O -->
    <circle cx="0" cy="0" r="4" fill="#2563eb"/>
    <text x="-12" y="15" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2563eb">O</text>

    <!-- Points on circle: A(-45, 47), B(45, 47), C(0, -65) -->
    <!-- Central Angle AOB: lines OA, OB -->
    <line x1="0" y1="0" x2="-45" y2="47" stroke="#2563eb" stroke-width="2"/>
    <line x1="0" y1="0" x2="45" y2="47" stroke="#2563eb" stroke-width="2"/>
    <text x="0" y="28" font-family="sans-serif" font-size="13" font-weight="bold" fill="#2563eb" text-anchor="middle">2α</text>

    <!-- Inscribed Angle ACB: lines CA, CB -->
    <line x1="0" y1="-65" x2="-45" y2="47" stroke="#dc2626" stroke-width="2"/>
    <line x1="0" y1="-65" x2="45" y2="47" stroke="#dc2626" stroke-width="2"/>
    <circle cx="0" cy="-65" r="4" fill="#dc2626"/>
    <text x="0" y="-72" font-family="sans-serif" font-size="12" font-weight="bold" fill="#dc2626" text-anchor="middle">C (មុំចារឹក α)</text>
    
    <!-- Base Points A & B -->
    <circle cx="-45" cy="47" r="4" fill="#334155"/>
    <text x="-58" y="58" font-family="sans-serif" font-size="12" font-weight="bold" fill="#334155">A</text>
    <circle cx="45" cy="47" r="4" fill="#334155"/>
    <text x="55" y="58" font-family="sans-serif" font-size="12" font-weight="bold" fill="#334155">B</text>
  </g>

  <!-- Properties Box on Right -->
  <g transform="translate(300, 48)">
    <rect width="215" height="140" rx="12" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
    <text x="107" y="28" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e40af" text-anchor="middle">ទ្រឹស្តីបទមុំក្នុងរង្វង់</text>
    <text x="107" y="54" font-family="sans-serif" font-size="14" font-weight="bold" fill="#2563eb" text-anchor="middle">∠AOB = 2 · ∠ACB</text>
    <line x1="15" y1="68" x2="200" y2="68" stroke="#bfdbfe" stroke-width="1.5"/>
    <text x="107" y="90" font-family="sans-serif" font-size="12" font-weight="bold" fill="#047857" text-anchor="middle">មុំចារឹកក្នុងកន្លះរង្វង់ = 90°</text>
    <text x="107" y="112" font-family="sans-serif" font-size="12" font-weight="bold" fill="#dc2626" text-anchor="middle">ចតុកោណចារឹក: មុំឈមបូក = 180°</text>
  </g>
</svg>
`);

// 15. Thales's Theorem (Lesson 15)
export const SVG_THALES_THEOREM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 220" width="100%" height="100%">
  <rect width="540" height="220" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ទ្រឹស្តីបទតាលែសក្នុងត្រីកោណ (Thales's Intercept Theorem: DE ∥ BC)</text>
  
  <!-- Triangle on Left -->
  <g transform="translate(110, 45)">
    <!-- Main Triangle ABC: A(60, 0), B(0, 130), C(140, 130) -->
    <polygon points="60,0 0,130 140,130" fill="#eff6ff" stroke="#2563eb" stroke-width="2.5"/>
    <text x="60" y="-8" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e40af" text-anchor="middle">A</text>
    <text x="-12" y="140" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e40af">B</text>
    <text x="145" y="140" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e40af">C</text>

    <!-- Parallel Line DE: D(30, 65), E(100, 65) -->
    <line x1="30" y1="65" x2="100" y2="65" stroke="#dc2626" stroke-width="3"/>
    <circle cx="30" cy="65" r="4" fill="#dc2626"/>
    <text x="15" y="65" font-family="sans-serif" font-size="12" font-weight="bold" fill="#dc2626">D</text>
    <circle cx="100" cy="65" r="4" fill="#dc2626"/>
    <text x="112" y="65" font-family="sans-serif" font-size="12" font-weight="bold" fill="#dc2626">E</text>

    <!-- Parallel marker arrows -->
    <text x="65" y="60" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626" text-anchor="middle">▶▶</text>
    <text x="70" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="#2563eb" text-anchor="middle">▶▶</text>
  </g>

  <!-- Formula Box on Right -->
  <g transform="translate(300, 48)">
    <rect width="215" height="140" rx="12" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
    <text x="107" y="28" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e40af" text-anchor="middle">ផលធៀបតាលែស (DE ∥ BC)</text>
    <text x="107" y="55" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb" text-anchor="middle">AD / DB = AE / EC</text>
    <line x1="15" y1="70" x2="200" y2="70" stroke="#bfdbfe" stroke-width="1.5"/>
    <text x="107" y="92" font-family="sans-serif" font-size="14" font-weight="bold" fill="#047857" text-anchor="middle">AD / AB = AE / AC = DE / BC</text>
    <text x="107" y="118" font-family="sans-serif" font-size="12" font-weight="bold" fill="#dc2626" text-anchor="middle">ទ្រឹស្តីបទច្រាស: បញ្ជាក់បន្ទាត់ស្រប</text>
  </g>
</svg>
`);

// 16. Similar Triangles (Lesson 16)
export const SVG_SIMILAR_TRIANGLES = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 220" width="100%" height="100%">
  <rect width="540" height="220" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ត្រីកោណដូចគ្នា (Similar Triangles: △ABC ~ △A'B'C')</text>
  
  <!-- Triangle 1 (Small) -->
  <g transform="translate(60, 75)">
    <polygon points="35,0 0,75 80,75" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
    <text x="35" y="-6" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1e40af" text-anchor="middle">A</text>
    <text x="-10" y="82" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1e40af">B</text>
    <text x="85" y="82" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1e40af">C</text>
    <text x="40" y="93" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1e40af" text-anchor="middle">a = 4</text>
  </g>

  <!-- Triangle 2 (Large, scaled k = 1.5) -->
  <g transform="translate(180, 50)">
    <polygon points="52,0 0,112 120,112" fill="#bfdbfe" fill-opacity="0.7" stroke="#1d4ed8" stroke-width="2.5"/>
    <text x="52" y="-6" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e3a8a" text-anchor="middle">A'</text>
    <text x="-12" y="120" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e3a8a">B'</text>
    <text x="125" y="120" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e3a8a">C'</text>
    <text x="60" y="132" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e3a8a" text-anchor="middle">a' = 6</text>
  </g>

  <!-- Properties Box on Right -->
  <g transform="translate(325, 48)">
    <rect width="195" height="140" rx="12" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
    <text x="97" y="28" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e40af" text-anchor="middle">លក្ខណៈភាពដូចគ្នា</text>
    <text x="97" y="55" font-family="sans-serif" font-size="14" font-weight="bold" fill="#2563eb" text-anchor="middle">ផលធៀប k = a'/a = 1.5</text>
    <line x1="15" y1="70" x2="180" y2="70" stroke="#bfdbfe" stroke-width="1.5"/>
    <text x="97" y="92" font-family="sans-serif" font-size="12" font-weight="bold" fill="#047857" text-anchor="middle">ផលធៀបបរិមាត្រ = k</text>
    <text x="97" y="115" font-family="sans-serif" font-size="13" font-weight="bold" fill="#dc2626" text-anchor="middle">ផលធៀបផ្ទៃក្រឡា = k² = 2.25</text>
  </g>
</svg>
`);

// 17. Polygons (Lesson 17)
export const SVG_POLYGONS = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 220" width="100%" height="100%">
  <rect width="540" height="220" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ផលបូកមុំក្នុងពហុកោណ (Polygons: Sum = (n - 2) × 180°)</text>
  
  <!-- Regular Pentagon on Left -->
  <g transform="translate(120, 115)">
    <!-- Regular Pentagon vertices (R = 55): angles 90, 162, 234, 306, 378 deg -->
    <polygon points="0,-55 52,-17 32,45 -32,45 -52,-17" fill="#dbeafe" stroke="#2563eb" stroke-width="2.5"/>
    <circle cx="0" cy="0" r="3" fill="#2563eb"/>
    <text x="0" y="68" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e40af" text-anchor="middle">បញ្ចកោណ (n = 5)</text>
    <text x="0" y="5" font-family="sans-serif" font-size="12" font-weight="bold" fill="#dc2626" text-anchor="middle">108°</text>
  </g>

  <!-- Formula Callout Box on Right -->
  <g transform="translate(260, 48)">
    <rect width="250" height="140" rx="12" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
    <text x="125" y="28" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e40af" text-anchor="middle">រូបមន្តពហុកោណ n ជ្រុង</text>
    <text x="125" y="55" font-family="sans-serif" font-size="14" font-weight="bold" fill="#2563eb" text-anchor="middle">ផលបូកមុំក្នុង = (n - 2) × 180°</text>
    <text x="125" y="80" font-family="sans-serif" font-size="12" font-weight="bold" fill="#16a34a" text-anchor="middle">សម្រាប់ n = 5: (5 - 2) × 180° = 540°</text>
    <line x1="20" y1="92" x2="230" y2="92" stroke="#bfdbfe" stroke-width="1.5"/>
    <text x="125" y="110" font-family="sans-serif" font-size="12" font-weight="bold" fill="#047857" text-anchor="middle">មុំក្នុងពហុកោណនិយ័ត = (n - 2)·180° / n</text>
    <text x="125" y="128" font-family="sans-serif" font-size="12" font-weight="bold" fill="#dc2626" text-anchor="middle">ផលបូកមុំក្រៅ = 360° ជានិច្ច</text>
  </g>
</svg>
`);

// 18. Solids: Cone & Sphere (Lesson 18)
export const SVG_SOLIDS_G9 = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 220" width="100%" height="100%">
  <rect width="540" height="220" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">សូលីត: កោណ និងស្វ៊ែរ (Solids: Right Circular Cone &amp; Sphere)</text>
  
  <!-- Right Circular Cone on Left -->
  <g transform="translate(100, 45)">
    <!-- Base Ellipse -->
    <ellipse cx="50" cy="110" rx="45" ry="14" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="2"/>
    <!-- Cone Body -->
    <path d="M 5,110 L 50,15 L 95,110 Z" fill="#3b82f6" fill-opacity="0.7" stroke="#1d4ed8" stroke-width="2"/>
    <!-- Height line h -->
    <line x1="50" y1="15" x2="50" y2="110" stroke="#dc2626" stroke-width="2" stroke-dasharray="3,3"/>
    <text x="55" y="65" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">h</text>
    <!-- Radius r -->
    <line x1="50" y1="110" x2="95" y2="110" stroke="#16a34a" stroke-width="2"/>
    <text x="70" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="#16a34a">r</text>
    <text x="50" y="145" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e40af" text-anchor="middle">កោណ (V = ⅓πr²h)</text>
  </g>

  <!-- Sphere in Middle -->
  <g transform="translate(235, 45)">
    <circle cx="50" cy="65" r="45" fill="#10b981" fill-opacity="0.65" stroke="#047857" stroke-width="2"/>
    <!-- Equator Ellipse -->
    <ellipse cx="50" cy="65" rx="45" ry="14" fill="none" stroke="#047857" stroke-width="1.5" stroke-dasharray="4,3"/>
    <!-- Radius R -->
    <line x1="50" y1="65" x2="95" y2="65" stroke="#dc2626" stroke-width="2"/>
    <circle cx="50" cy="65" r="3" fill="#047857"/>
    <text x="72" y="58" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">R</text>
    <text x="50" y="145" font-family="sans-serif" font-size="12" font-weight="bold" fill="#047857" text-anchor="middle">ស្វ៊ែរ (V = ⁴⁄₃πR³)</text>
  </g>

  <!-- Formulas Summary on Right -->
  <g transform="translate(365, 48)">
    <rect width="160" height="140" rx="10" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1.5"/>
    <text x="80" y="24" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e40af" text-anchor="middle">រូបមន្តផ្ទៃ និងមាឌ</text>
    <text x="80" y="46" font-family="sans-serif" font-size="11" font-weight="bold" fill="#2563eb" text-anchor="middle">កោណ:</text>
    <text x="80" y="62" font-family="sans-serif" font-size="11" fill="#1e40af" text-anchor="middle">S = πrl + πr²</text>
    <text x="80" y="78" font-family="sans-serif" font-size="11" fill="#1e40af" text-anchor="middle">V = ⅓ · πr²h</text>
    <line x1="15" y1="88" x2="145" y2="88" stroke="#bfdbfe" stroke-width="1"/>
    <text x="80" y="104" font-family="sans-serif" font-size="11" font-weight="bold" fill="#047857" text-anchor="middle">ស្វ៊ែរ:</text>
    <text x="80" y="118" font-family="sans-serif" font-size="11" fill="#047857" text-anchor="middle">S = 4πR²</text>
    <text x="80" y="132" font-family="sans-serif" font-size="11" fill="#047857" text-anchor="middle">V = ⁴⁄₃ · πR³</text>
  </g>
</svg>
`);
