// SVG Visual Diagrams for Grade 11 Mathematics
// Self-contained, responsive SVG Data URIs for Advanced Algebra, Functions, Trigonometry, Linear Transformations, Calculus, Statistics, and 3D Solid Geometry

export function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// 1. Exponential & Logarithmic Graphs (Lessons 7 & 8)
export const SVG_EXP_LOG_GRAPHS = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 250" width="100%" height="100%">
  <rect width="540" height="250" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">អនុគមន៍អិចស្ប៉ូណង់ស្យែល និងលោការីត (y = e^x &amp; y = ln x)</text>

  <!-- Axes -->
  <line x1="50" y1="180" x2="490" y2="180" stroke="#475569" stroke-width="1.8"/>
  <line x1="160" y1="230" x2="160" y2="35" stroke="#475569" stroke-width="1.8"/>
  <text x="495" y="184" font-family="sans-serif" font-size="11" fill="#475569">x</text>
  <text x="160" y="30" font-family="sans-serif" font-size="11" fill="#475569" text-anchor="middle">y</text>

  <!-- Symmetry line y = x -->
  <line x1="70" y1="210" x2="350" y2="40" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,4"/>
  <text x="355" y="45" font-family="sans-serif" font-size="10" fill="#64748b">y = x</text>

  <!-- Exponential curve y = e^x -->
  <path d="M 60,178 Q 150,175 160,140 T 230,40" fill="none" stroke="#2563eb" stroke-width="2.5"/>
  <circle cx="160" cy="140" r="4" fill="#2563eb"/>
  <text x="145" y="135" font-family="sans-serif" font-size="10" font-weight="bold" fill="#1e40af">(0, 1)</text>
  <text x="235" y="55" font-family="sans-serif" font-size="11" font-weight="bold" fill="#2563eb">y = e^x</text>

  <!-- Logarithmic curve y = ln x -->
  <path d="M 165,225 Q 168,185 200,180 T 360,135" fill="none" stroke="#dc2626" stroke-width="2.5"/>
  <circle cx="200" cy="180" r="4" fill="#dc2626"/>
  <text x="200" y="196" font-family="sans-serif" font-size="10" font-weight="bold" fill="#b91c1c">(1, 0)</text>
  <text x="365" y="140" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">y = ln x</text>

  <!-- Info box -->
  <g transform="translate(370, 165)">
    <rect width="150" height="65" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2"/>
    <text x="12" y="22" font-family="sans-serif" font-size="10" font-weight="bold" fill="#1e293b">អនុគមន៍ច្រាសគ្នា</text>
    <text x="12" y="40" font-family="sans-serif" font-size="10" fill="#2563eb">• e^(ln x) = x (x &gt; 0)</text>
    <text x="12" y="56" font-family="sans-serif" font-size="10" fill="#dc2626">• ln(e^x) = x</text>
  </g>
</svg>
`);

// 2. Trigonometric Functions & Sine Wave (Lesson 9)
export const SVG_TRIG_FUNCTIONS = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 250" width="100%" height="100%">
  <rect width="540" height="250" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ខ្សែកោងរលកស៊ីនុស y = sin x (Sine Wave &amp; Period 2π)</text>

  <!-- Axes -->
  <line x1="40" y1="130" x2="500" y2="130" stroke="#475569" stroke-width="1.8"/>
  <line x1="80" y1="220" x2="80" y2="40" stroke="#475569" stroke-width="1.8"/>
  <text x="505" y="134" font-family="sans-serif" font-size="11" fill="#475569">x</text>
  <text x="80" y="32" font-family="sans-serif" font-size="11" fill="#475569" text-anchor="middle">y</text>

  <!-- Bounds y = 1, y = -1 -->
  <line x1="80" y1="80" x2="480" y2="80" stroke="#94a3b8" stroke-dasharray="3,3"/>
  <line x1="80" y1="180" x2="480" y2="180" stroke="#94a3b8" stroke-dasharray="3,3"/>
  <text x="70" y="84" font-family="sans-serif" font-size="10" fill="#64748b" text-anchor="end">1</text>
  <text x="70" y="184" font-family="sans-serif" font-size="10" fill="#64748b" text-anchor="end">-1</text>

  <!-- Sine curve over [0, 2pi] and beyond -->
  <!-- 0 at (80,130), pi/2 at (170,80), pi at (260,130), 3pi/2 at (350,180), 2pi at (440,130) -->
  <path d="M 80,130 Q 125,80 170,80 T 260,130 T 350,180 T 440,130" fill="none" stroke="#2563eb" stroke-width="3"/>

  <!-- Key points -->
  <circle cx="80" cy="130" r="4" fill="#2563eb"/>
  <circle cx="170" cy="80" r="4.5" fill="#dc2626"/>
  <circle cx="260" cy="130" r="4" fill="#2563eb"/>
  <circle cx="350" cy="180" r="4.5" fill="#dc2626"/>
  <circle cx="440" cy="130" r="4" fill="#2563eb"/>

  <!-- Labels -->
  <text x="170" y="65" font-family="sans-serif" font-size="10" font-weight="bold" fill="#dc2626" text-anchor="middle">(π/2, 1)</text>
  <text x="260" y="148" font-family="sans-serif" font-size="10" fill="#475569" text-anchor="middle">π</text>
  <text x="350" y="200" font-family="sans-serif" font-size="10" font-weight="bold" fill="#dc2626" text-anchor="middle">(3π/2, -1)</text>
  <text x="440" y="148" font-family="sans-serif" font-size="10" font-weight="bold" fill="#15803d" text-anchor="middle">2π (ខួប T = 2π)</text>
</svg>
`);

// 3. Trigonometric Formulas & Double Angle (Lesson 10)
export const SVG_TRIG_IDENTITIES = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 240" width="100%" height="100%">
  <rect width="540" height="240" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">រូបមន្តត្រីកោណមាត្រទ្វេមុំ និងផលបូក (Trigonometric Identities)</text>

  <!-- Left: Unit Circle -->
  <g transform="translate(130, 130)">
    <circle cx="0" cy="0" r="75" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
    <line x1="-90" y1="0" x2="90" y2="0" stroke="#475569" stroke-width="1.5"/>
    <line x1="0" y1="-85" x2="0" y2="85" stroke="#475569" stroke-width="1.5"/>
    <!-- Angle alpha -->
    <line x1="0" y1="0" x2="65" y2="-37" stroke="#dc2626" stroke-width="2"/>
    <circle cx="65" cy="-37" r="4" fill="#dc2626"/>
    <text x="72" y="-40" font-family="sans-serif" font-size="10" font-weight="bold" fill="#dc2626">P(cos α, sin α)</text>
  </g>

  <!-- Right: Identity Box -->
  <g transform="translate(250, 45)">
    <rect width="260" height="170" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <text x="130" y="24" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#1e293b">រូបមន្តគ្រឹះសំខាន់ៗ</text>
    <text x="15" y="52" font-family="sans-serif" font-size="11" fill="#2563eb">sin(a + b) = sin a cos b + cos a sin b</text>
    <text x="15" y="74" font-family="sans-serif" font-size="11" fill="#2563eb">cos(a + b) = cos a cos b - sin a sin b</text>
    <line x1="15" y1="88" x2="245" y2="88" stroke="#e2e8f0"/>
    <text x="15" y="110" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">sin 2a = 2 sin a cos a</text>
    <text x="15" y="132" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">cos 2a = cos²a - sin²a = 2cos²a - 1</text>
    <text x="15" y="154" font-family="sans-serif" font-size="11" fill="#15803d">tan 2a = (2 tan a) / (1 - tan²a)</text>
  </g>
</svg>
`);

// 4. Inverse Trigonometric Functions (Lesson 11)
export const SVG_INVERSE_TRIG = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 240" width="100%" height="100%">
  <rect width="540" height="240" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">អនុគមន៍ច្រាស y = arcsin x (Inverse Sine)</text>

  <g transform="translate(180, 125)">
    <!-- Axes -->
    <line x1="-120" y1="0" x2="120" y2="0" stroke="#475569" stroke-width="1.8"/>
    <line x1="0" y1="-80" x2="0" y2="80" stroke="#475569" stroke-width="1.8"/>
    <text x="125" y="4" font-family="sans-serif" font-size="11" fill="#475569">x</text>
    <text x="0" y="-85" font-family="sans-serif" font-size="11" fill="#475569" text-anchor="middle">y</text>

    <!-- Domain [-1, 1] on x-axis: scale 80px = 1 -->
    <line x1="-80" y1="-3" x2="-80" y2="3" stroke="#475569" stroke-width="2"/>
    <line x1="80" y1="-3" x2="80" y2="3" stroke="#475569" stroke-width="2"/>
    <text x="-80" y="18" font-family="sans-serif" font-size="10" fill="#475569" text-anchor="middle">-1</text>
    <text x="80" y="18" font-family="sans-serif" font-size="10" fill="#475569" text-anchor="middle">1</text>

    <!-- Range [-pi/2, pi/2] on y-axis: scale 50px = pi/2 -->
    <line x1="-3" y1="-50" x2="3" y2="-50" stroke="#475569" stroke-width="2"/>
    <line x1="-3" y1="50" x2="3" y2="50" stroke="#475569" stroke-width="2"/>
    <text x="-10" y="-46" font-family="sans-serif" font-size="10" fill="#475569" text-anchor="end">π/2</text>
    <text x="-10" y="54" font-family="sans-serif" font-size="10" fill="#475569" text-anchor="end">-π/2</text>

    <!-- Curve y = arcsin x -->
    <path d="M -80,50 Q -30,40 0,0 T 80,-50" fill="none" stroke="#7c3aed" stroke-width="3"/>
    <circle cx="-80" cy="50" r="4.5" fill="#7c3aed"/>
    <circle cx="80" cy="-50" r="4.5" fill="#7c3aed"/>
  </g>

  <!-- Summary box -->
  <g transform="translate(340, 60)">
    <rect width="170" height="130" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <text x="85" y="24" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle" fill="#1e293b">លក្ខណៈ y = arcsin x</text>
    <text x="12" y="52" font-family="sans-serif" font-size="11" fill="#334155">• ដែនកំណត់: [-1, 1]</text>
    <text x="12" y="78" font-family="sans-serif" font-size="11" fill="#334155">• សំណុំរូប: [-π/2, π/2]</text>
    <text x="12" y="104" font-family="sans-serif" font-size="11" fill="#7c3aed">• ជាអនុគមន៍សេស</text>
  </g>
</svg>
`);

// 5. Linear Transformations & Matrix Mapping (Lesson 16)
export const SVG_LINEAR_TRANSFORMATIONS = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 240" width="100%" height="100%">
  <rect width="540" height="240" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ការបំប្លែងលីនេអ៊ែរតាមម៉ាទ្រីស (Matrix Transformation: T(x) = Ax)</text>

  <!-- Left: Unit square -->
  <g transform="translate(60, 50)">
    <line x1="0" y1="120" x2="140" y2="120" stroke="#64748b" stroke-width="1.5"/>
    <line x1="20" y1="140" x2="20" y2="20" stroke="#64748b" stroke-width="1.5"/>
    <!-- Unit Square (20,120) to (80,60) -->
    <polygon points="20,120 80,120 80,60 20,60" fill="#bfdbfe" opacity="0.7" stroke="#2563eb" stroke-width="2"/>
    <text x="50" y="95" font-family="sans-serif" font-size="10" font-weight="bold" fill="#1e40af" text-anchor="middle">ការេឯកតា</text>
    <text x="50" y="160" font-family="sans-serif" font-size="11" fill="#334155" text-anchor="middle">ប្លង់ដើម</text>
  </g>

  <!-- Arrow -->
  <g transform="translate(235, 100)">
    <line x1="0" y1="10" x2="60" y2="10" stroke="#dc2626" stroke-width="3"/>
    <polygon points="60,10 50,5 50,15" fill="#dc2626"/>
    <text x="30" y="-2" font-family="sans-serif" font-size="12" font-weight="bold" fill="#dc2626" text-anchor="middle">T(v) = Av</text>
  </g>

  <!-- Right: Transformed Parallelogram -->
  <g transform="translate(330, 50)">
    <line x1="0" y1="120" x2="160" y2="120" stroke="#64748b" stroke-width="1.5"/>
    <line x1="20" y1="140" x2="20" y2="20" stroke="#64748b" stroke-width="1.5"/>
    <!-- Sheared parallelogram -->
    <polygon points="20,120 100,120 130,40 50,40" fill="#bbf7d0" opacity="0.7" stroke="#16a34a" stroke-width="2"/>
    <text x="75" y="85" font-family="sans-serif" font-size="10" font-weight="bold" fill="#15803d" text-anchor="middle">ប្រលេឡូក្រាម</text>
    <text x="75" y="160" font-family="sans-serif" font-size="11" fill="#334155" text-anchor="middle">រូបភាពបំប្លែង</text>
  </g>
</svg>
`);

// 6. Limits, Tangent Line & Derivative (Lesson 17)
export const SVG_LIMITS_DERIVATIVES = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 240" width="100%" height="100%">
  <rect width="540" height="240" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">និយមន័យដេរីវេជាលីមីត និងបន្ទាត់ប៉ះ (Tangent &amp; Derivative)</text>

  <!-- Axes -->
  <line x1="50" y1="190" x2="490" y2="190" stroke="#475569" stroke-width="1.8"/>
  <line x1="100" y1="220" x2="100" y2="40" stroke="#475569" stroke-width="1.8"/>

  <!-- Curve f(x) -->
  <path d="M 90,180 Q 220,175 320,100 T 450,40" fill="none" stroke="#2563eb" stroke-width="3"/>
  <text x="440" y="30" font-family="sans-serif" font-size="11" font-weight="bold" fill="#2563eb">y = f(x)</text>

  <!-- Point P(x0, f(x0)) at (240, 145) -->
  <circle cx="240" cy="145" r="5" fill="#dc2626"/>
  <text x="230" y="165" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">P(x₀, f(x₀))</text>

  <!-- Secant line (P to Q) dashed -->
  <line x1="160" y1="180" x2="380" y2="80" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4,4"/>
  <circle cx="340" cy="98" r="4" fill="#64748b"/>
  <text x="350" y="95" font-family="sans-serif" font-size="10" fill="#64748b">Q(x₀ + h)</text>

  <!-- Tangent line (limit as h -> 0) in green -->
  <line x1="140" y1="190" x2="360" y2="90" stroke="#16a34a" stroke-width="2.5"/>
  <text x="345" y="75" font-family="sans-serif" font-size="11" font-weight="bold" fill="#16a34a">បន្ទាត់ប៉ះ (Slope m = f'(x₀))</text>

  <!-- Limit formula box -->
  <g transform="translate(250, 185)">
    <text x="0" y="20" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e293b">f'(x₀) = lim(h→0) [f(x₀ + h) - f(x₀)] / h</text>
  </g>
</svg>
`);

// 7. Function Variation & Curve Sketching (Lesson 19)
export const SVG_CURVE_SKETCHING = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 240" width="100%" height="100%">
  <rect width="540" height="240" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">អថេរភាព និងក្រាបអនុគមន៍ (Extrema &amp; Inflection Point)</text>

  <!-- Axes -->
  <line x1="40" y1="130" x2="500" y2="130" stroke="#475569" stroke-width="1.8"/>
  <line x1="120" y1="220" x2="120" y2="40" stroke="#475569" stroke-width="1.8"/>

  <!-- Cubic curve with local max and local min -->
  <path d="M 80,210 C 150,40 210,40 270,130 C 330,220 390,220 460,50" fill="none" stroke="#2563eb" stroke-width="3"/>

  <!-- Local Maximum at (180, 68) -->
  <circle cx="180" cy="68" r="5" fill="#dc2626"/>
  <line x1="140" y1="68" x2="220" y2="68" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="3,3"/>
  <text x="180" y="55" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626" text-anchor="middle">អតិបរមាធៀប (f' = 0)</text>

  <!-- Inflection Point at (270, 130) -->
  <circle cx="270" cy="130" r="5" fill="#ea580c"/>
  <text x="280" y="125" font-family="sans-serif" font-size="10" font-weight="bold" fill="#ea580c">ចំណុចរបត់ (f'' = 0)</text>

  <!-- Local Minimum at (360, 192) -->
  <circle cx="360" cy="192" r="5" fill="#16a34a"/>
  <line x1="320" y1="192" x2="400" y2="192" stroke="#16a34a" stroke-width="1.5" stroke-dasharray="3,3"/>
  <text x="360" y="212" font-family="sans-serif" font-size="11" font-weight="bold" fill="#16a34a" text-anchor="middle">អប្បបរមាធៀប (f' = 0)</text>
</svg>
`);

// 8. Measures of Dispersion & Variance (Lessons 24 & 25)
export const SVG_MEASURES_DISPERSION = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 240" width="100%" height="100%">
  <rect width="540" height="240" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">រង្វាស់នៃគម្លាត និងវ៉ារ្យ៉ង់ (Measures of Dispersion &amp; Normal Curve)</text>

  <!-- Bell Curve (Normal Distribution) -->
  <path d="M 60,190 Q 210,190 270,60 Q 330,190 480,190" fill="#eff6ff" stroke="#2563eb" stroke-width="2.5"/>
  <line x1="50" y1="190" x2="490" y2="190" stroke="#475569" stroke-width="2"/>

  <!-- Mean line mu -->
  <line x1="270" y1="60" x2="270" y2="190" stroke="#dc2626" stroke-width="2" stroke-dasharray="4,3"/>
  <text x="270" y="206" font-family="sans-serif" font-size="12" font-weight="bold" fill="#dc2626" text-anchor="middle">មធ្យម μ</text>

  <!-- Standard deviation lines mu - sigma and mu + sigma -->
  <line x1="210" y1="110" x2="210" y2="190" stroke="#16a34a" stroke-width="1.5" stroke-dasharray="3,3"/>
  <line x1="330" y1="110" x2="330" y2="190" stroke="#16a34a" stroke-width="1.5" stroke-dasharray="3,3"/>
  <text x="210" y="206" font-family="sans-serif" font-size="10" fill="#16a34a" text-anchor="middle">μ - σ</text>
  <text x="330" y="206" font-family="sans-serif" font-size="10" fill="#16a34a" text-anchor="middle">μ + σ</text>

  <!-- 68% bracket label -->
  <text x="270" y="130" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1e40af" text-anchor="middle">≈ 68.2% នៃទិន្នន័យ</text>
</svg>
`);

// 9. Solid Geometry & 3D Space (Lesson 26)
export const SVG_SOLID_GEOMETRY = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 240" width="100%" height="100%">
  <rect width="540" height="240" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ធរណីមាត្រក្នុងលំហ 3D (Solid Geometry: Cube &amp; Diagonals)</text>

  <g transform="translate(180, 50)">
    <!-- Back face -->
    <rect x="50" y="20" width="100" height="100" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,4"/>
    <!-- Connecting edges dashed -->
    <line x1="0" y1="160" x2="50" y2="120" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,4"/>
    <line x1="0" y1="60" x2="50" y2="20" stroke="#2563eb" stroke-width="2"/>
    <line x1="100" y1="60" x2="150" y2="20" stroke="#2563eb" stroke-width="2"/>
    <line x1="100" y1="160" x2="150" y2="120" stroke="#2563eb" stroke-width="2"/>

    <!-- Front face -->
    <rect x="0" y="60" width="100" height="100" fill="#dbeafe" opacity="0.6" stroke="#2563eb" stroke-width="2"/>

    <!-- Space diagonal from (0, 160) to (150, 20) in red -->
    <line x1="0" y1="160" x2="150" y2="20" stroke="#dc2626" stroke-width="2.5"/>
    <text x="90" y="90" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">d = a√3</text>
  </g>
</svg>
`);

// 10. Parallel Lines and Planes in Space (Lesson 27)
export const SVG_PARALLEL_PLANES_SPACE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 240" width="100%" height="100%">
  <rect width="540" height="240" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">បន្ទាត់និងប្លង់ស្របក្នុងលំហ (Parallel Planes (P) // (Q))</text>

  <!-- Plane (P) Upper -->
  <polygon points="120,80 380,80 320,45 60,45" fill="#dbeafe" opacity="0.7" stroke="#2563eb" stroke-width="2"/>
  <text x="140" y="65" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e40af">ប្លង់ (P)</text>
  <!-- Line d in plane P -->
  <line x1="100" y1="60" x2="260" y2="60" stroke="#1d4ed8" stroke-width="2"/>
  <text x="270" y="63" font-family="sans-serif" font-size="10" fill="#1d4ed8">(d)</text>

  <!-- Plane (Q) Lower -->
  <polygon points="120,185 380,185 320,150 60,150" fill="#dcfce7" opacity="0.7" stroke="#16a34a" stroke-width="2"/>
  <text x="140" y="170" font-family="sans-serif" font-size="12" font-weight="bold" fill="#15803d">ប្លង់ (Q)</text>

  <!-- Distance between planes -->
  <line x1="330" y1="65" x2="330" y2="165" stroke="#dc2626" stroke-width="2" stroke-dasharray="4,4"/>
  <text x="340" y="120" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">ចម្ងាយ d((P),(Q))</text>
</svg>
`);

// 11. Orthogonality in Space (Lesson 28)
export const SVG_ORTHOGONALITY_SPACE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 240" width="100%" height="100%">
  <rect width="540" height="240" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ភាពអរតូកូណាល់ក្នុងលំហ (Line Perpendicular to Plane)</text>

  <!-- Plane (P) -->
  <polygon points="100,200 440,200 370,120 30,120" fill="#f1f5f9" stroke="#64748b" stroke-width="2"/>
  <text x="60" y="145" font-family="sans-serif" font-size="12" font-weight="bold" fill="#475569">ប្លង់ (P)</text>

  <!-- Intersecting lines in plane P: a and b passing through H -->
  <!-- Intersection H at (230, 160) -->
  <line x1="120" y1="170" x2="340" y2="150" stroke="#0284c7" stroke-width="2"/>
  <text x="345" y="154" font-family="sans-serif" font-size="10" fill="#0284c7">(a)</text>
  <line x1="160" y1="135" x2="300" y2="185" stroke="#0284c7" stroke-width="2"/>
  <text x="305" y="190" font-family="sans-serif" font-size="10" fill="#0284c7">(b)</text>

  <!-- Vertical line (d) perpendicular to plane P at H -->
  <!-- Above plane -->
  <line x1="230" y1="40" x2="230" y2="160" stroke="#dc2626" stroke-width="3"/>
  <text x="238" y="55" font-family="sans-serif" font-size="12" font-weight="bold" fill="#dc2626">(d) ⊥ (P)</text>
  <!-- Below plane dashed -->
  <line x1="230" y1="160" x2="230" y2="210" stroke="#dc2626" stroke-width="2" stroke-dasharray="4,4"/>

  <!-- Right angle marks at H -->
  <polygon points="230,160 240,158 240,148 230,150" fill="none" stroke="#dc2626" stroke-width="1.5"/>
</svg>
`);
