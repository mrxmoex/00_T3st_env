/** Renders the `backticked` spans of a message in the monospace style. */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split("`").map((part, index) =>
        index % 2 === 1 ? (
          <span key={index} className="mono">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
