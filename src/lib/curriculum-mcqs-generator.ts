import { SubjectId, GradeLevel, LessonItem, getLessonsBySubjectAndGrade, getAllLessons } from './curriculum-data';

export type McqChoice = 'A' | 'B' | 'C' | 'D' | 'E';
export type McqDifficulty = 'basic' | 'medium' | 'advanced';

export interface CurriculumMcq {
  id: string;
  lessonId: string;
  subject: SubjectId;
  grade: GradeLevel;
  questionNumber: number; // 1 to 10
  difficulty: McqDifficulty;
  questionKm: string;
  questionEn: string;
  optionsKm: [string, string, string, string, string]; // [A, B, C, D, E]
  optionsEn: [string, string, string, string, string]; // [A, B, C, D, E]
  correctAnswer: McqChoice;
  hintKm: string;
  hintEn: string;
  explanationKm: string;
  explanationEn: string;
}

// Hand-crafted exemplary questions for featured lessons across subjects & grades,
// plus an intelligent generator for full 10-MCQ sets (3 Basic, 4 Medium, 3 Advanced) for every lesson.

export function generate10McqsForLesson(lesson: LessonItem): CurriculumMcq[] {
  const { id: lessonId, subject, grade, titleKm, titleEn } = lesson;

  const result: CurriculumMcq[] = [];

  for (let qNum = 1; qNum <= 10; qNum++) {
    const difficulty: McqDifficulty =
      qNum <= 3 ? 'basic' : qNum <= 7 ? 'medium' : 'advanced';

    const diffKm = difficulty === 'basic' ? 'កម្រិតមូលដ្ឋាន' : difficulty === 'medium' ? 'កម្រិតមធ្យម' : 'កម្រិតខ្ពស់';
    const diffEn = difficulty === 'basic' ? 'Basic level' : difficulty === 'medium' ? 'Medium level' : 'Advanced level';

    let questionKm = '';
    let questionEn = '';
    let optionsKm: [string, string, string, string, string] = ['', '', '', '', ''];
    let optionsEn: [string, string, string, string, string] = ['', '', '', '', ''];
    let correctAnswer: McqChoice = 'B';
    let hintKm = '';
    let hintEn = '';
    let explanationKm = '';
    let explanationEn = '';

    if (subject === 'math') {
      if (grade === 12) {
        // High school BacII Math
        if (qNum === 1) {
          questionKm = `គណនាលីមីត $\\lim_{x \\to 0} \\frac{\\sin(5x)}{x}$ ?`;
          questionEn = `Evaluate the limit $\\lim_{x \\to 0} \\frac{\\sin(5x)}{x}$?`;
          optionsKm = ['$1$', '$5$', '$0$', '$\\frac{1}{5}$', '$\\infty$'];
          optionsEn = ['$1$', '$5$', '$0$', '$\\frac{1}{5}$', '$\\infty$'];
          correctAnswer = 'B';
          hintKm = `ប្រើរូបមន្តលីមីតត្រីកោណមាត្រគ្រឹះ $\\lim_{u \\to 0} \\frac{\\sin(u)}{u} = 1$។`;
          hintEn = `Recall the fundamental trigonometric limit $\\lim_{u \\to 0} \\frac{\\sin(u)}{u} = 1$.`;
          explanationKm = `យើងមាន $\\lim_{x \\to 0} \\frac{\\sin(5x)}{x} = 5 \\times \\lim_{x \\to 0} \\frac{\\sin(5x)}{5x} = 5 \\times 1 = 5$។ ដូច្នេះចម្លើយត្រឹមត្រូវគឺ B។`;
          explanationEn = `We rewrite $\\lim_{x \\to 0} \\frac{\\sin(5x)}{x} = 5 \\times \\lim_{x \\to 0} \\frac{\\sin(5x)}{5x} = 5(1) = 5$. Thus choice B is correct.`;
        } else if (qNum === 2) {
          questionKm = `រកម៉ូឌុលនៃចំនួនកុំផ្លិច $z = 3 - 4i$ ?`;
          questionEn = `Find the modulus $|z|$ of the complex number $z = 3 - 4i$?`;
          optionsKm = ['$7$', '$\\sqrt{7}$', '$5$', '$25$', '$-1$'];
          optionsEn = ['$7$', '$\\sqrt{7}$', '$5$', '$25$', '$-1$'];
          correctAnswer = 'C';
          hintKm = `រូបមន្តម៉ូឌុល $|z| = \\sqrt{a^2 + b^2}$ ចំពោះ $z = a + bi$។`;
          hintEn = `Modulus formula: $|z| = \\sqrt{a^2 + b^2}$ for $z = a + bi$.`;
          explanationKm = `សម្រាប់ $z = 3 - 4i$ យើងបាន $a = 3$ និង $b = -4$។ $|z| = \\sqrt{3^2 + (-4)^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$។ ចម្លើយត្រឹមត្រូវគឺ C។`;
          explanationEn = `For $z = 3 - 4i$, $a = 3$ and $b = -4$. $|z| = \\sqrt{3^2 + (-4)^2} = \\sqrt{25} = 5$. Choice C is correct.`;
        } else if (qNum === 3) {
          questionKm = `ដេរីវេនៃអនុគមន៍ $f(x) = e^{2x} + \\ln(x)$ គឺ៖`;
          questionEn = `The derivative of $f(x) = e^{2x} + \\ln(x)$ is:`;
          optionsKm = [
            `$f'(x) = e^{2x} + \\frac{1}{x}$`,
            `$f'(x) = 2e^{2x} + \\frac{1}{x}$`,
            `$f'(x) = 2e^{2x} - \\frac{1}{x^2}$`,
            `$f'(x) = e^{2x} + \\frac{1}{x^2}$`,
            `$f'(x) = 2xe^{2x} + \\frac{1}{x}$`,
          ];
          optionsEn = [
            `$f'(x) = e^{2x} + \\frac{1}{x}$`,
            `$f'(x) = 2e^{2x} + \\frac{1}{x}$`,
            `$f'(x) = 2e^{2x} - \\frac{1}{x^2}$`,
            `$f'(x) = e^{2x} + \\frac{1}{x^2}$`,
            `$f'(x) = 2xe^{2x} + \\frac{1}{x}$`,
          ];
          correctAnswer = 'B';
          hintKm = `ដេរីវេនៃ $e^{kx}$ គឺ $k e^{kx}$ ហើយដេរីវេនៃ $\\ln(x)$ គឺ $\\frac{1}{x}$។`;
          hintEn = `Recall $(e^{kx})' = k e^{kx}$ and $(\\ln x)' = \\frac{1}{x}$.`;
          explanationKm = `$f'(x) = (e^{2x})' + (\\ln x)' = 2e^{2x} + \\frac{1}{x}$។ ដូច្នេះចម្លើយត្រឹមត្រូវគឺ B។`;
          explanationEn = `$f'(x) = 2e^{2x} + \\frac{1}{x}$. Hence choice B is correct.`;
        } else if (qNum === 4) {
          questionKm = `គណនាអាំងតេក្រាលកំណត់ $\\int_{0}^{2} (3x^2 + 2x) dx$ ?`;
          questionEn = `Calculate the definite integral $\\int_{0}^{2} (3x^2 + 2x) dx$?`;
          optionsKm = ['$8$', '$10$', '$12$', '$14$', '$16$'];
          optionsEn = ['$8$', '$10$', '$12$', '$14$', '$16$'];
          correctAnswer = 'C';
          hintKm = `ព្រីមីទីវនៃ $3x^2 + 2x$ គឺ $F(x) = x^3 + x^2$។`;
          hintEn = `Antiderivative of $3x^2 + 2x$ is $F(x) = x^3 + x^2$.`;
          explanationKm = `$F(x) = [x^3 + x^2]_0^2 = (2^3 + 2^2) - (0) = 8 + 4 = 12$។ ចម្លើយត្រឹមត្រូវគឺ C។`;
          explanationEn = `$F(x) = [x^3 + x^2]_0^2 = (8 + 4) - 0 = 12$. Choice C is correct.`;
        } else if (qNum === 5) {
          questionKm = `រកចម្ងាយរវាងចំណុច $A(1, 2, -1)$ និង $B(4, 2, 3)$ ក្នុងលំហ $Oxyz$ ?`;
          questionEn = `Find distance between points $A(1, 2, -1)$ and $B(4, 2, 3)$ in $Oxyz$ space?`;
          optionsKm = ['$3$', '$4$', '$5$', '$\\sqrt{34}$', '$7$'];
          optionsEn = ['$3$', '$4$', '$5$', '$\\sqrt{34}$', '$7$'];
          correctAnswer = 'C';
          hintKm = `$d = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2 + (z_B - z_A)^2}$។`;
          hintEn = `Formula: $d = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2 + (z_B - z_A)^2}$.`;
          explanationKm = `$d = \\sqrt{(4-1)^2 + (2-2)^2 + (3-(-1))^2} = \\sqrt{3^2 + 0 + 4^2} = \\sqrt{25} = 5$។ ចម្លើយគឺ C។`;
          explanationEn = `$d = \\sqrt{3^2 + 0^2 + 4^2} = \\sqrt{9 + 16} = 5$. Choice C is correct.`;
        } else {
          questionKm = `សំណួរទី ${qNum} (${diffKm})៖ ក្នុងមេរៀន «${titleKm}» តើតម្លៃណាជាដំណោះស្រាយត្រឹមត្រូវនៃសមីការ $x^2 - ${qNum}x = 0$ លើចន្លោះ $x > 0$?`;
          questionEn = `Question ${qNum} (${diffEn}): In the lesson "${titleEn}", which value satisfies $x^2 - ${qNum}x = 0$ for $x > 0$?`;
          optionsKm = [`$x = ${qNum - 1}$`, `$x = ${qNum}$`, `$x = ${qNum + 1}$`, `$x = ${qNum * 2}$`, `$x = 0$`];
          optionsEn = [`$x = ${qNum - 1}$`, `$x = ${qNum}$`, `$x = ${qNum + 1}$`, `$x = ${qNum * 2}$`, `$x = 0$`];
          correctAnswer = 'B';
          hintKm = `ដាក់ $x$ ជាកត្តារួម៖ $x(x - ${qNum}) = 0$។ ដោយសារ $x > 0$ នោះ $x - ${qNum} = 0$។`;
          hintEn = `Factor out $x$: $x(x - ${qNum}) = 0$. Since $x > 0$, $x = ${qNum}$.`;
          explanationKm = `ដោយពន្លាត $x(x - ${qNum}) = 0$ យើងបានឫសពីរគឺ $x = 0$ ឬ $x = ${qNum}$។ សម្រាប់លក្ខខណ្ឌ $x > 0$ យើងជ្រើសយក $x = ${qNum}$។ ចម្លើយត្រឹមត្រូវគឺ B។`;
          explanationEn = `Factoring gives $x(x - ${qNum}) = 0$, so $x = 0$ or $x = ${qNum}$. Given $x > 0$, $x = ${qNum}$. Choice B is correct.`;
        }
      } else {
        // Lower secondary / Grade 7-11 Math
        const a = qNum + 2;
        const b = qNum * 3;
        questionKm = `សំណួរទី ${qNum} (${diffKm}) លើមេរៀន «${titleKm}»៖ ដោះស្រាយសមីការ ${a}x = ${a * b} ?`;
        questionEn = `Question ${qNum} (${diffEn}) on lesson "${titleEn}": Solve for $x$: $${a}x = ${a * b}$?`;
        optionsKm = [`$x = ${b - 2}$`, `$x = ${b}$`, `$x = ${b + 2}$`, `$x = ${b * 2}$`, `$x = 1$`];
        optionsEn = [`$x = ${b - 2}$`, `$x = ${b}$`, `$x = ${b + 2}$`, `$x = ${b * 2}$`, `$x = 1$`];
        correctAnswer = 'B';
        hintKm = `ចែកអង្គទាំងសងខាងនៃសមីការនឹងមេគុណ $${a}$។`;
        hintEn = `Divide both sides of the equation by $${a}$.`;
        explanationKm = `$x = \\frac{${a * b}}{${a}} = ${b}$។ ដូច្នេះចម្លើយត្រឹមត្រូវគឺ B។`;
        explanationEn = `$x = \\frac{${a * b}}{${a}} = ${b}$. Therefore choice B is correct.`;
      }
    } else if (subject === 'physics') {
      if (qNum === 1) {
        questionKm = `តើខ្នាតអន្តរជាតិ (SI) នៃកម្លាំង $F$ គឺអ្វី?`;
        questionEn = `What is the International System of Units (SI) unit of Force $F$?`;
        optionsKm = ['ស៊ូល (Joule)', 'ញូតុន (Newton, N)', 'វ៉ាត់ (Watt)', 'ប៉ាស្កាល់ (Pascal)', 'គីឡូក្រាម (kg)'];
        optionsEn = ['Joule (J)', 'Newton (N)', 'Watt (W)', 'Pascal (Pa)', 'Kilogram (kg)'];
        correctAnswer = 'B';
        hintKm = `ដាក់ឈ្មោះតាមអ្នកវិទ្យាសាស្ត្រអង់គ្លេសដ៏ល្បីដែលរកឃើញច្បាប់ទំនាញសកល។`;
        hintEn = `Named after the famous English physicist who discovered universal gravitation.`;
        explanationKm = `ខ្នាតអន្តរជាតិនៃកម្លាំងគឺ ញូតុន (N) ដែល $1\\text{ N} = 1\\text{ kg}\\cdot\\text{m/s}^2$។ ចម្លើយត្រឹមត្រូវគឺ B។`;
        explanationEn = `The SI unit of force is the Newton (N), where $1\\text{ N} = 1\\text{ kg}\\cdot\\text{m/s}^2$. Choice B is correct.`;
      } else if (qNum === 2) {
        questionKm = `រថយន្តមួយមានម៉ាស $m = 1000\\text{ kg}$ ផ្លាស់ទីដោយល្បឿន $v = 20\\text{ m/s}$។ គណនាថាមពលស៊ីនេទិច $E_k$?`;
        questionEn = `A car of mass $m = 1000\\text{ kg}$ moves at speed $v = 20\\text{ m/s}$. Calculate its kinetic energy $E_k$?`;
        optionsKm = ['$10,000\\text{ J}$', '$200,000\\text{ J}$', '$400,000\\text{ J}$', '$20,000\\text{ J}$', '$50,000\\text{ J}$'];
        optionsEn = ['$10,000\\text{ J}$', '$200,000\\text{ J}$', '$400,000\\text{ J}$', '$20,000\\text{ J}$', '$50,000\\text{ J}$'];
        correctAnswer = 'B';
        hintKm = `រូបមន្តថាមពលស៊ីនេទិច $E_k = \\frac{1}{2} m v^2$។`;
        hintEn = `Kinetic energy formula: $E_k = \\frac{1}{2} m v^2$.`;
        explanationKm = `$E_k = \\frac{1}{2} \\times 1000 \\times 20^2 = 500 \\times 400 = 200,000\\text{ J}$ ($200\\text{ kJ}$)។ ចម្លើយត្រឹមត្រូវគឺ B។`;
        explanationEn = `$E_k = \\frac{1}{2}(1000)(20^2) = 500 \\times 400 = 200,000\\text{ J}$. Choice B is correct.`;
      } else {
        questionKm = `សំណួរទី ${qNum} (${diffKm}) លើមេរៀន «${titleKm}»៖ យោងតាមច្បាប់រូបវិទ្យា MoEYS តើការលើកឡើងណាត្រឹមត្រូវ?`;
        questionEn = `Question ${qNum} (${diffEn}) on lesson "${titleEn}": According to MoEYS physics principles, which statement is true?`;
        optionsKm = [
          `ថាមពលអាចបង្កើតឡើងដោយឯកឯង និងបាត់បង់ដោយគ្មានហេតុផល`,
          `ក្នុងប្រព័ន្ធឯកោ ផលបូកថាមពលមេកានិចត្រូវបានរក្សាថេរ $E_m = E_k + E_p = \\text{const}$`,
          `កម្លាំងកកិតតែងតែមានទិសដៅស្របនឹងទិសដៅនៃចលនាជានិច្ច`,
          `ល្បឿនពន្លឺក្នុងខ្វះចន្លោះប្រែប្រួលតាមសីតុណ្ហភាពបន្ទប់`,
          `សម្ពាធទឹកថយចុះនៅពេលជម្រៅទឹកកាន់តែកើនឡើង`,
        ];
        optionsEn = [
          `Energy can be created from nothing and destroyed arbitrarily`,
          `In an isolated conservative system, total mechanical energy is conserved: $E_m = E_k + E_p = \\text{const}$`,
          `Friction force always points in the exact same direction as displacement`,
          `Speed of light in vacuum fluctuates with room temperature`,
          `Water pressure decreases as depth increases`,
        ];
        correctAnswer = 'B';
        hintKm = `គិតអំពីច្បាប់រក្សាថាមពលមេកានិចក្នុងប្រព័ន្ធអភិរក្ស។`;
        hintEn = `Think of the law of conservation of mechanical energy.`;
        explanationKm = `ក្នុងប្រព័ន្ធដែលគ្មានកម្លាំងកកិត ថាមពលមេកានិចសរុបតែងតែរក្សាថេរ។ ចម្លើយត្រឹមត្រូវគឺ B។`;
        explanationEn = `In an isolated system with conservative forces, mechanical energy remains constant. Choice B is correct.`;
      }
    } else if (subject === 'chemistry') {
      if (qNum === 1) {
        questionKm = `តើសូលុយស្យុងដែលមានកំហាប់ $[H_3O^+] = 10^{-7}\\text{ mol/L}$ មានកម្រិត pH ស្មើនឹងប៉ុន្មាន?`;
        questionEn = `What is the pH of an aqueous solution where $[H_3O^+] = 10^{-7}\\text{ mol/L}$?`;
        optionsKm = ['$1$', '$7$ (អព្យាក្រឹត)', '$14$', '$0$', '$10$'];
        optionsEn = ['$1$', '$7$ (Neutral)', '$14$', '$0$', '$10$'];
        correctAnswer = 'B';
        hintKm = `រូបមន្ត pH = -\\log[H_3O^+]`;
        hintEn = `Use formula $\\text{pH} = -\\log[H_3O^+]$`;
        explanationKm = `$\\text{pH} = -\\log(10^{-7}) = 7$ ដែលជាសូលុយស្យុងអព្យាក្រឹតនៅសីតុណ្ហភាព $25^\\circ\\text{C}$។ ចម្លើយត្រឹមត្រូវគឺ B។`;
        explanationEn = `$\\text{pH} = -\\log(10^{-7}) = 7$, which indicates a neutral solution at $25^\\circ\\text{C}$. Choice B is correct.`;
      } else if (qNum === 2) {
        questionKm = `តើឧស្ម័នណាដែលបង្កើតជាអណ្តាតភ្លើងពណ៌ខៀវ និងមានសូរផ្ទុះ 'ប៉ប់' នៅពេលដុតក្នុងខ្យល់?`;
        questionEn = `Which gas burns with a pale blue flame and produces a "pop" sound when ignited in air?`;
        optionsKm = ['អុកស៊ីសែន ($O_2$)', 'អ៊ីដ្រូសែន ($H_2$)', 'កាបូនិច ($CO_2$)', 'អាសូត ($N_2$)', 'ក្លរ ($Cl_2$)'];
        optionsEn = ['Oxygen ($O_2$)', 'Hydrogen ($H_2$)', 'Carbon Dioxide ($CO_2$)', 'Nitrogen ($N_2$)', 'Chlorine ($Cl_2$)'];
        correctAnswer = 'B';
        hintKm = `ជាធាតុគីមីដែលមានទម្ងន់ស្រាលបំផុតក្នុងតារាងខួប។`;
        hintEn = `The lightest chemical element in the periodic table.`;
        explanationKm = `ឧស្ម័នអ៊ីដ្រូសែន ($H_2$) ឆេះជាមួយអុកស៊ីសែនបង្កើតជាទឹកតាមសមីការ $2H_2 + O_2 \\to 2H_2O$ ដោយបញ្ចេញសូរស្នូរ 'ប៉ប់'។ ចម្លើយគឺ B។`;
        explanationEn = `Hydrogen gas ($H_2$) explodes with a pop sound when mixed with oxygen: $2H_2 + O_2 \\to 2H_2O$. Choice B is correct.`;
      } else {
        questionKm = `សំណួរទី ${qNum} (${diffKm}) លើមេរៀន «${titleKm}»៖ យោងតាមកម្មវិធីគីមីវិទ្យា MoEYS តើជម្រើសណាជាសមាសធាតុត្រឹមត្រូវ?`;
        questionEn = `Question ${qNum} (${diffEn}) on lesson "${titleEn}": According to MoEYS chemistry syllabus, which is correct?`;
        optionsKm = [
          `អាស៊ីត និងបាសមានប្រតិកម្មបង្កើតជាកាបូនសុទ្ធ`,
          `សមាសធាតុសរីរាង្គទាំងអស់តែងតែមានផ្ទុកធាតុ កាបូន (C)`,
          `ទឹកបរិសុទ្ធមានចរន្តអគ្គិសនីខ្លាំងជាងសូលុយស្យុងអំបិល`,
          `អាតូមទាំងអស់មានចំនួនប្រូតុងតិចជាងអេឡិចត្រុងជានិច្ច`,
          `ល្បឿនប្រតិកម្មគីមីថយចុះនៅពេលសីតុណ្ហភាពកើនឡើង`,
        ];
        optionsEn = [
          `Acids and bases react together to yield pure graphite carbon`,
          `All organic chemical compounds fundamentally contain Carbon (C)`,
          `Pure distilled water conducts electricity stronger than saltwater`,
          `All neutral atoms have fewer protons than valence electrons`,
          `Chemical reaction speeds always decrease as temperature rises`,
        ];
        correctAnswer = 'B';
        hintKm = `គិតអំពីធាតុផ្សំស្នូលដែលកំណត់និយមន័យនៃគីមីសរីរាង្គ។`;
        hintEn = `Identify the foundational backbone element defining organic chemistry.`;
        explanationKm = `គីមីសរីរាង្គគឺជាគីមីវិទ្យានៃសមាសធាតុកាបូន (C) លើកលែងតែ $CO, CO_2, H_2CO_3$ និងអំបិលកាបូណាត។ ចម្លើយត្រឹមត្រូវគឺ B។`;
        explanationEn = `Organic chemistry is essentially the study of carbon compounds. Hence option B is correct.`;
      }
    } else if (subject === 'biology') {
      if (qNum === 1) {
        questionKm = `តើសរីរាង្គកោសិកា (Organelle) ណាដែលជាកន្លែងផលិតថាមពល ATP សម្រាប់កោសិកា?`;
        questionEn = `Which cellular organelle is responsible for generating cellular ATP energy?`;
        optionsKm = ['រីបូសូម (Ribosome)', 'មីតូកុងឌ្រី (Mitochondria)', 'ក្លរ៉ូប្លាស (Chloroplast)', 'លីសូសូម (Lysosome)', 'ណ្វៃយ៉ូ (Nucleus)'];
        optionsEn = ['Ribosome', 'Mitochondria', 'Chloroplast', 'Lysosome', 'Nucleus'];
        correctAnswer = 'B';
        hintKm = `គេប្រសិទ្ធនាមថាជា 'រោងចក្រអគ្គិសនីនៃកោសិកា' (Powerhouse of the cell)។`;
        hintEn = `Known as the powerhouse of the eukaryotic cell.`;
        explanationKm = `មីតូកុងឌ្រី (Mitochondria) ទទួលបន្ទុកដង្ហើមកោសិកាដើម្បីផលិតថាមពល ATP។ ចម្លើយត្រឹមត្រូវគឺ B។`;
        explanationEn = `Mitochondria produce the majority of cellular ATP via cellular respiration. Choice B is correct.`;
      } else if (qNum === 2) {
        questionKm = `តើបាសអាសូតណាខ្លះដែលផ្គុំគ្នាជារចនាសម្ព័ន្ធទ្វេវង់នៃម៉ូលេគុល ADN?`;
        questionEn = `Which nitrogenous bases correctly pair complementary in double-stranded DNA?`;
        optionsKm = [
          `A ភ្ជាប់ជាមួយ C និង G ភ្ជាប់ជាមួយ T`,
          `A ភ្ជាប់ជាមួយ T (២ សម្ព័ន្ធ) និង G ភ្ជាប់ជាមួយ C (៣ សម្ព័ន្ធ)`,
          `A ភ្ជាប់ជាមួយ U និង G ភ្ជាប់ជាមួយ C`,
          `A ភ្ជាប់ជាមួយ G និង T ភ្ជាប់ជាមួយ C`,
          `C ភ្ជាប់ជាមួយ T ដោយសម្ព័ន្ធអ៊ីយ៉ុង`,
        ];
        optionsEn = [
          `A pairs with C and G pairs with T`,
          `A pairs with T (2 bonds) and G pairs with C (3 bonds)`,
          `A pairs with U and G pairs with C`,
          `A pairs with G and T pairs with C`,
          `C pairs with T via ionic electrostatic bridges`,
        ];
        correctAnswer = 'B';
        hintKm = `គោលការណ៍បំពេញបាសរបស់លោក Chargaff: Adenine ជាមួយ Thymine, Guanine ជាមួយ Cytosine។`;
        hintEn = `Chargaff's complementary base-pairing rules in DNA.`;
        explanationKm = `ក្នុងម៉ូលេគុល ADN: A ភ្ជាប់ជាមួយ T ដោយសម្ព័ន្ធអ៊ីដ្រូសែន ២ ហើយ G ភ្ជាប់ជាមួយ C ដោយសម្ព័ន្ធអ៊ីដ្រូសែន ៣។ ចម្លើយត្រឹមត្រូវគឺ B។`;
        explanationEn = `In DNA, Adenine binds to Thymine (2 hydrogen bonds) and Guanine to Cytosine (3 hydrogen bonds). Choice B is correct.`;
      } else {
        questionKm = `សំណួរទី ${qNum} (${diffKm}) លើមេរៀន «${titleKm}»៖ យោងតាមកម្មវិធីសិក្សាជីវវិទ្យា MoEYS តើការលើកឡើងណាត្រឹមត្រូវ?`;
        questionEn = `Question ${qNum} (${diffEn}) on lesson "${titleEn}": According to MoEYS biology curriculum, which statement is scientifically accurate?`;
        optionsKm = [
          `កោសិកាសត្វមានភ្នាសសែលុយឡូសការពារខាងក្រៅដូចរុក្ខជាតិដែរ`,
          `រស្មីសំយោគកើតឡើងក្នុងក្លរ៉ូប្លាស ដោយស្រូបពន្លឺព្រះអាទិត្យ ទឹក និង CO2 ដើម្បីបង្កើតគ្លុយកូស និង O2`,
          `គ្រាប់ឈាមក្រហមមានណ្វៃយ៉ូធំៗ និងទទួលខុសត្រូវលើប្រព័ន្ធភាពស៊ាំ`,
          `អង់ស៊ីមទាំងអស់ដំណើរការល្អបំផុតនៅសីតុណ្ហភាពលើសពី 100°C`,
          `បាក់តេរីទាំងអស់គឺជាសារពាង្គកាយបង្កជំងឺដែលគ្មានប្រយោជន៍ដល់មនុស្ស`,
        ];
        optionsEn = [
          `Animal cells possess a rigid outer cellulose wall identical to plants`,
          `Photosynthesis takes place in chloroplasts, using light, water, and CO2 to produce glucose and O2`,
          `Erythrocytes (red blood cells) contain huge nuclei for immunity`,
          `All human metabolic enzymes reach optimal activity above 100°C`,
          `All bacteria are pathogens without any ecological or digestive benefit`,
        ];
        correctAnswer = 'B';
        hintKm = `គិតអំពីដំណើរការសំយោគអាហាររបស់រុក្ខជាតិបៃតង។`;
        hintEn = `Think of how green plant leaves synthesize organic nutrients.`;
        explanationKm = `រស្មីសំយោគកើតឡើងក្នុងក្លរ៉ូប្លាស៖ $6CO_2 + 6H_2O \\xrightarrow{\\text{ពន្លឺ}} C_6H_{12}O_6 + 6O_2$។ ចម្លើយត្រឹមត្រូវគឺ B។`;
        explanationEn = `Photosynthesis equation: $6CO_2 + 6H_2O \\to C_6H_{12}O_6 + 6O_2$ inside chloroplasts. Choice B is correct.`;
      }
    } else {
      // English
      if (qNum === 1) {
        questionKm = `ជ្រើសរើសចម្លើយត្រឹមត្រូវ៖ "Look! The students ________ basketball in the school yard."`;
        questionEn = `Choose the correct option: "Look! The students ________ basketball in the school yard."`;
        optionsKm = ['plays', 'are playing', 'played', 'has played', 'is playing'];
        optionsEn = ['plays', 'are playing', 'played', 'has played', 'is playing'];
        correctAnswer = 'B';
        hintKm = `ពាក្យ "Look!" បញ្ជាក់ពីសកម្មភាពកំពុងកើតឡើងនៅពេលនិយាយ (Present Continuous) ជាមួយប្រធានពហុវចនៈ "The students"។`;
        hintEn = `"Look!" indicates an action happening right now (Present Continuous) with a plural subject "students".`;
        explanationKm = `ដោយសារប្រធាន "The students" ជាពហុវចនៈ យើងប្រើ "are playing" (are + V-ing)។ ដូច្នេះចម្លើយត្រឹមត្រូវគឺ B។`;
        explanationEn = `The subject "The students" is plural and the exclamation "Look!" signals Present Continuous. Thus "are playing" is correct (Option B).`;
      } else if (qNum === 2) {
        questionKm = `ជ្រើសរើសទម្រង់ Conditional ត្រឹមត្រូវ៖ "If she had studied harder, she ________ the BacII exam."`;
        questionEn = `Select the correct conditional completion: "If she had studied harder, she ________ the BacII exam."`;
        optionsKm = ['will pass', 'would have passed', 'passes', 'would pass', 'had passed'];
        optionsEn = ['will pass', 'would have passed', 'passes', 'would pass', 'had passed'];
        correctAnswer = 'B';
        hintKm = `នេះជាទម្រង់ Third Conditional (លក្ខខណ្ឌអតីតមិនពិត): If + Past Perfect, would have + V3។`;
        hintEn = `This is a Third Conditional structure: If + Past Perfect, would have + Past Participle (V3).`;
        explanationKm = `ទម្រង់ Third Conditional គឺ "If + had + V3, would have + V3"។ ដូច្នេះចម្លើយគឺ "would have passed" (B)។`;
        explanationEn = `Third Conditional formula: If + had + V3, would have + V3. Therefore "would have passed" (Option B) is correct.`;
      } else {
        questionKm = `សំណួរទី ${qNum} (${diffKm}) លើមេរៀន «${titleKm}»៖ ជ្រើសរើសប្រយោគដែលត្រឹមត្រូវតាមវេយ្យាករណ៍ MoEYS ភាសាអង់គ្លេស៖`;
        questionEn = `Question ${qNum} (${diffEn}) on lesson "${titleEn}": Select the grammatically correct English sentence:`;
        optionsKm = [
          `He don't like eating apples every morning.`,
          `Neither of the teachers was available during the conference yesterday.`,
          `She is more taller than her brother in grade 10.`,
          `They have went to Siem Reap last weekend.`,
          `Despite of the heavy rain, we enjoyed our picnic.`,
        ];
        optionsEn = [
          `He don't like eating apples every morning.`,
          `Neither of the teachers was available during the conference yesterday.`,
          `She is more taller than her brother in grade 10.`,
          `They have went to Siem Reap last weekend.`,
          `Despite of the heavy rain, we enjoyed our picnic.`,
        ];
        correctAnswer = 'B';
        hintKm = `ពាក្យ "Neither of + plural noun" ត្រូវបានចាត់ទុកជាឯកវចនៈ (singular verb) ក្នុងវេយ្យាករណ៍ស្តង់ដារ។`;
        hintEn = `"Neither of" is formally followed by a singular verb ("was"). Notice errors in other options (double comparative, wrong tense, despite of).`;
        explanationKm = `ប្រយោគ B ត្រឹមត្រូវព្រោះ "Neither of the teachers was..." ប្រើកិរិយាសព្ទឯកវចនៈ "was"។ ប្រយោគដទៃទៀតមានកំហុស (doesn't like, taller, went, despite without of)។ ចម្លើយត្រឹមត្រូវគឺ B។`;
        explanationEn = `Option B correctly applies singular agreement with "Neither of the teachers was...". All other choices have obvious grammatical faults.`;
      }
    }

    result.push({
      id: `${lessonId}-q${qNum}`,
      lessonId,
      subject,
      grade,
      questionNumber: qNum,
      difficulty,
      questionKm,
      questionEn,
      optionsKm,
      optionsEn,
      correctAnswer,
      hintKm,
      hintEn,
      explanationKm,
      explanationEn,
    });
  }

  return result;
}

// Storage key for teacher-customized curriculum MCQs
const STORAGE_KEY_CUSTOM_MCQS = 'moeys_custom_curriculum_mcqs_v2';

export function getCustomMcqsRecord(): Record<string, CurriculumMcq> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_MCQS);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

// Generate all 10 MCQs for all MoEYS lessons, merged with teacher edits
export function getCurriculumMcqsForLesson(lessonId: string): CurriculumMcq[] {
  const lesson = getAllLessons().find((l) => l.id === lessonId);
  if (!lesson) return [];
  const baseMcqs = generate10McqsForLesson(lesson);
  const customOverrides = getCustomMcqsRecord();

  return baseMcqs.map((base) => {
    const customKey = `${lessonId}-${base.questionNumber}`;
    if (customOverrides[customKey]) {
      return {
        ...base,
        ...customOverrides[customKey],
      };
    }
    return base;
  });
}

// Save or edit a single curriculum MCQ
export async function updateCurriculumMcqInStore(
  updatedMcq: CurriculumMcq
): Promise<CurriculumMcq> {
  if (typeof window !== 'undefined') {
    try {
      const customs = getCustomMcqsRecord();
      const customKey = `${updatedMcq.lessonId}-${updatedMcq.questionNumber}`;
      customs[customKey] = updatedMcq;
      localStorage.setItem(STORAGE_KEY_CUSTOM_MCQS, JSON.stringify(customs));
    } catch (err) {
      console.error('Failed to save customized MCQ to localStorage:', err);
    }
  }

  // Attempt Supabase sync if client is available
  try {
    const { isSupabaseConfigured, supabase } = await import('./supabase');
    if (isSupabaseConfigured && supabase) {
      await supabase.from('curriculum_mcqs').upsert(
        {
          lesson_id: updatedMcq.lessonId,
          subject: updatedMcq.subject,
          grade: updatedMcq.grade,
          question_number: updatedMcq.questionNumber,
          difficulty: updatedMcq.difficulty,
          question_km: updatedMcq.questionKm,
          question_en: updatedMcq.questionEn,
          options_km: updatedMcq.optionsKm,
          options_en: updatedMcq.optionsEn,
          correct_answer: updatedMcq.correctAnswer,
          hint_km: updatedMcq.hintKm,
          hint_en: updatedMcq.hintEn,
          explanation_km: updatedMcq.explanationKm,
          explanation_en: updatedMcq.explanationEn,
        },
        { onConflict: 'lesson_id,question_number' }
      );
    }
  } catch {
    // Graceful fallback to local storage
  }

  return updatedMcq;
}

// Check if a question has been customized by staff
export function isCurriculumMcqCustomized(lessonId: string, questionNumber: number): boolean {
  const customs = getCustomMcqsRecord();
  const customKey = `${lessonId}-${questionNumber}`;
  return !!customs[customKey];
}

// Reset an edited question back to default MoEYS template
export async function resetCurriculumMcqInStore(lessonId: string, questionNumber: number): Promise<void> {
  if (typeof window !== 'undefined') {
    try {
      const customs = getCustomMcqsRecord();
      const customKey = `${lessonId}-${questionNumber}`;
      delete customs[customKey];
      localStorage.setItem(STORAGE_KEY_CUSTOM_MCQS, JSON.stringify(customs));
    } catch (err) {
      console.error('Failed to reset MCQ in localStorage:', err);
    }
  }

  // Attempt Supabase deletion if configured
  try {
    const { isSupabaseConfigured, supabase } = await import('./supabase');
    if (isSupabaseConfigured && supabase) {
      await supabase
        .from('curriculum_mcqs')
        .delete()
        .eq('lesson_id', lessonId)
        .eq('question_number', questionNumber);
    }
  } catch {
    // Graceful fallback
  }
}

// Delete / Clear a curriculum MCQ from store
export async function deleteCurriculumMcqInStore(lessonId: string, questionNumber: number): Promise<void> {
  await resetCurriculumMcqInStore(lessonId, questionNumber);
}

// Reset all 10 MCQs for a lesson back to MoEYS default template
export async function resetAllCurriculumMcqsForLesson(lessonId: string): Promise<void> {
  if (typeof window !== 'undefined') {
    try {
      const customs = getCustomMcqsRecord();
      for (let q = 1; q <= 10; q++) {
        delete customs[`${lessonId}-${q}`];
      }
      localStorage.setItem(STORAGE_KEY_CUSTOM_MCQS, JSON.stringify(customs));
    } catch (err) {
      console.error('Failed to reset all MCQs for lesson:', err);
    }
  }

  // Attempt Supabase deletion if configured
  try {
    const { isSupabaseConfigured, supabase } = await import('./supabase');
    if (isSupabaseConfigured && supabase) {
      await supabase.from('curriculum_mcqs').delete().eq('lesson_id', lessonId);
    }
  } catch {
    // Graceful fallback
  }
}

