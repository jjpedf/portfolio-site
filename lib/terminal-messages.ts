export type TerminalMsgType = 'info' | 'success' | 'warn' | 'cmd'

export function terminalLog(text: string, type: TerminalMsgType = 'info') {
  if (typeof window === 'undefined') return
  window.dispatchEvent(
    new CustomEvent('terminal:log', { detail: { text, type } })
  )
}

export const MSG = {
  about: '[data] mapping domain expertise... O2C · P2P · Inventory · IntTrade',
  projects: '[query] SELECT * FROM projects WHERE impact > 0 LIMIT 3 -- 3 rows returned',
  process: '[pipeline] tracing data lineage: raw → stg → int → mart → semantic',
  stack: '[env] resolving stack: dbt · BigQuery · Airflow · Looker · SQL · Python',
  contact: '[sys] opening connection... linkedin.com/in/jorge-peduti',
  pipelineRaw: '[inspect] RAW SOURCE: schema inconsistencies detected. Mapping...',
  pipelineTransform: '[dbt] running models: stg_orders → int_ar_aging → mart_revenue. done.',
  pipelineImpact: '[query] SELECT kpi, delta FROM mart.executive_summary -- board approved',
  projectInspect: (num: string) =>
    `[sys] fetching project credentials... ${num} unlocked`,
  langSwitch: (lang: string) =>
    `[sys] locale switched to ${lang.toUpperCase()}. rehydrating content...`,
  formSent: '[smtp] message queued for delivery. status=200 OK',
}
