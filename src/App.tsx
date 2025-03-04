import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex justify-between items-center w-1/4 min-h-screen m-auto bg-blue-200">
      <button
        className="px-4 py-2 rounded bg-amber-300 hover:bg-amber-200"
        onClick={() => setCount(count - 1)}
      >
        Kurangkan Cuy
      </button>
      <h1 className="text-3xl font-bold">{count}</h1>
      <button
        className="px-4 py-2 rounded bg-amber-300 hover:bg-amber-200"
        onClick={() => setCount(count + 1)}
      >
        Tambahkan Cuy
      </button>
    </div>
  );
}

export default App;
