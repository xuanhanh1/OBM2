import { PageHeader } from "antd";
import React, { useEffect, useState } from "react";
import { Row, Col, Spin } from "antd";
import ContractTypeChart from "./contractTypeChart";
import SupplierType from "./supplierType";
import OrderSupplier from "./orderSupplierChart";
import CheckoutChart from "./checkoutChart";
import RequestPaymentStatusChart from "./requestPaymentStatusChart";
import RequestPaymentDebtChart from "./requestPaymentDebtChart";
import ContractPackageTypeChart from "./contractPackageTypeChart";
import callApi from "../../../../config/configApi";
import OverviewCard from "./overviewCard";
// const token = "Bearer " + JSON.parse(localStorage.getItem("token"));
// const getObjectRequest = (id, urlApi) => {
//   return {
//     id: id,
//     method: "GET",
//     url: urlApi,
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: token,
//       accept: "application/json",
//     },
//   };
// };
// const getBody = () => {
//   const currentYear = new Date().getFullYear();
//   const body = {
//     requests: [
//       getObjectRequest(
//         "0",
//         `/api/Dashboard/GetSumMoneyGroupbyMonth/${currentYear}`
//       ),
//       getObjectRequest(
//         "1",
//         "/api/Dashboard/GetCountRequestPaymentGroupbyStatus"
//       ),
//       getObjectRequest("2", "/api/Dashboard/GetCountContractGroupbyType"),
//       getObjectRequest(
//         "3",
//         "/api/Dashboard/GetCountContractGroupbyTypePackage"
//       ),
//       getObjectRequest("4", "/api/Dashboard/GetCountSupplierGroupbyType"),
//     ],
//   };
//   return body;
// };

function Dashboard(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [dataChart, setDataChart] = useState({});

  // useEffect(() => {
  //   setIsLoading(true);
  //   const body = getBody();
  //   callApi(`odata/$batch`, "POST", JSON.stringify(body))
  //     .then((res) => {
  //       const dataArr = [...res.data.responses];
  //       const data_CheckoutChart = dataArr[0].body;
  //       const data_RequestPaymentGroupbyStatus = dataArr[1].body;
  //       const data_GetCountContractGroupbyType = dataArr[2].body;
  //       const data_ContractPackageTypeChart = dataArr[3].body;
  //       const data_CountSupplierGroupbyType = dataArr[4].body;
  //       const data = {
  //         data_CheckoutChart,
  //         data_RequestPaymentGroupbyStatus,
  //         data_GetCountContractGroupbyType,
  //         data_ContractPackageTypeChart,
  //         data_CountSupplierGroupbyType,
  //       };
  //       setDataChart(data);
  //       setIsLoading(false);
  //     })
  //     .catch((err) => {
  //       console.log(err.response);
  //       setIsLoading(false);
  //     });
  // }, []);

  return (
    <React.Fragment>
      <Spin spinning={isLoading}>
        {/* <Row gutter={[16, 16]} style={{ marginBottom: "10px" }}>
          <Col span={5}>
            <OverviewCard />
          </Col>
          <Col span={19}>
            <CheckoutChart dataChart={dataChart.data_CheckoutChart} />
          </Col>
         
        </Row> */}

        <Row
          gutter={[16, 16]}
          style={{ marginBottom: "20px", marginTop: "10px" }}
        >
          <Col span={24}>
            <OrderSupplier />
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginBottom: "10px" }}>
          <Col span={12}>
            <RequestPaymentStatusChart />
          </Col>
          <Col span={12}>
            <RequestPaymentDebtChart />
          </Col>
        </Row>
      </Spin>
    </React.Fragment>
  );
}
export default Dashboard;
