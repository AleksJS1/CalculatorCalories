import { qs, clearElement, createInfoCell } from './dom.js';
import { kpiRows, prettyJson } from './formatters.js';

export function createDashboardModule({ store }) {
  const kpiBlock = qs('#kpi-block');
  const weeklySeries = qs('#weekly-series');
  const weightTrend = qs('#weight-trend');

  function renderKpi(snapshot) {
    clearElement(kpiBlock);
    kpiRows(snapshot).forEach((row) => {
      kpiBlock.appendChild(createInfoCell(row.label, row.value));
    });
  }

  function renderSeries(series) {
    weeklySeries.textContent = prettyJson(series || []);
  }

  function renderWeightTrend(data) {
    weightTrend.textContent = prettyJson(data || {});
  }

  function render() {
    const state = store.getState();
    renderKpi(state.snapshot);
    renderSeries(state.weeklySeries);
    renderWeightTrend(state.weightTrend);
  }

  return {
    render
  };
}
