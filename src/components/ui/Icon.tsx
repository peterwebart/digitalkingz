import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  Briefcase,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  Code2,
  Compass,
  Cpu,
  Database,
  Gauge,
  Globe,
  Layers,
  LineChart,
  Lock,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  MessageSquare,
  Minus,
  Network,
  PenTool,
  Phone,
  Plus,
  Rocket,
  Scale,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Smile,
  Sparkles,
  Stethoscope,
  Target,
  TrendingUp,
  Users,
  Workflow,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react'

/**
 * Explicit icon registry.
 *
 * A static map keeps the bundle tree-shakeable and makes an unknown icon name
 * in the CMS a visible fallback rather than a runtime crash.
 */
const ICONS = {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  Briefcase,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  Code2,
  Compass,
  Cpu,
  Database,
  Gauge,
  Globe,
  Layers,
  LineChart,
  Lock,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  MessageSquare,
  Minus,
  Network,
  PenTool,
  Phone,
  Plus,
  Rocket,
  Scale,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Smile,
  Sparkles,
  Stethoscope,
  Target,
  TrendingUp,
  Users,
  Workflow,
  Wrench,
  Zap,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof ICONS

export function getIcon(name?: string | null): LucideIcon {
  if (name && name in ICONS) return ICONS[name as IconName]
  return Sparkles
}

export function Icon({
  name,
  className,
  strokeWidth = 1.5,
}: {
  name?: string | null
  className?: string
  strokeWidth?: number
}) {
  const Component = getIcon(name)
  return <Component className={className} strokeWidth={strokeWidth} aria-hidden="true" />
}
