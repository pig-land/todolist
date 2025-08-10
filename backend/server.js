// 載入 dotenv 套件，用來讀取 .env 檔案中的環境變數（例如 MongoDB 密碼）
require('dotenv').config();

// 引入必要模組
const express = require('express');     // 後端伺服器框架
const cors = require('cors');           // 處理跨來源請求（讓前端能連線）
const mongoose = require('mongoose');   // 與 MongoDB 溝通的工具（ODM）

// 建立 Express 應用程式
const app = express();
const port = 3001;// 後端伺服器監聽的 port（可自由設定，記得前端也要對應）

// 使用中介函式（middleware）做預處理
app.use(cors()); // 啟用 CORS，允許不同網域的前端可以連線（例如 React 在 5173）
app.use(express.json()); // 自動解析 JSON 請求內容（把 req.body 轉為 JS 物件）


// 1.連線 MongoDB Atlas（遠端雲端資料庫）
const uri = process.env.MONGODB_URI;// 從 .env 讀取 MongoDB 連線字串（避免硬寫密碼）

mongoose.connect(uri, {
  useNewUrlParser: true,    // 使用新版 URL 解析器
  useUnifiedTopology: true  // 使用新版連線引擎（比較穩定）
})
  .then(() => console.log('✅ 已成功連接 MongoDB Atlas'))     // 成功連線時提示
  .catch(err => console.error('❌ MongoDB 連線失敗：', err)); // 若有錯誤就顯示


// 2.定義 Todo 資料模型（schema 是資料的欄位結構與規則）
const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },       // 內容為必填文字
  completed: { type: Boolean, default: false }  // 預設未完成
});

// 建立 Mongoose 的 model，這就是操作資料的入口
const Todo = mongoose.model('Todo', todoSchema);// 會對應 MongoDB 中的 "todos" collection


// 3.設計 API 路由（前端會透過這些 API 和資料庫互動）

// 測試用：首頁回傳一句話，確認後端有跑起來
app.get('/', (req, res) => {
  res.send('後端伺服器已啟動！');
});

// GET /todos：取得所有待辦事項
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();// 從資料庫抓全部 todos
    res.json(todos);// 回傳給前端（JSON 陣列）
  } catch (err) {
    res.status(500).json({ error: '讀取失敗' });
  }
});

// POST /todos：新增一筆待辦事項
app.post('/todos', async (req, res) => {
  const { text, completed } = req.body;// 從前端取得傳來的資料

  // 基本防呆：text 一定要是字串，否則回傳錯誤
  if (typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ error: 'text 欄位必須是非空白的字串' });
  }

  try {
    // 建立一筆新的 Todo 資料
    const newTodo = new Todo({
      text: text.trim(),        // 去除頭尾空白
      completed: !!completed    // 強制轉成布林值（避免傳來非布林值）
    });
    const saved = await newTodo.save();// 儲存到資料庫
    res.status(201).json(saved);// 回傳新增成功的資料（包含 _id 等欄位）
  } catch (err) {
    res.status(500).json({ error: '新增失敗' });
  }
});

// PATCH /todos/:id：修改一筆待辦事項（部分更新）
app.patch('/todos/:id', async (req, res) => {
  try {
    const patch = {};// 準備一個空物件，專門存放允許被更新的欄位

     // 檢查 req.body 裡是否有傳 text 欄位
     if ('text' in req.body) {
      const trimmed = String(req.body.text).trim();// 轉成字串並去除前後空白
      if (trimmed === ''){
        return res.status(400).json({ error: 'text 不能是空字串' });// 如果是空字串，回傳 400（Bad Request）並結束
      } 
      patch.text = trimmed;// 驗證通過才放進 patch
    }

    // 檢查 req.body 裡是否有傳 completed 欄位
    if ('completed' in req.body) {
      patch.completed = !!req.body.completed;// !! 轉成布林值（例如 'true' → true, 1 → true, null → false）
    }

    // 用 id 找到對應的待辦，並套用 patch 更新
    // { new: true } → 更新後回傳最新資料（預設會回傳更新前的資料）
    const updated = await Todo.findByIdAndUpdate( req.params.id, patch, { new: true });
    if (updated) return res.json(updated);// 如果找到並更新成功，回傳更新後的資料
    res.status(404).json({ error: '找不到該筆 todo' });// 沒找到對應資料，回傳 404
  } catch (err) {
    res.status(500).json({ error: '更新失敗' });// 發生伺服器錯誤（例如資料庫連線問題）
  }
});

// DELETE /todos/:id：刪除一筆待辦事項
app.delete('/todos/:id', async (req, res) => {
  try {
    const deleted = await Todo.findByIdAndDelete(req.params.id);// 直接刪除該筆資料
    if (deleted) {
      res.json(deleted);// 刪除成功，回傳被刪除的資料
    } else {
      res.status(404).json({ error: '找不到資料' });// 若 id 不存在
    }
  } catch (err) {
    res.status(500).json({ error: '刪除失敗' });
  }
});


// DELETE /todos：刪除全部（批次）
app.delete('/todos', async (req, res) => {
  try {
    await Todo.deleteMany({});// 刪除 todos collection 中的所有文件

    // 也可以選擇回傳刪除數量：
    // const result = await Todo.deleteMany({});
    // res.json({ deletedCount: result.deletedCount });
    
    // 這裡回傳簡單的成功訊息
    // 若想遵循 REST 規範，可改用 res.status(204).send() 表示「成功但無回應內容」
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: '清空失敗' });
  }
});


// 啟動後端伺服器，開始監聽 port（預設是 http://localhost:3001）
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
