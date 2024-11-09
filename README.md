# Prescripto HSP

🚀 Excited to announce the launch of my latest project: **Prescripto HSP**! 🚀

Over the past few weeks, I've been focused on building a comprehensive full-stack hospital management platform using the **MERN stack** (MongoDB, Express.js, React, Node.js), integrated with **Firebase** for authentication and image storage. The project also leverages **Tailwind CSS** for a sleek UI and **Redux Toolkit** for efficient state management. I’m thrilled to share that it's now live and ready for use!

Now, with the addition of **Stripe Payment Gateway**, Prescripto HSP allows patients to make secure online payments for medical services and appointments.

## 🔑 Key Features:

- **🔐 Secure Authentication**: Implemented **Google OAuth** for user authentication via Firebase, allowing users to securely sign up, sign in, and manage their accounts.

- **🖥️ User-Friendly Interface**: Built with React and styled using **Tailwind CSS**, delivering a smooth, responsive, and intuitive experience for users to interact with the platform on any device.

- **📱 Responsive Design**: Ensured a mobile-first approach with a fully responsive design, making it easy for users to access the platform from smartphones, tablets, and desktops.

- **⚙️ Robust Backend**: Powered by **Express.js** and **Node.js**, ensuring efficient handling of server-side operations and secure user data management with **JWT** (JSON Web Tokens).

- **🖼️ Image Storage**: Utilizing Firebase for image storage, enabling users to upload and display profile images and documents seamlessly.

- **📊 Scalable Data Management**: Leveraging **MongoDB** for flexible and scalable database solutions, ensuring efficient management of patients, appointments, and user roles.

- **🔗 Real-Time State Management**: Implemented with **Redux Toolkit**, providing robust state management and persisting user preferences with **redux-persist**.

- **🩺 Admin and Doctor Role Management**: Separate login flows and dashboards for **Admin** and **Doctor** roles:
  - Admin: Manages user roles, patient data, and other administrative tasks.
  - Doctor: Manages appointments, prescriptions, and patient records.

- **💳 Stripe Payment Gateway**: Integrated Stripe for **secure online payments** for medical services, appointments, and prescriptions.
  - Patients can make payments directly through the platform.
  - Admin can view payment history and details.

- **📧 Notifications and Alerts**: Integrated email notifications to keep users updated on appointments, prescription updates, and alerts.

- **🎨 Iconography**: Enhanced the visual appeal using **React Icons** for a professional and modern look.

## 🛠️ Additional Tools:

- **bcryptjs**: For secure password hashing.
- **cookie-parser**: For handling cookies during authentication.
- **CORS**: Enabled for secure cross-origin requests.
- **Nodemon**: For automatic server restarts during development.
- **Swiper**: For smooth image sliders in patient profiles.
- **Stripe**: For payment processing and secure online transactions.

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/prescripto-hsp.git
   cd prescripto-hsp
2.**Install dependencies for both frontend and backend**:
   - Navigate to the **frontend** directory and install dependencies:
     ```bash
     cd frontend
     npm install
     ```
   - Then navigate to the **backend** directory and install dependencies:
     ```bash
     cd ../backend
     npm install
     ```
3. **Set up environment variables**:
   - Create a `.env` file in the root of the **backend** directory with the following:

     ```env
     MONGO_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
          ```
4. **Run the application**:
   - Navigate to the **backend** directory and start the server:
     ```bash
     cd backend
     npm run dev
## 🔗 Links

- **Live Demo:** [Prescripto Live](https://pre-scripto-hopso-frontend.vercel.app/)
- **GitHub Repository:** [GitHub](https://github.com/vikram17dp/PreScriptoHopso)
- **LinkedIn Profile:** [Vikram D P](https://www.linkedin.com/in/vikram-d-p-20053127b/)
## 💡 About the Project
This project has been a fantastic learning experience, allowing me to dive deep into both frontend and backend development. I’m proud of the end result and excited about the potential applications of this hospital management platform in healthcare settings.

## 🛠️ Features

### Authentication Flow:
- **Google OAuth Authentication**: Both users and admins authenticate using **Google OAuth** provided by **Firebase**.
- Upon successful login, users are redirected to their respective dashboards based on their roles.

### Admin Login:
- Admins have the ability to manage all platform functionalities, including user and patient management.

### Doctor Login:
- Doctors can manage patient appointments, prescriptions, and medical records.

### Admin Features:
- Manage all user roles (**Admin**, **Doctor**).
- Handle patient data, prescriptions, and medical records.
- Manage system-wide notifications.

### Doctor Features:
- Manage appointments and view patient records.
- Write and update prescriptions for patients.
- Receive and respond to appointment inquiries.

### Payment Gateway:
- **Secure payments** via **Stripe** for appointments and prescriptions.

## 🤝 Contributing
Feel free to fork this repository, create a feature branch, and submit a pull request. Contributions, issues, and feature requests are welcome!
