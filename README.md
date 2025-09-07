LOLO Frontend 🎶

Frontend application for the LOLO platform, built with React, TypeScript, Vite, and React Router v7.
This app connects to the Laravel backend to manage events, users, and credits.

🚀 Tech Stack

React
 – UI library

TypeScript
 – Type-safe development

Vite
 – Fast build tool

React Router v7
 – Client-side routing

📦 Installation

Clone the repository and install dependencies:

git clone <your-repo-url>
cd lolo-frontend
npm install

▶️ Development

Start the development server:

npm run dev


The app will be running at:
👉 http://localhost:5173

📂 Project Structure
src/
 ├── pages/         # Page components (Home, Events, Users, etc.)
 ├── App.tsx        # Router setup and navigation
 ├── main.tsx       # Entry point
 └── index.css      # Global styles

🌐 Available Routes

/ → Home Page

/events → Events Page

/users → Users Page

📜 License

This project is licensed under the MIT License.

👉 Next steps:

Add API integration with your Laravel backend

Add Event Details route (/events/:id)

Add Authentication (if required)
