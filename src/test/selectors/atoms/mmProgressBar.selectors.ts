type Query<T> = (selector: string) => T

export function mmProgressBarSelectors<T>(query: Query<T>) {
  const root = '.mm-progress-bar'
  const track = `${root} .mm-progress-bar__track[role="progressbar"]`

  return {
    get: () => query(root),
    header: () => query(`${root} .mm-progress-bar__header`),
    label: () => query(`${root} .mm-progress-bar__label`),
    percentage: () => query(`${root} .mm-progress-bar__percentage`),
    track: () => query(track),
    fill: () => query(`${root} .mm-progress-bar__fill`),
    value: (value: number) => query(`${track}[aria-valuenow="${value}"]`),
    empty: () => query(`${track}[aria-valuenow="0"]`),
    complete: () => query(`${track}[aria-valuenow="100"]`),
  }
}
