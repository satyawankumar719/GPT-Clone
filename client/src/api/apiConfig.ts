
// Debugging line
export const API_CONFIG = {
    
    BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:5000", 
    ENDPOINTS: {
        AUTH: {
            LOGIN: "/api/auth/login",
            SIGNUP: "/api/auth/signup",
            LOGOUT: "/api/auth/logout",
            CURRENT_USER: "/api/auth/me",
        },
        CONVERSATION: {
            CREATE: "/api/chats",
            GET_ANSWER: "/api/answer",
            GET_ALL: "/api/chats",
            GET_BY_ID: (id: string) => `/api/chats/${id}`,
            UPDATE_TITLE: (id: string) => `/api/chats/${id}/title`,
        },
       
    },
};
