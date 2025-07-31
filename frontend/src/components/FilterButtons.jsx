// 這個元件會顯示三個篩選按鈕（全部 / 已完成 / 未完成）
// 按下後會改變父元件傳進來的 filter 狀態

function FilterButtons({current,setFilter}){
    
    // 定義一個按鈕清單，每個按鈕對應一個篩選條件
    const types = [
        {label: '全部', value: 'all'},
        {label: '已完成', value: 'done'},
        {label: '未完成', value: 'undone'}

    ];

    return(
        <div className="filter-group control-group">
            {/* 用 map 把每個篩選類型渲染成一顆按鈕 */}
            {types.map((btn) => (
                <button
                    key={btn.value}// React 要求每個列表項目有唯一 key
                    className={current === btn.value?'active':''}// 如果是當前選中的篩選類型，就加上 active 樣式
                    onClick={() => setFilter(btn.value)}// 按下按鈕時，呼叫父元件提供的 setFilter 函式來更新篩選狀態
                >{btn.label}</button>
        ))}
        </div>
    );
}

export default FilterButtons;// 匯出元件，讓其他檔案（例如 App.jsx）可以引入使用