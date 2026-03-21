
 // Debugging line
export const API_CONFIG = {
    
    BASE_URL: import.meta.env.VITE_API_URL , 
    ENDPOINTS: {
        AUTH: {
            LOGIN: "/api/auth/login",
            LOGOUT: "/api/auth/logout",
            CURRENT_USER: "/api/auth/session",
        },
        CONVERSATION: {
            CREATE: "/api/test",
            GET_ANSWER: "/api/answer",
            GET_ALL: "/api/conversations",
            GET_BY_ID: (id: string) => `/api/conversations/${id}`,
            
        },
       
    },
};
