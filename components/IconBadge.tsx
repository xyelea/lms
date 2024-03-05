import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { LucideIcon } from "lucide-react";

// Tentukan variasi latar belakang untuk IconBadge
const backgroundVariants = cva(
  "rounded-full flex items-center justify-center", // Kelas dasar untuk latar belakang
  {
    variants: {
      variant: {
        default: "bg-sky-100", // Variasi default untuk latar belakang
        success: "bg-emerald-100", // Variasi untuk latar belakang yang berhasil
      },
      iconVariant: {
        default: "text-sky-700", // Variasi default untuk ikon
        success: "text-emerald-700", // Variasi untuk ikon yang berhasil
      },
      size: {
        default: "p-2", // Ukuran default
        sm: "p-1", // Ukuran kecil (sm)
      },
    },
    defaultVariants: {
      variant: "default", // Variasi default untuk latar belakang
      size: "default", // Ukuran default
    },
  }
);

// Tentukan variasi untuk ikon
const iconVariants = cva("", {
  variants: {
    variant: { default: "text-sky-700", success: "text-emerald-700" }, // Variasi untuk warna ikon
    size: { default: "h-8 w-8", sm: "h-4 w-4" }, // Variasi untuk ukuran ikon
  },
  defaultVariants: {
    variant: "success", // Variasi default untuk warna ikon
    size: "default", // Ukuran default
  },
});

// Tentukan properti yang dapat bervariasi untuk latar belakang
type BackgroundVariantsProps = VariantProps<typeof backgroundVariants>;
// Tentukan properti yang dapat bervariasi untuk ikon
type IconVariantsProps = VariantProps<typeof iconVariants>;

// Definisikan properti untuk IconBadge
interface IconBadgeProps extends BackgroundVariantsProps, IconVariantsProps {
  icon: LucideIcon; // Jenis ikon dari LucideIcon
}

// Komponen IconBadge
export const IconBadge = ({ icon: Icon, variant, size }: IconBadgeProps) => {
  return (
    <div className={cn(backgroundVariants({ variant, size }))}>
      <Icon className={cn(iconVariants({ variant, size }))} />
    </div>
  );
};
