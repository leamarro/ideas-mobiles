import Image from "next/image";
import { uploadImageProps } from "@/lib/upload-urls";

interface PortfolioItemProps {
  title: string;
  image: string;
  category: string;
  onClick: () => void;
  index: number;
}

export function PortfolioItem({ title, image, onClick }: PortfolioItemProps) {
  return (
    <div
      className="group relative aspect-[3/2] cursor-pointer overflow-hidden rounded-xl bg-zinc-200 shadow-soft transition-all duration-300 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-500"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Ver ${title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16.6vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        {...uploadImageProps(image)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95" />
      <div className="absolute inset-x-0 bottom-0 p-3">
        <span className="block truncate text-xs font-semibold text-white/90">{title}</span>
      </div>
      <div className="absolute right-3 top-3 flex h-8 w-8 translate-y-1 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      </div>
    </div>
  );
}
