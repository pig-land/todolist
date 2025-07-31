// 引入 TodoItem 元件，用來渲染每一筆代辦事項
import TodoItem from "./TodoItem";


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


    // 勾選 checkbox 時，切換完成狀態                        
    const toggleTodo = (id) => {

        // 找出被切換的 todo
        // 根據 MongoDB 的唯一識別碼 _id，找出被點擊的那一筆 todo 物件
        // 注意：不能用 index 或 id，因為 _id 是從後端傳回來最可靠的主鍵
        const target = todos.find(todo => todo._id === id);

        // 複製這筆 todo 物件，建立一個新的物件 updated
        // ...target：將原本 target 的屬性展開複製（text、_id、completed）
        // 然後覆蓋 completed 欄位為「相反的布林值」（true → false / false → true）
        const updated = { ...target, completed: !target.completed };

        // 向後端發送 PATCH 請求，更新某一筆 todo 的 completed 狀態
        fetch(`http://localhost:3001/todos/${id}`, {
            method: "PATCH",// 使用 PATCH 方法來更新部分欄位（不像 PUT 是整筆覆蓋）
            headers: {
                "Content-Type": "application/json"// 告訴伺服器，我要送的是 JSON 格式的資料
            },
            body: JSON.stringify({ completed: updated.completed })// 把新的 completed 狀態包裝成 JSON 傳給後端
        })
            .then(res => res.json())// 等待伺服器回應，並將回傳的 JSON 轉換成 JS 物件
            .then(data => {// data 是後端回傳「更新後的那筆 todo 資料」（含最新狀態）

                // 用 map 去遍歷目前的 todos 陣列
                // 如果這筆 todo 的 _id 跟剛剛更新的是同一筆，就用後端回傳的資料（data）取代
                // 其他沒改的 todo 保持原樣
                const newTodos = todos.map(todo =>
                    todo._id === id ? data : todo
                );

                // 使用 React 的 setTodos 更新畫面狀態
                // 這樣會觸發重新渲染，畫面才會顯示最新的勾選狀態
                setTodos(newTodos);
            })
            .catch(err => console.error("更新完成狀態失敗：", err));// 如果請求失敗（例如伺服器沒回應、網路錯誤），顯示錯誤訊息

    };

    // 刪除一筆 todo
    const deleteTodo = (id) => {
        if (confirm("確定要刪除?")) {
            fetch(`http://localhost:3001/todos/${id}`, {
                method: "DELETE"
            })
                .then(() => {
                    // 從狀態中移除該筆 todo
                    setTodos(todos.filter(todo => todo._id != id));
                })
                .catch(err => console.error("刪除失敗：", err));
        }
    };

    // 編輯 todo 的文字內容
    const updateTodo = (id, newText) => {
        fetch(`http://localhost:3001/todos/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: newText })
        })
            .then(res => res.json())
            .then(data => {
                const newTodos = todos.map(todo =>
                    todo._id === id ? data : todo
                );
                setTodos(newTodos);
            })
            .catch(err => console.error("更新文字失敗：", err));
    };


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