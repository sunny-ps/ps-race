import { FC } from "react";
import { compose, reverse, tail } from "ramda";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface IRevenueDataFormProps {
  revData: any[];
}

const RevenueDataForm: FC<IRevenueDataFormProps> = ({ revData }) => {
  // remove the first and last rows, functionally
  const removeFirstAndLastRows = compose<any[], any[], any[], any[], any[]>(
    reverse,
    tail,
    reverse,
    tail
  );
  const handleSubmit = async () => {
    const modifiedRevData = removeFirstAndLastRows(revData);

    // checking if any industries are missing
    if (
      !modifiedRevData.every((elem) =>
        [
          "Financial Services",
          "Retail",
          "Growth Markets",
          "Public Sector",
          "Energy & Commodities",
        ].includes(elem[0])
      )
    ) {
      toast.error(
        "One or more industries are missing or is not specified properly"
      );
      return;
    }

    await toast.promise(
      fetch("/api/rev-data", {
        method: "PATCH",
        body: JSON.stringify({ revData: modifiedRevData }),
        headers: {
          "Content-type": "application/json",
        },
      }),
      {
        pending: "Updation in progress",
        success: "Data has been successfully updated",
        error: "There was an error",
      }
    );
  };

  return (
    <form
      className="flex flex-col justify-evenly mt-11 w-[30%] h-[200px]"
      onSubmit={handleSubmit}
    >
      <input
        type="submit"
        value="upload"
        className="text-gray-900 bg-[#F7BE38] hover:bg-[#F7BE38]/90 focus:ring-4
                focus:outline-none focus:ring-[#F7BE38]/50 font-medium text-sm px-5 py-2.5
                text-center"
      />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
      />
    </form>
  );
};

export default RevenueDataForm;
