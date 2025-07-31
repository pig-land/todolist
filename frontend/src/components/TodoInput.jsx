import { useState } from "react";

// 這是一個元件，裡面有一個輸入框和一個新增按鈕
// 父元件（App.jsx）會把 onAdd 這個函式傳進來給我用
function TodoInput({ onAdd }) {

    // 建立一個叫 text 的狀態變數，用來記錄使用者輸入的文字
    // setText 是用來更新 text 的函式（就像「改變內容」）
    const [text, setText] = useState('');

    // 當使用者按下 Enter 或按下「新增按鈕」時，就會執行這個函式
    const handleAdd = () => {
        const trimmed = text.trim();// 把文字前後空白去掉
        if (trimmed) {
            onAdd(trimmed); // 把輸入的文字傳給父元件去新增到清單裡
            setText('');// 清空輸入框
        }
    };

    // 這段是畫面（JSX）
    // 顯示一個輸入框，讓使用者輸入待辦事項
    // 顯示一個新增按鈕，按下去就會執行 handleAdd
    return (
        <div className="input-group control-group">
            <input
                type="text"
                placeholder="請輸入待辦事項..."
                value={text}// 輸入框裡的內容是 text 這個狀態
                onChange={(e) => setText(e.target.value)}// 使用者輸入時更新文字
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}// 如果按 Enter，就執行 handleAdd
                className="todo-input"
            />
            <button id="add-button" onClick={handleAdd} className="add-button">
                新增
            </button>
        </div>
    );
}

export default TodoInput;