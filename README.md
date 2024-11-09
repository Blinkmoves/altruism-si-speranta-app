# Altruism si Speranta App

Altruism si Speranta App is a React Native / Expo Go application designed to help users of the "Altruism si Speranta" Association manage tasks, events, and personal settings. The app supports both light and dark themes and integrates with Firebase for authentication and data storage.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Screens](#screens)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Features

- Task management with add, edit, delete, and complete functionalities
- Event management with calendar integration with add, edit and delete functionalities
- User authentication (login, create account, forgot password)
- Light and dark theme support (Upcoming!)
- Toast notifications for user-friendly feedback
- Firebase integration for real-time data storage

## Installation

> Altruism si Speranta App requires **[Node.js] v20.14.0** to run.

**1. Clone the repository:**

```bash
git clone https://github.com/Blinkmoves/altruism-si-speranta.git
cd altruism-si-speranta
```

**2. Install dependencies:**

```bash
npm i
```

**3. Set up Firebase:**

- Create a Firebase project at Firebase Console.
- Add your Firebase configuration to src/services/firebaseConfig.js.

**4. Start the development server:**

```bash
npx expo start
```

## Screens

- **HomePage**: Displays an overview of tasks and events.
- **TasksPage**: Allows users to manage their tasks.
- **AddTasksPage**: Provides a form to add new tasks.
- **TaskShowPage**: Shows detailed information about a specific task.
- **EditTaskPage**: Allows users to edit their tasks.
- **EventsPage**: Displays a calendar view of events.
- **AddEventsPage**: Provides a form to add new events.
- **EventsShowPage**: Shows detailed information about a specific event.
- **EventsEditPage**: Allows users to edit their tasks.
- **SettingsPage**: Allows users to update their profile and app settings.
- **PrivacyPolicyPage**: Displays the privacy policy.
- **LoginPage**: Provides a login form for user authentication.
- **CreateAccountPage**: Allows users to create a new account.
- **ForgotPasswordPage**: Provides a form to reset the user's password.

## Configuration

**1. Firebase Configuration**

Update src/services/firebaseConfig.js with your Firebase project configuration:

```javascript
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
  databaseURL: 'YOUR_DATABASE_URL',
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});
const db = getDatabase(app);

export { app, auth, db };
```

**2. Theme Configuration**

The app supports both light and dark themes. The themes are defined in src/styles/themeStyles.js:

## Contributing

Contributions are welcome! Please follow these steps to contribute:

- Fork the repository.
- Create a new branch (git checkout -b feature-branch).
- Make your changes.
- Commit your changes (git commit -m 'Add new feature').
- Push to the branch (git push origin feature-branch).
- Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](/LICENSE.md) file for details.
