export const authService = {
    // Register a new user
    register: async (email, password, displayName) => {
        return { id: 'dummy-id', email, user_metadata: { display_name: displayName } };
    },

    // Register without sending verification
    registerWithOtpFlow: async (email, password, displayName) => {
        return { id: 'dummy-id', email, user_metadata: { display_name: displayName } };
    },

    // Login user
    login: async (email, password, accountType = "Student") => {
        return {
            id: 'dummy-id-' + Date.now(),
            uid: 'dummy-id',
            email: email,
            user_metadata: {
                display_name: email.split('@')[0],
                first_name: email.split('@')[0],
                role: accountType.toLowerCase()
            },
            displayName: email.split('@')[0],
            photoURL: `https://api.dicebear.com/5.x/initials/svg?seed=${email}`,
            accountType: accountType || "Student",
        };
    },

    // Logout user
    logout: async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userRole");
    },

    // Reset password
    resetPassword: async (email) => {
    },

    // Google Sign In
    signInWithGoogle: async (accountType = "Student") => {
        return { user: { id: 'google-dummy-id', email: 'google-user@example.com' } };
    },
    
    // Delete User Account
    deleteUserAccount: async () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return { success: true };
    },
};
