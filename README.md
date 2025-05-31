# 🔧 TrustFix_System

TrustFix_System là một hệ thống Cho phép người dùng tìm thợ và đặt thợ có tích hợp chatbot

---

## 📌 Mục Lục

- [Giới Thiệu](#giới-thiệu)
- [Kiến Trúc Dự Án](#kiến-trúc-dự-án)
- [Cấu Trúc Thư Mục](#cấu-trúc-thư-mục)
- [Cài Đặt & Chạy Dự Án](#cài-đặt--chạy-dự-án)
- [Tính Năng Chính](#tính-năng-chính)
- [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)
- [Ví Dụ API](#ví-dụ-api)
- [Lưu Ý](#lưu-ý)
- [Liên Hệ](#liên-hệ)
- [Đóng Góp](#đóng-góp)
- [Giấy Phép](#giấy-phép)

---

## 🧠 Giới Thiệu

TrustFix_System được xây dựng để giúp người dùng dễ dàng hơn trong việc tìm các thợ sửa chữa ở gần

---

## 🏗️ Kiến Trúc Dự Án

```plaintext
[React.js Frontend] <--> [Express.js API Server] <--> [MongoDB Database]
```

- **Frontend (React.js)**: Giao diện người dùng hiển thị thông tin thiết bị, biểu đồ, bảng quản lý.
- **Backend (Express.js)**: REST API xử lý logic ứng dụng, xác thực người dùng, tính toán độ tin cậy.
- **Database (MongoDB)**: Lưu trữ thông tin , người dùng, log sự kiện.

---

## 📁 Cấu Trúc Thư Mục

```plaintext
TrustFix_System/
├── client/             # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       └── services/
├── server/             # Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
└── README.md
```

---

## 🚀 Cài Đặt & Chạy Dự Án

### Yêu Cầu

- Node.js >= 14.x  
- npm >= 6.x  
- MongoDB local hoặc MongoDB Atlas  

### Cài đặt

```bash
git clone https://github.com/xhair2003/TrustFix_System.git
cd TrustFix_System

# Cài đặt backend
cd server
npm install

# Cài đặt frontend
cd ../client
npm install
```

### Chạy dự án

```bash
# Chạy server
cd ../server
npm start

# Chạy client
cd ../client
npm start
```

### Tạo file .env trong thư mục server

```env
PORT = 8080

# Database Configuration
MONGODB_URL=mongodb+srv://ducanh8903:12345@cluster0.k8hsk.mongodb.net/TrustFix_DB?retryWrites=true&w=majority&appName=Cluster0

# JWT Configuration
JWT_ACCESS_KEY=trustfix_access_key_2024
JWT_REFRESH_KEY=trustfix_refresh_key_2024

# Email Configuration
EMAIL_USER=minhhieuthkcr4469@gmail.com
EMAIL_PASS=syiz sbax hpkq nodw

# Admin Configuration
ADMIN_EMAIL=admin@trustfix.com
ADMIN_PASSWORD=admin123

#Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=cap2
CLOUDINARY_API_KEY=525178977689689
CLOUDINARY_API_SECRET=8RMapxVN5UX7kxOqCV7sgZ8TD0E

#GOMAPS_API_KEY
GOMAPS_API_KEY=AlzaSyBoKOkpdqCcdxz9ztC19yju9TysH0YHJdB
# AlzaSyL6sJD5duhGIkl6VboiBJq8oRak9KLIgUB
# AlzaSyJfYUhudJ-_rCC_eaLdUoVEGCcUnV493fP
#Payos key
PAYOS_CLIENT_ID=b868cbe0-5c9a-49e6-a7d5-53bdc6919996
PAYOS_API_KEY=91611321-d8aa-4fdb-9493-26313fcfcd03
PAYOS_CHECKSUM_KEY=f87ab1f8c2dcadfa55679abcb7822e125b975ad6985e6a1015f667b9ac0ff5b3
```

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend

- React.js, React Router
- Axios
- Chart.js
- Tailwind CSS / Bootstrap

### Backend

- Node.js, Express.js
- MongoDB, Mongoose
- JSON Web Token (JWT)
- dotenv, CORS
- [ngrok](https://ngrok.com/docs)
---

## 🧪 Ví Dụ API

### Auth

```http
POST /api/auth/register
POST /api/auth/login
```

### Device

```http
GET    /api/devices
POST   /api/devices
PUT    /api/devices/:id
DELETE /api/devices/:id
```

### Reliability

```http
GET /api/devices/:id/reliability
```

---

## ❗ Lưu Ý

- Dự án đang phát triển, không nên sử dụng trực tiếp cho hệ thống sản xuất.
- Hãy đổi JWT_SECRET và sao lưu dữ liệu định kỳ.

---

## 📞 Liên Hệ

- Nhóm phát triển: **C2SE.10**
- GitHub: [xhair2003](https://github.com/xhair2003)
- Email: nvh01022003@gmail.com

---

## ❤️ Đóng Góp

Chúng tôi hoan nghênh mọi đóng góp!

```bash
git checkout -b feature/tinh-nang-moi
git commit -m "Thêm tính năng"
git push origin feature/tinh-nang-moi
```

---

## 📄 Giấy Phép

Dự án này được cấp phép theo **MIT License**.
