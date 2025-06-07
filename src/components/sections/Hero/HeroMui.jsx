import { Container, Typography, Button } from "@mui/material";

const HeroMui = ({ title, subtitle, buttonText, onEdit }) => {
  return (
    <Container style={{ textAlign: "center", padding: "2rem 0" }}>
      <Typography variant="h2" gutterBottom>
        {title || "Default Title"}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {subtitle || "Default Subtitle"}
      </Typography>
      <Button variant="contained" color="primary" onClick={onEdit}>
        {buttonText || "Default Button Text"}
      </Button>
    </Container>
  );
};

export default HeroMui;
