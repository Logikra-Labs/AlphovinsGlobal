import { collection, addDoc, serverTimestamp, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';

const INSIGHTS_COLLECTION = 'insights';

const DEFAULT_INSIGHTS = [
  {
    title: "The Rising Demand for Indian G9 Cavendish Bananas in the Middle East",
    category: "Market Trends",
    image: "📈",
    author: "Export Desk",
    readTime: "5 min read",
    excerpt: "Indian G9 Cavendish bananas are witnessing unprecedented demand in the GCC region. We explore the factors driving this growth, quality protocols, and market opportunities.",
    content: "India has emerged as the world's largest producer of bananas, with the Grand Naine (G9) Cavendish variety leading the charge in global exports. Particularly in the Middle East—spanning the UAE, Saudi Arabia, Qatar, and Oman—Indian G9 bananas have become the preferred choice for wholesale importers and consumers alike.\n\nSeveral key factors contribute to this booming demand. First, the geographical proximity of India to the Middle East ensures shorter transit times (typically 5 to 7 days from Western Indian ports like Nhava Sheva to Gulf ports). This rapid transit means bananas can be harvested at an optimal maturity stage and arrive in peak condition.\n\nSecond, Indian agricultural practices have evolved rapidly. Modern packing houses utilize state-of-the-art washing, sorting, and grading lines, ensuring each banana bunch meets international cosmetic and safety standards. Precise temperature controls in refrigerated reefer containers (maintained at a steady 13.5°C) guarantee that the ripening process is suspended during the journey.\n\nFor international buyers, the G9 variety offers excellent shelf life, sweet taste, and uniform size. As export volumes continue to break records year-over-year, partnering with certified exporters who prioritize strict quality management from farm to port is the key to capitalizing on this robust market trend."
  },
  {
    title: "Perfecting the Cold Chain: Ensuring Farm-to-Port Quality for Agro Exports",
    category: "Logistics",
    image: "❄️",
    author: "Logistics Team",
    readTime: "4 min read",
    excerpt: "Temperature, humidity, and ethylene management are critical components of banana logistics. Discover how modern cold chains preserve quality during sea transit.",
    content: "Unlike non-climacteric fruits, bananas are harvested green and undergo a highly sensitive ripening process triggered by ethylene gas. When exporting bananas across seas, maintaining a flawless cold chain is the difference between a premium shipment and a total loss.\n\nThe cold chain begins immediately at harvest. Bananas must be protected from direct sunlight and transported to the packhouse within hours. After washing in chlorinated water and treatment to prevent crown rot, the bananas are packed in ventilated cartons with polybag liners.\n\nOnce packed, pre-cooling is essential to remove field heat. The bananas are then loaded into refrigerated containers (reefers). For Cavendish G9 bananas, the golden rule of temperature is 13.5°C (56.3°F). Lower temperatures can cause chilling injury, turning the skin dull and grey, while higher temperatures trigger premature ripening.\n\nEqually important is relative humidity, which must be kept between 85% to 95% to prevent dehydration and weight loss. Ethylene filters and controlled atmosphere (CA) systems—which lower oxygen and raise carbon dioxide levels—are widely employed for longer voyages. By slowing the fruit's respiration rate, we ensure that the bananas arrive at their global destination in perfect green condition, ready for controlled ripening chambers."
  },
  {
    title: "Nendran Bananas: South India's Golden Export Opportunity",
    category: "Produce Focus",
    image: "🍌",
    author: "Sourcing Lead",
    readTime: "3 min read",
    excerpt: "The traditional Kerala Banana (Nendran) is gaining massive popularity globally. Learn about its nutritional benefits, culinary versatility, and growing market.",
    content: "The Nendran banana, often referred to as the Kerala banana, is a distinct cultivar widely grown in Southern India, particularly Kerala and Tamil Nadu. Celebrated for its large size, thick skin, and characteristic golden-yellow color when ripe, this variety is transitioning from a local staple to a highly sought-after global commodity.\n\nHistorically, the export of Nendran was limited to catering to the South Indian diaspora. Today, however, its unique culinary and nutritional properties are attracting a broader international audience. Rich in dietary fiber, essential vitamins, and potassium, Nendran is highly versatile—consumed raw, steamed, cooked, or processed into the famous Kerala banana chips.\n\nThe global export market for Nendran is expanding rapidly due to advancements in post-harvest handling and packaging. Since Nendran has a relatively thicker skin than Cavendish, it possesses natural resistance to minor bruising, making it highly suitable for long-distance transport. Exporters are also seeing massive demand for processed Nendran products, such as banana powder (used as a nutritious baby food) and vacuum-fried organic banana chips.\n\nAt Alphovins, we source our Nendran bananas directly from select farm clusters in Tamil Nadu, ensuring adherence to global GAP standards. By training farmers in bagging techniques and offering premium prices, we ensure a sustainable supply chain that meets the high expectations of global retail and wholesale buyers."
  }
];

export const getInsights = async () => {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, INSIGHTS_COLLECTION), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        // Seed default insights to Firestore
        const seeded = [];
        for (const insight of DEFAULT_INSIGHTS) {
          const docRef = await addDoc(collection(db, INSIGHTS_COLLECTION), {
            ...insight,
            createdAt: serverTimestamp()
          });
          seeded.push({ id: docRef.id, ...insight, createdAt: new Date().toISOString() });
        }
        return seeded;
      }
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('Error fetching insights:', err);
      return [];
    }
  }
  
  let existing = JSON.parse(localStorage.getItem('salero_insights') || '[]');
  if (existing.length === 0) {
    existing = DEFAULT_INSIGHTS.map((insight, idx) => ({
      ...insight,
      id: 'insight_default_' + idx,
      createdAt: new Date(Date.now() - idx * 24 * 60 * 60 * 1000).toISOString()
    }));
    localStorage.setItem('salero_insights', JSON.stringify(existing));
  }
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
