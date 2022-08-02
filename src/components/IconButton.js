import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";

function IconButton(props) {
  return (
    <Button
      variant="accent2"
      className="accent2 btn-sm rounded-circle p-0 btn-icon"
      href={props.href}
      target="_blank"
    >
      <Image src={props.image} height={40} roundedCircle />
    </Button>
  );
}

export default IconButton;
