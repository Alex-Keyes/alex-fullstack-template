import { toaster } from "@/components/ui/toaster"

export const useCustomToast = () => {
  const showSuccessToast = (options: string | { title?: string, description?: string }) => {
    const title = typeof options === 'string' ? "Success!" : (options.title || "Success!")
    const description = typeof options === 'string' ? options : options.description

    toaster.create({
      title,
      description,
      type: "success",
    })
  }

  const showErrorToast = (options: string | { title?: string, description?: string }) => {
    const title = typeof options === 'string' ? "Something went wrong!" : (options.title || "Something went wrong!")
    const description = typeof options === 'string' ? options : options.description

    toaster.create({
      title,
      description,
      type: "error",
    })
  }

  return { showSuccessToast, showErrorToast }
}

export default useCustomToast
