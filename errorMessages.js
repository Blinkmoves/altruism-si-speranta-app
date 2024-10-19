// AUTH User-friendly error messages for common auth errors
export const getFriendlyErrorMessage = (errorCode) => {
    switch (errorCode) {
        case 'auth/invalid-email':
            return 'Adresa de email nu este validă.'; // Login, CreateAccount and ForgotPassword
        case 'auth/user-disabled':
            return 'Acest cont a fost dezactivat.'; // Login and ForgotPassword
        case 'auth/user-not-found':
            return 'Nu există niciun utilizator cu această adresă de email.'; // Login and ForgotPassword
        case 'auth/wrong-password':
            return 'Parola introdusă este incorectă.'; // Login
        case 'auth/missing-password':
            return 'Te rugăm să introduci o parolă.'; // Login and CreateAccount
        case 'auth/missing-email':
            return 'Te rugăm să introduci o adresă de email.'; // Login, CreateAccount and ForgotPassword
        case 'auth/email-already-in-use':
            return 'Adresa de email este deja folosită de un alt cont.'; // CreateAccount
        case 'auth/too-many-requests':
            return 'Prea multe încercări de conectare. Te rugăm să încerci din nou mai târziu.'; // Login and ForgotPassword
        case 'auth/weak-password':
            return 'Parola este prea slabă.'; // CreateAccount
        case 'auth/network-request-failed':
            return 'A apărut o eroare de rețea. Te rugăm să încerci din nou.'; // Login, CreateAccount and ForgotPassword
        default:
            return 'A apărut o eroare. Te rugăm să încerci din nou.'; // Login, CreateAccount and ForgotPassword
    }
};