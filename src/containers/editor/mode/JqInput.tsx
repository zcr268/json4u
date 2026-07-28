import { type ComponentPropsWithoutRef, type ElementRef, type FC, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { ViewMode } from "@/lib/db/config";
import { jq } from "@/lib/jq";
import { init as jqInit } from "@/lib/jq";
import { toastErr, toastSucc } from "@/lib/utils";
import { useEditorStore } from "@/stores/editorStore";
import { useStatusStore } from "@/stores/statusStore";
import { useTranslations } from "next-intl";
import { useShallow } from "zustand/shallow";
import InputBox from "./InputBox";

function useExecJq() {
  const t = useTranslations();
  const { main, secondary } = useEditorStore(
    useShallow((state) => ({
      main: state.main,
      secondary: state.secondary,
    })),
  );
  const { viewMode, setViewMode } = useStatusStore(
    useShallow((state) => ({
      viewMode: state.viewMode,
      setViewMode: state.setViewMode,
      setCommandMode: state.setCommandMode,
    })),
  );
  return async (filter: string) => {
    if (!filter) {
      toastSucc(t("cmd_exec_succ", { name: "jq" }));
      return;
    }

    if (viewMode != ViewMode.Text) {
      setViewMode(ViewMode.Text);
    }

    const { output, error } = await jq(main!.text(), filter);

    if (error) {
      toastErr(t("cmd_exec_fail", { name: "jq" }) + ": " + filter);
    } else {
      await secondary!.parseAndSet(output, {}, false);
      toastSucc(t("cmd_exec_succ", { name: "jq" }));
    }
  };
}

const JqInput: FC = forwardRef<ElementRef<typeof Input>, ComponentPropsWithoutRef<typeof Input>>(
  ({ className, ...props }, ref) => {
    const t = useTranslations();
    const execJq = useExecJq();

    return (
      <InputBox
        id="jq-input"
        initial={jqInit}
        run={execJq}
        placeholderFn={(loading) => (loading ? t("jq_loading") : t("jq_placeholder"))}
        {...props}
      />
    );
  },
);

JqInput.displayName = "JqInput";
export default JqInput;
