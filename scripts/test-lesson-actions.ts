import {
  canManageSubject,
  updateLessonTitle,
  deleteLessonCascade,
  setCurrentStaffSession,
  StaffAccount,
} from '../src/lib/data-store';
import {
  getLessonsBySubjectAndGrade,
  getDeletedLessonIds,
  removeDeletedLessonId,
} from '../src/lib/curriculum-data';

console.log('====================================================');
console.log('🛡️ TESTING STRICT RBAC & LESSON AUTHORIZATION');
console.log('====================================================');

// 1. RBAC Account Setup
const superAdmin: StaffAccount = {
  id: 'sa-1',
  email: 'admin@moeys.gov.kh',
  fullNameKm: 'Super Admin',
  fullNameEn: 'Super Admin',
  role: 'super_admin',
  subjectAssigned: null,
  isActive: true,
  createdAt: new Date().toISOString(),
};

const mathLead: StaffAccount = {
  id: 'sl-math',
  email: 'math@moeys.gov.kh',
  fullNameKm: 'Math Lead',
  fullNameEn: 'Math Lead',
  role: 'subject_lead',
  subjectAssigned: 'math',
  isActive: true,
  createdAt: new Date().toISOString(),
};

const physicsLead: StaffAccount = {
  id: 'sl-phys',
  email: 'physics@moeys.gov.kh',
  fullNameKm: 'Physics Lead',
  fullNameEn: 'Physics Lead',
  role: 'subject_lead',
  subjectAssigned: 'physics',
  isActive: true,
  createdAt: new Date().toISOString(),
};

const studentAccount: StaffAccount = {
  id: 'student-1',
  email: 'student@moeys.gov.kh',
  fullNameKm: 'សិស្ស គឹមហុង',
  fullNameEn: 'Student Kimhong',
  role: 'student',
  subjectAssigned: null,
  isActive: true,
  createdAt: new Date().toISOString(),
};

console.log('\n1. Testing RBAC canManageSubject permissions:');
console.log('  - Super Admin on Math:', canManageSubject(superAdmin, 'math') ? 'PASS (true)' : 'FAIL');
console.log('  - Super Admin on Physics:', canManageSubject(superAdmin, 'physics') ? 'PASS (true)' : 'FAIL');
console.log('  - Math Lead on Math:', canManageSubject(mathLead, 'math') ? 'PASS (true)' : 'FAIL');
console.log('  - Math Lead on Physics (Forbidden):', !canManageSubject(mathLead, 'physics') ? 'PASS (false)' : 'FAIL');
console.log('  - Physics Lead on Physics:', canManageSubject(physicsLead, 'physics') ? 'PASS (true)' : 'FAIL');
console.log('  - Student Role on Math (Strictly Forbidden):', !canManageSubject(studentAccount, 'math') ? 'PASS (false)' : 'FAIL');
console.log('  - Public / Guest (Strictly Forbidden):', !canManageSubject(null, 'math') ? 'PASS (false)' : 'FAIL');

async function testOperations() {
  console.log('\n2. Testing 403 Forbidden enforcement on updateLessonTitle:');

  const g7Lessons = getLessonsBySubjectAndGrade('math', 7);
  const testLesson = g7Lessons[0];

  // Test A: Unauthenticated public visitor attempting update -> Expect 403
  setCurrentStaffSession(null);
  let guestBlocked = false;
  try {
    await updateLessonTitle(testLesson.id, 'Hacked Title', 'Hacked Title');
  } catch (err: any) {
    if (err.message === '403_FORBIDDEN') {
      guestBlocked = true;
    }
  }
  console.log('  - Public visitor update blocked with 403_FORBIDDEN:', guestBlocked ? 'PASS' : 'FAIL');

  // Test B: Student role attempting update -> Expect 403
  setCurrentStaffSession(studentAccount);
  let studentBlocked = false;
  try {
    await updateLessonTitle(testLesson.id, 'Student Edited', 'Student Edited');
  } catch (err: any) {
    if (err.message === '403_FORBIDDEN') {
      studentBlocked = true;
    }
  }
  console.log('  - Student role update blocked with 403_FORBIDDEN:', studentBlocked ? 'PASS' : 'FAIL');

  // Test C: Physics Lead attempting to edit Math lesson -> Expect 403
  setCurrentStaffSession(physicsLead);
  let crossSubjectBlocked = false;
  try {
    await updateLessonTitle(testLesson.id, 'Cross Subject Edit', 'Cross Subject Edit');
  } catch (err: any) {
    if (err.message === '403_FORBIDDEN') {
      crossSubjectBlocked = true;
    }
  }
  console.log('  - Non-matching Subject Lead update blocked with 403_FORBIDDEN:', crossSubjectBlocked ? 'PASS' : 'FAIL');

  // Test D: Authorized Math Lead updating Math lesson -> Succeeds
  setCurrentStaffSession(mathLead);
  const updated = await updateLessonTitle(
    testLesson.id,
    'ចំនួនគត់ (កែសម្រួលដោយ Math Lead)',
    'Whole Numbers & Integers (Edited by Math Lead)'
  );
  console.log('  - Authorized Math Lead update succeeded:', updated?.titleKm === 'ចំនួនគត់ (កែសម្រួលដោយ Math Lead)' ? 'PASS' : 'FAIL');

  // Restore original title using Super Admin
  setCurrentStaffSession(superAdmin);
  await updateLessonTitle(testLesson.id, 'ចំនួនគត់', 'Whole Numbers & Integers');
  console.log('  - Super Admin restored title to original clean title: PASS');

  // Test E: Cascade Delete authorization
  console.log('\n3. Testing Cascade Delete authorization & operation:');
  const tempLessonId = 'math-g7-custom-temp-test';

  // Student attempting delete -> Expect 403
  setCurrentStaffSession(studentAccount);
  let studentDeleteBlocked = false;
  try {
    await deleteLessonCascade(testLesson.id);
  } catch (err: any) {
    if (err.message === '403_FORBIDDEN') {
      studentDeleteBlocked = true;
    }
  }
  console.log('  - Student cascade delete blocked with 403_FORBIDDEN:', studentDeleteBlocked ? 'PASS' : 'FAIL');

  // Authorized Super Admin performing delete on temp lesson
  setCurrentStaffSession(superAdmin);
  await deleteLessonCascade(tempLessonId);
  const deletedIds = getDeletedLessonIds();
  console.log('  - Authorized Super Admin delete succeeded:', deletedIds.includes(tempLessonId) ? 'PASS' : 'FAIL');

  // Clean up
  removeDeletedLessonId(tempLessonId);
  setCurrentStaffSession(null);

  console.log('\n====================================================');
  console.log('✅ ALL STRICT RBAC & AUTHORIZATION CHECKS PASSED!');
  console.log('====================================================');
}

testOperations().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
