import { useState, FormEvent, FC } from "react";
import { compose, reverse, tail } from "ramda";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { RevenueStatus } from "@types";

interface IRevenueDataFormProps {
  revData: any[];
}

const RevenueDataForm: FC<IRevenueDataFormProps> = ({ revData }) => {
  const [selectedOption, setSelectedOption] =
    useState<RevenueStatus>("quarter");

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
          onChange={(e) =>
            setSelectedOption(e.currentTarget.value as RevenueStatus)
          }
        >
          <option value="quarter">Current quarter</option>
          <option value="fullyear">Full year</option>
        </select>
      </div>

      {selectedOption === "fullyear" && (
        <div className="p-4 bg-yellow-400 rounded-md">
          Selecting &apos;Full year&apos;, will change the Quarter text in the
          race page to Full Year. If this intended, please ignore this warning
        </div>
      )}

      <input
        type="submit"
        value="Upload"
        className="w-48 text-slate-100 bg-green-600 hover:brightness-95 focus:ring-4
                focus:outline-none focus:ring-[#F7BE38]/50 font-medium text-md py-3
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
