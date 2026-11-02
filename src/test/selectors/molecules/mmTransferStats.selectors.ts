type Query<T> = (selector: string) => T

export function mmTransferStatsSelectors<T>(query: Query<T>) {
  const root = 'section.transfer-stats'
  const item = `${root} .transfer-stats__item`
  const download = `${item}:first-child`
  const upload = `${item}:last-child`

  return {
    get: () => query(root),
    labelled: () => query(`${root}[aria-label="Overall transfer speeds"]`),
    items: () => query(item),
    item: (index: number) => query(`${item}:nth-child(${index * 2 + 1})`),
    headings: () => query(`${item} .transfer-stats__heading`),
    labels: () => query(`${item} .transfer-stats__label`),
    values: () => query(`${item} .transfer-stats__value`),
    icons: () => query(`${item} .transfer-stats__icon svg`),
    decorativeIcons: () =>
      query(`${item} .transfer-stats__icon svg[aria-hidden="true"][focusable="false"]`),
    divider: () => query(`${root} .transfer-stats__divider`),
    decorativeDivider: () => query(`${root} .transfer-stats__divider[aria-hidden="true"]`),
    download: () => query(download),
    downloadLabel: () => query(`${download} .transfer-stats__label`),
    downloadValue: () => query(`${download} .transfer-stats__value`),
    downloadIcon: () => query(`${download} .transfer-stats__icon svg`),
    upload: () => query(upload),
    uploadLabel: () => query(`${upload} .transfer-stats__label`),
    uploadValue: () => query(`${upload} .transfer-stats__value`),
    uploadIcon: () => query(`${upload} .transfer-stats__icon svg`),
    liveRegions: () => query(`${root} [aria-live], ${root}[aria-live]`),
    labelledValues: () => query(`${item} .transfer-stats__value[aria-label]`),
  }
}
