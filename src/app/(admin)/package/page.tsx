"use client";

import { useEffect, useState } from "react";
import { Inter, Montserrat, Questrial } from "next/font/google";
import { getPackages } from "@/lib/api/package";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

export const questrial = Questrial({
  subsets: ["latin"],
  weight: ["400"], 
  variable: "--font-questrial",
});

export default function DashboardPagee(){

    const [packages, setPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPackages() {
            try {
                const data = await getPackages();
                setPackages(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchPackages();
    }, []);

    return (
        <div className={montserrat.className}>
            <div className="p-5">
                <div className="flex flex-col gap-y-10">
                    {/* judul */}
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col">
                            <span className="text-2xl font-semibold">Package</span>
                            <span className="text-sm">manage all wedding packages available on your website.</span>
                        </div>
                        <span>
                             <Link
                                href="/package/create"
                                className="flex text-sm items-center gap-2 rounded-lg bg-[#394322] px-4 py-2 text-white transition hover:opacity-90"
                            >
                                <FiPlus size={18} />
                                Create Package
                            </Link>
                        </span>
                    </div>

                    {/* section content*/}
                    <div>   
                        <div className="">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">
                                    List Paket
                                </h2>
                            </div>

                            <div className="mt-6 overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b text-left text-sm uppercase text-gray-500">
                                            <th className="pb-4">Package</th>
                                            <th className="pb-4">Price</th>
                                            <th className="pb-4">Status</th>
                                            <th className="pb-4">Sort</th>
                                            <th className="pb-4 text-center">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="py-10 text-center"
                                                >
                                                    Loading...
                                                </td>
                                            </tr>
                                        ) : packages.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="py-10 text-center"
                                                >
                                                    No package found
                                                </td>
                                            </tr>
                                        ) : (
                                            packages.map((item) => (
                                                <tr
                                                    key={item.ID}
                                                    className="border-b"
                                                >
                                                    <td className="py-4">
                                                        {item.Name}
                                                    </td>

                                                    <td>
                                                        Rp{" "}
                                                        {item.PriceFrom.toLocaleString("id-ID")}
                                                    </td>

                                                    <td>
                                                        {item.IsActive ? "Active": "Inactive"}
                                                    </td>

                                                    <td>
                                                        {item.SortOrder}
                                                    </td>

                                                    <td className="text-center">
                                                        <Link
                                                            href={`/package/edit/${item.ID}`}
                                                            className="text-gray-600 hover:underline"
                                                        >
                                                            Edit
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}