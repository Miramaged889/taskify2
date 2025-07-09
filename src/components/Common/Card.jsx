import PropTypes from "prop-types";

const Card = ({
  children,
  className = "",
  onClick = () => {},
  hover, // eslint-disable-line no-unused-vars
  padding, // eslint-disable-line no-unused-vars
  ...props
}) => {
  return (
    <div
      className={`bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  hover: PropTypes.bool,
  padding: PropTypes.string,
};

export default Card;
