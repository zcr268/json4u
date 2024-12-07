import { type ComponentPropsWithoutRef, type ElementRef, forwardRef, useEffect, useState } from "react";
import LoadingButton from "@/components/LoadingButton";
import { Input } from "@/components/ui/input";
import { ViewMode } from "@/lib/db/config";
import { useDebounceFn } from "@/lib/hooks";
import { jq } from "@/lib/jq";
import { init as jqInit } from "@/lib/jq";
import { cn, toastErr, toastSucc } from "@/lib/utils";
import { useEditorStore } from "@/stores/editorStore";
import { useStatusStore } from "@/stores/statusStore";
import { useUserStore } from "@/stores/userStore";
import { useTranslations } from "next-intl";
import { useShallow } from "zustand/shallow";

interface InputBoxProps extends ComponentPropsWithoutRef<typeof Input> {
  id: string;
  run: (input: string) => Promise<void>;
  placeholderFn: (loading: boolean) => string;
  initial?: () => Promise<void>;
}

const InputBox = forwardRef<ElementRef<typeof Input>, InputBoxProps>(({ className, ...props }, ref) => {
  const t = useTranslations();
  const setCommandMode = useStatusStore((state) => state.setCommandMode);
  const onChange = useDebounceFn(async (ev) => props.run(ev.target.value), 1000, [props.run]);
  const [loading, setLoading] = useState(!!props.initial);

  useEffect(() => {
    (async () => {
      if (props.initial) {
        await props.initial();
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Input
        id={props.id}
        type="text"
        disabled={loading}
        placeholder={props.placeholderFn(loading)}
        ref={ref}
        onChange={onChange}
        onKeyDown={(ev) => {
          if (ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey) {
            return;
          }

          const el = ev.target as HTMLInputElement;

          if (ev.key === "Enter") {
            props.run(el.value);
            onChange.cancel();
          } else if (ev.key === "Escape") {
            setCommandMode(undefined);
          }
        }}
      />
      <LoadingButton
        loading={loading}
        variant="outline"
        onClick={async () => props.run((document.getElementById(props.id) as HTMLInputElement).value)}
      >
        {t("Execute")}
      </LoadingButton>
    </div>
  );
});

InputBox.displayName = "InputBox";
export default InputBox;
