import { formatNumber } from "../../utils/format";
import "./StockFlowChart.css";

const CHART_HEIGHT = 140;

export default function StockFlowChart({ flowData = [], dateRange = "", todayIn = 0, todayOut = 0 }) {
  const highestQuantity = Math.max(0, ...flowData.flatMap((day) => [day.inQty, day.outQty]));
  const maxY = highestQuantity === 0 ? 0 : Math.ceil(highestQuantity / 10) * 10;
  const scaleMax = maxY || 1;
  const middleY = Math.ceil(maxY / 2);

  return (
    <div className="stock-flow" role="region" aria-label="The flow of stock chart">
      <div className="stock-flow__head">
        <h2 className="stock-flow__title">The flow of stock</h2>
        <span className="stock-flow__date-range">{dateRange}</span>
      </div>

      <div className="stock-flow__body">
        <div className="stock-flow__legend">
          <div className="stock-flow__legend-item">
            <span className="stock-flow__dot stock-flow__dot--in" aria-hidden="true" />
            <span>Stock-in / {todayIn}</span>
          </div>
          <div className="stock-flow__legend-item">
            <span className="stock-flow__dot stock-flow__dot--out" aria-hidden="true" />
            <span>Stock-out / {todayOut}</span>
          </div>
          <span className="stock-flow__legend-meta">Today · Units</span>
        </div>

        <div className="stock-flow__chart-area">
          <div className="stock-flow__y-axis" aria-hidden="true">
            <span>{formatNumber(maxY)}</span>
            <span>{formatNumber(middleY)}</span>
            <span>0</span>
          </div>

          <div className="stock-flow__plot">
            <div className="stock-flow__grid-line stock-flow__grid-line--top" />
            <div className="stock-flow__grid-line stock-flow__grid-line--mid" />
            <div className="stock-flow__grid-line stock-flow__grid-line--zero" />

            <div className="stock-flow__bars">
              {flowData.map((d) => {
                const inHeight = Math.round((d.inQty / scaleMax) * CHART_HEIGHT);
                const outHeight = Math.round((d.outQty / scaleMax) * CHART_HEIGHT);

                return (
                  <div className="stock-flow__group" key={d.date}>
                    <div className="stock-flow__bar-pair">
                      <div
                        className="stock-flow__bar stock-flow__bar--in"
                        style={{ height: `${inHeight}px` }}
                        title={`${d.dateKey}: Stock-in ${formatNumber(d.inQty)} units`}
                      />
                      <div
                        className="stock-flow__bar stock-flow__bar--out"
                        style={{ height: `${outHeight}px` }}
                        title={`${d.dateKey}: Stock-out ${formatNumber(d.outQty)} units`}
                      />
                    </div>
                    <span className="stock-flow__x-label">{d.date}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
