// SVG Visual Diagrams for Grade 12 Mathematics
// Self-contained, responsive SVG Data URIs for Complex Numbers, Advanced Calculus, 3D Vector Geometry, Differential Equations, Probability & Statistics, and Conic Sections

export function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// 1. Complex Plane & Trigonometric Form (Lessons 1, 2 & 3)
export const SVG_COMPLEX_PLANE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 250" width="100%" height="100%">
  <rect width="540" height="250" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ប្លង់កុំផ្លិច (Argand Plane) &amp; ទម្រង់ត្រីកោណមាត្រ z = r(cosθ + i sinθ)</text>

  <!-- Axes -->
  <line x1="60" y1="190" x2="480" y2="190" stroke="#64748b" stroke-width="1.8"/>
  <line x1="180" y1="230" x2="180" y2="40" stroke="#64748b" stroke-width="1.8"/>
  <text x="485" y="194" font-family="sans-serif" font-size="11" fill="#475569" font-weight="bold">Re (ពិត)</text>
  <text x="180" y="34" font-family="sans-serif" font-size="11" fill="#475569" text-anchor="middle" font-weight="bold">Im (និម្មិត)</text>

  <!-- Unit circle arc -->
  <path d="M 180,110 A 80 80 0 0 1 260,190" fill="none" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4,4"/>

  <!-- Complex point z = a + bi -->
  <line x1="180" y1="190" x2="340" y2="90" stroke="#2563eb" stroke-width="2.5"/>
  <circle cx="340" cy="90" r="5" fill="#2563eb"/>
  <text x="350" y="85" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e40af">M(a, b) ~ z = a + bi</text>

  <!-- Coordinates projection -->
  <line x1="340" y1="90" x2="340" y2="190" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,3"/>
  <line x1="340" y1="90" x2="180" y2="90" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,3"/>
  <text x="340" y="206" font-family="sans-serif" font-size="11" fill="#2563eb" text-anchor="middle">a = r cosθ</text>
  <text x="120" y="94" font-family="sans-serif" font-size="11" fill="#2563eb">b = r sinθ</text>

  <!-- Modulus r and Argument theta -->
  <text x="245" y="130" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">r = |z| = √(a² + b²)</text>
  <path d="M 230,190 A 50 50 0 0 0 220,165" fill="none" stroke="#16a34a" stroke-width="2"/>
  <text x="238" y="175" font-family="sans-serif" font-size="11" font-weight="bold" fill="#16a34a">θ</text>
</svg>
`);

// 2. Limits and Continuity (Lessons 4 & 5)
export const SVG_LIMITS_CONTINUITY = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 250" width="100%" height="100%">
  <rect width="540" height="250" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">លីមីត និងភាពជាប់នៃអនុគមន៍ (Limits, Continuity &amp; IVT)</text>

  <!-- Axes -->
  <line x1="50" y1="190" x2="490" y2="190" stroke="#64748b" stroke-width="1.8"/>
  <line x1="100" y1="230" x2="100" y2="40" stroke="#64748b" stroke-width="1.8"/>
  <text x="495" y="194" font-family="sans-serif" font-size="11" fill="#475569">x</text>
  <text x="100" y="34" font-family="sans-serif" font-size="11" fill="#475569" text-anchor="middle">y</text>

  <!-- Continuous Curve passing zero (IVT) -->
  <path d="M 120,210 Q 200,190 270,130 T 450,60" fill="none" stroke="#059669" stroke-width="2.5"/>

  <!-- Points a and b -->
  <line x1="160" y1="190" x2="160" y2="200" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="3,3"/>
  <circle cx="160" cy="200" r="4" fill="#dc2626"/>
  <text x="160" y="180" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626" text-anchor="middle">a</text>
  <text x="170" y="215" font-family="sans-serif" font-size="10" fill="#dc2626">f(a) &lt; 0</text>

  <!-- Root c where f(c) = 0 -->
  <circle cx="215" cy="190" r="5" fill="#f59e0b"/>
  <text x="215" y="210" font-family="sans-serif" font-size="11" font-weight="bold" fill="#d97706" text-anchor="middle">c (ឫស: f(c) = 0)</text>

  <line x1="380" y1="190" x2="380" y2="80" stroke="#2563eb" stroke-width="1.5" stroke-dasharray="3,3"/>
  <circle cx="380" cy="80" r="4" fill="#2563eb"/>
  <text x="380" y="206" font-family="sans-serif" font-size="11" font-weight="bold" fill="#2563eb" text-anchor="middle">b</text>
  <text x="390" y="80" font-family="sans-serif" font-size="10" fill="#2563eb">f(b) &gt; 0</text>

  <text x="290" y="45" font-family="sans-serif" font-size="10" fill="#475569">ទ្រឹស្តីបទតម្លៃកណ្តាល: f(a)·f(b) &lt; 0 ⇒ ∃ c ∈ (a, b): f(c) = 0</text>
</svg>
`);

// 3. Derivatives, Tangents & Concavity (Lessons 6, 7 & 8)
export const SVG_DERIVATIVES_CURVES = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 250" width="100%" height="100%">
  <rect width="540" height="250" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">អនុវត្តន៍នៃដេរីវេ (Tangent Line, Extrema &amp; Inflection Point)</text>

  <!-- Axes -->
  <line x1="50" y1="190" x2="490" y2="190" stroke="#64748b" stroke-width="1.8"/>
  <line x1="90" y1="230" x2="90" y2="40" stroke="#64748b" stroke-width="1.8"/>

  <!-- Cubic Curve with Max, Inflection, Min -->
  <path d="M 110,180 C 160,50 200,60 270,120 C 340,180 380,190 450,70" fill="none" stroke="#2563eb" stroke-width="2.5"/>

  <!-- Local Max -->
  <circle cx="175" cy="72" r="5" fill="#dc2626"/>
  <line x1="135" y1="72" x2="215" y2="72" stroke="#dc2626" stroke-width="2" stroke-dasharray="3,3"/>
  <text x="175" y="60" font-family="sans-serif" font-size="10" font-weight="bold" fill="#dc2626" text-anchor="middle">អតិបរមា (f'(x)=0, f''&lt;0)</text>

  <!-- Inflection Point -->
  <circle cx="270" cy="120" r="5" fill="#8b5cf6"/>
  <text x="280" y="115" font-family="sans-serif" font-size="10" font-weight="bold" fill="#7c3aed">ចំណុចរបត់ I (f''(x)=0)</text>

  <!-- Local Min -->
  <circle cx="365" cy="168" r="5" fill="#16a34a"/>
  <line x1="325" y1="168" x2="405" y2="168" stroke="#16a34a" stroke-width="2" stroke-dasharray="3,3"/>
  <text x="365" y="185" font-family="sans-serif" font-size="10" font-weight="bold" fill="#16a34a" text-anchor="middle">អប្បបរមា (f'(x)=0, f''&gt;0)</text>
</svg>
`);

// 4. Rational Functions & Asymptotes (Lesson 9)
export const SVG_RATIONAL_FUNCTIONS = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 250" width="100%" height="100%">
  <rect width="540" height="250" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ក្រាបអនុគមន៍សនិទាន និងអាស៊ីមតូត (y = (ax+b)/(cx+d))</text>

  <!-- Axes -->
  <line x1="40" y1="190" x2="490" y2="190" stroke="#64748b" stroke-width="1.8"/>
  <line x1="120" y1="230" x2="120" y2="40" stroke="#64748b" stroke-width="1.8"/>

  <!-- Vertical Asymptote x = 2 -->
  <line x1="260" y1="40" x2="260" y2="230" stroke="#dc2626" stroke-width="1.8" stroke-dasharray="5,5"/>
  <text x="265" y="55" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">អាស៊ីមតូតឈរ x = x₀</text>

  <!-- Horizontal Asymptote y = 1.5 -->
  <line x1="40" y1="120" x2="490" y2="120" stroke="#dc2626" stroke-width="1.8" stroke-dasharray="5,5"/>
  <text x="410" y="112" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">អាស៊ីមតូតដេក y = y₀</text>

  <!-- Center of Symmetry I -->
  <circle cx="260" cy="120" r="5" fill="#f59e0b"/>
  <text x="270" y="135" font-family="sans-serif" font-size="11" font-weight="bold" fill="#d97706">ផ្ចិតឆ្លុះ I(x₀, y₀)</text>

  <!-- Hyperbola branch 1 -->
  <path d="M 60,135 Q 210,140 245,225" fill="none" stroke="#2563eb" stroke-width="2.5"/>
  <!-- Hyperbola branch 2 -->
  <path d="M 275,45 Q 310,105 480,112" fill="none" stroke="#2563eb" stroke-width="2.5"/>
</svg>
`);

// 5. Exponential & Logarithmic Graphs (Lessons 10 & 11)
export const SVG_EXP_LOG_VARIATION = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 250" width="100%" height="100%">
  <rect width="540" height="250" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">អថេរភាពនៃអនុគមន៍អិចស្ប៉ូណង់ស្យែល &amp; លោការីត (y = e^x &amp; y = ln x)</text>

  <line x1="50" y1="180" x2="490" y2="180" stroke="#475569" stroke-width="1.8"/>
  <line x1="160" y1="230" x2="160" y2="35" stroke="#475569" stroke-width="1.8"/>

  <!-- Line y = x -->
  <line x1="70" y1="210" x2="350" y2="40" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,4"/>
  <text x="355" y="45" font-family="sans-serif" font-size="10" fill="#64748b">y = x</text>

  <!-- Exponential curve -->
  <path d="M 60,178 Q 150,175 160,140 T 230,40" fill="none" stroke="#2563eb" stroke-width="2.5"/>
  <circle cx="160" cy="140" r="4" fill="#2563eb"/>
  <text x="135" y="135" font-family="sans-serif" font-size="10" font-weight="bold" fill="#1e40af">(0, 1)</text>
  <text x="235" y="55" font-family="sans-serif" font-size="11" font-weight="bold" fill="#2563eb">y = e^x</text>

  <!-- Logarithmic curve -->
  <path d="M 162,230 Q 165,190 200,180 T 400,120" fill="none" stroke="#059669" stroke-width="2.5"/>
  <circle cx="200" cy="180" r="4" fill="#059669"/>
  <text x="195" y="200" font-family="sans-serif" font-size="10" font-weight="bold" fill="#047857">(1, 0)</text>
  <text x="405" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="#059669">y = ln x</text>
</svg>
`);

// 6. 3D Vectors & Cross Product (Lessons 12, 13 & 14)
export const SVG_3D_VECTORS_SPACE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 250" width="100%" height="100%">
  <rect width="540" height="250" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">វ៉ិចទ័រក្នុងលំហ Oxyz &amp; ផលគុណខ្វែង u⃗ × v⃗ ⊥ ប្លង់ (P)</text>

  <!-- 3D Axes -->
  <line x1="220" y1="160" x2="420" y2="160" stroke="#475569" stroke-width="2"/>
  <text x="425" y="165" font-family="sans-serif" font-size="11" font-weight="bold" fill="#475569">y</text>
  <line x1="220" y1="160" x2="220" y2="40" stroke="#475569" stroke-width="2"/>
  <text x="220" y="34" font-family="sans-serif" font-size="11" font-weight="bold" fill="#475569" text-anchor="middle">z</text>
  <line x1="220" y1="160" x2="130" y2="230" stroke="#475569" stroke-width="2"/>
  <text x="120" y="235" font-family="sans-serif" font-size="11" font-weight="bold" fill="#475569">x</text>

  <!-- Plane (P) parallelogram -->
  <polygon points="180,180 340,180 380,130 220,130" fill="#e0f2fe" fill-opacity="0.6" stroke="#0284c7" stroke-width="1.8"/>
  <text x="350" y="145" font-family="sans-serif" font-size="11" font-weight="bold" fill="#0369a1">ប្លង់ (P)</text>

  <!-- Vectors u and v in plane -->
  <line x1="240" y1="160" x2="330" y2="160" stroke="#16a34a" stroke-width="2.5" marker-end="url(#arrow)"/>
  <text x="310" y="175" font-family="sans-serif" font-size="11" font-weight="bold" fill="#16a34a">u⃗</text>

  <line x1="240" y1="160" x2="290" y2="140" stroke="#2563eb" stroke-width="2.5"/>
  <text x="270" y="135" font-family="sans-serif" font-size="11" font-weight="bold" fill="#2563eb">v⃗</text>

  <!-- Normal Vector n = u x v perpendicular to plane -->
  <line x1="240" y1="160" x2="240" y2="60" stroke="#dc2626" stroke-width="3"/>
  <polygon points="240,55 235,68 245,68" fill="#dc2626"/>
  <text x="250" y="70" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">n⃗ = u⃗ × v⃗ ⊥ (P)</text>
</svg>
`);

// 7. Definite Integrals & Area of Plane Regions (Lessons 15, 16 & 17)
export const SVG_INTEGRALS_AREA = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 250" width="100%" height="100%">
  <rect width="540" height="250" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">អាំងតេក្រាលកំណត់ និងផ្ទៃក្រឡា A = ∫[a,b] f(x) dx</text>

  <!-- Axes -->
  <line x1="50" y1="190" x2="490" y2="190" stroke="#475569" stroke-width="1.8"/>
  <line x1="90" y1="230" x2="90" y2="40" stroke="#475569" stroke-width="1.8"/>
  <text x="495" y="194" font-family="sans-serif" font-size="11" fill="#475569">x</text>
  <text x="90" y="34" font-family="sans-serif" font-size="11" fill="#475569" text-anchor="middle">y</text>

  <!-- Shaded Area Under Curve from a=160 to b=360 -->
  <path d="M 160,190 L 160,135 Q 240,60 360,110 L 360,190 Z" fill="#93c5fd" fill-opacity="0.6"/>

  <!-- Curve y = f(x) -->
  <path d="M 120,165 Q 240,50 420,130" fill="none" stroke="#1d4ed8" stroke-width="2.8"/>
  <text x="390" y="110" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1d4ed8">y = f(x)</text>

  <!-- Boundaries a and b -->
  <line x1="160" y1="190" x2="160" y2="135" stroke="#1e40af" stroke-width="1.8" stroke-dasharray="3,3"/>
  <line x1="360" y1="190" x2="360" y2="110" stroke="#1e40af" stroke-width="1.8" stroke-dasharray="3,3"/>
  <text x="160" y="208" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e40af" text-anchor="middle">a</text>
  <text x="360" y="208" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e40af" text-anchor="middle">b</text>

  <text x="260" y="150" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e3a8a" text-anchor="middle">ផ្ទៃក្រឡា A</text>
</svg>
`);

// 8. Solids of Revolution (Lesson 18)
export const SVG_SOLIDS_REVOLUTION = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 250" width="100%" height="100%">
  <rect width="540" height="250" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">មាឌសូលីតបដិវត្តន៍ (Volume of Solid of Revolution: V = π ∫ y² dx)</text>

  <!-- Central Axis of rotation (x-axis) -->
  <line x1="50" y1="130" x2="490" y2="130" stroke="#475569" stroke-width="1.8" stroke-dasharray="6,4"/>
  <text x="495" y="134" font-family="sans-serif" font-size="11" fill="#475569">Ox</text>

  <!-- 3D Solid profile generated by rotating around Ox -->
  <ellipse cx="160" cy="130" rx="16" ry="40" fill="#bfdbfe" fill-opacity="0.7" stroke="#2563eb" stroke-width="2"/>
  <path d="M 160,90 Q 260,70 380,50 L 380,210 Q 260,190 160,170 Z" fill="#dbeafe" fill-opacity="0.5" stroke="#2563eb" stroke-width="2"/>
  <ellipse cx="380" cy="130" rx="26" ry="80" fill="#93c5fd" fill-opacity="0.7" stroke="#2563eb" stroke-width="2"/>

  <!-- Representative disk slice -->
  <ellipse cx="270" cy="130" rx="18" ry="60" fill="#f59e0b" fill-opacity="0.6" stroke="#d97706" stroke-width="1.8"/>
  <line x1="270" y1="130" x2="270" y2="70" stroke="#dc2626" stroke-width="2"/>
  <text x="280" y="100" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">r = f(x)</text>
  <text x="270" y="210" font-family="sans-serif" font-size="10" font-weight="bold" fill="#b45309" text-anchor="middle">កម្រាស់ dx</text>
</svg>
`);

// 9. Differential Equations (Lessons 19 & 20)
export const SVG_DIFFERENTIAL_EQUATIONS = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 250" width="100%" height="100%">
  <rect width="540" height="250" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">សមីការឌីផេរ៉ង់ស្យែល (Differential Equations: Family of Solutions)</text>

  <!-- Axes -->
  <line x1="50" y1="190" x2="490" y2="190" stroke="#475569" stroke-width="1.8"/>
  <line x1="120" y1="230" x2="120" y2="40" stroke="#475569" stroke-width="1.8"/>

  <!-- Exponential decay/growth family: y' + ay = 0 => y = Ce^(-ax) -->
  <path d="M 120,60 Q 220,160 460,185" fill="none" stroke="#2563eb" stroke-width="2.5"/>
  <text x="465" y="180" font-family="sans-serif" font-size="10" fill="#2563eb">C = 3</text>

  <path d="M 120,90 Q 220,170 460,187" fill="none" stroke="#059669" stroke-width="2"/>
  <text x="465" y="195" font-family="sans-serif" font-size="10" fill="#059669">C = 2</text>

  <path d="M 120,120 Q 220,180 460,189" fill="none" stroke="#d97706" stroke-width="2"/>
  <text x="465" y="210" font-family="sans-serif" font-size="10" fill="#d97706">C = 1</text>

  <circle cx="120" cy="90" r="4" fill="#dc2626"/>
  <text x="130" y="85" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">លក្ខខណ្ឌដើម y(0) = y₀</text>
  <text x="280" y="60" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1e293b">y' + ay = 0 ⇒ y = C e^(-ax)</text>
</svg>
`);

// 10. Conditional Probability & Bayes' Theorem (Lessons 21 & 22)
export const SVG_PROBABILITY_BAYES = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 250" width="100%" height="100%">
  <rect width="540" height="250" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ទ្រឹស្តីបទប៊ែយេស (Bayes' Theorem: P(B|A) = P(A|B)P(B) / P(A))</text>

  <!-- Probability Tree -->
  <circle cx="100" cy="130" r="5" fill="#475569"/>

  <!-- Branch B1 and B2 -->
  <line x1="100" y1="130" x2="220" y2="80" stroke="#2563eb" stroke-width="2"/>
  <text x="145" y="95" font-family="sans-serif" font-size="10" fill="#2563eb" font-weight="bold">P(B₁)</text>
  <circle cx="220" cy="80" r="4" fill="#2563eb"/>
  <text x="228" y="82" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1e40af">B₁</text>

  <line x1="100" y1="130" x2="220" y2="180" stroke="#059669" stroke-width="2"/>
  <text x="145" y="170" font-family="sans-serif" font-size="10" fill="#059669" font-weight="bold">P(B₂)</text>
  <circle cx="220" cy="180" r="4" fill="#059669"/>
  <text x="228" y="185" font-family="sans-serif" font-size="11" font-weight="bold" fill="#047857">B₂</text>

  <!-- Sub-branches to A -->
  <line x1="220" y1="80" x2="360" y2="55" stroke="#2563eb" stroke-width="1.8"/>
  <text x="280" y="60" font-family="sans-serif" font-size="10" fill="#1e40af">P(A|B₁)</text>
  <text x="370" y="60" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">A ∩ B₁</text>

  <line x1="220" y1="180" x2="360" y2="155" stroke="#059669" stroke-width="1.8"/>
  <text x="280" y="160" font-family="sans-serif" font-size="10" fill="#047857">P(A|B₂)</text>
  <text x="370" y="160" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">A ∩ B₂</text>

  <rect x="250" y="200" width="260" height="36" fill="#fef3c7" rx="8" stroke="#f59e0b"/>
  <text x="380" y="222" font-family="sans-serif" font-size="11" font-weight="bold" fill="#b45309" text-anchor="middle">P(A) = P(A∩B₁) + P(A∩B₂)</text>
</svg>
`);

// 11. Two-Variable Statistics & Linear Regression (Lessons 23 & 24)
export const SVG_REGRESSION_SCATTER = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 250" width="100%" height="100%">
  <rect width="540" height="250" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ស្ថិតិពីរអថេរ &amp; បន្ទាត់តម្រែតម្រង់ y = ax + b</text>

  <!-- Axes -->
  <line x1="60" y1="200" x2="480" y2="200" stroke="#475569" stroke-width="1.8"/>
  <line x1="100" y1="220" x2="100" y2="40" stroke="#475569" stroke-width="1.8"/>
  <text x="485" y="204" font-family="sans-serif" font-size="11" fill="#475569">x</text>
  <text x="100" y="34" font-family="sans-serif" font-size="11" fill="#475569" text-anchor="middle">y</text>

  <!-- Scatter points -->
  <circle cx="140" cy="180" r="4" fill="#3b82f6"/>
  <circle cx="170" cy="155" r="4" fill="#3b82f6"/>
  <circle cx="210" cy="160" r="4" fill="#3b82f6"/>
  <circle cx="240" cy="130" r="4" fill="#3b82f6"/>
  <circle cx="310" cy="110" r="4" fill="#3b82f6"/>
  <circle cx="350" cy="85" r="4" fill="#3b82f6"/>
  <circle cx="390" cy="95" r="4" fill="#3b82f6"/>
  <circle cx="430" cy="65" r="4" fill="#3b82f6"/>

  <!-- Centroid G(x_bar, y_bar) -->
  <circle cx="280" cy="120" r="6" fill="#dc2626"/>
  <text x="290" y="115" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">G(x̄, ȳ)</text>

  <!-- Regression line y = ax + b -->
  <line x1="120" y1="185" x2="450" y2="55" stroke="#dc2626" stroke-width="2.2"/>
  <text x="360" y="50" font-family="sans-serif" font-size="12" font-weight="bold" fill="#b91c1c">y = ax + b</text>
</svg>
`);

// 12. Conic Sections: Parabola (Lesson 25)
export const SVG_CONIC_PARABOLA = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 250" width="100%" height="100%">
  <rect width="540" height="250" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ប៉ារ៉ាបូល (Parabola: x² = 4py)</text>

  <!-- Axes -->
  <line x1="60" y1="170" x2="480" y2="170" stroke="#64748b" stroke-width="1.8"/>
  <line x1="270" y1="230" x2="270" y2="40" stroke="#64748b" stroke-width="1.8"/>

  <!-- Directrix line y = -p -->
  <line x1="80" y1="210" x2="460" y2="210" stroke="#dc2626" stroke-width="1.8" stroke-dasharray="5,5"/>
  <text x="465" y="214" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">បន្ទាត់ប្រាប់ទិស (Δ): y = -p</text>

  <!-- Vertex V(0,0) -->
  <circle cx="270" cy="170" r="4" fill="#1e293b"/>
  <text x="250" y="185" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1e293b">V(0,0)</text>

  <!-- Focus F(0, p) -->
  <circle cx="270" cy="130" r="5" fill="#2563eb"/>
  <text x="280" y="130" font-family="sans-serif" font-size="11" font-weight="bold" fill="#2563eb">គំនុំ F(0, p)</text>

  <!-- Parabola curve x^2 = 4py -->
  <path d="M 130,60 Q 270,200 410,60" fill="none" stroke="#2563eb" stroke-width="2.8"/>
  <text x="390" y="55" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1d4ed8">x² = 4py</text>
</svg>
`);

// 13. Conic Sections: Ellipse (Lesson 26)
export const SVG_CONIC_ELLIPSE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 250" width="100%" height="100%">
  <rect width="540" height="250" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">អេលីប (Ellipse: x²/a² + y²/b² = 1)</text>

  <!-- Axes -->
  <line x1="50" y1="130" x2="490" y2="130" stroke="#64748b" stroke-width="1.8"/>
  <line x1="270" y1="220" x2="270" y2="40" stroke="#64748b" stroke-width="1.8"/>

  <!-- Ellipse curve -->
  <ellipse cx="270" cy="130" rx="160" ry="70" fill="#dbeafe" fill-opacity="0.3" stroke="#2563eb" stroke-width="2.5"/>

  <!-- Center O -->
  <circle cx="270" cy="130" r="4" fill="#1e293b"/>
  <text x="275" y="145" font-family="sans-serif" font-size="10" fill="#475569">O(0,0)</text>

  <!-- Foci F1 and F2 -->
  <circle cx="170" cy="130" r="5" fill="#dc2626"/>
  <text x="160" y="120" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">F₁(-c, 0)</text>

  <circle cx="370" cy="130" r="5" fill="#dc2626"/>
  <text x="360" y="120" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">F₂(c, 0)</text>

  <!-- Vertices -->
  <text x="90" y="145" font-family="sans-serif" font-size="10" font-weight="bold" fill="#1e40af">A'(-a, 0)</text>
  <text x="435" y="145" font-family="sans-serif" font-size="10" font-weight="bold" fill="#1e40af">A(a, 0)</text>
  <text x="275" y="55" font-family="sans-serif" font-size="10" font-weight="bold" fill="#1e40af">B(0, b)</text>

  <text x="270" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1e293b" text-anchor="middle">a² = b² + c²,  e = c/a &lt; 1</text>
</svg>
`);

// 14. Conic Sections: Hyperbola (Lesson 27)
export const SVG_CONIC_HYPERBOLA = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 250" width="100%" height="100%">
  <rect width="540" height="250" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">អ៊ីពែបូល (Hyperbola: x²/a² - y²/b² = 1)</text>

  <!-- Axes -->
  <line x1="40" y1="130" x2="500" y2="130" stroke="#64748b" stroke-width="1.8"/>
  <line x1="270" y1="220" x2="270" y2="40" stroke="#64748b" stroke-width="1.8"/>

  <!-- Asymptotes y = ±(b/a)x -->
  <line x1="100" y1="210" x2="440" y2="50" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="5,5"/>
  <line x1="100" y1="50" x2="440" y2="210" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="5,5"/>
  <text x="445" y="55" font-family="sans-serif" font-size="10" font-weight="bold" fill="#dc2626">y = (b/a)x</text>

  <!-- Left branch -->
  <path d="M 120,45 Q 210,130 120,215" fill="none" stroke="#2563eb" stroke-width="2.5"/>
  <!-- Right branch -->
  <path d="M 420,45 Q 330,130 420,215" fill="none" stroke="#2563eb" stroke-width="2.5"/>

  <!-- Foci -->
  <circle cx="150" cy="130" r="5" fill="#dc2626"/>
  <text x="140" y="120" font-family="sans-serif" font-size="10" font-weight="bold" fill="#dc2626">F₁(-c, 0)</text>

  <circle cx="390" cy="130" r="5" fill="#dc2626"/>
  <text x="380" y="120" font-family="sans-serif" font-size="10" font-weight="bold" fill="#dc2626">F₂(c, 0)</text>

  <!-- Vertices -->
  <circle cx="210" cy="130" r="4" fill="#1e40af"/>
  <circle cx="330" cy="130" r="4" fill="#1e40af"/>
  <text x="270" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1e293b" text-anchor="middle">c² = a² + b²,  e = c/a &gt; 1</text>
</svg>
`);
