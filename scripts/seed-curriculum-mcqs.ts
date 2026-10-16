/**
 * Automated MoEYS Curriculum & 10-MCQ Seeding Script
 * Run with: npx tsx scripts/seed-curriculum-mcqs.ts
 * Aligned with Cambodian MoEYS Grades 7 to 12 across all 5 subjects.
 */

import { createClient } from '@supabase/supabase-js';
import { getAllLessons } from '../src/lib/curriculum-data';
import { generate10McqsForLesson } from '../src/lib/curriculum-mcqs-generator';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

async function runSeeder() {
  console.log('====================================================');
  console.log('🇰🇭 CAMBODIAN MoEYS CURRICULUM & MCQ SEEDER STARTING');
  console.log('====================================================');

  const allLessons = getAllLessons();
  console.log(`Total MoEYS Lessons found across Grades 7-12: ${allLessons.length}`);

  let totalMcqsGenerated = 0;
  for (const lesson of allLessons) {
    const mcqs = generate10McqsForLesson(lesson);
    totalMcqsGenerated += mcqs.length;
  }
  console.log(`Total Standard Curriculum MCQs generated: ${totalMcqsGenerated} (10 per lesson)`);

  if (!supabaseUrl || !supabaseKey) {
    console.log('\n⚠️ Supabase credentials not found in environment.');
    console.log('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to seed remote Supabase.');
    console.log('✅ Local mock data engine is ready with all 100% seeded lessons and MCQs out-of-the-box!\n');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  console.log(`\nConnecting to Supabase at: ${supabaseUrl}`);

  // 1. Seed Lessons
  console.log('Seeding lessons table...');
  const lessonRows = allLessons.map((l) => ({
    id: l.id,
    subject: l.subject,
    grade: l.grade,
    order_index: l.orderIndex,
    title_km: l.titleKm,
    title_en: l.titleEn,
    description_km: l.descriptionKm,
    description_en: l.descriptionEn,
  }));

  const { error: lessonError } = await supabase
    .from('lessons')
    .upsert(lessonRows, { onConflict: 'id' });

  if (lessonError) {
    console.error('Error inserting lessons:', lessonError.message);
  } else {
    console.log(`✓ Successfully seeded ${lessonRows.length} lessons.`);
  }

  // 2. Seed Curriculum MCQs in batches of 50
  console.log('Seeding curriculum_mcqs table in batches...');
  const mcqRows = [];
  for (const lesson of allLessons) {
    const mcqs = generate10McqsForLesson(lesson);
    for (const q of mcqs) {
      mcqRows.push({
        lesson_id: q.lessonId,
        subject: q.subject,
        grade: q.grade,
        question_number: q.questionNumber,
        difficulty: q.difficulty,
        question_km: q.questionKm,
        question_en: q.questionEn,
        options_km: q.optionsKm,
        options_en: q.optionsEn,
        correct_answer: q.correctAnswer,
        hint_km: q.hintKm,
        hint_en: q.hintEn,
        explanation_km: q.explanationKm,
        explanation_en: q.explanationEn,
        question_image_url: q.questionImageUrl || null,
      });
    }
  }

  const batchSize = 50;
  let inserted = 0;
  for (let i = 0; i < mcqRows.length; i += batchSize) {
    const batch = mcqRows.slice(i, i + batchSize);
    const { error: mcqError } = await supabase
      .from('curriculum_mcqs')
      .upsert(batch, { onConflict: 'lesson_id,question_number' });

    if (mcqError) {
      console.error(`Error in batch ${i / batchSize + 1}:`, mcqError.message);
    } else {
      inserted += batch.length;
      process.stdout.write(`\rProgress: ${inserted} / ${mcqRows.length} MCQs uploaded.`);
    }
  }

  console.log('\n\n🎉 Seeding complete! All MoEYS curriculum lessons and 10-MCQs are ready.');
}

runSeeder().catch((err) => {
  console.error('Seeder failed:', err);
});
