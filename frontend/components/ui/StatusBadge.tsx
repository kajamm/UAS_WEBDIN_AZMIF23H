// frontend/components/ui/StatusBadge.tsx
// Komponen badge status (online/offline/loading)

interface StatusBadgeProps {
  status: 'online' | 'offline' | 'loading';
  label?: string;
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = {
    online: {
      color: 'bg-green-100 text-green-800 border-green-200',
      dot: 'bg-green-500',
      text: label ?? 'Online',
    },
    offline: {
      color: 'bg-red-100 text-red-800 border-red-200',
      dot: 'bg-red-500',
      text: label ?? 'Offline',
    },
    loading: {
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      dot: 'bg-yellow-500 animate-pulse',
      text: label ?? 'Checking...',
    },
  };

  const { color, dot, text } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${color}`}
    >
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {text}
    </span>
  );
}
