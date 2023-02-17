import React, { useState, useEffect } from "react";
import { Drawer, Row, Col, Descriptions, Button, Checkbox } from "antd";
import ReactJson from "react-json-view";
function DrawerChiTiet(props) {
    const { isVisible, setVisible, objView } = props;
    useEffect(() => {
       console.log(isJsonString(objView.parameters));
    }, []);
    const isJsonString = (str) => {
        if(str === '' || str === null || str === undefined) return false;
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
    const onClose = () => {
        setVisible({ isVisible: false, objView: {} });
      };

    return (
        <>
            <Drawer
                title={`Chi tiết`}
                placement="right"
                width={"65vw"}
                onClose={onClose}
                visible={isVisible}
                maskClosable={false}
            >
                <Row gutter={[8, 8]}>
                    <Col span={24}>
                        <h3>Thông tin:</h3>
                        <Descriptions size="small" bordered>
                            <Descriptions.Item label="UserName" span={1.5}>
                                {objView.user_name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Phương thức" span={1.5}>
                                {objView.service_name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Dịch vụ" span={1.5}>
                                {objView.method_name_vietsub}
                            </Descriptions.Item>
                            <Descriptions.Item label="IP" span={1.5}>
                                {objView.client_ip_address}
                            </Descriptions.Item>
                            <Descriptions.Item label="Quốc gia" span={1.5}>
                                {objView.country_name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thành phố" span={1.5}>
                                {objView.state}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trình duyệt" span={3}>
                                {objView.browser_info}
                            </Descriptions.Item>
                            <Descriptions.Item label="Input" span={3}>
                                {isJsonString(objView.parameters)  &&  <ReactJson src={JSON.parse(objView.parameters)}/>}
                               
                            </Descriptions.Item>
                       
                        </Descriptions>
                    </Col>
                </Row>
            </Drawer>
        </>
    );
}

export default DrawerChiTiet;