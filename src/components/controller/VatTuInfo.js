import { Avatar } from "antd";
export default function ProductInfo(item, count = 0) {
  return (
    <div>
      <div
        style={{
          display: count === 0 ? "flex" : "none",
          overflow: "hidden",
          backgroundColor: "white",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          padding: 10,
          paddingBottom: 5,
          zIndex: 999,
        }}
      >
        <h5 style={{ width: "30%", margin: 0 }}>Mã vật tư</h5>
        <h5 style={{ width: "49%", margin: 0 }}>Tên vật tư</h5>
      </div>
      <div
        className="product"
        style={{
          display: "flex",
          flexWrap: "nowrap",
          borderBottom: "1px double lightgray",
          padding: 5,
          fontSize: 13,
          marginTop: count === 0 ? 20 : 0,
          zIndex: 0,
        }}
      >
        <div style={{ width: "30%" }}>{item.MA_VT}</div>
        <div style={{ width: "50%", marginBottom: 5, whiteSpace: "pre-wrap" }}>
          {item.TEN_VT}
        </div>
      </div>
    </div>
  );
}
