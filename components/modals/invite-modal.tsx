"use client";

import { useState } from "react";
import { useOrigin } from "@/hooks/use-origin";
import { useModal } from "@/hooks/use-modal-store";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import axios from "axios";

export default function InviteModal() {
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const origin = useOrigin();

  const isModalOpen = isOpen && type === "invite";
  const { course } = data;

  const [copied, setcopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inviteUrl = `${origin}/invite/${course?.inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setcopied(true);

    setTimeout(() => {
      setcopied(false);
    }, 1000);
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/courses/${course?.id}/invite-code`,
      );

      onOpen("invite", { course: response.data });
    } catch (error) {
      console.log("INVITE CODE ERROR", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite Users
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label
            className="uppercase text-xs font-bold
            text-zinc-500 dark:text-secondary/70"
          >
            Course Invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              readOnly
              disabled={isLoading}
              className="bg-zinc-300/50 border-0 
                  focus-visible:ring-0 text-black 
                  focus-visible:ring-offset-0"
              value={inviteUrl}
            />
            <Button size={"icon"} onClick={onCopy} disabled={isLoading}>
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <Button
            disabled={isLoading}
            variant={"link"}
            size={"sm"}
            className="text-xs text-zinc-500 mt-4 group"
            onClick={onNew}
          >
            {isLoading ? "Generating..." : "Generate a new Link"}
            <RefreshCw
              className={`h-4 w-4 ml-2 group-hover:rotate-90 transition ${
                isLoading && "animate-spin"
              }`}
            />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
