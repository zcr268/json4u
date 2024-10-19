import { toPath } from "@/lib/idgen";
import { getRawValue } from "@/lib/parser";
import { type SearchResult } from "@/lib/worker/stores/types";
import { useWorker } from "@/stores/editorStore";
import { useStatusStore } from "@/stores/statusStore";
import { useTree } from "@/stores/treeStore";
import { Hash, Type } from "lucide-react";
import { components, type OptionProps } from "react-select";
import SearchInput from "./SearchInput";

function Option(props: OptionProps<SearchResult>) {
  const tree = useTree();
  const { matchType, id } = props.data;
  const path = toPath(id);

  return (
    <components.Option {...props}>
      <div className="flex items-center gap-2">
        {matchType === "key" ? <Hash className="icon opacity-15" /> : <Type className="icon opacity-15" />}
        <div className="flex flex-col overflow-hidden">
          <div className="text-sm">{matchType === "key" ? path[path.length - 1] : getRawValue(tree.node(id))}</div>
          <div className="text-xs text-muted-foreground">{path.join(" > ")}</div>
        </div>
      </div>
    </components.Option>
  );
}

export default function ViewSearchInput() {
  const worker = useWorker()!;
  const setRevealId = useStatusStore((state) => state.setRevealId);

  return (
    <SearchInput
      search={(inputValue: string) => worker.searchInView(inputValue)}
      onChange={(option) => {
        if (option) {
          setRevealId(option.id);
        }
      }}
      Option={Option}
      placeholder={"search_json"}
      bindShortcut="F"
      openMenuOnClick={false}
    />
  );
}
