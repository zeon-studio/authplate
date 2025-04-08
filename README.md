# Authplate - Next.js Authentication Template

A modern authentication template built with **Next.js** that provides a solid foundation for your web applications. **Authplate** includes essential features, integrations, and best practices to help you quickly launch secure and stylish web apps.

---

## 🚀 Features

- ✅ Next.js 13+ with **App Router**
- 🔐 Authentication with **NextAuth.js**
- 🗃️ MongoDB integration (local or Atlas)
- 🎨 Tailwind CSS for modern styling
- 🧑‍💻 Full **TypeScript** support
- 📱 Fully responsive UI
- 🌗 Light/Dark mode toggle
- 🧼 Clean, maintainable code structure
- 📈 SEO & performance optimized
- ⚙️ Easily customizable components
- 📚 Well-documented and developer-friendly

---

## 📦 Prerequisites

Make sure you have the following installed before getting started:

- **Node.js** v16.8 or later
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Git** for version control

---

## ⚙️ Getting Started

Follow these steps to set up the project locally:

### 1. Clone the repository

```bash
git clone https://github.com/zeon-studio/authplate.git

### 2. Navigate to the project directory
``` bash
cd authplate

### 3. Install dependencies
``` bash
npm install
```
### 4. Configure environment variables
Create a `.env.local` file in the root directory and add the following variables:
```env
NEXTAUTH_URL=htt### 3. Install dependencies
``` bash
npm install
```
### 4. Configure environment variables
Create a `.env.local` file in the root directory and add the following variables:
```env
NEXTAUTH_URL=URL_ADDRESS:3000
NEXTAUTH_SECRET=your-secret-key
MONGODB_URI=your-mongodb-uri
```
### 5. 5. Generate Prisma client
``` bash
npx prisma generate
```

(Optional) Run migrations if needed:

``` bash
npx prisma db push
```
### 6. Run the development server
``` bash
npm run dev
```
## 🤝 Contributing

Contributions are welcome!  
If you find any bugs or have suggestions for improvements, feel free to [open an issue](https://github.com/zeon-studio/authplate/issues) or submit a pull request.

We appreciate your help in making **Authplate** better for everyone! 🚀

