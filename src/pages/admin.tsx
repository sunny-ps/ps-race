import { ChangeEvent, useState, useRef } from "react";
import type { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { read, utils } from "xlsx";

import { RevenueDataForm } from "@components";
import { useUpdateEffect } from "@hooks";

const Admin = () => {
  const [data, setData] = useState<any[]>([]);

  const fileRef = useRef<Blob>();

  useUpdateEffect(() => {}, [fileRef]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    fileRef.current = event.target.files![0] ?? fileRef.current;

    const reader = new FileReader();
    reader.onload = (e) => {
      /* Parse data */
      const ab = e.target?.result;
      const workBook = read(ab, { type: "array" });
      /* Get first worksheet */
      const workSheetName = workBook.SheetNames[0];
      const workSheet = workBook.Sheets[workSheetName];
      /* Convert array of arrays */
      const data = utils.sheet_to_json(workSheet, {
        header: 1,
        raw: false,
        blankrows: false,
      });
      /* Update state */
      setData(data as any[]);
    };

    reader.readAsArrayBuffer(fileRef.current);
  }

  return (
    <div className="grid place-items-center font-sans bg-slate-100 min-h-screen">
      <div>
        <h1>Upload a new xlsx file</h1>
        <input
          type="file"
          className="text-sm text-grey-500 file:mr-5 file:py-2 file:px-6 file:border-0 file:text-sm 
            file:font-medium file:bg-[#4b6bfb] file:text-white hover:file:cursor-pointer
            hover:file:bg-[#0a36fa]"
          onChange={handleChange}
        />
      </div>

      {data.length !== 0 && (
        <>
          <table className="revenue-table mt-3 text-black border-[#b0b0b0] border-b">
            <thead>
              <tr>
                {data[0]?.map((item: string[], idx: number) => (
                  <th key={idx}>{item}</th>
                ))}
              </tr>
            </thead>
            {/* some styles are applied in globals.css for readability */}
            <tbody>
              {data.slice(1, data.length).map((item, idx) => (
                <tr key={idx} className="revenue-rows">
                  <td className="px-4">{item[0]}</td>
                  {item
                    .slice(1, item.length)
                    .map((dataItem: number, _idx: number) => (
                      <td key={_idx}>{dataItem}</td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
          <RevenueDataForm revData={data} />
        </>
      )}
    </div>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { req } = ctx;

  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: "/signin",
      },
    };
  }

  return {
    props: {},
  };
}

export default Admin;
