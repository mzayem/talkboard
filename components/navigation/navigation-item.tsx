"use client";

import Image from "next/image";
import ActionTooltip from "../action-tooltip";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";

interface NavigationItemProps {
  id: string;
  name: string;
  imageUrl: string;
}

export default function NavigationItem({
  id,
  name,
  imageUrl,
}: NavigationItemProps) {
  const params = useParams();
  const router = useRouter();

  const onClick = () => {
    router.push(`/courses/${id}`);
  };

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button onClick={onClick} className="group relative flex items-center">
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.courseId !== id && "group-hover:h-[20px]",
            params?.courseId === id ? "h-[36px]" : "h-[8px]",
          )}
        />
        <div
          className={cn(
            "relative group flex mx-3 h-[48px] w-[48px] rounded-[16px] transition-all overflow-hidden",
            params?.courseId !== id &&
              "bg-primary/10 text-primary rounded-[16px]",
          )}
        >
          <Image
            fill
            src={imageUrl}
            alt={name}
            className="object-cover h-full w-full"
          />
        </div>
      </button>
    </ActionTooltip>
  );
}
