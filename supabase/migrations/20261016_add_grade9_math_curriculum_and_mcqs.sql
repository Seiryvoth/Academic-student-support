-- ====================================================================
-- MIGRATION: GRADE 9 MATHEMATICS 18 CURRICULUM LESSONS & MCQ SEEDING
-- ====================================================================

-- 1. Ensure question_image_url column exists in public.mcqs and public.curriculum_mcqs
ALTER TABLE public.mcqs 
ADD COLUMN IF NOT EXISTS question_image_url TEXT;

ALTER TABLE public.curriculum_mcqs 
ADD COLUMN IF NOT EXISTS question_image_url TEXT;

-- 2. Clean and Insert Exact 18 Grade 9 Mathematics Lessons (Without "មេរៀនទីX" prefixes)
INSERT INTO public.lessons (id, subject, grade, order_index, title_km, title_en, description_km, description_en)
VALUES
    ('math-g9-1', 'math', 9, 1, 
     'ចំនួនអសនិទាន', 
     'Irrational Numbers',
     'និយមន័យចំនួនអសនិទាន ទសភាគមិនខួបមិនចេះចប់ ការប្រៀបធៀប និងប្រតិបត្តិការលើរ៉ាឌីកាល់',
     'Definition of irrational numbers, non-terminating non-recurring decimals, comparison, and radical operations.'),
    ('math-g9-2', 'math', 9, 2, 
     'សមាមាត្រ', 
     'Proportions',
     'ផលធៀប សមាមាត្រផ្ទាល់ សមាមាត្រច្រាស លក្ខណៈនៃសមាមាត្រ និងការដោះស្រាយចំណោទអនុវត្ត',
     'Ratios, direct and inverse proportions, properties of proportions, and practical problem solving.'),
    ('math-g9-3', 'math', 9, 3, 
     'កន្សោមពីជគណិត', 
     'Algebraic Expressions',
     'ឯកធា ពហុធា ផលបូក ផលដក ផលគុណ ផលចែកពហុធា រូបមន្តស្មើភាព និងការដាក់ជាផលគុណកត្តា',
     'Monomials, polynomials, polynomial arithmetic, special product identities, and factorization techniques.'),
    ('math-g9-4', 'math', 9, 4, 
     'សមីការដឺក្រេទី ១ មានមួយអញ្ញាត', 
     'First-Degree Linear Equations in One Variable',
     'វិធានដោះស្រាយសមីការដឺក្រេទី១ មានមួយអញ្ញាត សមីការមានរាងប្រភាគ និងការបង្កើតសមីការដោះស្រាយចំណោទ',
     'Solving first-degree linear equations in one variable, fractional linear equations, and word problem modeling.'),
    ('math-g9-5', 'math', 9, 5, 
     'វិសមីការដឺក្រេទី ១ មានមួយអញ្ញាត', 
     'First-Degree Linear Inequalities in One Variable',
     'លក្ខណៈវិសមភាព ការដោះស្រាយវិសមីការដឺក្រេទី១ មានមួយអញ្ញាត និងការបកស្រាយសំណុំចម្លើយលើបន្ទាត់ចំនួន',
     'Inequality properties, solving single-variable linear inequalities, and representing solution sets on a number line.'),
    ('math-g9-6', 'math', 9, 6, 
     'បំណែងចែកប្រេកង់', 
     'Frequency Distribution',
     'ការប្រមូល និងរៀបចំទិន្នន័យ តារាងបំណែងចែកប្រេកង់ ថ្នាក់ទិន្នន័យ ប្រេកង់កើន និងអ៊ីស្តូក្រាម',
     'Data organization, frequency distribution tables, class intervals, cumulative frequency, and histograms.'),
    ('math-g9-7', 'math', 9, 7, 
     'មធ្យមស្ថិតិ', 
     'Statistical Mean',
     'ការគណនាមធ្យមនព្វន្តសម្រាប់ទិន្នន័យទោល និងទិន្នន័យជាថ្នាក់ មធ្យមទម្ងន់ និងការបកស្រាយទិន្នន័យ',
     'Calculating arithmetic mean for ungrouped and grouped data, weighted mean, and statistical data interpretation.'),
    ('math-g9-8', 'math', 9, 8, 
     'ប្រូបាប', 
     'Probability',
     'ពិសោធន៍ចៃដន្យ លំហសំណាក ព្រឹត្តិការណ៍ រូបមន្តប្រូបាប P(A) = n(A)/n(S) និងប្រូបាបនៃព្រឹត្តិការណ៍ផ្ទុយ',
     'Random experiments, sample spaces, events, theoretical probability formula P(A) = n(A)/n(S), and complementary events.'),
    ('math-g9-9', 'math', 9, 9, 
     'ចម្ងាយរវាងពីរចំណុច', 
     'Distance Between Two Points',
     'ប្លង់កូអរដោនេដេកាត រូបមន្តចម្ងាយរវាងពីរចំណុច d = √((x₂ - x₁)² + (y₂ - y₁)²) និងចំណុចកណ្តាលនៃអង្កត់',
     'Cartesian plane coordinates, distance formula d = √((x₂ - x₁)² + (y₂ - y₁)²), and segment midpoint coordinates.'),
    ('math-g9-10', 'math', 9, 10, 
     'សមីការនៃបន្ទាត់', 
     'Equation of a Line',
     'ទម្រង់ទូទៅ និងទម្រង់ជម្រាល y = mx + b មេគុណប្រាប់ទិស (Slope) លក្ខខណ្ឌបន្ទាត់ស្រប និងកែងគ្នា',
     'General and slope-intercept forms y = mx + b, calculating slope m, parallel line condition (m₁ = m₂) and perpendicular line condition (m₁ · m₂ = -1).'),
    ('math-g9-11', 'math', 9, 11, 
     'ប្រព័ន្ធសមីការដឺក្រេទី ១ មានពីរអញ្ញាត', 
     'Systems of Linear Equations in Two Variables',
     'វិធីជំនួស វិធីបូកបំបាត់ វិធីក្រាហ្វិក និងការដោះស្រាយចំណោទដោយប្រើប្រព័ន្ធសមីការ',
     'Substitution method, elimination method, graphical intersection method, and solving real-world word problems.'),
    ('math-g9-12', 'math', 9, 12, 
     'ទ្រឹស្តីបទពីតាគ័រ', 
     'Pythagorean Theorem',
     'សេចក្តីថ្លែងទ្រឹស្តីបទពីតាគ័រ c² = a² + b² ទ្រឹស្តីបទច្រាស និងការអនុវត្តគណនាប្រវែងជ្រុងត្រីកោណកែង',
     'Pythagorean theorem c² = a² + b², converse of Pythagoras, and practical length calculations in right triangles.'),
    ('math-g9-13', 'math', 9, 13, 
     'រង្វង់និងបន្ទាត់', 
     'Circles and Lines',
     'ទីតាំងធៀបរវាងរង្វង់និងបន្ទាត់ (បន្ទាត់កាត់ បន្ទាត់ប៉ះ បន្ទាត់ក្រៅ) លក្ខណៈបន្ទាត់ប៉ះ និងអង្កត់ធ្នូ',
     'Relative positions of a line and a circle (secant, tangent, external line), tangent radius perpendicularity, and chord properties.'),
    ('math-g9-14', 'math', 9, 14, 
     'លក្ខណៈមុំនៃរង្វង់', 
     'Angle Properties of Circles',
     'មុំផ្ចិត មុំចារឹកក្នុងរង្វង់ មុំក្នុងកន្លះរង្វង់ និងចតុកោណចារឹកក្នុងរង្វង់ (ផលបូកមុំឈម ១៨០ ដឺក្រេ)',
     'Central angles, inscribed angles, angle subtended by a diameter (90° in semicircle), and cyclic quadrilateral angle properties.'),
    ('math-g9-15', 'math', 9, 15, 
     'ទ្រឹស្តីបទតាលែស', 
     "Thales's Theorem",
     'ទ្រឹស្តីបទតាលែសក្នុងត្រីកោណ បន្ទាត់ស្របកាត់ជ្រុងទាំងពីរ ទ្រឹស្តីបទច្រាស និងអនុវត្តគណនាប្រវែង',
     "Thales's intercept theorem in triangles, parallel line proportional segments AD/DB = AE/EC, converse, and length calculations."),
    ('math-g9-16', 'math', 9, 16, 
     'ត្រីកោណដូចគ្នា', 
     'Similar Triangles',
     'និយមន័យ លក្ខខណ្ឌសម្គាល់ត្រីកោណដូចគ្នា (AA, SAS, SSS) ផលធៀបភាពដូចគ្នា និងផលធៀបផ្ទៃក្រឡា k²',
     'Definition, criteria for triangle similarity (AA, SAS, SSS), similarity scale factor k, and area ratio k².'),
    ('math-g9-17', 'math', 9, 17, 
     'ពហុកោណ', 
     'Polygons',
     'និយមន័យពហុកោណ ផលបូកមុំក្នុង (n - 2) × 180° ផលបូកមុំក្រៅ 360° និងលក្ខណៈពហុកោណនិយ័ត',
     'Polygon classification, sum of interior angles (n - 2) × 180°, sum of exterior angles 360°, and regular polygon calculations.'),
    ('math-g9-18', 'math', 9, 18, 
     'សូលីត', 
     'Solids',
     'ផ្ទៃក្រឡា និងមាឌនៃកោណ ពីរ៉ាមីត ព្រីស និងស្វ៊ែរ ព្រមទាំងការអនុវត្តគណនាជាក់ស្តែង',
     'Surface area and volume formulas for right circular cones, pyramids, prisms, and spheres, with practical applications.')
ON CONFLICT (id) DO UPDATE SET
    order_index = EXCLUDED.order_index,
    title_km = EXCLUDED.title_km,
    title_en = EXCLUDED.title_en,
    description_km = EXCLUDED.description_km,
    description_en = EXCLUDED.description_en;

-- 3. Delete any orphaned or outdated Grade 9 math placeholder lessons if present
DELETE FROM public.lessons
WHERE subject = 'math' AND grade = 9 AND id NOT IN (
    'math-g9-1', 'math-g9-2', 'math-g9-3', 'math-g9-4', 'math-g9-5', 'math-g9-6',
    'math-g9-7', 'math-g9-8', 'math-g9-9', 'math-g9-10', 'math-g9-11', 'math-g9-12',
    'math-g9-13', 'math-g9-14', 'math-g9-15', 'math-g9-16', 'math-g9-17', 'math-g9-18'
);
