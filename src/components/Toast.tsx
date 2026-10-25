export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  if (!message) return null;
  return <p className="save-message" role="status">{message}<button onClick={onClose} aria-label="Dismiss message">×</button></p>;
}
