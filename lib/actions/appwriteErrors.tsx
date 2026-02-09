import { ERROR_MESSAGES } from "@/constants/appointment";
const HandleAppwriteError = (error: any): { error: string; code: string } => {
  if (error.code === 409 || error.type === "document_already_exists") {
    return {
      error: ERROR_MESSAGES.RACE_CONDITION,
      code: "RACE_CONDITION_CONFLICT",
    };
  }

  if (
    error.code === "document_invalid_structure" &&
    error.message?.includes("unique")
  ) {
    return {
      error: ERROR_MESSAGES.ALREADY_BOOKED,
      code: "RACE_CONDITION_CONFLICT",
    };
  }
  return {
    error: ERROR_MESSAGES.CREATION_FAILED,
    code: "CREATION_FAILED",
  };
};

export default HandleAppwriteError;
