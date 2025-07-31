// 引入 React 提供的兩個 Hook：useState（狀態）與 useEffect（副作用）
import { useState, useEffect } from "react";

// 引入自己寫的元件（注意：要從 components 資料夾來匯入）
import TodoInput from './components/TodoInput';
import FilterButtons from './components/FilterButtons';
import TodoList from './components/TodoList';
import './styles/style.css';// 引入樣式表


function App() {

  // 每次 todos 改變時，React 會重新渲染畫面

  // todos：儲存所有待辦事項的陣列
  // setTodos：修改 todos 的函式
  const [todos, setTodos] = useState([]);

  // filter：目前選擇的篩選類型（all / done / undone）
  const [filter, setFilter] = useState("all");

  // isReady：用來判斷資料是否讀取完畢，避免過早渲染造成畫面異常
  const [isReady, setIsReady] = useState(false);



  // useEffect 是 React 的 Hook，會在畫面渲染後執行裡面的程式碼
  useEffect(() => {

    // 使用 fetch 向後端伺服器（使用 Express 架設，連接 MongoDB 資料庫）發送 GET 請求
    // 從後端獲取 todos 的所有資料（JSON 陣列）
    fetch("http://localhost:3001/todos")

      // .then 是 Promise 的語法：當伺服器回應成功時，
      // 把回應物件（res）轉換成 JSON 格式的資料（res.json() 也會回傳一個 Promise）
      .then(res => res.json())

      // 接著，再處理剛剛轉換出來的資料（data 就是 todos 的陣列）
      .then(data => {
        setTodos(data);// ← 把資料寫入 todos
        setIsReady(true);// ← 告訴畫面可以 render 了
      })

      // 如果請求過程中發生錯誤（例如連不上、伺服器崩潰），就會執行這個 catch 區塊
      .catch(err => {
        console.error("錯誤：", err);
        setIsReady(true);// ← 即使錯誤也要讓 isReady 設為 true，否則畫面會永遠卡在「不渲染狀態」，可以避免畫面卡住或出現空白
      });

  }, []);// 第二個參數為空陣列 []，代表只在「元件初次掛載時執行一次」這段程式碼（相當於 componentDidMount）



  // 新增新的待辦事項，再發送 POST 請求送到後端
  // text：從子元件 TodoInput 傳來的文字內容，用來組成一筆新的 todo 物件
  const addTodo = (text) => {
    const newTodo = {
      text,
      completed: false
    };

    fetch("http://localhost:3001/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newTodo)
    })
      .then(res => res.json())
      .then(createdTodo => {
        // 把後端成功建立並回傳的 todo 加進 todos 狀態中，畫面會自動重新渲染
        setTodos(prev => [...prev, createdTodo]);
      })
      .catch(err => {
        console.error("新增失敗：", err);
      });
  };



  // 對每一筆 todo 都發送 DELETE 請求
  // Promise.all 等待所有請求完成，確保全數成功後才清空畫面資料
  const clearAllTodos = () => {
    if (confirm("你確定要清空全部待辦事項嗎?")) {
      // 對每一筆 todo 發送 DELETE 請求
      // Promise.all 會同時並行執行所有刪除請求，等全部成功後再清空畫面
      // Promise.all([...])：同時發出所有請求，並等待它們全部都成功（或有任何一筆失敗）才繼續往下執行
      Promise.all(
        todos.map(todo =>
          // 注意：MongoDB 產生的每一筆 todo 都有一個唯一的 _id（非原本的數字 id）
          fetch(`http://localhost:3001/todos/${todo._id}`, {
            method: "DELETE"
          })
        )
      ).then(responses => {
        // 確認每一筆都有成功刪除
        const allSuccess = responses.every(res => res.ok);
        if (allSuccess) {
          setTodos([]);
        } else {
          alert("部分資料刪除失敗，請重試");
        }
      })
        .catch(err => {
          console.error("清空全部失敗", err);
          alert("清空失敗，請檢查後端狀況");
        });
    }
  };


  // isReady 確保當資料還沒讀取完畢時，不渲染畫面，避免錯誤或畫面閃爍
  if (!isReady) return null;


  // 畫面內容開始: 實際畫面要 render 的內容（JSX 區塊）
  // 傳入對應的 props 給子元件（TodoInput、FilterButtons、TodoList）
  // 每個子元件都會根據 props 決定要顯示什麼內容或怎麼處理邏輯
  return (
    <div className="container">
      <h1>我的待辦清單</h1>

      {/* 輸入框與新增按鈕區塊，會把輸入內容透過 onAdd 傳回來 */}
      <TodoInput onAdd={addTodo} />

      {/* 篩選按鈕區塊，負責切換 filter 狀態 */}
      <FilterButtons current={filter} setFilter={setFilter} />

      {/* 顯示清單區塊，會根據 todos + filter 去渲染畫面 */}
      <TodoList todos={todos} setTodos={setTodos} filter={filter} />

      {/* 清空全部按鈕，只有當 todos 有資料時才會顯示 */}
      {todos.length > 0 && (<button className="clear-button" onClick={clearAllTodos}>
        清空全部
      </button>)}
    </div>

  )
}

export default App;// 將 App 元件匯出，讓其他檔案可以引入並使用它（例如 main.jsx）

