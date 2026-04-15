import { qs, clearElement, createInfoCell, createElement } from './dom.js';
import { calories, fixed, kpiRows, prettyJson } from './formatters.js';

export function createDashboardModule({ store }) {
  const kpiBlock = qs('#kpi-block');
  const summaryBlock = qs('#daily-summary');
  const progressBlock = qs('#macro-progress');
  const goalStatus = qs('#goal-status');
  const weeklySeries = qs('#weekly-series');
  const weightTrend = qs('#weight-trend');

  function renderDailySummary(snapshot) {
    clearElement(summaryBlock);

    const consumed = snapshot?.consumed || {};
    const remaining = snapshot?.remaining || {};
    const targets = snapshot?.targets || {};

    const cells = [
      { label: 'Ціль ккал', value: calories(targets.calories || 0) },
      { label: 'Спожито', value: calories(consumed.calories || 0) },
      { label: 'Спалено', value: calories(snapshot?.burned || 0) },
      { label: 'Залишок', value: calories(remaining.calories || 0) }
    ];

    cells.forEach((cell) => {
      const item = createElement('div', { className: 'dashboard-summary__item' });
      const label = createElement('div', { className: 'dashboard-summary__label', text: cell.label });
      const value = createElement('div', { className: 'dashboard-summary__value', text: cell.value });
      item.append(label, value);
      summaryBlock.appendChild(item);
    });
  }

  function createProgressItem(label, currentValue, targetValue, unit) {
    const wrapper = createElement('div', { className: 'progress-item' });
    const percent = targetValue > 0 ? Math.min((currentValue / targetValue) * 100, 100) : 0;

    const head = createElement('div', { className: 'progress-item__head' });
    const title = createElement('span', { text: label });
    const meta = createElement('span', {
      className: 'progress-item__meta',
      text: `${fixed(currentValue, 1)} / ${fixed(targetValue, 1)} ${unit}`
    });
    const bar = createElement('div', { className: 'progress-item__bar' });
    const fill = createElement('div', { className: 'progress-item__fill' });

    fill.style.width = `${percent}%`;
    bar.appendChild(fill);
    head.append(title, meta);
    wrapper.append(head, bar);
    return wrapper;
  }

  function renderMacroProgress(snapshot) {
    clearElement(progressBlock);

    const consumed = snapshot?.consumed || {};
    const targets = snapshot?.targets || {};

    [
      createProgressItem('Калорії', consumed.calories || 0, targets.calories || 0, 'ккал'),
      createProgressItem('Білки', consumed.protein || 0, targets.protein || 0, 'г'),
      createProgressItem('Жири', consumed.fat || 0, targets.fat || 0, 'г'),
      createProgressItem('Вуглеводи', consumed.carbs || 0, targets.carbs || 0, 'г')
    ].forEach((item) => progressBlock.appendChild(item));
  }

  function renderGoalStatus(snapshot) {
    const remainingCalories = snapshot?.remaining?.calories || 0;
    const burned = snapshot?.burned || 0;
    const net = snapshot?.netCalories || 0;

    goalStatus.textContent = `День зараз: спожито ${fixed(net, 0)} ккал нетто, залишок ${fixed(remainingCalories, 0)} ккал, витрачено ${fixed(burned, 0)} ккал.`;
  }

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
    renderDailySummary(state.snapshot);
    renderMacroProgress(state.snapshot);
    renderGoalStatus(state.snapshot);
    renderKpi(state.snapshot);
    renderSeries(state.weeklySeries);
    renderWeightTrend(state.weightTrend);
  }

  return {
    render
  };
}
