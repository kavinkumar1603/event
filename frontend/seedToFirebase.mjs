// Direct script to seed student data to Firebase
// Run with: node seedToFirebase.mjs

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { STUDENTS } from './src/studentData.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIhoO4Xf-pGPR5pWwFpuaq03p5R8e1cqI",
  authDomain: "eventmanagement-58831.firebaseapp.com",
  projectId: "eventmanagement-58831",
  storageBucket: "eventmanagement-58831.firebasestorage.app",
  messagingSenderId: "39022760443",
  appId: "1:39022760443:web:61af07a7e264075163fb5e",
  measurementId: "G-GP3C2GVWX7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedStudents() {
  console.log(`\n📚 Seeding ${STUDENTS.length} students to Firestore...\n`);
  
  let successCount = 0;
  let errorCount = 0;

  for (const student of STUDENTS) {
    try {
      await setDoc(doc(db, 'students', student.id), {
        ...student,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      
      successCount++;
      console.log(`✅ ${student.rollNo} - ${student.name}`);
    } catch (error) {
      errorCount++;
      console.log(`❌ ${student.rollNo} - ${error.message}`);
    }
  }

  console.log(`\n========================================`);
  console.log(`✅ Successfully seeded: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`========================================\n`);
  
  process.exit(0);
}

seedStudents();
