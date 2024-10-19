import { useEffect, useRef, useState, type ComponentType } from "react";
import { useCallback } from "react";
import LoadingIcon from "@/components/ui/LoadingIcon";
import { type MessageKey } from "@/global";
import { useWorker } from "@/stores/editorStore";
import debounce from "debounce-promise";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  components,
  type OptionsOrGroups,
  type GroupBase,
  type OptionProps,
  type ControlProps,
  InputProps,
} from "react-select";
import Select from "react-select/async";

const height = 28;

interface SearchInputProps<T> {
  search: (inputValue: string) => Promise<OptionsOrGroups<T, GroupBase<T>>>;
  onChange: (option: T | null) => void;
  Option: ComponentType<OptionProps<T, false>>;
  placeholder?: MessageKey;
  openMenuOnClick?: boolean;
  isDisabled?: boolean;
  bindShortcut?: "K" | "F";
}

export default function SearchInput<T extends { label: string }>({
  search,
  onChange,
  openMenuOnClick,
  placeholder,
  bindShortcut,
  Option,
}: SearchInputProps<T>) {
  const t = useTranslations();
  const worker = useWorker()!;
  const loadOptions = useCallback(debounce(search, 100, { leading: true }), [worker]);

  const selectRef = useRef(null);
  const [inputValue, setInputValue] = useState("");

  // Toggle the menu when ⌘ + bindShortcut is pressed
  useEffect(() => {
    if (bindShortcut) {
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === bindShortcut.toLowerCase() && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          e.stopPropagation();
          (selectRef.current as any)?.focus();
          inputValue && (selectRef.current as any)?.inputRef.select();
        }
      };

      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }
  }, [bindShortcut]);

  return (
    <Select<T>
      className="w-command"
      ref={selectRef}
      isDisabled={!worker}
      openMenuOnClick={!!inputValue || openMenuOnClick}
      openMenuOnFocus={!!inputValue || openMenuOnClick}
      cacheOptions
      defaultOptions
      loadOptions={loadOptions}
      placeholder={t(placeholder ?? "")}
      noOptionsMessage={() => t("no_results_found")}
      // prevent clear input value: https://github.com/JedWatson/react-select/issues/4675
      onChange={(option) => {
        setInputValue(option?.label ?? "");
        onChange(option);
      }}
      inputValue={inputValue}
      onInputChange={(inputValue, { action }) => {
        if (action === "input-change") {
          setInputValue(inputValue);
        }
      }}
      onFocus={() => {
        inputValue && (selectRef.current as any)?.inputRef.select();
      }}
      controlShouldRenderValue={false}
      // from https://github.com/JedWatson/react-select/issues/1322#issuecomment-436615179
      styles={{
        control: (base) => ({
          ...base,
          minHeight: height,
        }),
        dropdownIndicator: (base) => ({
          ...base,
          padding: 4,
        }),
        clearIndicator: (base) => ({
          ...base,
          padding: 4,
        }),
        valueContainer: (base) => ({
          ...base,
          padding: "0px 6px",
        }),
        input: (base) => ({
          ...base,
          margin: 0,
          padding: 0,
        }),
        placeholder: (base) => ({
          ...base,
          // text-xs
          fontSize: "0.75rem",
          lineHeight: "1rem",
        }),
        loadingMessage: (base) => ({
          ...base,
          fontSize: "0.875rem",
        }),
        noOptionsMessage: (base) => ({
          ...base,
          fontSize: "0.875rem",
        }),
        option: (base) => ({
          ...base,
          padding: "4px 6px",
        }),
      }}
      components={{
        Control,
        Option,
        Input,
        LoadingIndicator,
        IndicatorSeparator: null,
        DropdownIndicator: bindShortcut
          ? () => (
              <div className="flex items-center justify-center">
                <kbd className="text-xs search-cmd-kbd mr-2">{`⌘ ${bindShortcut}`}</kbd>
              </div>
            )
          : openMenuOnClick
            ? components.DropdownIndicator
            : null,
      }}
    />
  );
}

function Control<T>({ children, ...props }: ControlProps<T>) {
  return (
    <components.Control {...props}>
      <Search className="icon opacity-50 ml-2" />
      {children}
    </components.Control>
  );
}

function LoadingIndicator() {
  return <LoadingIcon className="icon opacity-50" loading={true} />;
}

function Input<T>(props: InputProps<T>) {
  return <components.Input {...props} isHidden={false} />;
}
