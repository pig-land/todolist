// =========================================
// 這個檔案是「前端和後端 API 溝通的統一入口」
// 所有呼叫後端的請求都集中在這裡管理
// 這樣可以減少重複程式碼，方便日後維護與修改
// =========================================


// 讀取 API 網址
// 優先從 .env（VITE_API_URL）讀取，如果沒有設定就預設為 http://localhost:3001
// VITE_ 開頭是 Vite 的規定，才能在前端存取環境變數
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';


// -----------------------------------------
// 處理共用回應：
// 1. 嘗試將回應內容轉成 JSON 物件
// 2. 如果狀態碼不是 2xx（成功），丟出錯誤
// 3. 如果成功則回傳解析後的資料
// ----------------------------------------
async function handleResponse(res) {

    // 嘗試轉成 JSON，如果回應不是 JSON 格式（例如空白回應）就回傳空物件
    const data = await res.json().catch(() => ({}));

    // 檢查回應狀態碼，res.ok 代表 200~299
    if (!res.ok) {
        // 後端可能會回傳 error 欄位，否則就用 HTTP 狀態碼當錯誤訊息
        const message = data.error || `HTTP ${res.status}`;
        throw new Error(message);// 丟出錯誤，讓呼叫者的 try...catch 處理
    }
    return data;// 成功的情況回傳解析後的資料
}

// -----------------------------------------
// 取得全部 todos
// GET /todos
// 回傳：todos 陣列
export async function getTodos() {
    const res = await fetch(`${BASE_URL}/todos`);
    return handleResponse(res);
}

// -----------------------------------------
// 新增 todo
// POST /todos
// payload 參數是一個物件，例如：{ text: '買牛奶', completed: false }
// 回傳：後端新增成功的那筆 todo（包含 _id）
export async function createTodo(payload) {
    const res = await fetch(`${BASE_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return handleResponse(res);
}

// -----------------------------------------
// 更新 todo
// PATCH /todos/:id
// id：MongoDB 自動生成的 _id
// patch：要更新的欄位物件，例如：{ completed: true } 或 { text: '新名稱' }
// 回傳：更新後的 todo 物件
export async function updateTodo(id, patch) {
    const res = await fetch(`${BASE_URL}/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch)
    });
    return handleResponse(res);
}

// -----------------------------------------
// 刪除 todo
// DELETE /todos/:id
// id：要刪除的那筆 todo 的 _id
// 回傳：被刪除的 todo 物件
export async function deleteTodo(id){
    const res = await fetch(`${BASE_URL}/todos/${id}`,{method: 'DELETE'});
    return handleResponse(res);
}

// -----------------------------------------
// 清空所有 todo
// DELETE /todos
export async function deleteAllTodos() {
  const res = await fetch(`${BASE_URL}/todos`, { method: 'DELETE' });
  return handleResponse(res);
}
