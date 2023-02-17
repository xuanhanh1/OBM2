import React, { useState, useEffect } from "react";
import { useLocalStorage, Input, Notification, callApi } from "../../index";
import { Col } from "antd";
import CardsCountUp from "./cardsCountUp";
import {
    AuditOutlined,
    ContainerOutlined,
    FileDoneOutlined,
    ExceptionOutlined,
} from "@ant-design/icons";
import img1 from "../../../../../src/common/assets/images/cdm2.png";
import img2 from "../../../../../src/common/assets/images/cdm1.png";
import img3 from "../../../../../src/common/assets/images/cdm3.png";
import img4 from "../../../../../src/common/assets/images/cdm4.png";
function OverviewCard(props) {
    const [data, setData] = useState({});
    useEffect(() => {
        callApi("api/Dashboard/GetCountOverview", "GET")
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.log(err.response.data);
            });
    }, [])
    return (
        <React.Fragment>
            <Col span={24} style={{ marginBottom: "10px"}}>
                <CardsCountUp
                    data={data.COUNT_PACKAGES}
                    content={"Gói"}
                    title={"Số gói thầu hiện tại"}
                    color={"#00aeff"}
                    icon={<ContainerOutlined />}
                    img ={<img src={img1} style={{height:'75px',position:'absolute',bottom:'-10px',right:'-5px',opacity:'0.7'}}/>}   
                />
            </Col>
            <Col span={24} style={{ marginBottom: "10px" }}>
                <CardsCountUp
                    data={data.COUNT_CONTRACTS}
                    content={"Hợp đồng"}
                    title={"Số hợp đồng còn hiệu lực"}
                    color={"#19E6A0"}
                    icon={<FileDoneOutlined />}
                    img ={<img src={img2} style={{height:'75px',position:'absolute',bottom:'-10px',right:'-5px',opacity:'0.7'}}/>}
                />
            </Col>
            <Col span={24} style={{ marginBottom: "10px" }}>
                <CardsCountUp
                    data={data.COUNT_SUPPLIERS}
                    content={"Công ty"}
                    title={"Số đơn vị cung cấp"}
                    color={"#FEB830"}
                    icon={<ExceptionOutlined />}
                    img ={<img src={img3} style={{height:'75px',position:'absolute',bottom:'-10px',right:'-5px',opacity:'0.7'}}/>}
                />
            </Col>
            <Col span={24} style={{ marginBottom: "10px" }}>
                <CardsCountUp
                    data={data.COUNT_BILLS}
                    content={"Hóa đơn"}
                    title={"Số hóa đơn giao hàng"}
                    color={"#EE202A"}
                    icon={<AuditOutlined />}
                    img ={<img src={img4} style={{height:'75px',position:'absolute',bottom:'-10px',right:'-5px',opacity:'0.7'}}/>}
                />
            </Col>
        </React.Fragment>
    );
}

export default OverviewCard;