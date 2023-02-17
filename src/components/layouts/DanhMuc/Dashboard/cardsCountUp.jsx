import React from "react";
import { Row, Col } from "antd";
import CountUp from "react-countup";

export default function cardsCountUp(props) {
  const { icon, color, data = "", title = "", content = "", img = null } = props;
  return (
    <div className="CardsCountUp">
      <Row style={{height:76}}>
        <Col span={6} style={{ alignSelf: "center", textAlign: "center", fontSize: 40, color: color }}>
          {icon}
        </Col>
        <Col span={18} style={{display:'flex'}}>
          <div style={{display:'flex',flexDirection:'column',zIndex:1}}>
            <p style={{ marginBottom: 0 }}>{title}</p>
            <p style={{ fontSize: 22, color: color }}>
              <CountUp end={data} duration={1} />
            </p>
            <p style={{ fontSize: 12, color: "lightgray", marginBottom: 0 }}>
              {content}
            </p>
          </div>
          {img}
        </Col>
      </Row>
    </div>
  );
}
