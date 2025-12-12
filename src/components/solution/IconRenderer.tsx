import {
  BookOpen,
  Smartphone,
  MapPin,
  Clock,
  CreditCard,
  Layout,
  UtensilsCrossed,
  Timer,
  Eye,
  ArrowUpRight,
  Store,
  Armchair,
  Users,
  LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Smartphone,
  MapPin,
  Clock,
  CreditCard,
  Layout,
  UtensilsCrossed,
  Timer,
  Eye,
  ArrowUpRight,
  Store,
  Armchair,
  Users,
};

interface IconRendererProps {
  name: string;
  className?: string;
}

export const IconRenderer = ({ name, className = "h-5 w-5" }: IconRendererProps) => {
  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon className={className} />;
};
