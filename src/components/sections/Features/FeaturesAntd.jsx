import React from "react";
import { Card, Col, Row, Typography } from "antd";

const { Title, Paragraph } = Typography;

const FeaturesAntd = ({ features = [] }) => {
  if (!Array.isArray(features)) {
    return <div>Error: Invalid features data</div>;
  }
  return (
    <Row gutter={16}>
      {features.map((feature, index) => (
        <Col key={index} span={8}>
          <Card>
            {feature.icon}
            <Title level={4}>{feature.title}</Title>
            <Paragraph>{feature.description}</Paragraph>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default FeaturesAntd;
