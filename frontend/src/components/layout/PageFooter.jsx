import { appConfig } from "../../config/appConfig";
import { formatTime } from "../../utils/format";
import { useLastUpdated } from "../../hooks/useLastUpdated";

export default function PageFooter() {
  const { lastUpdatedAt } = useLastUpdated();

  return (
    <footer className="page-footer">
      <span>{appConfig.footerName}</span>
      <span className="page-footer__updated">Last updated today, {formatTime(lastUpdatedAt)}</span>
    </footer>
  );
}
