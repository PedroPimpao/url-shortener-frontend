import { Input } from "./ui/input";

interface UserProfileEditProps {
    id: string
    label: string
    value: string
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const UserProfileEdit = ({ id, label, value, onChange } : UserProfileEditProps) => {
  return (
    <div className="">
      <label htmlFor={id} className="mb-2 block text-[13px] font-bold">
        {label}
      </label>
      <Input
        id={id}
        value={value}
        minLength={2}
        maxLength={120}
        required
        onChange={onChange}
      />
    </div>
  );
};
