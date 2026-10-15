'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'km' | 'en';

export interface Translations {
  appName: string;
  appSubtitle: string;
  home: string;
  videoLessons: string;
  practiceMcq: string;
  staffLogin: string;
  dashboard: string;
  logout: string;
  selectSubject: string;
  selectGrade: string;
  selectLesson: string;
  grade: string;
  gradeLevel: string;
  allSubjects: string;
  allGrades: string;
  lessons: string;
  searchLessons: string;
  practiceNow: string;
  watchVideo: string;
  downloadHandout: string;
  previewHandout: string;
  hint: string;
  hideHint: string;
  shortAnswer: string;
  hideShortAnswer: string;
  nextQuestion: string;
  previousQuestion: string;
  finishQuiz: string;
  retryQuiz: string;
  score: string;
  question: string;
  of: string;
  correct: string;
  incorrect: string;
  explanation: string;
  difficulty: string;
  basic: string;
  medium: string;
  advanced: string;
  videoComprehensionQuiz: string;
  videoQuizSubtitle: string;
  noVideoQuizYet: string;
  standardPracticeQuiz: string;
  standardPracticeSubtitle: string;
  readyToStart: string;
  startQuiz: string;
  installAppTitle: string;
  installAppDesc: string;
  installBtn: string;
  dismiss: string;
  superAdmin: string;
  subjectLead: string;
  addVideoLesson: string;
  editVideoLesson: string;
  manageStaff: string;
  role: string;
  assignedSubject: string;
  status: string;
  active: string;
  inactive: string;
  saveChanges: string;
  publishResource: string;
  youtubeUrl: string;
  gdrivePdfUrl: string;
  titleKhmer: string;
  titleEnglish: string;
  descKhmer: string;
  descEnglish: string;
  addQuestion: string;
  removeQuestion: string;
  correctAnswer: string;
  options: string;
  heroBadge: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  exploreVideosBtn: string;
  practiceMcqBtn: string;
  statGrades: string;
  statLessons: string;
  statMcqs: string;
  statAccess: string;
  statAccessSub: string;
  footerRights: string;
  curriculumAligned: string;
  freeStudentAccess: string;
  moeysOfficial: string;
  allTenQuestionsCompleted: string;
  excellentScore: string;
  goodScore: string;
  needReviewScore: string;
  backToLessons: string;
  manageEditContent: string;
  manageEditDesc: string;
  uploadedResources: string;
  standardCurriculumMcqs: string;
  editResource: string;
  editCurriculumMcq: string;
  deleteResource: string;
  confirmDeleteTitle: string;
  confirmDeleteDesc: string;
  updatedSuccessfully: string;
  deletedSuccessfully: string;
  noResourcesForLesson: string;
  cancel: string;
  delete: string;
  edit: string;
  // Q&A / Public Comments
  qaSectionTitle: string;
  qaSubtitle: string;
  guestName: string;
  guestNamePlaceholder: string;
  commentPlaceholder: string;
  postComment: string;
  posting: string;
  reply: string;
  cancelReply: string;
  replyingTo: string;
  teacherBadge: string;
  studentBadge: string;
  noCommentsYet: string;
  beTheFirstComment: string;
  commentsCount: string;
  postingAsStaff: string;
  deleteComment: string;
  confirmDeleteComment: string;
  pleaseEnterName: string;
  pleaseEnterContent: string;
  // Notifications & Activity Log
  recentActivity: string;
  activityLog: string;
  activityLogSubtitle: string;
  liveUpdatesBanner: string;
  studentQaManagement: string;
  qaManagementDesc: string;
  allQuestions: string;
  pendingReply: string;
  answered: string;
  sendReply: string;
  replySentSuccess: string;
  viewInLesson: string;
  justNow: string;
  minutesAgo: string;
  hoursAgo: string;
  daysAgo: string;
  actionUploadVideo: string;
  actionEditVideo: string;
  actionDeleteVideo: string;
  actionEditMcq: string;
  actionCommentReply: string;
  actionCommentPost: string;
  allActions: string;
}

const TRANSLATIONS: Record<Language, Translations> = {
  km: {
    appName: 'ថ្នាលអប់រំ និងគាំទ្រការសិក្សា',
    appSubtitle: 'កម្មវិធីសិក្សាតាមស្តង់ដារ ក្រសួងអប់រំ យុវជន និងកីឡា (ថ្នាក់ទី៧ ដល់ ទី១២)',
    home: 'ទំព័រដើម',
    videoLessons: 'មេរៀនវីដេអូ',
    practiceMcq: 'លំហាត់ MCQ',
    staffLogin: 'ចូលប្រព័ន្ធគ្រូ',
    dashboard: 'ផ្ទាំងគ្រប់គ្រងគ្រូ',
    logout: 'ចាកចេញ',
    selectSubject: 'ជ្រើសរើសមុខវិជ្ជា',
    selectGrade: 'ជ្រើសរើសកម្រិតថ្នាក់',
    selectLesson: 'ជ្រើសរើសមេរៀន',
    grade: 'ថ្នាក់ទី',
    gradeLevel: 'កម្រិតថ្នាក់',
    allSubjects: 'គ្រប់មុខវិជ្ជា',
    allGrades: 'គ្រប់កម្រិតថ្នាក់',
    lessons: 'មេរៀន',
    searchLessons: 'ស្វែងរកមេរៀន...',
    practiceNow: 'អនុវត្តលំហាត់',
    watchVideo: 'ទស្សនាវីដេអូ',
    downloadHandout: 'ទាញយកឯកសារ PDF',
    previewHandout: 'មើលឯកសារ PDF',
    hint: '💡 ជំនួយស្មារតី',
    hideHint: '💡 លាក់ជំនួយ',
    shortAnswer: '📖 ការពន្យល់សង្ខេប',
    hideShortAnswer: '📖 លាក់ការពន្យល់',
    nextQuestion: 'សំណួរបន្ទាប់',
    previousQuestion: 'សំណួរមុន',
    finishQuiz: 'បញ្ចប់លំហាត់',
    retryQuiz: 'ធ្វើម្តងទៀត',
    score: 'ពិន្ទុរបស់អ្នក',
    question: 'សំណួរទី',
    of: 'នៃ',
    correct: 'ត្រឹមត្រូវណាស់!',
    incorrect: 'មិនទាន់ត្រឹមត្រូវទេ',
    explanation: 'ការពន្យល់លម្អិត',
    difficulty: 'កម្រិត',
    basic: 'មូលដ្ឋាន',
    medium: 'មធ្យម',
    advanced: 'កម្រិតខ្ពស់',
    videoComprehensionQuiz: 'លំហាត់ស្ទង់ការយល់ដឹងពីវីដេអូ',
    videoQuizSubtitle: 'ឆ្លើយសំណួរខាងក្រោមភ្លាមៗ បន្ទាប់ពីទស្សនាវីដេអូរួច ដើម្បីវាស់កម្រិតយល់ដឹង',
    noVideoQuizYet: 'មិនទាន់មានសំណួរ MCQ ភ្ជាប់ជាមួយវីដេអូនេះនៅឡើយទេ',
    standardPracticeQuiz: 'កម្រងលំហាត់ស្តង់ដារកម្មវិធីសិក្សា (១០ សំណួរ)',
    standardPracticeSubtitle: 'រៀបចំតាមកម្រិតលំបាក៖ មូលដ្ឋាន ៣, មធ្យម ៤, និងកម្រិតខ្ពស់ ៣ សំណួរ',
    readyToStart: 'ត្រៀមខ្លួនរួចរាល់ហើយឬនៅ?',
    startQuiz: 'ចាប់ផ្តើមធ្វើលំហាត់',
    installAppTitle: 'ដំឡើងកម្មវិធីលើទូរស័ព្ទដៃ',
    installAppDesc: 'ដំឡើងកម្មវិធីលើអេក្រង់ដើមទូរស័ព្ទ (Android & iOS) ដើម្បីចូលរៀនបានលឿន និងងាយស្រួល!',
    installBtn: 'ដំឡើងឥឡូវនេះ',
    dismiss: 'ពេលក្រោយ',
    superAdmin: 'អ្នកគ្រប់គ្រងប្រព័ន្ធជាន់ខ្ពស់ (Super Admin)',
    subjectLead: 'ប្រធានដេប៉ាតឺម៉ង់មុខវិជ្ជា (Subject Lead)',
    addVideoLesson: 'បន្ថែមមេរៀនវីដេអូថ្មី',
    editVideoLesson: 'កែសម្រួលមេរៀន',
    manageStaff: 'គ្រប់គ្រងគណនីគ្រូ',
    role: 'តួនាទី',
    assignedSubject: 'មុខវិជ្ជាទទួលខុសត្រូវ',
    status: 'ស្ថានភាព',
    active: 'សកម្ម',
    inactive: 'អសកម្ម',
    saveChanges: 'រក្សាទុកការកែប្រែ',
    publishResource: 'ផ្សាយមេរៀន',
    youtubeUrl: 'តំណភ្ជាប់ YouTube (Unlisted ឬ Public)',
    gdrivePdfUrl: 'តំណភ្ជាប់ Google Drive PDF (ឬតំណភ្ជាប់ PDF ផ្សេងៗ)',
    titleKhmer: 'ចំណងជើងជាភាសាខ្មែរ',
    titleEnglish: 'ចំណងជើងជាភាសាអង់គ្លេស',
    descKhmer: 'សេចក្តីពិពណ៌នាជាភាសាខ្មែរ',
    descEnglish: 'សេចក្តីពិពណ៌នាជាភាសាអង់គ្លេស',
    addQuestion: '+ បន្ថែមសំណួរ',
    removeQuestion: 'លុបសំណួរ',
    correctAnswer: 'ចម្លើយត្រឹមត្រូវ',
    options: 'ជម្រើសចម្លើយទាំង ៥ (A, B, C, D, E)',
    heroBadge: '✨ កម្មវិធីសិក្សាផ្លូវការក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)',
    heroTitle: 'ពង្រឹងចំណេះដឹង និងត្រៀមប្រឡង',
    heroHighlight: 'ថ្នាក់ទី៧ ដល់ ទី១២ ដោយឥតគិតថ្លៃ',
    heroSubtitle: 'រៀនជាមួយមេរៀនវីដេអូ ទាញយកឯកសារជំនួយស្មារតី និងអនុវត្តលំហាត់ពហុជ្រើសរើស (MCQ) គ្រប់មុខវិជ្ជាវិទ្យាសាស្ត្រ និងភាសា ដោយមិនបាច់ចុះឈ្មោះចូលប្រព័ន្ធ!',
    exploreVideosBtn: '🎬 មើលមេរៀនវីដេអូ',
    practiceMcqBtn: '📝 អនុវត្តលំហាត់ MCQ',
    statGrades: 'កម្រិតថ្នាក់ (៧-១២)',
    statLessons: 'មេរៀនស្តង់ដារ',
    statMcqs: 'លំហាត់ MCQ',
    statAccess: 'សិស្សប្រើប្រាស់',
    statAccessSub: 'សេរី ១០០% គ្មានលក្ខខណ្ឌ',
    footerRights: 'រក្សាសិទ្ធិគ្រប់យ៉ាង © ២០២៦ - ថ្នាលគាំទ្រការសិក្សាសិស្សានុសិស្សកម្ពុជា',
    curriculumAligned: 'ស្របតាមកម្មវិធីសិក្សាស្នូលជាតិ',
    freeStudentAccess: 'សិស្សមិនចាំបាច់មានគណនី ឬចូលប្រព័ន្ធទេ',
    moeysOfficial: 'ក្រសួងអប់រំ យុវជន និងកីឡា',
    allTenQuestionsCompleted: 'អ្នកបានឆ្លើយចប់សំណួរទាំង ១០ រួចរាល់ហើយ!',
    excellentScore: '🎉 ពូកែណាស់! អ្នកយល់ដឹងមេរៀននេះបានយ៉ាងច្បាស់លាស់។',
    goodScore: '👍 ល្អគួរសម! អានការពន្យល់បន្ថែមដើម្បីពង្រឹងចំណុចខ្វះខាត។',
    needReviewScore: '💪 កុំបាក់ទឹកចិត្ត! ទស្សនាវីដេអូឡើងវិញ ហើយព្យាយាមម្តងទៀត។',
    backToLessons: 'ត្រឡប់ទៅបញ្ជីមេរៀន',
    manageEditContent: 'គ្រប់គ្រង និងកែសម្រួលមាតិកា',
    manageEditDesc: 'កែសម្រួល ឬលុបមេរៀនវីដេអូ ឯកសារ PDF សំណួរ MCQ វីដេអូ និងកែសម្រួលសំណួរទាំង ១០ នៃកម្មវិធីសិក្សា',
    uploadedResources: 'មេរៀនវីដេអូ និងឯកសារ PDF ក្នុងមេរៀននេះ',
    standardCurriculumMcqs: 'លំហាត់ស្តង់ដារ MoEYS ទាំង ១០ ក្នុងមេរៀននេះ',
    editResource: 'កែសម្រួលមេរៀនវីដេអូ',
    editCurriculumMcq: 'កែសម្រួលលំហាត់ស្តង់ដារ',
    deleteResource: 'លុបមេរៀន',
    confirmDeleteTitle: 'បញ្ជាក់ការលុបមេរៀន',
    confirmDeleteDesc: 'តើអ្នកប្រាកដថាចង់លុបមេរៀននេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានឡើយ។',
    updatedSuccessfully: 'កែសម្រួល និងរក្សាទុកបានជោគជ័យ!',
    deletedSuccessfully: 'លុបបានជោគជ័យ!',
    noResourcesForLesson: 'មិនទាន់មានវីដេអូផ្សាយសម្រាប់មេរៀននេះនៅឡើយទេ',
    cancel: 'បោះបង់',
    delete: 'លុបចេញ',
    edit: 'កែសម្រួល',
    // Q&A / Public Comments
    qaSectionTitle: 'សំណួរ-ចម្លើយ និងមតិពិភាក្សា',
    qaSubtitle: 'សួរ ឬពិភាក្សាអំពីមេរៀននេះជាមួយលោកគ្រូ-អ្នកគ្រូ និងសិស្សានុសិស្សដទៃទៀត (មិនបាច់ចូលប្រព័ន្ធ)',
    guestName: 'ឈ្មោះរបស់អ្នក',
    guestNamePlaceholder: 'ឧ. សុខា, វណ្ណា, ឬ វិច្ឆិកា...',
    commentPlaceholder: 'សរសេរសំណួរ ឬមតិយោបល់របស់អ្នកនៅទីនេះ...',
    postComment: 'ផ្ញើសំណួរ / មតិ',
    posting: 'កំពុងផ្ញើ...',
    reply: 'ឆ្លើយតប',
    cancelReply: 'បោះបង់ការឆ្លើយតប',
    replyingTo: 'កំពុងឆ្លើយតបទៅកាន់',
    teacherBadge: 'គ្រូបង្រៀន',
    studentBadge: 'សិស្ស / សាធារណៈ',
    noCommentsYet: 'មិនទាន់មានសំណួរ ឬមតិនៅឡើយទេ',
    beTheFirstComment: 'ក្លាយជាអ្នកដំបូងដែលសួរសំណួរអំពីមេរៀននេះ!',
    commentsCount: 'មតិយោបល់',
    postingAsStaff: 'ឆ្លើយតបក្នុងនាមជាគ្រូបង្រៀនផ្លូវការ',
    deleteComment: 'លុបមតិ',
    confirmDeleteComment: 'តើអ្នកប្រាកដថាចង់លុបមតិនេះមែនទេ?',
    pleaseEnterName: 'សូមបញ្ចូលឈ្មោះរបស់អ្នកជាមុនសិន',
    pleaseEnterContent: 'សូមសរសេរខ្លឹមសារសំណួរ ឬមតិ',
    // Notifications & Activity Log
    recentActivity: 'សកម្មភាព និងការអាប់ដេតថ្មីៗ',
    activityLog: 'កំណត់ត្រាការអាប់ដេតមាតិកា',
    activityLogSubtitle: 'តាមដានរាល់ការបង្ហោះវីដេអូ កែសម្រួលឯកសារ និងការឆ្លើយតបរបស់គ្រូក្នុងពេលជាក់ស្តែង',
    liveUpdatesBanner: 'ការអាប់ដេតមាតិកាថ្មីចុងក្រោយ',
    studentQaManagement: 'គ្រប់គ្រងសំណួរសិស្ស (Q&A)',
    qaManagementDesc: 'មើលសំណួរដែលសិស្សបានសួរ និងឆ្លើយតបដោយផ្ទាល់ក្នុងនាមជាគ្រូបង្រៀន',
    allQuestions: 'សំណួរទាំងអស់',
    pendingReply: 'មិនទាន់ឆ្លើយតប',
    answered: 'បានឆ្លើយតបរួច',
    sendReply: 'ផ្ញើការឆ្លើយតប',
    replySentSuccess: 'បានឆ្លើយតបសំណួរជោគជ័យ!',
    viewInLesson: 'ទៅកាន់មេរៀន',
    justNow: 'អម្បាញ់មិញ',
    minutesAgo: 'នាទីមុន',
    hoursAgo: 'ម៉ោងមុន',
    daysAgo: 'ថ្ងៃមុន',
    actionUploadVideo: 'អាប់ឡូតវីដេអូថ្មី',
    actionEditVideo: 'កែសម្រួលវីដេអូ',
    actionDeleteVideo: 'លុបវីដេអូ',
    actionEditMcq: 'កែសម្រួលលំហាត់ MCQ',
    actionCommentReply: 'គ្រូឆ្លើយតបសំណួរ',
    actionCommentPost: 'សំណួរសិស្សថ្មី',
    allActions: 'គ្រប់សកម្មភាព',
  },
  en: {
    appName: 'MoEYS Academic & Student Hub',
    appSubtitle: 'Official Cambodian Curriculum Learning Platform (Grades 7 to 12)',
    home: 'Home',
    videoLessons: 'Video Lessons',
    practiceMcq: 'Practice MCQ',
    staffLogin: 'Staff Login',
    dashboard: 'Staff Dashboard',
    logout: 'Sign Out',
    selectSubject: 'Select Subject',
    selectGrade: 'Select Grade',
    selectLesson: 'Select Lesson',
    grade: 'Grade',
    gradeLevel: 'Grade Level',
    allSubjects: 'All Subjects',
    allGrades: 'All Grades',
    lessons: 'Lessons',
    searchLessons: 'Search lessons...',
    practiceNow: 'Practice Quiz',
    watchVideo: 'Watch Video',
    downloadHandout: 'Download PDF',
    previewHandout: 'Preview PDF',
    hint: '💡 Clue / Hint',
    hideHint: '💡 Hide Hint',
    shortAnswer: '📖 Short Solution',
    hideShortAnswer: '📖 Hide Solution',
    nextQuestion: 'Next Question',
    previousQuestion: 'Previous Question',
    finishQuiz: 'Finish Quiz',
    retryQuiz: 'Practice Again',
    score: 'Your Score',
    question: 'Question',
    of: 'of',
    correct: 'Correct answer!',
    incorrect: 'Incorrect choice',
    explanation: 'Step-by-Step Solution',
    difficulty: 'Level',
    basic: 'Basic',
    medium: 'Medium',
    advanced: 'Advanced',
    videoComprehensionQuiz: 'Video Comprehension Quiz',
    videoQuizSubtitle: 'Test your understanding immediately after watching the teacher explanation',
    noVideoQuizYet: 'No comprehension questions attached to this video yet.',
    standardPracticeQuiz: 'Curriculum Practice Quiz (10 MCQs)',
    standardPracticeSubtitle: 'Structured by difficulty: 3 Basic, 4 Medium, and 3 Advanced questions',
    readyToStart: 'Ready to test your mastery?',
    startQuiz: 'Start Quiz Now',
    installAppTitle: 'Install Mobile App',
    installAppDesc: 'Install on your Android or iOS home screen for instant 1-tap offline learning access!',
    installBtn: 'Install App',
    dismiss: 'Later',
    superAdmin: 'Super Administrator',
    subjectLead: 'Subject Department Lead',
    addVideoLesson: 'Add Video Lesson',
    editVideoLesson: 'Edit Lesson',
    manageStaff: 'Manage Staff Accounts',
    role: 'Role',
    assignedSubject: 'Assigned Subject',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    saveChanges: 'Save Changes',
    publishResource: 'Publish Lesson',
    youtubeUrl: 'YouTube URL (Unlisted or Public)',
    gdrivePdfUrl: 'Google Drive PDF Link (or External Link)',
    titleKhmer: 'Title in Khmer',
    titleEnglish: 'Title in English',
    descKhmer: 'Description in Khmer',
    descEnglish: 'Description in English',
    addQuestion: '+ Add Question',
    removeQuestion: 'Remove Question',
    correctAnswer: 'Correct Choice',
    options: '5 Choices (A, B, C, D, E)',
    heroBadge: '✨ Official Cambodian MoEYS Curriculum (Grades 7–12)',
    heroTitle: 'Empower Your Academic Excellence',
    heroHighlight: 'For Grades 7 to 12 — 100% Free',
    heroSubtitle: 'Engaging video lessons, downloadable PDF handouts, and interactive 5-choice MCQs with instant step-by-step solutions. No student login required!',
    exploreVideosBtn: '🎬 Explore Video Lessons',
    practiceMcqBtn: '📝 Practice 10-MCQ Quizzes',
    statGrades: 'Grades (7–12)',
    statLessons: 'Core Lessons',
    statMcqs: 'Practice MCQs',
    statAccess: 'Student Access',
    statAccessSub: '100% Open & Instant',
    footerRights: 'All Rights Reserved © 2026 - Cambodian Academic & Student Support Application',
    curriculumAligned: 'MoEYS National Standard Curriculum',
    freeStudentAccess: 'No login required for students',
    moeysOfficial: 'Ministry of Education, Youth and Sport',
    allTenQuestionsCompleted: 'You have completed all 10 questions!',
    excellentScore: '🎉 Outstanding! You have mastered this lesson thoroughly.',
    goodScore: '👍 Well done! Review the step-by-step solutions to strengthen your weak points.',
    needReviewScore: '💪 Keep practicing! Watch the video lesson again and retry.',
    backToLessons: 'Back to Lessons',
    manageEditContent: 'Manage & Edit Content',
    manageEditDesc: 'Edit or delete video lectures, PDF handouts, video MCQs, and edit the 10 standard curriculum MCQs',
    uploadedResources: 'Uploaded Video & PDF Resources for this Lesson',
    standardCurriculumMcqs: 'Standard 10 MoEYS Curriculum MCQs for this Lesson',
    editResource: 'Edit Video Resource',
    editCurriculumMcq: 'Edit Curriculum MCQ',
    deleteResource: 'Delete Resource',
    confirmDeleteTitle: 'Confirm Deletion',
    confirmDeleteDesc: 'Are you sure you want to delete this resource? This action cannot be undone.',
    updatedSuccessfully: 'Updated and saved successfully!',
    deletedSuccessfully: 'Deleted successfully!',
    noResourcesForLesson: 'No video resources published for this lesson yet.',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    // Q&A / Public Comments
    qaSectionTitle: 'Q&A & Lesson Discussion',
    qaSubtitle: 'Ask questions or discuss concepts directly with teachers and fellow students (No login required)',
    guestName: 'Your Name',
    guestNamePlaceholder: 'e.g., Sokha, Vanna, or Alice...',
    commentPlaceholder: 'Type your question or comment here...',
    postComment: 'Post Comment / Question',
    posting: 'Posting...',
    reply: 'Reply',
    cancelReply: 'Cancel Reply',
    replyingTo: 'Replying to',
    teacherBadge: 'Teacher',
    studentBadge: 'Student / Guest',
    noCommentsYet: 'No questions or comments yet',
    beTheFirstComment: 'Be the first to ask a question or leave feedback about this lesson!',
    commentsCount: 'Comments',
    postingAsStaff: 'Replying with verified Teacher status',
    deleteComment: 'Delete Comment',
    confirmDeleteComment: 'Are you sure you want to delete this comment?',
    pleaseEnterName: 'Please enter your name first',
    pleaseEnterContent: 'Please enter your question or comment',
    // Notifications & Activity Log
    recentActivity: 'Recent Activities & Updates',
    activityLog: 'Content Update History',
    activityLogSubtitle: 'Real-time record of video uploads, handout revisions, and teacher replies',
    liveUpdatesBanner: 'Latest Content Update',
    studentQaManagement: 'Student Q&A Management',
    qaManagementDesc: 'Review student questions across all lessons and reply directly with verified Teacher status',
    allQuestions: 'All Questions',
    pendingReply: 'Pending Reply',
    answered: 'Answered',
    sendReply: 'Send Reply',
    replySentSuccess: 'Reply posted successfully!',
    viewInLesson: 'View in Lesson',
    justNow: 'Just now',
    minutesAgo: 'mins ago',
    hoursAgo: 'hours ago',
    daysAgo: 'days ago',
    actionUploadVideo: 'Uploaded Video',
    actionEditVideo: 'Edited Video',
    actionDeleteVideo: 'Deleted Video',
    actionEditMcq: 'Edited MCQ',
    actionCommentReply: 'Teacher Replied',
    actionCommentPost: 'New Student Question',
    allActions: 'All Actions',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
  isKhmer: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('km');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('moeys_app_lang') as Language | null;
      if (stored === 'km' || stored === 'en') {
        setLanguageState(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('moeys_app_lang', lang);
    } catch {
      // ignore
    }
  };

  const t = (key: keyof Translations): string => {
    return TRANSLATIONS[language][key] || TRANSLATIONS.en[key] || (key as string);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isKhmer: language === 'km',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
