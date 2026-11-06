import axios from "axios";

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      return "The evaluation service rejected the request. Check the API authorization configuration and try again.";
    }

    if (status === 404) {
      return "The requested evaluation data could not be found.";
    }

    if (status === 429) {
      return "The evaluation service is receiving too many requests. Wait a moment and try again.";
    }

    if (status && status >= 500) {
      return "The evaluation service is currently unavailable. Try again shortly.";
    }

    if (!error.response) {
      return "The evaluation service could not be reached. Check the network connection and API base URL.";
    }

    return `The evaluation request failed with status ${status}.`;
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "An unexpected error occurred while loading evaluation data.";
}

export function getApiErrorTitle(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Service unreachable";
    }

    if (error.response.status === 401 || error.response.status === 403) {
      return "Authorization failed";
    }

    if (error.response.status === 404) {
      return "Evaluation data not found";
    }
  }

  return "Unable to load evaluation data";
}
