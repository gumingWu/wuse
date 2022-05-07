import type { MaybeRef } from "@wuse/shared";

export type UseTitleOptions = {
  titleTemplate?: string;
};

export function useTitle(
  newTitle: MaybeRef<string | null | undefined> = null,
  options: UseTitleOptions = {}
) {
  const { titleTemplate } = options;
  console.log(newTitle, titleTemplate);
}

export type UseTitleReturn = ReturnType<typeof useTitle>;
