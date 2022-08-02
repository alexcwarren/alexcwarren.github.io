import Button from "react-bootstrap/Button";

function MyButton(props) {
  return (
    <Button variant="accent2" className="accent2 mx-auto d-block">
      {props.text}
    </Button>
  );
}

export default MyButton;
