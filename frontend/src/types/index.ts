// src/types/index.ts
export interface Message {
    id: string;
    content: string;
    userId: string;
    timestamp: number;
  }
  
  export interface User {
    id: string;
    name: string;
    // Add other user properties as needed
  }