import { useState, FormEvent, FC } from "react";
import { compose, reverse, tail } from "ramda";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface IRevenueDataFormProps {
  revData: any[];
}

const RevenueDataForm: FC<IRevenueDataFormProps> = ({ revData }) => {
  const [selectedOption, setSelectedOption] = useState<"quarter" | "fullyear">(
    "quarter"
  );

  // remove the first and last rows, functionally
  const removeFirstAndLastRows = compose<any[], any[], any[], any[], any[]>(
    reverse,
    tail,
    reverse,
    tail
  );

  const handleOptionChange = (event: FormEvent<HTMLSelectElement>) => {
    setSelectedOption(event.currentTarget.value as "quarter" | "fullyear");

    if (event.currentTarget.value === "fullyear")
      toast.warning(
        "Selecting 'Full year', will change the Quarter text in the race page to Full Year. If this intended, please ignore this warning"
      );
  };

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
      className="flex flex-col justify-between place-items-center w-[40%] h-[200px]"
      onSubmit={handleSubmit}
    >
      <div className="flex items-center">
        <label htmlFor="data-option" className="mr-2">
          Data is for
        </label>
        <select
          name="data-option"
          className="px-1 py-2"
          value={selectedOption}
          onChange={(e) => handleOptionChange(e)}
        >
          <option value="quarter">Current quarter</option>
          <option value="fullyear">Full year</option>
        </select>
      </div>

      <input
        type="submit"
        value="Upload"
        className="w-1/2 text-gray-900 bg-[#F7BE38] hover:brightness-95 focus:ring-4
                focus:outline-none focus:ring-[#F7BE38]/50 font-medium text-sm py-4
                text-center"
      />

      <ToastContainer
        position="top-center"
        autoClose={5000}
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
