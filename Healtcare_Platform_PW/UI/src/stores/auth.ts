import { defineStore } from 'pinia'
import axios from 'axios'
import { setToken, getToken, removeToken } from "../utils/auth";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        isAuthenticated: false,
        user: null,
        token: null,
    }),
    actions: {
        async initializeStore() {
            if (this.token) return;

            this.token = getToken();
            if (this.token) {
                this.isAuthenticated = true;
                // Potresti voler decodificare il token per ottenere le informazioni sull'utente
                // O fare una richiesta al backend per convalidare il token e ottenere i dettagli dell'utente
            }
        },
        async login(credentials) {
            try {
                const response = await axios.post("/api/auth/login", credentials);
                const { token, user } = response.data;
                this.token = token;
                this.user = user;
                this.isAuthenticated = true;
                setToken(token);
                return true;
            } catch (error) {
                console.error("Login failed:", error);
                this.isAuthenticated = false;
                this.user = null;
                removeToken();
                throw error;
            }
        },
        logout() {
            this.isAuthenticated = false;
            this.user = null;
            this.token = null;
            removeToken();
        },
    },
});