import Button from "react-bootstrap/Button";

function MyButton(props) {
  return (
    <Button
      variant="accent2"
      className="accent2 btn-md px-0 mx-auto d-block mybutton"
      id={props.id}
      href={props.href}
      target="_blank"
    >
      {props.text}
    </Button>
  );
}

export default MyButton;
