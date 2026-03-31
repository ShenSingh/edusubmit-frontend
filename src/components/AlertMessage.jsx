export default function AlertMessage({ type = "info", text }) {
  if (!text) {
    return null;
  }

  return <div className={`alert alert-${type}`}>{text}</div>;
}
