import type { LucideIcon } from "lucide-react";
import { Brain, GraduationCap, Sparkles, Users } from "lucide-react";

export const MARKETING_FEATURES: {
  key: string;
  title: string;
  description: string;
  Icon: LucideIcon;
  featured: boolean;
}[] = [
  {
    key: "tarot",
    title: "7 хоног бүрийн collective тарот уншлага",
    description: "12 орд болгоны тарот уншлага энд уншигдах болно.",
    Icon: Sparkles,
    featured: false,
  },
  {
    key: "psychology",
    title: "Сэтгэл зүйн тест",
    description: "Өөрийгөө гүнзгий таньж мэдэх сэтгэл зүйн шинжилгээнүүд.",
    Icon: Brain,
    featured: true,
  },
  {
    key: "community",
    title: "Community",
    description:
      "Та бүхэн өөрт тохиолдсон явдалуудаа бусадтай хуваалцах боломжтой.",
    Icon: Users,
    featured: false,
  },
  {
    key: "video",
    title: "Видео хичээл",
    description: "Одоогоор таны видео хичээлүүд энд байрлана.",
    Icon: GraduationCap,
    featured: false,
  },
];
