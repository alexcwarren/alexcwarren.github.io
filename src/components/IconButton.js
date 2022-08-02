import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";

function IconButton(props) {
  return (
    <Button
      variant="accent2"
      className="accent2 btn-sm rounded-circle p-0 mx-2 my-1"
    >
      <Image src={props.image} height={50} roundedCircle />
    </Button>
  );
}

export default IconButton;
