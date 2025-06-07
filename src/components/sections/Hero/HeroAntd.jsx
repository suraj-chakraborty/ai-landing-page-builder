import { Typography, Button } from "antd";

const { Title, Paragraph } = Typography;

const HeroAntd = ({ title, subtitle, buttonText, onEdit }) => {
  return (
    <div style={{ textAlign: "center", padding: "2rem 0" }}>
      <Title level={1}>{title || "title"}</Title>
      <Paragraph>{subtitle || "subtitle"}</Paragraph>
      <Button type="primary" onClick={onEdit}>
        {buttonText || "button"}
      </Button>
    </div>
  );
};

export default HeroAntd;
