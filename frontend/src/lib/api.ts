import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: async (username: string, email: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    return api.post('/signup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  login: async (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    return api.post('/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};

export interface Message {
  id: string;
  role: string;
  content: string;
  timestamp: string;
}

export interface SaveChatData {
  chat_id: string;
  title: string;
  messages: Message[];
  pdf_name?: string;
}

export const chatAPI = {
  // Save chat history
  saveChat: async (chatData: SaveChatData) => {
    return api.post('/chats/save', chatData);
  },

  // Get all chats for current user
  getChats: async () => {
    return api.get('/chats');
  },

  // Get specific chat by ID
  getChat: async (chatId: string) => {
    return api.get(`/chats/${chatId}`);
  }
};
