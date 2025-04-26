import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import useDashboardData from "../../hooks/useDashboardData";
import ProfileOverview from "../../components/general/ProfileOverview";
import LoadingSpinner from "../../components/general/LoadingSpinner";
import Modal from "../../components/general/Modal"
import EditProfile from "../../components/forms/EditProfile";

const SolicitorProfilePage = () => {
    const { user } = useAuth();
    const { data, loading, refetch } = useDashboardData(user);
    const [showEdit, setShowEdit] = useState(false);

    if (loading) return <LoadingSpinner title="Profile" />;

    const clientId = data?.clients?.[0]?.mentor_id;

    const handleEditSubmit = async (formData) => {
        console.log("Client profile form submitted", formData);
        setShowEdit(false);
        refetch();
    }

    return (
        <>
            <ProfileOverview
                role="client"
                data={data}
                onEdit={() => setShowEdit(true)}
            />
            <Modal
                isOpen={showEdit}
                onClose={() => setShowEdit(false)}
                title="Edit Client Profile"
            >
                <EditProfile
                    role="client"
                    data={data}
                    onCancel={() => setShowEdit(false)}
                    onSubmit={handleEditSubmit}
                    id={clientId}
                />
            </Modal>
        </>
    );
};

export default SolicitorProfilePage;
