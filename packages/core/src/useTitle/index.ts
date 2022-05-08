import { ref, watch } from "vue-demi";
import { isString, type MaybeRef } from "@wuse/shared";
import { defaultDocument, type ConfigurableDocument } from "../_configurable";

export interface UseTitleOptions extends ConfigurableDocument {
  titleTemplate?: string;
}

export function useTitle(
  newTitle: MaybeRef<string | null | undefined> = null,
  options: UseTitleOptions = {}
) {
  const { document = defaultDocument, titleTemplate = "%s" } = options;
  const title = ref(newTitle ?? document?.title ?? null);

  watch(
    title,
    (t, o) => {
      if (isString(t) && t !== o && document)
        document.title = titleTemplate.replace("%s", t);
    },
    { immediate: true }
  );

  return title;
}

export type UseTitleReturn = ReturnType<typeof useTitle>;
