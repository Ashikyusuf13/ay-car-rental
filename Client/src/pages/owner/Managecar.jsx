import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Managecar = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [editingCar, setEditingCar] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [filter, setFilter] = useState("all");

    const fetchCars = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("/api/owner/my-cars");
            if (data.success) {
                setCars(data.cars);
            } else {
                toast.error(data.message || "Failed to load cars");
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to load cars");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    const handleEdit = (car) => {
        setEditingCar(car._id);
        setEditForm({
            pricePerDay: car.pricePerDay,
            location: car.location,
            description: car.description || "",
        });
    };

    const handleCancelEdit = () => {
        setEditingCar(null);
        setEditForm({});
    };

    const handleSaveEdit = async (carId) => {
        try {
            setActionLoading(carId);
            const { data } = await axios.post("/api/owner/update-car", {
                carId,
                ...editForm
            });
            if (data.success) {
                toast.success("Car updated successfully!");
                setEditingCar(null);
                fetchCars();
            } else {
                toast.error(data.message || "Failed to update car");
            }
        } catch (error) {
            toast.error("Error updating car");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this car? This action cannot be undone.")) {
            return;
        }

        setActionLoading(id);
        try {
            const { data } = await axios.post("/api/owner/delete-car", { carId: id });
            if (data.success) {
                toast.success("Car deleted successfully");
                setCars(cars.filter((car) => car._id !== id));
            } else {
                toast.error(data.message || "Failed to delete car");
            }
        } catch (error) {
            console.log(error);
            toast.error("Error deleting car");
        } finally {
            setActionLoading(null);
        }
    };

    const handleToggleAvailability = async (car) => {
        try {
            setActionLoading(car._id);
            const { data } = await axios.post("/api/owner/toggle-availability", { carId: car._id });
            if (data.success) {
                toast.success(data.message);
                fetchCars();
            } else {
                toast.error(data.message || "Failed to update availability");
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to update availability");
        } finally {
            setActionLoading(null);
        }
    };

    const filteredCars = cars.filter(car => {
        if (filter === "all") return true;
        if (filter === "available") return car.isAvailable;
        if (filter === "booked") return !car.isAvailable;
        return true;
    });

    const filterOptions = [
        { value: "all", label: "All Cars", count: cars.length },
        { value: "available", label: "Available", count: cars.filter(c => c.isAvailable).length },
        { value: "booked", label: "Booked", count: cars.filter(c => !c.isAvailable).length },
    ];

    if (loading) {
        return (
            <div className="w-full flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading your cars...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Fleet Management</h1>
                <Link
                    to="/dashboard/Add-car"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-md w-full sm:w-auto text-center flex items-center justify-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Car
                </Link>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {filterOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => setFilter(option.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === option.value
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                            }`}
                    >
                        {option.label}
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${filter === option.value
                                ? "bg-white/20"
                                : "bg-gray-200 dark:bg-gray-600"
                            }`}>
                            {option.count}
                        </span>
                    </button>
                ))}
            </div>

            {filteredCars.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 md:p-12 text-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl md:text-4xl">🚗</span>
                    </div>
                    <h2 className="text-lg md:text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                        {filter === "all" ? "No cars in your fleet" : `No ${filter} cars`}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm md:text-base">
                        {filter === "all"
                            ? "Start by adding your first car to begin earning."
                            : `You don't have any ${filter} cars at the moment.`
                        }
                    </p>
                    {filter === "all" && (
                        <Link
                            to="/dashboard/Add-car"
                            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-colors"
                        >
                            Add Your First Car
                        </Link>
                    )}
                </div>
            ) : (
                <>
                    {/* Mobile Card View */}
                    <div className="block lg:hidden space-y-4">
                        {filteredCars.map((car) => (
                            <div
                                key={car._id}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
                            >
                                {/* Car Image */}
                                <div className="relative h-40 overflow-hidden">
                                    <img
                                        className="w-full h-full object-cover"
                                        src={car.image}
                                        alt={`${car.brand} ${car.model}`}
                                    />
                                    <div className="absolute top-3 right-3">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${car.isAvailable
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${car.isAvailable ? "bg-green-500" : "bg-red-500"}`}></span>
                                            {car.isAvailable ? "Available" : "Booked"}
                                        </span>
                                    </div>
                                </div>

                                {/* Car Info */}
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="font-bold text-lg text-gray-800 dark:text-white">
                                                {car.brand} {car.model}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {car.registerNumber || car._id.slice(-6).toUpperCase()}
                                            </p>
                                        </div>
                                        <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                                            ₹{car.pricePerDay?.toLocaleString()}/day
                                        </p>
                                    </div>

                                    {/* Specs */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300">
                                            {car.transmission}
                                        </span>
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300">
                                            {car.fuel_type}
                                        </span>
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300">
                                            {car.year}
                                        </span>
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300">
                                            {car.seating_capacity} seats
                                        </span>
                                    </div>

                                    {/* Edit Form */}
                                    {editingCar === car._id ? (
                                        <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl mb-4">
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Price/Day (₹)</label>
                                                <input
                                                    type="number"
                                                    value={editForm.pricePerDay}
                                                    onChange={(e) => setEditForm({ ...editForm, pricePerDay: Number(e.target.value) })}
                                                    className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Location</label>
                                                <input
                                                    type="text"
                                                    value={editForm.location}
                                                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                                    className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Description</label>
                                                <textarea
                                                    value={editForm.description}
                                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                    className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white text-sm resize-none"
                                                    rows={2}
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleSaveEdit(car._id)}
                                                    disabled={actionLoading === car._id}
                                                    className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                                >
                                                    {actionLoading === car._id ? "Saving..." : "Save"}
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="flex-1 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : null}

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleToggleAvailability(car)}
                                            disabled={actionLoading === car._id}
                                            className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-colors disabled:opacity-50 ${car.isAvailable
                                                    ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/40"
                                                    : "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40"
                                                }`}
                                        >
                                            {car.isAvailable ? "Set Unavailable" : "Set Available"}
                                        </button>
                                        <button
                                            onClick={() => handleEdit(car)}
                                            className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/40"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(car._id)}
                                            disabled={actionLoading === car._id}
                                            className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl transition-colors hover:bg-red-100 dark:hover:bg-red-900/40 disabled:opacity-50"
                                        >
                                            {actionLoading === car._id ? (
                                                <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-750 text-left border-b border-gray-100 dark:border-gray-700">
                                        <th className="py-5 px-6 font-semibold text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Vehicle</th>
                                        <th className="py-5 px-6 font-semibold text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Specs</th>
                                        <th className="py-5 px-6 font-semibold text-center text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Year</th>
                                        <th className="py-5 px-6 font-semibold text-right text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Rate/Day</th>
                                        <th className="py-5 px-6 font-semibold text-center text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Status</th>
                                        <th className="py-5 px-6 font-semibold text-center text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {filteredCars.map((car) => (
                                        <React.Fragment key={car._id}>
                                            <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center group">
                                                        <div className="relative overflow-hidden rounded-xl w-16 h-12 mr-4 shadow-sm">
                                                            <img
                                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                                                                src={car.image}
                                                                alt="car"
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-800 dark:text-white">{car.brand} {car.model}</p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">{car.registerNumber || car._id.slice(-6).toUpperCase()}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-sm">
                                                    <div className="text-gray-600 dark:text-gray-300">
                                                        <span className="block">{car.transmission}</span>
                                                        <span className="text-xs text-gray-400">{car.fuel_type}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-center text-gray-600 dark:text-gray-300 font-medium">
                                                    {car.year}
                                                </td>
                                                <td className="py-4 px-6 text-right font-bold text-gray-800 dark:text-white">
                                                    ₹{car.pricePerDay?.toLocaleString()}
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <button
                                                        onClick={() => handleToggleAvailability(car)}
                                                        disabled={actionLoading === car._id}
                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors disabled:opacity-50 ${car.isAvailable
                                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
                                                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
                                                            }`}
                                                    >
                                                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${car.isAvailable ? "bg-green-500" : "bg-red-500"}`}></span>
                                                        {car.isAvailable ? "Available" : "Booked"}
                                                    </button>
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <div className="flex items-center justify-center space-x-3">
                                                        <button
                                                            onClick={() => editingCar === car._id ? handleCancelEdit() : handleEdit(car)}
                                                            className={`p-2 rounded-lg transition-colors ${editingCar === car._id
                                                                    ? "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                                                                    : "text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                                }`}
                                                            title={editingCar === car._id ? "Cancel Edit" : "Edit"}
                                                        >
                                                            {editingCar === car._id ? (
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            ) : (
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(car._id)}
                                                            disabled={actionLoading === car._id}
                                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors dark:hover:bg-red-900/20 disabled:opacity-50"
                                                            title="Delete"
                                                        >
                                                            {actionLoading === car._id ? (
                                                                <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                                            ) : (
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {/* Edit Row */}
                                            {editingCar === car._id && (
                                                <tr className="bg-gray-50 dark:bg-gray-700/30">
                                                    <td colSpan={6} className="py-4 px-6">
                                                        <div className="flex flex-wrap gap-4 items-end">
                                                            <div className="flex-1 min-w-[150px]">
                                                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">Price/Day (₹)</label>
                                                                <input
                                                                    type="number"
                                                                    value={editForm.pricePerDay}
                                                                    onChange={(e) => setEditForm({ ...editForm, pricePerDay: Number(e.target.value) })}
                                                                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white text-sm"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-[150px]">
                                                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">Location</label>
                                                                <input
                                                                    type="text"
                                                                    value={editForm.location}
                                                                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                                                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white text-sm"
                                                                />
                                                            </div>
                                                            <div className="flex-[2] min-w-[200px]">
                                                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">Description</label>
                                                                <input
                                                                    type="text"
                                                                    value={editForm.description}
                                                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white text-sm"
                                                                />
                                                            </div>
                                                            <button
                                                                onClick={() => handleSaveEdit(car._id)}
                                                                disabled={actionLoading === car._id}
                                                                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                                            >
                                                                {actionLoading === car._id ? "Saving..." : "Save Changes"}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Managecar;
