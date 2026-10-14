import { useState } from "react";
import { appConfig } from "../../config/appConfig";
import { formatTime } from "../../utils/format";

export default function PageFooter() {
  const [updatedAt] = useState(() => new Date());

  return (
    <footer className="page-footer">
      <span>{appConfig.footerName}</span>
      <span className="page-footer__updated">Last updated today, {formatTime(updatedAt)}</span>
    </footer>
  );
}
