import * as LucideIcon from "lucide-react";
import { FC } from "react";

interface IDynamicIcon extends React.SVGProps<SVGSVGElement> {
  icon: string;
  className?: string;
}

const DynamicIcon: FC<IDynamicIcon> = ({ icon, ...props }) => {
  const Icon = LucideIcon[icon as keyof typeof LucideIcon] as React.ElementType;

  if (!Icon) {
    return <span className="text-sm">Icon not found</span>;
  }

  return <Icon {...props} />;
};

export default DynamicIcon;
