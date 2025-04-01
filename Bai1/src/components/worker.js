self.onmessage = function (event) {
  const text = event.data;

  // Kiểm tra ký tự hợp lệ
  if (!/^[a-zA-Z .,]+$/.test(text)) {
    self.postMessage({
      success: false,
      error: "File chứa ký tự không hợp lệ!",
    });
    return;
  }

  // Xử lý văn bản
  const words = text
    .toLowerCase()
    .replace(/[.,]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const wordCount = {};
  words.forEach((word) => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  const uniqueWords = Object.keys(wordCount).length;

  if (uniqueWords < 3) {
    self.postMessage({
      success: false,
      error: "File cần chứa ít nhất 3 từ khác nhau!",
    });
    return;
  }

  const topWords = Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  self.postMessage({
    success: true,
    data: { uniqueWords, topWords },
  });
};
