// 引入 React 提供的兩個 Hook：useState（狀態）與 useEffect（副作用）
import { useState, useEffect } from "react";

// 引入自己寫的元件（注意：要從 components 資料夾來匯入）
import TodoInput from './components/TodoInput';
import FilterButtons from './components/FilterButtons';
import TodoList from './components/TodoList';
import './styles/style.css';// 引入樣式表


// 引入 Toast 功能與樣式相關設定
// 從 react-toastify 套件中引入兩個東西：
// - ToastContainer：畫面上要放置的元件，用來實際顯示 toast 訊息（必須放在畫面中才會顯示）
// - toast：一個函式，可以呼叫它來觸發提示訊息，例如 toast.success("新增成功")
import { ToastContainer, toast } from 'react-toastify';

// 引入 react-toastify 的內建 CSS 樣式檔案，否則 toast 訊息會沒有樣式（例如背景顏色、動畫、位置等）
// 這一行一定要加，否則畫面上會看不到 toast，或會變成一塊沒有設計的原始文字
import 'react-toastify/dist/ReactToastify.css';

// 改用集中管理的 API（把所有與後端溝通的請求統一放在一個檔案管理，方便維護與修改）
import { getTodos, createTodo, deleteAllTodos } from './services/api';


function App() {

  // 每次 todos 改變時，React 會重新渲染畫面

  // todos：儲存所有待辦事項的陣列
  // setTodos：修改 todos 的函式
  const [todos, setTodos] = useState([]);

  // filter：目前選擇的篩選類型（all / done / undone）
  const [filter, setFilter] = useState("all");

  // isReady：用來判斷資料是否讀取完畢，避免過早渲染造成畫面異常
  const [isReady, setIsReady] = useState(false);

  // 畫面初次載入時，向後端取得所有待辦資料
  useEffect(() => {
    (async () => {
      try {
        const data = await getTodos();// 呼叫 API 取得資料
        setTodos(data);// 把取得的資料存進 todos 狀態
      } catch (err) {
        console.error('讀取 todos 失敗：', err);
        toast.error(`讀取失敗：${err.message}`);// 顯示錯誤提示
      } finally {
        setIsReady(true);// 無論成功或失敗，都標記資料已讀取完成
      }
    })();
  }, []);// 空陣列代表只在元件第一次掛載時執行


  // 新增待辦事項
  const addTodo = async (text) => {
    try {
      const created = await createTodo({ text, completed: false }); // 呼叫 API 新增一筆待辦
      setTodos(prev => [...prev, created]);// 使用函式型 setState，確保更新時不會覆蓋掉舊資料
       toast.success('新增成功！');
    } catch (err) {
      console.error('新增失敗：', err);
      toast.error(`新增失敗：${err.message}`);
    }
  };


  // 清空全部待辦事項
  const clearAllTodos = async () => {
  if (!confirm("你確定要清空全部待辦事項嗎?")) return;// 確認視窗
  try {
    await deleteAllTodos();// 呼叫 API 批次刪除
    setTodos([]);// 清空前端狀態
    toast.success('刪除成功！');
  } catch (err) {
    console.error('清空全部失敗：', err);
    toast.error(`清空失敗：${err.message}`);
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

      <ToastContainer
        position="bottom-right"
        autoClose={1500}
        hideProgressBar={true}
        closeButton={false}
      />

    </div>

  )
}

export default App;// 將 App 元件匯出，讓其他檔案可以引入並使用它（例如 main.jsx）

