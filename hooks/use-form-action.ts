import { useActionState, useCallback } from 'react';

type ActionResult = {
  success: boolean;
  data?: any;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

type ServerAction = (prevState: ActionResult, formData: FormData) => Promise<ActionResult>;

interface UseFormActionOptions {
  onSuccess?: () => void;
}

export function useFormAction(
  action: ServerAction,
  options?: UseFormActionOptions
) {
  const wrappedAction = useCallback(
    async (prevState: ActionResult, formData: FormData): Promise<ActionResult> => {
      const result = await action(prevState, formData);
      if (result.success && options?.onSuccess) {
        options.onSuccess();
      }
      return result;
    },
    [action, options?.onSuccess]
  );

  return useActionState(wrappedAction, { success: false });
}