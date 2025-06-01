"use client";

import qs from "query-string";
import ActionTooltip from "../action-tooltip";
import { Loader2, Video, VideoOff } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export default function ChatVideoButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();
  const [clicked, setClicked] = useState(false); // to help trigger loading immediately

  const isVideo = searchParams?.get("video");

  const handleClick = () => {
    setClicked(true); // Trigger immediate visual feedback

    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true },
    );

    startTransition(() => {
      router.push(url);
    });
  };

  const Icon = isVideo ? VideoOff : Video;
  const tooltipLabel = isVideo ? "End video Lecture" : "Start video Lecture";

  const showLoading = clicked && isPending;

  return (
    <ActionTooltip side="bottom" label={tooltipLabel}>
      <button
        onClick={handleClick}
        className="hover:opacity-75 transition mr-4"
        disabled={isPending}
      >
        {showLoading ? (
          <Loader2 className="h-6 w-6 text-zinc-500 dark:text-zinc-400  animate-spin" />
        ) : (
          <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400 " />
        )}
      </button>
    </ActionTooltip>
  );
}
