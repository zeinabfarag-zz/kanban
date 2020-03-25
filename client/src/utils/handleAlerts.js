import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure({
  position: "bottom-right"
});

const handleError = err => {
  let message = "";
  switch (err) {
    case "Email not found":
      message =
        "The email address that you've entered doesn't match any account. Please sign up.";
      break;
    case "Email already exists":
      message = "This email address is already in use.";
      break;
    case "Password is incorrect":
      message =
        "The password that you've entered is incorrect. Please try again.";
      break;
    case "Dashboard does not exist":
      message = "The Dashboard does not exist. Please try again.";
      break;
    case "Failed to move the task":
      message = "We could not save the task index. Please try again.";
      break;
    case "Failed to move task to the column":
      message = "We could not save the task to the column. Please try again.";
      break;
    case "Failed to move the column":
      message = "We could not save the column index. Please try again.";
      break;
    case "Failed to add column":
      message = "We could not add the column index. Please try again.";
      break;
    case "Please Enter dashboard title":
      message = "We could not create a dashboard. Please try again.";
      break;
    case "cannot access":
      message = "URL is invalid";
      break;
    default:
      message =
        "We're experiencing a problem with our server. Sorry for the inconvenience. Please try again later.";
      break;
  }

  return toast.error(message);
};

const handleSuccess = message => {
  return toast.success(message, { autoClose: 2000 });
};

export { handleError, handleSuccess };
