"use client";

import { z } from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Check, Clock, Plus, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { EmojiPicker } from "@/components/emoji-picker";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, string>;
  name: string;
  type: "conversation" | "channel";
}

const formSchema = z.object({
  content: z.string().min(1),
});

export default function ChatInput({
  apiUrl,
  query,
  name,
  type,
}: ChatInputProps) {
  const [mounted, setMounted] = useState(false);
  const { onOpen } = useModal();
  const router = useRouter();
  const [statusStack, setStatusStack] = useState<
    { id: number; status: "sending" | "sent" | "error"; text: string }[]
  >([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const id = Date.now();
    const text = values.content;

    form.reset();

    // Add sending message to stack
    setStatusStack((prev) => [...prev, { id, status: "sending", text }]);

    try {
      const url = qs.stringifyUrl({ url: apiUrl, query });
      await axios.post(url, values);

      setStatusStack((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, status: "sent" } : msg)),
      );

      setTimeout(() => {
        setStatusStack((prev) => prev.filter((msg) => msg.id !== id));
      }, 500);
      router.refresh();
    } catch (error) {
      console.log(error);

      setStatusStack((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, status: "error" } : msg)),
      );

      setTimeout(() => {
        setStatusStack((prev) => prev.filter((msg) => msg.id !== id));
      }, 3000);
    }
  };

  if (!mounted) {
    return null;
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                {statusStack.length > 0 && (
                  <div className="fixed bottom-24 right-4 z-50 flex flex-col-reverse gap-2">
                    {statusStack.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex items-center gap-2 px-4 py-2 rounded shadow-md text-sm text-zinc-600 bg-zinc-200/90 dark:text-zinc-200 dark:bg-zinc-700/75`}
                      >
                        {msg.status === "sending" && (
                          <Clock className="w-4 h-4" />
                        )}
                        {msg.status === "sent" && <Check className="w-4 h-4" />}
                        {msg.status === "error" && (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                        <span>{msg.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                <FormControl>
                  <div className="relative p-4 pb-6">
                    <button
                      type="button"
                      onClick={() => onOpen("messageFile", { apiUrl, query })}
                      className="absolute top-7 left-8 h-[24px] w-[24px]
                    bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 
                    dark:hover:bg-zinc-300 transition rounded-full p-1 
                    flex items-center justify-center"
                    >
                      <Plus className="h-4 w-4 text-white dark:text-[#313338]" />
                    </button>
                    <Input
                      className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 rounded-full
                    focus-visible:ring-1 dark:focus-visible:ring-zinc-200/50 ring-offset-0 text-zinc-600 dark:text-zinc-200"
                      placeholder={`Message ${type === "conversation" ? name : "#" + name} `}
                      {...field}
                    />
                    <div className="absolute top-7 right-8">
                      <EmojiPicker
                        onChange={(emoji: string) =>
                          field.onChange(`${field.value} ${emoji}`)
                        }
                      />
                    </div>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
}
