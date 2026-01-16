import { useState, useEffect } from "react";

interface UseMailFilterProps {
    type: string;
    config: any;
    mails: any[];
    onFilterApply?: (filters: any) => void;
}

export const useMailFilter = ({ type, config, mails, onFilterApply }: UseMailFilterProps) => {
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [categories, setCategories] = useState<{ label: string, value: string }[]>([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [status, setStatus] = useState("");
    const [destination, setDestination] = useState("");
    const [viewStatus, setViewStatus] = useState("");
    const [validationStatus, setValidationStatus] = useState<string>('');

    // Fetch categories on mount or type change
    useEffect(() => {
        const fetchCats = async () => {
            const res = await config.getCategories();
            if (res?.ok && res?.data?.data && Array.isArray(res.data.data)) {
                setCategories(res.data.data.map((c: any) => ({ label: c.name, value: String(c.id) })));
            }
        };
        fetchCats();
    }, [type, config]);

    // Reset filters when type changes
    useEffect(() => {
        setStartDate("");
        setEndDate("");
        setSelectedCategory("");
        setStatus("");
        setDestination("");
        setViewStatus("");
    }, [type, mails]);

    const handleApplyFilter = () => {
        const filters: any = {};
        if (startDate) filters.start_date = startDate;
        if (endDate) filters.end_date = endDate;
        if (selectedCategory) filters.category_id = selectedCategory;
        if (status) filters.status = status;
        if (destination) filters.destination = destination;
        if (viewStatus) filters.user_view_id = viewStatus;

        onFilterApply?.(filters);
        setShowFilterModal(false);
    };

    const handleResetFilter = () => {
        setStartDate("");
        setEndDate("");
        setSelectedCategory("");
        setStatus("");
        setDestination("");
        setViewStatus("");
        onFilterApply?.({});
        setShowFilterModal(false);
    };

    return {
        showFilterModal,
        setShowFilterModal,
        categories,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        selectedCategory,
        setSelectedCategory,
        status,
        setStatus,
        destination,
        setDestination,
        viewStatus,
        setViewStatus,
        validationStatus,
        setValidationStatus,
        handleApplyFilter,
        handleResetFilter
    };
};
