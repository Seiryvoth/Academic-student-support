// SVG Visual Diagrams for Grade 10 Mathematics
// Clean, responsive, self-contained SVG Data URIs for coordinate geometry, functions, trigonometry, statistics, vectors, and transformations

export function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// 1. Coordinates of Points (Lesson 10)
export const SVG_COORDINATES_POINTS = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 260" width="100%" height="100%">
  <rect width="560" height="260" fill="#f8fafc" rx="16"/>
  <text x="280" y="26" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">កូអរដោនេនៃចំណុច និងចម្ងាយ (Coordinates &amp; Distance Formula)</text>
  
  <!-- Grid -->
  <g stroke="#e2e8f0" stroke-width="1">
    <line x1="70" y1="50" x2="490" y2="50"/>
    <line x1="70" y1="90" x2="490" y2="90"/>
    <line x1="70" y1="130" x2="490" y2="130"/>
    <line x1="70" y1="170" x2="490" y2="170"/>
    <line x1="70" y1="210" x2="490" y2="210"/>
    <line x1="110" y1="40" x2="110" y2="230"/>
    <line x1="170" y1="40" x2="170" y2="230"/>
    <line x1="230" y1="40" x2="230" y2="230"/>
    <line x1="290" y1="40" x2="290" y2="230"/>
    <line x1="350" y1="40" x2="350" y2="230"/>
    <line x1="410" y1="40" x2="410" y2="230"/>
    <line x1="470" y1="40" x2="470" y2="230"/>
  </g>

  <!-- Axes -->
  <line x1="70" y1="210" x2="510" y2="210" stroke="#334155" stroke-width="2.5" marker-end="url(#arr)"/>
  <line x1="110" y1="230" x2="110" y2="35" stroke="#334155" stroke-width="2.5"/>
  <text x="515" y="214" font-family="sans-serif" font-size="12" font-weight="bold" fill="#334155">x</text>
  <text x="110" y="28" font-family="sans-serif" font-size="12" font-weight="bold" fill="#334155" text-anchor="middle">y</text>
  <text x="100" y="224" font-family="sans-serif" font-size="11" fill="#64748b">O(0,0)</text>

  <!-- Points A(1, 1) -> (170, 170) and B(5, 4) -> (410, 50) -->
  <!-- Right triangle -->
  <polygon points="170,170 410,170 410,50" fill="#e0f2fe" opacity="0.6"/>
  <line x1="170" y1="170" x2="410" y2="170" stroke="#0284c7" stroke-width="2" stroke-dasharray="4,4"/>
  <line x1="410" y1="170" x2="410" y2="50" stroke="#0284c7" stroke-width="2" stroke-dasharray="4,4"/>
  <line x1="170" y1="170" x2="410" y2="50" stroke="#2563eb" stroke-width="3"/>

  <!-- Midpoint M(3, 2.5) -> (290, 110) -->
  <circle cx="290" cy="110" r="5" fill="#16a34a"/>
  <text x="300" y="112" font-family="sans-serif" font-size="11" font-weight="bold" fill="#16a34a">M(3, 2.5)</text>

  <circle cx="170" cy="170" r="6" fill="#2563eb"/>
  <text x="155" y="190" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e40af">A(1, 1)</text>

  <circle cx="410" cy="50" r="6" fill="#2563eb"/>
  <text x="420" y="48" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e40af">B(5, 4)</text>

  <!-- Labels -->
  <text x="290" y="185" font-family="sans-serif" font-size="11" fill="#0284c7" text-anchor="middle">Δx = 5 - 1 = 4</text>
  <text x="435" y="115" font-family="sans-serif" font-size="11" fill="#0284c7">Δy = 4 - 1 = 3</text>
  <text x="260" y="80" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2563eb">d = √(4² + 3²) = 5</text>
</svg>
`);

// 2. Equation of a Line (Lesson 11)
export const SVG_EQUATION_LINE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 250" width="100%" height="100%">
  <rect width="540" height="250" fill="#f8fafc" rx="16"/>
  <text x="270" y="26" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">សមីការបន្ទាត់ y = mx + c (Line Equation &amp; Slope)</text>

  <!-- Axes -->
  <line x1="50" y1="180" x2="490" y2="180" stroke="#475569" stroke-width="2"/>
  <line x1="200" y1="220" x2="200" y2="45" stroke="#475569" stroke-width="2"/>
  <text x="495" y="184" font-family="sans-serif" font-size="12" font-weight="bold" fill="#475569">x</text>
  <text x="200" y="38" font-family="sans-serif" font-size="12" font-weight="bold" fill="#475569" text-anchor="middle">y</text>
  <text x="188" y="194" font-family="sans-serif" font-size="11" fill="#64748b">O</text>

  <!-- Line 1: y = 0.75x + 1.5 -> (L1: slope m1 = 0.75) -->
  <line x1="80" y1="210" x2="440" y2="75" stroke="#2563eb" stroke-width="3"/>
  <circle cx="200" cy="150" r="5" fill="#2563eb"/>
  <text x="210" y="148" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1e40af">y-int (0, c)</text>
  <text x="420" y="65" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2563eb">L₁: y = mx + c</text>

  <!-- Perpendicular Line L2 -->
  <line x1="160" y1="60" x2="310" y2="210" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="5,4"/>
  <text x="320" y="215" font-family="sans-serif" font-size="12" font-weight="bold" fill="#dc2626">L₂ ⊥ L₁ (m₁ · m₂ = -1)</text>

  <!-- Right angle marker -->
  <rect x="220" y="120" width="12" height="12" fill="none" stroke="#dc2626" stroke-width="1.5" transform="rotate(37 220 120)"/>

  <!-- Info box -->
  <rect x="50" y="55" width="130" height="60" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
  <text x="60" y="75" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1e293b">Slope: m = Δy/Δx</text>
  <text x="60" y="93" font-family="sans-serif" font-size="10" fill="#475569">Parallel: m₁ = m₂</text>
  <text x="60" y="107" font-family="sans-serif" font-size="10" fill="#475569">Perpendicular: m₁m₂ = -1</text>
</svg>
`);

// 3. Equation of a Circle (Lesson 12)
export const SVG_EQUATION_CIRCLE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 250" width="100%" height="100%">
  <rect width="540" height="250" fill="#f8fafc" rx="16"/>
  <text x="270" y="26" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">សមីការរង្វង់ (x - a)² + (y - b)² = r²</text>

  <!-- Axes -->
  <line x1="50" y1="190" x2="490" y2="190" stroke="#475569" stroke-width="2"/>
  <line x1="120" y1="225" x2="120" y2="40" stroke="#475569" stroke-width="2"/>
  <text x="495" y="194" font-family="sans-serif" font-size="12" font-weight="bold" fill="#475569">x</text>
  <text x="120" y="34" font-family="sans-serif" font-size="12" font-weight="bold" fill="#475569" text-anchor="middle">y</text>
  <text x="108" y="204" font-family="sans-serif" font-size="11" fill="#64748b">O</text>

  <!-- Center (a, b) at (260, 130), radius r = 70 -->
  <circle cx="260" cy="130" r="70" fill="#eff6ff" stroke="#2563eb" stroke-width="3"/>
  <circle cx="260" cy="130" r="4.5" fill="#1e40af"/>
  <text x="250" y="148" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1e40af">I(a, b)</text>

  <!-- Point P(x, y) on circle at (315, 87) -->
  <line x1="260" y1="130" x2="315" y2="87" stroke="#dc2626" stroke-width="2.5"/>
  <circle cx="315" cy="87" r="4.5" fill="#dc2626"/>
  <text x="325" y="85" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">P(x, y)</text>
  <text x="280" y="100" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">r</text>

  <!-- Tangent line at P -->
  <line x1="270" y1="40" x2="360" y2="135" stroke="#16a34a" stroke-width="2.5"/>
  <text x="365" y="140" font-family="sans-serif" font-size="11" font-weight="bold" fill="#16a34a">Tangent (បន្ទាត់ប៉ះ ⊥ r)</text>

  <!-- Dashed coordinates of center -->
  <line x1="260" y1="130" x2="260" y2="190" stroke="#94a3b8" stroke-dasharray="3,3"/>
  <line x1="260" y1="130" x2="120" y2="130" stroke="#94a3b8" stroke-dasharray="3,3"/>
  <text x="260" y="205" font-family="sans-serif" font-size="10" fill="#64748b" text-anchor="middle">a</text>
  <text x="105" y="134" font-family="sans-serif" font-size="10" fill="#64748b" text-anchor="end">b</text>
</svg>
`);

// 4. Solving Inequalities Graphically (Lesson 13)
export const SVG_INEQUALITIES_GRAPH = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 250" width="100%" height="100%">
  <rect width="540" height="250" fill="#f8fafc" rx="16"/>
  <text x="270" y="26" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ការដោះស្រាយវិសមីការតាមក្រាប (Graphical Inequalities)</text>

  <!-- Half-plane shading: region y <= -x + 4 -->
  <polygon points="60,220 340,220 100,70" fill="#bfdbfe" opacity="0.6"/>

  <!-- Axes -->
  <line x1="60" y1="180" x2="480" y2="180" stroke="#475569" stroke-width="2"/>
  <line x1="180" y1="220" x2="180" y2="40" stroke="#475569" stroke-width="2"/>
  <text x="485" y="184" font-family="sans-serif" font-size="12" font-weight="bold" fill="#475569">x</text>
  <text x="180" y="34" font-family="sans-serif" font-size="12" font-weight="bold" fill="#475569" text-anchor="middle">y</text>

  <!-- Boundary line: x + y = 4 -> line passing through (0, 4) and (4, 0) -->
  <line x1="90" y1="65" x2="360" y2="225" stroke="#2563eb" stroke-width="3"/>
  <text x="320" y="130" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2563eb">x + y = 4 (ព្រំដែន)</text>

  <!-- Test point O(0,0) -->
  <circle cx="180" cy="180" r="5" fill="#16a34a"/>
  <text x="190" y="175" font-family="sans-serif" font-size="11" font-weight="bold" fill="#16a34a">O(0,0) : 0 + 0 ≤ 4 (ពិត)</text>

  <!-- Shaded Region label -->
  <text x="140" y="130" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1d4ed8">តំបន់ចម្លើយ</text>
  <text x="140" y="146" font-family="sans-serif" font-size="11" fill="#1d4ed8">(x + y ≤ 4)</text>
</svg>
`);

// 5. Trigonometric Ratios & Unit Circle (Lesson 14)
export const SVG_TRIG_RATIOS = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 250" width="100%" height="100%">
  <rect width="540" height="250" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">រង្វង់ត្រីកោណមាត្រ (Trigonometric Unit Circle)</text>

  <g transform="translate(180, 135)">
    <!-- Axes -->
    <line x1="-105" y1="0" x2="105" y2="0" stroke="#475569" stroke-width="1.8"/>
    <line x1="0" y1="-100" x2="0" y2="100" stroke="#475569" stroke-width="1.8"/>
    <text x="110" y="4" font-family="sans-serif" font-size="11" fill="#475569">cos θ</text>
    <text x="0" y="-105" font-family="sans-serif" font-size="11" fill="#475569" text-anchor="middle">sin θ</text>

    <!-- Circle r = 80 -->
    <circle cx="0" cy="0" r="80" fill="none" stroke="#94a3b8" stroke-width="2"/>

    <!-- Angle theta = 45 deg -->
    <line x1="0" y1="0" x2="56.5" y2="-56.5" stroke="#2563eb" stroke-width="2.5"/>
    <polygon points="0,0 56.5,0 56.5,-56.5" fill="#dbeafe" opacity="0.6"/>
    <line x1="56.5" y1="0" x2="56.5" y2="-56.5" stroke="#dc2626" stroke-width="2"/>
    <circle cx="56.5" cy="-56.5" r="4" fill="#2563eb"/>
    <text x="62" y="-60" font-family="sans-serif" font-size="10" font-weight="bold" fill="#1e40af">P(cos θ, sin θ)</text>
    <text x="25" y="-10" font-family="sans-serif" font-size="10" fill="#2563eb">θ</text>
  </g>

  <!-- Quadrants info -->
  <g transform="translate(340, 60)">
    <rect width="180" height="150" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <text x="90" y="24" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#1e293b">សញ្ញាតាមក្វាដ្រង់ (ASTC)</text>
    <text x="15" y="52" font-family="sans-serif" font-size="11" fill="#16a34a">QI: All positive (+)</text>
    <text x="15" y="76" font-family="sans-serif" font-size="11" fill="#2563eb">QII: sin &gt; 0, cos &lt; 0</text>
    <text x="15" y="100" font-family="sans-serif" font-size="11" fill="#ea580c">QIII: tan &gt; 0, sin/cos &lt; 0</text>
    <text x="15" y="124" font-family="sans-serif" font-size="11" fill="#9333ea">QIV: cos &gt; 0, sin/tan &lt; 0</text>
  </g>
</svg>
`);

// 6. Applications of Trigonometric Ratios (Lesson 15)
export const SVG_TRIG_APPLICATIONS = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 250" width="100%" height="100%">
  <rect width="540" height="250" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ទ្រឹស្តីបទស៊ីនុស និងកូស៊ីនុស (Sine &amp; Cosine Rules)</text>

  <!-- Oblique Triangle ABC -->
  <g transform="translate(50, 45)">
    <polygon points="60,150 320,150 200,30" fill="#f0fdf4" stroke="#16a34a" stroke-width="2.5"/>
    <circle cx="60" cy="150" r="4.5" fill="#15803d"/>
    <circle cx="320" cy="150" r="4.5" fill="#15803d"/>
    <circle cx="200" cy="30" r="4.5" fill="#15803d"/>

    <text x="45" y="165" font-family="sans-serif" font-size="12" font-weight="bold" fill="#15803d">A</text>
    <text x="330" y="165" font-family="sans-serif" font-size="12" font-weight="bold" fill="#15803d">B</text>
    <text x="195" y="20" font-family="sans-serif" font-size="12" font-weight="bold" fill="#15803d">C</text>

    <!-- Side labels -->
    <text x="270" y="85" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2563eb">a</text>
    <text x="115" y="85" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2563eb">b</text>
    <text x="190" y="170" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2563eb">c</text>
  </g>

  <!-- Formulas on right -->
  <g transform="translate(360, 45)">
    <rect width="160" height="170" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <text x="80" y="24" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle" fill="#1e293b">រូបមន្តគ្រឹះ</text>
    
    <text x="15" y="52" font-family="sans-serif" font-size="11" font-weight="bold" fill="#2563eb">ទ្រឹស្តីបទស៊ីនុស:</text>
    <text x="15" y="70" font-family="sans-serif" font-size="11" fill="#334155">a/sin A = b/sin B = c/sin C</text>

    <text x="15" y="102" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">ទ្រឹស្តីបទកូស៊ីនុស:</text>
    <text x="15" y="120" font-family="sans-serif" font-size="11" fill="#334155">a² = b² + c² - 2bc cos A</text>

    <text x="15" y="148" font-family="sans-serif" font-size="10" font-weight="bold" fill="#16a34a">ផ្ទៃ S = 1/2 ab sin C</text>
  </g>
</svg>
`);

// 7. Functions and Graphs (Lesson 16)
export const SVG_FUNCTION_GRAPHS = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 250" width="100%" height="100%">
  <rect width="540" height="250" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">អនុគមន៍ និងការធ្វើតេស្តបន្ទាត់ឈរ (Vertical Line Test)</text>

  <!-- Left: Function graph -->
  <g transform="translate(60, 50)">
    <line x1="0" y1="120" x2="160" y2="120" stroke="#64748b" stroke-width="1.5"/>
    <line x1="80" y1="170" x2="80" y2="10" stroke="#64748b" stroke-width="1.5"/>
    <!-- Cubic curve y = x^3 - x -->
    <path d="M 20,150 Q 50,50 80,120 T 140,40" fill="none" stroke="#2563eb" stroke-width="2.5"/>
    <!-- Vertical test line: intersects exactly once -->
    <line x1="100" y1="20" x2="100" y2="160" stroke="#16a34a" stroke-width="2" stroke-dasharray="4,4"/>
    <circle cx="100" cy="100" r="4.5" fill="#16a34a"/>
    <text x="80" y="185" font-family="sans-serif" font-size="11" font-weight="bold" fill="#16a34a" text-anchor="middle">ជាអនុគមន៍ (កាត់ ១ ចំណុច)</text>
  </g>

  <!-- Right: Non-function circle -->
  <g transform="translate(300, 50)">
    <line x1="0" y1="120" x2="160" y2="120" stroke="#64748b" stroke-width="1.5"/>
    <line x1="80" y1="170" x2="80" y2="10" stroke="#64748b" stroke-width="1.5"/>
    <!-- Circle -->
    <circle cx="80" cy="90" r="50" fill="none" stroke="#dc2626" stroke-width="2.5"/>
    <!-- Vertical test line intersects twice -->
    <line x1="100" y1="20" x2="100" y2="160" stroke="#dc2626" stroke-width="2" stroke-dasharray="4,4"/>
    <circle cx="100" cy="45" r="4.5" fill="#dc2626"/>
    <circle cx="100" cy="135" r="4.5" fill="#dc2626"/>
    <text x="80" y="185" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626" text-anchor="middle">មិនមែនជាអនុគមន៍ (កាត់ ២ ចំណុច)</text>
  </g>
</svg>
`);

// 8. Quadratic Functions (Lesson 17)
export const SVG_QUADRATIC_FUNCTION = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 250" width="100%" height="100%">
  <rect width="540" height="250" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ក្រាបប៉ារ៉ាបូល y = a(x - h)² + k (Parabola &amp; Vertex)</text>

  <!-- Axes -->
  <line x1="50" y1="190" x2="490" y2="190" stroke="#475569" stroke-width="2"/>
  <line x1="150" y1="230" x2="150" y2="40" stroke="#475569" stroke-width="2"/>
  <text x="495" y="194" font-family="sans-serif" font-size="12" font-weight="bold" fill="#475569">x</text>
  <text x="150" y="34" font-family="sans-serif" font-size="12" font-weight="bold" fill="#475569" text-anchor="middle">y</text>

  <!-- Parabola opening upward: vertex at (270, 150) -->
  <path d="M 130,50 Q 270,230 410,50" fill="none" stroke="#2563eb" stroke-width="3"/>

  <!-- Axis of symmetry -->
  <line x1="270" y1="40" x2="270" y2="230" stroke="#ea580c" stroke-width="2" stroke-dasharray="5,4"/>
  <text x="280" y="55" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ea580c">អ័ក្សឆ្លុះ x = h</text>

  <!-- Vertex -->
  <circle cx="270" cy="140" r="5.5" fill="#dc2626"/>
  <text x="280" y="145" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">កំពូល V(h, k)</text>
  <text x="280" y="160" font-family="sans-serif" font-size="10" fill="#dc2626">តម្លៃអប្បបរមា = k</text>

  <!-- x-intercepts -->
  <circle cx="180" cy="190" r="4.5" fill="#16a34a"/>
  <circle cx="360" cy="190" r="4.5" fill="#16a34a"/>
  <text x="175" y="210" font-family="sans-serif" font-size="10" fill="#16a34a">x₁</text>
  <text x="360" y="210" font-family="sans-serif" font-size="10" fill="#16a34a">x₂</text>
</svg>
`);

// 9. Rational and Irrational Functions (Lesson 18)
export const SVG_RATIONAL_FUNCTION = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 250" width="100%" height="100%">
  <rect width="540" height="250" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">អនុគមន៍សនិទាន និងអាស៊ីមតូត (Rational Function &amp; Asymptotes)</text>

  <!-- Axes -->
  <line x1="40" y1="180" x2="500" y2="180" stroke="#475569" stroke-width="1.8"/>
  <line x1="160" y1="230" x2="160" y2="40" stroke="#475569" stroke-width="1.8"/>

  <!-- Vertical Asymptote x = 2 -> (260) -->
  <line x1="260" y1="40" x2="260" y2="230" stroke="#dc2626" stroke-width="2" stroke-dasharray="5,4"/>
  <text x="268" y="60" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">អាស៊ីមតូតឈរ x = 2</text>

  <!-- Horizontal Asymptote y = 1 -> (120) -->
  <line x1="40" y1="120" x2="500" y2="120" stroke="#2563eb" stroke-width="2" stroke-dasharray="5,4"/>
  <text x="360" y="112" font-family="sans-serif" font-size="11" font-weight="bold" fill="#2563eb">អាស៊ីមតូតដេក y = 1</text>

  <!-- Hyperbola curves -->
  <!-- Left branch -->
  <path d="M 80,135 Q 220,140 245,230" fill="none" stroke="#7c3aed" stroke-width="3"/>
  <!-- Right branch -->
  <path d="M 275,40 Q 295,100 460,110" fill="none" stroke="#7c3aed" stroke-width="3"/>
  <text x="380" y="70" font-family="sans-serif" font-size="12" font-weight="bold" fill="#7c3aed">y = (x + 1)/(x - 2)</text>
</svg>
`);

// 10. Frequency Distribution & Graphical Representation (Lesson 19)
export const SVG_FREQUENCY_HISTOGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 250" width="100%" height="100%">
  <rect width="540" height="250" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">អ៊ីស្តូក្រាម និងពហុកោណប្រេកង់ (Histogram &amp; Frequency Polygon)</text>

  <!-- Axes -->
  <line x1="60" y1="200" x2="480" y2="200" stroke="#475569" stroke-width="2"/>
  <line x1="80" y1="210" x2="80" y2="45" stroke="#475569" stroke-width="2"/>
  <text x="485" y="204" font-family="sans-serif" font-size="11" fill="#475569">ថ្នាក់ពិន្ទុ</text>
  <text x="80" y="38" font-family="sans-serif" font-size="11" fill="#475569" text-anchor="middle">ប្រេកង់ (f)</text>

  <!-- Histogram bars: width 60 -->
  <!-- Bar 1: 10-20 (h = 50) -->
  <rect x="110" y="150" width="60" height="50" fill="#93c5fd" stroke="#2563eb" stroke-width="1.5"/>
  <!-- Bar 2: 20-30 (h = 100) -->
  <rect x="170" y="100" width="60" height="100" fill="#93c5fd" stroke="#2563eb" stroke-width="1.5"/>
  <!-- Bar 3: 30-40 (h = 130) -->
  <rect x="230" y="70" width="60" height="130" fill="#60a5fa" stroke="#2563eb" stroke-width="1.5"/>
  <!-- Bar 4: 40-50 (h = 80) -->
  <rect x="290" y="120" width="60" height="80" fill="#93c5fd" stroke="#2563eb" stroke-width="1.5"/>
  <!-- Bar 5: 50-60 (h = 40) -->
  <rect x="350" y="160" width="60" height="40" fill="#93c5fd" stroke="#2563eb" stroke-width="1.5"/>

  <!-- Frequency Polygon (lines connecting midpoints) -->
  <polyline points="80,200 140,150 200,100 260,70 320,120 380,160 440,200" fill="none" stroke="#dc2626" stroke-width="2.5"/>
  <circle cx="140" cy="150" r="4" fill="#dc2626"/>
  <circle cx="200" cy="100" r="4" fill="#dc2626"/>
  <circle cx="260" cy="70" r="4" fill="#dc2626"/>
  <circle cx="320" cy="120" r="4" fill="#dc2626"/>
  <circle cx="380" cy="160" r="4" fill="#dc2626"/>

  <!-- Labels -->
  <text x="140" y="218" font-family="sans-serif" font-size="10" fill="#475569" text-anchor="middle">15</text>
  <text x="200" y="218" font-family="sans-serif" font-size="10" fill="#475569" text-anchor="middle">25</text>
  <text x="260" y="218" font-family="sans-serif" font-size="10" fill="#475569" text-anchor="middle">35</text>
  <text x="320" y="218" font-family="sans-serif" font-size="10" fill="#475569" text-anchor="middle">45</text>
  <text x="380" y="218" font-family="sans-serif" font-size="10" fill="#475569" text-anchor="middle">55</text>
</svg>
`);

// 11. Measures of Position (Lesson 20)
export const SVG_MEASURES_OF_POSITION = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 240" width="100%" height="100%">
  <rect width="540" height="240" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ដ្យាក្រាមប្រអប់ (Box-and-Whisker Plot &amp; Quartiles)</text>

  <!-- Number Line at bottom -->
  <line x1="60" y1="180" x2="480" y2="180" stroke="#475569" stroke-width="2"/>
  <g font-family="sans-serif" font-size="10" fill="#64748b" text-anchor="middle">
    <text x="100" y="196">10</text>
    <text x="180" y="196">20</text>
    <text x="260" y="196">30</text>
    <text x="340" y="196">40</text>
    <text x="420" y="196">50</text>
  </g>

  <!-- Box from Q1(180) to Q3(340), height 60, centered at y = 100 -->
  <!-- Left Whisker: Min(100) to Q1(180) -->
  <line x1="100" y1="100" x2="180" y2="100" stroke="#334155" stroke-width="2"/>
  <line x1="100" y1="85" x2="100" y2="115" stroke="#334155" stroke-width="2.5"/>
  <text x="100" y="75" font-family="sans-serif" font-size="11" font-weight="bold" fill="#334155" text-anchor="middle">Min = 10</text>

  <!-- The Box -->
  <rect x="180" y="70" width="160" height="60" fill="#dbeafe" stroke="#2563eb" stroke-width="2.5"/>

  <!-- Median Q2 = 250 -->
  <line x1="250" y1="70" x2="250" y2="130" stroke="#dc2626" stroke-width="3"/>
  <text x="250" y="60" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626" text-anchor="middle">មេដ្យាន Q₂ = 28</text>

  <!-- Right Whisker: Q3(340) to Max(420) -->
  <line x1="340" y1="100" x2="420" y2="100" stroke="#334155" stroke-width="2"/>
  <line x1="420" y1="85" x2="420" y2="115" stroke="#334155" stroke-width="2.5"/>
  <text x="420" y="75" font-family="sans-serif" font-size="11" font-weight="bold" fill="#334155" text-anchor="middle">Max = 50</text>

  <!-- Q1 and Q3 labels -->
  <text x="180" y="148" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1e40af" text-anchor="middle">Q₁ = 20</text>
  <text x="340" y="148" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1e40af" text-anchor="middle">Q₃ = 40</text>

  <!-- IQR bracket -->
  <text x="260" y="165" font-family="sans-serif" font-size="11" font-weight="bold" fill="#16a34a" text-anchor="middle">IQR = Q₃ - Q₁ = 20</text>
</svg>
`);

// 12. Vectors and Vector Operations (Lesson 21)
export const SVG_VECTORS_OPERATIONS = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 240" width="100%" height="100%">
  <rect width="540" height="240" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ផលបូកវ៉ិចទ័រ វិធានត្រីកោណ និងប្រលេឡូក្រាម (Vector Addition)</text>

  <!-- Triangle law on left -->
  <g transform="translate(60, 50)">
    <!-- Vector u -->
    <line x1="20" y1="130" x2="110" y2="130" stroke="#2563eb" stroke-width="3"/>
    <polygon points="110,130 100,125 100,135" fill="#2563eb"/>
    <text x="65" y="148" font-family="sans-serif" font-size="11" font-weight="bold" fill="#2563eb">u</text>

    <!-- Vector v from tip of u -->
    <line x1="110" y1="130" x2="160" y2="40" stroke="#16a34a" stroke-width="3"/>
    <polygon points="160,40 150,47 157,56" fill="#16a34a"/>
    <text x="145" y="90" font-family="sans-serif" font-size="11" font-weight="bold" fill="#16a34a">v</text>

    <!-- Resultant u + v -->
    <line x1="20" y1="130" x2="160" y2="40" stroke="#dc2626" stroke-width="3" stroke-dasharray="5,4"/>
    <polygon points="160,40 148,44 154,53" fill="#dc2626"/>
    <text x="65" y="75" font-family="sans-serif" font-size="12" font-weight="bold" fill="#dc2626">u + v</text>
    <text x="90" y="170" font-family="sans-serif" font-size="11" font-weight="bold" fill="#334155" text-anchor="middle">វិធានត្រីកោណ</text>
  </g>

  <!-- Parallelogram law on right -->
  <g transform="translate(300, 50)">
    <polygon points="20,130 110,130 160,40 70,40" fill="#f1f5f9" stroke="#94a3b8" stroke-dasharray="3,3"/>
    <!-- u -->
    <line x1="20" y1="130" x2="110" y2="130" stroke="#2563eb" stroke-width="3"/>
    <polygon points="110,130 100,125 100,135" fill="#2563eb"/>
    <text x="65" y="148" font-family="sans-serif" font-size="11" font-weight="bold" fill="#2563eb">u</text>

    <!-- v from same origin -->
    <line x1="20" y1="130" x2="70" y2="40" stroke="#16a34a" stroke-width="3"/>
    <polygon points="70,40 62,49 71,53" fill="#16a34a"/>
    <text x="30" y="85" font-family="sans-serif" font-size="11" font-weight="bold" fill="#16a34a">v</text>

    <!-- Diagonal u + v -->
    <line x1="20" y1="130" x2="160" y2="40" stroke="#dc2626" stroke-width="3"/>
    <polygon points="160,40 148,44 154,53" fill="#dc2626"/>
    <text x="100" y="80" font-family="sans-serif" font-size="12" font-weight="bold" fill="#dc2626">u + v</text>
    <text x="90" y="170" font-family="sans-serif" font-size="11" font-weight="bold" fill="#334155" text-anchor="middle">វិធានប្រលេឡូក្រាម</text>
  </g>
</svg>
`);

// 13. Applications of Vectors (Lesson 22)
export const SVG_VECTORS_APPLICATIONS = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 240" width="100%" height="100%">
  <rect width="540" height="240" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ផលគុណស្កាលែ និងលក្ខខណ្ឌកែងនៃវ៉ិចទ័រ (Dot Product &amp; Orthogonality)</text>

  <!-- Left: Angle theta between u and v -->
  <g transform="translate(80, 60)">
    <line x1="20" y1="120" x2="140" y2="120" stroke="#2563eb" stroke-width="3"/>
    <polygon points="140,120 130,115 130,125" fill="#2563eb"/>
    <text x="145" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="#2563eb">u</text>

    <line x1="20" y1="120" x2="105" y2="45" stroke="#16a34a" stroke-width="3"/>
    <polygon points="105,45 94,49 100,56" fill="#16a34a"/>
    <text x="105" y="38" font-family="sans-serif" font-size="11" font-weight="bold" fill="#16a34a">v</text>

    <!-- Angle arc -->
    <path d="M 50,120 A 30 30 0 0 0 45,98" fill="none" stroke="#ea580c" stroke-width="2"/>
    <text x="56" y="110" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ea580c">θ</text>
    <text x="75" y="150" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1e293b">u · v = |u||v|cos θ</text>
  </g>

  <!-- Right: Orthogonal vectors (90 deg) -->
  <g transform="translate(320, 60)">
    <line x1="30" y1="120" x2="150" y2="120" stroke="#2563eb" stroke-width="3"/>
    <polygon points="150,120 140,115 140,125" fill="#2563eb"/>
    <text x="155" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="#2563eb">u</text>

    <line x1="30" y1="120" x2="30" y2="25" stroke="#dc2626" stroke-width="3"/>
    <polygon points="30,25 25,35 35,35" fill="#dc2626"/>
    <text x="35" y="25" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">v</text>

    <!-- Right angle box -->
    <rect x="30" y="105" width="15" height="15" fill="none" stroke="#334155" stroke-width="1.5"/>
    <text x="80" y="150" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">u ⊥ v ⇔ u · v = 0</text>
  </g>
</svg>
`);

// 14. Translation (Lesson 23)
export const SVG_TRANSFORMATION_TRANSLATION = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 240" width="100%" height="100%">
  <rect width="540" height="240" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ការបំប្លែងកិលតាមវ៉ិចទ័រ u(a, b) (Vector Translation)</text>

  <!-- Original triangle ABC -->
  <polygon points="100,160 160,160 120,90" fill="#dbeafe" stroke="#2563eb" stroke-width="2.5"/>
  <text x="90" y="175" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1e40af">A</text>
  <text x="165" y="175" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1e40af">B</text>
  <text x="115" y="80" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1e40af">C</text>

  <!-- Translation vectors (dashed green) -->
  <line x1="100" y1="160" x2="260" y2="120" stroke="#16a34a" stroke-width="2" stroke-dasharray="4,4"/>
  <line x1="160" y1="160" x2="320" y2="120" stroke="#16a34a" stroke-width="2" stroke-dasharray="4,4"/>
  <line x1="120" y1="90" x2="280" y2="50" stroke="#16a34a" stroke-width="2" stroke-dasharray="4,4"/>

  <!-- Image triangle A'B'C' -->
  <polygon points="260,120 320,120 280,50" fill="#dcfce7" stroke="#16a34a" stroke-width="2.5"/>
  <text x="250" y="135" font-family="sans-serif" font-size="11" font-weight="bold" fill="#15803d">A'</text>
  <text x="325" y="135" font-family="sans-serif" font-size="11" font-weight="bold" fill="#15803d">B'</text>
  <text x="275" y="40" font-family="sans-serif" font-size="11" font-weight="bold" fill="#15803d">C'</text>

  <!-- Coordinate mapping box -->
  <g transform="translate(370, 70)">
    <rect width="140" height="90" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <text x="70" y="24" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle" fill="#1e293b">រូបមន្តកូអរដោនេ</text>
    <text x="20" y="48" font-family="sans-serif" font-size="11" fill="#2563eb">x' = x + a</text>
    <text x="20" y="70" font-family="sans-serif" font-size="11" fill="#2563eb">y' = y + b</text>
  </g>
</svg>
`);

// 15. Reflection (Lesson 24)
export const SVG_TRANSFORMATION_REFLECTION = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 240" width="100%" height="100%">
  <rect width="540" height="240" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ការបំប្លែងឆ្លុះធៀបនឹងអ័ក្ស (Line Reflection)</text>

  <!-- Mirror line (Axis of reflection) -->
  <line x1="270" y1="40" x2="270" y2="210" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="5,4"/>
  <text x="270" y="225" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626" text-anchor="middle">អ័ក្សឆ្លុះ (Mirror Line)</text>

  <!-- Original triangle on left -->
  <polygon points="130,160 210,160 170,80" fill="#dbeafe" stroke="#2563eb" stroke-width="2.5"/>
  <circle cx="170" cy="80" r="4" fill="#2563eb"/>
  <text x="165" y="70" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1e40af">A(x, y)</text>

  <!-- Reflected triangle on right -->
  <polygon points="410,160 330,160 370,80" fill="#fef3c7" stroke="#d97706" stroke-width="2.5"/>
  <circle cx="370" cy="80" r="4" fill="#d97706"/>
  <text x="365" y="70" font-family="sans-serif" font-size="11" font-weight="bold" fill="#b45309">A'(-x, y)</text>

  <!-- Perpendicular connector -->
  <line x1="170" y1="80" x2="370" y2="80" stroke="#64748b" stroke-dasharray="3,3"/>
  <!-- Distance indicators -->
  <text x="220" y="75" font-family="sans-serif" font-size="10" fill="#64748b">d</text>
  <text x="315" y="75" font-family="sans-serif" font-size="10" fill="#64748b">d</text>
</svg>
`);

// 16. Rotation (Lesson 25)
export const SVG_TRANSFORMATION_ROTATION = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 240" width="100%" height="100%">
  <rect width="540" height="240" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ការបំប្លែងវិលជុំវិញផ្ចិត O (Rotation about Origin)</text>

  <g transform="translate(240, 140)">
    <!-- Axes -->
    <line x1="-120" y1="0" x2="160" y2="0" stroke="#94a3b8" stroke-width="1.5"/>
    <line x1="0" y1="-100" x2="0" y2="60" stroke="#94a3b8" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="4" fill="#334155"/>
    <text x="-12" y="16" font-family="sans-serif" font-size="11" fill="#334155">O</text>

    <!-- Point P(3, 1) -> (90, -30) -->
    <line x1="0" y1="0" x2="90" y2="-30" stroke="#2563eb" stroke-width="2.5"/>
    <circle cx="90" cy="-30" r="5" fill="#2563eb"/>
    <text x="98" y="-28" font-family="sans-serif" font-size="11" font-weight="bold" fill="#2563eb">P(x, y)</text>

    <!-- 90 deg counterclockwise rotation -> P'(-1, 3) -> (30, -90) -->
    <line x1="0" y1="0" x2="30" y2="-90" stroke="#dc2626" stroke-width="2.5"/>
    <circle cx="30" cy="-90" r="5" fill="#dc2626"/>
    <text x="36" y="-95" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">P'(-y, x) (+90°)</text>

    <!-- Arc showing 90 deg rotation -->
    <path d="M 60,-20 A 63 63 0 0 0 20,-60" fill="none" stroke="#ea580c" stroke-width="2" marker-end="url(#arr)"/>
    <text x="45" y="-38" font-family="sans-serif" font-size="10" font-weight="bold" fill="#ea580c">+90°</text>
  </g>

  <!-- Rules Box on right -->
  <g transform="translate(390, 50)">
    <rect width="130" height="90" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <text x="65" y="22" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle" fill="#1e293b">វិលជុំវិញផ្ចិត O(0,0)</text>
    <text x="12" y="44" font-family="sans-serif" font-size="10" fill="#2563eb">+90°: (-y, x)</text>
    <text x="12" y="62" font-family="sans-serif" font-size="10" fill="#dc2626">180°: (-x, -y)</text>
    <text x="12" y="80" font-family="sans-serif" font-size="10" fill="#16a34a">270°: (y, -x)</text>
  </g>
</svg>
`);

// 17. Glide Reflection (Lesson 26)
export const SVG_TRANSFORMATION_GLIDE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 240" width="100%" height="100%">
  <rect width="540" height="240" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ការបំប្លែងចាំង (Glide Reflection = Translation + Reflection)</text>

  <!-- Axis of glide reflection -->
  <line x1="40" y1="120" x2="500" y2="120" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="5,4"/>
  <text x="495" y="112" font-family="sans-serif" font-size="10" font-weight="bold" fill="#dc2626" text-anchor="end">អ័ក្សចាំង (Glide Axis)</text>

  <!-- Step 1: Initial Shape (Triangle 1) -->
  <polygon points="80,105 130,105 105,50" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
  <text x="105" y="42" font-family="sans-serif" font-size="10" font-weight="bold" fill="#2563eb" text-anchor="middle">១. រូបដើម (Original)</text>

  <!-- Step 2: Translation along axis (Triangle 2 dashed) -->
  <line x1="130" y1="80" x2="230" y2="80" stroke="#16a34a" stroke-width="2" stroke-dasharray="4,4"/>
  <text x="180" y="72" font-family="sans-serif" font-size="10" font-weight="bold" fill="#16a34a" text-anchor="middle">កិល (Translate)</text>
  <polygon points="230,105 280,105 255,50" fill="none" stroke="#16a34a" stroke-width="2" stroke-dasharray="3,3"/>

  <!-- Step 3: Reflection across axis (Triangle 3) -->
  <line x1="255" y1="105" x2="255" y2="135" stroke="#ea580c" stroke-width="2" stroke-dasharray="3,3"/>
  <text x="260" y="125" font-family="sans-serif" font-size="10" font-weight="bold" fill="#ea580c">ឆ្លុះ (Reflect)</text>
  <polygon points="230,135 280,135 255,190" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <text x="255" y="205" font-family="sans-serif" font-size="10" font-weight="bold" fill="#d97706" text-anchor="middle">២. រូបចាំង (Glide Image)</text>

  <!-- Footprint demonstration -->
  <g transform="translate(370, 70)">
    <rect width="130" height="85" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <text x="65" y="22" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle" fill="#1e293b">គំរូស្នាមជើងដើរ</text>
    <text x="12" y="46" font-family="sans-serif" font-size="10" fill="#475569">• កិលស្របនឹងអ័ក្ស</text>
    <text x="12" y="64" font-family="sans-serif" font-size="10" fill="#475569">• ឆ្លុះធៀបនឹងអ័ក្ស</text>
  </g>
</svg>
`);
