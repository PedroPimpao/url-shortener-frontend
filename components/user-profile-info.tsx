interface UserProfileInfoProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export const UserProfileInfo = ({
  icon,
  label,
  value,
}: UserProfileInfoProps) => {
  return (
    <div className="flex gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-wide text-[#8b8fa3] uppercase">
          {label}
        </p>
        <p className="mt-1 truncate text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
};
