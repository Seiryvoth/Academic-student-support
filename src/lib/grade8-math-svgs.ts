// SVG Visual Diagrams for Grade 8 Mathematics
// Clean, responsive, self-contained SVG Data URIs for geometric shapes, 3D solids, histograms, coordinate graphs, and circles

export function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// 1. Number Line & Recurring Decimals (Lesson 1)
export const SVG_RATIONAL_DECIMAL = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 150" width="100%" height="100%">
  <rect width="620" height="150" fill="#f8fafc" rx="16"/>
  <text x="310" y="28" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">បន្ទាត់ចំនួនសនិទាន និងទសភាគខួប (Rational Numbers &amp; Recurring Decimals)</text>
  <line x1="40" y1="80" x2="580" y2="80" stroke="#334155" stroke-width="3" stroke-linecap="round"/>
  <polygon points="580,80 565,73 565,87" fill="#334155"/>
  <polygon points="40,80 55,73 55,87" fill="#334155"/>
  <!-- Ticks -->
  <line x1="100" y1="70" x2="100" y2="90" stroke="#64748b" stroke-width="2"/>
  <text x="100" y="115" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="#475569">-2</text>
  <!-- -1.5 -->
  <circle cx="160" cy="80" r="5" fill="#ef4444"/>
  <line x1="160" y1="72" x2="160" y2="88" stroke="#ef4444" stroke-width="2"/>
  <text x="160" y="60" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="#ef4444">-1.5 (-3/2)</text>
  <line x1="220" y1="70" x2="220" y2="90" stroke="#64748b" stroke-width="2"/>
  <text x="220" y="115" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="#475569">-1</text>
  <!-- 0 Center -->
  <line x1="340" y1="62" x2="340" y2="98" stroke="#2563eb" stroke-width="3"/>
  <circle cx="340" cy="80" r="6" fill="#2563eb"/>
  <text x="340" y="118" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#2563eb">0</text>
  <!-- +1/3 = 0.333... -->
  <circle cx="380" cy="80" r="5" fill="#8b5cf6"/>
  <line x1="380" y1="72" x2="380" y2="88" stroke="#8b5cf6" stroke-width="2"/>
  <text x="380" y="60" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="#8b5cf6">1/3 = 0.(3)</text>
  <line x1="460" y1="70" x2="460" y2="90" stroke="#64748b" stroke-width="2"/>
  <text x="460" y="115" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="#475569">+1</text>
  <!-- +1.75 = 7/4 -->
  <circle cx="550" cy="80" r="5" fill="#059669"/>
  <line x1="550" y1="72" x2="550" y2="88" stroke="#059669" stroke-width="2"/>
  <text x="550" y="60" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="#059669">+7/4 (1.75)</text>
</svg>
`);

// 2. Exponent Rules & Cube Roots (Lesson 2)
export const SVG_EXPONENT_CUBE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 220" width="100%" height="100%">
  <rect width="540" height="220" fill="#f8fafc" rx="16"/>
  <text x="270" y="28" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ស្វ័យគុណបី និងឬសគូប (Cube Power: a³ &amp; Cube Root: ³√V)</text>
  <!-- 3D Cube Isometric Representation -->
  <g transform="translate(100, 45)">
    <!-- Front Face -->
    <rect x="30" y="50" width="90" height="90" fill="#3b82f6" fill-opacity="0.8" stroke="#1d4ed8" stroke-width="2.5"/>
    <!-- Top Face -->
    <polygon points="30,50 80,15 170,15 120,50" fill="#60a5fa" fill-opacity="0.8" stroke="#1d4ed8" stroke-width="2.5"/>
    <!-- Right Face -->
    <polygon points="120,50 170,15 170,105 120,140" fill="#2563eb" fill-opacity="0.9" stroke="#1d4ed8" stroke-width="2.5"/>
    <!-- Dimension Labels -->
    <text x="75" y="160" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e3a8a" text-anchor="middle">a = 4 cm</text>
    <text x="145" y="135" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e3a8a">a = 4 cm</text>
    <text x="12" y="100" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e3a8a">a = 4 cm</text>
  </g>
  <!-- Formula Callout Card -->
  <rect x="320" y="55" width="195" height="125" rx="12" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="417" y="85" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e40af" text-anchor="middle">មាឌគូប (Cube Volume)</text>
  <text x="417" y="112" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb" text-anchor="middle">V = a³ = 4³ = 64 cm³</text>
  <line x1="335" y1="126" x2="500" y2="126" stroke="#bfdbfe" stroke-width="1.5"/>
  <text x="417" y="148" font-family="sans-serif" font-size="13" font-weight="bold" fill="#047857" text-anchor="middle">ឬសគូប (Cube Root)</text>
  <text x="417" y="168" font-family="sans-serif" font-size="14" font-weight="bold" fill="#059669" text-anchor="middle">³√64 = 4 cm</text>
</svg>
`);

// 3. Proportions & Business Percentage (Lesson 3)
export const SVG_BUSINESS_PERCENTAGE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 210" width="100%" height="100%">
  <rect width="560" height="210" fill="#f8fafc" rx="16"/>
  <text x="280" y="28" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ការអនុវត្តភាគរយក្នុងអាជីវកម្ម (Business Percentage &amp; Pricing)</text>
  <!-- Step 1: Cost Price -->
  <rect x="40" y="65" width="130" height="65" rx="10" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>
  <text x="105" y="92" font-family="sans-serif" font-size="12" font-weight="bold" fill="#334155" text-anchor="middle">ថ្លៃដើម (Cost)</text>
  <text x="105" y="116" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a" text-anchor="middle">$100</text>
  <!-- Arrow Markup -->
  <line x1="175" y1="97" x2="215" y2="97" stroke="#10b981" stroke-width="2.5" marker-end="url(#arrow)"/>
  <text x="195" y="85" font-family="sans-serif" font-size="11" font-weight="bold" fill="#059669" text-anchor="middle">+25%</text>
  <!-- Step 2: Marked Price -->
  <rect x="220" y="65" width="130" height="65" rx="10" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
  <text x="285" y="92" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1d4ed8" text-anchor="middle">តម្លៃបិទលក់ (Marked)</text>
  <text x="285" y="116" font-family="sans-serif" font-size="16" font-weight="bold" fill="#1e3a8a" text-anchor="middle">$125</text>
  <!-- Arrow Discount -->
  <line x1="355" y1="97" x2="395" y2="97" stroke="#f43f5e" stroke-width="2.5"/>
  <text x="375" y="85" font-family="sans-serif" font-size="11" font-weight="bold" fill="#e11d48" text-anchor="middle">-10%</text>
  <!-- Step 3: Final Sale Price -->
  <rect x="400" y="65" width="125" height="65" rx="10" fill="#dcfce7" stroke="#22c55e" stroke-width="2"/>
  <text x="462" y="92" font-family="sans-serif" font-size="12" font-weight="bold" fill="#15803d" text-anchor="middle">លក់ជាក់ស្តែង (Final)</text>
  <text x="462" y="116" font-family="sans-serif" font-size="16" font-weight="bold" fill="#14532d" text-anchor="middle">$112.50</text>
  <!-- Summary Box -->
  <text x="280" y="172" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0369a1" text-anchor="middle">ប្រាក់ចំណេញសុទ្ធ (Net Profit) = $112.50 - $100 = +$12.50 (12.5%)</text>
</svg>
`);

// 4. Units of Length, Area & Volume (Lesson 4)
export const SVG_METRIC_VOLUME = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 210" width="100%" height="100%">
  <rect width="540" height="210" fill="#f8fafc" rx="16"/>
  <text x="270" y="28" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ទំនាក់ទំនងខ្នាតមាឌ និងចំណុះ (Volume &amp; Capacity Conversion)</text>
  <!-- Big 1m³ Cube -->
  <g transform="translate(60, 45)">
    <rect x="20" y="35" width="80" height="80" fill="#bae6fd" stroke="#0284c7" stroke-width="2"/>
    <polygon points="20,35 60,10 140,10 100,35" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <polygon points="100,35 140,10 140,90 100,115" fill="#7dd3fc" stroke="#0284c7" stroke-width="2"/>
    <text x="60" y="75" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0369a1" text-anchor="middle">1 m³</text>
  </g>
  <!-- Conversions -->
  <rect x="240" y="50" width="260" height="130" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
  <text x="370" y="78" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="middle">1 m³ = 1,000 dm³ = 1,000 Liters (L)</text>
  <line x1="255" y1="92" x2="485" y2="92" stroke="#e2e8f0" stroke-width="1.5"/>
  <text x="370" y="115" font-family="sans-serif" font-size="13" font-weight="bold" fill="#2563eb" text-anchor="middle">1 dm³ = 1 Liter (L)</text>
  <line x1="255" y1="128" x2="485" y2="128" stroke="#e2e8f0" stroke-width="1.5"/>
  <text x="370" y="152" font-family="sans-serif" font-size="13" font-weight="bold" fill="#059669" text-anchor="middle">1 cm³ = 1 mL (Milliliter)</text>
</svg>
`);

// 5. Special Quadrilaterals: Parallelogram & Regular Hexagon (Lesson 5)
export const SVG_SPECIAL_QUADRILATERALS = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 230" width="100%" height="100%">
  <rect width="580" height="230" fill="#f8fafc" rx="16"/>
  <text x="290" y="28" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ចតុកោណពិសេស និងពហុកោណនិយ័ត (Parallelogram &amp; Regular Hexagon)</text>
  <!-- Figure 1: Parallelogram -->
  <g transform="translate(30, 45)">
    <polygon points="40,110 90,40 230,40 180,110" fill="#dbeafe" stroke="#2563eb" stroke-width="2.5"/>
    <text x="30" y="125" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e40af">A</text>
    <text x="85" y="32" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e40af">B</text>
    <text x="235" y="32" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e40af">C</text>
    <text x="185" y="125" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e40af">D</text>
    <!-- Angles -->
    <path d="M 55,110 A 18 18 0 0 1 52,94" fill="none" stroke="#dc2626" stroke-width="2"/>
    <text x="65" y="102" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">x</text>
    <path d="M 103,40 A 18 18 0 0 1 78,57" fill="none" stroke="#2563eb" stroke-width="2"/>
    <text x="100" y="60" font-family="sans-serif" font-size="11" font-weight="bold" fill="#2563eb">110°</text>
    <text x="135" y="145" font-family="sans-serif" font-size="11" font-weight="bold" fill="#334155" text-anchor="middle">∠A + ∠B = 180° ⇒ x = 70°</text>
  </g>
  <!-- Figure 2: Regular Hexagon -->
  <g transform="translate(330, 45)">
    <!-- Hexagon: center at (120, 75), radius 55 -->
    <!-- Points at 0, 60, 120, 180, 240, 300 deg -->
    <polygon points="175,75 147.5,122.6 92.5,122.6 65,75 92.5,27.4 147.5,27.4" fill="#fef3c7" stroke="#d97706" stroke-width="2.5"/>
    <text x="120" y="80" font-family="sans-serif" font-size="12" font-weight="bold" fill="#92400e" text-anchor="middle">n = 6</text>
    <text x="120" y="145" font-family="sans-serif" font-size="11" font-weight="bold" fill="#78350f" text-anchor="middle">មុំក្នុងនីមួយៗ (Interior Angle) = 120°</text>
    <text x="120" y="162" font-family="sans-serif" font-size="11" font-weight="bold" fill="#78350f" text-anchor="middle">ផលបូកមុំក្នុង = (6 - 2) × 180° = 720°</text>
  </g>
</svg>
`);

// 6. Congruent Triangles & Triangle Inequality (Lesson 6)
export const SVG_TRIANGLE_CONGRUENCE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 230" width="100%" height="100%">
  <rect width="580" height="230" fill="#f8fafc" rx="16"/>
  <text x="290" y="28" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ត្រីកោណប៉ុនគ្នា និងវិសមភាពត្រីកោណ (Congruence &amp; Triangle Inequality)</text>
  <!-- Triangle ABC -->
  <g transform="translate(30, 45)">
    <polygon points="30,120 120,30 160,120" fill="#e0e7ff" stroke="#4338ca" stroke-width="2.5"/>
    <text x="20" y="135" font-family="sans-serif" font-size="12" font-weight="bold" fill="#312e81">A</text>
    <text x="115" y="22" font-family="sans-serif" font-size="12" font-weight="bold" fill="#312e81">B</text>
    <text x="165" y="135" font-family="sans-serif" font-size="12" font-weight="bold" fill="#312e81">C</text>
    <!-- Mark side AB with 1 tick -->
    <line x1="72" y1="72" x2="80" y2="78" stroke="#4338ca" stroke-width="2.5"/>
    <!-- Mark angle B -->
    <path d="M 110,40 A 15 15 0 0 1 128,40" fill="none" stroke="#dc2626" stroke-width="2"/>
    <!-- Mark side BC with 2 ticks -->
    <line x1="137" y1="72" x2="145" y2="75" stroke="#4338ca" stroke-width="2.5"/>
    <line x1="139" y1="76" x2="147" y2="79" stroke="#4338ca" stroke-width="2.5"/>
    <text x="95" y="150" font-family="sans-serif" font-size="12" font-weight="bold" fill="#4338ca" text-anchor="middle">△ABC</text>
  </g>
  <!-- Congruence Sign -->
  <text x="235" y="125" font-family="sans-serif" font-size="28" font-weight="bold" fill="#059669" text-anchor="middle">≅</text>
  <text x="235" y="145" font-family="sans-serif" font-size="11" font-weight="bold" fill="#047857" text-anchor="middle">(SAS)</text>
  <!-- Triangle DEF -->
  <g transform="translate(250, 45)">
    <polygon points="30,120 120,30 160,120" fill="#d1fae5" stroke="#059669" stroke-width="2.5"/>
    <text x="20" y="135" font-family="sans-serif" font-size="12" font-weight="bold" fill="#065f46">D</text>
    <text x="115" y="22" font-family="sans-serif" font-size="12" font-weight="bold" fill="#065f46">E</text>
    <text x="165" y="135" font-family="sans-serif" font-size="12" font-weight="bold" fill="#065f46">F</text>
    <!-- Mark side DE with 1 tick -->
    <line x1="72" y1="72" x2="80" y2="78" stroke="#059669" stroke-width="2.5"/>
    <!-- Mark angle E -->
    <path d="M 110,40 A 15 15 0 0 1 128,40" fill="none" stroke="#dc2626" stroke-width="2"/>
    <!-- Mark side EF with 2 ticks -->
    <line x1="137" y1="72" x2="145" y2="75" stroke="#059669" stroke-width="2.5"/>
    <line x1="139" y1="76" x2="147" y2="79" stroke="#059669" stroke-width="2.5"/>
    <text x="95" y="150" font-family="sans-serif" font-size="12" font-weight="bold" fill="#059669" text-anchor="middle">△DEF</text>
  </g>
  <!-- Triangle Inequality Callout -->
  <g transform="translate(435, 60)">
    <rect x="0" y="0" width="125" height="110" rx="10" fill="#fef2f2" stroke="#fecaca" stroke-width="1.5"/>
    <text x="62" y="26" font-family="sans-serif" font-size="11" font-weight="bold" fill="#991b1b" text-anchor="middle">វិសមភាពត្រីកោណ</text>
    <text x="62" y="48" font-family="sans-serif" font-size="13" font-weight="bold" fill="#b91c1c" text-anchor="middle">a + b &gt; c</text>
    <text x="62" y="70" font-family="sans-serif" font-size="13" font-weight="bold" fill="#b91c1c" text-anchor="middle">b + c &gt; a</text>
    <text x="62" y="92" font-family="sans-serif" font-size="13" font-weight="bold" fill="#b91c1c" text-anchor="middle">a + c &gt; b</text>
  </g>
</svg>
`);

// 7. Circle Properties: Central Angle & Inscribed Angle (Lesson 7)
export const SVG_CIRCLE_ANGLES = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 240" width="100%" height="100%">
  <rect width="560" height="240" fill="#f8fafc" rx="16"/>
  <text x="280" y="28" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">មុំផ្ចិត និងមុំចារឹកក្នុងរង្វង់ (Central &amp; Inscribed Angles in a Circle)</text>
  <!-- Circle: Center (170, 130), Radius = 80 -->
  <circle cx="170" cy="130" r="80" fill="#ffffff" stroke="#2563eb" stroke-width="2.5"/>
  <circle cx="170" cy="130" r="4" fill="#2563eb"/>
  <text x="175" y="125" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e40af">O</text>
  <!-- Point A (bottom-left): 170 + 80*cos(140°), 130 + 80*sin(140°) ≈ (109, 181) -->
  <!-- Point B (bottom-right): 170 + 80*cos(40°), 130 + 80*sin(40°) ≈ (231, 181) -->
  <!-- Point C (top): (170, 50) -->
  <!-- Central Angle AOB -->
  <line x1="170" y1="130" x2="109" y2="181" stroke="#2563eb" stroke-width="2"/>
  <line x1="170" y1="130" x2="231" y2="181" stroke="#2563eb" stroke-width="2"/>
  <path d="M 148,148 A 28 28 0 0 0 192,148" fill="none" stroke="#2563eb" stroke-width="2.5"/>
  <text x="170" y="165" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2563eb" text-anchor="middle">80°</text>
  <!-- Inscribed Angle ACB -->
  <line x1="170" y1="50" x2="109" y2="181" stroke="#dc2626" stroke-width="2"/>
  <line x1="170" y1="50" x2="231" y2="181" stroke="#dc2626" stroke-width="2"/>
  <path d="M 158,74 A 25 25 0 0 0 182,74" fill="none" stroke="#dc2626" stroke-width="2.5"/>
  <text x="170" y="90" font-family="sans-serif" font-size="12" font-weight="bold" fill="#dc2626" text-anchor="middle">40°</text>
  <!-- Vertex Labels -->
  <text x="95" y="195" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e293b">A</text>
  <text x="240" y="195" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e293b">B</text>
  <text x="170" y="42" font-family="sans-serif" font-size="13" font-weight="bold" fill="#dc2626" text-anchor="middle">C</text>
  <!-- Right Side Rule Card -->
  <rect x="290" y="65" width="240" height="140" rx="12" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="410" y="92" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e40af" text-anchor="middle">ទ្រឹស្តីបទមុំចារឹកក្នុងរង្វង់</text>
  <text x="410" y="118" font-family="sans-serif" font-size="14" font-weight="bold" fill="#dc2626" text-anchor="middle">∠ACB = ½ ∠AOB</text>
  <line x1="310" y1="130" x2="510" y2="130" stroke="#bfdbfe" stroke-width="1.5"/>
  <text x="410" y="152" font-family="sans-serif" font-size="12" font-weight="bold" fill="#334155" text-anchor="middle">មុំចារឹកស្មើពាក់កណ្តាលមុំផ្ចិត</text>
  <text x="410" y="172" font-family="sans-serif" font-size="12" font-weight="bold" fill="#334155" text-anchor="middle">កាត់ធ្នូស្ទាក់ AB តែមួយ (Same Arc)</text>
  <text x="410" y="192" font-family="sans-serif" font-size="13" font-weight="bold" fill="#059669" text-anchor="middle">40° = ½ × 80°</text>
</svg>
`);

// 8. 3D Solids: Cylinder, Surface Area & Volume (Lesson 8)
export const SVG_3D_CYLINDER = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 240" width="100%" height="100%">
  <rect width="560" height="240" fill="#f8fafc" rx="16"/>
  <text x="280" y="28" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ផ្ទៃក្រឡា និងមាឌនៃស៊ីឡាំង (Cylinder: Surface Area &amp; Volume)</text>
  <!-- 3D Cylinder -->
  <g transform="translate(60, 45)">
    <!-- Top Ellipse -->
    <ellipse cx="70" cy="30" rx="55" ry="16" fill="#93c5fd" stroke="#2563eb" stroke-width="2.5"/>
    <!-- Radius line on top -->
    <line x1="70" y1="30" x2="125" y2="30" stroke="#dc2626" stroke-width="2"/>
    <text x="98" y="24" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">r = 7 cm</text>
    <!-- Side Lines -->
    <line x1="15" y1="30" x2="15" y2="130" stroke="#2563eb" stroke-width="2.5"/>
    <line x1="125" y1="30" x2="125" y2="130" stroke="#2563eb" stroke-width="2.5"/>
    <!-- Bottom Ellipse -->
    <path d="M 15,130 A 55 16 0 0 0 125,130" fill="none" stroke="#2563eb" stroke-width="2.5"/>
    <path d="M 15,130 A 55 16 0 0 1 125,130" fill="none" stroke="#93c5fd" stroke-dasharray="4,4" stroke-width="2"/>
    <!-- Height Indicator -->
    <line x1="140" y1="30" x2="140" y2="130" stroke="#475569" stroke-width="1.5" marker-end="url(#arrow)"/>
    <text x="145" y="85" font-family="sans-serif" font-size="12" font-weight="bold" fill="#334155">h = 10 cm</text>
  </g>
  <!-- Formula Card -->
  <rect x="250" y="50" width="280" height="165" rx="12" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="390" y="75" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e40af" text-anchor="middle">រូបមន្តគណនាស៊ីឡាំង (Formulas)</text>
  <line x1="265" y1="85" x2="515" y2="85" stroke="#bfdbfe" stroke-width="1.5"/>
  <text x="275" y="108" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0f172a">• ផ្ទៃខាង (Lateral):</text>
  <text x="430" y="108" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2563eb">S_L = 2πrh</text>
  <text x="275" y="132" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0f172a">• ផ្ទៃបាត (Base Area):</text>
  <text x="430" y="132" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2563eb">B = πr²</text>
  <text x="275" y="156" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0f172a">• ផ្ទៃសរុប (Total Area):</text>
  <text x="430" y="156" font-family="sans-serif" font-size="12" font-weight="bold" fill="#059669">S_T = 2πrh + 2πr²</text>
  <text x="275" y="180" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0f172a">• មាឌ (Volume):</text>
  <text x="430" y="180" font-family="sans-serif" font-size="13" font-weight="bold" fill="#7c3aed">V = πr²h</text>
  <text x="390" y="202" font-family="sans-serif" font-size="11" font-weight="bold" fill="#047857" text-anchor="middle">ឧទាហរណ៍៖ V ≈ (22/7) × 7² × 10 = 1,540 cm³</text>
</svg>
`);

// 9. Descriptive Statistics & Histograms (Lesson 9)
export const SVG_HISTOGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 240" width="100%" height="100%">
  <rect width="560" height="240" fill="#f8fafc" rx="16"/>
  <text x="280" y="28" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">អ៊ីស្តូក្រាម៖ លទ្ធផលពិន្ទុតេស្តសិស្ស (Histogram &amp; Frequency Distribution)</text>
  <!-- Axes -->
  <line x1="60" y1="190" x2="520" y2="190" stroke="#334155" stroke-width="2.5"/>
  <line x1="60" y1="190" x2="60" y2="50" stroke="#334155" stroke-width="2.5"/>
  <!-- Y Ticks (Frequency: 0, 5, 10, 15, 20) -->
  <text x="45" y="195" font-family="sans-serif" font-size="11" fill="#64748b" text-anchor="end">0</text>
  <line x1="56" y1="155" x2="60" y2="155" stroke="#64748b" stroke-width="1.5"/>
  <text x="45" y="160" font-family="sans-serif" font-size="11" fill="#64748b" text-anchor="end">5</text>
  <line x1="56" y1="120" x2="60" y2="120" stroke="#64748b" stroke-width="1.5"/>
  <text x="45" y="125" font-family="sans-serif" font-size="11" fill="#64748b" text-anchor="end">10</text>
  <line x1="56" y1="85" x2="60" y2="85" stroke="#64748b" stroke-width="1.5"/>
  <text x="45" y="90" font-family="sans-serif" font-size="11" fill="#64748b" text-anchor="end">15</text>
  <line x1="56" y1="50" x2="60" y2="50" stroke="#64748b" stroke-width="1.5"/>
  <text x="45" y="55" font-family="sans-serif" font-size="11" fill="#64748b" text-anchor="end">20</text>
  <!-- Histogram Bars (Continuous intervals, width 75 each) -->
  <!-- Interval [40-50): freq = 6 => height = 42 -->
  <rect x="70" y="148" width="75" height="42" fill="#3b82f6" fill-opacity="0.85" stroke="#1d4ed8" stroke-width="1.5"/>
  <text x="107" y="142" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e40af" text-anchor="middle">6</text>
  <!-- Interval [50-60): freq = 14 => height = 98 -->
  <rect x="145" y="92" width="75" height="98" fill="#3b82f6" fill-opacity="0.85" stroke="#1d4ed8" stroke-width="1.5"/>
  <text x="182" y="86" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e40af" text-anchor="middle">14</text>
  <!-- Interval [60-70): freq = 20 => height = 140 -->
  <rect x="220" y="50" width="75" height="140" fill="#2563eb" stroke="#1e40af" stroke-width="1.5"/>
  <text x="257" y="44" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e3a8a" text-anchor="middle">20 (Mode)</text>
  <!-- Interval [70-80): freq = 12 => height = 84 -->
  <rect x="295" y="106" width="75" height="84" fill="#3b82f6" fill-opacity="0.85" stroke="#1d4ed8" stroke-width="1.5"/>
  <text x="332" y="100" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e40af" text-anchor="middle">12</text>
  <!-- Interval [80-90): freq = 8 => height = 56 -->
  <rect x="370" y="134" width="75" height="56" fill="#3b82f6" fill-opacity="0.85" stroke="#1d4ed8" stroke-width="1.5"/>
  <text x="407" y="128" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e40af" text-anchor="middle">8</text>
  <!-- X Labels -->
  <text x="70" y="206" font-family="sans-serif" font-size="11" font-weight="bold" fill="#475569" text-anchor="middle">40</text>
  <text x="145" y="206" font-family="sans-serif" font-size="11" font-weight="bold" fill="#475569" text-anchor="middle">50</text>
  <text x="220" y="206" font-family="sans-serif" font-size="11" font-weight="bold" fill="#475569" text-anchor="middle">60</text>
  <text x="295" y="206" font-family="sans-serif" font-size="11" font-weight="bold" fill="#475569" text-anchor="middle">70</text>
  <text x="370" y="206" font-family="sans-serif" font-size="11" font-weight="bold" fill="#475569" text-anchor="middle">80</text>
  <text x="445" y="206" font-family="sans-serif" font-size="11" font-weight="bold" fill="#475569" text-anchor="middle">90</text>
  <text x="260" y="228" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e293b" text-anchor="middle">ចន្លោះថ្នាក់ពិន្ទុ (Score Class Intervals)</text>
</svg>
`);

// 10. Measures of Central Tendency (Lesson 10)
export const SVG_CENTRAL_TENDENCY = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 210" width="100%" height="100%">
  <rect width="540" height="210" fill="#f8fafc" rx="16"/>
  <text x="270" y="28" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">រង្វាស់ទីតាំងកណ្តាល (Measures of Central Tendency)</text>
  <!-- Distribution Curve -->
  <path d="M 50,150 Q 150,150 200,60 T 320,150 L 490,150" fill="none" stroke="#64748b" stroke-width="2.5"/>
  <!-- Peak / Mode -->
  <line x1="200" y1="60" x2="200" y2="150" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="4,4"/>
  <circle cx="200" cy="60" r="5" fill="#ef4444"/>
  <text x="200" y="50" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ef4444" text-anchor="middle">ម៉ូត (Mode)</text>
  <!-- Median -->
  <line x1="225" y1="85" x2="225" y2="150" stroke="#3b82f6" stroke-width="2.5" stroke-dasharray="4,4"/>
  <circle cx="225" cy="85" r="5" fill="#3b82f6"/>
  <text x="235" y="75" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1d4ed8">មេដ្យាន (Median)</text>
  <!-- Mean -->
  <line x1="255" y1="105" x2="255" y2="150" stroke="#10b981" stroke-width="2.5" stroke-dasharray="4,4"/>
  <circle cx="255" cy="105" r="5" fill="#10b981"/>
  <text x="280" y="100" font-family="sans-serif" font-size="12" font-weight="bold" fill="#047857">មធ្យម (Mean x̄)</text>
  <!-- Base line -->
  <line x1="40" y1="150" x2="500" y2="150" stroke="#334155" stroke-width="2"/>
  <text x="270" y="185" font-family="sans-serif" font-size="12" font-weight="bold" fill="#334155" text-anchor="middle">សម្រាប់បំណែងចែកលំអៀងស្តាំ (Right-Skewed): Mode &lt; Median &lt; Mean</text>
</svg>
`);

// 11. Probability Tree Diagram (Lesson 11)
export const SVG_PROBABILITY_TREE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 220" width="100%" height="100%">
  <rect width="540" height="220" fill="#f8fafc" rx="16"/>
  <text x="270" y="28" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ដ្យាក្រាមដើមឈើប្រូបាប (Probability Tree Diagram: 2 Coin Flips)</text>
  <!-- Start Root -->
  <circle cx="60" cy="115" r="7" fill="#334155"/>
  <text x="40" y="120" font-family="sans-serif" font-size="12" font-weight="bold" fill="#334155" text-anchor="end">Start</text>
  <!-- Branch 1: Heads & Tails -->
  <line x1="60" y1="115" x2="180" y2="70" stroke="#2563eb" stroke-width="2.5"/>
  <text x="110" y="85" font-family="sans-serif" font-size="11" font-weight="bold" fill="#2563eb">½ (H)</text>
  <circle cx="180" cy="70" r="14" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
  <text x="180" y="75" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e40af" text-anchor="middle">H</text>

  <line x1="60" y1="115" x2="180" y2="160" stroke="#64748b" stroke-width="2.5"/>
  <text x="110" y="150" font-family="sans-serif" font-size="11" font-weight="bold" fill="#475569">½ (T)</text>
  <circle cx="180" cy="160" r="14" fill="#f1f5f9" stroke="#64748b" stroke-width="2"/>
  <text x="180" y="165" font-family="sans-serif" font-size="12" font-weight="bold" fill="#334155" text-anchor="middle">T</text>

  <!-- Branch 2: From H -->
  <line x1="194" y1="70" x2="310" y2="45" stroke="#059669" stroke-width="2"/>
  <text x="250" y="52" font-family="sans-serif" font-size="11" font-weight="bold" fill="#059669">½</text>
  <text x="320" y="50" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a">HH → P = ¼</text>

  <line x1="194" y1="70" x2="310" y2="95" stroke="#d97706" stroke-width="2"/>
  <text x="250" y="90" font-family="sans-serif" font-size="11" font-weight="bold" fill="#d97706">½</text>
  <text x="320" y="100" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a">HT → P = ¼</text>

  <!-- Branch 2: From T -->
  <line x1="194" y1="160" x2="310" y2="135" stroke="#d97706" stroke-width="2"/>
  <text x="250" y="142" font-family="sans-serif" font-size="11" font-weight="bold" fill="#d97706">½</text>
  <text x="320" y="140" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a">TH → P = ¼</text>

  <line x1="194" y1="160" x2="310" y2="185" stroke="#64748b" stroke-width="2"/>
  <text x="250" y="180" font-family="sans-serif" font-size="11" font-weight="bold" fill="#64748b">½</text>
  <text x="320" y="190" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a">TT → P = ¼</text>
</svg>
`);

// 12. Algebraic Expressions & Difference of Squares Area Model (Lesson 12)
export const SVG_ALGEBRAIC_FACTORING = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 210" width="100%" height="100%">
  <rect width="540" height="210" fill="#f8fafc" rx="16"/>
  <text x="270" y="28" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">គំរូធរណីមាត្រនៃផលគុណកត្តា៖ a² - b² = (a - b)(a + b)</text>
  <!-- Large Square a x a with small square b x b cut out -->
  <g transform="translate(60, 45)">
    <!-- Main Big square: 110 x 110 -->
    <rect x="0" y="0" width="110" height="110" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
    <!-- Cutout Square b x b at bottom-right: 35 x 35 -->
    <rect x="75" y="75" width="35" height="35" fill="#fecaca" stroke="#ef4444" stroke-width="2"/>
    <text x="92" y="96" font-family="sans-serif" font-size="12" font-weight="bold" fill="#b91c1c" text-anchor="middle">b²</text>
    <text x="38" y="55" font-family="sans-serif" font-size="15" font-weight="bold" fill="#1e40af" text-anchor="middle">a² - b²</text>
    <!-- Dimensions -->
    <text x="55" y="-6" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e293b" text-anchor="middle">a</text>
    <text x="-12" y="60" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e293b">a</text>
  </g>
  <!-- Equals Sign -->
  <text x="220" y="115" font-family="sans-serif" font-size="32" font-weight="bold" fill="#059669" text-anchor="middle">=</text>
  <!-- Reassembled Rectangle: (a + b) by (a - b) -->
  <g transform="translate(270, 55)">
    <rect x="0" y="0" width="180" height="75" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
    <text x="90" y="42" font-family="sans-serif" font-size="14" font-weight="bold" fill="#15803d" text-anchor="middle">(a + b)(a - b)</text>
    <text x="90" y="-8" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e293b" text-anchor="middle">ប្រវែងបណ្តោយ = a + b</text>
    <text x="190" y="42" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e293b">a - b</text>
  </g>
  <text x="270" y="185" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="middle">រូបមន្តស្មើភាពគួរចងចាំ៖ a² - b² ≡ (a - b)(a + b)</text>
</svg>
`);

// 13. Linear Equations & Inequalities on Number Line (Lesson 13)
export const SVG_INEQUALITY_LINE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 160" width="100%" height="100%">
  <rect width="580" height="160" fill="#f8fafc" rx="16"/>
  <text x="290" y="28" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ដំណោះស្រាយវិសមីការលើបន្ទាត់ចំនួន៖ 2x - 3 ≤ 5 ⇒ x ≤ 4</text>
  <!-- Number Line Axis -->
  <line x1="40" y1="90" x2="540" y2="90" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
  <polygon points="540,90 525,83 525,97" fill="#64748b"/>
  <polygon points="40,90 55,83 55,97" fill="#64748b"/>
  <!-- Ticks (-1 to 6) -->
  <line x1="90" y1="82" x2="90" y2="98" stroke="#64748b" stroke-width="2"/>
  <text x="90" y="122" font-family="sans-serif" font-size="13" text-anchor="middle" fill="#64748b">-1</text>

  <line x1="150" y1="82" x2="150" y2="98" stroke="#64748b" stroke-width="2"/>
  <text x="150" y="122" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="#2563eb">0</text>

  <line x1="210" y1="82" x2="210" y2="98" stroke="#64748b" stroke-width="2"/>
  <text x="210" y="122" font-family="sans-serif" font-size="13" text-anchor="middle" fill="#64748b">1</text>

  <line x1="270" y1="82" x2="270" y2="98" stroke="#64748b" stroke-width="2"/>
  <text x="270" y="122" font-family="sans-serif" font-size="13" text-anchor="middle" fill="#64748b">2</text>

  <line x1="330" y1="82" x2="330" y2="98" stroke="#64748b" stroke-width="2"/>
  <text x="330" y="122" font-family="sans-serif" font-size="13" text-anchor="middle" fill="#64748b">3</text>

  <!-- x = 4 with Closed Circle and Ray Shading Left -->
  <line x1="390" y1="82" x2="390" y2="98" stroke="#059669" stroke-width="2.5"/>
  <text x="390" y="125" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#059669">4</text>

  <!-- Shaded ray from 4 to left -->
  <line x1="55" y1="90" x2="390" y2="90" stroke="#059669" stroke-width="6"/>
  <!-- Closed Solid Circle at 4 -->
  <circle cx="390" cy="90" r="7" fill="#059669" stroke="#065f46" stroke-width="2"/>
  <polygon points="40,90 55,80 55,100" fill="#059669"/>

  <line x1="450" y1="82" x2="450" y2="98" stroke="#64748b" stroke-width="2"/>
  <text x="450" y="122" font-family="sans-serif" font-size="13" text-anchor="middle" fill="#64748b">5</text>

  <text x="230" y="70" font-family="sans-serif" font-size="13" font-weight="bold" fill="#059669" text-anchor="middle">តំបន់ចម្លើយ៖ x ≤ 4 (Solid Dot for ≤)</text>
</svg>
`);

// 14. Coordinate Plane & Linear Equations (Lesson 14)
export const SVG_COORDINATE_GRAPH = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 250" width="100%" height="100%">
  <rect width="540" height="250" fill="#f8fafc" rx="16"/>
  <text x="270" y="24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">ក្រាបនៃសមីការបន្ទាត់ក្នុងប្លង់កូអរដោនេ៖ y = 2x - 2</text>
  <!-- Cartesian Grid Center at (220, 140) -->
  <g transform="translate(220, 140)">
    <!-- Grid lines -->
    <path d="M -160,-100 L 160,-100 M -160,-60 L 160,-60 M -160,-20 L 160,-20 M -160,20 L 160,20 M -160,60 L 160,60 M -160,100 L 160,100" stroke="#e2e8f0" stroke-width="1"/>
    <path d="M -120,-110 L -120,110 M -80,-110 L -80,110 M -40,-110 L -40,110 M 40,-110 L 40,110 M 80,-110 L 80,110 M 120,-110 L 120,110" stroke="#e2e8f0" stroke-width="1"/>
    <!-- X and Y Axes -->
    <line x1="-150" y1="0" x2="150" y2="0" stroke="#334155" stroke-width="2"/>
    <line x1="0" y1="-100" x2="0" y2="100" stroke="#334155" stroke-width="2"/>
    <text x="145" y="-8" font-family="sans-serif" font-size="12" font-weight="bold" fill="#334155">x</text>
    <text x="8" y="-95" font-family="sans-serif" font-size="12" font-weight="bold" fill="#334155">y</text>
    <!-- Origin (0,0) -->
    <text x="-12" y="15" font-family="sans-serif" font-size="11" fill="#64748b">O</text>
    <!-- Line y = 2x - 2 (Scale: 1 unit = 25px) -->
    <!-- When x = -1, y = -4 => (-25, 100) -->
    <!-- When x = 0, y = -2 => (0, 50) -->
    <!-- When x = 1, y = 0 => (25, 0) -->
    <!-- When x = 2, y = 2 => (50, -50) -->
    <!-- When x = 3, y = 4 => (75, -100) -->
    <line x1="-35" y1="120" x2="80" y2="-110" stroke="#2563eb" stroke-width="3"/>
    <!-- Points on line -->
    <!-- y-intercept (0, -2) -->
    <circle cx="0" cy="50" r="5" fill="#dc2626"/>
    <text x="10" y="55" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">(0, -2)</text>
    <!-- x-intercept (1, 0) -->
    <circle cx="25" cy="0" r="5" fill="#059669"/>
    <text x="30" y="-8" font-family="sans-serif" font-size="11" font-weight="bold" fill="#059669">(1, 0)</text>
  </g>
  <!-- Side Info Card -->
  <rect x="385" y="55" width="140" height="150" rx="10" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1.5"/>
  <text x="455" y="80" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e40af" text-anchor="middle">លក្ខណៈក្រាប</text>
  <line x1="395" y1="90" x2="515" y2="90" stroke="#bfdbfe" stroke-width="1"/>
  <text x="395" y="112" font-family="sans-serif" font-size="11" font-weight="bold" fill="#334155">• សមីការ៖ y = 2x - 2</text>
  <text x="395" y="132" font-family="sans-serif" font-size="11" font-weight="bold" fill="#2563eb">• មេគុណប្រាប់ទិស៖</text>
  <text x="410" y="148" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2563eb">m = 2 (Slope)</text>
  <text x="395" y="170" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">• ប្រសព្វ Oy: (0, -2)</text>
  <text x="395" y="190" font-family="sans-serif" font-size="11" font-weight="bold" fill="#059669">• ប្រសព្វ Ox: (1, 0)</text>
</svg>
`);

// 15. Mathematical Reasoning: Deductive & Inductive Logic
export const SVG_LOGICAL_REASONING = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 210" width="100%" height="100%">
  <rect width="540" height="210" fill="#f8fafc" rx="16"/>
  <text x="270" y="28" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">វិចារគណិតវិទ្យា៖ វិចារអនុមានញែក និងរួម (Deductive &amp; Inductive Reasoning)</text>
  <!-- Deductive Venn Diagram: P inside Q -->
  <g transform="translate(140, 115)">
    <circle cx="0" cy="0" r="70" fill="#e0e7ff" stroke="#4338ca" stroke-width="2.5"/>
    <text x="0" y="-45" font-family="sans-serif" font-size="12" font-weight="bold" fill="#312e81" text-anchor="middle">សេចក្តីសន្និដ្ឋាន Q</text>
    <circle cx="0" cy="15" r="38" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
    <text x="0" y="10" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1e40af" text-anchor="middle">សម្មតិកម្ម P</text>
    <text x="0" y="26" font-family="sans-serif" font-size="10" font-weight="bold" fill="#1e40af" text-anchor="middle">(If P then Q)</text>
  </g>
  <!-- Arrow -->
  <line x1="230" y1="115" x2="270" y2="115" stroke="#059669" stroke-width="3" marker-end="url(#arrow)"/>
  <!-- Logical Rules Box -->
  <rect x="290" y="55" width="220" height="125" rx="10" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
  <text x="400" y="80" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="middle">ច្បាប់អនុមាន (Modus Ponens)</text>
  <line x1="305" y1="90" x2="495" y2="90" stroke="#e2e8f0" stroke-width="1"/>
  <text x="310" y="110" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e40af">1. ប្រសិនបើ P នោះ Q (P ⇒ Q)</text>
  <text x="310" y="130" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2563eb">2. ដឹងថា P ពិត (P is True)</text>
  <line x1="310" y1="140" x2="470" y2="140" stroke="#cbd5e1" stroke-width="1.5"/>
  <text x="310" y="162" font-family="sans-serif" font-size="13" font-weight="bold" fill="#059669">∴ ទាញបាន Q ពិតជាចាំបាច់!</text>
</svg>
`);

// 16. Rational Expressions: Domain & Simplification (Lesson 6)
export const SVG_RATIONAL_EXPRESSIONS = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 210" width="100%" height="100%">
  <rect width="560" height="210" fill="#f8fafc" rx="16"/>
  <text x="280" y="28" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">កន្សោមសនិទាន និងលក្ខខណ្ឌកំណត់ (Rational Expressions &amp; Domain)</text>
  <!-- Algebraic Fraction Display -->
  <rect x="40" y="55" width="230" height="130" rx="12" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="155" y="85" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e40af" text-anchor="middle">កន្សោមសនិទាន (Expression)</text>
  <text x="155" y="115" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb" text-anchor="middle">A(x) = (x² - 9) / (x - 3)</text>
  <line x1="60" y1="130" x2="250" y2="130" stroke="#bfdbfe" stroke-width="1.5"/>
  <text x="155" y="152" font-family="sans-serif" font-size="13" font-weight="bold" fill="#dc2626" text-anchor="middle">លក្ខខណ្ឌកំណត់៖ x - 3 ≠ 0</text>
  <text x="155" y="172" font-family="sans-serif" font-size="14" font-weight="bold" fill="#b91c1c" text-anchor="middle">⇒ x ≠ 3</text>
  <!-- Simplification Card -->
  <rect x="290" y="55" width="230" height="130" rx="12" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="2"/>
  <text x="405" y="85" font-family="sans-serif" font-size="13" font-weight="bold" fill="#166534" text-anchor="middle">សម្រួលប្រភាគ (Simplification)</text>
  <text x="405" y="115" font-family="sans-serif" font-size="15" font-weight="bold" fill="#15803d" text-anchor="middle">(x - 3)(x + 3) / (x - 3)</text>
  <line x1="310" y1="130" x2="500" y2="130" stroke="#bbf7d0" stroke-width="1.5"/>
  <text x="405" y="152" font-family="sans-serif" font-size="12" font-weight="bold" fill="#166534" text-anchor="middle">សម្រួលកត្តារួម (x - 3)</text>
  <text x="405" y="174" font-family="sans-serif" font-size="15" font-weight="bold" fill="#047857" text-anchor="middle">= x + 3 (ចំពោះ x ≠ 3)</text>
</svg>
`);

// 17. Linear Equations Balance Scale (Lesson 7)
export const SVG_LINEAR_EQUATIONS = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 220" width="100%" height="100%">
  <rect width="560" height="220" fill="#f8fafc" rx="16"/>
  <text x="280" y="28" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">គំរូតុល្យភាពជញ្ជីងនៃសមីការ៖ 2x + 3 = 11 ⇒ x = 4</text>
  <!-- Scale Stand -->
  <polygon points="275,80 285,80 295,170 265,170" fill="#475569"/>
  <rect x="240" y="170" width="80" height="15" rx="4" fill="#334155"/>
  <!-- Pivot point -->
  <circle cx="280" cy="80" r="7" fill="#ef4444"/>
  <!-- Crossbeam (Balanced) -->
  <line x1="100" y1="80" x2="460" y2="80" stroke="#1e293b" stroke-width="4"/>
  <!-- Left Pan Strings & Pan -->
  <line x1="120" y1="80" x2="80" y2="130" stroke="#64748b" stroke-width="1.5"/>
  <line x1="120" y1="80" x2="160" y2="130" stroke="#64748b" stroke-width="1.5"/>
  <path d="M 70,130 Q 120,150 170,130 Z" fill="#cbd5e1" stroke="#64748b" stroke-width="2"/>
  <!-- Left weights: 2x boxes + 3 dots -->
  <rect x="85" y="105" width="25" height="25" rx="4" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5"/>
  <text x="97" y="122" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">x</text>
  <rect x="115" y="105" width="25" height="25" rx="4" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5"/>
  <text x="127" y="122" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">x</text>
  <circle cx="148" cy="118" r="7" fill="#f59e0b"/>
  <text x="148" y="122" font-family="sans-serif" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">+3</text>
  <!-- Right Pan Strings & Pan -->
  <line x1="440" y1="80" x2="400" y2="130" stroke="#64748b" stroke-width="1.5"/>
  <line x1="440" y1="80" x2="480" y2="130" stroke="#64748b" stroke-width="1.5"/>
  <path d="M 390,130 Q 440,150 490,130 Z" fill="#cbd5e1" stroke="#64748b" stroke-width="2"/>
  <!-- Right weights: 11 -->
  <rect x="420" y="100" width="40" height="30" rx="6" fill="#10b981" stroke="#059669" stroke-width="1.5"/>
  <text x="440" y="120" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">11</text>
  <!-- Solution step label -->
  <text x="280" y="202" font-family="sans-serif" font-size="13" font-weight="bold" fill="#2563eb" text-anchor="middle">ដក 3 ទាំងសងខាង៖ 2x = 8 ⇒ x = 8 / 2 = 4</text>
</svg>
`);

// 18. Area of Polygons: Trapezoid & Rhombus (Lesson 14)
export const SVG_POLYGON_AREA = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 230" width="100%" height="100%">
  <rect width="580" height="230" fill="#f8fafc" rx="16"/>
  <text x="290" y="26" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">រូបមន្តផ្ទៃក្រឡាពហុកោណ៖ ចតុកោណព្នាយ និងចតុកោណពេជ្រ (Trapezoid &amp; Rhombus Area)</text>
  <!-- Figure 1: Trapezoid (Left) -->
  <g transform="translate(30, 45)">
    <!-- Trapezoid vertices: (40,110), (80,30), (180,30), (220,110) -->
    <polygon points="40,110 80,30 180,30 220,110" fill="#dbeafe" stroke="#2563eb" stroke-width="2.5"/>
    <!-- Top base b -->
    <text x="130" y="22" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1d4ed8" text-anchor="middle">បាតតូច b = 6 cm</text>
    <!-- Bottom base B -->
    <text x="130" y="128" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1d4ed8" text-anchor="middle">បាតធំ B = 10 cm</text>
    <!-- Height dashed line -->
    <line x1="80" y1="30" x2="80" y2="110" stroke="#dc2626" stroke-width="2" stroke-dasharray="4,4"/>
    <text x="92" y="75" font-family="sans-serif" font-size="11" font-weight="bold" fill="#dc2626">h = 5 cm</text>
    <!-- Trapezoid Formula -->
    <text x="130" y="152" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e3a8a" text-anchor="middle">S = (B + b) × h / 2</text>
    <text x="130" y="170" font-family="sans-serif" font-size="11" font-weight="bold" fill="#047857" text-anchor="middle">= (10 + 6) × 5 / 2 = 40 cm²</text>
  </g>
  <!-- Figure 2: Rhombus (Right) -->
  <g transform="translate(320, 45)">
    <!-- Rhombus vertices: (120,20), (190,70), (120,120), (50,70) -->
    <polygon points="120,20 190,70 120,120 50,70" fill="#fef3c7" stroke="#d97706" stroke-width="2.5"/>
    <!-- Diagonals d1 and d2 -->
    <line x1="50" y1="70" x2="190" y2="70" stroke="#dc2626" stroke-width="2" stroke-dasharray="3,3"/>
    <line x1="120" y1="20" x2="120" y2="120" stroke="#2563eb" stroke-width="2" stroke-dasharray="3,3"/>
    <text x="120" y="65" font-family="sans-serif" font-size="10" font-weight="bold" fill="#dc2626" text-anchor="middle">d₁ = 12 cm</text>
    <text x="145" y="45" font-family="sans-serif" font-size="10" font-weight="bold" fill="#2563eb">d₂ = 8 cm</text>
    <!-- Rhombus Formula -->
    <text x="120" y="152" font-family="sans-serif" font-size="12" font-weight="bold" fill="#92400e" text-anchor="middle">ផ្ទៃពេជ្រ S = (d₁ × d₂) / 2</text>
    <text x="120" y="170" font-family="sans-serif" font-size="11" font-weight="bold" fill="#047857" text-anchor="middle">= (12 × 8) / 2 = 48 cm²</text>
  </g>
</svg>
`);

// 19. Concurrent Lines & Segments in a Triangle (Lesson 16)
export const SVG_CONCURRENT_TRIANGLE_LINES = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 230" width="100%" height="100%">
  <rect width="580" height="230" fill="#f8fafc" rx="16"/>
  <text x="290" y="26" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">បន្ទាត់និងអង្កត់ពិសេសក្នុងត្រីកោណ៖ ទីប្រជុំទម្ងន់ G (Centroid of a Triangle)</text>
  <!-- Triangle ABC with Medians meeting at G -->
  <g transform="translate(40, 45)">
    <!-- Vertices: A(100, 20), B(20, 130), C(200, 130) -->
    <polygon points="100,20 20,130 200,130" fill="#f0fdf4" stroke="#16a34a" stroke-width="2.5"/>
    <text x="100" y="12" font-family="sans-serif" font-size="12" font-weight="bold" fill="#14532d" text-anchor="middle">A</text>
    <text x="8" y="138" font-family="sans-serif" font-size="12" font-weight="bold" fill="#14532d">B</text>
    <text x="208" y="138" font-family="sans-serif" font-size="12" font-weight="bold" fill="#14532d">C</text>
    <!-- Midpoints: M_BC(110, 130), M_AC(150, 75), M_AB(60, 75) -->
    <!-- Median AM -->
    <line x1="100" y1="20" x2="110" y2="130" stroke="#2563eb" stroke-width="2"/>
    <text x="110" y="145" font-family="sans-serif" font-size="10" font-weight="bold" fill="#2563eb" text-anchor="middle">M</text>
    <!-- Median BN -->
    <line x1="20" y1="130" x2="150" y2="75" stroke="#2563eb" stroke-width="1.5" stroke-dasharray="3,3"/>
    <!-- Median CP -->
    <line x1="200" y1="130" x2="60" y2="75" stroke="#2563eb" stroke-width="1.5" stroke-dasharray="3,3"/>
    <!-- Centroid G at (107, 93) -->
    <circle cx="107" cy="93" r="5" fill="#dc2626"/>
    <text x="122" y="94" font-family="sans-serif" font-size="13" font-weight="bold" fill="#dc2626">G</text>
  </g>
  <!-- Explanation Panel -->
  <rect x="280" y="50" width="270" height="155" rx="12" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="415" y="75" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e40af" text-anchor="middle">លក្ខណៈទីប្រជុំទម្ងន់ G (Centroid)</text>
  <line x1="295" y1="85" x2="535" y2="85" stroke="#bfdbfe" stroke-width="1.5"/>
  <text x="300" y="108" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0f172a">• ប្រសព្វមេដ្យានទាំងបី (3 Medians)</text>
  <text x="300" y="130" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2563eb">• សមាមាត្រ៖ AG = (2/3) AM</text>
  <text x="300" y="152" font-family="sans-serif" font-size="12" font-weight="bold" fill="#059669">• GM = (1/3) AM ⇒ AG = 2 GM</text>
  <text x="300" y="174" font-family="sans-serif" font-size="12" font-weight="bold" fill="#dc2626">• ចំណុចប្រសព្វផ្សេងទៀត៖</text>
  <text x="312" y="192" font-family="sans-serif" font-size="11" fill="#475569">I (ពុះមុំ), O (មេដ្យាទ័រ), H (កម្ពស់)</text>
</svg>
`);

// 20. Scale & Map Ratios (Lesson 18)
export const SVG_MAP_SCALE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 220" width="100%" height="100%">
  <rect width="580" height="220" fill="#f8fafc" rx="16"/>
  <text x="290" y="26" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e293b">មាត្រដ្ឋានលើប្លង់ និងផែនទី (Map Scale &amp; Distance Conversion)</text>
  <!-- Scale Ratio Display -->
  <g transform="translate(40, 50)">
    <rect x="0" y="0" width="220" height="135" rx="12" fill="#fef3c7" stroke="#fde68a" stroke-width="2"/>
    <text x="110" y="32" font-family="sans-serif" font-size="13" font-weight="bold" fill="#92400e" text-anchor="middle">មាត្រដ្ឋាន (Scale Ratio)</text>
    <text x="110" y="65" font-family="sans-serif" font-size="20" font-weight="bold" fill="#b45309" text-anchor="middle">1 : 50,000</text>
    <line x1="20" y1="80" x2="200" y2="80" stroke="#fde68a" stroke-width="1.5"/>
    <text x="110" y="104" font-family="sans-serif" font-size="12" font-weight="bold" fill="#78350f" text-anchor="middle">1 cm លើប្លង់ស្មើនឹង 50,000 cm</text>
    <text x="110" y="122" font-family="sans-serif" font-size="12" font-weight="bold" fill="#047857" text-anchor="middle">ស្មើនឹង 500 m (0.5 km) ជាក់ស្តែង</text>
  </g>
  <!-- Distance Calculation Example -->
  <g transform="translate(290, 50)">
    <rect x="0" y="0" width="250" height="135" rx="12" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
    <text x="125" y="32" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1e40af" text-anchor="middle">គណនាចម្ងាយពិត (Calculation)</text>
    <line x1="15" y1="45" x2="235" y2="45" stroke="#bfdbfe" stroke-width="1.5"/>
    <text x="15" y="70" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e293b">• ប្រវែងលើផែនទី = 6 cm</text>
    <text x="15" y="94" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2563eb">• ចម្ងាយជាក់ស្តែង = 6 × 50,000 cm</text>
    <text x="15" y="118" font-family="sans-serif" font-size="13" font-weight="bold" fill="#059669">= 300,000 cm = 3,000 m = 3 km</text>
  </g>
  <text x="290" y="205" font-family="sans-serif" font-size="12" font-weight="bold" fill="#334155" text-anchor="middle">រូបមន្ត៖ មាត្រដ្ឋាន = ប្រវែងលើប្លង់ / ប្រវែងពិតជាក់ស្តែង</text>
</svg>
`);

