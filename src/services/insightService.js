import { collection, addDoc, serverTimestamp, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';

const INSIGHTS_COLLECTION = 'insights';

export const getInsights = async () => {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, INSIGHTS_COLLECTION), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('Error fetching insights:', err);
      return [];
    }
  }
  
  const existing = JSON.parse(localStorage.getItem('salero_insights') || '[]');
  return existing.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const addInsight = async (insightData) => {
  const dataToSave = {
    ...insightData,
    createdAt: isFirebaseConfigured ? serverTimestamp() : new Date().toISOString()
  };

  if (isFirebaseConfigured) {
    try {
      const docRef = await addDoc(collection(db, INSIGHTS_COLLECTION), dataToSave);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error adding insight: ", error);
      return { success: false, error: error.message };
    }
  } else {
    const existing = JSON.parse(localStorage.getItem('salero_insights') || '[]');
    const newId = 'insight_' + Date.now();
    existing.push({ ...dataToSave, id: newId });
    localStorage.setItem('salero_insights', JSON.stringify(existing));
    return { success: true, id: newId };
  }
};

export const updateInsight = async (insightId, updatedData) => {
  if (isFirebaseConfigured) {
    try {
      await updateDoc(doc(db, INSIGHTS_COLLECTION, insightId), updatedData);
      return true;
    } catch (err) {
      console.error('Error updating insight:', err);
      return false;
    }
  }
  
  const existing = JSON.parse(localStorage.getItem('salero_insights') || '[]');
  const index = existing.findIndex(i => i.id === insightId);
  if (index !== -1) {
    existing[index] = { ...existing[index], ...updatedData };
    localStorage.setItem('salero_insights', JSON.stringify(existing));
    return true;
  }
  return false;
};

export const deleteInsight = async (insightId) => {
  if (isFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, INSIGHTS_COLLECTION, insightId));
      return true;
    } catch (err) {
      console.error('Error deleting insight:', err);
      return false;
    }
  }
  
  const existing = JSON.parse(localStorage.getItem('salero_insights') || '[]');
  const newInsights = existing.filter(i => i.id !== insightId);
  localStorage.setItem('salero_insights', JSON.stringify(newInsights));
  return true;
};
