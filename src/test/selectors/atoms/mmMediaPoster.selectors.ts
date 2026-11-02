export type MediaPosterSize = 'default' | 'small'

type Query<T> = (selector: string) => T

export function mmMediaPosterSelectors<T>(query: Query<T>) {
  const root = '.media-poster'
  const placeholder = `${root} .media-poster__placeholder`

  return {
    get: () => query(root),
    size: (size: MediaPosterSize) =>
      query(size === 'small' ? `${root}.media-poster--small` : `${root}:not(.media-poster--small)`),
    image: () => query(`${root} img.media-poster__image`),
    placeholder: () => query(`${placeholder}[role="img"]`),
    placeholderIcon: () => query(`${placeholder} span[aria-hidden="true"]`),
  }
}
