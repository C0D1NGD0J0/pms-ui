import { Tooltip } from "../FormElements";

export const renderTruncatedText = (
  text: string,
  maxWidth: string = "200px"
) => {
  if (!text) return "N/A";

  return (
    <Tooltip content={text} placement="bottom">
      <span className="truncated-text" style={{ maxWidth }}>
        {text}
      </span>
    </Tooltip>
  );
};
