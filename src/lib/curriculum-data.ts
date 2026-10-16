export type SubjectId = 'math' | 'physics' | 'chemistry' | 'biology' | 'english';
export type GradeLevel = 7 | 8 | 9 | 10 | 11 | 12;

export interface SubjectMeta {
  id: SubjectId;
  nameKm: string;
  nameEn: string;
  code: string;
  color: string;
  gradient: string;
  badgeBg: string;
  badgeText: string;
  iconName: string;
  descriptionKm: string;
  descriptionEn: string;
}

export interface LessonItem {
  id: string; // unique lesson identifier like 'math-g7-1'
  subject: SubjectId;
  grade: GradeLevel;
  orderIndex: number;
  titleKm: string;
  titleEn: string;
  descriptionKm: string;
  descriptionEn: string;
}

export const SUBJECTS: Record<SubjectId, SubjectMeta> = {
  math: {
    id: 'math',
    nameKm: 'គណិតវិទ្យា',
    nameEn: 'Mathematics',
    code: 'MATH',
    color: '#2563EB',
    gradient: 'from-blue-600 to-indigo-700',
    badgeBg: 'bg-blue-100 dark:bg-blue-950/60',
    badgeText: 'text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    iconName: 'Calculator',
    descriptionKm: 'ពង្រឹងការគិតបែបតក្កវិជ្ជា រូបមន្តពីជគណិត និងធរណីមាត្រស្របតាមក្រសួងអប់រំ',
    descriptionEn: 'Master logical thinking, algebraic formulas, and geometry aligned with MoEYS.',
  },
  physics: {
    id: 'physics',
    nameKm: 'រូបវិទ្យា',
    nameEn: 'Physics',
    code: 'PHYS',
    color: '#7C3AED',
    gradient: 'from-violet-600 to-purple-700',
    badgeBg: 'bg-purple-100 dark:bg-purple-950/60',
    badgeText: 'text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    iconName: 'Atom',
    descriptionKm: 'សិក្សាពីចលនា កម្លាំង អគ្គិសនី រលក និងទ្រឹស្តីរូបវិទ្យាអនុវត្តជាក់ស្តែង',
    descriptionEn: 'Explore motion, forces, electricity, waves, and practical physics principles.',
  },
  chemistry: {
    id: 'chemistry',
    nameKm: 'គីមីវិទ្យា',
    nameEn: 'Chemistry',
    code: 'CHEM',
    color: '#059669',
    gradient: 'from-emerald-600 to-teal-700',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60',
    badgeText: 'text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    iconName: 'FlaskConical',
    descriptionKm: 'ស្វែងយល់អំពីរចនាសម្ព័ន្ធអាតូម សមីការគីមី និងប្រតិកម្មក្នុងជីវភាពរស់នៅ',
    descriptionEn: 'Discover atomic structure, chemical equations, and organic reactions.',
  },
  biology: {
    id: 'biology',
    nameKm: 'ជីវវិទ្យា',
    nameEn: 'Biology',
    code: 'BIO',
    color: '#16A34A',
    gradient: 'from-green-600 to-emerald-700',
    badgeBg: 'bg-green-100 dark:bg-green-950/60',
    badgeText: 'text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
    iconName: 'Dna',
    descriptionKm: 'សិក្សាពីកោសិកា សរីរាង្គមនុស្ស ពន្ធុវិទ្យា និងប្រព័ន្ធអេកូឡូស៊ីធម្មជាតិ',
    descriptionEn: 'Study cells, human organ systems, genetics, and natural ecosystems.',
  },
  english: {
    id: 'english',
    nameKm: 'ភាសាអង់គ្លេស',
    nameEn: 'English',
    code: 'ENG',
    color: '#EA580C',
    gradient: 'from-orange-600 to-amber-700',
    badgeBg: 'bg-amber-100 dark:bg-amber-950/60',
    badgeText: 'text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    iconName: 'Languages',
    descriptionKm: 'អភិវឌ្ឍវេយ្យាករណ៍ វាក្យសព្ទ ការអាន និងការសរសេរសម្រាប់ប្រឡងឌីប្លូម និងបាក់ឌុប',
    descriptionEn: 'Develop grammar, vocabulary, reading, and essay writing for national exams.',
  },
};

export const GRADES: GradeLevel[] = [7, 8, 9, 10, 11, 12];

// Exact Cambodian MoEYS Curriculum tree for all 5 subjects across Grades 7-12
export const MOEYS_CURRICULUM: Record<SubjectId, Record<GradeLevel, Omit<LessonItem, 'id' | 'subject' | 'grade'>[]>> = {
  math: {
    7: [
      {
        orderIndex: 1,
        titleKm: 'ចំនួនគត់',
        titleEn: 'Whole Numbers & Integers',
        descriptionKm: 'ប្រព័ន្ធចំនួនគត់ធម្មជាតិ របាប់គោលដប់ ប្រមាណវិធីបូក ដក គុណ ចែក និងលក្ខណៈនៃប្រមាណវិធី',
        descriptionEn: 'Natural whole numbers, base-10 positional notation, arithmetic operations, and operational properties.',
      },
      {
        orderIndex: 2,
        titleKm: 'តួចែកនិងពហុគុណ',
        titleEn: 'Divisors and Multiples',
        descriptionKm: 'លក្ខណៈចែកដាច់ ចំនួនបឋម ការបំបែកជាផលគុណកត្តាបឋម តួចែករួមធំបំផុត (GCD) និងពហុគុណរួមតូចបំផុត (LCM)',
        descriptionEn: 'Divisibility rules, prime numbers, prime factorization, greatest common divisor (GCD), and least common multiple (LCM).',
      },
      {
        orderIndex: 3,
        titleKm: 'ចំនួនគត់រ៉ឺឡាទីប',
        titleEn: 'Relative Integers',
        descriptionKm: 'និយមន័យចំនួនវិជ្ជមាននិងអវិជ្ជមាន បន្ទាត់ចំនួន តម្លៃដាច់ខាត និងប្រមាណវិធីលើចំនួនគត់រ៉ឺឡាទីប',
        descriptionEn: 'Positive and negative integers, number lines, absolute values, and arithmetic rules on relative integers.',
      },
      {
        orderIndex: 4,
        titleKm: 'ប្រភាគ',
        titleEn: 'Fractions',
        descriptionKm: 'និយមន័យប្រភាគ ប្រភាគស្មើគ្នា ការសម្រួលប្រភាគ ភាគបែងរួម និងប្រមាណវិធីបូក ដក គុណ ចែក ប្រភាគ',
        descriptionEn: 'Fraction concepts, equivalent fractions, simplification, common denominators, and four operations on fractions.',
      },
      {
        orderIndex: 5,
        titleKm: 'ចំនួនទសភាគ',
        titleEn: 'Decimals',
        descriptionKm: 'ខ្ទង់ទសភាគ ប្រមាណវិធីលើចំនួនទសភាគ ការបំប្លែងរវាងប្រភាគនិងទសភាគ និងការបង្គត់ទិន្នន័យ',
        descriptionEn: 'Decimal place values, arithmetic on decimals, conversion between fractions and decimals, and rounding numbers.',
      },
      {
        orderIndex: 6,
        titleKm: 'ភាគរយ',
        titleEn: 'Percentages',
        descriptionKm: 'និយមន័យភាគរយ ការបំប្លែងរវាងភាគរយ ប្រភាគ និងទសភាគ ការគណនាការបញ្ចុះតម្លៃ និងការប្រាក់ទោល',
        descriptionEn: 'Concept of percent, conversion between percentages, fractions, and decimals; discounts and simple interest.',
      },
      {
        orderIndex: 7,
        titleKm: 'រង្វាស់រង្វាល់',
        titleEn: 'Measurement Units',
        descriptionKm: 'ខ្នាតប្រវែង ផ្ទៃក្រឡា ម៉ាស ចំណុះមាឌ និងពេលវេលាក្នុងប្រព័ន្ធរង្វាស់អន្តរជាតិ (SI)',
        descriptionEn: 'Metric units for length, area, mass, liquid capacity, and time conversions in SI system.',
      },
      {
        orderIndex: 8,
        titleKm: 'កន្សោមពីជគណិត',
        titleEn: 'Algebraic Expressions',
        descriptionKm: 'អថេរ មេគុណ តួ និងដឺក្រេ ការបូកដកតួដូចគ្នា និងការគណនាតម្លៃលេខនៃកន្សោមពីជគណិត',
        descriptionEn: 'Variables, coefficients, terms, degrees, combining like terms, and numerical evaluation of expressions.',
      },
      {
        orderIndex: 9,
        titleKm: 'សមីការដឺក្រេទី១មានមួយអញ្ញាត',
        titleEn: 'First-Degree Linear Equations in One Variable',
        descriptionKm: 'ទម្រង់សមីការ $ax + b = c$ ($a \\neq 0$) វិធានប្តូរអង្គ និងដំណោះស្រាយចំណោទអនុវត្តជាក់ស្តែង',
        descriptionEn: 'Linear equations of the form $ax + b = c$ ($a \\neq 0$), transposition rules, and real-world word problems.',
      },
      {
        orderIndex: 10,
        titleKm: 'វិសមភាព',
        titleEn: 'Inequalities',
        descriptionKm: 'សញ្ញាប្រៀបធៀប $<, \\le, >, \\ge$ លក្ខណៈវិសមភាព ការបូក ដក គុណ ចែកចំនួន និងការតាងចម្លើយលើបន្ទាត់ចំនួន',
        descriptionEn: 'Order symbols, properties of inequalities, arithmetic effects on signs, and graphical representation on the number line.',
      },
      {
        orderIndex: 11,
        titleKm: 'ផលធៀបនិងសមាមាត្រ',
        titleEn: 'Ratios and Proportions',
        descriptionKm: 'និយមន័យផលធៀប លក្ខណៈគ្រឹះនៃសមាមាត្រ ផលគុណខ្វែង និងការគណនាតម្លៃមិនស្គាល់',
        descriptionEn: 'Ratio definitions, fundamental property of proportions, cross-multiplication, and finding unknown terms.',
      },
      {
        orderIndex: 12,
        titleKm: 'សញ្ញាណដំបូងនៃរូបធរណីមាត្រ',
        titleEn: 'Basic Concepts of Geometry',
        descriptionKm: 'ចំណុច បន្ទាត់ កន្លះបន្ទាត់ អង្កត់ ប្រវែងអង្កត់ ចំណុចកណ្តាល និងប្លង់',
        descriptionEn: 'Points, straight lines, rays, line segments, segment length, midpoints, and plane concepts.',
      },
      {
        orderIndex: 13,
        titleKm: 'មុំ',
        titleEn: 'Angles',
        descriptionKm: 'និយមន័យមុំ ប្រភេទមុំ (មុំស្រួច មុំកែង មុំទាល មុំរាប) មុំបំពេញ មុំបន្ថែម និងមុំទល់កំពូល',
        descriptionEn: 'Angle definition, types of angles (acute, right, obtuse, straight), complementary, supplementary, and vertically opposite angles.',
      },
      {
        orderIndex: 14,
        titleKm: 'បន្ទាត់ស្រប បន្ទាត់កែង',
        titleEn: 'Parallel and Perpendicular Lines',
        descriptionKm: 'និយមន័យបន្ទាត់កែង មេដ្យាទ័រនៃអង្កត់ បន្ទាត់ស្រប និងមុំបង្កើតដោយបន្ទាត់ស្របកាត់ដោយខ្នាត់',
        descriptionEn: 'Perpendicular lines, perpendicular bisectors, parallel lines, and alternate interior/corresponding angles formed by transversals.',
      },
      {
        orderIndex: 15,
        titleKm: 'រូបធរណីមាត្រដែលមានវិមាត្រពីរ',
        titleEn: 'Two-Dimensional Geometric Figures',
        descriptionKm: 'លក្ខណៈត្រីកោណ (ត្រីកោណសម័ង្ស សមបាត កែង) និងចតុកោណ (ចតុកោណកែង ការេ ប្រលេឡូក្រាម)',
        descriptionEn: 'Classification and properties of 2D shapes: equilateral, isosceles, and right triangles; rectangles, squares, and parallelograms.',
      },
      {
        orderIndex: 16,
        titleKm: 'បរិមាត្រនិងផ្ទៃក្រឡាពហុកោណ',
        titleEn: 'Perimeter and Area of Polygons',
        descriptionKm: 'រូបមន្តបរិមាត្រ និងផ្ទៃក្រឡានៃត្រីកោណ ចតុកោណកែង ការេ ប្រលេឡូក្រាម និងចតុកោណព្នាយ',
        descriptionEn: 'Perimeter and area formulas for triangles, rectangles, squares, parallelograms, and trapezoids.',
      },
      {
        orderIndex: 17,
        titleKm: 'រង្វង់',
        titleEn: 'Circles',
        descriptionKm: 'ផ្ចិត កាំ អង្កត់ផ្ចិត ធ្នូ អង្កត់ធ្នូ បន្ទាត់ប៉ះ បរិមាត្រ $C = 2\\pi r$ និងផ្ទៃក្រឡារង្វង់ $S = \\pi r^2$',
        descriptionEn: 'Center, radius, diameter, arc, chord, tangent line, circumference $C = 2\\pi r$, and circle area $S = \\pi r^2$.',
      },
      {
        orderIndex: 18,
        titleKm: 'មាឌនិងផ្ទៃក្រឡាខាងនៃសូលីត',
        titleEn: 'Volume and Lateral Surface Area of Solids',
        descriptionKm: 'លក្ខណៈគូប ប្រលេពីប៉ែតកែង ព្រីសកែង ស៊ីឡាំង ផ្ទៃខាង និងរូបមន្តគណនាមាឌ',
        descriptionEn: 'Properties of cubes, rectangular cuboids, right prisms, cylinders; lateral surface area and volume calculations.',
      },
      {
        orderIndex: 19,
        titleKm: 'ភាពឆ្លុះ',
        titleEn: 'Reflection and Symmetry',
        descriptionKm: 'អ័ក្សឆ្លុះ ផ្ចិតឆ្លុះ ភាពឆ្លុះធៀបនឹងបន្ទាត់ ភាពឆ្លុះធៀបនឹងចំណុច និងលក្ខណៈរក្សាប្រវែង',
        descriptionEn: 'Axes of symmetry, center of symmetry, line reflections, point reflections, and length-preserving isometric properties.',
      },
      {
        orderIndex: 20,
        titleKm: 'ប្រូបាប',
        titleEn: 'Probability',
        descriptionKm: 'ពិសោធន៍ចៃដន្យ ព្រឹត្តិការណ៍ លទ្ធផលអាចកើតមាន និងរូបមន្តប្រូបាប $P = \\frac{\\text{ករណីស្រប}}{\\text{ករណីអាច}}$',
        descriptionEn: 'Random trials, events, favorable and possible outcomes, and basic probability formula $P = \\frac{n(E)}{n(S)}$.',
      },
      {
        orderIndex: 21,
        titleKm: 'ក្រាបសសរ',
        titleEn: 'Bar Graphs',
        descriptionKm: 'ការរៀបចំទិន្នន័យ ការអាន និងការគូសក្រាបសសរ (ក្រាបបង្គោល) ឈរ និងដេក ព្រមទាំងការបកស្រាយទិន្នន័យ',
        descriptionEn: 'Data organization, reading, plotting vertical and horizontal bar graphs, and interpreting frequency statistics.',
      },
      {
        orderIndex: 22,
        titleKm: 'ក្រាបផ្លិត',
        titleEn: 'Pie Charts',
        descriptionKm: 'ការគណនាមុំផ្ចិត $\\frac{\\text{តម្លៃ}}{\\text{សរុប}} \\times 360^\\circ$ ការគូរដ្យាក្រាមផ្លិតរង្វង់ និងការប្រៀបធៀបភាគរយ',
        descriptionEn: 'Central angle calculation $\\frac{\\text{value}}{\\text{total}} \\times 360^\\circ$, constructing pie charts, and percentage distribution analysis.',
      },
    ],
    8: [
      {
        orderIndex: 1,
        titleKm: 'ចំនួនសនិទាន',
        titleEn: 'Rational Numbers',
        descriptionKm: 'និយមន័យចំនួនសនិទាន ទសភាគខួប ប្រមាណវិធីលើចំនួនសនិទាន និងការប្រៀបធៀប',
        descriptionEn: 'Definition of rational numbers, recurring decimals, rational arithmetic, and ordering.',
      },
      {
        orderIndex: 2,
        titleKm: 'ស្វ័យគុណ',
        titleEn: 'Powers',
        descriptionKm: 'ស្វ័យគុណដែលមាននិទស្សន្តជាចំនួនគត់ វិធានស្វ័យគុណ និងការគណនាឬសគូប',
        descriptionEn: 'Integer exponents, exponent rules, scientific notation, and cube roots.',
      },
      {
        orderIndex: 3,
        titleKm: 'ទំហំសមាមាត្រនិងភាគរយ',
        titleEn: 'Proportions and Percentages',
        descriptionKm: 'សមាមាត្រផ្ទាល់ សមាមាត្រច្រាស ការគណនាថ្លៃដើម ប្រាក់ចំណេញ និងការប្រាក់ទោល',
        descriptionEn: 'Direct and inverse proportions, cost price, profit and loss, and simple interest.',
      },
      {
        orderIndex: 4,
        titleKm: 'រង្វាស់រង្វាល់',
        titleEn: 'Measurement Units',
        descriptionKm: 'ប្រព័ន្ធខ្នាតអន្តរជាតិ ការបំប្លែងរវាងខ្នាតប្រវែង ផ្ទៃក្រឡា មាឌ និងចំណុះ',
        descriptionEn: 'International metric units, length, area, volume, and capacity conversions.',
      },
      {
        orderIndex: 5,
        titleKm: 'កន្សោមពីជគណិត',
        titleEn: 'Algebraic Expressions',
        descriptionKm: 'ពន្លាតស្វ័យគុណ រូបមន្តស្មើភាពគួរចងចាំ និងការដាក់ជាផលគុណកត្តា',
        descriptionEn: 'Polynomial expansion, special algebraic identities, and factorization.',
      },
      {
        orderIndex: 6,
        titleKm: 'កន្សោមសនិទាន',
        titleEn: 'Rational Expressions',
        descriptionKm: 'និយមន័យកន្សោមសនិទាន លក្ខខណ្ឌកំណត់ ប្រមាណវិធីបូក ដក គុណ ចែក និងសម្រួលប្រភាគពីជគណិត',
        descriptionEn: 'Rational algebraic expressions, domain restrictions, simplification, and operations.',
      },
      {
        orderIndex: 7,
        titleKm: 'សមីការដឺក្រេទី១មានមួយអញ្ញាត',
        titleEn: 'First-Degree Linear Equations in One Variable',
        descriptionKm: 'វិធានដោះស្រាយសមីការដឺក្រេទី១ មានមួយអញ្ញាត សមីការមានរាងប្រភាគ និងចំណោទ',
        descriptionEn: 'Solving first-degree linear equations in one variable, fractional linear equations, and word problems.',
      },
      {
        orderIndex: 8,
        titleKm: 'វិសមីការដឺក្រេទី១មានមួយអញ្ញាត',
        titleEn: 'First-Degree Linear Inequalities in One Variable',
        descriptionKm: 'លក្ខណៈវិសមភាព វិធានដោះស្រាយវិសមីការ និងការតាងសំណុំចម្លើយលើបន្ទាត់ចំនួន',
        descriptionEn: 'Inequality properties, solving single-variable linear inequalities, and number line graphs.',
      },
      {
        orderIndex: 9,
        titleKm: 'ប្លង់កូអរដោនេនិងក្រាប',
        titleEn: 'Coordinate Plane and Graphs',
        descriptionKm: 'ប្លង់កូអរដោនេដេកាត សមីការបន្ទាត់ y = ax + b មេគុណប្រាប់ទិស និងក្រាប',
        descriptionEn: 'Cartesian coordinate plane, linear equation y = mx + b, slope, intercepts, and graphing.',
      },
      {
        orderIndex: 10,
        titleKm: 'ស្ថិតិ',
        titleEn: 'Statistics',
        descriptionKm: 'ការប្រមូលទិន្នន័យ តារាងប្រេកង់កើន អ៊ីស្តូក្រាម មធ្យម មេដ្យាន និងម៉ូត',
        descriptionEn: 'Data collection, frequency distribution tables, histograms, mean, median, and mode.',
      },
      {
        orderIndex: 11,
        titleKm: 'ប្រូបាប',
        titleEn: 'Probability',
        descriptionKm: 'ពិសោធន៍ចៃដន្យ លំហសំណាក ព្រឹត្តិការណ៍ និងដ្យាក្រាមដើមឈើប្រូបាប',
        descriptionEn: 'Random experiments, sample space, theoretical probability, and tree diagrams.',
      },
      {
        orderIndex: 12,
        titleKm: 'ការប្រៀបធៀបត្រីកោណ',
        titleEn: 'Comparison of Triangles',
        descriptionKm: 'លក្ខខណ្ឌត្រីកោណប៉ុនគ្នា (SSS, SAS, ASA, AAS, RHS) និងវិសមភាពត្រីកោណ',
        descriptionEn: 'Triangle congruence criteria (SSS, SAS, ASA, AAS, RHS) and the triangle inequality.',
      },
      {
        orderIndex: 13,
        titleKm: 'ចតុកោណ',
        titleEn: 'Quadrilaterals',
        descriptionKm: 'លក្ខណៈប្រលេឡូក្រាម ចតុកោណកែង ពេជ្រ ការេ និងចតុកោណព្នាយ',
        descriptionEn: 'Properties and theorems of parallelograms, rectangles, rhombuses, squares, and trapezoids.',
      },
      {
        orderIndex: 14,
        titleKm: 'ផ្ទៃក្រឡាពហុកោណ',
        titleEn: 'Area of Polygons',
        descriptionKm: 'រូបមន្តផ្ទៃក្រឡាត្រីកោណ ចតុកោណកែង ប្រលេឡូក្រាម ពេជ្រ ចតុកោណព្នាយ និងពហុកោណនិយ័ត',
        descriptionEn: 'Area formulas for triangles, rectangles, parallelograms, rhombuses, trapezoids, and regular polygons.',
      },
      {
        orderIndex: 15,
        titleKm: 'រង្វង់',
        titleEn: 'Circles',
        descriptionKm: 'បន្ទាត់ប៉ះ អង្កត់ធ្នូ មុំផ្ចិត មុំចារឹកក្នុងរង្វង់ និងមុំចារឹកកន្លះរង្វង់',
        descriptionEn: 'Tangent lines, chords, central angles, inscribed angles, and semicircle angle theorems.',
      },
      {
        orderIndex: 16,
        titleKm: 'បន្ទាត់និងអង្កត់ពិសេសជួបគ្នានៅក្នុងត្រីកោណ',
        titleEn: 'Concurrent Lines and Segments in a Triangle',
        descriptionKm: 'កន្លះបន្ទាត់ពុះមុំ មេដ្យាទ័រ មេដ្យាន កម្ពស់ និងចំណុចប្រសព្វពិសេសទាំងបួនក្នុងត្រីកោណ',
        descriptionEn: 'Angle bisectors, perpendicular bisectors, medians, altitudes, and triangle centers (incenter, circumcenter, centroid, orthocenter).',
      },
      {
        orderIndex: 17,
        titleKm: 'រូបធរណីមាត្រដែលមានវិមាត្របី',
        titleEn: 'Three-Dimensional Geometric Figures',
        descriptionKm: 'ផ្ទៃខាង ផ្ទៃសរុប និងមាឌនៃគូប ប្រលេពីប៉ែតកែង ព្រីស ស៊ីឡាំង និងពីរ៉ាមីត',
        descriptionEn: 'Surface area and volume of cubes, rectangular prisms, right prisms, cylinders, and pyramids.',
      },
      {
        orderIndex: 18,
        titleKm: 'មាត្រដ្ឋាន',
        titleEn: 'Scale',
        descriptionKm: 'និយមន័យមាត្រដ្ឋានលើប្លង់ និងផែនទី ការគណនាប្រវែងពិត និងប្រវែងលើគំនូសបំព្រួញ',
        descriptionEn: 'Map scale, architectural drawing scales, calculating actual distances, and reduction ratios.',
      },
    ],
    9: [
      {
        orderIndex: 1,
        titleKm: 'ចំនួនអសនិទាន',
        titleEn: 'Irrational Numbers',
        descriptionKm: 'និយមន័យចំនួនអសនិទាន ទសភាគមិនខួបមិនចេះចប់ ការប្រៀបធៀប និងប្រតិបត្តិការលើរ៉ាឌីកាល់',
        descriptionEn: 'Definition of irrational numbers, non-terminating non-recurring decimals, comparison, and radical operations.',
      },
      {
        orderIndex: 2,
        titleKm: 'សមាមាត្រ',
        titleEn: 'Proportions',
        descriptionKm: 'ផលធៀប សមាមាត្រផ្ទាល់ សមាមាត្រច្រាស លក្ខណៈនៃសមាមាត្រ និងការដោះស្រាយចំណោទអនុវត្ត',
        descriptionEn: 'Ratios, direct and inverse proportions, properties of proportions, and practical problem solving.',
      },
      {
        orderIndex: 3,
        titleKm: 'កន្សោមពីជគណិត',
        titleEn: 'Algebraic Expressions',
        descriptionKm: 'ឯកធា ពហុធា ផលបូក ផលដក ផលគុណ ផលចែកពហុធា រូបមន្តស្មើភាព និងការដាក់ជាផលគុណកត្តា',
        descriptionEn: 'Monomials, polynomials, polynomial arithmetic, special product identities, and factorization techniques.',
      },
      {
        orderIndex: 4,
        titleKm: 'សមីការដឺក្រេទី ១ មានមួយអញ្ញាត',
        titleEn: 'First-Degree Linear Equations in One Variable',
        descriptionKm: 'វិធានដោះស្រាយសមីការដឺក្រេទី១ មានមួយអញ្ញាត សមីការមានរាងប្រភាគ និងការបង្កើតសមីការដោះស្រាយចំណោទ',
        descriptionEn: 'Solving first-degree linear equations in one variable, fractional linear equations, and word problem modeling.',
      },
      {
        orderIndex: 5,
        titleKm: 'វិសមីការដឺក្រេទី ១ មានមួយអញ្ញាត',
        titleEn: 'First-Degree Linear Inequalities in One Variable',
        descriptionKm: 'លក្ខណៈវិសមភាព ការដោះស្រាយវិសមីការដឺក្រេទី១ មានមួយអញ្ញាត និងការបកស្រាយសំណុំចម្លើយលើបន្ទាត់ចំនួន',
        descriptionEn: 'Inequality properties, solving single-variable linear inequalities, and representing solution sets on a number line.',
      },
      {
        orderIndex: 6,
        titleKm: 'បំណែងចែកប្រេកង់',
        titleEn: 'Frequency Distribution',
        descriptionKm: 'ការប្រមូល និងរៀបចំទិន្នន័យ តារាងបំណែងចែកប្រេកង់ ថ្នាក់ទិន្នន័យ ប្រេកង់កើន និងអ៊ីស្តូក្រាម',
        descriptionEn: 'Data organization, frequency distribution tables, class intervals, cumulative frequency, and histograms.',
      },
      {
        orderIndex: 7,
        titleKm: 'មធ្យមស្ថិតិ',
        titleEn: 'Statistical Mean',
        descriptionKm: 'ការគណនាមធ្យមនព្វន្តសម្រាប់ទិន្នន័យទោល និងទិន្នន័យជាថ្នាក់ មធ្យមទម្ងន់ និងការបកស្រាយទិន្នន័យ',
        descriptionEn: 'Calculating arithmetic mean for ungrouped and grouped data, weighted mean, and statistical data interpretation.',
      },
      {
        orderIndex: 8,
        titleKm: 'ប្រូបាប',
        titleEn: 'Probability',
        descriptionKm: 'ពិសោធន៍ចៃដន្យ លំហសំណាក ព្រឹត្តិការណ៍ រូបមន្តប្រូបាប P(A) = n(A)/n(S) និងប្រូបាបនៃព្រឹត្តិការណ៍ផ្ទុយ',
        descriptionEn: 'Random experiments, sample spaces, events, theoretical probability formula P(A) = n(A)/n(S), and complementary events.',
      },
      {
        orderIndex: 9,
        titleKm: 'ចម្ងាយរវាងពីរចំណុច',
        titleEn: 'Distance Between Two Points',
        descriptionKm: 'ប្លង់កូអរដោនេដេកាត រូបមន្តចម្ងាយរវាងពីរចំណុច d = √((x₂ - x₁)² + (y₂ - y₁)²) និងចំណុចកណ្តាលនៃអង្កត់',
        descriptionEn: 'Cartesian plane coordinates, distance formula d = √((x₂ - x₁)² + (y₂ - y₁)²), and segment midpoint coordinates.',
      },
      {
        orderIndex: 10,
        titleKm: 'សមីការនៃបន្ទាត់',
        titleEn: 'Equation of a Line',
        descriptionKm: 'ទម្រង់ទូទៅ និងទម្រង់ជម្រាល y = mx + b មេគុណប្រាប់ទិស (Slope) លក្ខខណ្ឌបន្ទាត់ស្រប និងកែងគ្នា',
        descriptionEn: 'General and slope-intercept forms y = mx + b, calculating slope m, parallel line condition (m₁ = m₂) and perpendicular line condition (m₁ · m₂ = -1).',
      },
      {
        orderIndex: 11,
        titleKm: 'ប្រព័ន្ធសមីការដឺក្រេទី ១ មានពីរអញ្ញាត',
        titleEn: 'Systems of Linear Equations in Two Variables',
        descriptionKm: 'វិធីជំនួស វិធីបូកបំបាត់ វិធីក្រាហ្វិក និងការដោះស្រាយចំណោទដោយប្រើប្រព័ន្ធសមីការ',
        descriptionEn: 'Substitution method, elimination method, graphical intersection method, and solving real-world word problems.',
      },
      {
        orderIndex: 12,
        titleKm: 'ទ្រឹស្តីបទពីតាគ័រ',
        titleEn: 'Pythagorean Theorem',
        descriptionKm: 'សេចក្តីថ្លែងទ្រឹស្តីបទពីតាគ័រ c² = a² + b² ទ្រឹស្តីបទច្រាស និងការអនុវត្តគណនាប្រវែងជ្រុងត្រីកោណកែង',
        descriptionEn: 'Pythagorean theorem c² = a² + b², converse of Pythagoras, and practical length calculations in right triangles.',
      },
      {
        orderIndex: 13,
        titleKm: 'រង្វង់និងបន្ទាត់',
        titleEn: 'Circles and Lines',
        descriptionKm: 'ទីតាំងធៀបរវាងរង្វង់និងបន្ទាត់ (បន្ទាត់កាត់ បន្ទាត់ប៉ះ បន្ទាត់ក្រៅ) លក្ខណៈបន្ទាត់ប៉ះ និងអង្កត់ធ្នូ',
        descriptionEn: 'Relative positions of a line and a circle (secant, tangent, external line), tangent radius perpendicularity, and chord properties.',
      },
      {
        orderIndex: 14,
        titleKm: 'លក្ខណៈមុំនៃរង្វង់',
        titleEn: 'Angle Properties of Circles',
        descriptionKm: 'មុំផ្ចិត មុំចារឹកក្នុងរង្វង់ មុំក្នុងកន្លះរង្វង់ និងចតុកោណចារឹកក្នុងរង្វង់ (ផលបូកមុំឈម ១៨០ ដឺក្រេ)',
        descriptionEn: 'Central angles, inscribed angles, angle subtended by a diameter (90° in semicircle), and cyclic quadrilateral angle properties.',
      },
      {
        orderIndex: 15,
        titleKm: 'ទ្រឹស្តីបទតាលែស',
        titleEn: "Thales's Theorem",
        descriptionKm: 'ទ្រឹស្តីបទតាលែសក្នុងត្រីកោណ បន្ទាត់ស្របកាត់ជ្រុងទាំងពីរ ទ្រឹស្តីបទច្រាស និងអនុវត្តគណនាប្រវែង',
        descriptionEn: "Thales's intercept theorem in triangles, parallel line proportional segments AD/DB = AE/EC, converse, and length calculations.",
      },
      {
        orderIndex: 16,
        titleKm: 'ត្រីកោណដូចគ្នា',
        titleEn: 'Similar Triangles',
        descriptionKm: 'និយមន័យ លក្ខខណ្ឌសម្គាល់ត្រីកោណដូចគ្នា (AA, SAS, SSS) ផលធៀបភាពដូចគ្នា និងផលធៀបផ្ទៃក្រឡា k²',
        descriptionEn: 'Definition, criteria for triangle similarity (AA, SAS, SSS), similarity scale factor k, and area ratio k².',
      },
      {
        orderIndex: 17,
        titleKm: 'ពហុកោណ',
        titleEn: 'Polygons',
        descriptionKm: 'និយមន័យពហុកោណ ផលបូកមុំក្នុង (n - 2) × 180° ផលបូកមុំក្រៅ 360° និងលក្ខណៈពហុកោណនិយ័ត',
        descriptionEn: 'Polygon classification, sum of interior angles (n - 2) × 180°, sum of exterior angles 360°, and regular polygon calculations.',
      },
      {
        orderIndex: 18,
        titleKm: 'សូលីត',
        titleEn: 'Solids',
        descriptionKm: 'ផ្ទៃក្រឡា និងមាឌនៃកោណ ពីរ៉ាមីត ព្រីស និងស្វ៊ែរ ព្រមទាំងការអនុវត្តគណនាជាក់ស្តែង',
        descriptionEn: 'Surface area and volume formulas for right circular cones, pyramids, prisms, and spheres, with practical applications.',
      },
    ],
    10: [
      {
        orderIndex: 1,
        titleKm: 'ពហុធា',
        titleEn: 'Polynomials',
        descriptionKm: 'និយមន័យពហុធា ដឺក្រេនៃពហុធា មេគុណ ផលបូក ផលដក ផលគុណពហុធា និងស្មើភាពពហុធា',
        descriptionEn: 'Polynomial definition, degree, coefficients, addition, subtraction, multiplication, and polynomial equality.',
      },
      {
        orderIndex: 2,
        titleKm: 'ប្រមាណវិធីចែកពហុធា',
        titleEn: 'Polynomial Division',
        descriptionKm: 'វិធីចែកពហុធាតាមក្បួនធម្មតា ក្បួនចែកហ័រន័រ (Horner) ទ្រឹស្តីបទសំណល់ និងទ្រឹស្តីបទកត្តា',
        descriptionEn: 'Polynomial long division, Horner synthetic division algorithm, remainder theorem, and factor theorem.',
      },
      {
        orderIndex: 3,
        titleKm: 'តក្កវិទ្យា',
        titleEn: 'Logic',
        descriptionKm: 'សំណើ តម្លៃភាពពិត ឈ្នាប់តក្កវិជ្ជា (និង ឬ នាំឱ្យ សមមូល) តារាងភាពពិត និងបរិមាណករ',
        descriptionEn: 'Mathematical propositions, truth values, logical connectives (AND, OR, implies, biconditional), truth tables, and quantifiers.',
      },
      {
        orderIndex: 4,
        titleKm: 'សំណុំ',
        titleEn: 'Sets',
        descriptionKm: 'និយមន័យសំណុំ ធាតុនៃសំណុំ សំណុំរង សំណុំទទេ ប្រមាណវិធីលើសំណុំ (ប្រជុំ ប្រសព្វ ផលដក បំពេញ) និងដ្យាក្រាមវ៉ែន',
        descriptionEn: 'Set concepts, elements, subsets, empty set, set operations (union, intersection, difference, complement), and Venn diagrams.',
      },
      {
        orderIndex: 5,
        titleKm: 'ចំនួន',
        titleEn: 'Numbers',
        descriptionKm: 'សំណុំចំនួន (N, Z, Q, R, C) លក្ខណៈនៃចំនួនពិត តម្លៃដាច់ខាត អនុវត្តចន្លោះ និងការបំបែកជាកត្តា',
        descriptionEn: 'Number systems (N, Z, Q, R, C), properties of real numbers, absolute values, interval notation, and prime properties.',
      },
      {
        orderIndex: 6,
        titleKm: 'សមីការដឺក្រេទី ២ មានមួយអញ្ញាត',
        titleEn: 'Quadratic Equations in One Variable',
        descriptionKm: 'ទម្រង់ទូទៅ ax² + bx + c = 0 ឌីសគ្រីមីណង់ Δ = b² - 4ac រូបមន្តឫស និងទំនាក់ទំនងវីយ៉ែត (Viète)',
        descriptionEn: 'Standard form ax² + bx + c = 0, discriminant Δ = b² - 4ac, quadratic formula, and Viète\'s relations.',
      },
      {
        orderIndex: 7,
        titleKm: 'សមីការអសនិទាននិងសមីការដឺក្រេលំដាប់ខ្ពស់',
        titleEn: 'Irrational and Higher-Degree Equations',
        descriptionKm: 'សមីការរ៉ាឌីកាល់ (អសនិទាន) សមីការទ្វេការេ សមីការដឺក្រេទី៣ និងទី៤ ដោយប្រើកត្តា និងការប្តូរអថេរ',
        descriptionEn: 'Radical (irrational) equations, biquadratic equations, higher-degree polynomial equations using factoring and substitution.',
      },
      {
        orderIndex: 8,
        titleKm: 'ប្រព័ន្ធសមីការ',
        titleEn: 'Systems of Equations',
        descriptionKm: 'ប្រព័ន្ធសមីការដឺក្រេទី១ មានពីរ និងបីអញ្ញាត (ក្បួនក្រាមែ) និងប្រព័ន្ធសមីការដឺក្រេទី២',
        descriptionEn: 'Systems of linear equations in 2 and 3 variables (Cramer\'s rule), substitution, and non-linear quadratic systems.',
      },
      {
        orderIndex: 9,
        titleKm: 'វិសមីការនិងប្រព័ន្ធវិសមីការ',
        titleEn: 'Inequalities and Systems of Inequalities',
        descriptionKm: 'វិសមីការដឺក្រេទី១ វិសមីការដឺក្រេទី២ តារាងសញ្ញាត្រីធាដឺក្រេទី២ និងប្រព័ន្ធវិសមីការ',
        descriptionEn: 'First-degree and quadratic inequalities, sign tables for quadratic trinomials, and systems of inequalities.',
      },
      {
        orderIndex: 10,
        titleKm: 'កូអរដោនេនៃចំណុច',
        titleEn: 'Coordinates of Points',
        descriptionKm: 'ប្លង់កូអរដោនេដេកាត ចម្ងាយរវាងពីរចំណុច កូអរដោនេចំណុចកណ្តាល និងចំណុចចែកអង្កត់តាមផលធៀប',
        descriptionEn: 'Cartesian coordinate system, distance formula, midpoint coordinates, and point dividing a segment in a given ratio.',
      },
      {
        orderIndex: 11,
        titleKm: 'សមីការបន្ទាត់',
        titleEn: 'Equation of a Line',
        descriptionKm: 'ទម្រង់ចំណោទ-កាត់ y = mx + c ទម្រង់ទូទៅ ax + by + c = 0 មេគុណប្រាប់ទិស លក្ខខណ្ឌបន្ទាត់ស្រប និងកែង',
        descriptionEn: 'Slope-intercept form y = mx + c, general form ax + by + c = 0, slope formula, parallel and perpendicular conditions.',
      },
      {
        orderIndex: 12,
        titleKm: 'សមីការរង្វង់',
        titleEn: 'Equation of a Circle',
        descriptionKm: 'សមីការស្តង់ដា (x - a)² + (y - b)² = r² ទម្រង់ទូទៅ x² + y² + 2gx + 2fy + c = 0 ផ្ចិត កាំ និងបន្ទាត់ប៉ះរង្វង់',
        descriptionEn: 'Standard equation of circle (x - a)² + (y - b)² = r², general form, center, radius, and tangent line equations.',
      },
      {
        orderIndex: 13,
        titleKm: 'ការដោះស្រាយវិសមីការតាមក្រាប',
        titleEn: 'Solving Inequalities Graphically',
        descriptionKm: 'កន្លះប្លង់ចម្លើយ បន្ទាត់ព្រំដែន ការដោះស្រាយវិសមីការលីនេអ៊ែរតាមក្រាប និងប្រព័ន្ធវិសមីការលីនេអ៊ែរ',
        descriptionEn: 'Boundary lines, half-plane solution regions, graphical solutions of linear inequalities and linear programming systems.',
      },
      {
        orderIndex: 14,
        titleKm: 'ផលធៀបត្រីកោណមាត្រ',
        titleEn: 'Trigonometric Ratios',
        descriptionKm: 'និយមន័យ sin, cos, tan, cot ក្នុងត្រីកោណកែង រង្វង់ត្រីកោណមាត្រ សញ្ញាតាមក្វាដ្រង់ និងរូបមន្តគ្រឹះ sin²θ + cos²θ = 1',
        descriptionEn: 'Definitions of sin, cos, tan, cot in right triangles, unit circle, quadrant signs, and fundamental identity sin²θ + cos²θ = 1.',
      },
      {
        orderIndex: 15,
        titleKm: 'ការអនុវត្តផលធៀបត្រីកោណ',
        titleEn: 'Applications of Trigonometric Ratios',
        descriptionKm: 'ទ្រឹស្តីបទស៊ីនុស ទ្រឹស្តីបទកូស៊ីនុស រូបមន្តផ្ទៃក្រឡាត្រីកោណ មុំងើប និងមុំទម្លាក់ក្នុងការវាស់វែងជាក់ស្តែង',
        descriptionEn: 'Sine rule, cosine rule, triangle area formula (1/2 ab sin C), angles of elevation and depression in real-world measurements.',
      },
      {
        orderIndex: 16,
        titleKm: 'អនុគមន៍និងក្រាបអនុគមន៍',
        titleEn: 'Functions and Graphs of Functions',
        descriptionKm: 'និយមន័យអនុគមន៍ ដែនកំណត់ សំណុំរូបភាព តារាងតម្លៃ ក្រាបអនុគមន៍ និងលក្ខណៈអនុគមន៍គូ-សេស',
        descriptionEn: 'Function concepts, domain, range, table of values, function graphing, and odd/even function symmetries.',
      },
      {
        orderIndex: 17,
        titleKm: 'អនុគមន៍ដឺក្រេទី ២',
        titleEn: 'Quadratic Functions',
        descriptionKm: 'ទម្រង់ y = ax² + bx + c និងទម្រង់កំពូល y = a(x - h)² + k កំពូល អ័ក្សឆ្លុះ ក្រាបប៉ារ៉ាបូល និងតម្លៃអតិបរមា/អប្បបរមា',
        descriptionEn: 'Quadratic forms y = ax² + bx + c and vertex form y = a(x - h)² + k, vertex, axis of symmetry, parabola graphing, and min/max values.',
      },
      {
        orderIndex: 18,
        titleKm: 'អនុគមន៍សនិទាននិងអសនិទាន',
        titleEn: 'Rational and Irrational Functions',
        descriptionKm: 'អនុគមន៍ប្រភាគ f(x) = (ax + b)/(cx + d) អាស៊ីមតូតឈរ អាស៊ីមតូតដេក និងអនុគមន៍រ៉ាឌីកាល់ f(x) = √(ax + b)',
        descriptionEn: 'Homographic rational functions f(x) = (ax + b)/(cx + d), vertical and horizontal asymptotes, and radical functions f(x) = √(ax + b).',
      },
      {
        orderIndex: 19,
        titleKm: 'បំណែងចែកប្រេកង់និងការតាងក្រាប',
        titleEn: 'Frequency Distribution and Graphical Representation',
        descriptionKm: 'តារាងបំណែងចែកប្រេកង់ ប្រេកង់កើន អ៊ីស្តូក្រាម ពហុកោណប្រេកង់ និងអូជីវ (ក្រាបប្រេកង់កើន)',
        descriptionEn: 'Frequency tables, cumulative frequency, histograms, frequency polygons, and ogive curves.',
      },
      {
        orderIndex: 20,
        titleKm: 'រង្វាស់ទីតាំង',
        titleEn: 'Measures of Position',
        descriptionKm: 'ក្វាទទីល (Q₁, Q₂, Q₃) ដេស៊ីល សង់ទីល គម្លាតអន្តរក្វាទទីល (IQR) និងដ្យាក្រាមប្រអប់ (Box-and-Whisker Plot)',
        descriptionEn: 'Quartiles (Q₁, Q₂, Q₃), deciles, percentiles, interquartile range (IQR), and box-and-whisker plots.',
      },
      {
        orderIndex: 21,
        titleKm: 'វ៉ិចទ័រនិងប្រមាណវិធីលើវ៉ិចទ័រ',
        titleEn: 'Vectors and Vector Operations',
        descriptionKm: 'និយមន័យវ៉ិចទ័រ វ៉ិចទ័រស្មើគ្នា ផលបូកវ៉ិចទ័រ (វិធានត្រីកោណ វិធានប្រលេឡូក្រាម) ផលគុណវ៉ិចទ័រនឹងចំនួនពិត និងកូអរដោនេវ៉ិចទ័រ',
        descriptionEn: 'Vector definition, equal vectors, vector addition (triangle and parallelogram laws), scalar multiplication, and coordinate representation.',
      },
      {
        orderIndex: 22,
        titleKm: 'ការអនុវត្តវ៉ិចទ័រ',
        titleEn: 'Applications of Vectors',
        descriptionKm: 'ផលគុណស្កាលែនៃពីរវ៉ិចទ័រ u · v = |u||v|cosθ មុំរវាងពីរវ៉ិចទ័រ លក្ខខណ្ឌកែងគ្នា u · v = 0 និងការអនុវត្តក្នុងធរណីមាត្រ',
        descriptionEn: 'Dot product of vectors u · v = |u||v|cosθ, angle between vectors, orthogonality condition u · v = 0, and geometric proofs.',
      },
      {
        orderIndex: 23,
        titleKm: 'ការបំប្លែងកិល',
        titleEn: 'Translation',
        descriptionKm: 'និយមន័យបំប្លែងកិលតាមវ៉ិចទ័រ u(a, b) រូបមន្តកូអរដោនេ x\' = x + a, y\' = y + b និងលក្ខណៈរក្សាប្រវែង និងរូបរាង',
        descriptionEn: 'Translation by vector u(a, b), coordinate transformation x\' = x + a, y\' = y + b, isometry, and preservation of shape and size.',
      },
      {
        orderIndex: 24,
        titleKm: 'ការបំប្លែងឆ្លុះ',
        titleEn: 'Reflection',
        descriptionKm: 'ការបំប្លែងឆ្លុះធៀបនឹងអ័ក្ស (Ox, Oy, បន្ទាត់ y = x) រូបមន្តកូអរដោនេ និងលក្ខណៈអ៊ីសូមេទ្រីនៃភាពឆ្លុះ',
        descriptionEn: 'Reflection across coordinate axes (x-axis, y-axis, y = x line), coordinate rules, and isometric reflective properties.',
      },
      {
        orderIndex: 25,
        titleKm: 'ការបំប្លែងវិល',
        titleEn: 'Rotation',
        descriptionKm: 'ការបំប្លែងវិលជុំវិញផ្ចិត O មុំ 90°, 180°, 270° ទ្រនិចនាឡិកា និងច្រាសទ្រនិចនាឡិកា រូបមន្តកូអរដោនេ',
        descriptionEn: 'Rotation around center O with angles 90°, 180°, 270° clockwise and counterclockwise, coordinate transformation formulas.',
      },
      {
        orderIndex: 26,
        titleKm: 'ការបំប្លែងចាំង',
        titleEn: 'Glide Reflection',
        descriptionKm: 'ការបំប្លែងចាំងជាបន្សំនៃបំប្លែងកិលស្របនឹងអ័ក្ស និងបំប្លែងឆ្លុះធៀបនឹងអ័ក្សនោះ រូបមន្តកូអរដោនេ និងឧទាហរណ៍',
        descriptionEn: 'Glide reflection as composition of translation along an axis and reflection across that axis, coordinate mapping, and applications.',
      },
    ],
    11: [
      {
        orderIndex: 1,
        titleKm: 'ស្វ៊ីតចំនួនពិត',
        titleEn: 'Sequences of Real Numbers',
        descriptionKm: 'និយមន័យស្វ៊ីត តួទូទៅ ស្វ៊ីតកើន ស្វ៊ីតចុះ ស្វ៊ីតទាល់ និងស្វ៊ីតម៉ូណូតូន',
        descriptionEn: 'Definition of sequences, general term, increasing, decreasing, bounded, and monotonic sequences.',
      },
      {
        orderIndex: 2,
        titleKm: 'ស្វ៊ីតនព្វន្ត',
        titleEn: 'Arithmetic Progressions',
        descriptionKm: 'និយមន័យ ផលសងរួម d រូបមន្តតួទី n u_n = u_1 + (n-1)d និងផលបូក n តួដំបូង S_n',
        descriptionEn: 'Definition, common difference d, nth term formula u_n = u_1 + (n-1)d, and sum of first n terms.',
      },
      {
        orderIndex: 3,
        titleKm: 'ស្វ៊ីតធរណីមាត្រ',
        titleEn: 'Geometric Progressions',
        descriptionKm: 'និយមន័យ ផលធៀបរួម q រូបមន្តតួទី n u_n = u_1 · q^(n-1) ផលបូក n តួ និងផលបូកស្វ៊ីតអនន្ត',
        descriptionEn: 'Definition, common ratio q, nth term u_n = u_1 · q^(n-1), sum of first n terms, and infinite geometric series.',
      },
      {
        orderIndex: 4,
        titleKm: 'ផលបូកតួនៃស្វ៊ីតផ្សេងៗ',
        titleEn: 'Sum of Terms of Various Sequences',
        descriptionKm: 'ផលបូកការេ ផលបូកគូប ផលបូកដោយប្រើផលដកតួជាប់គ្នា និងវិធីសាស្ត្រតេឡេស្កូពិក',
        descriptionEn: 'Sum of squares, sum of cubes, method of differences, and telescoping series techniques.',
      },
      {
        orderIndex: 5,
        titleKm: 'ទំនាក់ទំនងតួនៃស្វ៊ីត',
        titleEn: 'Recurrence Relations of Sequences',
        descriptionKm: 'ទំនាក់ទំនងតួស្វ៊ីតលីនេអ៊ែរ u_(n+1) = a u_n + b និងស្វ៊ីតជំនួយ',
        descriptionEn: 'Linear first-order recurrence relations u_(n+1) = a u_n + b and auxiliary sequence techniques.',
      },
      {
        orderIndex: 6,
        titleKm: 'វិចារអនុមានរួមគណិតវិទ្យា',
        titleEn: 'Mathematical Induction',
        descriptionKm: 'គោលការណ៍នៃវិចារអនុមានរួម ជំហានមូលដ្ឋាន ជំហានអនុមាន និងការស្រាយបញ្ជាក់សមភាព/វិសមភាព',
        descriptionEn: 'Principle of mathematical induction, base step, inductive step, and proving formulas and inequalities.',
      },
      {
        orderIndex: 7,
        titleKm: 'អនុគមន៍អិចស្ប៉ូណង់ស្យែល',
        titleEn: 'Exponential Functions',
        descriptionKm: 'និយមន័យ y = a^x (a > 0, a ≠ 1) ក្រាបអនុគមន៍ លក្ខណៈ និងការដោះស្រាយសមីការអិចស្ប៉ូណង់ស្យែល',
        descriptionEn: 'Definition of y = a^x (a > 0, a ≠ 1), graphing, properties, and solving exponential equations.',
      },
      {
        orderIndex: 8,
        titleKm: 'អនុគមន៍លោការីត',
        titleEn: 'Logarithmic Functions',
        descriptionKm: 'លោការីតគោល a លោការីតនេពែ (ln) លក្ខណៈលោការីត ក្រាប និងការដោះស្រាយសមីការលោការីត',
        descriptionEn: 'Logarithms base a, natural logarithm ln, logarithmic properties, graphs, and logarithmic equations.',
      },
      {
        orderIndex: 9,
        titleKm: 'អនុគមន៍ត្រីកោណមាត្រ',
        titleEn: 'Trigonometric Functions',
        descriptionKm: 'អនុគមន៍ y = sin x, y = cos x, y = tan x, y = cot x ដែនកំណត់ ខួប និងក្រាបរលក',
        descriptionEn: 'Trigonometric functions y = sin x, cos x, tan x, cot x, domains, periods, and wave graphs.',
      },
      {
        orderIndex: 10,
        titleKm: 'រូបមន្តត្រីកោណមាត្រ',
        titleEn: 'Trigonometric Formulas',
        descriptionKm: 'រូបមន្តផលបូក ផលដក រូបមន្តទ្វេមុំ បំប្លែងផលគុណជាផលបូក និងបំប្លែងផលបូកជាផលគុណ',
        descriptionEn: 'Sum and difference formulas, double angle, product-to-sum, and sum-to-product identities.',
      },
      {
        orderIndex: 11,
        titleKm: 'អនុគមន៍ច្រាសនៃអនុគមន៍ត្រីកោណមាត្រ',
        titleEn: 'Inverse Trigonometric Functions',
        descriptionKm: 'អនុគមន៍ arcsin x, arccos x, arctan x ដែនកំណត់ សំណុំរូបភាព និងក្រាប',
        descriptionEn: 'Inverse trigonometric functions arcsin x, arccos x, arctan x, domains, ranges, and graphs.',
      },
      {
        orderIndex: 12,
        titleKm: 'សមីការនិងវិសមីការត្រីកោណមាត្រ',
        titleEn: 'Trigonometric Equations and Inequalities',
        descriptionKm: 'សមីការគ្រឹះ sin x = a, cos x = a, tan x = a និងវិសមីការត្រីកោណមាត្រលើរង្វង់ត្រីកោណមាត្រ',
        descriptionEn: 'Basic trigonometric equations sin x = a, cos x = a, tan x = a, and unit-circle inequalities.',
      },
      {
        orderIndex: 13,
        titleKm: 'សមីការនិងវិសមីការត្រីកោណមាត្រផ្សេងទៀត',
        titleEn: 'Other Trigonometric Equations and Inequalities',
        descriptionKm: 'សមីការលីនេអ៊ែរ a sin x + b cos x = c សមីការអូម៉ូសែន និងសមីការដឺក្រេទី២ តាម sin និង cos',
        descriptionEn: 'Linear combinations a sin x + b cos x = c, homogeneous equations, and quadratic forms in sine and cosine.',
      },
      {
        orderIndex: 14,
        titleKm: 'ម៉ាទ្រីស',
        titleEn: 'Matrices',
        descriptionKm: 'និយមន័យម៉ាទ្រីស លំដាប់ ប្រមាណវិធីបូក ដក គុណនឹងស្កាលែ និងផលគុណពីរម៉ាទ្រីស',
        descriptionEn: 'Matrix definitions, dimensions, addition, subtraction, scalar multiplication, and matrix multiplication.',
      },
      {
        orderIndex: 15,
        titleKm: 'ដេទែរមីណង់',
        titleEn: 'Determinants',
        descriptionKm: 'ដេទែរមីណង់លំដាប់ ២ និងលំដាប់ ៣ ក្បួនសារុស (Sarrus) លក្ខណៈដេទែរមីណង់ និងម៉ាទ្រីសច្រាស A^(-1)',
        descriptionEn: 'Determinants of order 2 and 3, Sarrus rule, determinant properties, and inverse matrices A^(-1).',
      },
      {
        orderIndex: 16,
        titleKm: 'ការបំប្លែងលីនេអ៊ែរ',
        titleEn: 'Linear Transformations',
        descriptionKm: 'និយមន័យការបំប្លែងលីនេអ៊ែរ ម៉ាទ្រីសតំណាងការបំប្លែង ភាពឆ្លុះ ការបង្វិល និងការពង្រីក',
        descriptionEn: 'Linear transformations, transformation matrices, reflections, rotations, shears, and dilations.',
      },
      {
        orderIndex: 17,
        titleKm: 'លីមីតនិងដេរីវេ',
        titleEn: 'Limits and Derivatives',
        descriptionKm: 'និយមន័យដេរីវេជាលីមីតនៃផលធៀបកំណើន អត្ថន័យធរណីមាត្រ បន្ទាត់ប៉ះ និងរូបមន្តដេរីវេគ្រឹះ',
        descriptionEn: 'Definition of derivative as limit of difference quotient, geometric meaning, tangent lines, and basic rules.',
      },
      {
        orderIndex: 18,
        titleKm: 'អនុវត្តនៃដេរីវេ',
        titleEn: 'Applications of Derivatives',
        descriptionKm: 'ទិសដៅអថេរភាព តម្លៃបរមាធៀប (អតិបរមា អប្បបរមា) ល្បឿន និងបម្រែបម្រួលជាក់ស្តែង',
        descriptionEn: 'Monotonicity, relative extrema (maxima and minima), instantaneous velocity, and rate of change.',
      },
      {
        orderIndex: 19,
        titleKm: 'អថេរភាពនិងក្រាបនៃអនុគមន៍',
        titleEn: 'Function Variation and Graphs',
        descriptionKm: 'តារាងអថេរភាព ភាពប៉ោង ភាពផត ចំណុចរបត់ និងការសង់ក្រាបនៃអនុគមន៍ពហុធា និងសនិទាន',
        descriptionEn: 'Variation tables, concavity, points of inflection, and curve sketching for polynomial and rational functions.',
      },
      {
        orderIndex: 20,
        titleKm: 'អនុវត្តន៍ដេរីវេចំពោះសមីការនិងវិសមីការ',
        titleEn: 'Applications of Derivatives to Equations and Inequalities',
        descriptionKm: 'ការពិភាក្សាអំពីចំនួនឫសនៃសមីការតាមក្រាប និងការស្រាយបញ្ជាក់វិសមភាពដោយប្រើដេរីវេ',
        descriptionEn: 'Determining the number of roots graphically and proving mathematical inequalities using derivatives.',
      },
      {
        orderIndex: 21,
        titleKm: 'ចម្លាស់',
        titleEn: 'Permutations',
        descriptionKm: 'គោលការណ៍ផលបូក គោលការណ៍ផលគុណ ហ្វាក់តូរីយ៉ែល n! និងចម្លាស់ P(n, p)',
        descriptionEn: 'Addition and multiplication counting principles, factorials n!, and permutations P(n, p).',
      },
      {
        orderIndex: 22,
        titleKm: 'បន្សំ',
        titleEn: 'Combinations',
        descriptionKm: 'និយមន័យបន្សំ C(n, p) លក្ខណៈបន្សំ ត្រីកោណប៉ាស្កាល់ និងព្រលាតទ្វេធាញូតុន',
        descriptionEn: 'Combinations C(n, p), combinatorial properties, Pascal triangle, and binomial theorem expansions.',
      },
      {
        orderIndex: 23,
        titleKm: 'ប្រូបាប',
        titleEn: 'Probability',
        descriptionKm: 'លំហសំណាក ព្រឹត្តិការណ៍ រូបមន្តប្រូបាបបុរាណ ផលបូកប្រូបាប និងប្រូបាបនៃព្រឹត្តិការណ៍ឯករាជ្យ',
        descriptionEn: 'Sample spaces, events, classical probability, addition rule, and independent event probabilities.',
      },
      {
        orderIndex: 24,
        titleKm: 'រង្វាស់ទីតាំងនៃទិន្នន័យ',
        titleEn: 'Measures of Position of Data',
        descriptionKm: 'ក្វាទទីល ដេស៊ីល សង់ទីល សម្រាប់ទិន្នន័យទោល និងទិន្នន័យជាថ្នាក់ ព្រមទាំងការបកស្រាយ',
        descriptionEn: 'Quartiles, deciles, and percentiles for ungrouped and grouped continuous data distributions.',
      },
      {
        orderIndex: 25,
        titleKm: 'រង្វាស់នៃគម្លាត',
        titleEn: 'Measures of Dispersion',
        descriptionKm: 'ទំហំគម្លាត គម្លាតអន្តរក្វាទទីល វ៉ារ្យ៉ង់ (Variance) និងគម្លាតស្តង់ដា (Standard Deviation)',
        descriptionEn: 'Range, interquartile range (IQR), population and sample variance, and standard deviation.',
      },
      {
        orderIndex: 26,
        titleKm: 'រូបធរណីមាត្រក្នុងលំហ',
        titleEn: 'Solid Geometry (Geometry in Space)',
        descriptionKm: 'ស្វ័យសច្ចនៃធរណីមាត្រក្នុងលំហ ប្លង់កំណត់ដោយចំណុច ឬបន្ទាត់ និងទីតាំងធៀបនៃបន្ទាត់ពីរ',
        descriptionEn: 'Axioms of space geometry, planes determined by points or lines, and skew/coplanar line relationships.',
      },
      {
        orderIndex: 27,
        titleKm: 'បន្ទាត់និងប្លង់ស្របក្នុងលំហ',
        titleEn: 'Parallel Lines and Planes in Space',
        descriptionKm: 'បន្ទាត់ស្របនឹងប្លង់ ប្លង់ពីរស្របគ្នា លក្ខណៈ និងទ្រឹស្តីបទតាលែសក្នុងលំហ',
        descriptionEn: 'Line parallel to a plane, parallel planes, geometric properties, and spatial Thales theorem.',
      },
      {
        orderIndex: 28,
        titleKm: 'ភាពអរតូកូណាល់ក្នុងលំហ',
        titleEn: 'Orthogonality in Space',
        descriptionKm: 'បន្ទាត់ពីរកែងគ្នា បន្ទាត់កែងនឹងប្លង់ ប្លង់កែងគ្នា និងទ្រឹស្តីបទមេកែងបី',
        descriptionEn: 'Orthogonal lines, line perpendicular to a plane, perpendicular planes, and the three-perpendiculars theorem.',
      },
    ],
    12: [
      {
        orderIndex: 1,
        titleKm: 'ចំនួនកុំផ្លិចទម្រង់ពីជគណិត',
        titleEn: 'Complex Numbers in Algebraic Form',
        descriptionKm: 'ឯកតានិម្មិត i, ទម្រង់ពីជគណិត z = a + bi, ផ្នែកពិត ផ្នែកនិម្មិត ប្រមាណវិធីបូក ដក គុណ ចែក និងកុំផ្លិចឆ្លាស់',
        descriptionEn: 'Imaginary unit i, algebraic form z = a + bi, real and imaginary parts, arithmetic operations, and complex conjugates.',
      },
      {
        orderIndex: 2,
        titleKm: 'ចំនួនកុំផ្លិចទម្រង់ត្រីកោណមាត្រ',
        titleEn: 'Complex Numbers in Trigonometric Form',
        descriptionKm: 'ប្លង់កុំផ្លិច (Argand) ម៉ូឌុល |z| អាគុយម៉ង់ arg(z) ទម្រង់ត្រីកោណមាត្រ r(cosθ + i sinθ) និងផលគុណ ផលចែក',
        descriptionEn: 'Complex plane (Argand), modulus |z|, argument arg(z), trigonometric form r(cosθ + i sinθ), products, and quotients.',
      },
      {
        orderIndex: 3,
        titleKm: 'ស្វ័យគុណទី n និងឫសទី n នៃចំនួនកុំផ្លិច',
        titleEn: 'nth Powers and nth Roots of Complex Numbers',
        descriptionKm: 'រូបមន្តដឺម័រ (De Moivre) [r(cosθ + i sinθ)]^n ស្វ័យគុណទី n និងរូបមន្តគណនាឫសទី n នៃចំនួនកុំផ្លិច',
        descriptionEn: 'De Moivre\'s formula [r(cosθ + i sinθ)]^n, nth powers, and finding the nth roots of complex numbers.',
      },
      {
        orderIndex: 4,
        titleKm: 'លីមីតនៃអនុគមន៍',
        titleEn: 'Limits of Functions',
        descriptionKm: 'លីមីតត្រង់ចំនួនពិត លីមីតអនន្ត លីមីតខាងឆ្វេង-ខាងស្តាំ និងការដោះស្រាយរាងមិនកំណត់ 0/0, ∞/∞, 0·∞, ∞-∞',
        descriptionEn: 'Finite and infinite limits, one-sided limits, and resolving indeterminate forms 0/0, ∞/∞, 0·∞, ∞-∞.',
      },
      {
        orderIndex: 5,
        titleKm: 'ភាពជាប់នៃអនុគមន៍',
        titleEn: 'Continuity of Functions',
        descriptionKm: 'និយមន័យភាពជាប់ត្រង់ចំណុច ភាពជាប់លើចន្លោះ ចំណុចដាច់ និងទ្រឹស្តីបទតម្លៃកណ្តាល (IVT)',
        descriptionEn: 'Continuity at a point, continuity on intervals, discontinuities, and the Intermediate Value Theorem.',
      },
      {
        orderIndex: 6,
        titleKm: 'ដេរីវេនៃអនុគមន៍',
        titleEn: 'Derivatives of Functions',
        descriptionKm: 'និយមន័យដេរីវេ រូបមន្តដេរីវេនៃអនុគមន៍ពិជគណិត ត្រីកោណមាត្រ អិចស្ប៉ូណង់ស្យែល លោការីត និងដេរីវេបណ្តាក់',
        descriptionEn: 'Derivative definition, differentiation rules for algebraic, trigonometric, exponential, logarithmic, and composite functions.',
      },
      {
        orderIndex: 7,
        titleKm: 'អនុវត្តន៍នៃដេរីវេ',
        titleEn: 'Applications of Derivatives',
        descriptionKm: 'មេគុណប្រាប់ទិសបន្ទាត់ប៉ះ សមីការបន្ទាត់ប៉ះ ល្បឿននិងសំទុះខណៈ ទិសដៅអថេរភាព និងតម្លៃបរមាធៀប',
        descriptionEn: 'Tangent slopes, tangent line equations, instantaneous velocity/acceleration, monotonicity, and relative extrema.',
      },
      {
        orderIndex: 8,
        titleKm: 'អនុវត្តន៍ផ្សេងទៀតនៃដេរីវេ',
        titleEn: 'Other Applications of Derivatives',
        descriptionKm: 'ភាពប៉ោង ភាពផត ចំណុចរបត់ វិធាន L\'Hôpital ចំពោះលីមីត និងចំណោទអតិបរមា-អប្បបរមាជាក់ស្តែង',
        descriptionEn: 'Concavity, inflection points, L\'Hôpital\'s Rule for limits, and real-world optimization problems.',
      },
      {
        orderIndex: 9,
        titleKm: 'សិក្សាអថេរភាពនិងសង់ក្រាបនៃអនុគមន៍សនិទាន',
        titleEn: 'Variation and Graphs of Rational Functions',
        descriptionKm: 'ដែនកំណត់ អាស៊ីមតូតឈរ ដេក ទ្រេត ផ្ចិតឆ្លុះ តារាងអថេរភាព និងការសង់ក្រាបអនុគមន៍ប្រភាគសនិទាន',
        descriptionEn: 'Domain, vertical, horizontal, and oblique asymptotes, symmetry center, variation table, and rational curve sketching.',
      },
      {
        orderIndex: 10,
        titleKm: 'សិក្សាអថេរភាពនិងសង់ក្រាបនៃអនុគមន៍អិចស្ប៉ូណង់ស្យែល',
        titleEn: 'Variation and Graphs of Exponential Functions',
        descriptionKm: 'លីមីត អាស៊ីមតូត ដេរីវេ តារាងអថេរភាព និងការសង់ក្រាបអនុគមន៍អិចស្ប៉ូណង់ស្យែលដែលមាន e^x',
        descriptionEn: 'Limits, asymptotes, derivatives, variation tables, and curve sketching of exponential functions involving e^x.',
      },
      {
        orderIndex: 11,
        titleKm: 'សិក្សាអថេរភាពនិងសង់ក្រាបនៃអនុគមន៍លោការីត',
        titleEn: 'Variation and Graphs of Logarithmic Functions',
        descriptionKm: 'ដែនកំណត់ លីមីត អាស៊ីមតូតឈរ ដេរីវេ តារាងអថេរភាព និងការសង់ក្រាបអនុគមន៍លោការីតនេពែ ln(x)',
        descriptionEn: 'Domain, limits, vertical asymptote, derivatives, variation tables, and curve sketching of logarithmic functions ln(x).',
      },
      {
        orderIndex: 12,
        titleKm: 'វ៉ិចទ័រក្នុងលំហ',
        titleEn: 'Vectors in Space',
        descriptionKm: 'តម្រុយអរតូណរម៉ាល់ Oxyz កូអរដោនេវ៉ិចទ័រ កូអរដោនេចំណុច ចម្ងាយរវាងពីរចំណុច និងប្រមាណវិធីបូក គុណស្កាលែ',
        descriptionEn: '3D orthonormal frame Oxyz, vector coordinates, point coordinates, distance between points, and linear vector operations.',
      },
      {
        orderIndex: 13,
        titleKm: 'ផលគុណនៃពីរវ៉ិចទ័រក្នុងលំហ',
        titleEn: 'Product of Two Vectors in Space',
        descriptionKm: 'ផលគុណស្កាលែ u·v មុំរវាងពីរវ៉ិចទ័រ លក្ខខណ្ឌកែង និងផលគុណខ្វែង u × v (Vector/Cross product)',
        descriptionEn: 'Scalar dot product u·v, angle between 3D vectors, orthogonality condition, and vector cross product u × v.',
      },
      {
        orderIndex: 14,
        titleKm: 'អនុវត្តន៍នៃផលគុណវ៉ិចទ័រ',
        titleEn: 'Applications of Vector Products',
        descriptionKm: 'ក្រឡាផ្ទៃត្រីកោណនិងប្រលេឡូក្រាម មាឌប្រលេពីប៉ែត សមីការប្លង់ សមីការបន្ទាត់ និងចម្ងាយពីចំណុចទៅប្លង់',
        descriptionEn: 'Area of triangles and parallelograms, volume of parallelepipeds, plane equations, line equations, and point-to-plane distance.',
      },
      {
        orderIndex: 15,
        titleKm: 'ព្រីមីទីវនិងអាំងតេក្រាលមិនកំណត់',
        titleEn: 'Primitives and Indefinite Integrals',
        descriptionKm: 'និយមន័យព្រីមីទីវ តារាងព្រីមីទីវគ្រឹះ រូបមន្តអាំងតេក្រាលមិនកំណត់ និងវិធីប្តូរអថេរ',
        descriptionEn: 'Definition of primitives, table of standard antiderivatives, indefinite integral properties, and substitution method.',
      },
      {
        orderIndex: 16,
        titleKm: 'អាំងតេក្រាលកំណត់',
        titleEn: 'Definite Integrals',
        descriptionKm: 'និយមន័យអាំងតេក្រាលកំណត់ ទ្រឹស្តីបទគោលនៃកាល់គុល លក្ខណៈលីនេអ៊ែរ និងវិធីសាស្ត្រអាំងតេក្រាលដោយផ្នែក',
        descriptionEn: 'Definition of definite integrals, Fundamental Theorem of Calculus, linearity properties, and integration by parts.',
      },
      {
        orderIndex: 17,
        titleKm: 'ផ្ទៃក្រឡានៃផ្ទៃកម្រាល',
        titleEn: 'Area of Plane Regions',
        descriptionKm: 'ការគណនាផ្ទៃក្រឡាខណ្ឌដោយក្រាបអនុគមន៍និងអ័ក្សអាប់ស៊ីស និងផ្ទៃក្រឡាចន្លោះក្រាបពីរ f(x) និង g(x)',
        descriptionEn: 'Area between a curve and the x-axis, and area of regions enclosed between two curves f(x) and g(x).',
      },
      {
        orderIndex: 18,
        titleKm: 'មាឌសូលីតនិងប្រវែងធ្នូ',
        titleEn: 'Volume of Solids and Arc Length',
        descriptionKm: 'មាឌសូលីតបដិវត្តន៍បង្កើតដោយរង្វិលជុំវិញអ័ក្ស Ox (Disk/Washer method) និងរូបមន្តប្រវែងធ្នូននៃខ្សែកោង',
        descriptionEn: 'Volume of solids of revolution about the x-axis (disk and washer methods), and arc length of plane curves.',
      },
      {
        orderIndex: 19,
        titleKm: 'សមីការឌីផេរ៉ង់ស្យែលលីនេអ៊ែរលំដាប់ទី 1',
        titleEn: 'First-Order Linear Differential Equations',
        descriptionKm: 'ទម្រង់ y\' + ay = 0 និង y\' + ay = p(x) ដំណោះស្រាយទូទៅ និងដំណោះស្រាយផ្ទៀងផ្ទាត់លក្ខខណ្ឌដើម',
        descriptionEn: 'Forms y\' + ay = 0 and y\' + ay = p(x), general solutions, integrating factors, and initial value problems.',
      },
      {
        orderIndex: 20,
        titleKm: 'សមីការឌីផេរ៉ង់ស្យែលលីនេអ៊ែរលំដាប់ទី 2',
        titleEn: 'Second-Order Linear Differential Equations',
        descriptionKm: 'សមីការអូម៉ូសែន ay" + by\' + cy = 0 សមីការសំគាល់ (Δ > 0, Δ = 0, Δ < 0) និងសមីការមិនអូម៉ូសែន',
        descriptionEn: 'Homogeneous equation ay" + by\' + cy = 0, characteristic roots (real, repeated, complex), and non-homogeneous solutions.',
      },
      {
        orderIndex: 21,
        titleKm: 'ប្រូបាបមានលក្ខខណ្ឌ',
        titleEn: 'Conditional Probability',
        descriptionKm: 'និយមន័យ P(A|B) ដ្យាក្រាមដើមឈើ ផលគុណប្រូបាប ព្រឹត្តិការណ៍ឯករាជ្យ និងការអនុវត្តជាក់ស្តែង',
        descriptionEn: 'Conditional probability definition P(A|B), tree diagrams, multiplication rule, and independent events.',
      },
      {
        orderIndex: 22,
        titleKm: 'ទ្រឹស្តីបទប៊ែយេស',
        titleEn: 'Bayes\' Theorem',
        descriptionKm: 'រូបមន្តប្រូបាបសរុប (Total probability) រូបមន្តប៊ែយេស (Bayes\' formula) និងការធ្វើតេស្តវេជ្ជសាស្ត្រ/វិភាគទិន្នន័យ',
        descriptionEn: 'Law of total probability, Bayes\' theorem formulation, medical testing applications, and posterior probability updates.',
      },
      {
        orderIndex: 23,
        titleKm: 'ស្ថិតិមានពីរអថេរ',
        titleEn: 'Two-Variable Statistics',
        descriptionKm: 'ពពកចំណុច (Scatter plot) ចំណុចមធ្យម G(x̄, ȳ) ម៉ូម៉ង់ កូវ៉ារ្យ៉ង់ Cov(X, Y) និងមេគុណស្វ័យទំនាក់ទំនង r',
        descriptionEn: 'Scatter plots, mean point G(x̄, ȳ), covariance Cov(X, Y), and Pearson correlation coefficient r.',
      },
      {
        orderIndex: 24,
        titleKm: 'សមីការបន្ទាត់តម្រែតម្រង់លីនេអ៊ែរ',
        titleEn: 'Linear Regression Equations',
        descriptionKm: 'វិធីសាស្ត្រការេតូចបំផុត (Least squares) សមីការបន្ទាត់ y = ax + b ការទស្សន៍ទាយតម្លៃ និងគុណភាពតម្រែតម្រង់',
        descriptionEn: 'Least squares method, regression line equation y = ax + b, predictive forecasting, and goodness of fit.',
      },
      {
        orderIndex: 25,
        titleKm: 'ប៉ារ៉ាបូល',
        titleEn: 'Parabolas',
        descriptionKm: 'និយមន័យកោនិក កំពូល គំនុំ F បន្ទាត់ប្រាប់ទិស ប៉ារ៉ាបូលអ័ក្សឈរ និងប៉ារ៉ាបូលអ័ក្សដេក',
        descriptionEn: 'Conic definition, vertex, focus F, directrix, standard equations (x - h)² = 4p(y - k) and (y - k)² = 4p(x - h).',
      },
      {
        orderIndex: 26,
        titleKm: 'អេលីប',
        titleEn: 'Ellipses',
        descriptionKm: 'និយមន័យ ផ្ចិត កំពូល គំនុំទាំងពីរ អ័ក្សធំ អ័ក្សតូច អិចសង់ទ្រិស៊ីតេ e = c/a និងសមីការស្តង់ដារ',
        descriptionEn: 'Definition, center, vertices, foci, major/minor axes, eccentricity e = c/a, and standard equations.',
      },
      {
        orderIndex: 27,
        titleKm: 'អ៊ីពែបូល',
        titleEn: 'Hyperbolas',
        descriptionKm: 'និយមន័យ ផ្ចិត កំពូល គំនុំទាំងពីរ អាស៊ីមតូត y = ±(b/a)x អិចសង់ទ្រិស៊ីតេ e > 1 និងសមីការស្តង់ដារ',
        descriptionEn: 'Definition, center, vertices, foci, asymptotes y = ±(b/a)x, eccentricity e > 1, and standard hyperbola equations.',
      },
    ],
  },
  physics: {
    7: [
      {
        orderIndex: 1,
        titleKm: 'រង្វាស់រង្វាល់ និងខ្នាត SI',
        titleEn: 'Measurements & SI Units',
        descriptionKm: 'ខ្នាតប្រវែង ម៉ាស ពេលវេលា និងឧបករណ៍វាស់វែង',
        descriptionEn: 'Length, mass, and time measurements using the SI metric system.',
      },
      {
        orderIndex: 2,
        titleKm: 'ចលនា និងល្បឿន',
        titleEn: 'Motion & Speed',
        descriptionKm: 'និយមន័យល្បឿនមធ្យម v = d / t និងគន្លងចលនា',
        descriptionEn: 'Average speed definition, motion trajectories, and uniform motion.',
      },
      {
        orderIndex: 3,
        titleKm: 'កម្លាំង និងម៉ាស-ទម្ងន់',
        titleEn: 'Forces, Mass & Weight',
        descriptionKm: 'ទំនាក់ទំនងទម្ងន់ w = m * g និងផលប៉ះពាល់នៃកម្លាំង',
        descriptionEn: 'Gravity, mass vs weight relationship w = m * g, and force effects.',
      },
      {
        orderIndex: 4,
        titleKm: 'សម្ពាធអង្គធាតុរាវ និងឧស្ម័ន',
        titleEn: 'Fluid & Atmospheric Pressure',
        descriptionKm: 'សម្ពាធ P = F / A និងច្បាប់ប៉ាស្កាល់',
        descriptionEn: 'Pressure formula P = F / A, fluid hydrostatics, and Pascal principle.',
      },
      {
        orderIndex: 5,
        titleKm: 'កម្តៅ និងសីតុណ្ហភាព',
        titleEn: 'Heat & Temperature',
        descriptionKm: 'មាត្រដ្ឋានសីតុណ្ហភាពអង្សាសេ កែលវីន និងការផ្ទេរកម្តៅ',
        descriptionEn: 'Celsius and Kelvin scales, conduction, convection, and radiation.',
      },
    ],
    8: [
      {
        orderIndex: 1,
        titleKm: 'ការងារ និងអនុភាពមេកានិច',
        titleEn: 'Mechanical Work & Power',
        descriptionKm: 'រូបមន្តការងារ W = F * d និងអនុភាព P = W / t',
        descriptionEn: 'Mechanical work W = F * d and power output P = W / t in Watts.',
      },
      {
        orderIndex: 2,
        titleKm: 'ថាមពលស៊ីនេទិច និងប៉ូតង់ស្យែល',
        titleEn: 'Kinetic & Potential Energy',
        descriptionKm: 'ថាមពលចលករ Ek = (1/2)mv^2 និងថាមពលទំនាញ Ep = mgh',
        descriptionEn: 'Kinetic energy Ek = (1/2)mv^2 and gravitational potential energy Ep = mgh.',
      },
      {
        orderIndex: 3,
        titleKm: 'អុបទិក៖ ចំណាំងផ្លាត និងកញ្ចក់ប្លង់',
        titleEn: 'Reflection & Plane Mirrors',
        descriptionKm: 'ច្បាប់ចំណាំងផ្លាតនៃពន្លឺ និងលក្ខណៈរូបភាពក្នុងកញ្ចក់ប្លង់',
        descriptionEn: 'Law of reflection and virtual image characteristics in plane mirrors.',
      },
      {
        orderIndex: 4,
        titleKm: 'បន្ទុក និងចរន្តអគ្គិសនីបឋម',
        titleEn: 'Electric Charge & Current',
        descriptionKm: 'បន្ទុកវិជ្ជមាន អវិជ្ជមាន និងចរន្តអគ្គិសនីក្នុងសៀគ្វីបិទ',
        descriptionEn: 'Positive/negative electric charges, voltage, and current flow in closed circuits.',
      },
    ],
    9: [
      {
        orderIndex: 1,
        titleKm: 'ច្បាប់ចលនាញូតុន',
        titleEn: "Newton's Laws of Motion",
        descriptionKm: 'ច្បាប់និចលភាព ច្បាប់មូលដ្ឋានឌីណាមិច F = m * a និងអំពើ-ប្រតិកម្ម',
        descriptionEn: "Newton's three laws of motion and the fundamental relation F = m * a.",
      },
      {
        orderIndex: 2,
        titleKm: 'ច្បាប់អូម និងការតរេស៊ីស្តង់',
        titleEn: "Ohm's Law & Resistor Circuits",
        descriptionKm: 'រូបមន្ត U = R * I ការតរេស៊ីស្តង់ជាស៊េរី និងជាខ្នែង',
        descriptionEn: "Ohm's law U = R * I and equivalent resistance in series and parallel.",
      },
      {
        orderIndex: 3,
        titleKm: 'អនុភាព និងថាមពលអគ្គិសនី',
        titleEn: 'Electrical Power & Energy',
        descriptionKm: 'រូបមន្ត P = U * I និងថាមពលអគ្គិសនី W = P * t (គីឡូវ៉ាត់ម៉ោង)',
        descriptionEn: 'Power calculation P = U * I and Joule energy heating dissipation.',
      },
      {
        orderIndex: 4,
        titleKm: 'មេដែក និងអេឡិចត្រូមេដែក',
        titleEn: 'Magnetism & Electromagnetism',
        descriptionKm: 'ប៉ូលមេដែក ដែនម៉ាញ៉េទិច និងបូប៊ីនបង្កើតអេឡិចត្រូមេដែក',
        descriptionEn: 'Magnetic poles, magnetic field lines, and solenoids with iron cores.',
      },
      {
        orderIndex: 5,
        titleKm: 'ចំណាំងបែរពន្លឺ និងឡង់ទី',
        titleEn: 'Refraction & Lenses',
        descriptionKm: 'ច្បាប់ស្នែល-ដេកាត និងរូបភាពបង្កើតដោយឡង់ទីពង្រីក-បង្រួម',
        descriptionEn: "Snell's law of refraction and converging/diverging lens image formation.",
      },
    ],
    10: [
      {
        orderIndex: 1,
        titleKm: 'ចលនាត្រង់ប្រែប្រួលស្មើ',
        titleEn: 'Uniformly Accelerated Rectilinear Motion',
        descriptionKm: 'សមីការល្បឿន v = v0 + at និងសមីការចម្ងាយ x = x0 + v0*t + 1/2*a*t^2',
        descriptionEn: 'Kinematic equations for constant linear acceleration in kinematics.',
      },
      {
        orderIndex: 2,
        titleKm: 'ចលនាគប់ក្នុងពីរវិមាត្រ',
        titleEn: 'Projectile Motion',
        descriptionKm: 'គន្លងប៉ារ៉ាបូល កម្ពស់អតិបរមា និងរយៈចម្ងាយគប់',
        descriptionEn: '2D ballistic trajectories, maximum flight altitude, and horizontal range.',
      },
      {
        orderIndex: 3,
        titleKm: 'កម្លាំងកកិត និងឌីណាមិច',
        titleEn: 'Friction & Dynamics',
        descriptionKm: 'កកិតស៊ីនេទិច កកិតស្តាទិច និងការវិភាគកម្លាំងលើប្លង់ទ្រេត',
        descriptionEn: 'Static and kinetic friction coefficients on inclined planes.',
      },
      {
        orderIndex: 4,
        titleKm: 'បរិមាណចលនា និងការប៉ះទង្គិច',
        titleEn: 'Momentum & Collisions',
        descriptionKm: 'ច្បាប់រក្សាបរិមាណចលនា p = m * v និងការប៉ះទង្គិចយឺត',
        descriptionEn: 'Linear momentum conservation and elastic/inelastic collisions.',
      },
      {
        orderIndex: 5,
        titleKm: 'ច្បាប់រក្សាថាមពលមេកានិច',
        titleEn: 'Conservation of Mechanical Energy',
        descriptionKm: 'ផលបូកថាមពល Em = Ek + Ep = ថេរ ក្នុងដែនទំនាញ',
        descriptionEn: 'Mechanical energy conservation Em = Ek + Ep in conservative force fields.',
      },
      {
        orderIndex: 6,
        titleKm: 'ទ្រឹស្តីស៊ីនេទិចនៃឧស្ម័ន',
        titleEn: 'Kinetic Theory of Gases',
        descriptionKm: 'សមីការសភាពឧស្ម័នបរិសុទ្ធ P*V = n*R*T និងថាមពលស៊ីនេទិចម៉ូលេគុល',
        descriptionEn: 'Ideal gas law P*V = n*R*T and average molecular kinetic energy.',
      },
    ],
    11: [
      {
        orderIndex: 1,
        titleKm: 'ច្បាប់ទំនាញសកល',
        titleEn: 'Universal Gravitation',
        descriptionKm: 'កម្លាំងទាក់ទាញញូតុន F = G*(m1*m2)/r^2 និងចលនាផ្កាយរណប',
        descriptionEn: "Newton's universal law of gravitation and satellite orbital velocity.",
      },
      {
        orderIndex: 2,
        titleKm: 'ចលនារង្វិល និងលំនឹងអង្គធាតុរឹង',
        titleEn: 'Rotational Motion & Equilibrium',
        descriptionKm: 'ម៉ូម៉ង់នៃកម្លាំង ម៉ូម៉ង់និចលភាព និងលក្ខខណ្ឌលំនឹង',
        descriptionEn: 'Torque, moments of inertia, and rotational equilibrium conditions.',
      },
      {
        orderIndex: 3,
        titleKm: 'ដែនអគ្គិសនី និងច្បាប់គូឡុង',
        titleEn: 'Electric Fields & Coulomb’s Law',
        descriptionKm: 'កម្លាំងអន្តរកម្មរវាងបន្ទុក F = k*|q1*q2|/r^2 និងវ៉ិចទ័រដែនអគ្គិសនី E',
        descriptionEn: "Coulomb's electrostatic force and electric field intensity vectors.",
      },
      {
        orderIndex: 4,
        titleKm: 'ចរន្តអគ្គិសនីជាប់ និងច្បាប់គីរឆុហ្វ',
        titleEn: 'DC Circuits & Kirchhoff’s Laws',
        descriptionKm: 'ច្បាប់ថ្នាំង ច្បាប់កង់ និងការដោះស្រាយសៀគ្វីស្មុគស្មាញ',
        descriptionEn: "Kirchhoff's current and voltage laws in complex DC networks.",
      },
      {
        orderIndex: 5,
        titleKm: 'ដែនម៉ាញ៉េទិច និងកម្លាំងឡូរ៉ង់-ឡាផ្លាស',
        titleEn: 'Magnetic Fields & Lorentz/Laplace Forces',
        descriptionKm: 'កម្លាំងឡូរ៉ង់លើបន្ទុកផ្លាស់ទី F = q*v*B*sin(theta) និងកម្លាំងឡាផ្លាស',
        descriptionEn: 'Lorentz force on moving charges and Laplace electromagnetic force on conductors.',
      },
    ],
    12: [
      {
        orderIndex: 1,
        titleKm: 'លំយោលមេកានិច និងប៉ោល',
        titleEn: 'Mechanical Oscillations & Pendulums',
        descriptionKm: 'សមីការឌីផេរ៉ង់ស្យែលនៃលំយោល ប៉ោលទម្ងន់ និងប៉ោលរ៉ឺស័រ',
        descriptionEn: 'Simple harmonic motion equations, period of spring and simple pendulums.',
      },
      {
        orderIndex: 2,
        titleKm: 'រលកមេកានិច និងរលកសំឡេង',
        titleEn: 'Mechanical & Sound Waves',
        descriptionKm: 'ប្រវែងរលក ល្បឿនរលក v = lambda * f និងអាំងតង់ស៊ីតេសំឡេង',
        descriptionEn: 'Wave velocity, frequency relations, interference, and decibel sound level.',
      },
      {
        orderIndex: 3,
        titleKm: 'អាំងឌុចស្យុងអេឡិចត្រូម៉ាញ៉េទិច',
        titleEn: 'Electromagnetic Induction',
        descriptionKm: 'ច្បាប់ហ្វារ៉ាដេ និងច្បាប់ឡិនស៍ កម្លាំងអគ្គិសនីចលករអាំងឌ្វី e = -dPhi/dt',
        descriptionEn: "Faraday's law of induction and Lenz rule for induced electromotive force.",
      },
      {
        orderIndex: 4,
        titleKm: 'ចរន្តឆ្លាស់ និងសៀគ្វី RLC',
        titleEn: 'AC Circuits & RLC',
        descriptionKm: 'ភាពរារាំងសរុប (Impedance Z) បាតុភូតរេសូណង់ និងមេគុណអានុភាព',
        descriptionEn: 'Impedance calculations, resonance condition, and power factor in RLC circuits.',
      },
      {
        orderIndex: 5,
        titleKm: 'រូបវិទ្យាអាតូម និងនុយក្លេអ៊ែរ',
        titleEn: 'Atomic & Nuclear Physics',
        descriptionKm: 'បាតុភូតហ្វូតូអគ្គិសនី ថាមពលភ្ជាប់នុយក្លេអ៊ែរ និងវិទ្យុសកម្មបំបែក',
        descriptionEn: 'Photoelectric effect, Einstein equation E = mc^2, half-life, and nuclear decay.',
      },
    ],
  },
  chemistry: {
    7: [
      {
        orderIndex: 1,
        titleKm: 'រូបធាតុ និងល្បាយ',
        titleEn: 'Matter & Mixtures',
        descriptionKm: 'សារធាតុបរិសុទ្ធ ល្បាយស្មើសាច់ និងល្បាយមិនស្មើសាច់',
        descriptionEn: 'Pure substances, homogeneous mixtures, and heterogeneous mixtures.',
      },
      {
        orderIndex: 2,
        titleKm: 'ស្ថានភាពរូបធាតុ',
        titleEn: 'States of Matter',
        descriptionKm: 'ភាពរឹង រាវ និងឧស្ម័ន បម្រែបម្រួលសភាពនៃរូបធាតុ',
        descriptionEn: 'Solid, liquid, gas phases and phase transition phenomena.',
      },
      {
        orderIndex: 3,
        titleKm: 'អាតូម ម៉ូលេគុល និងធាតុគីមី',
        titleEn: 'Atoms, Molecules & Elements',
        descriptionKm: 'និមិត្តសញ្ញាគីមីនៃធាតុទូទៅ និងរចនាសម្ព័ន្ធម៉ូលេគុលសាមញ្ញ',
        descriptionEn: 'Chemical symbols of common elements and basic molecular formulas.',
      },
      {
        orderIndex: 4,
        titleKm: 'បម្រែបម្រួលរូប និងគីមី',
        titleEn: 'Physical & Chemical Changes',
        descriptionKm: 'ភាពខុសគ្នារវាងបម្រែបម្រួលរូប និងបម្រែបម្រួលគីមី',
        descriptionEn: 'Distinguishing physical state changes from irreversible chemical reactions.',
      },
      {
        orderIndex: 5,
        titleKm: 'ខ្យល់ អុកស៊ីសែន និងទឹក',
        titleEn: 'Air, Oxygen & Water',
        descriptionKm: 'សមាសភាពខ្យល់ លក្ខណៈអុកស៊ីសែន និងសារៈសំខាន់នៃទឹកបរិសុទ្ធ',
        descriptionEn: 'Composition of atmosphere, oxygen properties, and water purification.',
      },
    ],
    8: [
      {
        orderIndex: 1,
        titleKm: 'រចនាសម្ព័ន្ធអាតូម និងតារាងខួប',
        titleEn: 'Atomic Structure & Periodic Table',
        descriptionKm: 'ប្រូតុង ណឺត្រុង អេឡិចត្រុង និងការរៀបចំក្នុងតារាងខួបគីមី',
        descriptionEn: 'Subatomic particles (p, n, e) and periodic table period/group organization.',
      },
      {
        orderIndex: 2,
        titleKm: 'វ៉ាឡង់ និងរូបមន្តគីមី',
        titleEn: 'Valency & Chemical Formulas',
        descriptionKm: 'ក្បួនវ៉ាឡង់ និងការសរសេររូបមន្តគីមីនៃសមាសធាតុទ្វេធាតុ',
        descriptionEn: 'Valency rules and writing correct binary compound formulas.',
      },
      {
        orderIndex: 3,
        titleKm: 'សមីការគីមី និងច្បាប់រក្សាម៉ាស',
        titleEn: 'Chemical Equations & Conservation of Mass',
        descriptionKm: 'ច្បាប់ឡាវ៉ូស៊ីយេ និងវិធីថ្លឹងសមីការគីមី',
        descriptionEn: "Lavoisier's conservation of mass and balancing stoichiometric equations.",
      },
      {
        orderIndex: 4,
        titleKm: 'អុកស៊ីត អាស៊ីត បាស និងអំបិល',
        titleEn: 'Oxides, Acids, Bases & Salts',
        descriptionKm: 'ចំណាត់ថ្នាក់សមាសធាតុអសរីរាង្គទាំងបួនប្រភេទ',
        descriptionEn: 'Classifying and naming the four major inorganic compound families.',
      },
      {
        orderIndex: 5,
        titleKm: 'អ៊ីដ្រូសែន',
        titleEn: 'Hydrogen',
        descriptionKm: 'ការផលិតឧស្ម័នអ៊ីដ្រូសែនក្នុងបន្ទប់ពិសោធ និងលក្ខណៈរេដុកម្ម',
        descriptionEn: 'Laboratory preparation of hydrogen gas and its reducing properties.',
      },
    ],
    9: [
      {
        orderIndex: 1,
        titleKm: 'គណនាតាមសមីការគីមី និងម៉ូល',
        titleEn: 'Mole Concept & Stoichiometry',
        descriptionKm: 'ចំនួនអាវ៉ូកាដ្រូ ចំនួនម៉ូល n = m / M និងការគណនាម៉ាសអង្គធាតុកកើត',
        descriptionEn: 'Avogadro number, molar mass n = m / M, and quantitative stoichiometry.',
      },
      {
        orderIndex: 2,
        titleKm: 'កំហាប់សូលុយស្យុង',
        titleEn: 'Solution Concentration',
        descriptionKm: 'កំហាប់ជាភាគរយ C% និងកំហាប់ជាម៉ូល C = n / V',
        descriptionEn: 'Molarity (mol/L) and mass percentage concentration in aqueous solutions.',
      },
      {
        orderIndex: 3,
        titleKm: 'លោហៈ និងស៊េរីសកម្មភាពគីមី',
        titleEn: 'Metals & Reactivity Series',
        descriptionKm: 'លក្ខណៈគីមីនៃលោហៈ សកម្មភាពជាមួយទឹក អាស៊ីត និងអុកស៊ីសែន',
        descriptionEn: 'Metal reactivity series and reactions with water, acids, and oxygen.',
      },
      {
        orderIndex: 4,
        titleKm: 'អលោហៈ៖ ក្លរ ស្ពាន់ធ័រ អាសូត',
        titleEn: 'Non-metals: Cl, S, N',
        descriptionKm: 'លក្ខណៈរូប និងគីមីនៃឧស្ម័នក្លរ ស្ពាន់ធ័រ និងសមាសធាតុអាសូត',
        descriptionEn: 'Properties and commercial importance of chlorine, sulfur, and nitrogen.',
      },
      {
        orderIndex: 5,
        titleKm: 'គីមីសរីរាង្គបឋម៖ អ៊ីដ្រូកាបួ',
        titleEn: 'Introductory Organic Hydrocarbons',
        descriptionKm: 'មេតាន (CH4) អេទីឡែន (C2H4) និងអាសេទីឡែន (C2H2)',
        descriptionEn: 'Methane, ethylene, and acetylene molecular structures and combustions.',
      },
    ],
    10: [
      {
        orderIndex: 1,
        titleKm: 'ទម្រង់អេឡិចត្រុងនៃអាតូម',
        titleEn: 'Electron Configuration',
        descriptionKm: 'ស្រទាប់អេឡិចត្រុង s, p, d, f និងគោលការណ៍ក្លេឆកូវស្គី',
        descriptionEn: 'Orbital energy levels, Pauli exclusion principle, and Aufbau electron filling.',
      },
      {
        orderIndex: 2,
        titleKm: 'ចំណងគីមី៖ អ៊ីយ៉ុង កូវ៉ាឡង់ លោហៈ',
        titleEn: 'Chemical Bonding',
        descriptionKm: 'ការផ្ទេរ និងការចែករំលែកអេឡិចត្រុង ច្បាប់អoctet',
        descriptionEn: 'Ionic, covalent polar/nonpolar, and metallic bonding principles.',
      },
      {
        orderIndex: 3,
        titleKm: 'ច្បាប់ឧស្ម័នបរិសុទ្ធ',
        titleEn: 'Ideal Gas Law',
        descriptionKm: 'សមីការ PV = nRT មាឌម៉ូលឧស្ម័ន Vm = 22.4 L/mol នៅល.ខ.ធ',
        descriptionEn: 'Gas stoichiometry under standard temperature and pressure (STP).',
      },
      {
        orderIndex: 4,
        titleKm: 'ប្រតិកម្មអុកស៊ីដូរេដុកម្ម',
        titleEn: 'Redox Reactions',
        descriptionKm: 'ការកំណត់ចំនួនអុកស៊ីតកម្ម និងការថ្លឹងសមីការតាមវិធីអេឡិចត្រុង',
        descriptionEn: 'Oxidation numbers, oxidizing/reducing agents, and ion-electron balancing.',
      },
      {
        orderIndex: 5,
        titleKm: 'អត្រាកម្មអាស៊ីត-បាស',
        titleEn: 'Acid-Base Titration',
        descriptionKm: 'ចំណុចសមមូល ឧបករណ៍ប៊ុយរែត និងការគណនាកំហាប់ Ca*Va = Cb*Vb',
        descriptionEn: 'Equivalence point calculation and indicators in volumetric titration.',
      },
    ],
    11: [
      {
        orderIndex: 1,
        titleKm: 'ស៊ីនេទិចគីមី',
        titleEn: 'Chemical Kinetics',
        descriptionKm: 'កត្តាជះឥទ្ធិពលលើល្បឿនប្រតិកម្ម៖ សីតុណ្ហភាព កំហាប់ និងកាតាលីករ',
        descriptionEn: 'Reaction rates, collision theory, activation energy, and catalysts.',
      },
      {
        orderIndex: 2,
        titleKm: 'លំនឹងគីមី និងគោលការណ៍ឡឺឆាតឺលីយេ',
        titleEn: 'Chemical Equilibrium',
        descriptionKm: 'ថេរលំនឹង Kc, Kp និងការប្តូរទិសដៅលំនឹងគីមី',
        descriptionEn: "Le Chatelier's principle and equilibrium constant calculations.",
      },
      {
        orderIndex: 3,
        titleKm: 'កម្រិតអ៊ីយ៉ុងកម្ម និង pH នៃសូលុយស្យុង',
        titleEn: 'pH & Ionization in Aqueous Solutions',
        descriptionKm: 'រូបមន្ត pH = -log[H3O+] និងផលគុណអ៊ីយ៉ុងនៃទឹក Ke',
        descriptionEn: 'Autoprotolysis of water, pH calculation for strong and weak acids/bases.',
      },
      {
        orderIndex: 4,
        titleKm: 'អាល់កាន អាល់សែន អាល់ស៊ីន និងអ៊ីដ្រូកាបួប្រហើរ',
        titleEn: 'Alkanes, Alkenes, Alkynes & Aromatics',
        descriptionKm: 'ឈ្មោះតាម IUPAC ប្រតិកម្មជំនួស ប្រតិកម្មបូក និងទម្រង់បង់សែន',
        descriptionEn: 'Nomenclature, addition/substitution reactions, and aromatic structures.',
      },
    ],
    12: [
      {
        orderIndex: 1,
        titleKm: 'ល្បឿនប្រតិកម្មគីមី',
        titleEn: 'Reaction Rates',
        descriptionKm: 'ល្បឿនមធ្យម និងល្បឿនខណៈនៃការបាត់បង់អង្គធាតុប្រតិករ ឬកកើតផល',
        descriptionEn: 'Instantaneous and average reaction rate formulas for BacII chemistry.',
      },
      {
        orderIndex: 2,
        titleKm: 'ទ្រឹស្តីអាស៊ីត-បាសប្រុងស្តែត និងសូលុយស្យុងទ្រនាប់',
        titleEn: 'Bronsted-Lowry Acids/Bases & Buffers',
        descriptionKm: 'គូអាស៊ីត-បាសជាប់គ្នា ថេរអាស៊ីត Ka, pKa និងសូលុយស្យុងទ្រនាប់',
        descriptionEn: 'Conjugate acid-base pairs, Henderson-Hasselbalch equation, and buffer systems.',
      },
      {
        orderIndex: 3,
        titleKm: 'អាល់កុល អេទែ អាល់ដេអ៊ីត និងសេតូន',
        titleEn: 'Alcohols, Ethers, Aldehydes & Ketones',
        descriptionKm: 'ក្រុមនាទីអ៊ីដ្រុកស៊ីល និងកាបូនីល ប្រតិកម្មអុកស៊ីតកម្មកម្រិតស្រាល',
        descriptionEn: 'Hydroxyl and carbonyl functional groups, Tollens and Fehling tests.',
      },
      {
        orderIndex: 4,
        titleKm: 'អាស៊ីតកាបុកស៊ីលិច និងអេស្ទែ',
        titleEn: 'Carboxylic Acids & Esters',
        descriptionKm: 'ប្រតិកម្មអេស្ទែរកម្ម និងសាប៊ូកម្ម ក្លិនក្រអូបផ្លែឈើនៃអេស្ទែ',
        descriptionEn: 'Esterification equilibrium, saponification mechanism, and organic synthesis.',
      },
      {
        orderIndex: 5,
        titleKm: 'អាមីន អាស៊ីតអាមីណេ ប្រូតេអ៊ីន និងគ្លុយស៊ីត',
        titleEn: 'Amines, Amino Acids, Proteins & Carbohydrates',
        descriptionKm: 'ចំណងប៉ិបទីត រចនាសម្ព័ន្ធគ្លុយកូស ស៊ុយក្រូស និងសារៈសំខាន់ជីវគីមី',
        descriptionEn: 'Peptide bonds, amino acid zwitterions, and monosaccharide biochemistry.',
      },
    ],
  },
  biology: {
    7: [
      {
        orderIndex: 1,
        titleKm: 'ចំណាត់ថ្នាក់ភាវៈរស់',
        titleEn: 'Classification of Living Things',
        descriptionKm: 'រាជាណាចក្រទាំង៥ នៃភាវៈរស់ និងលក្ខណៈវិនិច្ឆ័យចែកថ្នាក់',
        descriptionEn: 'The 5 kingdoms of life and Linnaean taxonomic classification.',
      },
      {
        orderIndex: 2,
        titleKm: 'កោសិការុក្ខជាតិ និងសត្វ',
        titleEn: 'Plant & Animal Cells',
        descriptionKm: 'ភ្នាសកោសិកា ស៊ីតូប្លាស ណ្វៃយ៉ូ និងភាពខុសគ្នារវាងកោសិកាទាំងពីរ',
        descriptionEn: 'Organelle structure, cell wall, chloroplasts, and vacuoles comparison.',
      },
      {
        orderIndex: 3,
        titleKm: 'សរីរាង្គរុក្ខជាតិ និងរស្មីសំយោគ',
        titleEn: 'Plant Organs & Photosynthesis',
        descriptionKm: 'មុខងារឫស ដើម ស្លឹក និងសមីការរស្មីសំយោគបង្កើតគ្លុយកូស',
        descriptionEn: 'Plant vegetative organs and photosynthesis chemical balance.',
      },
      {
        orderIndex: 4,
        titleKm: 'ការបន្តពូជរុក្ខជាតិមានផ្កា',
        titleEn: 'Reproduction in Flowering Plants',
        descriptionKm: 'លម្អងផ្កា ការបង្កាត់ ការបង្កកំណើត និងការលូតលាស់នៃគ្រាប់ពូជ',
        descriptionEn: 'Floral anatomy, pollination mechanisms, and seed dispersal.',
      },
      {
        orderIndex: 5,
        titleKm: 'អតិសុខុមប្រាណ',
        titleEn: 'Microorganisms',
        descriptionKm: 'បាក់តេរី វីរុស ផ្សិត និងតួនាទីមានប្រយោជន៍ និងបង្កជំងឺ',
        descriptionEn: 'Bacteria, viruses, fungi, and beneficial vs pathogenic impacts.',
      },
    ],
    8: [
      {
        orderIndex: 1,
        titleKm: 'ប្រព័ន្ធរំលាយអាហារ និងអាហារូបត្ថម្ភ',
        titleEn: 'Digestive System & Nutrition',
        descriptionKm: 'សរីរាង្គរំលាយអាហារ អង់ស៊ីមរំលាយ និងការស្រូបសារធាតុចិញ្ចឹម',
        descriptionEn: 'Gastrointestinal tract, digestive enzymes, and nutrient absorption.',
      },
      {
        orderIndex: 2,
        titleKm: 'ប្រព័ន្ធដង្ហើម',
        titleEn: 'Respiratory System',
        descriptionKm: 'សួត ទងសួត ថង់ខ្យល់ និងការដោះដូរឧស្ម័ន O2 និង CO2',
        descriptionEn: 'Pulmonary ventilation, alveoli, and cellular gas exchange mechanisms.',
      },
      {
        orderIndex: 3,
        titleKm: 'ប្រព័ន្ធរបត់ឈាម',
        titleEn: 'Circulatory System',
        descriptionKm: 'បេះដូង សរសៃឈាម គ្រាប់ឈាមក្រហម/ស និងក្រុមឈាម ABO',
        descriptionEn: 'Cardiac anatomy, systemic/pulmonary circulation, and blood groups.',
      },
      {
        orderIndex: 4,
        titleKm: 'ប្រព័ន្ធបញ្ចេញចោល',
        titleEn: 'Excretory System',
        descriptionKm: 'តម្រងនោម ណេហ្វ្រុង និងដំណើរការចម្រោះទឹកនោម',
        descriptionEn: 'Kidneys, nephron filtration, reabsorption, and homeostasis.',
      },
      {
        orderIndex: 5,
        titleKm: 'ប្រព័ន្ធអេកូឡូស៊ីបឋម',
        titleEn: 'Basic Ecosystems',
        descriptionKm: 'កត្តាជីវៈ កត្តាអជីវៈ និងទំនាក់ទំនងភាវៈរស់ក្នុងធម្មជាតិ',
        descriptionEn: 'Biotic and abiotic factors and symbiotic interactions in habitats.',
      },
    ],
    9: [
      {
        orderIndex: 1,
        titleKm: 'ប្រព័ន្ធប្រសាទ និងសរីរាង្គវិញ្ញាណ',
        titleEn: 'Nervous System & Sense Organs',
        descriptionKm: 'ខួរក្បាល ខួរឆ្អឹងខ្នង ណឺរ៉ុន និងសរីរាង្គវិញ្ញាណទាំង៥',
        descriptionEn: 'Central and peripheral nervous systems, reflex arcs, and sensory organs.',
      },
      {
        orderIndex: 2,
        titleKm: 'ប្រព័ន្ធអង់ដូគ្រីន និងអរម៉ូន',
        titleEn: 'Endocrine System & Hormones',
        descriptionKm: 'ក្រពេញអ៊ីប៉ូភីស ទីរ៉ូអ៊ីត លំពែង និងការគ្រប់គ្រងជាតិស្ករ',
        descriptionEn: 'Endocrine glands, hormonal regulation, insulin, and glucagon.',
      },
      {
        orderIndex: 3,
        titleKm: 'ប្រព័ន្ធបន្តពូជមនុស្ស',
        titleEn: 'Human Reproductive System',
        descriptionKm: 'សរីរាង្គបន្តពូជបុរស និងស្ត្រី វដ្តរដូវ និងការបង្កកំណើត',
        descriptionEn: 'Male and female reproductive systems, ovarian cycle, and fertilization.',
      },
      {
        orderIndex: 4,
        titleKm: 'ក្រូម៉ូសូម និងតំណពូជម៉ង់ដែល់បឋម',
        titleEn: 'Chromosomes & Intro to Mendelian Genetics',
        descriptionKm: 'ហ្សែន ក្រូម៉ូសូម និងការបង្កាត់ពូជឯកកូនកាត់របស់លោកម៉ង់ដែល់',
        descriptionEn: 'Monohybrid cross, dominant vs recessive alleles, and phenotypic ratios.',
      },
    ],
    10: [
      {
        orderIndex: 1,
        titleKm: 'សមាសធាតុគីមីនៃកោសិកា',
        titleEn: 'Biochemistry of Cells',
        descriptionKm: 'កាបូអ៊ីដ្រាត លីពីត ប្រូតេអ៊ីន និងអាស៊ីតនុយក្លេអ៊ិចក្នុងសារពាង្គកាយ',
        descriptionEn: 'Macromolecules: carbohydrates, lipids, proteins, and nucleic acids.',
      },
      {
        orderIndex: 2,
        titleKm: 'អង់ស៊ីម និងមេតាបូលីសកោសិកា',
        titleEn: 'Enzymes & Cell Metabolism',
        descriptionKm: 'យន្តការសកម្មភាពអង់ស៊ីម (Lock & Key) អាន៉ាបូលីស និងកាតាបូលីស',
        descriptionEn: 'Enzyme catalysis kinetics, active sites, and metabolic pathways.',
      },
      {
        orderIndex: 3,
        titleKm: 'ចំណែកកោសិកា៖ មីតូស និងមេយ៉ូស',
        titleEn: 'Mitosis & Meiosis',
        descriptionKm: 'វដ្តកោសិកា ដំណាក់កាលមីតូស និងការបង្កើតស្ពែម-អូវុលតាមមេយ៉ូស',
        descriptionEn: 'Cell cycle phases, mitotic somatic division, and meiotic gametogenesis.',
      },
      {
        orderIndex: 4,
        titleKm: 'ដង្ហើមកោសិកា និង ATP',
        titleEn: 'Cellular Respiration & ATP',
        descriptionKm: 'គ្លីកូលីស វដ្តក្រិប (Krebs) និងខ្សែសង្វាក់ដឹកនាំអេឡិចត្រុង',
        descriptionEn: 'Glycolysis, Krebs citric acid cycle, and oxidative phosphorylation.',
      },
      {
        orderIndex: 5,
        titleKm: 'មូលដ្ឋានគ្រឹះនៃពន្ធុវិទ្យា',
        titleEn: 'Foundations of Genetics',
        descriptionKm: 'ការបំបែកគូអាឡែល និងច្បាប់ផ្សំដោយឯករាជ្យរបស់ម៉ង់ដែល់',
        descriptionEn: "Independent assortment, Punnett squares, and dihybrid inheritance.",
      },
    ],
    11: [
      {
        orderIndex: 1,
        titleKm: 'ការដឹកនាំសារធាតុ និងអរម៉ូនរុក្ខជាតិ',
        titleEn: 'Plant Transport & Hormones',
        descriptionKm: 'ស៊ីឡែម ផ្លូអែម ការបញ្ចេញចំហាយទឹក និងអរម៉ូនអុកស៊ីន ហ្ស៊ីប៊ែរ៉េលីន',
        descriptionEn: 'Transpiration pull, xylem/phloem translocation, and plant phytohormones.',
      },
      {
        orderIndex: 2,
        titleKm: 'ចរន្តប្រសាទ និងស៊ីណាប់',
        titleEn: 'Nerve Impulses & Synapses',
        descriptionKm: 'ប៉ូតង់ស្យែលសកម្មភាព ប៉ូតង់ស្យែលសម្រាក និងសារធាតុបញ្ជូនប្រសាទ',
        descriptionEn: 'Resting potential, action potential propagation, and synaptic transmission.',
      },
      {
        orderIndex: 3,
        titleKm: 'ប្រព័ន្ធភាពស៊ាំនៃរាងកាយ',
        titleEn: 'Immune System',
        descriptionKm: 'ភាពស៊ាំពីកំណើត ភាពស៊ាំទទួល ឡាំផូស៊ីត B, T និងអង់ទីគ័រ',
        descriptionEn: 'Innate vs adaptive immunity, B and T cell responses, and antibodies.',
      },
      {
        orderIndex: 4,
        titleKm: 'អេកូឡូស៊ី ច្រវាក់អាហារ និងវដ្តរូបធាតុ',
        titleEn: 'Ecology, Food Webs & Biogeochemical Cycles',
        descriptionKm: 'កម្រិតត្រូហ្វីក ពីរ៉ាមីតអេកូឡូស៊ី វដ្តកាបូន និងវដ្តអាសូត',
        descriptionEn: 'Trophic food webs, energy pyramids, and carbon/nitrogen cycles.',
      },
    ],
    12: [
      {
        orderIndex: 1,
        titleKm: 'ម៉ូលេគុល ADN, ARN និងការសំយោគប្រូតេអ៊ីន',
        titleEn: 'DNA, RNA & Protein Synthesis',
        descriptionKm: 'រចនាសម្ព័ន្ធទ្វេវង់ ដំណើរការស្វ័យតម្រង ការចម្លងក្រម និងការបកប្រែក្រម',
        descriptionEn: 'DNA double helix, semi-conservative replication, transcription, and translation.',
      },
      {
        orderIndex: 2,
        titleKm: 'ការបំប្លែងហ្សែន និងក្រូម៉ូសូម',
        titleEn: 'Genetic & Chromosomal Mutations',
        descriptionKm: 'មុយតាស៊ីញ៉ុងហ្សែន មុយតាស៊ីញ៉ុងក្រូម៉ូសូម និងជំងឺតំណពូជ',
        descriptionEn: 'Point mutations, chromosomal aberrations, and hereditary genetic syndromes.',
      },
      {
        orderIndex: 3,
        titleKm: 'ច្បាប់តំណពូជម៉ង់ដែល់ និងតំណពូជភ្ជាប់ភេទ',
        titleEn: 'Mendelian & Sex-Linked Inheritance',
        descriptionKm: 'ការវិភាគពង្សាវលី និងតំណពូជភ្ជាប់ក្រូម៉ូសូមភេទ X (ជំងឺអេម៉ូភីលី)',
        descriptionEn: 'Pedigree analysis, incomplete dominance, and sex-linked traits (X-linked).',
      },
      {
        orderIndex: 4,
        titleKm: 'បច្ចេកវិទ្យាជីវៈ និងពន្ធុវិស្វកម្ម',
        titleEn: 'Biotechnology & Genetic Engineering',
        descriptionKm: 'បច្ចេកទេស ADN កាត់ត ប្លាស្មីត PCR និងសារពាង្គកាយកែប្រែហ្សែន (OGM)',
        descriptionEn: 'Recombinant DNA technology, PCR amplification, cloning, and GMO applications.',
      },
      {
        orderIndex: 5,
        titleKm: 'ទ្រឹស្តីនៃការវិវត្ត',
        titleEn: 'Theory of Evolution',
        descriptionKm: 'ទ្រឹស្តីជម្រើសធម្មជាតិរបស់ដាវីន ភស្តុតាងផូស៊ីល និងការបង្កើតប្រភេទថ្មី',
        descriptionEn: "Darwinian natural selection, homologous anatomy, and speciation.",
      },
    ],
  },
  english: {
    7: [
      {
        orderIndex: 1,
        titleKm: 'Present Simple & Continuous',
        titleEn: 'Present Simple & Continuous',
        descriptionKm: 'ទម្រង់ និងការប្រើប្រាស់បច្ចុប្បន្នកាលធម្មតា និងបន្ត',
        descriptionEn: 'Form and usage of Present Simple vs Present Continuous for daily routines.',
      },
      {
        orderIndex: 2,
        titleKm: 'Pronouns & Possessives',
        titleEn: 'Pronouns & Possessives',
        descriptionKm: 'Subject, Object, Possessive Adjectives and Pronouns (mine, yours)',
        descriptionEn: 'Mastering personal pronouns, possessive adjectives, and reflexive pronouns.',
      },
      {
        orderIndex: 3,
        titleKm: 'Countable & Uncountable Nouns',
        titleEn: 'Countable & Uncountable Nouns',
        descriptionKm: 'ការប្រើ much, many, a few, a little, some, any',
        descriptionEn: 'Quantifiers, determiners, and count vs non-count noun distinctions.',
      },
      {
        orderIndex: 4,
        titleKm: 'Prepositions of Time & Place',
        titleEn: 'Prepositions of Time & Place',
        descriptionKm: 'ការប្រើប្រាស់ in, on, at សម្រាប់ពេលវេលា និងទីកន្លែង',
        descriptionEn: 'Accurate usage of in, on, at for temporal expressions and locations.',
      },
      {
        orderIndex: 5,
        titleKm: 'Everyday Vocabulary & Reading Comprehension',
        titleEn: 'Everyday Vocabulary & Reading Comprehension',
        descriptionKm: 'ការអានអត្ថបទខ្លីៗ និងឆ្លើយសំណួរស្វែងយល់',
        descriptionEn: 'Short passage reading strategies, finding main ideas, and vocabulary.',
      },
    ],
    8: [
      {
        orderIndex: 1,
        titleKm: 'Past Simple & Continuous',
        titleEn: 'Past Simple & Continuous',
        descriptionKm: 'កិរិយាសព្ទមិនទៀងទាត់ (Irregular verbs) និងសកម្មភាពកាត់កងក្នុងអតីត',
        descriptionEn: 'Irregular verbs, past timelines, and past continuous interruptions with when/while.',
      },
      {
        orderIndex: 2,
        titleKm: 'Future Forms (Will vs Going to)',
        titleEn: 'Future Forms (Will vs Going to)',
        descriptionKm: 'ការសន្យា ការសម្រេចចិត្តភ្លាមៗ និងគម្រោងគ្រោងទុកជាមុន',
        descriptionEn: 'Spontaneous decisions (will) vs prior intentions and predictions (going to).',
      },
      {
        orderIndex: 3,
        titleKm: 'Comparatives & Superlatives',
        titleEn: 'Comparatives & Superlatives',
        descriptionKm: 'កម្រិតប្រៀបធៀបគុណនាមខ្លី និងវែង (as...as, more, most)',
        descriptionEn: 'Regular and irregular comparative and superlative adjective forms.',
      },
      {
        orderIndex: 4,
        titleKm: 'Modal Verbs (Can, Must, Should)',
        titleEn: 'Modal Verbs (Can, Must, Should)',
        descriptionKm: 'សមត្ថភាព កាតព្វកិច្ច និងការផ្តល់យោបល់',
        descriptionEn: 'Expressing ability, prohibition, necessity, and giving advice.',
      },
      {
        orderIndex: 5,
        titleKm: 'Functional Dialogues & Short Paragraph Writing',
        titleEn: 'Functional Dialogues & Short Paragraph Writing',
        descriptionKm: 'ការសន្ទនាក្នុងហាងទំនិញ ភោជនីយដ្ឋាន និងរចនាសម្ព័ន្ធកថាខណ្ឌខ្លី',
        descriptionEn: 'Conversational situational dialogues and topic sentence paragraph structuring.',
      },
    ],
    9: [
      {
        orderIndex: 1,
        titleKm: 'Present Perfect vs Past Simple',
        titleEn: 'Present Perfect vs Past Simple',
        descriptionKm: 'ការប្រើ since, for, already, yet, just និងបទពិសោធជីវិត',
        descriptionEn: 'Differentiating completed past moments from experiences connected to present.',
      },
      {
        orderIndex: 2,
        titleKm: 'First & Second Conditionals',
        titleEn: 'First & Second Conditionals',
        descriptionKm: 'លក្ខខណ្ឌពិត (If + Present, Will) និងសម្មតិកម្មមិនពិត (If + Past, Would)',
        descriptionEn: 'Real future conditions vs hypothetical imaginary present situations.',
      },
      {
        orderIndex: 3,
        titleKm: 'Active & Passive Voice',
        titleEn: 'Active & Passive Voice',
        descriptionKm: 'ការបំប្លែងប្រយោគសកម្មទៅជាអកម្មក្នុងកាលបច្ចុប្បន្ន និងអតីត',
        descriptionEn: 'Passive voice transformation focus: be + past participle across core tenses.',
      },
      {
        orderIndex: 4,
        titleKm: 'Relative Clauses (Who, Which, That)',
        titleEn: 'Relative Clauses (Who, Which, That)',
        descriptionKm: 'ការភ្ជាប់ប្រយោគជាមួយសព្វនាមឈ្នាប់ defining & non-defining',
        descriptionEn: 'Connecting complex clauses using relative pronouns and defining clauses.',
      },
      {
        orderIndex: 5,
        titleKm: 'Diploma Exam Reading & Writing Prep',
        titleEn: 'Diploma Exam Reading & Writing Prep',
        descriptionKm: 'យុទ្ធសាស្ត្រប្រឡងឌីប្លូមថ្នាក់ទី៩៖ ការអានអត្ថបទ និងវេយ្យាករណ៍ចម្រុះ',
        descriptionEn: 'Grade 9 MoEYS Diploma examination reading passages and grammar items.',
      },
    ],
    10: [
      {
        orderIndex: 1,
        titleKm: 'Past Perfect Simple & Continuous',
        titleEn: 'Past Perfect Simple & Continuous',
        descriptionKm: 'សកម្មភាពកើតមុនសកម្មភាពមួយទៀតក្នុងអតីតកាល (had + V3)',
        descriptionEn: 'Sequencing multiple past actions using had + past participle.',
      },
      {
        orderIndex: 2,
        titleKm: 'Reported Speech (Statements & Questions)',
        titleEn: 'Reported Speech (Statements & Questions)',
        descriptionKm: 'ការរាយការណ៍សម្តីប្តូរកាល សព្វនាម និងកន្សោមពេលវេលា',
        descriptionEn: 'Direct to indirect speech tense backshifting and reporting verbs.',
      },
      {
        orderIndex: 3,
        titleKm: 'Gerunds & Infinitives',
        titleEn: 'Gerunds & Infinitives',
        descriptionKm: 'កិរិយាសព្ទតាមដោយ V-ing ឬ To-V និងការប្រែប្រួលអត្ថន័យ',
        descriptionEn: 'Verb patterns with gerunds, infinitives, and verbs that change meaning.',
      },
      {
        orderIndex: 4,
        titleKm: 'Modals of Deduction',
        titleEn: 'Modals of Deduction',
        descriptionKm: 'ការសន្និដ្ឋានជាក់លាក់ ឬសង្ស័យ (must, can’t, might, could)',
        descriptionEn: 'Logical deduction in present and past contexts (must be, can’t have been).',
      },
      {
        orderIndex: 5,
        titleKm: 'Academic Paragraph Structure',
        titleEn: 'Academic Paragraph Structure',
        descriptionKm: 'Topic Sentence, Supporting Details, Cohesion និង Concluding Sentence',
        descriptionEn: 'Paragraph unity, coherence, transitional phrases, and academic vocabulary.',
      },
    ],
    11: [
      {
        orderIndex: 1,
        titleKm: 'Third & Mixed Conditionals',
        titleEn: 'Third & Mixed Conditionals',
        descriptionKm: 'ការស្តាយក្រោយចំពោះអតីត (If + Past Perfect, Would have + V3)',
        descriptionEn: 'Past unreal conditional regrets and mixed time frame hypothetical reasoning.',
      },
      {
        orderIndex: 2,
        titleKm: 'Advanced Passive Structures',
        titleEn: 'Advanced Passive Structures',
        descriptionKm: 'រចនាសម្ព័ន្ធ It is said that... និង He is believed to be...',
        descriptionEn: 'Impersonal passives, causative have/get something done structures.',
      },
      {
        orderIndex: 3,
        titleKm: 'Wish & If Only Clauses',
        titleEn: 'Wish & If Only Clauses',
        descriptionKm: 'ការបញ្ចេញបំណងប្រាថ្នាក្នុងបច្ចុប្បន្ន អនាគត និងការសោកស្តាយក្នុងអតីត',
        descriptionEn: 'Subjunctive mood expressions for desires, hypotheticals, and past regrets.',
      },
      {
        orderIndex: 4,
        titleKm: 'Linking Words & Discourse Markers',
        titleEn: 'Linking Words & Discourse Markers',
        descriptionKm: 'Furthermore, However, Although, Despite, In addition to, Consequently',
        descriptionEn: 'High-level transition connectors for contrast, concession, and addition.',
      },
      {
        orderIndex: 5,
        titleKm: 'Cause-Effect & Opinion Essays',
        titleEn: 'Cause-Effect & Opinion Essays',
        descriptionKm: 'ការរៀបចំគ្រោងតែងសេចក្តី ៥ កថាខណ្ឌ និងការលើកហេតុផលគាំទ្រ',
        descriptionEn: 'Five-paragraph essay thesis statement formulation and logical defense.',
      },
    ],
    12: [
      {
        orderIndex: 1,
        titleKm: 'Inversion & Cleft Sentences',
        titleEn: 'Inversion & Cleft Sentences',
        descriptionKm: 'Never have I ever, Not only... but also, It was... that/who...',
        descriptionEn: 'Emphatic inversion structures after negative adverbs and cleft clauses.',
      },
      {
        orderIndex: 2,
        titleKm: 'Advanced Collocations & Phrasal Verbs',
        titleEn: 'Advanced Collocations & Phrasal Verbs',
        descriptionKm: 'កន្សោមពាក្យជួបញឹកញាប់ក្នុងវិញ្ញាសាបាក់ឌុប និងកិរិយាសព្ទផ្សំ',
        descriptionEn: 'Academic collocations, prepositional combinations, and multi-word verbs.',
      },
      {
        orderIndex: 3,
        titleKm: 'Error Identification & Grammar Mastery',
        titleEn: 'Error Identification & Grammar Mastery',
        descriptionKm: 'បច្ចេកទេសស្វែងរកកំហុសវេយ្យាករណ៍ក្នុងប្រយោគសម្រាប់ការប្រឡងថ្នាក់ជាតិ',
        descriptionEn: 'Error analysis strategies targeting subject-verb agreement, parallelism, and tense.',
      },
      {
        orderIndex: 4,
        titleKm: 'BacII Reading Comprehension Strategies',
        titleEn: 'BacII Reading Comprehension Strategies',
        descriptionKm: 'Skimming, Scanning, Inference, Vocabulary in context សម្រាប់បាក់ឌុប',
        descriptionEn: 'Fast reading strategies, author tone detection, and nuance comprehension.',
      },
      {
        orderIndex: 5,
        titleKm: 'Formal Essay & Personal Statement Writing',
        titleEn: 'Formal Essay & Personal Statement Writing',
        descriptionKm: 'ការសរសេរសំបុត្រផ្លូវការ តែងសេចក្តីបែបពិភាក្សា និងពាក្យសុំអាហារូបករណ៍',
        descriptionEn: 'Writing formal essays, scholarship motivational letters, and conclusions.',
      },
    ],
  },
};

// Storage key for custom staff-added lessons
export const STORAGE_KEY_CUSTOM_LESSONS = 'moeys_custom_lessons_v2';
// Storage key for deleted lesson IDs (to support persistent deletion of base/custom lessons)
export const STORAGE_KEY_DELETED_LESSONS = 'moeys_deleted_lesson_ids_v2';

let memoryCustomLessons: LessonItem[] = [];
let memoryDeletedLessonIds: string[] = [];

export function getCustomLessonsFromStorage(): LessonItem[] {
  if (typeof window === 'undefined') return memoryCustomLessons;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_LESSONS);
    if (!raw) return memoryCustomLessons;
    return JSON.parse(raw);
  } catch {
    return memoryCustomLessons;
  }
}

export function saveCustomLessonsToStorage(lessons: LessonItem[]): void {
  memoryCustomLessons = lessons;
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_LESSONS, JSON.stringify(lessons));
  } catch (err) {
    console.error('Error saving custom lessons:', err);
  }
}

export function getDeletedLessonIds(): string[] {
  if (typeof window === 'undefined') return memoryDeletedLessonIds;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DELETED_LESSONS);
    if (!raw) return memoryDeletedLessonIds;
    return JSON.parse(raw);
  } catch {
    return memoryDeletedLessonIds;
  }
}

export function addDeletedLessonId(id: string): void {
  if (!memoryDeletedLessonIds.includes(id)) {
    memoryDeletedLessonIds.push(id);
  }
  if (typeof window === 'undefined') return;
  try {
    const current = getDeletedLessonIds();
    if (!current.includes(id)) {
      localStorage.setItem(STORAGE_KEY_DELETED_LESSONS, JSON.stringify([...current, id]));
    }
  } catch (err) {
    console.error('Error saving deleted lesson id:', err);
  }
}

export function removeDeletedLessonId(id: string): void {
  memoryDeletedLessonIds = memoryDeletedLessonIds.filter((i) => i !== id);
  if (typeof window === 'undefined') return;
  try {
    const current = getDeletedLessonIds();
    localStorage.setItem(STORAGE_KEY_DELETED_LESSONS, JSON.stringify(current.filter((i) => i !== id)));
  } catch (err) {
    console.error('Error removing deleted lesson id:', err);
  }
}

// Helper function to get flat list of all lessons with unique IDs (including custom quick-added lessons)
export function getAllLessons(): LessonItem[] {
  const result: LessonItem[] = [];
  (Object.keys(MOEYS_CURRICULUM) as SubjectId[]).forEach((subject) => {
    (Object.keys(MOEYS_CURRICULUM[subject]) as unknown as GradeLevel[]).forEach((grade) => {
      const lessons = getLessonsBySubjectAndGrade(subject, Number(grade) as GradeLevel);
      result.push(...lessons);
    });
  });
  return result;
}

export function cleanLessonTitle(title: string): string {
  if (!title) return '';
  return title
    .replace(/^មេរៀនទី\s*\d+\s*[:៖\-]?\s*/i, '')
    .replace(/^Lesson\s*\d+\s*[:\-]?\s*/i, '')
    .trim();
}

export function getLessonsBySubjectAndGrade(subject: SubjectId, grade: GradeLevel): LessonItem[] {
  const list = MOEYS_CURRICULUM[subject]?.[grade] || [];
  const baseLessons: LessonItem[] = list.map((l) => ({
    ...l,
    titleKm: cleanLessonTitle(l.titleKm),
    titleEn: cleanLessonTitle(l.titleEn),
    id: `${subject}-g${grade}-${l.orderIndex}`,
    subject,
    grade,
  }));

  const customs = getCustomLessonsFromStorage().filter(
    (l) => l.subject === subject && l.grade === grade
  ).map((c) => ({
    ...c,
    titleKm: cleanLessonTitle(c.titleKm),
    titleEn: cleanLessonTitle(c.titleEn),
  }));

  const merged = [...baseLessons];
  for (const custom of customs) {
    const existingIdx = merged.findIndex((m) => m.id === custom.id);
    if (existingIdx !== -1) {
      merged[existingIdx] = custom;
    } else {
      merged.push(custom);
    }
  }

  const deletedIds = new Set(getDeletedLessonIds());
  return merged
    .filter((l) => !deletedIds.has(l.id))
    .sort((a, b) => a.orderIndex - b.orderIndex);
}

export function getLessonById(id: string): LessonItem | undefined {
  return getAllLessons().find((l) => l.id === id);
}
