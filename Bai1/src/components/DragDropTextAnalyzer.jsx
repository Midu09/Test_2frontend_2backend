// import { useState, useEffect } from "react";

// export default function DragDropTextAnalyzer() {
//   const [error, setError] = useState("");
//   const [stats, setStats] = useState(null);
//   const [worker, setWorker] = useState(null);

//   useEffect(() => {
//     const newWorker = new Worker(new URL("./worker.js", import.meta.url));
//     newWorker.onmessage = (event) => {
//       const { success, data, error } = event.data;
//       if (success) {
//         setStats(data);
//         setError("");
//       } else {
//         setError(error);
//         setStats(null);
//       }
//     };
//     setWorker(newWorker);
//     return () => newWorker.terminate();
//   }, []);

//   const handleDrop = (event) => {
//     event.preventDefault();
//     setError("");
//     setStats(null);

//     const file = event.dataTransfer.files[0];
//     if (!file) return;
//     if (file.type !== "text/plain" || !file.name.endsWith(".txt")) {
//       setError("File phải có định dạng .txt");
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const text = e.target.result;
//       worker.postMessage(text);
//     };
//     reader.readAsText(file);
//   };

//   return (
//     <div
//       onDrop={handleDrop}
//       onDragOver={(e) => e.preventDefault()}
//       className="p-6 border-2 border-dashed rounded-lg text-center bg-gray-100"
//     >
//       <p>Kéo và thả file .txt vào đây</p>
//       {error && <p className="text-red-500 mt-2">{error}</p>}
//       {stats && (
//         <div className="mt-4">
//           <p>Tổng số từ khác nhau: {stats.uniqueWords}</p>
//           <p>3 từ phổ biến nhất:</p>
//           <ul>
//             {stats.topWords.map(([word, count]) => (
//               <li key={word}>
//                 {word}: {count} lần
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from "react";

export default function DragDropTextAnalyzer() {
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [worker, setWorker] = useState(null);

  useEffect(() => {
    const newWorker = new Worker(new URL("./worker.js", import.meta.url));
    newWorker.onmessage = (event) => {
      const { success, data, error } = event.data;
      if (success) {
        setStats(data);
        setError("");
      } else {
        setError(error);
        setStats(null);
      }
    };
    setWorker(newWorker);
    return () => newWorker.terminate();
  }, []);

  const handleDrop = (event) => {
    event.preventDefault();
    setError("");
    setStats(null);

    const file = event.dataTransfer.files[0];
    if (!file) return;
    if (file.type !== "text/plain" || !file.name.endsWith(".txt")) {
      setError("File phải có định dạng .txt");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      worker.postMessage(text);
    };
    reader.readAsText(file);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="p-6 border-2 border-dashed rounded-lg text-center bg-gray-100 shadow-lg max-w-lg mx-auto mt-10 hover:border-blue-500 transition-all"
    >
      <p className="text-lg font-semibold text-gray-700">
        Kéo và thả file .txt vào đây
      </p>
      {error && <p className="text-red-500 mt-2 font-medium">{error}</p>}
      {stats && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
          <p className="font-semibold text-gray-800">
            Tổng số từ khác nhau: {stats.uniqueWords}
          </p>
          <p className="mt-2 text-gray-700">3 từ phổ biến nhất:</p>
          <ul className="list-disc list-inside mt-1 text-gray-600">
            {stats.topWords.map(([word, count]) => (
              <li key={word} className="font-medium">
                {word}: {count} lần
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
