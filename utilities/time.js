export function timePretty(diffMs) {
  const minutes = Math.floor(diffMs / 1000 / 60);
  const remaining = diffMs - minutes * 60 * 1000;
  const seconds = Math.ceil(remaining / 1000);

  return (
    ("" + minutes).padStart(2, "0") + ":" + ("" + seconds).padStart(2, "0")
  );
}
