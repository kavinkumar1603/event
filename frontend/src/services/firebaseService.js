import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  setDoc, 
  updateDoc, 
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../firebase';

// ==================== STUDENTS ====================
export const fetchStudents = async () => {
  try {
    const studentsCollection = collection(db, 'students');
    const snapshot = await getDocs(studentsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
};

export const getStudentById = async (studentId) => {
  try {
    const docRef = doc(db, 'students', studentId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching student:', error);
    return null;
  }
};

// ==================== USERS ====================
export const fetchUsers = async () => {
  try {
    const usersCollection = collection(db, 'users');
    const snapshot = await getDocs(usersCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// ==================== EVENTS ====================
export const fetchEvents = async () => {
  try {
    const eventsCollection = collection(db, 'events');
    const snapshot = await getDocs(eventsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

export const createEvent = async (eventData) => {
  try {
    const eventsCollection = collection(db, 'events');
    const docRef = await addDoc(eventsCollection, {
      ...eventData,
      createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...eventData };
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const updateEventStatus = async (eventId, status) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, { 
      status,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error updating event status:', error);
    throw error;
  }
};

// ==================== OD REQUESTS ====================
export const fetchODRequests = async () => {
  try {
    const odCollection = collection(db, 'odRequests');
    const snapshot = await getDocs(odCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching OD requests:', error);
    return [];
  }
};

export const createODRequest = async (odData) => {
  try {
    const odCollection = collection(db, 'odRequests');
    const docRef = await addDoc(odCollection, {
      ...odData,
      status: 'PENDING_FACULTY',
      createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...odData, status: 'PENDING_FACULTY' };
  } catch (error) {
    console.error('Error creating OD request:', error);
    throw error;
  }
};

export const updateODRequestStatus = async (requestId, status, approverInfo = {}) => {
  try {
    const odRef = doc(db, 'odRequests', requestId);
    await updateDoc(odRef, { 
      status,
      ...approverInfo,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error updating OD request status:', error);
    throw error;
  }
};

export const getODRequestById = async (requestId) => {
  try {
    const docRef = doc(db, 'odRequests', requestId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching OD request:', error);
    return null;
  }
};

// ==================== REAL-TIME LISTENERS ====================
export const subscribeToODRequests = (callback) => {
  const odCollection = collection(db, 'odRequests');
  return onSnapshot(odCollection, (snapshot) => {
    const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(requests);
  });
};

export const subscribeToEvents = (callback) => {
  const eventsCollection = collection(db, 'events');
  return onSnapshot(eventsCollection, (snapshot) => {
    const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(events);
  });
};

export const subscribeToStudents = (callback) => {
  const studentsCollection = collection(db, 'students');
  return onSnapshot(studentsCollection, (snapshot) => {
    const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(students);
  });
};
