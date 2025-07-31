import { useState } from "react";

// TodoItem 是一個顯示單一「待辦事項」的元件
// 接收四個 props：
// - todo（單一代辦物件）
// - onToggle（勾選切換完成狀態）
// - onDelete（刪除這筆待辦）
// - onUpdate（編輯更新內容）
function TodoItem({ todo, onToggle, onDelete, onUpdate }) {

    // isEditing：是否進入編輯模式（預設 false）
    const [isEditing, setIsEditing] = useState(false);
    
    // text：當使用者編輯文字時，暫存編輯中的文字內容
    const [text, setText] = useState(todo.text);

    // 處理編輯完成的提交事件
    const handleSubmit = () => {
        const trimmed = text.trim();// 去除頭尾空白
        if (trimmed === '') {
            alert('內容不可為空');// 提醒使用者不能輸入空字串
            setText(todo.text);// 還原原始文字
        } else {
            onUpdate(todo._id, trimmed);// 呼叫父元件提供的函式來更新資料
        }
        setIsEditing(false);// 離開編輯模式
    };


    return (
        // li 為整個項目容器，如果 todo.completed 為 true，就加上 class "completed"
        <li className={todo.completed ? 'completed' : ''}>

            {/* 勾選框，讓使用者切換是否完成 */}
            <input
                type="checkbox"
                className="todo-checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo._id)}// 呼叫父層切換完成狀態
            />

            {/* 根據是否在編輯模式，決定要顯示輸入框還是純文字 */}
            {isEditing ? (
                // 編輯狀態：顯示輸入框
                <input
                    className="edit-input"
                    type = "text"
                    value = {text}// 綁定輸入值
                    onChange={(e) => setText(e.target.value)}// 輸入變化時即時更新
                    onBlur={handleSubmit}// 點擊輸入框以外的地方時提交
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}// 按 Enter 提交
                    autoFocus// 自動聚焦在輸入框
                />
            ) : (
                // 非編輯狀態：顯示純文字
                <span
                    className="todo-text"// 新增小提示框用的: 可套用 tooltip 的樣式提示
                    onDoubleClick={ () =>{
                    setIsEditing(true);// 雙擊進入編輯模式
                    setText(todo.text);// 進入編輯時同步資料
                }}>
                    {todo.text}
                </span>

            )}

            {/* 刪除按鈕 */}
            <button className="delete-btn" onClick={() => onDelete(todo._id)}>
                刪除
            </button>
        </li>
    );

}

export default TodoItem;