import { useEffect, useMemo, useState } from "react"
import type { PortraitSource } from "../lib/portraits"

interface CharacterPortraitProps {
  source: PortraitSource
  ancestryLabel?: string | null
  classLabel?: string | null
  genderLabel?: string | null
}

const createAltText = (
  genderLabel?: string | null,
  ancestryLabel?: string | null,
  classLabel?: string | null,
) => {
  const segments = [genderLabel, ancestryLabel, classLabel].filter(
    (segment): segment is string => Boolean(segment && segment.trim()),
  )

  if (segments.length === 0) {
    return "Portrait of an adventurer"
  }

  const description = segments
    .map((segment, index) => (index === 0 ? segment : segment.toLowerCase()))
    .join(" ")

  return `Portrait of a ${description}`
}

export const CharacterPortrait = ({
  source,
  ancestryLabel,
  classLabel,
  genderLabel,
}: CharacterPortraitProps) => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(false)
  }, [source.src])

  const altText = useMemo(
    () => createAltText(genderLabel, ancestryLabel, classLabel),
    [ancestryLabel, classLabel, genderLabel],
  )

  return (
    <figure className="character-portrait" aria-live="polite">
      <div
        className={`character-portrait__frame${
          isLoaded ? " character-portrait__frame--loaded" : ""
        }`}
      >
        {!isLoaded && (
          <div className="character-portrait__placeholder" aria-hidden="true" />
        )}
        <img
          key={source.src}
          className="character-portrait__image"
          src={source.src}
          alt={altText}
          role="img"
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsLoaded(true)}
        />
      </div>
      {source.attribution && (
        <figcaption className="character-portrait__attribution">
          {source.attribution}
        </figcaption>
      )}
    </figure>
  )
}
