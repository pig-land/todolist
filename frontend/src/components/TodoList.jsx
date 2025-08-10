// 引入 TodoItem 元件，用來渲染每一筆代辦事項
import TodoItem from "./TodoItem";

// 引入 Toast 功能與樣式相關設定
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 改用集中管理的 API
import { updateTodo as apiUpdateTodo, deleteTodo as apiDeleteTodo } from '../services/api';


// TodoList 是一個負責「列出清單」的元件
// 它會依據傳入的 todos 資料陣列與篩選條件（filter）來顯示符合的項目
// setTodos 是父元件提供的更新函式，用來修改整體清單狀態
function TodoList({ todos, setTodos, filter }) {

    // 根據 filter 篩選要顯示的待辦事項
    // filter 可以是 "all", "done", 或 "undone"
    const filteredTodos =
        filter === 'all' ? todos :                           //全部
            filter === 'done' ? todos.filter(t => t.completed) :  // 已完成
                todos.filter(t => !t.completed); // 未完成


    // 勾選切換完成狀態
    const toggleTodo = async (id) => {
        try {
            const target = todos.find(t => t._id === id);
            if (!target) return; // 保護性檢查
            const updated = await apiUpdateTodo(id, { completed: !target.completed });
            setTodos(prev => prev.map(t => (t._id === id ? updated : t)));
        } catch (err) {
            console.error('更新完成狀態失敗：', err);
            toast.error(`更新失敗：${err.message}`);
        }
    }


    // 刪除一筆
    const deleteTodo = async (id) => {
        if (!confirm("確定要刪除?")) return;
        try {
            await apiDeleteTodo(id);
            setTodos(prev => prev.filter(t => t._id !== id));
            toast.success('刪除成功！');

        } catch (err) {
            console.error('刪除失敗：', err);
            toast.error(`刪除失敗：${err.message}`);
        }
    };


    // 編輯文字
    const updateTodo = async (id, newText) => {
        try {
            const updated = await apiUpdateTodo(id, { text: newText });
            setTodos(prev => prev.map(t => (t._id === id ? updated : t)));
        } catch (err) {
            console.error('更新文字失敗：', err);
            toast.error(`更新失敗：${err.message}`);
        }
    }





    // 如果目前沒有任何符合條件的 todo，就顯示提示訊息
    if (filteredTodos.length === 0) {
        return <p className="no-data">目前沒有資料</p>;
    }

    // 有資料就渲染清單：每一筆 todo 都用 TodoItem 元件來渲染
    return (
        <ul>
            {filteredTodos.map((todo) => (
                <TodoItem
                    key={todo._id}        // React 需要唯一 key
                    todo={todo}           // 傳入單筆 todo 資料
                    onToggle={toggleTodo}   // 勾選切換完成狀態
                    onDelete={deleteTodo}   // 點擊刪除按鈕
                    onUpdate={updateTodo}   // 編輯完成後提交
                />
            ))}
        </ul>
    );

}

export default TodoList;