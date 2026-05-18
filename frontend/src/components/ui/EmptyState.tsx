interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  icon = '📭',
}) => (
  <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-slate-200 mb-1">{title}</h3>
    {description && (
      <p className="text-sm text-slate-500 mb-6 text-center max-w-sm">{description}</p>
    )}
    {action}
  </div>
);