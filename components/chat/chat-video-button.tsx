"use client";

import qs from "query-string";
import ActionTooltip from "../action-tooltip";
import { Video, VideoOff } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ChatVideoButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const isVideo = searchParams?.get("video");

  const handleClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true },
    );
    router.push(url);
  };

  const Icon = isVideo ? VideoOff : Video;
  const tooltiplabel = isVideo ? "End video Lecture" : "Start video Lecture";
  return (
    <ActionTooltip side="bottom" label={tooltiplabel}>
      <button
        onClick={handleClick}
        className="hover:opacity-75 transition mr-4"
      >
        <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
      </button>
    </ActionTooltip>
  );
}
