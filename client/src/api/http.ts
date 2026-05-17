//יבוא ספריית לבקשות HTTP
import axios from 'axios'

const apiClient = axios.create({
  // ?? הוא זה fallback. אם VITE_API_BASE_URL מוגדר, הוא ישמש כ־baseURL, אחרת הוא יפנה ל־/api
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: {
    // מציין שהגוף של הבקשה הוא JSON
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  // מחפש את הטוקן בדפדפן
  const token = localStorage.getItem('token')

  if (token) {
    // מוסיף את הטוקן לכותרות של כל בקשה
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default apiClient
