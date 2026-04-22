import { Link, useNavigate } from "react-router";

import { MoveLeft } from "lucide-react";

interface BackProps {
  to?: string;
  text?: string;
  onClick?: () => void;
  className?: string;
}

const Back = ({ to, text, onClick, className = "link" }: BackProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  const content = (
    <>
      <MoveLeft /> <span>{text ? text : "Vissza"}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <p
      role='button'
      onClick={handleClick}
      className={className}
      style={{ cursor: "pointer" }}>
      {content}
    </p>
  );
};

export default Back;
