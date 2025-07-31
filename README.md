# 📝 Full Stack Todo List App

這是一個使用 React 搭配 Node.js + Express + MongoDB 打造的全端 Todo List 應用，支援任務新增、編輯、完成狀態切換與刪除功能。前後端完全分離，適合作為學習與練習前後端整合的入門專案。

---

## 📁 專案結構

```
todolist/
├── frontend/    # 前端：使用 React + Vite 建構
├── backend/     # 後端：Node.js + Express + MongoDB API
└── README.md    # 本說明文件（你正在看）
```

---

## 🚀 使用技術

### 前端（frontend）
- React (with Vite)
- Fetch API
- CSS Modules 或自訂樣式
- React Hooks（useState, useEffect）

### 後端（backend）
- Node.js
- Express
- MongoDB（透過 mongoose）
- dotenv（環境變數管理）

---

## ⚙️ 安裝與執行方式

請先確認你已安裝好以下工具：

- Node.js
- npm
- MongoDB（本機或遠端 URI）

### 1️⃣ 安裝前端

```bash
cd frontend
npm install
npm run dev
```

預設前端會在 `http://localhost:5173` 啟動。

---

### 2️⃣ 安裝後端

```bash
cd backend
npm install
```


請在 `backend` 資料夾中建立 `.env` 檔案，並填入你的 MongoDB URI，例如（本機預設）：
```env
MONGODB_URI=mongodb://localhost:27017/todolist
```
(若你使用 MongoDB Atlas 等雲端服務，請改填你實際的連線 URI)

啟動後端伺服器：

```bash
node server.js
```

預設後端會在 `http://localhost:3001` 提供 API 服務。

---

## ✅ 功能介紹

- [x] 新增待辦事項
- [x] 編輯待辦文字
- [x] 勾選完成 / 取消完成
- [x] 單筆刪除
- [x] 清除全部待辦
- [x] 依完成狀態篩選（全部 / 未完成 / 已完成）

---

## 🙋‍♂️ 作者說明

這是我第一次嘗試自己完成前後端整合的專案。雖然很多程式碼是透過 AI 工具輔助產生（連這一份 README 也是），但我都有努力去理解每一段程式邏輯與流程，並從中學習如何設計 API、維持資料一致性，以及 React 的實務用法。

---

## 🧠 學到的重點概念

- 前後端如何溝通（Fetch / API 設計）
- 狀態管理與資料同步（React Hooks）
- 前端畫面渲染與非同步處理
- 樂觀更新 / 悲觀更新的差異
- 後端資料驗證與錯誤處理
- MongoDB 與 Mongoose 的整合基礎

---

## 📌 後續優化方向

- 加入 loading 提示與錯誤訊息
- UI 介面更美觀、支援 RWD
- 前端加入編輯模式動畫
- 優化程式碼結構與模組化
- 嘗試使用 Redux 或 Context 管理狀態

---

## 📜 License

本專案僅供學習與練習用途，不作為商業用途。
