/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";

const WaterTrapVisualization = () => {
  const [input, setInput] = useState("3,0,2,0,4");
  const [heights, setHeights] = useState([3, 0, 2, 0, 4]);
  const [waterAmount, setWaterAmount] = useState(7);
  const canvasRef = useRef(null);

  useEffect(() => {
    const parsedHeights = input.split(",").map((num) => {
      const parsed = parseInt(num.trim(), 10);
      return isNaN(parsed) ? 0 : Math.max(0, parsed);
    });
    setHeights(parsedHeights);
    setWaterAmount(calculateTrappedWater(parsedHeights));
  }, [input]);

  useEffect(() => {
    drawWaterTrap();
  }, [heights]);

  function calculateTrappedWater(height) {
    if (height.length === 0) return 0;

    let n = height.length;
    let leftMax = Array(n).fill(0);
    let rightMax = Array(n).fill(0);
    let water = 0;

    leftMax[0] = height[0];
    for (let i = 1; i < n; i++) {
      leftMax[i] = Math.max(leftMax[i - 1], height[i]);
    }

    rightMax[n - 1] = height[n - 1];
    for (let i = n - 2; i >= 0; i--) {
      rightMax[i] = Math.max(rightMax[i + 1], height[i]);
    }

    for (let i = 0; i < n; i++) {
      water += Math.max(0, Math.min(leftMax[i], rightMax[i]) - height[i]);
    }

    return water;
  }

  function drawWaterTrap() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (heights.length === 0) return;

    const maxHeight = Math.max(...heights);
    if (maxHeight === 0) return;

    const padding = 20;
    const blockWidth = (canvas.width - 2 * padding) / heights.length;
    const blockHeight = (canvas.height - 2 * padding) / (maxHeight + 1);

    const leftMax = [];
    const rightMax = [];
    let maxL = 0,
      maxR = 0;

    for (let i = 0; i < heights.length; i++) {
      maxL = Math.max(maxL, heights[i]);
      leftMax[i] = maxL;
    }

    for (let i = heights.length - 1; i >= 0; i--) {
      maxR = Math.max(maxR, heights[i]);
      rightMax[i] = maxR;
    }

    for (let i = 0; i < heights.length; i++) {
      const left = padding + i * blockWidth;

      // Vẽ tường
      if (heights[i] > 0) {
        ctx.fillStyle = "#555";
        ctx.fillRect(
          left,
          canvas.height - padding - heights[i] * blockHeight,
          blockWidth,
          heights[i] * blockHeight
        );
      }

      // Vẽ nước bị giữ lại
      const waterHeight = Math.max(
        0,
        Math.min(leftMax[i], rightMax[i]) - heights[i]
      );
      if (waterHeight > 0) {
        ctx.fillStyle = "#3498db";
        ctx.fillRect(
          left,
          canvas.height - padding - (heights[i] + waterHeight) * blockHeight,
          blockWidth,
          waterHeight * blockHeight
        );
      }
    }
  }

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Bieu do giuu duoc bao nhieu luong nc:</h1>
      <div style={{ marginBottom: "20px" }}>
        <label
          htmlFor="height-input"
          style={{ display: "block", marginBottom: "5px" }}
        >
          Nhập chiều cao (cách nhau bằng dấu phẩy):
        </label>
        <input
          id="height-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ví dụ: 3,0,2,0,4"
          style={{ width: "100%", padding: "8px", fontSize: "16px" }}
        />
      </div>
      <div style={{ border: "1px solid #ccc", marginTop: "20px" }}>
        <canvas ref={canvasRef} width={700} height={400} />
      </div>
      <div style={{ marginTop: "10px", fontSize: "18px", fontWeight: "bold" }}>
        Lượng nước giữ lại: {waterAmount}
      </div>
      <div style={{ display: "flex", marginTop: "10px" }}>
        <div
          style={{ display: "flex", alignItems: "center", marginRight: "15px" }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              marginRight: "5px",
              backgroundColor: "#555",
              border: "1px solid #333",
            }}
          ></div>
          <span>CộtCột</span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: "20px",
              height: "20px",
              marginRight: "5px",
              backgroundColor: "#3498db",
              border: "1px solid #333",
            }}
          ></div>
          <span>Nước</span>
        </div>
      </div>
    </div>
  );
};

export default WaterTrapVisualization;
