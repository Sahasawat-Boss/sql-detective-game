import type { MessageTone } from "@/types";

const TONE_CLASS: Record<MessageTone, string> = {
  info: "msg-info",
  ok: "msg-ok",
  error: "msg-error",
};

export default function Message({
  tone = "info",
  children,
}: {
  tone?: MessageTone;
  children: React.ReactNode;
}) {
  return <div className={`msg ${TONE_CLASS[tone]}`}>{children}</div>;
}
