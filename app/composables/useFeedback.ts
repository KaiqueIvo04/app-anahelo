export type FeedbackType = "success" | "error" | "warning" | "info";

export function useFeedback() {
  const message = ref("");
  const type = ref<FeedbackType>("info");

  function show(msg: string, t: FeedbackType = "info") {
    message.value = msg;
    type.value = t;
  }

  function clear() {
    message.value = "";
  }

  return {
    message,
    type,
    show,
    clear,
  };
}
