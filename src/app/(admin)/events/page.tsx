"use client";

import { useEffect, useState } from "react";
import { Inter, Montserrat, Questrial } from "next/font/google";
import { getEvents } from "@/lib/api/event";
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

    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState<any[]>([])
    const [packageNames, setPackageNames] = useState<Record<string, string>>({})
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        async function fetchEvents() {
            try {
                const [eventsData, packagesData] = await Promise.all([
                    getEvents(),
                    getPackages(),
                ]);

                const packageMap = (Array.isArray(packagesData) ? packagesData : []).reduce(
                    (acc: Record<string, string>, pkg: any) => {
                        const packageId = pkg.ID ?? pkg.id;
                        const packageName = pkg.Name ?? pkg.name ?? pkg.title;

                        if (packageId) {
                            acc[packageId] = packageName || "-";
                        }

                        return acc;
                    },
                    {}
                );

                setEvents(Array.isArray(eventsData) ? eventsData : []);
                setPackageNames(packageMap);
                setErrorMessage("");
            } catch (error: any) {
                console.error(error);
                setErrorMessage(error?.message || "Failed to load events.");
            } finally {
                setLoading(false);
            }
        }

        fetchEvents();
    }, []);

    function formatEventDate(value: string) {
        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    }

    return (
        <div className={montserrat.className}>
            <div className="p-5">
                <div className="flex flex-col gap-y-10">
                    {/* judul */}
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col">
                            <span className="text-2xl font-semibold">Events Schedule</span>
                            <span className="text-sm">manage all wedding events available on your website.</span>
                        </div>
                        <span>
                             <Link
                                href="/events/create"
                                className="flex text-sm items-center gap-2 rounded-lg bg-[#394322] px-4 py-2 text-white transition hover:opacity-90"
                            >
                                <FiPlus size={18} />
                                Create Event
                            </Link>
                        </span>
                    </div>

                    {/* section content*/}
                    <div>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">
                                List Event
                            </h2>
                        </div>
                        <div className="mt-6 overflow-x-auto">
                            <table className="w-full">
                                {/* head */}
                                <thead>
                                    <tr className="border-b text-left text-sm uppercase text-gray-500">
                                        <th className="pb-4">Couple Name</th>
                                        <th className="pb-4">Event Date</th>
                                        <th className="pb-4">Location</th>
                                        <th className="pb-4">Package</th>
                                        <th className="pb-4">Action</th>
                                    </tr>
                                </thead>
                                {/* body */}
                                <tbody>
                                    {
                                        loading ? (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="py-10 text-center"
                                                >
                                                    Loading
                                                </td>
                                            </tr>
                                        ) : errorMessage ? (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="py-10 text-center text-red-600"
                                                >
                                                    {errorMessage}
                                                </td>
                                            </tr>
                                        ) : events.length === 0 ?(
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="py-10 text-center"
                                                >
                                                    No events found
                                                </td>
                                            </tr>
                                        ) : (
                                            events.map((item) => {
                                                return (
                                                    <tr
                                                        key={item.id}
                                                        className="border-b"
                                                    >
                                                        <td className="py-5">
                                                            {item.couple_name}
                                                        </td>
                                                        <td className="py-5">
                                                            {formatEventDate(item.event_date)}
                                                        </td>
                                                        <td className="py-5">
                                                            {item.location}
                                                        </td>
                                                        <td className="py-5">
                                                            {packageNames[item.package_id] || "-"}
                                                        </td>
                                                        <td className="text-center">
                                                            <Link
                                                                href={`/events/edit?id=${item.id}`}
                                                                className="text-gray-600 hover:underline"
                                                            >
                                                                Edit
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}
